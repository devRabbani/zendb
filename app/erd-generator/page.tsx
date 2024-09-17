import ERDGenerator from "@/components/tools/erd-generator";
import ToolsLayout from "@/components/tools/tools-layout";

export default function ERDGeneratorPage() {
  return (
    <ToolsLayout
      pageName="ERD Generator"
      header="Generate ER Diagrams"
      para="Quickly generate ER diagrams using either a Prisma schema or simple text-based schema. Visualize your database structure and relationships with ease."
    >
      <ERDGenerator />
    </ToolsLayout>
  );
}
