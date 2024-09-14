"use client";

import { useState, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Info, Table } from "lucide-react";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import ForceGraph2D from "react-force-graph-2d";
import CodeEditor from "./code-editor";
import CardWrapper from "../card-wrapper";
import { Label } from "../ui/label";
import SchemaHelperPopup from "./schema-helper-popup";
import { toast } from "sonner";
import { parseSchemaConstraints } from "@/lib/tools-utils";
import { TableConstraint } from "@/lib/types";
import NormalizationSuggestion from "./normalization-suggestion";
import NormalizationEditor from "./normalization-editor";

type Dependency = {
  determinant: string[];
  dependent: string[];
};

export default function NormalizationTool() {
  const [tables, setTables] = useState<TableConstraint[]>([
    {
      name: "User",
      columns: [
        {
          name: "id",
          type: "Int",
          constraints: ["Primary", "Key"],
        },
        {
          name: "name",
          type: "Text",
          constraints: [],
        },
        {
          name: "email",
          type: "Text",
          constraints: ["Unique"],
        },
        {
          name: "password_hash",
          type: "Text",
          constraints: [],
        },
        {
          name: "created_at",
          type: "DateTime",
          constraints: [],
        },
        {
          name: "updated_at",
          type: "DateTime",
          constraints: [],
        },
      ],
    },
    {
      name: "Post",
      columns: [
        {
          name: "id",
          type: "Int",
          constraints: ["Primary", "Key"],
        },
        {
          name: "user_id",
          type: "Int",
          constraints: ["Foreign", "Key", "references", "User", "id"],
        },
        {
          name: "title",
          type: "Text",
          constraints: [],
        },
        {
          name: "body",
          type: "Text",
          constraints: [],
        },
        {
          name: "created_at",
          type: "DateTime",
          constraints: [],
        },
        {
          name: "updated_at",
          type: "DateTime",
          constraints: [],
        },
      ],
    },
    {
      name: "Comment",
      columns: [
        {
          name: "id",
          type: "Int",
          constraints: ["Primary", "Key"],
        },
        {
          name: "post_id",
          type: "Int",
          constraints: ["Foreign", "Key", "references", "Post(id)"],
        },
        {
          name: "user_id",
          type: "Int",
          constraints: ["Foreign", "Key", "references", "User(id)"],
        },
        {
          name: "body",
          type: "Text",
          constraints: [],
        },
        {
          name: "created_at",
          type: "DateTime",
          constraints: [],
        },
        {
          name: "updated_at",
          type: "DateTime",
          constraints: [],
        },
      ],
    },
  ]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [dependencies, setDependencies] = useState<Dependency[]>([]);

  // const analyzeNormalization = async (values: string) => {
  //   setIsAnalyzing(true);
  //   setError(null);
  //   setSuggestions([]);

  //   try {
  //     const parsedTables = parseTableStructure(values);
  //     setTables(parsedTables);

  //     const newSuggestions: Suggestion[] = [];
  //     const newDependencies: Dependency[] = [];

  //     parsedTables.forEach((table) => {
  //       // 1NF Check
  //       const multiValueColumns = table.columns.filter(
  //         (col) =>
  //           col.type.toLowerCase().includes("array") ||
  //           col.type.toLowerCase().includes("json")
  //       );
  //       if (multiValueColumns.length > 0) {
  //         newSuggestions.push({
  //           type: "1NF",
  //           message: `Table ${table.name}: Potential 1NF violation detected.`,
  //           severity: "high",
  //           details: `Consider splitting columns ${multiValueColumns
  //             .map((c) => c.name)
  //             .join(", ")} into separate tables to achieve atomic values.`,
  //         });
  //       }

  //       // 2NF Check
  //       const potentialKeys = table.columns.filter(
  //         (col) =>
  //           col.name.toLowerCase().includes("id") ||
  //           col.constraints.includes("PRIMARY KEY")
  //       );
  //       if (potentialKeys.length > 1) {
  //         newSuggestions.push({
  //           type: "2NF",
  //           message: `Table ${table.name}: Potential 2NF violation detected.`,
  //           severity: "medium",
  //           details: `Multiple potential keys detected. Ensure all non-key attributes are fully functionally dependent on the entire primary key, not just a part of it.`,
  //         });
  //       }

  //       // 3NF and BCNF Check
  //       const nonKeyColumns = table.columns.filter(
  //         (col) => !potentialKeys.includes(col)
  //       );
  //       if (nonKeyColumns.length > 5) {
  //         newSuggestions.push({
  //           type: "3NF",
  //           message: `Table ${table.name}: Potential 3NF or BCNF violation detected.`,
  //           severity: "medium",
  //           details: `Large number of non-key attributes. Check for transitive dependencies and ensure every non-prime attribute is non-transitively dependent on every key.`,
  //         });
  //       }

  //       // 4NF Check (simplified)
  //       const potentialMultiValuedDependencies = nonKeyColumns.filter(
  //         (col) =>
  //           col.name.toLowerCase().includes("list") ||
  //           col.name.toLowerCase().includes("array")
  //       );
  //       if (potentialMultiValuedDependencies.length > 0) {
  //         newSuggestions.push({
  //           type: "4NF",
  //           message: `Table ${table.name}: Potential 4NF violation detected.`,
  //           severity: "low",
  //           details: `Columns ${potentialMultiValuedDependencies
  //             .map((c) => c.name)
  //             .join(
  //               ", "
  //             )} might represent multi-valued dependencies. Consider further normalization.`,
  //         });
  //       }

  //       // Simulate functional dependencies for visualization
  //       potentialKeys.forEach((key) => {
  //         nonKeyColumns.forEach((col) => {
  //           newDependencies.push({
  //             determinant: [key.name],
  //             dependent: [col.name],
  //           });
  //         });
  //       });
  //     });

  //     setSuggestions(newSuggestions);
  //     setDependencies(newDependencies);
  //     setGraphData(generateGraphData(parsedTables, newDependencies));
  //   } catch (err) {
  //     setError(
  //       "Failed to parse table structure. Please check your input format."
  //     );
  //   } finally {
  //     setIsAnalyzing(false);
  //   }
  // };

  // const generateGraphData = (tables: Table[], dependencies: Dependency[]) => {
  //   const nodes = tables.flatMap((table) => [
  //     { id: table.name, group: 1, label: table.name },
  //     ...table.columns.map((col) => ({
  //       id: `${table.name}.${col.name}`,
  //       group: 2,
  //       label: col.name,
  //     })),
  //   ]);

  //   const links = [
  //     ...tables.flatMap((table) =>
  //       table.columns.map((col) => ({
  //         source: table.name,
  //         target: `${table.name}.${col.name}`,
  //         value: 1,
  //       }))
  //     ),
  //     ...dependencies.flatMap((dep) =>
  //       dep.dependent.flatMap((d) =>
  //         dep.determinant.map((det) => ({
  //           source: det,
  //           target: d,
  //           value: 2,
  //         }))
  //       )
  //     ),
  //   ];

  //   return { nodes, links };
  // };

  const handleSetTable = (value: TableConstraint[]) => setTables(value);
  console.log(tables);
  return (
    <div className="space-y-7">
      <NormalizationEditor saveTable={handleSetTable} />
      {tables.length > 0 && (
        <Tabs defaultValue="suggestions">
          <TabsList>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          </TabsList>
          <TabsContent value="suggestions">
            <NormalizationSuggestion parsedTables={tables} />
          </TabsContent>
          <TabsContent value="visualization">
            <div style={{ height: "600px" }}>
              <ForceGraph2D
                graphData={graphData}
                nodeLabel="label"
                nodeColor={(node) => (node.group === 1 ? "#ff6b6b" : "#4ecdc4")}
                linkColor={(link) => (link.value === 1 ? "#45b7d1" : "#f9d56e")}
                linkDirectionalArrowLength={3}
                linkDirectionalArrowRelPos={1}
                linkCurvature={0.25}
              />
            </div>
          </TabsContent>
          <TabsContent value="dependencies">
            <h3 className="text-lg font-semibold mb-4">
              Functional Dependencies
            </h3>
            <ul className="space-y-2">
              {dependencies.map((dep, index) => (
                <li key={index} className="p-2 bg-gray-900 rounded">
                  {dep.determinant.join(", ")} → {dep.dependent.join(", ")}
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
