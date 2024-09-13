import type { Suggestion, Table } from "@/lib/types";

export function analyzeSchemaSuggestions(schema: Table[]): Suggestion[] {
  const suggestions: Suggestion[] = [];

  checkPrimaryKeys(schema, suggestions);
  checkManyToManyRelationships(schema, suggestions);
  checkColumnCount(schema, suggestions);
  checkDenormalization(schema, suggestions);
  checkForeignKeyIndexes(schema, suggestions);
  checkCircularDependencies(schema, suggestions);
  checkGoodPractices(schema, suggestions);
  checkDataTypeConsistency(schema, suggestions);

  return suggestions;
}

function checkPrimaryKeys(schema: Table[], suggestions: Suggestion[]) {
  schema.forEach((table) => {
    if (!table.columns.some((col) => col.name.toLowerCase() === "id")) {
      suggestions.push({
        type: "warning",
        message: `Table ${table.name} is missing a primary key`,
        details:
          'Add an "id" column as the primary key for better indexing and relationships. Consider using an auto-incrementing integer or a UUID.',
        impact: "High",
        affectedTables: [table.name],
      });
    }
  });
}

function checkManyToManyRelationships(
  schema: Table[],
  suggestions: Suggestion[]
) {
  schema.forEach((table) => {
    const foreignKeys = table.columns.filter((col) => col.foreignKey);
    if (foreignKeys.length === 2 && table.columns.length <= 3) {
      suggestions.push({
        type: "improvement",
        message: `Table ${table.name} might represent a many-to-many relationship`,
        details:
          "Consider if this junction table is the best way to represent this relationship. Ensure it has a composite primary key of both foreign key columns.",
        impact: "Medium",
        affectedTables: [
          table.name,
          ...foreignKeys.map((item) => item.foreignKey!.table),
        ],
      });
    }
  });
}

function checkColumnCount(schema: Table[], suggestions: Suggestion[]) {
  schema.forEach((table) => {
    if (table.columns.length > 20) {
      suggestions.push({
        type: "warning",
        message: `Table ${table.name} has a high number of columns (${table.columns.length})`,
        details:
          "Consider if some of these columns can be grouped into a separate table to improve maintainability and query performance.",
        impact: "Medium",
        affectedTables: [table.name],
      });
    }
  });
}

function checkDenormalization(schema: Table[], suggestions: Suggestion[]) {
  const columnCounts: { [key: string]: string[] } = {};
  schema.forEach((table) => {
    table.columns.forEach((col) => {
      if (!col.foreignKey) {
        if (!columnCounts[col.name]) columnCounts[col.name] = [];
        columnCounts[col.name].push(table.name);
      }
    });
  });
  Object.entries(columnCounts).forEach(([colName, tables]) => {
    if (
      tables.length > 1 &&
      !["id", "created_at", "updated_at", "createdAt", "updatedAt"].includes(
        colName.toLowerCase()
      )
    ) {
      suggestions.push({
        type: "improvement",
        message: `Column "${colName}" appears in ${tables.length} tables`,
        details:
          "This might indicate denormalization. Consider if this data can be centralized in a single table and referenced by others to reduce data redundancy.",
        impact: "Medium",
        affectedTables: tables,
      });
    }
  });
}

function checkForeignKeyIndexes(schema: Table[], suggestions: Suggestion[]) {
  schema.forEach((table) => {
    table.columns.forEach((col) => {
      if (col.foreignKey && !col.name.toLowerCase().endsWith("_id")) {
        suggestions.push({
          type: "improvement",
          message: `Foreign key column "${col.name}" in table "${table.name}" might need an index`,
          details:
            'Consider adding an index to this foreign key column to improve query performance. Also, consider renaming it to end with "_id" for consistency.',
          impact: "Medium",
          affectedTables: [table.name],
        });
      }
    });
  });
}

function checkCircularDependencies(schema: Table[], suggestions: Suggestion[]) {
  const checkCircularDependenciesRecursive = (
    startTable: string,
    currentTable: string,
    visited: Set<string> = new Set()
  ): boolean => {
    if (visited.has(currentTable)) return currentTable === startTable;
    visited.add(currentTable);
    const table = schema.find((t) => t.name === currentTable);
    if (!table) return false;
    for (const col of table.columns) {
      if (
        col.foreignKey &&
        checkCircularDependenciesRecursive(
          startTable,
          col.foreignKey.table,
          new Set(visited)
        )
      ) {
        return true;
      }
    }
    return false;
  };

  schema.forEach((table) => {
    if (checkCircularDependenciesRecursive(table.name, table.name)) {
      suggestions.push({
        type: "warning",
        message: `Potential circular dependency detected involving table "${table.name}"`,
        details:
          "Circular dependencies can lead to complex queries and maintenance issues. Consider restructuring the relationships to avoid cycles.",
        impact: "High",
        affectedTables: [table.name],
      });
    }
  });
}

function checkGoodPractices(schema: Table[], suggestions: Suggestion[]) {
  if (
    schema.every((table) =>
      table.columns.some((col) => col.name.toLowerCase() === "id")
    )
  ) {
    suggestions.push({
      type: "good",
      message: 'All tables have an "id" column',
      details:
        "This is a good practice for consistent primary key naming and simplifies relationships between tables.",
      impact: "Low",
      affectedTables: schema.map((t) => t.name),
    });
  }

  if (
    schema.every((table) =>
      table.columns.some((col) =>
        ["created_at", "updated_at"].includes(col.name.toLowerCase())
      )
    )
  ) {
    suggestions.push({
      type: "good",
      message: "All tables use timestamp columns (created_at, updated_at)",
      details:
        "This is good for tracking record creation and modification times, which can be crucial for auditing and debugging.",
      impact: "Low",
      affectedTables: schema.map((t) => t.name),
    });
  }
}

function checkDataTypeConsistency(schema: Table[], suggestions: Suggestion[]) {
  const dataTypes: { [key: string]: Set<string> } = {};
  schema.forEach((table) => {
    table.columns.forEach((col) => {
      if (!dataTypes[col.name]) dataTypes[col.name] = new Set();
      dataTypes[col.name].add(col.type);
    });
  });
  Object.entries(dataTypes).forEach(([colName, types]) => {
    if (types.size > 1) {
      suggestions.push({
        type: "warning",
        message: `Inconsistent data types for column "${colName}"`,
        details: `The column "${colName}" has different data types across tables: ${Array.from(
          types
        ).join(", ")}. Consider standardizing the data type for consistency.`,
        impact: "Medium",
        affectedTables: schema
          .filter((t) => t.columns.some((c) => c.name === colName))
          .map((t) => t.name),
      });
    }
  });
}
