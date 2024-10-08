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
// import { getComplexityLevel } from "@/lib/tools-utils/analyze-query";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { cn } from "@/lib/utils";
import { QUERY_LABELS_SHORT } from "@/lib/constants";

const chartConfig = {
  score: {
    label: "Complexity",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const getComplexityLevel = (
  score: number
): { level: string; color: string } => {
  if (score <= 5) return { level: "Low", color: "bg-state-low" };
  if (score <= 10) return { level: "Moderate", color: "bg-state-moderate" };
  if (score <= 20) return { level: "High", color: "bg-state-high" };
  return { level: "Very High", color: "bg-state-very-high" };
};

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
              className="mx-auto w-full aspect-square sm:max-h-96 md:max-h-[270px]"
            >
              <RadarChart data={analysisResult.factors}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <PolarAngleAxis
                  dataKey="name"
                  tickFormatter={(value) =>
                    QUERY_LABELS_SHORT[value as keyof typeof QUERY_LABELS_SHORT]
                  }
                />
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
