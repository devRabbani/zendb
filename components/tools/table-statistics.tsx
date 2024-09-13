"use client";

import { TrendingUp } from "lucide-react";
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
import { Table } from "@/lib/types";

export const description = "A multiple bar chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "June", desktop: 214, mobile: 140 },
];

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
  // const data = {
  //   labels: schema.map((table) => table.name),
  //   datasets: [
  //     {
  //       label: "Number of Columns",
  //       data: schema.map((table) => table.columns.length),
  //       backgroundColor: "rgba(75, 192, 192, 0.6)",
  //     },
  //     {
  //       label: "Number of Foreign Keys",
  //       data: schema.map(
  //         (table) => table.columns.filter((col) => col.foreignKey).length
  //       ),
  //       backgroundColor: "rgba(153, 102, 255, 0.6)",
  //     },
  //   ],
  // };

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
              tickFormatter={(value) => value.slice(0, 10)}
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
      <CardFooter className="text-sm leading-none text-muted-foreground">
        Summary of table statistics including total columns and foreign keys for
        each table.
      </CardFooter>
    </Card>
  );
}
