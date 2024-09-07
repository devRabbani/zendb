import ToolpageHeader from "@/components/toolpage-header";
import TypeOptimizer from "@/components/tools/type-optimizer";

export default function TypeOptimizerPage() {
  return (
    <div className="">
      <ToolpageHeader
        header="Optimize Data Types"
        para="Select the most efficient data types for your columns. This tool provides recommendations to optimize storage and query speed based on your dataset."
      />
      <TypeOptimizer />
    </div>
  );
}
