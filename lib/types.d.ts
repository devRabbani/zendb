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
