import toolNames from "@/lib/tools-utils/tool-names";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ToolsShowcase() {
  return (
    <div>
      <h3 className="font-semibold mb-4 text-lg border-b pb-1.5">Our tools</h3>
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {toolNames.map((tool) => (
          <Link
            href={tool.path}
            key={tool.path}
            className={cn(
              buttonVariants({
                variant: "secondary",
              }),
              "bg-card hover:bg-secondary/60 border py-5 sm:py-4 dark:bg-secondary dark:hover:bg-secondary/80"
            )}
          >
            {<tool.icon className="mr-2 flex-shrink-0" />} {tool.name}
          </Link>
        ))}
      </section>
    </div>
  );
}
