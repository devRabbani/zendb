import ToolpageHeader from "@/components/toolpage-header";

export default function QueryEstimator() {
  return (
    <div className="">
      <ToolpageHeader
        header="Estimate Query Complexity"
        para="Get an instant estimate of your query’s complexity. This tool helps predict performance and suggests optimizations for faster query execution."
      />
      {/* <QueryComplexityEstimator /> */}
    </div>
  );
}
