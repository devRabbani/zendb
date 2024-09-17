import SchemaVisualizer from "@/components/tools/schema-visualizer";
import ToolsLayout from "@/components/tools/tools-layout";

export default function SchemaVisualizerPage() {
  return (
    <ToolsLayout
      pageName="Schema Visualizer"
      header="Visualize Database Schema"
      para="Get a comprehensive overview of your entire database schema. This tool helps you visualize the relationships between tables, fields, and keys to ensure optimal structure and design."
    >
      <SchemaVisualizer />
    </ToolsLayout>
  );
}
