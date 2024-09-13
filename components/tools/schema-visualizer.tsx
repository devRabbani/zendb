"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
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
import SchemaImpactAnalysis from "./schema-impact-analysis";
import SchemaSuggestions from "./schema-suggestion";
import CodeEditor from "./code-editor";
import { Column, Table } from "@/lib/types";
import CardWrapper from "../card-wrapper";
import { Label } from "../ui/label";
import SchemaHelperPopup from "./schema-helper-popup";
import SchemaComplexity from "./schema-complexity";
import TableStatistics from "./table-statistics";

export default function SchemaVisualizer() {
  const [schema, setSchema] = useState(`User
id            Int     Primary Key
name          Text
email         Text    Unique
password_hash Text
created_at    DateTime
updated_at    DateTime

Post
id            Int     Primary Key
user_id       Int     Foreign Key references User id
title         Text
body          Text
created_at    DateTime
updated_at    DateTime

Comment
id            Int     Primary Key
post_id       Int     Foreign Key references Post(id)
user_id       Int     Foreign Key references User(id)
body          Text
created_at    DateTime
updated_at    DateTime
`);
  const [parsedSchema, setParsedSchema] = useState<Table[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  const handleVisualize = () => {
    try {
      const tables = parseSchema(schema);
      setParsedSchema(tables);
      setError(null);
    } catch (err: any) {
      setError(err?.message);
      setParsedSchema([]);
    }
  };

  const onValueChange = useCallback((value: string) => {
    setSchema(value);
  }, []);

  return (
    <div className="space-y-7">
      <CardWrapper className="mb-4">
        <div className="space-y-2.5">
          <div className="flex justify-between item-center">
            <Label htmlFor="code-editor">Paste your DB Schema here</Label>
            <SchemaHelperPopup />
          </div>
          <CodeEditor value={schema} onValueChange={onValueChange} />
          <p className="text-[0.8rem] text-muted-foreground">
            Enter your database schema to visualize and analyze. Click help
            button for sample schema and structure.
          </p>
        </div>
        <Button onClick={handleVisualize} className="mt-6">
          Visualize and Analyze
        </Button>
        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardWrapper>
      {parsedSchema.length > 0 && (
        <Tabs defaultValue="stats">
          <TabsList className="h-10">
            <TabsTrigger className="py-1.5" value="stats">
              Table Statistics
            </TabsTrigger>
            <TabsTrigger className="py-1.5" value="complexity">
              Schema Complexity
            </TabsTrigger>
            <TabsTrigger className="py-1.5" value="impact">
              Impact Analysis
            </TabsTrigger>
            <TabsTrigger className="py-1.5" value="suggestions">
              Suggestions
            </TabsTrigger>
          </TabsList>
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
      {/* <Card className="w-full">
        <CardHeader>
          <CardTitle>Advanced Foreign Key Visualizer</CardTitle>
          <CardDescription>
            Enter your database schema to visualize and analyze foreign key
            relationships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeEditor value={schema} onValueChange={onValueChange} />
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
            <Tabs defaultValue="complexity">
              <TabsList>
                <TabsTrigger value="stats">Table Statistics</TabsTrigger>
                <TabsTrigger value="complexity">Schema Complexity</TabsTrigger>
                <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>
              <TabsContent value="stats">
                <TableStatistics schema={parsedSchema} />
              </TabsContent>
              <TabsContent value="complexity">
                <SchemaComplexity schema={parsedSchema} />
                <SchemaComplexity2 schema={parsedSchema} />
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
      </Card> */}
    </div>
  );
}
