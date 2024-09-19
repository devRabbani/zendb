import ToolsLayout from "@/components/tools/tools-layout";
import TypeOptimizer from "@/components/tools/type-optimizer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Type Optimizer | ZenDB",
  description:
    "Select the most efficient data types for your columns. This tool provides recommendations to optimize storage and query speed based on your dataset.",
};

export default function TypeOptimizerPage() {
  return (
    <ToolsLayout
      pageName="Type Optimizer"
      header="Optimize Data Types"
      para="Select the most efficient data types for your columns. This tool provides recommendations to optimize storage and query speed based on your dataset."
    >
      <TypeOptimizer />
    </ToolsLayout>
  );
}
