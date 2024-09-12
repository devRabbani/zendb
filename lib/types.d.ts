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

export type SchemaType = "prisma" | "simple";
