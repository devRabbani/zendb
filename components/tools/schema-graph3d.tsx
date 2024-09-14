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

    const tables = new Set<string>();
    const relations = new Set<string>();
    const fdMap = new Map<string, string[]>();

    // Collect data
    res.forEach((fd) => {
      const tableName = fd.table.split(" -> ")[0].toLowerCase();
      tables.add(tableName);

      if (fd.type === "intra-table") {
        if (!fdMap.has(tableName)) {
          fdMap.set(tableName, []);
        }
        fdMap
          .get(tableName)!
          .push(`${fd.determinant.join(", ")} → ${fd.dependent}`);
      } else if (fd.type === "inter-table") {
        const [sourceTable, targetTable] = fd.table.toLowerCase().split(" -> ");
        relations.add(
          `${sourceTable} -->|${fd.determinant.join(", ")}| ${targetTable}`
        );
      }
    });

    // Add table nodes
    tables.forEach((table) => {
      diagram += `    ${table}["${
        table.charAt(0).toUpperCase() + table.slice(1)
      }"]\n`;
    });

    // Add functional dependencies
    tables.forEach((table) => {
      if (fdMap.has(table)) {
        diagram += `    subgraph ${table}_FD[${
          table.charAt(0).toUpperCase() + table.slice(1)
        }_FDs]\n`;
        diagram += `        ${table}_fd["${fdMap.get(table)!.join(", ")}"]\n`;
        diagram += "    end\n";
        diagram += `    ${table} --> ${table}_FD\n`;
      }
    });

    // Add relations between tables
    relations.forEach((relation) => {
      diagram += `    ${relation}\n`;
    });

    return diagram;
  };
  const graph = generateMermaidDiagram();
  console.log(graph);
  return <MermaidGraph chart={graph} title="FD Visualization" />;
}
