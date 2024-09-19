import { useCallback, useState } from "react";
import CardWrapper from "../card-wrapper";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import CodeEditor from "./code-editor";
import SchemaHelperPopup from "./schema-helper-popup";
import { parseSchema } from "@/lib/tools-utils";
import { Table } from "@/lib/types";
import { SAMPLE_SCHEMA } from "@/lib/constants";

export default function SchemaVisualizerEditor({
  saveParsedSchema,
}: {
  saveParsedSchema: (value: Table[]) => void;
}) {
  const [schema, setSchema] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVisualize = () => {
    setIsLoading(true);
    try {
      const tables = parseSchema(schema);
      saveParsedSchema(tables);
      setError(null);
    } catch (err: any) {
      setError(err?.message);
      saveParsedSchema([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onValueChange = useCallback((value: string) => {
    setSchema(value);
  }, []);

  return (
    <CardWrapper>
      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <Label htmlFor="code-editor">Paste your DB Schema here</Label>
          <div className="hidden min-[500px]:block">
            <SchemaHelperPopup />
          </div>
        </div>
        <CodeEditor value={schema} onValueChange={onValueChange} />
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
      <Button disabled={isLoading} onClick={handleVisualize} className="mt-6">
        Visualize and Analyze
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
