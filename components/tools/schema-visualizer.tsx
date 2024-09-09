"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import TableStatistics from "./table-statistics";
import SchemaComplexity from "./schema-complexity";
import SchemaImpactAnalysis from "./schema-impact-analysis";
import SchemaSuggestions from "./schema-suggestion";
import Mermaid from "./mermaid";

export type Column = {
  name: string;
  type: string;
  foreignKey?: { table: string; column: string };
};

export type Table = {
  name: string;
  columns: Column[];
};

export default function SchemaVisualizer() {
  const [schema, setSchema] = useState("");
  const [parsedSchema, setParsedSchema] = useState<Table[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mermaidCode, setMermaidCode] = useState<string>("");

  const parseSchema = (input: string): Table[] => {
    try {
      const foreignKeyRegex = /REFERENCES\s+(\w+)\s*(?:\((\w+)\)|(\w+))/i;

      const tables = input
        .trim()
        .split(/\n{2,}/)
        .map((tableStr) => {
          const [tableName, ...columnStrs] = tableStr.split("\n");

          const columns = columnStrs.map((colStr) => {
            const [name, type, ...fkParts] = colStr.trim().split(" ");
            const column: Column = { name, type };

            if (fkParts.length > 0) {
              const match = fkParts.join(" ").match(foreignKeyRegex) || [];
              if (match) {
                const [, fkTable, fkColumnInParens, fkColumnNoParens] = match;
                const fkColumn = fkColumnInParens || fkColumnNoParens;

                if (fkTable && fkColumn) {
                  column.foreignKey = { table: fkTable, column: fkColumn };
                }
              }
            }
            return column;
          });
          return { name: tableName.trim(), columns };
        });
      return tables;
    } catch (err) {
      throw new Error("Invalid schema format. Please check your input.");
    }
  };

  //   const generateMermaidCode = (tables: Table[]): string => {
  //     let code = "erDiagram\n";
  //     tables.forEach((table) => {
  //       table.columns.forEach((column) => {
  //         if (column.foreignKey) {
  //           code += `${table.name} ||--o{ ${column.foreignKey.table} : "${column.name}"\n`;
  //         }
  //       });
  //     });
  //     console.log(code);
  //     return code;
  //   };

  const generateMermaidCode = (tables: Table[]): string => {
    let code = "erDiagram\n";

    tables.forEach((table) => {
      code += `    ${table.name} {\n`;
      table.columns.forEach((column) => {
        code += `        ${column.type} ${column.name}\n`;
      });
      code += "    }\n\n";
    });

    tables.forEach((t) => {
      t.columns
        .filter((col) => col.foreignKey)
        .forEach((rel) => {
          if (rel.foreignKey) {
            code += `    ${t.name} }|--|| ${rel.foreignKey.table} : "${rel.foreignKey.column}"\n`;
          }
        });
    });

    // console.log(code, "asss", tables);

    return code;
  };

  const handleVisualize = () => {
    try {
      const tables = parseSchema(schema);
      setParsedSchema(tables);
      const mermaid = generateMermaidCode(tables);
      setMermaidCode(mermaid);
      setError(null);
    } catch (err) {
      setError(err.message);
      setParsedSchema([]);
      setMermaidCode("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Advanced Foreign Key Visualizer</CardTitle>
          <CardDescription>
            Enter your database schema to visualize and analyze foreign key
            relationships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter your schema here..."
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            className="h-64 mb-4"
          />
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button onClick={handleVisualize} className="mb-4">
            Visualize and Analyze
          </Button>
          {parsedSchema.length > 0 && (
            <Tabs defaultValue="erd">
              <TabsList>
                <TabsTrigger value="erd">ERD</TabsTrigger>
                <TabsTrigger value="stats">Table Statistics</TabsTrigger>
                <TabsTrigger value="complexity">Schema Complexity</TabsTrigger>

                <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>
              <TabsContent value="erd">
                <Mermaid chart={mermaidCode} />
              </TabsContent>
              <TabsContent value="stats">
                <TableStatistics schema={parsedSchema} />
              </TabsContent>
              <TabsContent value="complexity">
                <SchemaComplexity schema={parsedSchema} />
              </TabsContent>
              <TabsContent value="impact">
                <SchemaImpactAnalysis schema={parsedSchema} />
              </TabsContent>
              <TabsContent value="suggestions">
                <SchemaSuggestions schema={parsedSchema} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
