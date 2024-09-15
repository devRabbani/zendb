"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Parser, AST } from "node-sql-parser";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import CodeEditor from "./code-editor";
import QueryEditor from "./query-editor";
import { toast } from "sonner";
import {
  analyzeComplexity,
  getComplexityLevel,
} from "@/lib/tools-utils/analyze-query";
import { ComplexityAnalysis } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import QueryComplexityReport from "./query-complexity-report";

export default function QueryComplexityEstimator() {
  const [analysisResult, setAnalysisResult] =
    useState<ComplexityAnalysis | null>(null);
  const [astJson, setAstJson] = useState<string>("");

  const handleAnalyze = (astRes: AST | AST[]) => {
    try {
      let ast: AST;
      if (Array.isArray(astRes)) {
        ast = astRes[0];
      } else {
        ast = astRes;
      }
      //  Setting up for AST JSON
      setAstJson(JSON.stringify(ast, null, 2));
      const report = analyzeComplexity(ast);
      setAnalysisResult(report);
    } catch (error) {
      console.log("Error generating complexity:", error);
      toast.error("Failed to generate analysis report. Please try again.");
    }
  };

  return (
    <>
      <QueryEditor callbackFn={handleAnalyze} btnName="Estimate Complexity" />
      {analysisResult && (
        <Tabs defaultValue="analysis">
          <TabsList className="">
            <TabsTrigger className="w-36" value="analysis">
              Analysis
            </TabsTrigger>
            <TabsTrigger className="w-36" value="ast">
              AST
            </TabsTrigger>
          </TabsList>
          <TabsContent value="analysis">
            <QueryComplexityReport analysisResult={analysisResult} />
          </TabsContent>
          <TabsContent value="ast">
            <Card>
              <CardHeader>
                <CardTitle>Query Abstract Syntax Tree (AST)</CardTitle>
              </CardHeader>
              <CardContent>
                <SyntaxHighlighter
                  language="json"
                  style={vscDarkPlus}
                  className="text-sm rounded-md max-h-[500px] overflow-auto"
                >
                  {astJson}
                </SyntaxHighlighter>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}
