import { useCallback, useState } from "react";
import CardWrapper from "../card-wrapper";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import CodeEditor from "./code-editor";
import SchemaHelperPopup from "./schema-helper-popup";
import { parseSchemaConstraints } from "@/lib/tools-utils";
import { TableConstraint } from "@/lib/types";
import { SAMPLE_SCHEMA } from "@/lib/constants";

export default function NormalizationEditor({
  saveTable,
}: {
  saveTable: (value: TableConstraint[]) => void;
}) {
  const [schema, setSchema] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSchemaChange = useCallback((value: string) => {
    setSchema(value);
  }, []);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setError("");
    try {
      const parsedTables = parseSchemaConstraints(schema);
      saveTable(parsedTables);
    } catch (error: any) {
      console.log("Analyze normalization failed", error?.message);
      setError(
        "Failed to parse table structure. Please check your input format."
      );
      saveTable([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <CardWrapper>
      <div className="space-y-2.5">
        <div className="flex justify-between item-center">
          <Label htmlFor="code-editor">Paste your DB Schema here</Label>
          <div className="hidden min-[500px]:block">
            <SchemaHelperPopup />
          </div>
        </div>
        <CodeEditor value={schema} onValueChange={onSchemaChange} />
        <div className="min-[500px]:hidden">
          <p className="text-[0.8rem] text-muted-foreground">
            Enter your database schema to visualize and analyze or choose a
            sample schema:
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => setSchema(SAMPLE_SCHEMA.simple)}
          >
            Sample Schema
          </Button>
        </div>
        <p className="text-[0.8rem] text-muted-foreground hidden min-[500px]:block">
          Enter your database schema to visualize and analyze. Click help button
          for sample schema and structure.
        </p>
      </div>
      <Button
        disabled={isAnalyzing || schema?.length < 15}
        onClick={handleAnalyze}
        className="mt-6"
      >
        Analyze Schema
      </Button>
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </CardWrapper>
  );
}
