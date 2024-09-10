"use client";

import Editor from "react-simple-code-editor";
import { ScrollArea } from "../ui/scroll-area";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism.css";
import { cn } from "@/lib/utils";

export default function CodeEditor({
  value,
  onValueChange,
  height = "default",
  placeholder = "Enter your table structure here",
}: {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  height?: "sm" | "default";
}) {
  return (
    <ScrollArea
      className={cn(
        "rounded-md border border-border outline-none focus-within:ring-1 focus-within:ring-ring w-full",
        height === "sm" ? "h-[200px]" : "h-[38vh]"
      )}
    >
      <Editor
        value={value}
        onValueChange={onValueChange}
        highlight={(code) => highlight(code, languages.sql, "sql")}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
        }}
        placeholder={placeholder}
        className={cn(
          "schema-editor w-full ",
          height === "sm" ? "min-h-[199px]" : "min-h-[calc(38vh-1px)]"
        )}
      />
    </ScrollArea>
  );
}
