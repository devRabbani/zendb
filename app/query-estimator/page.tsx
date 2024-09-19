import QueryComplexityEstimator from "@/components/tools/query-estimator";
import ToolsLayout from "@/components/tools/tools-layout";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Query Estimator | ZenDB",
  description:
    "Get an instant estimate of your query’s complexity. This tool helps predict performance and suggests optimizations for faster query execution.",
};

export default function QueryEstimator() {
  return (
    <>
      <ToolsLayout
        pageName="Query Estimator"
        header="Estimate Query Complexity"
        para="Get an instant estimate of your query’s complexity. This tool helps predict performance and suggests optimizations for faster query execution."
      >
        <QueryComplexityEstimator />
      </ToolsLayout>
    </>
  );
}
