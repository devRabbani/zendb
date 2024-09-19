import NormalizationTool from "@/components/tools/normalization-tool";
import ToolsLayout from "@/components/tools/tools-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Normalization | ZenDB",
  description:
    "Simplify the process of normalizing your database. This tool assists in organizing your data into efficient structures while eliminating redundancy and ensuring consistency.",
};

export default function NormalizationPage() {
  return (
    <ToolsLayout
      pageName="Normalization"
      header="Database Normalization Made Easy"
      para="Simplify the process of normalizing your database. This tool assists in organizing your data into efficient structures while eliminating redundancy and ensuring consistency."
    >
      <NormalizationTool />
    </ToolsLayout>
  );
}
