"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AST, Parser } from "node-sql-parser";
import { analyzeIndexQueries } from "@/lib/index-tool-utils";
import { Impact, IndexAnalysisResult } from "@/lib/types";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import CardWrapper from "../card-wrapper";
import { Label } from "../ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  query: z.string().min(1, {
    message: "SQL Query is required",
  }),
});

export default function IndexAnalyzer() {
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<IndexAnalysisResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  const analyzeQuery = useCallback((values: z.infer<typeof formSchema>) => {
    try {
      setError("");
      const result = analyzeIndexQueries(values.query);
      setAnalysis(result);
    } catch (error) {
      console.log("Error parsing the SQL queries:", error);
      setError("Error parsing the SQL query");
    }
  }, []);

  const renderImpact = (impact: Impact) => {
    switch (impact) {
      case "High":
        return <CheckCircle2 className="text-green-500" />;
      case "Medium":
        return <HelpCircle className="text-yellow-500" />;
      case "Low":
        return <AlertCircle className="text-red-500" />;
      default:
        return <span>Unknown</span>;
    }
  };

  return (
    <div className="mt-5">
      <CardWrapper>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(analyzeQuery)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SQL Query</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Eg: SELECT e.id, e.name, d.department_name FROM employees e JOIN ( SELECT id, department_name FROM departments WHERE active = 1 ) d ON e.department_id = d.id;"
                      className="min-h-[200px] font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a your SQL query for index analysis
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Analyze Query</Button>
          </form>
        </Form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardWrapper>

      {analysis && (
        <Card className="mt-8">
          <CardHeader hidden>
            <CardTitle hidden>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Suggested Indexes
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Columns</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>Impact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysis.suggestions.map((suggestion, index) => (
                      <TableRow key={index}>
                        <TableCell>{suggestion.columns.join(", ")}</TableCell>
                        <TableCell>{suggestion.table}</TableCell>
                        <TableCell className="flex items-center">
                          {renderImpact(suggestion.impact)}
                          <span className="ml-2">{suggestion.impact}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {analysis?.ast && (
        <CardWrapper className="mt-8 max-h-[700px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Query AST:</h3>
          <SyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            customStyle={{
              backgroundColor: "transparent",
            }}
            className="text-sm"
          >
            {analysis.ast}
          </SyntaxHighlighter>
        </CardWrapper>
      )}
    </div>
  );
}
