import ToolpageHeader from "@/components/toolpage-header";
import SchemaVisualizer from "@/components/tools/schema-visualizer";

export default function SchemaVisualizerPage() {
  return (
    <div className="">
      <ToolpageHeader
        header="Visualize Database Schema"
        para="Get a comprehensive overview of your entire database schema. This tool helps you visualize the relationships between tables, fields, and keys to ensure optimal structure and design."
      />
      <SchemaVisualizer />
    </div>
  );
}
