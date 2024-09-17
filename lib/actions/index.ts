"use server";

import Parser from "rss-parser";
import { RSS_FEEDS } from "../constants";
import { franc } from "franc-min";
import { Article } from "../types";
import { unstable_cache } from "next/cache";
import { createHash } from "crypto";

const parser = new Parser();

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

const CACHE_DURATION = 60 * 60 * 24; // 24 hours

export const getArticles = unstable_cache(
  async (currentItems: number = 0, pageSize: number = 10) => {
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
  ["articles"],
  {
    revalidate: CACHE_DURATION,
    tags: ["articles"],
  }
);
