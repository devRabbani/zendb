// "use client";

// import { useState, useEffect } from "react";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Loader2, Info } from "lucide-react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// import ForceGraph2D from "react-force-graph-2d";
// import CodeEditor from "./code-editor";

// const formSchema = z.object({
//   tableStructure: z.string().min(1, {
//     message: "Table structure is required",
//   }),
// });

// type Column = {
//   name: string;
//   type: string;
//   constraints: string[];
// };

// type Table = {
//   name: string;
//   columns: Column[];
// };

// type Suggestion = {
//   type: "1NF" | "2NF" | "3NF" | "4NF" | "5NF" | "BCNF";
//   message: string;
//   severity: "low" | "medium" | "high";
//   details: string;
// };

// type Dependency = {
//   determinant: string[];
//   dependent: string[];
// };

// export default function NormalizationTool() {
//   const [tables, setTables] = useState<Table[]>([]);
//   const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [graphData, setGraphData] = useState({ nodes: [], links: [] });
//   const [dependencies, setDependencies] = useState<Dependency[]>([]);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       tableStructure: "",
//     },
//   });

//   const analyzeNormalization = async (values: z.infer<typeof formSchema>) => {
//     setIsAnalyzing(true);
//     setError(null);
//     setSuggestions([]);

//     try {
//       const parsedTables = parseTableStructure(values.tableStructure);
//       setTables(parsedTables);

//       const newSuggestions: Suggestion[] = [];
//       const newDependencies: Dependency[] = [];

//       parsedTables.forEach((table) => {
//         // 1NF Check
//         const multiValueColumns = table.columns.filter(
//           (col) =>
//             col.type.toLowerCase().includes("array") ||
//             col.type.toLowerCase().includes("json")
//         );
//         if (multiValueColumns.length > 0) {
//           newSuggestions.push({
//             type: "1NF",
//             message: `Table ${table.name}: Potential 1NF violation detected.`,
//             severity: "high",
//             details: `Consider splitting columns ${multiValueColumns
//               .map((c) => c.name)
//               .join(", ")} into separate tables to achieve atomic values.`,
//           });
//         }

//         // 2NF Check
//         const potentialKeys = table.columns.filter(
//           (col) =>
//             col.name.toLowerCase().includes("id") ||
//             col.constraints.includes("PRIMARY KEY")
//         );
//         if (potentialKeys.length > 1) {
//           newSuggestions.push({
//             type: "2NF",
//             message: `Table ${table.name}: Potential 2NF violation detected.`,
//             severity: "medium",
//             details: `Multiple potential keys detected. Ensure all non-key attributes are fully functionally dependent on the entire primary key, not just a part of it.`,
//           });
//         }

//         // 3NF and BCNF Check
//         const nonKeyColumns = table.columns.filter(
//           (col) => !potentialKeys.includes(col)
//         );
//         if (nonKeyColumns.length > 5) {
//           newSuggestions.push({
//             type: "3NF",
//             message: `Table ${table.name}: Potential 3NF or BCNF violation detected.`,
//             severity: "medium",
//             details: `Large number of non-key attributes. Check for transitive dependencies and ensure every non-prime attribute is non-transitively dependent on every key.`,
//           });
//         }

//         // 4NF Check (simplified)
//         const potentialMultiValuedDependencies = nonKeyColumns.filter(
//           (col) =>
//             col.name.toLowerCase().includes("list") ||
//             col.name.toLowerCase().includes("array")
//         );
//         if (potentialMultiValuedDependencies.length > 0) {
//           newSuggestions.push({
//             type: "4NF",
//             message: `Table ${table.name}: Potential 4NF violation detected.`,
//             severity: "low",
//             details: `Columns ${potentialMultiValuedDependencies
//               .map((c) => c.name)
//               .join(
//                 ", "
//               )} might represent multi-valued dependencies. Consider further normalization.`,
//           });
//         }

//         // Simulate functional dependencies for visualization
//         potentialKeys.forEach((key) => {
//           nonKeyColumns.forEach((col) => {
//             newDependencies.push({
//               determinant: [key.name],
//               dependent: [col.name],
//             });
//           });
//         });
//       });

//       setSuggestions(newSuggestions);
//       setDependencies(newDependencies);
//       setGraphData(generateGraphData(parsedTables, newDependencies));
//     } catch (err) {
//       setError(
//         "Failed to parse table structure. Please check your input format."
//       );
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const parseTableStructure = (structure: string): Table[] => {
//     const tables: Table[] = [];
//     const tableStrings = structure.split(/\n{2,}/);

//     tableStrings.forEach((tableString) => {
//       const [tableName, ...columnStrings] = tableString.split("\n");
//       const columns: Column[] = columnStrings.map((colString) => {
//         const [name, type, ...constraints] = colString.split(/\s+/);
//         return { name, type, constraints };
//       });
//       tables.push({ name: tableName.trim(), columns });
//     });

//     return tables;
//   };

//   const generateGraphData = (tables: Table[], dependencies: Dependency[]) => {
//     const nodes = tables.flatMap((table) => [
//       { id: table.name, group: 1, label: table.name },
//       ...table.columns.map((col) => ({
//         id: `${table.name}.${col.name}`,
//         group: 2,
//         label: col.name,
//       })),
//     ]);

//     const links = [
//       ...tables.flatMap((table) =>
//         table.columns.map((col) => ({
//           source: table.name,
//           target: `${table.name}.${col.name}`,
//           value: 1,
//         }))
//       ),
//       ...dependencies.flatMap((dep) =>
//         dep.dependent.flatMap((d) =>
//           dep.determinant.map((det) => ({
//             source: det,
//             target: d,
//             value: 2,
//           }))
//         )
//       ),
//     ];

//     return { nodes, links };
//   };

//   return (
//     <Card className="w-full max-w-6xl mx-auto">
//       <CardHeader>
//         <CardTitle>Advanced Normalization Assistant</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(analyzeNormalization)}
//             className="space-y-8"
//           >
//             <FormField
//               control={form.control}
//               name="tableStructure"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Table Structure</FormLabel>
//                   <FormControl>
//                     {/* <Textarea
//                       placeholder="Enter your table structure here"
//                       className="min-h-[200px] font-mono"
//                       {...field}
//                     /> */}
//                     <CodeEditor
//                       value={field.value}
//                       onValueChange={field.onChange}
//                     />
//                   </FormControl>
//                   <FormDescription>
//                     Enter table structures (one per paragraph, columns on
//                     separate lines)
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit" disabled={isAnalyzing}>
//               {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Analyze Normalization
//             </Button>
//           </form>
//         </Form>

//         {error && (
//           <Alert variant="destructive" className="mt-4">
//             <AlertTitle>Error</AlertTitle>
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {tables.length > 0 && (
//           <Tabs defaultValue="structure" className="mt-8">
//             <TabsList>
//               <TabsTrigger value="structure">Table Structure</TabsTrigger>
//               <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
//               <TabsTrigger value="visualization">Visualization</TabsTrigger>
//               <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
//             </TabsList>
//             <TabsContent value="structure">
//               <SyntaxHighlighter
//                 language="sql"
//                 style={vscDarkPlus}
//                 className="text-sm"
//               >
//                 {tables
//                   .map((table) =>
//                     `
// CREATE TABLE ${table.name} (
//   ${table.columns
//     .map((col) => `${col.name} ${col.type} ${col.constraints.join(" ")}`)
//     .join(",\n  ")}
// );
//                 `.trim()
//                   )
//                   .join("\n\n")}
//               </SyntaxHighlighter>
//             </TabsContent>
//             <TabsContent value="suggestions">
//               {suggestions.length > 0 ? (
//                 <ul className="space-y-4">
//                   {suggestions.map((suggestion, index) => (
//                     <li
//                       key={index}
//                       className={`p-4 rounded ${
//                         suggestion.severity === "high"
//                           ? "bg-red-100 text-red-800"
//                           : suggestion.severity === "medium"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-blue-100 text-blue-800"
//                       }`}
//                     >
//                       <h3 className="font-bold">
//                         {suggestion.type}: {suggestion.message}
//                       </h3>
//                       <p className="mt-2">{suggestion.details}</p>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No normalization issues detected.</p>
//               )}
//             </TabsContent>
//             <TabsContent value="visualization">
//               <div style={{ height: "600px" }}>
//                 <ForceGraph2D
//                   graphData={graphData}
//                   nodeLabel="label"
//                   nodeColor={(node) =>
//                     node.group === 1 ? "#ff6b6b" : "#4ecdc4"
//                   }
//                   linkColor={(link) =>
//                     link.value === 1 ? "#45b7d1" : "#f9d56e"
//                   }
//                   linkDirectionalArrowLength={3}
//                   linkDirectionalArrowRelPos={1}
//                   linkCurvature={0.25}
//                 />
//               </div>
//             </TabsContent>
//             <TabsContent value="dependencies">
//               <h3 className="text-lg font-semibold mb-4">
//                 Functional Dependencies
//               </h3>
//               <ul className="space-y-2">
//                 {dependencies.map((dep, index) => (
//                   <li key={index} className="p-2 bg-gray-900 rounded">
//                     {dep.determinant.join(", ")} → {dep.dependent.join(", ")}
//                   </li>
//                 ))}
//               </ul>
//             </TabsContent>
//           </Tabs>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
