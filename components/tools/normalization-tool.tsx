"use client";

import { useState, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Info, Table } from "lucide-react";
import { set, z } from "zod";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import CodeEditor from "./code-editor";
import CardWrapper from "../card-wrapper";
import { Label } from "../ui/label";
import SchemaHelperPopup from "./schema-helper-popup";
import { toast } from "sonner";
import { parseSchemaConstraints } from "@/lib/tools-utils";
import { TableConstraint } from "@/lib/types";
import NormalizationSuggestion from "./normalization-suggestion";
import NormalizationEditor from "./normalization-editor";
import SchemaGraph3d from "./schema-graph3d";
import FDTable from "./fd-table";
import FDBarPlot from "./fd-barplot";

type Dependency = {
  determinant: string[];
  dependent: string[];
};

export default function NormalizationTool() {
  const [tables, setTables] = useState<TableConstraint[]>([
    {
      name: "User",
      columns: [
        {
          name: "id",
          type: "Int",
          constraints: "primary key",
        },
        {
          name: "name",
          type: "Text",
          constraints: "",
        },
        {
          name: "email",
          type: "Text",
          constraints: "unique",
        },
        {
          name: "password_hash",
          type: "Text",
          constraints: "",
        },
        {
          name: "created_at",
          type: "DateTime",
          constraints: "",
        },
        {
          name: "updated_at",
          type: "DateTime",
          constraints: "",
        },
      ],
    },
    {
      name: "Post",
      columns: [
        {
          name: "id",
          type: "Int",
          constraints: "primary key",
        },
        {
          name: "user_id",
          type: "Int",
          constraints: "foreign key references user id",
        },
        {
          name: "title",
          type: "Text",
          constraints: "",
        },
        {
          name: "body",
          type: "Text",
          constraints: "",
        },
        {
          name: "created_at",
          type: "DateTime",
          constraints: "",
        },
        {
          name: "updated_at",
          type: "DateTime",
          constraints: "",
        },
      ],
    },
    {
      name: "Comment",
      columns: [
        {
          name: "id",
          type: "Int",
          constraints: "primary key",
        },
        {
          name: "post_id",
          type: "Int",
          constraints: "foreign key references post(id)",
        },
        {
          name: "user_id",
          type: "Int",
          constraints: "foreign key references user(id)",
        },
        {
          name: "body",
          type: "Text",
          constraints: "",
        },
        {
          name: "created_at",
          type: "DateTime",
          constraints: "",
        },
        {
          name: "updated_at",
          type: "DateTime",
          constraints: "",
        },
      ],
    },
  ]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [dependencies, setDependencies] = useState<Dependency[]>([]);

  // const generateGraphData = (tables: Table[], dependencies: Dependency[]) => {
  //   const nodes = tables.flatMap((table) => [
  //     { id: table.name, group: 1, label: table.name },
  //     ...table.columns.map((col) => ({
  //       id: `${table.name}.${col.name}`,
  //       group: 2,
  //       label: col.name,
  //     })),
  //   ]);

  //   const links = [
  //     ...tables.flatMap((table) =>
  //       table.columns.map((col) => ({
  //         source: table.name,
  //         target: `${table.name}.${col.name}`,
  //         value: 1,
  //       }))
  //     ),
  //     ...dependencies.flatMap((dep) =>
  //       dep.dependent.flatMap((d) =>
  //         dep.determinant.map((det) => ({
  //           source: det,
  //           target: d,
  //           value: 2,
  //         }))
  //       )
  //     ),
  //   ];

  //   return { nodes, links };
  // };

  const handleSetTable = (value: TableConstraint[]) => setTables(value);

  return (
    <div className="space-y-7">
      <NormalizationEditor saveTable={handleSetTable} />
      {tables.length > 0 && (
        <Tabs defaultValue="visualization">
          <TabsList>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
          </TabsList>
          <TabsContent value="suggestions">
            <NormalizationSuggestion parsedTables={tables} />
          </TabsContent>
          <TabsContent value="visualization">
            <SchemaGraph3d schema={tables} />
          </TabsContent>
          <TabsContent value="dependencies" className="space-y-7">
            <FDBarPlot schema={tables} />
            <FDTable schema={tables} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
