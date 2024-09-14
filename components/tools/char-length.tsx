"use client";

import { useCallback, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  PiBinaryDuotone,
  PiCpuDuotone,
  PiLightbulbDuotone,
} from "react-icons/pi";

export default function CharLength() {
  const [charLength, setCharLength] = useState<number>(0);

  const calculateBinary = (num: number) => num.toString(2);

  const calculateBits = (binary: string) => binary.length;

  const getSuggestion = useCallback((num: number, bits: number): string => {
    const currMax = Math.pow(2, bits);
    const prevMax = Math.pow(2, bits - 1);

    // Specific Suggestions for numbers 0, 1, and 2
    if (num === 0) {
      return `The number 0 requires no storage space in most contexts. Consider increasing the value to start utilizing storage efficiently.`;
    } else if (num === 1) {
      return `The number 1 is the smallest non-zero value, requiring minimal storage. Adding more characters will allow you to start utilizing more storage space effectively.`;
    } else if (num === 2) {
      return `The number 2 marks the beginning of bit usage beyond 1. You can store simple data, but increasing the value will unlock greater storage potential with more bits.`;
    }

    // Main Suggestions
    if (num === prevMax) {
      return `You're at the smallest number requiring ${bits} bits. Try decreasing the number to use ${
        bits - 1
      } bits.`;
    } else if (num === currMax - 1) {
      return `Adding one more character will require ${bits + 1} bits.`;
    } else if (currMax - num <= 5) {
      return `Increasing by ${currMax - num} will require ${
        bits + 1
      } bits, but allow for ${
        currMax - num - 1
      } more characters with the same bit count.`;
    } else if (num - prevMax <= 5) {
      return `Decreasing by ${num - prevMax + 1} will reduce storage to ${
        bits - 1
      } bits.`;
    }
    return `You can add up to ${
      currMax - num - 1
    } more characters without increasing the bit count.`;
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseInt(value, 10);

    setCharLength(isNaN(numericValue) ? 0 : Math.min(numericValue, 65000));
  };

  const binary = calculateBinary(charLength);
  const bits = calculateBits(binary);

  const suggetions = getSuggestion(charLength, bits);
  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-9">
        <div className="space-y-2">
          <Label htmlFor="char-length">Enter Character Length</Label>
          <Input
            id="char-length"
            type="number"
            onChange={handleInputChange}
            value={charLength.toString()}
            min="0"
            max="65000"
            placeholder="Enter a number"
            className="text-lg"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <PiBinaryDuotone className="w-5 h-5 text-primary" />
                <span className="font-semibold">Binary Representation:</span>
              </div>
              <div className="grid grid-cols-8 gap-2">
                {binary.split("").map((bit, index) => (
                  <div
                    key={index}
                    className={`w-full aspect-square flex items-center justify-center border-2 rounded-md text-lg font-mono ${
                      bit === "1"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted bg-muted/10 text-muted-foreground"
                    }`}
                  >
                    {bit}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center border space-x-2 p-4 bg-muted dark:bg-muted/30 rounded-md">
              <PiCpuDuotone className="w-5 h-5 text-primary" />
              <span className="font-semibold">Bits used:</span>
              <span className="text-lg font-mono">{bits}</span>
            </div>
          </div>
          <div className="p-4 bg-muted border dark:bg-muted/30 rounded-md flex flex-col h-full">
            <div className="flex items-center space-x-2 mb-4">
              <PiLightbulbDuotone className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Suggestion</h3>
            </div>
            <p className="text-sm">{suggetions}</p>
            <div className="mt-4 text-sm text-muted-foreground/70 ">
              <strong>Tip:</strong> Experiment with different values to see how
              they affect binary representation and storage efficiency.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
