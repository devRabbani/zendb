import type { NormSuggestionType, TableConstraint, Column } from "../types";

const check1NF = (table: TableConstraint): NormSuggestionType[] => {
  const multiValueColumns = table.columns.filter(isMultiValueColumn);

  if (multiValueColumns.length > 0) {
    return [
      {
        type: "1NF",
        message: `Table ${table.name}: Potential 1NF violation detected.`,
        severity: "high",
        details: `Consider splitting columns ${multiValueColumns
          .map((c) => c.name)
          .join(", ")} into separate tables to achieve atomic values.`,
      },
    ];
  }
  return [];
};

const check2NF = (table: TableConstraint): NormSuggestionType[] => {
  const potentialKeys = getPotentialKeys(table);
  const nonKeyColumns = getNonKeyColumns(table, potentialKeys);

  if (potentialKeys.length > 1 && nonKeyColumns.length > 0) {
    const partialDependencies = findPartialDependencies(
      potentialKeys,
      nonKeyColumns
    );
    if (partialDependencies.length > 0) {
      return [
        {
          type: "2NF",
          message: `Table ${table.name}: 2NF violation detected.`,
          severity: "medium",
          details: `Attributes ${partialDependencies.join(
            ", "
          )} appear to have partial dependencies. Consider moving them to separate tables.`,
        },
      ];
    }
  }
  return [];
};

const check3NFandBCNF = (table: TableConstraint): NormSuggestionType[] => {
  const potentialKeys = getPotentialKeys(table);
  const nonKeyColumns = getNonKeyColumns(table, potentialKeys);

  const transitiveDependencies = findTransitiveDependencies(nonKeyColumns);
  if (transitiveDependencies.length > 0) {
    return [
      {
        type: "3NF",
        message: `Table ${table.name}: 3NF or BCNF violation detected.`,
        severity: "medium",
        details: `Potential transitive dependencies found: ${transitiveDependencies.join(
          ", "
        )}. Consider further normalization.`,
      },
    ];
  }
  return [];
};

const check4NF = (table: TableConstraint): NormSuggestionType[] => {
  const multiValuedDependencies = findMultiValuedDependencies(table);
  if (multiValuedDependencies.length > 0) {
    return [
      {
        type: "4NF",
        message: `Table ${table.name}: Potential 4NF violation detected.`,
        severity: "low",
        details: `Columns ${multiValuedDependencies.join(
          ", "
        )} might represent multi-valued dependencies. Consider further normalization.`,
      },
    ];
  }
  return [];
};

const checkDenormalization = (table: TableConstraint): NormSuggestionType[] => {
  if (table.columns.length > 20) {
    return [
      {
        type: "Denormalization",
        message: `Table ${table.name}: Potential over-normalization.`,
        severity: "low",
        details: `This table has a large number of columns. Consider if denormalization might improve query performance.`,
      },
    ];
  }
  return [];
};

const isMultiValueColumn = (col: Column): boolean =>
  col.type.toLowerCase().includes("array") ||
  col.type.toLowerCase().includes("json") ||
  col.type.toLowerCase().includes("[]");

const getPotentialKeys = (table: TableConstraint): Column[] =>
  table.columns.filter(
    (col) =>
      col.name.toLowerCase().includes("id") ||
      col.constraints.includes("PRIMARY KEY") ||
      col.constraints.includes("UNIQUE")
  );

const getNonKeyColumns = (
  table: TableConstraint,
  potentialKeys: Column[]
): Column[] => table.columns.filter((col) => !potentialKeys.includes(col));

const findPartialDependencies = (
  potentialKeys: Column[],
  nonKeyColumns: Column[]
): string[] => {
  // APPROX
  return nonKeyColumns
    .filter((col) => {
      // Check if the column name includes part of any potential key name
      return potentialKeys.some((key) => {
        const keyParts = key.name.toLowerCase().split("_");
        return keyParts.some(
          (part) => col.name.toLowerCase().includes(part) && part.length > 2
        );
      });
    })
    .map((col) => col.name);
};

const findTransitiveDependencies = (nonKeyColumns: Column[]): string[] => {
  const transitiveDepCandidates: string[] = [];
  //   APPROX
  nonKeyColumns.forEach((col1) => {
    nonKeyColumns.forEach((col2) => {
      if (col1 !== col2) {
        // Check for potential transitive dependency
        if (
          col1.name.toLowerCase().includes(col2.name.toLowerCase()) ||
          col2.name.toLowerCase().includes(col1.name.toLowerCase())
        ) {
          transitiveDepCandidates.push(col1.name);
        }
      }
    });
  });

  // Remove duplicates
  return Array.from(new Set(transitiveDepCandidates));
};

const findMultiValuedDependencies = (table: TableConstraint): string[] => {
  return table.columns
    .filter(
      (col) =>
        col.name.toLowerCase().includes("list") ||
        col.name.toLowerCase().includes("array") ||
        col.type.toLowerCase().includes("array") ||
        col.type.toLowerCase().includes("json") ||
        (col.type.toLowerCase().includes("varchar") &&
          col.name.toLowerCase().includes("tags"))
    )
    .map((col) => col.name);
};

const checkForRepeatingGroups = (
  table: TableConstraint
): NormSuggestionType[] => {
  const repeatingGroups = table.columns
    .filter((col) => /\d+$/.test(col.name))
    .reduce((groups, col) => {
      const baseName = col.name.replace(/\d+$/, "");
      if (!groups[baseName]) groups[baseName] = [];
      groups[baseName].push(col.name);
      return groups;
    }, {} as Record<string, string[]>);

  // Checking if there are any repeating groups Because sometimes we need col name which end with digits
  const violations = Object.entries(repeatingGroups).filter(
    ([_, group]) => group.length > 1
  );

  if (violations.length > 0) {
    return [
      {
        type: "1NF",
        message: `Table ${table.name}: Repeating groups detected.`,
        severity: "high",
        details: `Consider normalizing these column groups: ${violations
          .map(([base, group]) => `${base} (${group.join(", ")})`)
          .join("; ")}`,
      },
    ];
  }

  return [];
};

const checkForCompoundAttributes = (
  table: TableConstraint
): NormSuggestionType[] => {
  const excludeColumn = new Set(["created_at", "updated_at"]);

  const shouldExcludeCol = (colName: string) => {
    if (excludeColumn.has(colName)) return true;

    return colName.endsWith("_id");
  };
  const compoundAttributes = table.columns
    .filter(
      (col) =>
        col.name.includes("_") && !shouldExcludeCol(col.name.toLowerCase())
    )
    .map((col) => col.name);

  if (compoundAttributes.length > 0) {
    return [
      {
        type: "1NF",
        message: `Table ${table.name}: Potential compound attributes detected.`,
        severity: "medium",
        details: `Consider splitting these attributes: ${compoundAttributes.join(
          ", "
        )}`,
      },
    ];
  }

  return [];
};

const checkForRedundantData = (
  schema: TableConstraint[]
): NormSuggestionType[] => {
  const suggestions: NormSuggestionType[] = [];
  const columnOccurrences: Record<string, string[]> = {};

  // Define common columns to exclude
  const commonColumns = new Set([
    "id",
    "created_at",
    "updated_at",
    "createdAt",
    "updatedAt",
  ]);

  const shouldExcludeColumn = (colName: string): boolean => {
    // Check if the column name is a common column
    if (commonColumns.has(colName)) return true;
    // Check if the column name ends with the suffix 'id'
    return colName.endsWith("id");
  };

  schema.forEach((table) => {
    table.columns.forEach((col) => {
      // Skip common columns
      if (!shouldExcludeColumn(col.name.toLowerCase())) {
        if (!columnOccurrences[col.name]) columnOccurrences[col.name] = [];
        columnOccurrences[col.name].push(table.name);
      }
    });
  });

  Object.entries(columnOccurrences)
    .filter(([_, tables]) => tables.length > 1)
    .forEach(([colName, tables]) => {
      suggestions.push({
        type: "Redundancy",
        message: `Column ${colName} appears in multiple tables.`,
        severity: "low",
        details: `This column is present in tables: ${tables.join(
          ", "
        )}. Consider if this represents redundant data.`,
      });
    });

  return suggestions;
};

export const analyzeNormSuggestions = (
  schema: TableConstraint[]
): NormSuggestionType[] => {
  const suggestions: NormSuggestionType[] = [];

  schema.forEach((table) => {
    suggestions.push(...check1NF(table));
    suggestions.push(...check2NF(table));
    suggestions.push(...check3NFandBCNF(table));
    suggestions.push(...check4NF(table));
    suggestions.push(...checkDenormalization(table));
    suggestions.push(...checkForRepeatingGroups(table));
    suggestions.push(...checkForCompoundAttributes(table));
  });

  suggestions.push(...checkForRedundantData(schema));

  return suggestions;
};
