"use server";

import Parser from "rss-parser";
import { RSS_FEEDS } from "../constants";
import { franc } from "franc-min";
import { Article } from "../types";
import { unstable_cache } from "next/cache";
import { createHash } from "crypto";
import { Octokit } from "@octokit/rest";
import { headers } from "next/headers";

const parser = new Parser();

const getIp = () => {
  const forwardedFor = headers().get("x-forwarded-for");
  const realIp = headers().get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) return realIp.trim();

  return "0.0.0.0";
};

const detectEnglish = (text: string) => {
  const detect = franc(text, { minLength: 1 });
  return detect === "eng";
};

const generateArticleId = (title: string): string => {
  const normalizedTitle = title.toLowerCase().replace(/\s+/g, " ").trim();
  return createHash("md5").update(normalizedTitle).digest("hex");
};

const truncateContent = (content: string, maxLength: number = 200): string => {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + "...";
};

const parseRSSFeed = async (
  rssUrl: string
): Promise<Parser.Output<Parser.Item>> => {
  try {
    return await parser.parseURL(rssUrl);
  } catch (error) {
    console.error(`Error parsing RSS feed ${rssUrl}:`, error);
    return { items: [] } as Parser.Output<Parser.Item>;
  }
};

const parseRSSFeeds = async () => {
  const rssFeedsPromises = RSS_FEEDS.map(parseRSSFeed);
  const rssFeeds = await Promise.allSettled(rssFeedsPromises);
  const uniqueArticles = new Map<string, Article>();

  rssFeeds.forEach((result, i) => {
    if (result.status === "fulfilled") {
      const feed = result.value;
      feed.items.forEach((item) => {
        const articleContent = `${item.title} ${
          item.contentSnippet?.slice(0, 200) || ""
        }`;
        if (detectEnglish(articleContent)) {
          const articleId = generateArticleId(item.title!);
          if (!uniqueArticles.has(articleId)) {
            uniqueArticles.set(articleId, {
              title: item.title!,
              link: item.link!,
              content: truncateContent(item.contentSnippet || ""),
              published: new Date(item.pubDate || item.isoDate || "").getTime(),
              id: articleId,
            });
          }
        }
      });
    } else {
      console.log("Error parsing the rss feed", RSS_FEEDS[i], result.reason);
    }
  });
  return Array.from(uniqueArticles.values()).sort(
    (a, b) => b.published - a.published
  );
};

const CACHE_DURATION = 60 * 60 * 8; // 8 hours

export const getArticles = async (
  currentItems: number = 0,
  pageSize: number = 10
): Promise<{
  articles: Article[];
  nextItems: number | null;
  error?: string;
}> => {
  const ip = getIp();

  return await unstable_cache(
    async () => {
      try {
        const parsedArticles = await parseRSSFeeds();
        const hasNextPage = currentItems + pageSize < parsedArticles.length;

        return {
          articles: parsedArticles.slice(currentItems, currentItems + pageSize),
          nextItems: hasNextPage ? currentItems + pageSize : null,
        };
      } catch (error) {
        console.error("Error fetching articles:", error);
        return {
          articles: [],
          nextItems: null,
          error: "Failed to fetch articles. Please try again later.",
        };
      }
    },
    [`articles-${ip}-${currentItems}-${pageSize}`],
    {
      revalidate: CACHE_DURATION,
      tags: [`articles-${ip}-${currentItems}-${pageSize}`],
    }
  )();
};

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const getTips = async (): Promise<string[]> => {
  const ip = getIp();

  return await unstable_cache(
    async () => {
      try {
        const { data } = await octokit.repos.getContent({
          owner: "devRabbani",
          repo: "db-tips",
          path: "tips.md",
        });

        if ("content" in data) {
          const content = Buffer.from(data.content, "base64").toString("utf-8");
          const lines = content.split("\n");
          const tips = lines
            .filter((line) => line.trim().startsWith("-"))
            .map((line) => line.trim().replace("- ", ""));

          const uniqueTips = Array.from(new Set(tips));
          const latestTips = uniqueTips.slice(-20);
          return latestTips;
        }
        return [];
      } catch (error) {
        console.error("Error fetching tips:", error);
        return [];
      }
    },
    [`tips-${ip}`],
    {
      revalidate: CACHE_DURATION,
      tags: [`tips-${ip}`],
    }
  )();
};
