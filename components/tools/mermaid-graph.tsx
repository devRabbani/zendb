"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import mermaid from "mermaid";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MermaidGraphProps {
  chart: string;
  className?: string;
}

export default function MermaidGraph({ chart, className }: MermaidGraphProps) {
  const [svg, setSvg] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const controls = useAnimation();

  const isDarkMode = useCallback(() => {
    return document.documentElement.classList.contains("dark");
  }, []);

  const renderMermaid = useCallback(async () => {
    if (graphRef.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: isDarkMode() ? "dark" : "neutral",
        securityLevel: "loose",
        fontFamily: "Inter, sans-serif",
      });

      const { svg } = await mermaid.render("mermaid-graph", chart);
      setSvg(svg);

      // Reset zoom and position
      scale.set(1);
      x.set(0);
      y.set(0);
      controls.set({ x: 0, y: 0, scale: 1 });
    }
  }, [chart, isDarkMode, x, y, scale, controls]);

  useEffect(() => {
    renderMermaid();
  }, [renderMermaid]);

  const handleZoom = useCallback(
    (delta: number) => {
      const newScale = Math.max(0.6, Math.min(scale.get() + delta, 2));
      scale.set(newScale);
      controls.start({ scale: newScale });
    },
    [scale, controls]
  );

  const handleReset = useCallback(() => {
    scale.set(1);
    x.set(0);
    y.set(0);
    controls.start({ x: 0, y: 0, scale: 1 });
  }, [x, y, scale, controls]);

  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="flex justify-end space-x-2 p-2 bg-muted">
          <Button variant="ghost" size="icon" onClick={() => handleZoom(-0.1)}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleZoom(0.1)}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        <div
          ref={containerRef}
          className="overflow-hidden bg-background"
          style={{ height: "600px", width: "100%" }}
        >
          <motion.div
            ref={graphRef}
            style={{
              x,
              y,
              scale,
              cursor: "grab",
            }}
            whileTap={{ cursor: "grabbing" }}
            drag
            dragElastic={0}
            dragMomentum={false}
            dragConstraints={containerRef}
            animate={controls}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
