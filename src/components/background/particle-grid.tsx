import { useEffect, useRef } from "react";
import gsap from "gsap";

/*
  ReactBits-style interactive dot field for the hero background.
  A lightweight canvas grid: dots breathe on a sine wave and lean away from
  the pointer. GSAP's ticker drives the render loop so the background and the
  hero entrance timeline share one clock.

  Performance and accessibility notes:
  - Rendering pauses when the hero leaves the viewport or the tab is hidden.
  - With prefers-reduced-motion a single static frame is drawn, no loop.
  - Device pixel ratio is capped at 2 to protect fill-rate on hidpi screens.
  - The canvas is aria-hidden; it is purely decorative.
*/

interface Dot {
  x: number;
  y: number;
  phase: number;
  dx: number;
  dy: number;
}

interface ParticleGridProps {
  className?: string;
  /** Distance between dots in CSS pixels. */
  spacing?: number;
}

const POINTER_RADIUS = 130;
const POINTER_REPEL = 9;

export function ParticleGrid({ className, spacing = 30 }: ParticleGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let inView = true;
    const pointer = { x: -9999, y: -9999 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function rebuild() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.max(1, Math.round(width * dpr));
      canvas!.height = Math.max(1, Math.round(height * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const offsetX = (width - (cols - 1) * spacing) / 2;
      const offsetY = (height - (rows - 1) * spacing) / 2;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          dots.push({
            x: offsetX + col * spacing,
            y: offsetY + row * spacing,
            // Diagonal phase offset makes the "breathing" travel like a wave.
            phase: (col + row) * 0.35,
            dx: 0,
            dy: 0,
          });
        }
      }
      if (reduceMotion) drawFrame(0);
    }

    function drawFrame(time: number) {
      ctx!.clearRect(0, 0, width, height);
      for (const dot of dots) {
        let alpha = 0.1 + 0.08 * Math.sin(time * 1.1 + dot.phase);
        let targetX = 0;
        let targetY = 0;

        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < POINTER_RADIUS) {
          const force = 1 - dist / POINTER_RADIUS;
          alpha = Math.min(0.6, alpha + force * 0.5);
          const push = POINTER_REPEL * force;
          targetX = (dx / (dist || 1)) * push;
          targetY = (dy / (dist || 1)) * push;
        }

        // Ease displacement toward the target: springy, never jittery.
        dot.dx += (targetX - dot.dx) * 0.12;
        dot.dy += (targetY - dot.dy) * 0.12;

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        ctx!.arc(dot.x + dot.dx, dot.y + dot.dy, 1.1, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function tick(time: number) {
      // gsap.ticker time is seconds since start.
      if (inView && !document.hidden) drawFrame(time);
    }

    function onPointerMove(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    }

    rebuild();

    const resizeObserver = new ResizeObserver(rebuild);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    if (!reduceMotion) {
      gsap.ticker.add(tick);
    }

    return () => {
      if (!reduceMotion) gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [spacing]);

  return (
    <div className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
