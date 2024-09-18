import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { RESOURCES } from "@/lib/constants";
import { Badge } from "../ui/badge";

export default function LearningResources() {
  return (
    <div className="">
      <h2 className="font-semibold mb-4 text-lg border-b pb-1.5">
        Learning Resources
      </h2>
      <ScrollArea className="">
        <div className="flex gap-5 w-max pb-6 pl-1.5 pt-1.5 pr-3">
          {RESOURCES.map((resource, index) => (
            <Card
              key={index}
              className="hover:shadow-md w-96 transition-all duration-300"
            >
              <CardHeader className="pb-2">
                <div className="flex gap-3 mb-1">
                  {resource.tags.map((tag) => (
                    <Badge
                      className="text-[0.8rem]"
                      variant="outline"
                      key={tag}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-lg font-medium line-clamp-2">
                  <a
                    href={resource.link}
                    className="text-[1.1rem] leading-normal font-medium line-clamp-2 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resource.title}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-[0.92rem] leading-normal">
                  {resource.short_description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="cursor-pointer" />
      </ScrollArea>
    </div>
  );
}
