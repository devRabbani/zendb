"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import mermaid from "mermaid";
import CodeEditor from "./code-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import getPrismaSchema from "@/lib/actions/getPrismaSchema";
import { getSimpleSchema } from "@/lib/actions";
import { generateERD } from "@/lib/schema-tool-utils";
import { Table } from "./schema-visualizer";
import { Column } from "@/lib/types";

export default function Component() {
  const [schema, setSchema] = useState("");
  const [schemaType, setSchemaType] = useState("prisma");
  const [diagram, setDiagram] = useState("");
  const [error, setError] = useState("");

  //   const generateDiagram = () => {
  //     try {
  //       const ast = parse(input);
  //       let mermaidSyntax = "erDiagram\n";
  //       const relationships = new Set();
  //       const models = new Map();

  //       // First pass: collect all models and their fields
  //       ast.list.forEach((node) => {
  //         if (node.type === "model") {
  //           models.set(
  //             node.name,
  //             new Set(
  //               node.properties
  //                 .filter((prop) => prop.type === "field")
  //                 .map((prop) => prop.name)
  //             )
  //           );
  //         }
  //       });

  //       // Second pass: generate diagram syntax and detect relationships
  //       ast.list.forEach((node) => {
  //         if (node.type === "model") {
  //           mermaidSyntax += `  ${node.name} {\n`;
  //           node.properties.forEach((prop) => {
  //             if (prop.type === "field") {
  //               const fieldType = prop.fieldType.replace("?", "");
  //               mermaidSyntax += `    ${fieldType} ${prop.name}\n`;

  //               // Detect relationships
  //               if (fieldType.includes("[]")) {
  //                 const relatedModel = fieldType.replace("[]", "");
  //                 if (models.has(relatedModel)) {
  //                   // Check for many-to-many relationship
  //                   if (
  //                     models.get(relatedModel).has(node.name + "s") ||
  //                     models.get(relatedModel).has(node.name.toLowerCase() + "s")
  //                   ) {
  //                     relationships.add(
  //                       `  ${node.name} }o--o{ ${relatedModel}: ""`
  //                     );
  //                   } else {
  //                     relationships.add(
  //                       `  ${node.name} ||--o{ ${relatedModel}: ""`
  //                     );
  //                   }
  //                 }
  //               } else if (models.has(fieldType)) {
  //                 // Check for one-to-one relationship
  //                 if (
  //                   models.get(fieldType).has(node.name.toLowerCase()) ||
  //                   models.get(fieldType).has(node.name)
  //                 ) {
  //                   relationships.add(`  ${node.name} ||--|| ${fieldType}: ""`);
  //                 } else {
  //                   relationships.add(`  ${node.name} }o--|| ${fieldType}: ""`);
  //                 }
  //               }
  //             }
  //           });
  //           mermaidSyntax += "  }\n";
  //         }
  //       });

  //       mermaidSyntax += Array.from(relationships).join("\n");
  //       setDiagram(mermaidSyntax);
  //       setError("");
  //       renderMermaid();
  //     } catch (err) {
  //       setError(
  //         "Failed to parse the schema. Please check your input and try again."
  //       );
  //       setDiagram("");
  //     }
  //   };

  const renderMermaid = useCallback(() => {
    mermaid.initialize({ startOnLoad: false });
    mermaid.run({
      querySelector: ".mermaid",
    });
  }, []);

  useEffect(() => {
    if (diagram) {
      renderMermaid();
    }
  }, [diagram, renderMermaid]);

  const handleTest = async () => {
    try {
      if (schemaType === "simple") {
        const res = await getSimpleSchema(schema);
        const code = generateERD(res);
        console.log(code);
        return;
      }
      const mermaidCode = await getPrismaSchema(schema);
      setDiagram(mermaidCode);
      renderMermaid();
    } catch (error) {
      console.log(error);
    }
  };

  const onSchemaChange = useCallback((value: string) => {
    setSchema(value);
  }, []);
  return (
    <div className="container mx-auto p-4">
      <Tabs onValueChange={(type) => setSchemaType(type)} defaultValue="prisma">
        <TabsList>
          <TabsTrigger value="prisma">Prisma Schema</TabsTrigger>
          <TabsTrigger value="simple">Simple Schema</TabsTrigger>
        </TabsList>
      </Tabs>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Enhanced ER Diagram Generator</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <Textarea
            placeholder="Paste your Prisma schema here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] mb-4"
            aria-label="Prisma schema input"
          /> */}
          <CodeEditor
            value={schema}
            onValueChange={onSchemaChange}
            placeholder="Enter your Prisma schema here"
          />
          {/* <Button onClick={generateDiagram}>Generate Diagram</Button> */}
          <Button className="mt-6" onClick={handleTest}>
            Generate Diagram
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {diagram && (
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
      )}
    </div>
  );
}
