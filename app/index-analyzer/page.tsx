import IndexAnalyzer from "@/components/tools/index-analyzer";
import ToolsLayout from "@/components/tools/tools-layout";

export default function IndexAnalyzerPage() {
  return (
    <ToolsLayout
      pageName="Index Analyzer"
      header="Analyze Index Efficiency"
      para="Evaluate and improve the performance of your database indexes. This tool helps you discover bottlenecks and suggests ways to streamline your indexing strategy."
    >
      <IndexAnalyzer />
    </ToolsLayout>
  );
}
