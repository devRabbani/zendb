import { useCallback, useState } from "react";
import CardWrapper from "../card-wrapper";
import { Label } from "../ui/label";
import CodeEditor from "./code-editor";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { COMMON_TYPES } from "@/lib/constants";
import { Badge } from "../ui/badge";
import { TypeAnalysisResult } from "@/lib/types";
import { analyzeType } from "@/lib/tools-utils/analyze-type";

export default function TypeEditor({
  callbackFn,
}: {
  callbackFn: (value: TypeAnalysisResult | null) => void;
}) {
  const [typeValue, setTypeValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onValueChange = useCallback((value: string) => {
    setTypeValue(value);
  }, []);

  const handleAnalyze = () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = analyzeType(typeValue);
      callbackFn(result);
    } catch (error: any) {
      console.log("Error parsing the type", error?.message);
      setError("Error parsing the type, Try Again!");
      callbackFn(null);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <CardWrapper>
      <div className="space-y-2.5">
        <Label htmlFor="code-editor">Enter your sample value here</Label>
        <CodeEditor
          value={typeValue}
          onValueChange={onValueChange}
          placeholder="Eg: +91 7328372323"
          height="xs"
        />
        <p className="text-[0.8rem] text-muted-foreground">Common Types:</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {COMMON_TYPES.map((type, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground"
              onClick={() => setTypeValue(type.placeholder)}
            >
              {type.label}
            </Badge>
          ))}
        </div>
      </div>
      <Button disabled={isLoading} onClick={handleAnalyze} className="mt-6">
        Analyze Type
      </Button>
      <p className="text-[0.8rem] mt-5 text-muted-foreground">
        Tip: Try different input types to see various SQL type suggestions!
      </p>
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </CardWrapper>
  );
}
