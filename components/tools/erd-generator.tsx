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
import { Table } from "./schema-visualizer";
import { Column } from "@/lib/types";
import getERDFromPrisma from "@/lib/actions/getERDFromPrisma";
import Mermaid from "./mermaid";
import CardWrapper from "../card-wrapper";
import { FormLabel } from "../ui/form";
import { Label } from "../ui/label";
import MermaidGraph from "./mermaid-graph";

export default function ERDGenerator() {
  const [schema, setSchema] = useState("");
  const [schemaType, setSchemaType] = useState("prisma");
  const [diagram, setDiagram] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    try {
      setError(""); //Clearing Error
      const mermaidCode =
        schemaType === "simple"
          ? await getERDFromSimple(schema)
          : await getERDFromPrisma(schema);
      setDiagram(mermaidCode);
    } catch (error) {
      console.log(error);
      setDiagram("");
      setError("Something went wrong, Make sure your schema is valid");
    }
  };

  const onSchemaChange = useCallback((value: string) => {
    setSchema(value);
  }, []);

  return (
    <div className="space-y-4">
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
        <Button
          className="mt-6"
          disabled={schema.length < 20}
          onClick={handleGenerate}
        >
          Generate Diagram
        </Button>
        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardWrapper>

      {diagram && <MermaidGraph chart={diagram} />}
    </div>
  );
}
