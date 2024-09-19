"use client";

import { Table } from "@/lib/types";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { COMPLEXITY_LABELS_SHORT } from "@/lib/constants";
import { calculateComplexity } from "@/lib/tools-utils";

const chartConfig = {
  complexity: {
    label: "complexity",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function SchemaComplexity({ schema }: { schema: Table[] }) {
  const complexity = calculateComplexity(schema);

  const chartData = [
    {
      key: "Table Count",
      complexity: complexity.tableCount,
    },
    {
      key: "Avg Col/Table",
      complexity: complexity.avgColumnsPerTable,
    },
    {
      key: "Total FK",
      complexity: complexity.totalForeignKeys,
    },
    {
      key: "Max FK/Table",
      complexity: complexity.maxForeignKeys,
    },
    {
      key: "Normalized",
      complexity: complexity.normalizedComplexity,
    },
  ];

  return (
    <Card className="min-h-[500px]">
      <CardHeader className="">
        <CardTitle>Schema Complexity Analysis</CardTitle>
        <CardDescription>
          Showing schema complexity based on your schema
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0 p-1 md:p-6 md:pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-72 sm:h-96 md:h-full w-full"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis
              dataKey="key"
              tickFormatter={(_, i) => COMPLEXITY_LABELS_SHORT[i]}
            />
            <PolarGrid />
            <Radar
              dataKey="complexity"
              fill="var(--color-complexity)"
              fillOpacity={0.5}
              stroke="var(--color-complexity)"
              strokeWidth={1.5}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
