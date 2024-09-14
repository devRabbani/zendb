import type { FunctionalDependency } from "@/lib/types";
import { generateFDMermaid } from "@/lib/tools-utils/functional-dependency";
import MermaidGraph from "./mermaid-graph";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FDDirectiveDiagram({
  dependencies,
}: {
  dependencies: FunctionalDependency[];
}) {
  const [graph, setGraph] = useState("");

  const handleGraph = () => {
    try {
      const res = generateFDMermaid(dependencies);
      setGraph(res);
    } catch (error: any) {
      console.log(error?.message);
      toast.error("Error while generating FD Diagram");
    }
  };

  useEffect(() => {
    handleGraph();
  }, [dependencies]);

  return <MermaidGraph chart={graph} title="FD Visualization" />;
}
