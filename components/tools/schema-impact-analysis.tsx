"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Table } from "./schema-visualizer";

type ImpactLevel = "High" | "Medium" | "Low";

interface ImpactAnalysis {
  affectedTables: string[];
  cascadeDepth: number;
  impactLevel: ImpactLevel;
  description: string;
}

export default function SchemaImpactAnalysis({ schema }: { schema: Table[] }) {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [impact, setImpact] = useState<ImpactAnalysis | null>(null);

  const analyzeImpact = (table: string, column: string): ImpactAnalysis => {
    const affectedTables = new Set<string>();
    const queue = [{ table, column, depth: 0 }];
    let maxDepth = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.depth > maxDepth) maxDepth = current.depth;

      schema.forEach((t) => {
        t.columns.forEach((col) => {
          if (
            col.foreignKey &&
            col.foreignKey.table === current.table &&
            col.foreignKey.column === current.column
          ) {
            if (!affectedTables.has(t.name)) {
              affectedTables.add(t.name);
              queue.push({
                table: t.name,
                column: col.name,
                depth: current.depth + 1,
              });
            }
          }
        });
      });
    }

    const impactLevel: ImpactLevel =
      affectedTables.size > 5
        ? "High"
        : affectedTables.size > 2
        ? "Medium"
        : "Low";

    return {
      affectedTables: Array.from(affectedTables),
      cascadeDepth: maxDepth,
      impactLevel,
      description: `Modifying this column will affect ${affectedTables.size} table(s) with a maximum cascade depth of ${maxDepth}.`,
    };
  };

  const handleColumnSelect = (column: string) => {
    setSelectedColumn(column);
    if (selectedTable && column) {
      setImpact(analyzeImpact(selectedTable, column));
    }
  };

  return (
    <div className="space-y-4">
      <Select onValueChange={setSelectedTable}>
        <SelectTrigger>
          <SelectValue placeholder="Select a table" />
        </SelectTrigger>
        <SelectContent>
          {schema.map((table) => (
            <SelectItem key={table.name} value={table.name}>
              {table.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedTable && (
        <Select onValueChange={handleColumnSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select a column" />
          </SelectTrigger>
          <SelectContent>
            {schema
              .find((t) => t.name === selectedTable)
              ?.columns.map((column) => (
                <SelectItem key={column.name} value={column.name}>
                  {column.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}
      {impact && (
        <Card>
          <CardHeader>
            <CardTitle>Impact Analysis</CardTitle>
            <CardDescription>
              Analysis for {selectedTable}.{selectedColumn}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert
              variant={
                impact.impactLevel === "High"
                  ? "destructive"
                  : impact.impactLevel === "Medium"
                  ? "default"
                  : "success"
              }
            >
              {impact.impactLevel === "High" && (
                <AlertCircle className="h-4 w-4" />
              )}
              {impact.impactLevel === "Medium" && (
                <AlertTriangle className="h-4 w-4" />
              )}
              {impact.impactLevel === "Low" && (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <AlertTitle>Impact Level: {impact.impactLevel}</AlertTitle>
              <AlertDescription>{impact.description}</AlertDescription>
            </Alert>
            <div className="mt-4">
              <h4 className="font-semibold">Affected Tables:</h4>
              <ul className="list-disc list-inside">
                {impact.affectedTables.map((table) => (
                  <li key={table}>{table}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
