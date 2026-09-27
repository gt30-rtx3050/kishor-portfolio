import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/*
  A theme-aware adaptation of React Bits' TextLoop:
  https://reactbits.dev/text-animations/text-loop

  SVG text follows a repeating curve, while two synchronized text paths keep
  the loop seamless. GSAP owns only the path offset; reduced-motion users get
  a still frame, and the animation pauses while hovered.
*/

export type TextLoopShape = "wave" | "circle" | "infinity" | "arch" | "line";
export type TextLoopDirection = "forward" | "reverse";

export interface TextLoopProps {
  text?: string;
  shape?: TextLoopShape;
  path?: string;
  speed?: number;
  direction?: TextLoopDirection;
  separator?: string;
  curviness?: number;
  fontSize?: number;
  fontWeight?: number | string;
  letterSpacing?: number;
  uppercase?: boolean;
  color?: string;
  ribbon?: boolean;
  ribbonColor?: string;
  ribbonWidth?: number;
  pauseOnHover?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface Metrics {
  length: number;
  reps: number;
}

const VIEW_W = 1200;
const VIEW_H = 520;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;
const EDGE_PAD = 6;

function buildPath(shape: TextLoopShape, curviness: number, ribbonWidth: number) {
  const curve = Math.max(0, curviness);
  const room = Math.max(20, CY - Math.max(0, ribbonWidth) / 2 - EDGE_PAD);

  switch (shape) {
    case "circle": {
      const radius = Math.min(90 + curve * 0.95, room);
      return `M ${CX - radius} ${CY} A ${radius} ${radius} 0 1 1 ${CX + radius} ${CY} A ${radius} ${radius} 0 1 1 ${CX - radius} ${CY} Z`;
    }
    case "infinity": {
      const radius = 150 + curve * 1.4;
      const height = Math.min(60 + curve * 0.95, room);
      return [
        `M ${CX} ${CY}`,
        `C ${CX + radius * 0.55} ${CY - height} ${CX + radius} ${CY - height} ${CX + radius} ${CY}`,
        `C ${CX + radius} ${CY + height} ${CX + radius * 0.55} ${CY + height} ${CX} ${CY}`,
        `C ${CX - radius * 0.55} ${CY - height} ${CX - radius} ${CY - height} ${CX - radius} ${CY}`,
        `C ${CX - radius} ${CY + height} ${CX - radius * 0.55} ${CY + height} ${CX} ${CY}`,
        "Z",
      ].join(" ");
    }
    case "arch": {
      const rise = Math.min(120 + curve * 1.1, room * 2);
      return `M 120 ${CY + rise / 2} Q ${CX} ${CY - rise * 1.5} ${VIEW_W - 120} ${CY + rise / 2}`;
    }
    case "line":
      return `M -320 ${CY} L ${VIEW_W + 320} ${CY}`;
    case "wave":
    default: {
      const amplitude = Math.min(curve * 2.2, room * 2);
      return `M -320 ${CY} Q -160 ${CY - amplitude} 0 ${CY} T 320 ${CY} T 640 ${CY} T 960 ${CY} T 1280 ${CY} T ${VIEW_W + 320} ${CY}`;
    }
  }
}

export function TextLoop({
  text = "React ✦ Bits",
  shape = "wave",
  path,
  speed = 90,
  direction = "forward",
  separator = "✦",
  curviness = 90,
  fontSize = 46,
  fontWeight = 800,
  letterSpacing = 2,
  uppercase = true,
  color = "var(--color-bg)",
  ribbon = true,
  ribbonColor = "var(--color-fg)",
  ribbonWidth = 86,
  pauseOnHover = true,
  className,
  style,
}: TextLoopProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const headRef = useRef<SVGTextPathElement>(null);
  const tailRef = useRef<SVGTextPathElement>(null);
  const [metrics, setMetrics] = useState<Metrics>({ length: 0, reps: 1 });
  const reduceMotion = useReducedMotion();

  const rawId = useId();
  const pathId = `text-loop-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const d = useMemo(
    () => path || buildPath(shape, curviness, ribbonWidth),
    [path, shape, curviness, ribbonWidth],
  );
  const unit = useMemo(() => {
    const phrase = uppercase ? text.toUpperCase() : text;
    const gap = separator ? `\u00a0${separator}\u00a0` : "\u00a0\u00a0\u00a0";
    return `${phrase}${gap}`;
  }, [text, separator, uppercase]);
  const textStyle = useMemo<CSSProperties>(
    () => ({
      fontFamily: "var(--font-sans)",
      fontSize: `${fontSize}px`,
      fontWeight,
      letterSpacing: `${letterSpacing}px`,
    }),
    [fontSize, fontWeight, letterSpacing],
  );

  useLayoutEffect(() => {
    const pathElement = pathRef.current;
    const measureElement = measureRef.current;
    if (!pathElement || !measureElement) return;

    let cancelled = false;
    const measure = () => {
      if (cancelled) return;

      try {
        const length = pathElement.getTotalLength();
        const unitWidth = measureElement.getComputedTextLength();
        if (!length) return;

        const reps = unitWidth > 0 ? Math.max(1, Math.round(length / unitWidth)) : 1;
        setMetrics((previous) =>
          previous.length === length && previous.reps === reps ? previous : { length, reps },
        );
      } catch {
        // Keep the still, readable SVG if an older browser cannot measure paths.
      }
    };

    measure();
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => undefined);
    }

    return () => {
      cancelled = true;
    };
  }, [d, unit, fontSize, fontWeight, letterSpacing]);

  useEffect(() => {
    const { length } = metrics;
    const head = headRef.current;
    const tail = tailRef.current;
    if (!head || !tail || !length) return;

    const applyOffset = (offset: number) => {
      const partnerOffset = offset >= 0 ? offset - length : offset + length;
      head.setAttribute("startOffset", String(offset));
      tail.setAttribute("startOffset", String(partnerOffset));
    };

    applyOffset(0);
    if (reduceMotion || speed <= 0) return;

    const offsetState = { offset: 0 };
    const tween = gsap.to(offsetState, {
      offset: direction === "reverse" ? -length : length,
      duration: length / speed,
      ease: "none",
      repeat: -1,
      onUpdate: () => applyOffset(offsetState.offset),
    });

    const root = rootRef.current;
    const pause = () => tween.pause();
    const resume = () => tween.resume();

    if (pauseOnHover && root) {
      root.addEventListener("pointerenter", pause);
      root.addEventListener("pointerleave", resume);
    }

    return () => {
      tween.kill();
      if (pauseOnHover && root) {
        root.removeEventListener("pointerenter", pause);
        root.removeEventListener("pointerleave", resume);
      }
    };
  }, [metrics, speed, direction, pauseOnHover, reduceMotion]);

  const loopText = unit.repeat(metrics.reps);
  const fitLength = metrics.length || undefined;

  return (
    <div ref={rootRef} className={cn("relative w-full overflow-hidden", className)} style={style}>
      <svg
        aria-hidden="true"
        className="block h-auto w-full"
        focusable="false"
        height={VIEW_H}
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        width={VIEW_W}
      >
        <defs>
          <path ref={pathRef} id={pathId} d={d} />
        </defs>

        {ribbon ? (
          <path
            d={d}
            fill="none"
            stroke={ribbonColor}
            strokeLinecap="round"
            strokeWidth={ribbonWidth}
          />
        ) : null}

        <text
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none select-none"
          style={{ ...textStyle, visibility: "hidden" }}
        >
          {unit}
        </text>

        <text className="pointer-events-none select-none" fill={color} style={textStyle}>
          <textPath
            ref={headRef}
            href={`#${pathId}`}
            startOffset="0"
            textLength={fitLength}
            lengthAdjust="spacing"
          >
            {loopText}
          </textPath>
          <textPath
            ref={tailRef}
            href={`#${pathId}`}
            startOffset="0"
            textLength={fitLength}
            lengthAdjust="spacing"
          >
            {loopText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
