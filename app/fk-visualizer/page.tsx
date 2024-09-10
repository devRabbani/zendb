import ToolpageHeader from "@/components/toolpage-header";
import Component from "@/components/tools/er-diagram";
import ForeignKeyVisualizer from "@/components/tools/fk-visualizer";
import ForeignKeyVisualizer2 from "@/components/tools/fk-visualizer2";

export default function FkVisualizer() {
  return (
    <div className="">
      <ToolpageHeader
        header="Visualize Foreign Key Relationships"
        para="Explore your database’s foreign key relationships with this intuitive visualizer. See how tables are connected and ensure referential integrity across your schema."
      />
      <Component />
    </div>
  );
}
