"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Mermaid from "./mermaid";

type Table = {
  name: string;
  columns: {
    name: string;
    type: string;
    foreignKey?: { table: string; column: string };
  }[];
};

export default function ForeignKeyVisualizer2() {
  const [schema, setSchema] = useState("");
  const [parsedSchema, setParsedSchema] = useState<Table[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mermaidCode, setMermaidCode] = useState<string>("");

  const parseSchema = (input: string): Table[] => {
    try {
      const tables = input.split("\n\n").map((tableStr) => {
        const [tableName, ...columnStrs] = tableStr.split("\n");
        const columns = columnStrs.map((colStr) => {
          const [name, type, ...fkParts] = colStr.trim().split(" ");
          const column: Table["columns"][0] = { name, type };
          if (fkParts.length > 0) {
            const [, fkTable, fkColumn] =
              fkParts.join(" ").match(/REFERENCES (\w+)$$(\w+)$$/) || [];
            if (fkTable && fkColumn) {
              column.foreignKey = { table: fkTable, column: fkColumn };
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

  const generateMermaidCode = (tables: Table[]): string => {
    let code = "erDiagram\n";
    tables.forEach((table) => {
      table.columns.forEach((column) => {
        if (column.foreignKey) {
          code += `${table.name} ||--o{ ${column.foreignKey.table} : "${column.name}"\n`;
        }
      });
    });
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
          <CardTitle>Foreign Key Visualizer</CardTitle>
          <CardDescription>
            Enter your database schema to visualize foreign key relationships
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
          {mermaidCode && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Visualization</h3>
              <Mermaid chart={mermaidCode} />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleVisualize}>Visualize</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
