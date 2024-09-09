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

const formSchema = z.object({
  query: z.string().min(1, {
    message: "Query is required",
  }),
});

type ComplexityFactor = {
  name: string;
  score: number;
  explanation: string;
};

export default function QueryComplexityEstimator() {
  const [complexityFactors, setComplexityFactors] = useState<
    ComplexityFactor[]
  >([]);
  const [totalScore, setTotalScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [astJson, setAstJson] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  const estimateComplexity = async (values: z.infer<typeof formSchema>) => {
    setIsAnalyzing(true);
    setError(null);
    setComplexityFactors([]);
    setTotalScore(0);
    setAstJson("");

    try {
      const parse = new Parser();
      const astRes = parse.astify(values.query);
      let ast: AST;

      if (Array.isArray(astRes)) {
        ast = astRes[0];
      } else {
        ast = astRes;
      }

      setAstJson(JSON.stringify(ast, null, 2));

      const factors: ComplexityFactor[] = [];
      let score = 0;

      // Analyze JOIN operations
      const joinCount = countJoins(ast);
      if (joinCount > 0) {
        const joinScore = joinCount * 2;
        factors.push({
          name: "JOINs",
          score: joinScore,
          explanation: `${joinCount} JOIN(s) detected. Each JOIN adds complexity to the query execution.`,
        });
        score += joinScore;
      }

      // Analyze subqueries
      const subqueryCount = countSubqueries(ast);
      if (subqueryCount > 0) {
        const subqueryScore = subqueryCount * 3;
        factors.push({
          name: "Subqueries",
          score: subqueryScore,
          explanation: `${subqueryCount} subquery(ies) detected. Subqueries can significantly increase query complexity.`,
        });
        score += subqueryScore;
      }

      // Analyze aggregations
      const aggregationCount = countAggregations(ast);
      if (aggregationCount > 0) {
        factors.push({
          name: "Aggregations",
          score: aggregationCount,
          explanation: `${aggregationCount} aggregation function(s) detected. Aggregations require additional processing.`,
        });
        score += aggregationCount;
      }

      // Analyze DISTINCT operations
      if (hasDistinct(ast)) {
        factors.push({
          name: "DISTINCT",
          score: 2,
          explanation:
            "DISTINCT operation detected. This requires additional processing to remove duplicates.",
        });
        score += 2;
      }

      // Analyze ORDER BY
      const orderByCount = countOrderBy(ast);
      if (orderByCount > 0) {
        const orderByScore = orderByCount;
        factors.push({
          name: "ORDER BY",
          score: orderByScore,
          explanation: `${orderByCount} ORDER BY clause(s) detected. Sorting can be computationally expensive.`,
        });
        score += orderByScore;
      }

      // Analyze HAVING clause
      if (hasHaving(ast)) {
        factors.push({
          name: "HAVING",
          score: 2,
          explanation:
            "HAVING clause detected. This adds a filtering step after aggregation.",
        });
        score += 2;
      }

      setComplexityFactors(factors);
      setTotalScore(score);
    } catch (err) {
      setError("Failed to parse SQL query. Please check your syntax.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const countJoins = (ast: any): number => {
    let count = 0;
    if (ast.from && Array.isArray(ast.from)) {
      ast.from.forEach((fromItem) => {
        if (fromItem.join) count++;
      });
    }
    return count;
  };

  const countSubqueries = (ast: any): number => {
    let count = 0;
    JSON.stringify(ast, (_, value) => {
      if (
        value &&
        typeof value === "object" &&
        "type" in value &&
        value.type === "select"
      ) {
        count++;
      }
      return value;
    });
    return count - 1; // Subtract 1 to exclude the main query
  };

  const countAggregations = (ast: any): number => {
    let count = 0;
    JSON.stringify(ast, (_, value) => {
      if (
        value &&
        typeof value === "object" &&
        "type" in value &&
        value.type === "aggr_func"
      ) {
        count++;
      }
      return value;
    });
    return count;
  };

  const hasDistinct = (ast: any): boolean => {
    return ast.distinct === "DISTINCT";
  };

  const countOrderBy = (ast: any): number => {
    return ast.orderby ? ast.orderby.length : 0;
  };

  const hasHaving = (ast: any): boolean => {
    return !!ast.having;
  };

  const getComplexityLevel = (score: number): string => {
    if (score <= 5) return "Low";
    if (score <= 10) return "Moderate";
    if (score <= 15) return "High";
    return "Very High";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Advanced Query Complexity Estimator</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(estimateComplexity)}
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
                      placeholder="Enter your SQL query here"
                      className="min-h-[200px] font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a complex SQL query for complexity analysis
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isAnalyzing}>
              {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Estimate Complexity
            </Button>
          </form>
        </Form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {complexityFactors.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Complexity Analysis:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factor</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Explanation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complexityFactors.map((factor, index) => (
                    <TableRow key={index}>
                      <TableCell>{factor.name}</TableCell>
                      <TableCell>{factor.score}</TableCell>
                      <TableCell>{factor.explanation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={complexityFactors}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                    <Radar
                      name="Complexity"
                      dataKey="score"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-semibold">
                Total Complexity Score: {totalScore}
              </p>
              <p>Complexity Level: {getComplexityLevel(totalScore)}</p>
            </div>
          </div>
        )}

        {astJson && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Query AST:</h3>
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              className="text-sm"
            >
              {astJson}
            </SyntaxHighlighter>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
