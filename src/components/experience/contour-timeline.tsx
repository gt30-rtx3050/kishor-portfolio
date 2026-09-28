import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { experiences } from "@/lib/experiences";
import {
  clampIndex,
  CONTOUR,
  ribbonPath,
  stationCenter,
  stemPath,
  stepIndex,
  trackWidthFor,
} from "./contour-math";
import "./contour-timeline.css";

/*
  Career timeline for the Experience page.

  The motion is the one from the user-supplied `timeline.html`
  (contour-timeline.framer.website): a ribbon whose arch, marker circle and stem
  glide to the selected station while the station label scales up, its dot
  disappears and the card below brightens. Geometry and state values are taken
  verbatim from that file's markup — see ./contour-math.ts and
  docs/experience-timeline-reference.md.

  Two deliberate differences, both asked for by the user:
  - company cards laid out in rows of three, one per employer;
  - the reference's warm paper palette replaced with the site's black surface
    (the same hues, lifted so they read on black).
*/

const COLUMNS = 3;

type RowProps = {
  items: typeof experiences;
  offset: number;
  active: number;
  select: (index: number, focus?: boolean) => void;
  labelRefs: RefObject<Array<HTMLButtonElement | null>>;
  onLabelKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void;
};

function TimelineRow({ items, offset, active: selected, select, labelRefs, onLabelKeyDown }: RowProps) {
  const count = COLUMNS;
  const active = selected - offset;
  const isActiveRow = active >= 0 && active < items.length;
  const railRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const reducedMotion = useReducedMotion() ?? false;
  /*
    Each row has up to three cards at ~200px each. Below that the rail itself scrolls
    horizontally, exactly like the reference's `data-rail` does on narrow
    viewports, so the ribbon and the cards never drift apart.
  */
  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const measure = () => setTrackWidth(trackWidthFor(rail.clientWidth, count));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [count]);

  /*
    One spring drives everything that moves: the two ribbon paths, the stem, the
    marker circles. Reduced motion swaps the spring for the raw target value, so
    the states still change — they just do not travel.
  */
  const targetX = useMotionValue(0);
  const springX = useSpring(targetX, CONTOUR.spring);
  const peakX = reducedMotion ? targetX : springX;

  const liftTarget = useMotionValue(isActiveRow ? 1 : 0);
  const liftSpring = useSpring(liftTarget, CONTOUR.spring);
  const lift = reducedMotion ? liftTarget : liftSpring;
  useEffect(() => { liftTarget.set(isActiveRow ? 1 : 0); }, [isActiveRow, liftTarget]);
  const markerY = useTransform(lift, value => CONTOUR.baselineY - CONTOUR.humpHeight * value);

  const mainPath = useTransform(() => ribbonPath(peakX.get(), trackWidth, { peakY: markerY.get() }));
  const echoPathOne = useTransform(() => ribbonPath(peakX.get(), trackWidth, { echo: 1, peakY: markerY.get() }));
  const echoPathTwo = useTransform(() => ribbonPath(peakX.get(), trackWidth, { echo: 2, peakY: markerY.get() }));
  const stem = useTransform(() => stemPath(peakX.get(), CONTOUR.stripHeight, markerY.get()));

  // Follow the selected station. The first measurement is applied without
  // animating so the ribbon does not fly in from the left edge on load.
  const settled = useRef(false);
  useEffect(() => {
    if (trackWidth <= 0 || !isActiveRow) return;
    const x = stationCenter(active, count, trackWidth);
    if (!settled.current) {
      springX.set(x);
      settled.current = true;
    }
    targetX.set(x);
  }, [active, count, isActiveRow, springX, targetX, trackWidth]);

  // Keep the selected card in view when the rail is scrollable (phone layouts).
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !isActiveRow || trackWidth <= rail.clientWidth) return;
    const left = stationCenter(active, count, trackWidth) - rail.clientWidth / 2;
    rail.scrollTo({ left: Math.max(left, 0), behavior: reducedMotion ? "auto" : "smooth" });
  }, [active, count, isActiveRow, reducedMotion, trackWidth]);

  const cellStyle: CSSProperties = {
    // The reference sizes stations at `cell − 14` with a 7px inset either side.
    gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
  };

  return (
          <div className="contour-rail" ref={railRef} data-rail="true">
            <div
              className="contour-track"
              style={{ width: trackWidth > 0 ? trackWidth : undefined }}
            >
              <div className="contour-labels" role="group" aria-label="Career milestones" style={cellStyle}>
                {items.map((experience, index) => {
                  const isActive = index === active;
                  return (
                    <button
                      key={experience.company}
                      ref={node => {
                        labelRefs.current[offset + index] = node;
                      }}
                      type="button"
                      className={`contour-label${isActive ? " is-active" : ""}`}
                      tabIndex={isActive ? 0 : -1}
                      aria-current={isActive ? "step" : undefined}
                      aria-label={`${experience.years}: ${experience.company}`}
                      onClick={() => select(offset + index)}
                      onKeyDown={event => onLabelKeyDown(event, offset + index)}
                    >
                      {/*
                        Reference station: the year is the 34px label and carries
                        translateY(3px) scale(1.16) in the accent colour while
                        active; its 6px dot fades and shrinks away because the
                        marker circle takes over that job.
                      */}
                      <motion.span
                        className="contour-label-years"
                        initial={false}
                        animate={{
                          scale: isActive ? CONTOUR.activeScale : 1,
                          y: isActive ? CONTOUR.activeShiftY : 0,
                          color: isActive ? "#c98b9b" : "rgba(247, 244, 238, 0.44)",
                        }}
                        transition={CONTOUR.spring}
                      >
                        {experience.years}
                      </motion.span>
                      <span className="contour-label-company">{experience.shortName}</span>
                    </button>
                  );
                })}
              </div>

              {/*
                The ribbon. Same draw order as the reference: echoes, main path,
                stem, then the opaque marker circle that hides the stem's head.
              */}
              <svg
                className="contour-ribbon"
                width={trackWidth || 1}
                height={CONTOUR.stripHeight}
                viewBox={`0 0 ${trackWidth || 1} ${CONTOUR.stripHeight}`}
                aria-hidden="true"
                focusable="false"
              >
                {trackWidth > 0 ? (
                  <>
                    <motion.path
                      d={echoPathTwo}
                      className="contour-line contour-line--echo"
                      fill="none"
                      strokeWidth={CONTOUR.echoWidth}
                      opacity={CONTOUR.echoOpacity[1]}
                    />
                    <motion.path
                      d={echoPathOne}
                      className="contour-line contour-line--echo"
                      fill="none"
                      strokeWidth={CONTOUR.echoWidth}
                      opacity={CONTOUR.echoOpacity[0]}
                    />
                    <motion.path
                      d={mainPath}
                      className="contour-line"
                      fill="none"
                      strokeWidth={CONTOUR.lineWidth}
                    />
                    {/*
                      One dot per station, sitting on the flat run of the ribbon.
                      The reference hides a station's dot while it is active —
                      the marker circle takes that job over here too.
                    */}
                    {items.map((experience, index) => (
                      <motion.circle
                        key={experience.company}
                        className="contour-station-dot"
                        cx={stationCenter(index, count, trackWidth)}
                        cy={CONTOUR.baselineY - CONTOUR.dotLift}
                        r={CONTOUR.dotSize / 2}
                        initial={false}
                        animate={{
                          opacity: index === active ? 0 : 1,
                          r: index === active ? 0 : CONTOUR.dotSize / 2,
                        }}
                        transition={CONTOUR.spring}
                      />
                    ))}
                    <motion.g style={{ opacity: lift }}>
                    <motion.path
                      d={stem}
                      className="contour-stem"
                      fill="none"
                      strokeWidth={CONTOUR.stemWidth}
                    />
                    <motion.circle
                      className="contour-marker"
                      cx={peakX}
                      cy={markerY}
                      r={CONTOUR.markerRadius}
                      strokeWidth={CONTOUR.markerStrokeWidth}
                    />
                    <motion.circle
                      className="contour-marker-dot"
                      cx={peakX}
                      cy={markerY}
                      r={CONTOUR.markerDotRadius}
                    />
                    </motion.g>
                  </>
                ) : null}
              </svg>

              <div className="contour-cards" role="list" aria-label="Companies" style={cellStyle}>
                {items.map((experience, index) => {
                  const isActive = index === active;
                  return (
                    <motion.article
                      key={experience.company}
                      role="listitem"
                      className={`contour-card${isActive ? " is-active" : ""}`}
                      onClick={() => select(offset + index)}
                      initial={false}
                      animate={{ y: isActive ? -8 : 0, scale: isActive ? 1.03 : 1 }}
                      transition={CONTOUR.spring}
                    >
                      <div className="contour-card-meta">
                        <span>{String(offset + index + 1).padStart(2, "0")}</span>
                        <span>{experience.years}</span>
                      </div>
                      <h3>{experience.company}</h3>
                      <p className="contour-card-role">{experience.role}</p>
                      <motion.ul
                        className="contour-card-list"
                        initial={false}
                        animate={isActive ? "active" : "idle"}
                        variants={{
                          idle: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
                          active: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
                        }}
                      >
                        {experience.responsibilities.map(line => (
                          <motion.li
                            key={line}
                            variants={{ idle: { opacity: 0.45 }, active: { opacity: 1 } }}
                            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                          >
                            {line}
                          </motion.li>
                        ))}
                      </motion.ul>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
  );
}

export function ContourTimeline() {
  const count = experiences.length;
  const [active, setActive] = useState(0);
  const labelRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const select = useCallback(
    (index: number, focus = false) => {
      const next = clampIndex(index, count);
      setActive(next);
      if (focus) labelRefs.current[next]?.focus();
    },
    [count],
  );

  // Roving tabindex: one station is tabbable, the arrow keys move between them.
  const onLabelKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        select(stepIndex(index, count, 1), true);
        return;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        select(stepIndex(index, count, -1), true);
        return;
      case "Home":
      case "End":
        event.preventDefault();
        select(event.key === "Home" ? 0 : count - 1, true);
        return;
      default:
        return;
    }
  };

  return (
    <section id="career-timeline" className="contour" aria-labelledby="contour-heading">
      <div className="shell">
        <Reveal>
          <p className="contour-eyebrow">Career timeline · 2018–2026</p>
          <h2 id="contour-heading" className="contour-heading">
            Five companies, one thread.
          </h2>
          <p className="contour-summary">
            Every role added a layer — writing, editing, leading, growing. Select a chapter and the
            ribbon follows it.
          </p>
        </Reveal>
      </div>

      <div className="shell contour-stage">
        <Reveal delay={0.1}>
          <div className="contour-rows">
            {Array.from({ length: Math.ceil(count / COLUMNS) }, (_, row) => (
              <TimelineRow
                key={row}
                items={experiences.slice(row * COLUMNS, (row + 1) * COLUMNS)}
                offset={row * COLUMNS}
                active={active}
                select={select}
                labelRefs={labelRefs}
                onLabelKeyDown={onLabelKeyDown}
              />
            ))}
          </div>
        </Reveal>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {experiences[active].company}, {experiences[active].years} selected.
      </p>
    </section>
  );
}
