"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FunctionalDependency, TableConstraint } from "@/lib/types";
import NormalizationSuggestion from "./normalization-suggestion";
import NormalizationEditor from "./normalization-editor";
import FDTable from "./fd-table";
import FDBarPlot from "./fd-barplot";
import { getFunctionalDependencies } from "@/lib/tools-utils/functional-dependency";
import FDDirectiveDiagram from "./fd-directive-diagram";

export default function NormalizationTool() {
  const [tables, setTables] = useState<TableConstraint[]>([]);
  const [dependencies, setDependencies] = useState<FunctionalDependency[]>([]);

  const handleSetTable = (value: TableConstraint[]) => {
    setTables(value);
    const depsRes = getFunctionalDependencies(value);
    setDependencies(depsRes);
  };

  return (
    <div className="space-y-7">
      <NormalizationEditor saveTable={handleSetTable} />
      {tables.length > 0 && (
        <Tabs defaultValue="suggestions">
          <TabsList>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
          </TabsList>
          <TabsContent value="suggestions">
            <NormalizationSuggestion parsedTables={tables} />
          </TabsContent>
          <TabsContent value="visualization">
            <FDDirectiveDiagram dependencies={dependencies} />
          </TabsContent>
          <TabsContent value="dependencies" className="space-y-7">
            <FDBarPlot dependencies={dependencies} />
            <FDTable dependencies={dependencies} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
