import { Parser } from "node-sql-parser";
import type { IndexAnalysisResult, IndexSuggestion } from "./types";

type Impact = "High" | "Medium" | "Low";

const createIndexSuggestion = (
  table: string,
  columns: string[],
  impact: Impact
): IndexSuggestion => {
  const indexName = `idx_${table}_${columns.join("_")}`;
  return {
    indexName,
    columns,
    table,
    impact,
  };
};

export const analyzeIndexQueries = (queries: string): IndexAnalysisResult => {
  const whereConditions: { [key: string]: Set<string> } = {};
  const joinConditions: { [key: string]: Set<string> } = {};
  const orderByColumns: { [key: string]: Set<string> } = {};
  const groupByColumns: { [key: string]: Set<string> } = {};
  const aliasToTable: { [key: string]: string } = {};
  const astJSON: string[] = [];

  queries.split(";").forEach((query) => {
    if (!query.trim()) return;

    const parser = new Parser();
    const ast = parser.astify(query.trim());
    console.log(ast);
    astJSON.push(JSON.stringify(ast, null, 2));
    if (Array.isArray(ast)) {
      ast.forEach((statement) => analyzeStatement(statement));
    } else {
      analyzeStatement(ast);
    }
  });

  function analyzeWhereClause(whereClause: any, defaultTable: string) {
    if (whereClause.operator === "AND" || whereClause.operator === "OR") {
      analyzeWhereClause(whereClause.left, defaultTable);
      analyzeWhereClause(whereClause.right, defaultTable);
    }
    // For Column Ref
    if (whereClause.left && whereClause.left.type === "column_ref") {
      const table = aliasToTable[whereClause.left.table] || defaultTable;
      whereConditions[table] = whereConditions[table] || new Set();
      whereConditions[table].add(whereClause.left.column);
    }
    if (whereClause.right && whereClause.right.type === "column_ref") {
      const table = aliasToTable[whereClause.right.table] || defaultTable;
      whereConditions[table] = whereConditions[table] || new Set();
      whereConditions[table].add(whereClause.right.column);
    }
    // For SUb queries
    if (whereClause.left?.ast) {
      analyzeStatement(whereClause.left.ast);
    }
    if (whereClause.right?.ast) {
      analyzeStatement(whereClause.right.ast);
    }
  }

  function analyzeJoinCondition(
    joinCondition: any,
    joinTable: string,
    mainTable: string
  ) {
    if (
      joinCondition.left.type === "column_ref" &&
      joinCondition.right.type === "column_ref"
    ) {
      const leftTable = aliasToTable[joinCondition.left.table] || mainTable;
      const rightTable = aliasToTable[joinCondition.right.table] || joinTable;

      joinConditions[leftTable] = joinConditions[leftTable] || new Set();
      joinConditions[leftTable].add(joinCondition.left.column);
      joinConditions[rightTable] = joinConditions[rightTable] || new Set();
      joinConditions[rightTable].add(joinCondition.right.column);
    }
    // Handle subqueries in JOIN conditions
    if (joinCondition.left?.ast) {
      analyzeStatement(joinCondition.left.ast);
    }
    if (joinCondition.right?.ast) {
      analyzeStatement(joinCondition.right.ast);
    }
  }

  function analyzeStatement(ast: any) {
    if (ast.type !== "select") return;

    // Analyze FROM clause
    if (ast.from) {
      ast.from.forEach((fromItem: any) => {
        const table = fromItem.table;
        if (table) {
          if (fromItem.as) {
            aliasToTable[fromItem.as] = table;
          }
        }
      });
    }

    // Analyze WHERE clause
    if (ast.where) {
      analyzeWhereClause(ast.where, ast.from[0].table);
    }

    // Analyze JOIN conditions
    if (ast.from && ast.from.length > 1) {
      ast.from.slice(1).forEach((joinItem: any) => {
        //   Handle Left Subquery part
        if (joinItem?.expr?.ast) analyzeStatement(joinItem?.expr?.ast);

        if (joinItem.on) {
          analyzeJoinCondition(
            joinItem.on,
            joinItem?.table || joinItem?.as,
            ast.from[0].table
          );
        }
      });
    }

    // Analyze ORDER BY clause
    if (ast.orderby) {
      ast.orderby.forEach((orderItem: any) => {
        if (orderItem.expr.type === "column_ref") {
          const table = aliasToTable[orderItem.expr.table] || ast.from[0].table;
          orderByColumns[table] = orderByColumns[table] || new Set();
          orderByColumns[table].add(orderItem.expr.column);
        }
      });
    }

    // Analyze GROUP BY clause
    if (ast.groupby) {
      ast.groupby.columns.forEach((groupItem: any) => {
        if (groupItem.type === "column_ref") {
          const table = aliasToTable[groupItem.table] || ast.from[0].table;
          groupByColumns[table] = groupByColumns[table] || new Set();
          groupByColumns[table].add(groupItem.column);
        }
      });
    }

    // Analyze subqueries within SELECT clause
    if (ast.columns) {
      ast.columns.forEach((column: any) => {
        if (column.expr?.ast) {
          // Recursively analyze the subquery
          analyzeStatement(column.expr.ast);
        }
      });
    }

    // Analyze CTEs within SELECT clause
    if (ast.with) {
      ast.with.forEach((cte: any) => {
        if (cte?.stmt?.ast) analyzeStatement(cte.stmt.ast);
      });
    }

    // Analyze subqueries within WHERE clause
    if (ast.where?.right?.ast) {
      // Recursively analyze the subquery
      analyzeStatement(ast.where.right.ast);
    }
    if (ast.where?.left?.ast) {
      analyzeStatement(ast.where.left.ast);
    }
  }

  const suggestions: IndexSuggestion[] = [];

  // Generate index suggestions
  Object.entries(whereConditions).forEach(([table, columns]) => {
    columns.forEach((column) => {
      suggestions.push(createIndexSuggestion(table, [column], "Medium"));
    });
  });

  Object.entries(joinConditions).forEach(([table, columns]) => {
    columns.forEach((column) => {
      suggestions.push(createIndexSuggestion(table, [column], "High"));
    });
  });

  Object.entries(orderByColumns).forEach(([table, columns]) => {
    columns.forEach((column) => {
      suggestions.push(createIndexSuggestion(table, [column], "Low"));
    });
  });

  Object.entries(groupByColumns).forEach(([table, columns]) => {
    columns.forEach((column) => {
      suggestions.push(createIndexSuggestion(table, [column], "Low"));
    });
  });

  // Composite index suggestions
  Object.entries(whereConditions).forEach(([table, columns]) => {
    if (columns.size > 1) {
      suggestions.push(
        createIndexSuggestion(table, Array.from(columns), "High")
      );
    }
  });

  // Remove duplicate suggestions
  const uniqueSuggestions = suggestions.filter(
    (suggestion, index, self) =>
      index === self.findIndex((t) => t.indexName === suggestion.indexName)
  );

  return {
    suggestions: uniqueSuggestions,
    ast: astJSON,
  };
};
