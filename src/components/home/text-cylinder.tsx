import { useEffect, useRef, useState } from "react";
import "@/styles/text-cylinder.css";

/*
  Text Cylinder — pixel-faithful replica of the sample in section.html
  (framerbitz.framer.website/text-cylinder).

  Geometry copied verbatim from the sample snapshot:
  - 60 strips = 10 repeats around the drum x 6 horizontal slices per repeat
  - Text block 144px tall, sliced every 24px, shown through a 24.7px window
    (0.35px overlap top/bottom so seams never gap)
  - Radius 228.97364025273853px, drum height 458.576px, perspective 1250px
  - Vertical fade mask: transparent 0% -> black 45%/55% -> transparent 100%
  - Ink rgb(204,204,204) on rgb(0,0,0), Mattone 400, -0.08em tracking,
    rendered at 2x (288px in a 200% box scaled to 0.5) for crisp edges
  - Strip angles + slice offsets hardcoded in the sample's exact order,
    including its floating-point quirks (e.g. 2.999999999999999deg)

  The only deliberate deviation: the sample reads "FRAMER" (6 chars) while
  this heading reads "My Career Portfolio" (19 chars). The drum geometry is
  untouched — the type size auto-fits so the longer line fits the viewport
  without clipping, capped at the sample's full 288px on wide screens.

  Motion: continuous linear drum rotation via rAF (20s per revolution),
  paused off-screen / in background tabs, static front face when the OS
  requests reduced motion.
*/

const CYLINDER_TEXT = "My Career Portfolio";

// Strip angles in the sample's exact DOM order (10 repeats x 6 slices).
const STRIP_ANGLES: readonly number[] = [
  15, 9, 2.999999999999999, -3.0000000000000013, -9, -14.999999999999998,
  51, 45, 39, 33, 27, 21,
  87, 81, 75, 69, 63, 57,
  123, 117, 111, 105, 99, 93,
  159, 153, 147, 141, 135, 129,
  195, 189, 183, 177, 171, 165,
  231, 225, 219, 213, 207, 201,
  267, 261, 255, 249, 243, 237,
  303, 297, 291, 285, 279, 273,
  339, 333, 327, 321, 315, 309,
];

// Slice window offsets, one per slice position (0.35 - slice * 24).
const SLICE_TOPS: readonly number[] = [0.35, -23.65, -47.65, -71.65, -95.65, -119.65];

const RADIUS = 228.97364025273853;
const CYLINDER_HEIGHT = 458.576;
const PERSPECTIVE = 1250;
const STRIP_HEIGHT = 24.7;
const TEXT_BLOCK_HEIGHT = 144;
const FULL_FONT_SIZE = 288;
const MIN_FONT_SIZE = 48;
const FADE_MASK =
  "linear-gradient(to bottom, transparent 0%, black 45%, black 55%, transparent 100%)";

// Degrees per second. 18deg/s = one full turn every 20 seconds.
const ROTATION_SPEED = 18;

interface TextCylinderProps {
  text?: string;
  className?: string;
}

export function TextCylinder({ text = CYLINDER_TEXT, className }: TextCylinderProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const drumRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [fontSize, setFontSize] = useState<number>(FULL_FONT_SIZE);

  // Auto-fit: keep the sample's 288px whenever the line fits, otherwise
  // shrink proportionally so the full heading stays inside the viewport.
  useEffect(() => {
    const section = sectionRef.current;
    const measure = measureRef.current;
    if (!section || !measure) return;

    const fit = () => {
      // Measured at the full 288px in the fallback-proof hidden span.
      const fullWidth = measure.offsetWidth;
      if (!fullWidth) return;
      // On the drum the 288px line lives in a 200% box scaled by 0.5, so
      // its on-screen width is half the measured width.
      const displayedFullWidth = fullWidth * 0.5;
      const available = section.clientWidth - 48; // 24px breathing room per side
      if (available <= 0 || displayedFullWidth <= 0) return;
      const scale = Math.min(1, available / displayedFullWidth);
      setFontSize((prev) => {
        const next = Math.max(MIN_FONT_SIZE, Math.floor(FULL_FONT_SIZE * scale));
        return prev === next ? prev : next;
      });
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(section);

    // Mattone swaps in async — re-measure once it (or any font) arrives.
    let cancelled = false;
    const refit = () => {
      if (!cancelled) fit();
    };
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.load('400 288px "Mattone"').then(refit).catch(() => {});
      document.fonts.ready.then(refit).catch(() => {});
    }
    window.addEventListener("orientationchange", refit);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("orientationchange", refit);
    };
  }, [text]);

  // Continuous drum rotation. One rAF loop owns the transform; it sleeps
  // off-screen and yields to prefers-reduced-motion with a static face.
  useEffect(() => {
    const drum = drumRef.current;
    const section = sectionRef.current;
    if (!drum || !section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      drum.style.transform = "rotateX(0deg)";
      return;
    }

    let frame = 0;
    let last = performance.now();
    let rotation = 0;
    let visible = true;

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        last = performance.now();
      },
      { threshold: 0 },
    );
    observer.observe(section);

    const tick = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible && !document.hidden) {
        rotation -= ROTATION_SPEED * delta;
        // Keep the number small without a visual jump (10 repeats = 36° period,
        // 360° is the safe universal wrap).
        if (rotation <= -360) rotation += 360;
        drum.style.transform = `rotateX(${rotation}deg)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onMotionPreference = () => {
      if (reduceMotion.matches) {
        cancelAnimationFrame(frame);
        drum.style.transform = "rotateX(0deg)";
      }
    };
    reduceMotion.addEventListener("change", onMotionPreference);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      reduceMotion.removeEventListener("change", onMotionPreference);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label={text}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        minHeight: 560,
        overflow: "hidden",
        backgroundColor: "rgb(0, 0, 0)",
      }}
    >
      {/* Real heading for screen readers + search; the drum is pure visual. */}
      <h2 className="sr-only">{text}</h2>

      {/* Hidden measurer at the sample's full size — never painted. */}
      <span
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          visibility: "hidden",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          fontFamily: '"Mattone", "Mattone Placeholder", sans-serif',
          fontSize: FULL_FONT_SIZE,
          fontWeight: 400,
          letterSpacing: "-0.08em",
        }}
      >
        {text}
      </span>

      {/* Outer stage — exact sample styles. */}
      <div
        aria-hidden="true"
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Perspective + fade mask — exact sample styles. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: PERSPECTIVE,
            maskImage: FADE_MASK,
            WebkitMaskImage: FADE_MASK,
          }}
        >
          {/* The drum — exact sample styles; rAF owns `transform`. */}
          <div
            ref={drumRef}
            style={{
              position: "relative",
              width: "100%",
              height: CYLINDER_HEIGHT,
              transformStyle: "preserve-3d",
              transform: "rotateX(0deg)",
              willChange: "transform",
            }}
          >
            {STRIP_ANGLES.map((angle, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  width: "100%",
                  height: STRIP_HEIGHT,
                  marginTop: -STRIP_HEIGHT / 2,
                  overflow: "hidden",
                  backfaceVisibility: "hidden",
                  transform: `rotateX(${angle}deg) translateZ(${RADIUS}px)`,
                  opacity: 1,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: SLICE_TOPS[index % SLICE_TOPS.length],
                    left: 0,
                    width: "100%",
                    height: TEXT_BLOCK_HEIGHT,
                  }}
                >
                  <div
                    style={{
                      width: "200%",
                      height: TEXT_BLOCK_HEIGHT * 2,
                      transform: "scale(0.5)",
                      transformOrigin: "top left",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      whiteSpace: "nowrap",
                      color: "rgb(204, 204, 204)",
                      userSelect: "none",
                      fontFamily: '"Mattone", "Mattone Placeholder", sans-serif',
                      fontFeatureSettings: "normal",
                      fontSize,
                      fontStyle: "normal",
                      fontWeight: 400,
                      letterSpacing: "-0.08em",
                      lineHeight: "0.1px",
                      textAlign: "center",
                    }}
                  >
                    {text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
