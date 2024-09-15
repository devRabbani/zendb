// Index Tools
export type IndexSuggestion = {
  indexName: string;
  columns: string[];
  table: string;
  impact: "High" | "Medium" | "Low";
};

export type IndexAnalysisResult = {
  suggestions: IndexSuggestion[];
  ast: string[];
};

export type Impact = "High" | "Medium" | "Low";

// Schema Tool (Common)

export type Column = {
  name: string;
  type: string;
  foreignKey?: {
    table: string;
    column: string;
  };
  unique?: boolean;
};

export type Table = {
  name: string;
  columns: Column[];
};

export type ColumnsConstraint = {
  name: string;
  type: string;
  constraints: string;
};

export type TableConstraint = {
  name: string;
  columns: ColumnsConstraint[];
};

export type SchemaType = "prisma" | "simple";

export type ImpactLevel = "High" | "Medium" | "Low";

export type ImpactAnalysis = {
  affectedTables: string[];
  cascadeDepth: number;
  impactLevel: ImpactLevel;
  description: string;
};

export type SchemaSuggestion = {
  type: "warning" | "improvement" | "good";
  message: string;
  details: string;
  impact: "High" | "Medium" | "Low";
  affectedTables: string[];
};

export type NormSuggestionType = {
  type: "1NF" | "2NF" | "3NF" | "4NF" | "Denormalization" | "Redundancy";
  severity: "low" | "medium" | "high";
  message: string;
  details: string;
};

export type FunctionalDependency = {
  table: string;
  determinant: string[];
  dependent: string;
  confidence: number;
  type: "intra-table" | "inter-table";
};

export type ComplexityFactor = {
  name: string;
  score: number;
  explanation: string;
};

export type ComplexityAnalysis = {
  factors: ComplexityFactor[];
  totalScore: number;
};
