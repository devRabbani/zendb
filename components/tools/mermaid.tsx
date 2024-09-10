"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded();
  }, [isMounted]);

  useEffect(() => {
    if (mermaidRef.current) {
      mermaid.render("mermaid-svg", chart).then((result) => {
        mermaidRef.current!.innerHTML = result.svg;
      });
    }
  }, [chart, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  console.log(chart);
  if (!isMounted) return null;

  return <div ref={mermaidRef} className="mermaid" />;
}
