import { useCallback, useState } from "react";
import CardWrapper from "../card-wrapper";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import CodeEditor from "./code-editor";
import SchemaHelperPopup from "./schema-helper-popup";

export default function QueryEditor() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const onValueChange = useCallback((value: string) => {
    setQuery(value);
  }, []);
  return (
    <CardWrapper>
      <div className="space-y-2.5">
        <div className="flex justify-between item-center">
          <Label htmlFor="code-editor">Paste your DB Schema here</Label>
          <SchemaHelperPopup />
        </div>
        <CodeEditor
          value={query}
          onValueChange={onValueChange}
          placeholder="Enter your SQL query here"
          height="sm"
        />
        <p className="text-[0.8rem] text-muted-foreground">
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
