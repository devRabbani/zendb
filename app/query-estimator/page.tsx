import ToolpageHeader from "@/components/toolpage-header";
import QueryComplexityEstimator from "@/components/tools/query-estimator";

export default function QueryEstimator() {
  return (
    <>
      <ToolpageHeader
        header="Estimate Query Complexity"
        para="Get an instant estimate of your query’s complexity. This tool helps predict performance and suggests optimizations for faster query execution."
      />
      <QueryComplexityEstimator />
    </>
  );
}
