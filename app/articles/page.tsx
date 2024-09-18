import ArticleList from "@/components/articles-page/article-list";
import { getArticles } from "@/lib/actions";

export default async function ArticlesPage() {
  const results = await getArticles(0, 10);

  if (!results.articles.length)
    return (
      <p className="text-sm font-medium text-center mt-32 text-muted-foreground/80">
        No articles found, Try Again after some time
      </p>
    );

  return (
    <ArticleList
      initialArticles={results.articles}
      initialNextItems={results.nextItems}
    />
  );
}
