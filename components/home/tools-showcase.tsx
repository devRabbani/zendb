import toolNames from "@/lib/tools-utils/tool-names";
import { Button } from "../ui/button";

export default function ToolsShowcase() {
  return (
    <div>
      <h3 className="font-semibold mb-4 text-lg border-b pb-1.5">Our tools</h3>
      <section className="grid grid-cols-4 gap-3">
        {toolNames.map((tool) => (
          <Button key={tool.path} variant="secondary" className="border">
            {<tool.icon className="mr-2" />} {tool.name}
          </Button>
        ))}
      </section>

      {/* <h2 className="font-semibold mb-4 text-lg border-b pb-1.5">Our tools</h2>
      <section className="grid grid-cols-3 gap-3">
        {toolNames.map((tool) => (
          <Button
            key={tool.path}
            variant="outline"
            className="flex flex-col h-auto py-3.5 gap-2 items-center justify-center"
          >
            {<tool.icon className="h-6 w-6" />} {tool.fullname || tool.name}
          </Button>
        ))}
      </section> */}
    </div>
  );
}
