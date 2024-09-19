import IndexAnalyzer from "@/components/tools/index-analyzer";
import ToolsLayout from "@/components/tools/tools-layout";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Index Analyzer | ZenDB",
  description:
    "Evaluate and improve the performance of your database indexes. This tool helps you discover bottlenecks and suggests ways to streamline your indexing strategy.",
};

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
