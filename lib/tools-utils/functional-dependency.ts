import { FOREIGN_KEY_REGEX } from "../constants";
import { FunctionalDependency, TableConstraint } from "../types";

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

export function generateFDGraph(dependencies: FunctionalDependency[]): string {
  let graph = "graph TD\n";

  const highConfidenceDeps = dependencies.filter(
    (dep) => dep.confidence >= 0.8
  );

  highConfidenceDeps.forEach((dep, index) => {
    const determinantId = `${dep.table}_${dep.determinant.join("_")}`.replace(
      /\s/g,
      "_"
    );
    const dependentId = `${dep.table}_${dep.dependent}`.replace(/\s/g, "_");

    graph += `  ${determinantId}["${dep.table}: ${dep.determinant.join(
      ", "
    )}"] -->|${dep.confidence.toFixed(2)}| ${dependentId}["${dep.table}: ${
      dep.dependent
    }"]\n`;

    // Add styling based on confidence
    const color = dep.confidence >= 0.9 ? "#22c55e" : "#eab308";
    graph += `  style ${determinantId} fill:${color},stroke:#374151\n`;
    graph += `  style ${dependentId} fill:${color},stroke:#374151\n`;
  });

  return graph;
}
