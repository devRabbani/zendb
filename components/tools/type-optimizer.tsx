"use client";

import { analyzeType } from "@/lib/type-tool-utils";
import { useState } from "react";
import validator from "validator";

export default function TypeOptimizer() {
  const [sample, setSample] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [alternatives, setAlternatives] = useState<string[]>([]);

  const handleAnalyze = () => {
    setAlternatives([]);
    const result = analyzeType(sample);
    setSuggestion(result.suggestedType);
    if (result?.alternatives) {
      setAlternatives(result.alternatives);
    }
  };
  const test = ` { "ass":"ass"}`;

  return (
    <div>
      <input
        type="text"
        className="text-black p-4"
        onChange={(e) => setSample(e.target.value)}
        value={sample}
      />
      <button onClick={handleAnalyze}>Analyze</button>
      <button onClick={() => console.log(validator.isJSON(test), test)}>
        SSs
      </button>
      {suggestion && (
        <div>
          <p className="text-sm font-medium text-gray-700">Suggestion:</p>
          <p className="mt-1 text-sm text-gray-600">{suggestion}</p>
          <p className="text-sm font-medium text-gray-700">ALternatives:</p>
          <p className="mt-1 text-sm text-gray-600">
            {alternatives.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
