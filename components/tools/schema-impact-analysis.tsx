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
import { ImpactAnalysis, Table } from "@/lib/types";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { analyzeImpact } from "@/lib/tools-utils";

export default function SchemaImpactAnalysis({ schema }: { schema: Table[] }) {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [impact, setImpact] = useState<ImpactAnalysis | null>(null);

  const handleColumnSelect = (column: string) => {
    setSelectedColumn(column);
    if (selectedTable && column) {
      setImpact(analyzeImpact(selectedTable, column, schema));
    }
  };

  return (
    <Card className="min-h-[500px]">
      <CardHeader>
        <CardTitle>Schema Impact Analysis</CardTitle>
        <CardDescription>
          Overview of Schema Changes and Their Effects
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="table">Table</Label>
            <Select onValueChange={setSelectedTable}>
              <SelectTrigger id="table">
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
          </div>
          {selectedTable && (
            <div className="space-y-2">
              <Label htmlFor="column">Column</Label>
              <Select onValueChange={handleColumnSelect}>
                <SelectTrigger id="column">
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
            </div>
          )}{" "}
        </div>
        {impact && (
          <Card>
            <CardHeader>
              <CardTitle>Impact Analysis</CardTitle>
              <CardDescription>
                Analysis for{" "}
                <strong>
                  {selectedTable} ({selectedColumn})
                </strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert
                variant={
                  impact.impactLevel === "High"
                    ? "destructive"
                    : impact.impactLevel === "Medium"
                    ? "medium"
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

              <div className="mt-6 space-y-3">
                <h4 className="font-semibold">Affected Tables:</h4>
                {impact.affectedTables.length ? (
                  <div className="flex gap-3 flex-wrap">
                    {impact.affectedTables.map((table) => (
                      <Badge
                        variant="secondary"
                        className="text-sm"
                        key={table}
                      >
                        {table}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground/80 text-sm">
                    No Table will be affected
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
