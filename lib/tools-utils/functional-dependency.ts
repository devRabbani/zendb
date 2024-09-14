import { FOREIGN_KEY_REGEX } from "../constants";
import type { FunctionalDependency, TableConstraint } from "../types";

export const getFunctionalDependencies = (
  schema: TableConstraint[]
): FunctionalDependency[] => {
  const dependencies: FunctionalDependency[] = [];

  schema.forEach((table) => {
    // Intra-table dependencies
    const primaryKey = table.columns.filter(
      (col) => col.constraints.includes("primary key") || col.name === "id"
    );

    if (primaryKey.length > 0) {
      table.columns.forEach((col) => {
        if (!primaryKey.includes(col)) {
          dependencies.push({
            table: table.name,
            determinant: primaryKey.map((pk) => pk.name),
            dependent: col.name,
            confidence: 1,
            type: "intra-table",
          });
        }
      });
    }

    // Based on column names and types
    table.columns.forEach((col1) => {
      table.columns.forEach((col2) => {
        if (col1 !== col2) {
          let confidence = 0;

          // Name-based
          if (col1.name.toLowerCase().includes(col2.name.toLowerCase())) {
            confidence += 0.3;
          }
          if (
            col1.name.toLowerCase().endsWith("id") &&
            !col2.name.toLowerCase().endsWith("id")
          ) {
            confidence += 0.2;
          }

          // Type-based
          if (
            ["int", "bigint"].includes(col1.type.toLowerCase()) &&
            ["text", "varchar", "char"].includes(col2.type.toLowerCase())
          ) {
            confidence += 0.2;
          }
          if (
            col1.type.toLowerCase() === "datetime" &&
            (col2.name.toLowerCase().includes("created") ||
              col2.name.toLowerCase().includes("updated"))
          ) {
            confidence += 0.4;
          }

          // Constraint-based heuristics
          if (col1.constraints.includes("unique")) {
            confidence += 0.3;
          }
          if (col1.constraints.includes("not null")) {
            confidence += 0.1;
          }

          if (confidence > 0.5) {
            dependencies.push({
              table: table.name,
              determinant: [col1.name],
              dependent: col2.name,
              confidence,
              type: "intra-table",
            });
          }
        }
      });
    });

    // Inter-table dependencies (foreign key relationships)
    table.columns.forEach((col) => {
      const constraintsStr = col.constraints;

      if (
        constraintsStr.includes("foreign key") ||
        constraintsStr.includes("references")
      ) {
        const match = constraintsStr.match(FOREIGN_KEY_REGEX) || [];
        if (match) {
          // To get both parentheses and no parentheses references
          const [, fkTable, fkColumnInParens, fkColumnNoParens] = match;
          const fkColumn = fkColumnInParens || fkColumnNoParens;

          if (fkTable && fkColumn) {
            dependencies.push({
              table: `${table.name} -> ${fkTable}`,
              determinant: [col.name],
              dependent: fkColumn,
              confidence: 0.9,
              type: "inter-table",
            });
          }
        }
      }
    });
  });

  return dependencies;
};

export const generateFDChartData = (dependencies: FunctionalDependency[]) => {
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

export const generateFDMermaid = (dependencies: FunctionalDependency[]) => {
  let diagram = "graph TD\n";

  const tables = new Set<string>();
  const relations = new Set<string>();
  const fdMap = new Map<string, string[]>();

  // Collect data
  dependencies.forEach((fd) => {
    const tableName = fd.table.split(" -> ")[0].toLowerCase();
    tables.add(tableName);

    if (fd.type === "intra-table") {
      if (!fdMap.has(tableName)) {
        fdMap.set(tableName, []);
      }
      fdMap
        .get(tableName)!
        .push(`${fd.determinant.join(", ")} → ${fd.dependent}`);
    } else if (fd.type === "inter-table") {
      const [sourceTable, targetTable] = fd.table.toLowerCase().split(" -> ");
      relations.add(
        `${sourceTable} -->|${fd.determinant.join(", ")}| ${targetTable}`
      );
    }
  });

  // Add table nodes
  tables.forEach((table) => {
    diagram += `    ${table}["${
      table.charAt(0).toUpperCase() + table.slice(1)
    }"]\n`;
  });

  // Add functional dependencies
  tables.forEach((table) => {
    if (fdMap.has(table)) {
      diagram += `    subgraph ${table}_FD[${
        table.charAt(0).toUpperCase() + table.slice(1)
      }_FDs]\n`;
      diagram += `        ${table}_fd["${fdMap.get(table)!.join(", ")}"]\n`;
      diagram += "    end\n";
      diagram += `    ${table} --> ${table}_FD\n`;
    }
  });

  // Add relations between tables
  relations.forEach((relation) => {
    diagram += `    ${relation}\n`;
  });

  return diagram;
};
