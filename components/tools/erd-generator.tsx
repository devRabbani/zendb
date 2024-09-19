"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CodeEditor from "./code-editor";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import type { SchemaType } from "@/lib/types";
import CardWrapper from "../card-wrapper";
import { Label } from "../ui/label";
import MermaidGraph from "./mermaid-graph";
import { HelpCircle } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import CopySampleBtn from "./copy-sample.btn";
import { getERDFromSimple } from "@/lib/tools-utils";
import generateERDFromPrisma from "@/lib/tools-utils/erd-prisma";
import { SAMPLE_SCHEMA } from "@/lib/constants";

const HelpContent = ({ type }: { type: SchemaType }) => {
  if (type === "prisma") {
    return (
      <>
        <p className="text-[0.8rem] leading-relaxed">
          Ensure that you provide only a correctly formatted Prisma schema to
          avoid any issues.
        </p>

        <CopySampleBtn />
      </>
    );
  }
  return (
    <>
      <p className="text-[0.8rem] leading-relaxed">
        Please enter the table structures one per paragraph, with columns listed
        on separate lines. For example:
      </p>
      <pre className="mt-2">
        <code className="text-xs whitespace-pre">
          Order{"\n"}
          id Int Primary Key {"\n"}
          userId Int references User(id){"\n"}
          total_amount Decimal
        </code>
      </pre>

      <CopySampleBtn variant="simple" />
    </>
  );
};

export default function ERDGenerator() {
  const [schema, setSchema] = useState("");
  const [schemaType, setSchemaType] = useState<SchemaType>("prisma");
  const [diagram, setDiagram] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(""); //Clearing Error
    try {
      const mermaidCode =
        schemaType === "simple"
          ? getERDFromSimple(schema)
          : generateERDFromPrisma(schema);
      setDiagram(mermaidCode);
    } catch (error: any) {
      console.log("ER Generate", error?.message);
      setDiagram("");
      setError("Something went wrong, Make sure your schema is valid");
    } finally {
      setIsLoading(false);
    }
  };

  const onSchemaChange = useCallback((value: string) => {
    setSchema(value);
  }, []);

  return (
    <div className="space-y-7">
      <div className="space-y-4">
        <Tabs
          onValueChange={(type) => setSchemaType(type as SchemaType)}
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
              <Label htmlFor="code-editor">
                Paste your {schemaType === "prisma" ? "Prisma" : "Text"} Schema
                here
              </Label>
              <HoverCard openDelay={0}>
                <HoverCardTrigger className="hidden min-[500px]:block cursor-pointer">
                  <HelpCircle className="h-6 w-6 text-muted-foreground transition-colors hover:text-foreground" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <HelpContent type={schemaType} />
                </HoverCardContent>
              </HoverCard>
            </div>

            <CodeEditor
              value={schema}
              onValueChange={onSchemaChange}
              placeholder={`Enter your ${
                schemaType === "prisma" ? "Prisma" : "Simple Text"
              } schema here`}
            />
            <div className="min-[500px]:hidden">
              <p className="text-[0.8rem] text-muted-foreground">
                Before generating, ensure the schema type and structure or
                choose a sample schema:
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setSchema(SAMPLE_SCHEMA[schemaType])}
              >
                Sample Schema
              </Button>
            </div>
            <p className="text-[0.8rem] text-muted-foreground hidden min-[500px]:block">
              Before generating, ensure the schema type and structure match your
              selected ERD diagram settings
            </p>
          </div>
          <Button
            className="mt-6"
            disabled={isLoading || schema.length < 20}
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
