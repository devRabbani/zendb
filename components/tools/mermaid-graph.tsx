"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { ZoomIn, ZoomOut, Maximize2, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MermaidGraphProps {
  chart: string;
  className?: string;
}

export default function MermaidGraph({ chart, className }: MermaidGraphProps) {
  const [svg, setSvg] = useState<string>("");
  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);

  const isDarkMode = useCallback(() => {
    return document.documentElement.classList.contains("dark");
  }, []);

  useEffect(() => {
    const initMermaid = async () => {
      mermaid.initialize({
        startOnLoad: true,
        theme: isDarkMode() ? "dark" : "neutral",
        securityLevel: "loose",
        fontFamily: "Inter, sans-serif",
      });

      const { svg } = await mermaid.render("mermaid-graph", chart);
      setSvg(svg);
    };

    initMermaid();
    handleReset();
  }, [chart, isDarkMode]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (isDragging) {
      let clientX: number, clientY: number;
      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      setPosition({
        x: clientX - startPosition.x,
        y: clientY - startPosition.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="flex justify-end space-x-2 p-2 bg-muted">
          <Button variant="ghost" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        <div
          ref={containerRef}
          className="overflow-hidden bg-background"
          style={{ height: "400px" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            ref={graphRef}
            style={{
              transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: "0 0",
              transition: "transform 0.1s ease-out",
              cursor: isDragging ? "grabbing" : "grab",
            }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
