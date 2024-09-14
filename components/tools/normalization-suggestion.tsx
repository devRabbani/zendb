import { analyzeNormSuggestions } from "@/lib/tools-utils/normalization-suggestion";
import type { NormSuggestionType, TableConstraint } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NormalizationSuggestion({
  parsedTables,
}: {
  parsedTables: TableConstraint[];
}) {
  const [suggestions, setSuggestions] = useState<NormSuggestionType[]>([]);

  const analyzeSuggestion = () => {
    try {
      const newSuggestions = analyzeNormSuggestions(parsedTables);
      setSuggestions(newSuggestions);
    } catch (error: any) {
      console.log("Generating Suggestion failed:", error?.message);
      toast.error("Error generating suggestion, Check your schema!");
    }
  };

  useEffect(() => {
    analyzeSuggestion();
  }, [parsedTables]);

  return (
    <Card className="min-h-[500px]">
      <CardHeader>
        <CardTitle>Normalization Suggestion</CardTitle>
        <CardDescription>
          This is a preliminary analysis for normalization. A detailed
          evaluation may require further data analysis or expert consultation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length ? (
          <>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <Alert
                  key={index}
                  variant={
                    suggestion.severity === "high"
                      ? "destructive"
                      : suggestion.severity === "medium"
                      ? "medium"
                      : "default"
                  }
                  className="space-x-1 pt-4"
                >
                  {suggestion.severity === "high" && (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  {suggestion.severity === "medium" && (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                  {suggestion.severity === "low" && (
                    <Info className="h-5 w-5" />
                  )}
                  <div>
                    <AlertTitle className="text-base leading-tight">
                      {suggestion.message}
                    </AlertTitle>
                    <AlertDescription>{suggestion.details}</AlertDescription>
                    <Badge
                      variant="outline"
                      className={cn(
                        "mt-2 text-[0.8rem]",
                        suggestion.severity === "high"
                          ? "text-destructive"
                          : suggestion.severity === "medium"
                          ? "text-warning"
                          : ""
                      )}
                    >
                      {suggestion.type}
                    </Badge>
                  </div>
                </Alert>
              ))}
            </div>
          </>
        ) : (
          <p>No normalization issues detected.</p>
        )}
      </CardContent>
    </Card>
  );
}
