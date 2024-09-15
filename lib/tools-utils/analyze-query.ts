import type { AST } from "node-sql-parser";
import { ComplexityAnalysis, ComplexityFactor } from "../types";

export const analyzeComplexity = (ast: AST): ComplexityAnalysis => {
  const factors: ComplexityFactor[] = [];
  let totalScore = 0;

  // Analyze JOIN operations
  const joinCount = countJoins(ast);
  if (joinCount > 0) {
    const joinScore = joinCount * 2;
    factors.push({
      name: "JOINs",
      score: joinScore,
      explanation: `${joinCount} JOIN(s) detected. Each JOIN adds complexity to the query execution.`,
    });
    totalScore += joinScore;
  }

  // Analyze subqueries
  const subqueryCount = countSubqueries(ast);
  if (subqueryCount > 0) {
    const subqueryScore = subqueryCount * 3;
    factors.push({
      name: "Subqueries",
      score: subqueryScore,
      explanation: `${subqueryCount} subquery(ies) detected. Subqueries can significantly increase query complexity.`,
    });
    totalScore += subqueryScore;
  }

  // Analyze aggregations
  const aggregationCount = countAggregations(ast);
  if (aggregationCount > 0) {
    factors.push({
      name: "Aggregations",
      score: aggregationCount,
      explanation: `${aggregationCount} aggregation function(s) detected. Aggregations require additional processing.`,
    });
    totalScore += aggregationCount;
  }

  // Analyze DISTINCT operations (top-level only)
  if (hasDistinct(ast)) {
    factors.push({
      name: "DISTINCT",
      score: 2,
      explanation:
        "DISTINCT operation detected in the main query. This requires additional processing to remove duplicates.",
    });
    totalScore += 2;
  }

  // Analyze ORDER BY (top-level only)
  const orderByCount = countOrderBy(ast);
  if (orderByCount > 0) {
    const orderByScore = orderByCount;
    factors.push({
      name: "ORDER BY",
      score: orderByScore,
      explanation: `${orderByCount} ORDER BY clause(s) detected in the main query. Sorting can be computationally expensive.`,
    });
    totalScore += orderByScore;
  }

  // Analyze HAVING clause (top-level only)
  if (hasHaving(ast)) {
    factors.push({
      name: "HAVING",
      score: 2,
      explanation:
        "HAVING clause detected in the main query. This adds a filtering step after aggregation.",
    });
    totalScore += 2;
  }

  // Analyze GROUP BY clause (top-level only)
  const groupByCount = countGroupBy(ast);
  if (groupByCount > 0) {
    const groupByScore = groupByCount * 2;
    factors.push({
      name: "GROUP BY",
      score: groupByScore,
      explanation: `${groupByCount} GROUP BY clause(s) detected in the main query. Grouping operations can be resource-intensive.`,
    });
    totalScore += groupByScore;
  }

  // Analyze UNION, INTERSECT, EXCEPT operations
  const setOperations = countSetOperations(ast);
  if (setOperations > 0) {
    const setOperationScore = setOperations * 3;
    factors.push({
      name: "Set Operations",
      score: setOperationScore,
      explanation: `${setOperations} set operation(s) (UNION, INTERSECT, EXCEPT) detected. These operations can be complex.`,
    });
    totalScore += setOperationScore;
  }

  // Analyze window functions
  const windowFunctions = countWindowFunctions(ast);
  if (windowFunctions > 0) {
    const windowFunctionScore = windowFunctions * 2;
    factors.push({
      name: "Window Functions",
      score: windowFunctionScore,
      explanation: `${windowFunctions} window function(s) detected. Window functions add complexity to query processing.`,
    });
    totalScore += windowFunctionScore;
  }

  // Analyze CTEs (Common Table Expressions)
  const cteCount = countCTEs(ast);
  if (cteCount > 0) {
    const cteScore = cteCount * 2;
    factors.push({
      name: "CTEs",
      score: cteScore,
      explanation: `${cteCount} CTE(s) detected. CTEs can add complexity but may also optimize query structure.`,
    });
    totalScore += cteScore;
  }

  // Analyze WHERE clause complexity
  const whereComplexity = analyzeWhereClause(ast);
  if (whereComplexity > 0) {
    factors.push({
      name: "WHERE Clause",
      score: whereComplexity,
      explanation: `WHERE clause complexity score: ${whereComplexity}. Complex conditions increase query processing time.`,
    });
    totalScore += whereComplexity;
  }

  return { factors, totalScore };
};

const countJoins = (ast: any): number => {
  let count = 0;
  if (ast.from && Array.isArray(ast.from)) {
    ast.from.forEach((fromItem: any) => {
      if (fromItem.join) count++;
    });
  }
  return count;
};

const countSubqueries = (ast: any): number => {
  let count = 0;
  JSON.stringify(ast, (_, value) => {
    if (
      value &&
      typeof value === "object" &&
      "type" in value &&
      value.type === "select"
    ) {
      count++;
    }
    return value;
  });
  return count - 1; // To exclude the main query
};

const countAggregations = (ast: any): number => {
  let count = 0;
  JSON.stringify(ast, (_, value) => {
    if (
      value &&
      typeof value === "object" &&
      "type" in value &&
      value.type === "aggr_func"
    ) {
      count++;
    }
    return value;
  });
  return count;
};

const hasDistinct = (ast: any): boolean => {
  return (
    ast.distinct === "DISTINCT" ||
    (ast.options && ast.options.includes("DISTINCT"))
  );
};

const countOrderBy = (ast: any): number => {
  return ast.orderby ? ast.orderby.length : 0;
};

const hasHaving = (ast: any): boolean => {
  return !!ast.having;
};

const countGroupBy = (ast: any): number => {
  return ast.groupby ? ast.groupby.length : 0;
};

const countSetOperations = (ast: any): number => {
  let count = 0;
  if (ast.union) count += ast.union.length;
  if (ast.intersect) count += ast.intersect.length;
  if (ast.except) count += ast.except.length;
  return count;
};

const countWindowFunctions = (ast: any): number => {
  let count = 0;
  JSON.stringify(ast, (_, value) => {
    if (
      value &&
      typeof value === "object" &&
      "type" in value &&
      value.type === "window_func"
    ) {
      count++;
    }
    return value;
  });
  return count;
};

const countCTEs = (ast: any): number => {
  return ast.with ? ast.with.length : 0;
};

const analyzeWhereClause = (ast: any): number => {
  if (!ast.where) return 0;
  let complexity = 0;
  JSON.stringify(ast.where, (_, value) => {
    if (value && typeof value === "object") {
      if (value.type === "binary_expr") complexity++;
      if (value.type === "function") complexity += 2;
    }
    return value;
  });
  return complexity;
};

export const getComplexityLevel = (
  score: number
): { level: string; color: string } => {
  if (score <= 5) return { level: "Low", color: "bg-state-low" };
  if (score <= 10) return { level: "Moderate", color: "bg-state-moderate" };
  if (score <= 20) return { level: "High", color: "bg-state-high" };
  return { level: "Very High", color: "bg-state-very-high" };
};
