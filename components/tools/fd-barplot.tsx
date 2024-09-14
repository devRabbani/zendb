import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Treemap,
  XAxis,
  YAxis,
  Sankey,
  ScatterChart,
  ZAxis,
  Scatter,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tooltip } from "../ui/tooltip";
import { getFunctionalDependencies } from "@/lib/tools-utils/functional-dependency";
import { TableConstraint } from "@/lib/types";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  intra: {
    label: "Intra Table",
    color: "hsl(var(--chart-2))",
  },
  inter: {
    label: "Inter Table",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function FDBarPlot({ schema }: { schema: TableConstraint[] }) {
  const dependencies = getFunctionalDependencies(schema);

  const generateNewGraph = () => {
    const tabeleDtaa = dependencies.reduce((acc, curr) => {
      const tableName = curr.table.split(" -> ")[0];

      if (!acc[tableName]) {
        acc[tableName] = { name: tableName, intra: 0, inter: 0 };
      }

      if (curr.type === "intra-table") {
        acc[tableName].intra++;
      } else {
        acc[tableName].inter++;
      }
      return acc;
    }, {} as Record<string, { name: string; intra: number; inter: number }>);

    return Object.values(tabeleDtaa);
  };

  const chartData2 = generateNewGraph();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intra vs Inter table dependencies</CardTitle>
        <CardDescription>
          This overview highlights different types of functional dependencies.
          It’s a simplified representation and may not encompass all real-world
          complexities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData2}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 20)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="intra"
              stackId="a"
              fill="var(--color-intra)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="inter"
              stackId="a"
              fill="var(--color-inter)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
