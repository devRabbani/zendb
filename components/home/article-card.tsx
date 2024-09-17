import { Article } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import moment from "moment";

export default function ArticlesCard({ article }: { article: Article }) {
  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2 space-y-1.5">
        <CardDescription>
          <p className="text-[0.8rem] leading-snug">
            {" "}
            {moment(article.published).format("MMM Do YYYY")}
          </p>
        </CardDescription>
        <CardTitle>
          <a
            href={article.link}
            className="text-[1.1rem] leading-normal font-medium line-clamp-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {article.title}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-[0.92rem] leading-normal">
          {article.content}
        </p>
      </CardContent>
    </Card>
  );
}
