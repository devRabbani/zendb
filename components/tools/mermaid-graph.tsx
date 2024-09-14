"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import mermaid from "mermaid";
import { useTheme } from "next-themes";
import {
  PiDownloadSimple,
  PiMagnifyingGlassMinusLight,
  PiMagnifyingGlassPlusLight,
} from "react-icons/pi";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { toast } from "sonner";
import { downloadSVG } from "@/lib/tools-utils";

export default function MermaidGraph({
  chart,
  title = "Diagram",
}: {
  chart: string;
  title?: string;
}) {
  const [svg, setSvg] = useState<string>("");
  const [graphId, setGraphId] = useState("mermaid-graph");

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const renderMermaid = useCallback(async () => {
    if (!chart) return;
    try {
      mermaid.initialize({
        startOnLoad: true,
        theme: isDarkMode ? "dark" : "neutral",
        securityLevel: "loose",
        fontFamily: "Inter, sans-serif",
      });

      // Generate a new unique ID for each render
      const newGraphId = `mermaid-graph-${Date.now()}`;
      setGraphId(newGraphId);
      const { svg } = await mermaid.render(newGraphId, chart);
      setSvg(svg);
    } catch (error: any) {
      console.error("Error generating ERD", error?.message);
      toast.error("Error parsing ERD code");
      setSvg("");
    }
  }, [chart, isDarkMode]);

  useEffect(() => {
    renderMermaid();
  }, [renderMermaid]);

  const handleDownload = () => {
    try {
      if (!svg) return toast.error("No diagram to download");
      downloadSVG(svg);
    } catch (error: any) {
      toast.error("Error downloading SVG");
      console.error(error?.message);
    }
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card text-card-foreground shadow">
      <div className="px-6 border-b border-border py-2.5 dark:bg-muted/50 flex justify-between items-center">
        <h4>{title}</h4>
        <Button
          variant="ghost"
          onClick={handleDownload}
          size="icon"
          disabled={!svg}
        >
          <PiDownloadSimple className="h-5 w-5" />
          <span className="sr-only">Download btn</span>
        </Button>
      </div>
      <TransformWrapper
        disabled={!svg}
        centerOnInit
        centerZoomedOut
        minScale={0.8}
      >
        {({ zoomIn, zoomOut }) => (
          <div className="relative bg-muted dark:bg-card">
            <div className="space-x-2.5 absolute right-3 top-3 z-10">
              <Button
                variant="outline"
                onClick={() => zoomOut(0.3)}
                size="icon"
                disabled={!svg}
              >
                <PiMagnifyingGlassMinusLight className="h-5 w-5" />
                <span className="sr-only">Zoom out btn</span>
              </Button>
              <Button
                onClick={() => zoomIn(0.3)}
                variant="outline"
                size="icon"
                disabled={!svg}
              >
                <PiMagnifyingGlassPlusLight className="h-5 w-5" />
                <span className="sr-only">Zoom in btn</span>
              </Button>
            </div>
            <TransformComponent
              wrapperStyle={{ width: "100%", minHeight: "500px" }}
            >
              {svg ? (
                <div key={graphId} dangerouslySetInnerHTML={{ __html: svg }} />
              ) : (
                <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                  No diagram to display
                </div>
              )}
            </TransformComponent>
          </div>
        )}
      </TransformWrapper>
    </div>
  );
}
