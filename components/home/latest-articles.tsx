import { buttonVariants } from "../ui/button";
import Link from "next/link";
import ArticlesCard from "./article-card";
import { getArticles } from "@/lib/actions";

export default async function LatestArticles() {
  const results = await getArticles(0, 5);
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg border-b pb-1.5">
        Latest Articles about DB
      </h2>
      {results.articles.length ? (
        <>
          <div className="space-y-3.5">
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
      ) : (
        <div className="flex flex-col items-center justify-center h-48">
          <p className="text-muted-foreground">No articles found.</p>
        </div>
      )}
    </div>
  );
}
