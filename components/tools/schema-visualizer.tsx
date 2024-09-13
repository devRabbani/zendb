"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SchemaSuggestions from "./schema-suggestion";
import CodeEditor from "./code-editor";
import CardWrapper from "../card-wrapper";
import { Label } from "../ui/label";
import SchemaHelperPopup from "./schema-helper-popup";
import SchemaComplexity from "./schema-complexity";
import TableStatistics from "./table-statistics";
import SchemaImpactAnalysis from "./schema-impact-analysis";
import { parseSchema } from "@/lib/tools-utils";
import type { Table } from "@/lib/types";

export default function SchemaVisualizer() {
  const [schema, setSchema] = useState("");
  const [parsedSchema, setParsedSchema] = useState<Table[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    </div>
  );
}
