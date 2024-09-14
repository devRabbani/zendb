import type { FunctionalDependency } from "@/lib/types";
import { ScrollArea } from "../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function FDTable({
  dependencies,
}: {
  dependencies: FunctionalDependency[];
}) {
  if (!dependencies?.length) return;
  return (
    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Table</TableHead>
            <TableHead>Determinant</TableHead>
            <TableHead>Dependent</TableHead>
            <TableHead>Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dependencies.map((dep, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium whitespace-nowrap">
                {dep.table}
              </TableCell>
              <TableCell>{dep.determinant.join(", ")}</TableCell>
              <TableCell>{dep.dependent}</TableCell>
              <TableCell>{(dep.confidence * 100).toFixed(2)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
