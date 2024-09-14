import type { Table, TableConstraint } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ForceGraph2D from "react-force-graph-2d";
import {
  generateFDGraph,
  getFunctionalDependencies,
} from "@/lib/tools-utils/functional-dependency";
import MermaidGraph from "./mermaid-graph";

export default function SchemaGraph3d({
  schema,
}: {
  schema: TableConstraint[];
}) {
  const res = getFunctionalDependencies(schema);
  const generateMermaidDiagram = () => {
    let diagram = "graph TD\n";

    res.forEach((fd, index) => {
      const tableName = fd.table.split(" -> ")[0];
      const determinants = fd.determinant.join(", ");
      const nodeId = `${tableName}_${determinants}_${fd.dependent}`.replace(
        /\s+/g,
        "_"
      );

      diagram += `    ${nodeId}["${tableName}: ${determinants} → ${fd.dependent}"]\n`;

      if (fd.type === "inter-table") {
        const [sourceTable, targetTable] = fd.table.split(" -> ");
        const sourceNodeId = `${sourceTable}_node`;
        const targetNodeId = `${targetTable}_node`;

        diagram += `    ${sourceNodeId}["${sourceTable}"]\n`;
        diagram += `    ${targetNodeId}["${targetTable}"]\n`;
        diagram += `    ${sourceNodeId} --> ${nodeId}\n`;
        diagram += `    ${nodeId} --> ${targetNodeId}\n`;
      }
    });

    return diagram;
  };
  // const graph = generateFDGraph(res);

  const graph = generateMermaidDiagram();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schema Visualization</CardTitle>
        <CardDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis ratione
          culpa distinctio eveniet velit doloribus tempore tempora assumenda
          pariatur! Quos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MermaidGraph chart={graph} />
      </CardContent>
    </Card>
  );
}
