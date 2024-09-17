import QueryComplexityEstimator from "@/components/tools/query-estimator";
import ToolsLayout from "@/components/tools/tools-layout";
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
