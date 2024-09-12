"use client";

import { Table } from "@/lib/types";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  complexity: {
    label: "complexity",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function SchemaComplexity2({ schema }: { schema: Table[] }) {
  const calculateComplexity = (schema: Table[]) => {
    const tableCount = schema.length;
    const totalColumns = schema.reduce(
      (sum, table) => sum + table.columns.length,
      0
    );
    const totalForeignKeys = schema.reduce(
      (sum, table) =>
        sum + table.columns.filter((col) => col.foreignKey).length,
      0
    );
    const maxForeignKeys = Math.max(
      ...schema.map(
        (table) => table.columns.filter((col) => col.foreignKey).length
      )
    );
    const avgColumnsPerTable = totalColumns / tableCount;

    return {
      tableCount,
      avgColumnsPerTable,
      totalForeignKeys,
      maxForeignKeys,
      normalizedComplexity: (totalForeignKeys / totalColumns) * 100,
    };
  };

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
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto w-full">
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="key" tickFormatter={() => "asass"} />
            <PolarGrid />
            <Radar
              dataKey="complexity"
              fill="var(--color-complexity)"
              fillOpacity={0.6}
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
