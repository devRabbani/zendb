"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import mermaid from "mermaid";
import { useTheme } from "next-themes";

const chart = `
    graph TD
    A[Client] --> B[Load Balancer]
    B --> C[Server01]
    B --> D[Server02]
  `;

export default function DragTest() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const smoothScale = useSpring(scale, { stiffness: 300, damping: 30 });

  const handleClick = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  const handleZoom = (delta: number) => {
    const newScale = Math.max(0.6, Math.min(scale.get() + delta, 2)); //0.6 means min zoom and 2 is max
    scale.set(newScale);
  };

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const renderMermaid = useCallback(async () => {
    if (graphRef.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: isDarkMode ? "dark" : "neutral",
        securityLevel: "loose",
        fontFamily: "Inter, sans-serif",
      });

      const { svg } = await mermaid.render("mermaid-graph", chart);
      setSvg(svg);

      // Reset zoom and position
      handleClick();
    }
  }, [chart, isDarkMode]);

  useEffect(() => {
    renderMermaid();
  }, [renderMermaid]);

  return (
    <>
      <Button className="ghost" onClick={handleClick}>
        RESET
      </Button>
      <Button className="ghost" onClick={() => handleZoom(0.2)}>
        Zoom
      </Button>
      <Button className="ghost" onClick={() => handleZoom(-0.2)}>
        Zoom Out
      </Button>
      <motion.div
        ref={containerRef}
        className="bg-card border-border border p-5 rounded min-h-[500px] w-full overflow-hidden"
      >
        <motion.div
          ref={graphRef}
          drag
          style={{
            x,
            y,
            scale: smoothScale,
            cursor: "grab",
          }}
          dragElastic={0.3}
          dragConstraints={containerRef}
          dragTransition={{ timeConstant: 160, power: 0.1 }}
          whileTap={{ cursor: "grabbing" }}
          className="w-fit"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </motion.div>
    </>
  );
}
