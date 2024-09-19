"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
import type { Table } from "@/lib/types";

const chartConfig = {
  columns: {
    label: "No of Columns",
    color: "hsl(var(--chart-2))",
  },
  fks: {
    label: "No of Foriegn Keys",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function TableStatistics({ schema }: { schema: Table[] }) {
  const data = schema.map((table) => {
    return {
      name: table.name,
      columns: table.columns.length,
      fks: table.columns.filter((col) => col.foreignKey).length,
    };
  });

  return (
    <Card className="min-h-[500px]">
      <CardHeader>
        <CardTitle>Table Statistics</CardTitle>
        <CardDescription>Overall Summary</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.length > 9 ? value.slice(0, 7) + ".." : value
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="columns" fill="var(--color-columns)" radius={4} />
            <Bar dataKey="fks" fill="var(--color-fks)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm md:leading-none text-muted-foreground">
        Summary of table statistics including total columns and foreign keys for
        each table.
      </CardFooter>
    </Card>
  );
}
