import ToolpageHeader from "@/components/toolpage-header";
import NormalizationTool from "@/components/tools/normalization-tool";

export default function NormalizationPage() {
  return (
    <>
      <ToolpageHeader
        header="Database Normalization Made Easy"
        para="Simplify the process of normalizing your database. This tool assists in organizing your data into efficient structures while eliminating redundancy and ensuring consistency."
      />
      <NormalizationTool />
    </>
  );
}
