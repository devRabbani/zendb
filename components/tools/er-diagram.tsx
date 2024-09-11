"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import mermaid from "mermaid";
import CodeEditor from "./code-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { getERDFromSimple } from "@/lib/actions";
import { generateERD } from "@/lib/schema-tool-utils";
import { Table } from "./schema-visualizer";
import { Column } from "@/lib/types";
import getERDFromPrisma from "@/lib/actions/getERDFromPrisma";
import Mermaid from "./mermaid";
import CardWrapper from "../card-wrapper";
import { FormLabel } from "../ui/form";
import { Label } from "../ui/label";
import MermaidGraph from "./mermaid-graph";

export default function Component() {
  const chart = `
    graph TD
    A[Client] --> B[Load Balancer]
    B --> C[Server01]
    B --> D[Server02]`;

  const [schema, setSchema] = useState("");
  const [schemaType, setSchemaType] = useState("prisma");
  const [diagram, setDiagram] = useState(chart);
  const [error, setError] = useState("");

  //   const renderMermaid = useCallback(() => {
  //     mermaid.initialize({ startOnLoad: false });
  //     mermaid.run({
  //       querySelector: ".mermaid",
  //     });
  //   }, []);

  //   useEffect(() => {
  //     if (diagram) {
  //       renderMermaid();
  //     }
  //   }, [diagram, renderMermaid]);

  const handleTest = async () => {
    try {
      console.log("test", schema);
      const mermaidCode =
        schemaType === "simple"
          ? await getERDFromSimple(schema)
          : await getERDFromPrisma(schema);
      console.log(mermaidCode, "code");
      setDiagram(mermaidCode);
    } catch (error) {
      console.log(error);
    }
  };

  const onSchemaChange = useCallback((value: string) => {
    setSchema(value);
  }, []);

  return (
    <div className="space-y-4 mt-4">
      <Tabs onValueChange={(type) => setSchemaType(type)} defaultValue="prisma">
        <TabsList>
          <TabsTrigger value="prisma">Prisma Schema</TabsTrigger>
          <TabsTrigger value="simple">Simple Schema</TabsTrigger>
        </TabsList>
      </Tabs>
      <CardWrapper className="mb-4">
        <Label>Paste your form schema here</Label>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos
          aliquid consequuntur, amet aut facere repellat beatae omnis ducimus
          nihil quae.
        </p>
        <CodeEditor
          value={schema}
          onValueChange={onSchemaChange}
          placeholder="Enter your Prisma schema here"
        />
        {/* <Button onClick={generateDiagram}>Generate Diagram</Button> */}
        <Button className="mt-6" onClick={handleTest}>
          Generate Diagram
        </Button>
      </CardWrapper>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {/* {diagram && (
        <div>
          <Mermaid chart={diagram} />
        </div>
      )} */}
      <div className="bg-background">
        <MermaidGraph
          chart={diagram}
          className="max-w-3xl mx-auto select-none"
        />
      </div>
      {/* {diagram && (
        <Card>
          <CardHeader>
            <CardTitle>Generated ER Diagram</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mermaid" aria-label="Entity-Relationship Diagram">
              {diagram}
            </div>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}
