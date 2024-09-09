"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Table } from "./schema-visualizer";

interface Suggestion {
  type: "warning" | "improvement" | "good";
  message: string;
  details: string;
  impact: "High" | "Medium" | "Low";
  affectedTables: string[];
}

export default function SchemaSuggestions({ schema }: { schema: Table[] }) {
  const [openSuggestions, setOpenSuggestions] = useState<number[]>([]);

  const toggleSuggestion = (index: number) => {
    setOpenSuggestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const analyzeSchemaSuggestions = (schema: Table[]): Suggestion[] => {
    const suggestions: Suggestion[] = [];

    // Check for tables without primary keys
    schema.forEach((table) => {
      if (!table.columns.some((col) => col.name.toLowerCase() === "id")) {
        suggestions.push({
          type: "warning",
          message: `Table ${table.name} is missing a primary key`,
          details:
            'Add an "id" column as the primary key for better indexing and relationships. Consider using an auto-incrementing integer or a UUID.',
          impact: "High",
          affectedTables: [table.name],
        });
      }
    });

    // Check for potential many-to-many relationships
    const manyToManyTables = new Set<string>();
    schema.forEach((table) => {
      const foreignKeys = table.columns.filter((col) => col.foreignKey);
      if (foreignKeys.length === 2 && table.columns.length <= 3) {
        manyToManyTables.add(table.name);
        suggestions.push({
          type: "improvement",
          message: `Table ${table.name} might represent a many-to-many relationship`,
          details:
            "Consider if this junction table is the best way to represent this relationship. Ensure it has a composite primary key of both foreign key columns.",
          impact: "Medium",
          affectedTables: [
            table.name,
            ...foreignKeys.map((item) => item.foreignKey!.table),
          ],
        });
      }
    });

    // Check for tables with too many columns
    schema.forEach((table) => {
      if (table.columns.length > 20) {
        suggestions.push({
          type: "warning",
          message: `Table ${table.name} has a high number of columns (${table.columns.length})`,
          details:
            "Consider if some of these columns can be grouped into a separate table to improve maintainability and query performance.",
          impact: "Medium",
          affectedTables: [table.name],
        });
      }
    });

    // Check for potential denormalization
    const columnCounts: { [key: string]: string[] } = {};
    schema.forEach((table) => {
      table.columns.forEach((col) => {
        if (!col.foreignKey) {
          if (!columnCounts[col.name]) columnCounts[col.name] = [];
          columnCounts[col.name].push(table.name);
        }
      });
    });
    Object.entries(columnCounts).forEach(([colName, tables]) => {
      if (
        tables.length > 1 &&
        !["id", "created_at", "updated_at", "createdAt", "updatedAt"].includes(
          colName.toLowerCase()
        )
      ) {
        suggestions.push({
          type: "improvement",
          message: `Column "${colName}" appears in ${tables.length} tables`,
          details:
            "This might indicate denormalization. Consider if this data can be centralized in a single table and referenced by others to reduce data redundancy.",
          impact: "Medium",
          affectedTables: tables,
        });
      }
    });

    // Check for missing indexes on foreign keys
    schema.forEach((table) => {
      table.columns.forEach((col) => {
        if (col.foreignKey && !col.name.toLowerCase().endsWith("_id")) {
          suggestions.push({
            type: "improvement",
            message: `Foreign key column "${col.name}" in table "${table.name}" might need an index`,
            details:
              'Consider adding an index to this foreign key column to improve query performance. Also, consider renaming it to end with "_id" for consistency.',
            impact: "Medium",
            affectedTables: [table.name],
          });
        }
      });
    });

    // Check for potential circular dependencies
    const checkCircularDependencies = (
      startTable: string,
      currentTable: string,
      visited: Set<string> = new Set()
    ): boolean => {
      if (visited.has(currentTable)) return currentTable === startTable;
      visited.add(currentTable);
      const table = schema.find((t) => t.name === currentTable);
      if (!table) return false;
      for (const col of table.columns) {
        if (
          col.foreignKey &&
          checkCircularDependencies(
            startTable,
            col.foreignKey.table,
            new Set(visited)
          )
        ) {
          return true;
        }
      }
      return false;
    };

    schema.forEach((table) => {
      if (checkCircularDependencies(table.name, table.name)) {
        suggestions.push({
          type: "warning",
          message: `Potential circular dependency detected involving table "${table.name}"`,
          details:
            "Circular dependencies can lead to complex queries and maintenance issues. Consider restructuring the relationships to avoid cycles.",
          impact: "High",
          affectedTables: [table.name],
        });
      }
    });

    // Positive feedback for good practices
    if (
      schema.every((table) =>
        table.columns.some((col) => col.name.toLowerCase() === "id")
      )
    ) {
      suggestions.push({
        type: "good",
        message: 'All tables have an "id" column',
        details:
          "This is a good practice for consistent primary key naming and simplifies relationships between tables.",
        impact: "Low",
        affectedTables: schema.map((t) => t.name),
      });
    }

    if (
      schema.every((table) =>
        table.columns.some((col) =>
          ["created_at", "updated_at"].includes(col.name.toLowerCase())
        )
      )
    ) {
      suggestions.push({
        type: "good",
        message: "All tables use timestamp columns (created_at, updated_at)",
        details:
          "This is good for tracking record creation and modification times, which can be crucial for auditing and debugging.",
        impact: "Low",
        affectedTables: schema.map((t) => t.name),
      });
    }

    // Check for consistent data types
    const dataTypes: { [key: string]: Set<string> } = {};
    schema.forEach((table) => {
      table.columns.forEach((col) => {
        if (!dataTypes[col.name]) dataTypes[col.name] = new Set();
        dataTypes[col.name].add(col.type);
      });
    });
    Object.entries(dataTypes).forEach(([colName, types]) => {
      if (types.size > 1) {
        suggestions.push({
          type: "warning",
          message: `Inconsistent data types for column "${colName}"`,
          details: `The column "${colName}" has different data types across tables: ${Array.from(
            types
          ).join(", ")}. Consider standardizing the data type for consistency.`,
          impact: "Medium",
          affectedTables: schema
            .filter((t) => t.columns.some((c) => c.name === colName))
            .map((t) => t.name),
        });
      }
    });

    return suggestions;
  };

  const suggestions = analyzeSchemaSuggestions(schema);

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Schema Suggestions</CardTitle>
            <CardDescription>
              Recommendations for improving your database schema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {suggestions.map((suggestion, index) => (
              <Collapsible
                key={index}
                open={openSuggestions.includes(index)}
                onOpenChange={() => toggleSuggestion(index)}
                className="mb-4"
              >
                <Alert
                  variant={
                    suggestion.type === "warning"
                      ? "destructive"
                      : suggestion.type === "improvement"
                      ? "default"
                      : "success"
                  }
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        {suggestion.type === "warning" && (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        {suggestion.type === "improvement" && (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                        {suggestion.type === "good" && (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        <AlertTitle>{suggestion.message}</AlertTitle>
                      </div>
                      {openSuggestions.includes(index) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </Alert>
                <CollapsibleContent className="mt-2">
                  <Card>
                    <CardContent className="pt-4">
                      <AlertDescription>{suggestion.details}</AlertDescription>
                      <div className="mt-2">
                        <Badge
                          variant={
                            suggestion.impact === "High"
                              ? "destructive"
                              : suggestion.impact === "Medium"
                              ? "default"
                              : "secondary"
                          }
                        >
                          Impact: {suggestion.impact}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <strong>Affected Tables:</strong>
                        <ul className="list-disc list-inside">
                          {suggestion.affectedTables.map((table) => (
                            <li key={table}>{table}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
