import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function ArticlesCard({ article }: { article: any }) {
  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-medium line-clamp-2">
          {article.title}
        </CardTitle>
        <CardDescription>
          {article.author} - {article.date}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
