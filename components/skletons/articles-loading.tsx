import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticlesLoading({ v2 }: { v2?: boolean }) {
  return (
    <div className={v2 ? "space-y-5" : "space-y-4"}>
      {Array.from({ length: 5 }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

const ArticleCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-5 space-y-4">
        <Skeleton className="w-32 h-3 rounded-xl shadow" />
        <Skeleton className="w-2/4 h-5 rounded shadow" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="w-full h-3.5 rounded-xl shadow" />
        <Skeleton className="w-3/4 h-3.5 rounded-xl shadow" />
      </CardContent>
    </Card>
  );
};
