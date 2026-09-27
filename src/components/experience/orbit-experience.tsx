import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { experiences, type Experience } from "@/lib/experiences";
import { getOrbitCard, getOrbitCopy, getScrollProgress, ORBIT, type OrbitViewport } from "./orbit-math";

/**
 * The published Orbit layout is a static grid below 800px, not a touch
 * carousel. Reduced-motion users get that same readable grid at every width.
 */
function useOrbitScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<OrbitViewport>({ width: 1440, height: 900 });
  const [compact, setCompact] = useState(false);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = viewportRef.current;
    if (!section || !stage) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isCompact = false;
    let isNear = false;
    let frame = 0;
    let resizeFrame = 0;
    let lastTime: number | null = null;
    let current = 0;
    let target = 0;

    const cancel = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = null;
    };

    // Same delta-time-corrected exponential damping as the original component.
    const animate = (time: number) => {
      frame = 0;
      const delta = Math.min(Math.max((time - (lastTime ?? time)) / 1000, 0), 0.064);
      lastTime = time;
      const next = current + (target - current) * (1 - Math.exp(-ORBIT.smoothness * delta));
      const difference = Math.abs(target - next);
      current = difference < 0.0001 ? target : next;
      setProgress(current);
      if (difference >= 0.0001) frame = requestAnimationFrame(animate);
      else lastTime = null;
    };

    const update = () => {
      if (isCompact || !isNear) return;
      const bounds = section.getBoundingClientRect();
      target = getScrollProgress(bounds.top, bounds.height, window.innerHeight);
      if (!frame) frame = requestAnimationFrame(animate);
    };

    const measure = () => {
      const bounds = stage.getBoundingClientRect();
      const width = Math.max(Math.round(bounds.width), 1);
      const height = Math.max(Math.round(bounds.height), 1);
      setViewport(previous => previous.width === width && previous.height === height ? previous : { width, height });
      const nextCompact = width < ORBIT.desktopBreakpoint || motionQuery.matches;
      if (nextCompact !== isCompact) {
        isCompact = nextCompact;
        cancel();
        // Don't animate between a compact layout and desktop after resizing.
        const rootBounds = section.getBoundingClientRect();
        current = target = isCompact ? 1 : getScrollProgress(rootBounds.top, rootBounds.height, window.innerHeight);
        setProgress(current);
      }
      setCompact(nextCompact);
      update();
    };

    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(measure);
    };
    measure();
    // Re-measure after the compact/desktop CSS has taken effect.
    resizeFrame = requestAnimationFrame(measure);
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(stage);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isNear = entry.isIntersecting;
      if (isNear) update();
      else cancel();
    }, { rootMargin: "100% 0px 100% 0px", threshold: 0 });
    intersectionObserver.observe(section);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize);
    motionQuery.addEventListener("change", measure);
    return () => {
      cancel();
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
      motionQuery.removeEventListener("change", measure);
    };
  }, []);

  return { sectionRef, viewportRef, viewport, compact, progress };
}

function CardContent({ experience, index }: { experience: Experience; index: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <div className={`orbit-card-surface orbit-card-surface--${index + 1}`}>
      {!imageFailed && (
        <img
          className="orbit-card-artwork"
          src={experience.artwork}
          alt=""
          aria-hidden="true"
          draggable={false}
          loading="eager"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      )}
      {/* Text stays real HTML, legible and available even if artwork fails. */}
      <div className="orbit-card-shade" aria-hidden="true" />
      <div className="orbit-card-meta">
        <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <p>{experience.years}</p>
      </div>
      <div className="orbit-card-copy">
        <h3>{experience.company}</h3>
        <p>{experience.role}</p>
      </div>
    </div>
  );
}

export function OrbitExperience() {
  const { sectionRef, viewportRef, viewport, compact, progress } = useOrbitScene();
  const copy = getOrbitCopy(progress, viewport.width);

  return (
    <section
      id="career-orbit"
      ref={sectionRef}
      className={`career-orbit${compact ? " career-orbit--compact" : ""}`}
      aria-labelledby="career-orbit-heading"
    >
      <h2 id="career-orbit-heading" className="sr-only">My experience — five chapters, 2018 to 2026</h2>
      <div ref={viewportRef} className="orbit-viewport">
        <div className="orbit-compact-heading" aria-hidden="true">
          <p>CAREER<br />OUTLINE</p>
          <div>From content to growth.<br />Five chapters in motion.</div>
        </div>
        {!compact && (
          <>
            <div
              className="orbit-title orbit-title--left"
              aria-hidden="true"
              style={{ opacity: copy.opacity, transform: `translate3d(calc(-100% - ${copy.offset}px), calc(-50% + ${copy.shift}px), 0)` }}
            >
              CAREER
            </div>
            <div
              className="orbit-title orbit-title--right"
              aria-hidden="true"
              style={{ opacity: copy.opacity, transform: `translate3d(${copy.offset}px, calc(-50% - ${copy.shift}px), 0)` }}
            >
              OUTLINE
            </div>
            <p
              className="orbit-center-copy"
              aria-hidden="true"
              style={{ opacity: copy.centerOpacity, width: copy.centerWidth }}
            >
              From content to growth. Five chapters in motion.
            </p>
          </>
        )}
        <div className="orbit-cards">
          {experiences.map((experience, index) => {
            const pose = getOrbitCard(index, experiences.length, progress, viewport);
            const style: CSSProperties = compact ? {} : {
              width: pose.width,
              height: pose.height,
              opacity: pose.opacity,
              zIndex: pose.zIndex,
              transform: pose.transform,
              "--orbit-shadow": pose.shadow,
            } as CSSProperties;
            return (
              <article
                key={experience.company}
                className="orbit-card"
                style={style}
                aria-label={`${index + 1} of ${experiences.length}: ${experience.company}`}
              >
                <CardContent experience={experience} index={index} />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
