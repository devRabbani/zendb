"use client";

import { useCallback, useState } from "react";
import TypeEditor from "./type-editor";
import type { TypeAnalysisResult } from "@/lib/types";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type ResultType = TypeAnalysisResult | null;

export default function TypeOptimizer() {
  const [result, setResult] = useState<ResultType>(null);

  const handleSaveResult = useCallback(
    (value: ResultType) => setResult(value),
    []
  );

  return (
    <>
      <TypeEditor callbackFn={handleSaveResult} />
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analaysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                  <div className="space-y-1">
                    <h3 className="font-semibold">Suggested Type:</h3>
                    <p className="text-xl font-bold text-primary">
                      {result.suggestedType}
                    </p>
                  </div>
                </div>
                {result.alternatives && result.alternatives.length > 0 && (
                  <div className="flex items-start space-x-2">
                    <Info className="w-5 h-5 text-blue-500 mt-1" />
                    <div className="space-y-1">
                      <h3 className="font-semibold">Alternatives:</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {result.alternatives.map((alt, index) => (
                          <Badge key={index} variant="secondary">
                            {alt}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {result.description && (
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-1" />
                  <div className="space-y-1">
                    <h3 className="font-semibold">Description:</h3>
                    <p className="text-sm text-muted-foreground">
                      {result.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
