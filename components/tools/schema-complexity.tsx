"use client";

import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Table } from "./schema-visualizer";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function SchemaComplexity({ schema }: { schema: Table[] }) {
  const calculateComplexity = () => {
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

  const complexity = calculateComplexity();

  const data = {
    labels: [
      "Table Count",
      "Avg Columns/Table",
      "Total Foreign Keys",
      "Max Foreign Keys/Table",
      "Normalized Complexity",
    ],
    datasets: [
      {
        label: "Schema Complexity",
        data: [
          complexity.tableCount,
          complexity.avgColumnsPerTable,
          complexity.totalForeignKeys,
          complexity.maxForeignKeys,
          complexity.normalizedComplexity,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Schema Complexity Analysis" },
    },
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: Math.max(...Object.values(complexity)),
      },
    },
  };

  return <Radar data={data} options={options} />;
}
