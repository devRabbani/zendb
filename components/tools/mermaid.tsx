"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const chart2 = `
graph [TB]
  A[T] --> B{Is it working?}
  B -->|Yes| C[End]
  B -->|No| D[Try again]
  D --> B
`;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded();
  }, [isMounted]);

  useEffect(() => {
    if (mermaidRef.current) {
      mermaid.render("mermaid-svg", chart2).then((result) => {
        mermaidRef.current!.innerHTML = result.svg;
      });
    }
  }, [chart2, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <div ref={mermaidRef} className="mermaid" />;
}
