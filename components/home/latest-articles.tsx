import { buttonVariants } from "../ui/button";
import Link from "next/link";
import ArticlesCard from "./article-card";
import { getArticles } from "@/lib/actions";

import { Suspense } from "react";
import ArticlesLoading from "../skletons/articles-loading";

export default function LatestArticles() {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg border-b pb-1.5">
        Latest Articles on DB
      </h2>
      <Suspense fallback={<ArticlesLoading />}>
        <LatestArticlesList />
      </Suspense>
    </div>
  );
}

const LatestArticlesList = async () => {
  const results = await getArticles(0, 5);

  await new Promise((resolve) => setTimeout(resolve, 3000));

  if (!results.articles.length)
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <p className="text-muted-foreground">No articles found.</p>
      </div>
    );
  return (
    <>
      <div className="space-y-4">
        {results.articles.map((article, index) => (
          <ArticlesCard key={index} article={article} />
        ))}
      </div>
      <Link
        className={buttonVariants({
          variant: "outline",
          className: "mx-auto w-24 text-center !block",
        })}
        href="/articles"
      >
        See All
      </Link>
    </>
  );
};
