"use client";

import { useCallback, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SchemaSuggestions from "./schema-suggestion";
import SchemaComplexity from "./schema-complexity";
import TableStatistics from "./table-statistics";
import SchemaImpactAnalysis from "./schema-impact-analysis";
import type { Table } from "@/lib/types";
import SchemaVisualizerEditor from "./schema-visualizer-editor";

export default function SchemaVisualizer() {
  const [parsedSchema, setParsedSchema] = useState<Table[]>([]);

  const saveParsedSchema = useCallback((value: Table[]) => {
    setParsedSchema(value);
  }, []);

  return (
    <div className="space-y-7">
      <SchemaVisualizerEditor saveParsedSchema={saveParsedSchema} />
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
