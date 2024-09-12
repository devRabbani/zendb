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
import { HelpCircle } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import getERDFromPrisma3 from "@/lib/actions/getERDFromPrisma3";

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
          : await getERDFromPrisma3(schema);
      console.log(mermaidCode);
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
    <div className="space-y-7">
      <div className="space-y-4">
        <Tabs
          onValueChange={(type) => setSchemaType(type)}
          defaultValue="prisma"
        >
          <TabsList>
            <TabsTrigger value="prisma">Prisma Schema</TabsTrigger>
            <TabsTrigger value="simple">Simple Schema</TabsTrigger>
          </TabsList>
        </Tabs>
        <CardWrapper className="mb-4">
          <div className="space-y-2.5">
            <div className="flex justify-between item-center">
              <Label htmlFor="code-editor">Paste your form schema here</Label>
              <HoverCard>
                <HoverCardTrigger className="cursor-pointer">
                  <HelpCircle className="h-6 w-6 text-muted-foreground" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <p className="text-[0.8rem] leading-relaxed">
                    Ensure that you provide only a correctly formatted Prisma
                    schema to avoid any issues.
                  </p>

                  <Button variant="outline" className="mt-5" size="sm">
                    Copy Sample Schema
                  </Button>
                </HoverCardContent>
              </HoverCard>
            </div>

            <CodeEditor
              value={schema}
              onValueChange={onSchemaChange}
              placeholder="Enter your Prisma schema here"
            />
            <p className="text-[0.8rem] text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel,
              laboriosam.
            </p>
          </div>
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
      </div>
      {diagram && <MermaidGraph chart={diagram} />}
    </div>
  );
}
