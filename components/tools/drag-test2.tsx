"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import mermaid from "mermaid";
import { useTheme } from "next-themes";
import CardWrapper from "../card-wrapper";
import {
  PiDownload,
  PiDownloadSimple,
  PiDownloadSimpleLight,
  PiMagnifyingGlassMinus,
  PiMagnifyingGlassMinusDuotone,
  PiMagnifyingGlassMinusLight,
  PiMagnifyingGlassPlus,
  PiMagnifyingGlassPlusBold,
  PiMagnifyingGlassPlusDuotone,
  PiMagnifyingGlassPlusFill,
  PiMagnifyingGlassPlusLight,
  PiMagnifyingGlassPlusThin,
} from "react-icons/pi";

import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { toast } from "sonner";
import { downloadSVG } from "@/lib/common-tool-utils";

export default function DragTest2({ chart }: { chart: string }) {
  const graphRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const renderMermaid = useCallback(async () => {
    if (graphRef.current && chart) {
      mermaid.initialize({
        startOnLoad: true,
        theme: isDarkMode ? "dark" : "neutral",
        securityLevel: "loose",
        fontFamily: "Inter, sans-serif",
      });

      const { svg } = await mermaid.render("mermaid-graph", chart);
      setSvg(svg);
    }
  }, [chart, isDarkMode]);

  useEffect(() => {
    renderMermaid();
  }, [renderMermaid]);

  const handleDownload = () => {
    try {
      if (!svg) return toast.error("Error downloading SVG");
      downloadSVG(svg);
    } catch (error: any) {
      toast.error("Error downloading SVG");
      console.log(error?.message);
    }
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card text-card-foreground shadow">
      <div className="px-6 border-b border-border py-3 dark:bg-muted/50 flex justify-between items-center">
        <h4>Diagram</h4>
        <Button variant="ghost" onClick={handleDownload} size="icon">
          <PiDownloadSimple className="h-5 w-5" />
        </Button>
      </div>
      <TransformWrapper
        disabled={!svg}
        centerOnInit
        centerZoomedOut
        minScale={0.8}
      >
        {({ zoomIn, zoomOut, ...rest }) => (
          <div className="relative">
            <div className="space-x-2.5 absolute right-3 top-3 z-10">
              <Button
                variant="outline"
                onClick={() => zoomOut(0.3)}
                size="icon"
              >
                <PiMagnifyingGlassMinusLight className="h-5 w-5" />
              </Button>
              <Button onClick={() => zoomIn(0.3)} variant="outline" size="icon">
                <PiMagnifyingGlassPlusLight className="h-5 w-5" />
              </Button>
            </div>
            <TransformComponent
              wrapperStyle={{ width: "100%", minHeight: "500px" }}
            >
              <div ref={graphRef} dangerouslySetInnerHTML={{ __html: svg }} />
            </TransformComponent>
          </div>
        )}
      </TransformWrapper>
      {/* <div
        ref={containerRef}
        className="min-h-[500px] h-full bg-muted relative dark:bg-transparent p-2 w-full overflow-hidden"
      >
        <div className="space-x-2.5 absolute right-3 top-3 z-10">
          <Button
            variant="outline"
            // onClick={() => handleZoom(-0.2)}
            size="icon"
          >
            <PiMagnifyingGlassMinusLight className="h-5 w-5" />
          </Button>
          <Button
            // onClick={() => handleZoom(0.2)}
            variant="outline"
            size="icon"
          >
            <PiMagnifyingGlassPlusLight className="h-5 w-5" />
          </Button>
        </div>
        <TransformComponent>
          <div
            ref={graphRef}
            className="w-fit h-fit bg-black"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </TransformComponent>
      </div> */}
    </div>
  );
}
