"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForceGraph2D } from "react-force-graph";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const formSchema = z.object({
  tableDefinitions: z.string().min(1, {
    message: "Table definitions are required",
  }),
});

type Table = {
  name: string;
  columns: { name: string; type: string; constraints: string[] }[];
};

type Relationship = {
  source: string;
  target: string;
  sourceColumn: string;
  targetColumn: string;
};

export default function ForeignKeyVisualizer() {
  const [tables, setTables] = useState<Table[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mermaidCode, setMermaidCode] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tableDefinitions: "",
    },
  });

  const visualizeRelationships = async (values: z.infer<typeof formSchema>) => {
    setIsVisualizing(true);
    setError(null);
    setTables([]);
    setRelationships([]);
    setGraphData({ nodes: [], links: [] });
    setMermaidCode("");

    try {
      const parsedTables = parseTableDefinitions(values.tableDefinitions);
      setTables(parsedTables);
      const extractedRelationships = extractRelationships(parsedTables);
      setRelationships(extractedRelationships);
      setGraphData(generateGraphData(parsedTables, extractedRelationships));
      setMermaidCode(generateMermaidCode(parsedTables, extractedRelationships));
    } catch (err) {
      setError(
        "Failed to parse table definitions. Please check your input format."
      );
    } finally {
      setIsVisualizing(false);
    }
  };

  const parseTableDefinitions = (definitions: string): Table[] => {
    const tables: Table[] = [];
    const tableStrings = definitions.split(/\n{2,}/);

    tableStrings.forEach((tableString) => {
      const [tableName, ...columnStrings] = tableString.split("\n");
      const columns = columnStrings.map((colString) => {
        const [name, type, ...constraints] = colString.trim().split(/\s+/);
        return { name, type, constraints };
      });
      tables.push({ name: tableName.trim(), columns });
    });

    return tables;
  };

  const extractRelationships = (tables: Table[]): Relationship[] => {
    const relationships: Relationship[] = [];

    tables.forEach((table) => {
      table.columns.forEach((column) => {
        const foreignKeyConstraint = column.constraints.find((c) =>
          c.toLowerCase().startsWith("foreign")
        );
        if (foreignKeyConstraint) {
          const match = foreignKeyConstraint.match(
            /foreign\s+key\s+references\s+(\w+)$$(\w+)$$/i
          );
          if (match) {
            relationships.push({
              source: table.name,
              target: match[1],
              sourceColumn: column.name,
              targetColumn: match[2],
            });
          }
        }
      });
    });

    return relationships;
  };

  const generateGraphData = (
    tables: Table[],
    relationships: Relationship[]
  ) => {
    const nodes = tables.map((table) => ({
      id: table.name,
      name: table.name,
      val: table.columns.length,
    }));

    const links = relationships.map((rel) => ({
      source: rel.source,
      target: rel.target,
      name: `${rel.sourceColumn} -> ${rel.targetColumn}`,
    }));

    return { nodes, links };
  };

  const generateMermaidCode = (
    tables: Table[],
    relationships: Relationship[]
  ): string => {
    let code = "erDiagram\n";

    tables.forEach((table) => {
      code += `    ${table.name} {\n`;
      table.columns.forEach((column) => {
        code += `        ${column.type} ${column.name}\n`;
      });
      code += "    }\n";
    });

    relationships.forEach((rel) => {
      code += `    ${rel.source} }|--|| ${rel.target} : "${rel.sourceColumn}"\n`;
    });

    return code;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Advanced Foreign Key Visualizer</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(visualizeRelationships)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="tableDefinitions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Definitions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your table definitions here"
                      className="min-h-[200px] font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter table definitions (one per paragraph, columns on
                    separate lines)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isVisualizing}>
              {isVisualizing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Visualize Relationships
            </Button>
          </form>
        </Form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {tables.length > 0 && (
          <Tabs defaultValue="visualization" className="mt-8">
            <TabsList>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
              <TabsTrigger value="mermaid">Mermaid Diagram</TabsTrigger>
              <TabsTrigger value="sql">SQL</TabsTrigger>
            </TabsList>
            <TabsContent value="visualization">
              <div style={{ height: "600px" }} className="relative"></div>
            </TabsContent>
            <TabsContent value="mermaid">
              <SyntaxHighlighter
                language="mermaid"
                style={vscDarkPlus}
                className="text-sm"
              >
                {mermaidCode}
              </SyntaxHighlighter>
            </TabsContent>
            <TabsContent value="sql">
              <SyntaxHighlighter
                language="sql"
                style={vscDarkPlus}
                className="text-sm"
              >
                {tables
                  .map((table) =>
                    `
CREATE TABLE ${table.name} (
  ${table.columns
    .map((col) => `${col.name} ${col.type} ${col.constraints.join(" ")}`)
    .join(",\n  ")}
);
                `.trim()
                  )
                  .join("\n\n")}
              </SyntaxHighlighter>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
