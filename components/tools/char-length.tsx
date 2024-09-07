"use client";

import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

export default function CharLength() {
  const [charLength, setCharLength] = useState<number>(0);

  const calculateBinary = (num: number) => {
    return num.toString(2);
  };

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
    const intNum = parseInt(e.target.value, 10);
    setCharLength(isNaN(intNum) ? 0 : intNum);
  };

  const binary = calculateBinary(charLength);
  const bits = calculateBits(binary);

  const suggetions = getSuggestion(charLength, bits);
  return (
    <div>
      <input
        className="text-black"
        type="text"
        onChange={handleInputChange}
        value={charLength}
      />
      <p>Binary: {binary}</p>
      <p>Bits: {bits}</p>
      <p>{suggetions}</p>
    </div>
  );
}
