import { Bar, BarChart, XAxis, CartesianGrid } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { generateFDChartData } from "@/lib/tools-utils/functional-dependency";
import type { FunctionalDependency } from "@/lib/types";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { toast } from "sonner";
import { useEffect, useState } from "react";

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

type ChartDataType = {
  name: string;
  intra: number;
  inter: number;
}[];

export default function FDBarPlot({
  dependencies,
}: {
  dependencies: FunctionalDependency[];
}) {
  const [chartData, setChartData] = useState<ChartDataType>([]);

  const handleGraphData = () => {
    try {
      const res = generateFDChartData(dependencies);
      setChartData(res);
    } catch (error: any) {
      console.log(error?.message);
      toast.error("Unable to generate Chart Data");
    }
  };

  useEffect(() => {
    handleGraphData();
  }, [dependencies]);

  return (
    <Card className="min-h-[500px]">
      <CardHeader>
        <CardTitle>Intra vs Inter table dependencies</CardTitle>
        <CardDescription>
          This overview highlights different types of functional dependencies.
          It’s a simplified representation and may not encompass all real-world
          complexities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length ? (
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData}>
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
        ) : (
          <p className="text-sm text-muted-foreground font-medium text-center mt-[10vh]">
            No Data to show
          </p>
        )}
      </CardContent>
    </Card>
  );
}
