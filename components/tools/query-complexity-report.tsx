import type { ComplexityAnalysis } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getComplexityLevel } from "@/lib/tools-utils/analyze-query";
import { Badge } from "../ui/badge";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Label,
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const chartConfig = {
  score: {
    label: "Complexity",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function QueryComplexityReport({
  analysisResult,
}: {
  analysisResult: ComplexityAnalysis;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Complexity Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysisResult.factors.map((factor, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{factor.name}</TableCell>
                  <TableCell>{factor.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadarChart data={analysisResult.factors}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <PolarAngleAxis dataKey="name" />
                <PolarGrid />

                <Radar
                  dataKey="score"
                  fill="var(--color-score)"
                  fillOpacity={0.6}
                  dot={{
                    r: 4,
                    fillOpacity: 1,
                  }}
                />
              </RadarChart>
            </ChartContainer>
          </div>
        </div>
        <div className="mt-6 p-4 bg-muted rounded-md flex items-center justify-between">
          <p className="font-semibold text-lg">
            Total Complexity Score: {analysisResult.totalScore}
          </p>
          <span
            className={cn(
              "text-sm font-semibold px-3 py-0.5 rounded-md text-white",
              getComplexityLevel(analysisResult.totalScore).color
            )}
          >
            {getComplexityLevel(analysisResult.totalScore).level}
          </span>
        </div>
        <div className="mt-7">
          <h4 className="text-lg font-semibold mb-2">Detailed Explanations:</h4>
          <ul className="list-disc pl-5 space-y-2">
            {analysisResult.factors.map((factor, index) => (
              <li key={index}>
                <span className="font-medium">{factor.name}:</span>{" "}
                {factor.explanation}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
