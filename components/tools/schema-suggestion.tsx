"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { SchemaSuggestion, Table } from "@/lib/types";
import { analyzeSchemaSuggestions } from "@/lib/tools-utils/schema-suggestion";

export default function SchemaSuggestions({ schema }: { schema: Table[] }) {
  const [openSuggestions, setOpenSuggestions] = useState<number[]>([]);

  const toggleSuggestion = (index: number) => {
    setOpenSuggestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const suggestions = analyzeSchemaSuggestions(schema);

  return (
    <Card className="min-h-[500px]">
      <CardHeader>
        <CardTitle>Schema Suggestions</CardTitle>
        <CardDescription>
          Recommendations for improving your database schema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.map((suggestion, index) => (
          <SuggestionItem
            key={index}
            suggestion={suggestion}
            isOpen={openSuggestions.includes(index)}
            onToggle={() => toggleSuggestion(index)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function SuggestionItem({
  suggestion,
  isOpen,
  onToggle,
}: {
  suggestion: SchemaSuggestion;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="mb-4">
      <CollapsibleTrigger asChild>
        <Alert
          variant={
            suggestion.type === "warning"
              ? "destructive"
              : suggestion.type === "good"
              ? "success"
              : "default"
          }
          className="py-4 cursor-pointer transition-colors hover:bg-secondary/60 shadow-sm"
        >
          <div className="flex item-center justify-between">
            <div className="flex items-center space-x-2">
              {suggestion.type === "warning" && (
                <AlertCircle className="h-4 w-4" />
              )}
              {suggestion.type === "improvement" && (
                <AlertTriangle className="h-4 w-4" />
              )}
              {suggestion.type === "good" && (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <AlertTitle>{suggestion.message}</AlertTitle>
            </div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </Alert>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <Card className="shadow">
          <CardContent className="pt-4">
            <AlertDescription>{suggestion.details}</AlertDescription>
            <div className="mt-2">
              <Badge
                variant={
                  suggestion.impact === "High"
                    ? "destructive"
                    : suggestion.impact === "Medium"
                    ? "default"
                    : "secondary"
                }
              >
                Impact: {suggestion.impact}
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold">Affected Tables:</h4>
              <div className="flex gap-2">
                {suggestion.affectedTables.map((table) => (
                  <Badge variant="outline" key={table}>
                    {table}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
