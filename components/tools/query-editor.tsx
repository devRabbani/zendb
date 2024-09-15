import { useCallback, useState } from "react";
import CardWrapper from "../card-wrapper";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import CodeEditor from "./code-editor";
import { type AST, Parser } from "node-sql-parser";
import { SAMPLE_QUERIES } from "@/lib/constants";

type CallbackInput<T extends boolean> = T extends true ? string : AST | AST[];

interface QueryEditorProps<T extends boolean> {
  btnName: string;
  callbackFn: (value: CallbackInput<T>) => void;
  onlyQuery: T;
}

export default function QueryEditor<T extends boolean>({
  btnName,
  callbackFn,
  onlyQuery,
}: QueryEditorProps<T>) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onValueChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleVisualize = () => {
    setIsLoading(true);
    try {
      if (onlyQuery) {
        (callbackFn as (value: string) => void)(query);
      } else {
        const parse = new Parser();
        const ast = parse.astify(query);
        (callbackFn as (value: AST | AST[]) => void)(ast);
      }
      setError(null);
    } catch (err: any) {
      setError("Failed to parse SQL query. Please check your syntax.");
      console.log("Parsing Error", err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardWrapper>
      <div className="space-y-2.5">
        <Label htmlFor="code-editor">Paste your SQL query here</Label>
        <CodeEditor
          value={query}
          onValueChange={onValueChange}
          placeholder="Enter your SQL query here"
          height="sm"
        />
        <p className="text-[0.8rem] text-muted-foreground">
          Enter a SQL query to visualize and analyze or choose a sample query:
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {SAMPLE_QUERIES.map((sample, index) => (
            <Button
              key={index}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setQuery(sample.query)}
            >
              {sample.name}
            </Button>
          ))}
        </div>
      </div>
      <Button
        disabled={isLoading || query.length < 20}
        onClick={handleVisualize}
        className="mt-6"
      >
        {btnName}
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
