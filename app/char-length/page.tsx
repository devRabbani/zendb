import CharLength from "@/components/tools/char-length";
import ToolsLayout from "@/components/tools/tools-layout";

export default function CharLengthHelperPage() {
  return (
    <ToolsLayout
      pageName="Char Length"
      header="Optimize Character Lengths"
      para="Ensure your database fields are using optimal character lengths. This tool helps you identify and adjust field lengths to save space and improve performance."
    >
      <CharLength />
    </ToolsLayout>
  );
}
