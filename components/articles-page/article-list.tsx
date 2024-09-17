"use client";

import type { Article } from "@/lib/types";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ArticlesCard from "../home/article-card";
import { getArticles } from "@/lib/actions";
import { toast } from "sonner";

type ArticleListProps = {
  initialArticles: Article[];
  initialNextItems: number | null;
};

export default function ArticleList({
  initialArticles,
  initialNextItems,
}: ArticleListProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [nextItems, setNextItems] = useState(initialNextItems);
  const [isLoading, setIsLoading] = useState(false);

  // Intersection Observer
  const [ref, inView] = useInView();

  const loadNext = async () => {
    if (nextItems !== null && !isLoading) {
      setIsLoading(true);
      try {
        const newArticles = await getArticles(nextItems);
        if (newArticles.error) return toast.error(newArticles.error);
        setArticles((prev) => [...prev, ...newArticles.articles]);
        setNextItems(newArticles.nextItems);
      } catch (error: any) {
        console.log("Something went wrong while fetching", error?.message);
        toast.error("Something went wrong while fetching");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (inView && nextItems !== null && !isLoading) {
      loadNext();
    }
  }, [inView, isLoading, nextItems]);

  console.log(articles.length, "length");
  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <ArticlesCard key={article.id} article={article} />
      ))}
      {nextItems && (
        <div ref={ref} className="col-span-full flex justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-muted-foreground/80"></div>
        </div>
      )}
    </div>
  );
}
