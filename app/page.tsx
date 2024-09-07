import ToolpageHeader from "@/components/toolpage-header";
import CharLength from "@/components/tools/char-length";

export default function HomePage() {
  return (
    <div className="space-y-5">
      <ToolpageHeader
        header="Optimize Character Lengths"
        para="Ensure your database fields are using optimal character lengths. This tool helps you identify and adjust field lengths to save space and improve performance."
      />
      <CharLength />
    </div>
  );
}
