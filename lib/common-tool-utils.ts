import { FOREIGN_KEY_REGEX } from "./constants";
import { Column, Table } from "./types";

// Parse Simple text Based Schema
export const parseSchema = (input: string): Table[] => {
  const tables = input
    .trim()
    .split(/\n{2,}/) // Split by empty lines 2 or more \n
    .map((tableStr) => {
      const [tableName, ...columnStrs] = tableStr
        .split("\n")
        .map((line) => line.trim());

      const columns = columnStrs.map((colStr) => {
        const [name, type, ...fkParts] = colStr
          .split(" ")
          .filter((item) => item); //Filter is to get rid off extra spaces
        const column: Column = { name, type };

        if (fkParts.length > 0) {
          const fkPartsJoined = fkParts.join(" ");
          const match = fkPartsJoined.match(FOREIGN_KEY_REGEX) || [];
          if (match) {
            // To get both parentheses and no parentheses references
            const [, fkTable, fkColumnInParens, fkColumnNoParens] = match;
            const fkColumn = fkColumnInParens || fkColumnNoParens;

            if (fkTable && fkColumn) {
              column.foreignKey = { table: fkTable, column: fkColumn };
            }
          }
          //   Checking for Unique
          if (fkPartsJoined.toLowerCase().includes("unique")) {
            column.unique = true;
          }
        }
        return column;
      });
      return { name: tableName.trim(), columns };
    });

  return tables;
};

// Check if a table is a classic junction table
function isJunctionTable(table: Table): boolean {
  const foreignKeys = table.columns.filter((col) => col.foreignKey);
  return (
    foreignKeys.length === 2 &&
    new Set(foreignKeys.map((col) => col.foreignKey!.table)).size === 2 &&
    table.columns.length <= 3
  );
}

// Generate ERD
export const generateERD = (schema: Table[]): string => {
  let mermaidSyntax: string = "erDiagram\n";
  const relationships = new Set<string>();

  // Determine relationship type
  function getRelationshipType(
    table1: string,
    table2: string,
    column: Column
  ): string {
    const isUnique = column.name === "id" || column.unique;

    const isManyToMany = schema.some(
      (t) =>
        isJunctionTable(t) &&
        t.columns.some((c) => c.foreignKey?.table === table1) &&
        t.columns.some((c) => c.foreignKey?.table === table2)
    );

    if (isManyToMany) return "}o--o{";
    return isUnique ? "||--||" : "||--o{";
  }

  schema.forEach((table) => {
    mermaidSyntax += `    ${table.name} {\n`;
    table.columns.forEach((column) => {
      const keyType =
        column.name === "id" ? "PK" : column.foreignKey ? "FK" : "";
      mermaidSyntax += `        ${column.type} ${column.name}${
        keyType ? ` ${keyType}` : ""
      }\n`;

      if (column.foreignKey) {
        const relationType = getRelationshipType(
          table.name,
          column.foreignKey.table,
          column
        );
        const relationship = `    ${column.foreignKey.table} ${relationType} ${table.name} : "${column.name}"\n`;
        relationships.add(relationship);
      }
    });
    mermaidSyntax += "    }\n";
  });

  mermaidSyntax += Array.from(relationships).join("\n");

  return mermaidSyntax;
};

// Download SVG
export const downloadSVG = (svg: string) => {
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);
  const downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = "diagram.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};
