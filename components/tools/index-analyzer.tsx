"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Impact, IndexAnalysisResult } from "@/lib/types";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import { analyzeIndexQueries } from "@/lib/tools-utils/analyze-index";
import QueryEditor from "./query-editor";
import { toast } from "sonner";

export default function IndexAnalyzer() {
  const [analysis, setAnalysis] = useState<IndexAnalysisResult | null>(null);

  const analyzeQuery = (query: string) => {
    try {
      const result = analyzeIndexQueries(query);
      setAnalysis(result);
    } catch (error) {
      console.log("Error parsing the SQL queries:", error);
      toast.error("Failed to generate index suggestions, Check your query.");
    }
  };

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
      <QueryEditor
        btnName="Analyze Query"
        callbackFn={analyzeQuery}
        onlyQuery
      />
      {analysis && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Suggested Indexes</CardTitle>
            <CardDescription>
              These are the findings from your query analysis. Keep in mind that
              real-world scenarios involve many variables, and we’ll incorporate
              these in future updates
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
