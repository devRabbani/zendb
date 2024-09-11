import ToolpageHeader from "@/components/toolpage-header";
import ERDGenerator from "@/components/tools/erd-generator";

export default function ERDGeneratorPage() {
  return (
    <>
      <ToolpageHeader
        header="Generate ER Diagrams"
        para="Quickly generate ER diagrams using either a Prisma schema or simple text-based schema. Visualize your database structure and relationships with ease."
      />
      <ERDGenerator />
    </>
  );
}
