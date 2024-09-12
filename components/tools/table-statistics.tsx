// "use client";

// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Table } from "./schema-visualizer";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export default function TableStatistics({ schema }: { schema: Table[] }) {
//   const data = {
//     labels: schema.map((table) => table.name),
//     datasets: [
//       {
//         label: "Number of Columns",
//         data: schema.map((table) => table.columns.length),
//         backgroundColor: "rgba(75, 192, 192, 0.6)",
//       },
//       {
//         label: "Number of Foreign Keys",
//         data: schema.map(
//           (table) => table.columns.filter((col) => col.foreignKey).length
//         ),
//         backgroundColor: "rgba(153, 102, 255, 0.6)",
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { position: "top" as const },
//       title: { display: true, text: "Table Statistics" },
//     },
//   };

//   return <Bar data={data} options={options} />;
// }
