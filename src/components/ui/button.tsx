import { Children, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { motion, type Transition } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/tokens";

/*
  The global Button — a frame-accurate port of the free Framer marketplace
  component "Quick Scan Button" by Gennady Muzych
  (preview: https://scanbutton.framer.website/).

  Every value below was taken from the published component's generated source,
  so this is the reference design, not an approximation:

  Structure (intrinsic size 156 x 67 for the default label):
  - Four 11 x 11 corner markers straddling the body corners. Each marker is two
    1px lines; centered on each other they form a "+" cross, pushed to the box
    edges they form an L-shaped viewfinder bracket. Markers rest 5px outside
    the body (Button One) or exactly on the corners (Button Two idle).
  - Body = "text section": padding 24px 30px, four 1px hairline borders
    (text color at 10% opacity), a label stack, and a "scan" element.
  - Label: two identical layers in a 19px-tall clipped stack (Inter 400,
    16px/19px). Hover rolls the stack up one line while the incoming layer
    re-reveals character by character.

  Variants (reference "Button One" / "Button Two"):
  - primary  -> Button One: accent-red cross + hairline border at rest; on
                hover the cross morphs into a white bracket and the scan
                element inflates into the solid accent fill.
  - secondary/ghost -> Button Two: white bracket, no border at rest; on hover
                the bracket morphs into a white cross (pushing 5px outward),
                the hairline border fades in, and a translucent accent band
                appears above the body (clipped by the body, as in the
                reference).

  Animation (exact reference configs):
  - All variant changes: tween, duration 1s, ease [0.44, 0, 0, 1]
    ("transition1" in the source). Colors, geometry, fill, and the label roll
    share this single curve, so the morph is perfectly synchronized.
  - Label reveal on hover: per-character spring, bounce 0, duration 0.3s,
    0.06s between characters ("transition2" + tokenization "character").
    The reveal restarts on every hover, like the reference's appear effect.

  API is unchanged for existing consumers: variant, size, `to` (internal
  route), `href` (external, opens in a new tab like the original link),
  className and native props. `textColor` / `accentColor` mirror the
  reference component's property panel (defaults: white / red).
*/

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  /** Internal route, e.g. "/projects". */
  to?: string;
  /** External URL or mailto link. */
  href?: string;
  /** Reference property "Text Color". */
  textColor?: string;
  /** Reference property "Accent Color". */
  accentColor?: string;
}

/** Reference `transition1`: every hover/idle transition. */
const VARIANT_TRANSITION: Transition = {
  type: "tween",
  duration: 1,
  ease: [0.44, 0, 0, 1],
};

/** Label line box of the reference: 16px Inter on a 19px line. */
const LABEL_HEIGHT = 19;
/** Corner marker box: 11px square. */
const MARK_SIZE = 11;
/** Marker resting offset outside the body / line offset inside the marker. */
const MARK_OUTSET = 5;
const MARK_INSET = 5;

/** Body padding per size; `lg` is the reference's exact 24px 30px (67px tall). */
const SIZE_STYLES: Record<ButtonSize, { padding: string; bodyHeight: number }> = {
  md: { padding: "16px 24px", bodyHeight: LABEL_HEIGHT + 32 },
  lg: { padding: "24px 30px", bodyHeight: LABEL_HEIGHT + 48 },
};

/* ------------------------------------------------------------------ */
/* Label layers                                                        */
/* ------------------------------------------------------------------ */

type LabelToken =
  | { kind: "char"; key: string; text: string }
  | { kind: "node"; key: string; node: ReactNode; gapLeft: boolean; gapRight: boolean };

/** Split children into per-character tokens (strings) and intact nodes (icons). */
function tokenizeLabel(parts: ReactNode[]): LabelToken[] {
  const out: LabelToken[] = [];
  let charIndex = 0;
  parts.forEach((part, index) => {
    if (typeof part === "string" || typeof part === "number") {
      for (const char of String(part)) {
        out.push({ kind: "char", key: `c${charIndex++}`, text: char });
      }
    } else {
      out.push({
        kind: "node",
        key: `n${index}`,
        node: part,
        gapLeft: index > 0,
        gapRight: index < parts.length - 1,
      });
    }
  });
  return out;
}

const NODE_GAP = 8;

const nodeBoxStyle = (gapLeft: boolean, gapRight: boolean): React.CSSProperties => ({
  display: "inline-block",
  verticalAlign: "middle",
  marginLeft: gapLeft ? NODE_GAP : 0,
  marginRight: gapRight ? NODE_GAP : 0,
});

/*
  Reference text effect: appear from { opacity: .001, y: 10 }, tokenized per
  character — bounce-0 spring over 0.3s with 0.06s between characters,
  replayed on every hover ("repeat: true"). Driven with the Web Animations
  API so each token's timing is exact: fill "backwards" holds every token at
  the appear state until its delay elapses, matching Framer's effect engine.
*/
const REVEAL_DURATION_MS = 300;
const REVEAL_STAGGER_MS = 60;
/** Framer's bounce-0 (critically damped) spring across 0.3s, as a bezier. */
const REVEAL_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

function playReveal(layer: HTMLElement | null): void {
  if (!layer) return;
  layer.querySelectorAll<HTMLElement>(":scope > span").forEach((token, index) => {
    token.getAnimations().forEach((animation) => animation.cancel());
    token.animate(
      [
        { opacity: 0.001, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0px)" },
      ],
      {
        duration: REVEAL_DURATION_MS,
        delay: index * REVEAL_STAGGER_MS,
        easing: REVEAL_EASING,
        fill: "backwards",
      },
    );
  });
}

function cancelReveal(layer: HTMLElement | null): void {
  if (!layer) return;
  layer.querySelectorAll<HTMLElement>(":scope > span").forEach((token) => {
    token.getAnimations().forEach((animation) => animation.cancel());
  });
}

/* ------------------------------------------------------------------ */
/* Corner markers                                                      */
/* ------------------------------------------------------------------ */

type CornerId = "tl" | "bl" | "br" | "tr";

/** Paint order matches the reference: left top, left bottom, right bottom, right top. */
const CORNERS: CornerId[] = ["tl", "bl", "br", "tr"];

const boxTarget = (id: CornerId, offset: number) =>
  id === "tl"
    ? { top: offset, left: offset }
    : id === "bl"
      ? { bottom: offset, left: offset }
      : id === "br"
        ? { bottom: offset, right: offset }
        : { top: offset, right: offset };

const verticalTarget = (id: CornerId, offset: number) =>
  id === "tl" || id === "bl" ? { left: offset } : { right: offset };

const horizontalTarget = (id: CornerId, offset: number) =>
  id === "tl" || id === "tr" ? { top: offset } : { bottom: offset };

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  to,
  href,
  textColor = tokens.fg,
  accentColor = tokens.accent,
  type,
  style: restStyle,
  ...rest
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const isButtonOne = variant === "primary";
  const { padding, bodyHeight } = SIZE_STYLES[size];

  const labelParts = Children.toArray(children);
  const labelTokens = tokenizeLabel(labelParts);

  /*
    Geometry per state, mirroring the reference's variant CSS:
    - markers sit at -5px for Button One (both states) and Button Two hover,
      and flush at 0px for Button Two idle.
    - lines sit centered in their 11px box (cross) or at the box edge
      (bracket); Button Two hover centers the cross on the body corner itself.
  */
  const markerOffset = isButtonOne || hovered ? -MARK_OUTSET : 0;
  const lineOffset = isButtonOne
    ? hovered
      ? 0
      : MARK_INSET
    : hovered
      ? MARK_INSET
      : 0;
  const lineColor = isButtonOne && !hovered ? accentColor : textColor;
  const borderOpacity = isButtonOne ? 0.1 : hovered ? 0.1 : 0;

  /*
    The reference "scan" element: a 1px line resting just below the body
    (clipped), which inflates into the full accent fill on Button One hover
    (growing upward from the bottom edge, bottom pinned at bodyHeight + 2),
    or into a 30px translucent band above the body on Button Two hover
    (bottom: 70px, height: 30px, width 114% — clipped in both cases, exactly
    like the original).
  */
  const scanTarget = !hovered
    ? { top: bodyHeight + 1, left: "0%", width: "100%", height: 1, opacity: 0.1 }
    : isButtonOne
      ? { top: 0, left: "0%", width: "100%", height: bodyHeight + 2, opacity: 1 }
      : { top: bodyHeight - 100, left: "-6.6879%", width: "114%", height: 30, opacity: 0.4 };

  const hoverLayerRef = useRef<HTMLParagraphElement>(null);

  const hoverHandlers = {
    onMouseEnter: () => {
      setHovered(true);
      // Replay the reference's character cascade on every hover.
      playReveal(hoverLayerRef.current);
    },
    onMouseLeave: () => {
      setHovered(false);
      cancelReveal(hoverLayerRef.current);
    },
  };

  const decorative = { "aria-hidden": true as const };

  const content = (
    <>
      {/* Corner markers: 11px boxes straddling the body corners. */}
      {CORNERS.map((id) => (
        <motion.span
          key={id}
          {...decorative}
          className="absolute z-[2] flex flex-col items-center justify-center overflow-clip"
          style={{ width: MARK_SIZE, height: MARK_SIZE }}
          animate={boxTarget(id, markerOffset)}
          transition={VARIANT_TRANSITION}
        >
          {/* Vertical line of the cross / bracket. */}
          <motion.span
            className="absolute top-0 bottom-0 w-px"
            animate={{ ...verticalTarget(id, lineOffset), backgroundColor: lineColor }}
            transition={VARIANT_TRANSITION}
          />
          {/* Horizontal line of the cross / bracket. */}
          <motion.span
            className="absolute left-0 right-0 h-px"
            animate={{ ...horizontalTarget(id, lineOffset), backgroundColor: lineColor }}
            transition={VARIANT_TRANSITION}
          />
        </motion.span>
      ))}

      {/* Body: the reference "text section" (padding, hairlines, label, scan). */}
      <div
        className="relative z-[1] flex w-min flex-row flex-nowrap items-center justify-center gap-[30px] overflow-clip"
        style={{ padding }}
      >
        {/* Hairline borders: text color at 10%, hidden for idle Button Two. */}
        <motion.span
          {...decorative}
          className="absolute top-0 left-0 z-[1] h-px w-full"
          style={{ backgroundColor: textColor }}
          animate={{ opacity: borderOpacity }}
          transition={VARIANT_TRANSITION}
        />
        <motion.span
          {...decorative}
          className="absolute right-0 bottom-0 z-[1] h-px w-full"
          style={{ backgroundColor: textColor }}
          animate={{ opacity: borderOpacity }}
          transition={VARIANT_TRANSITION}
        />
        <motion.span
          {...decorative}
          className="absolute top-0 bottom-0 left-0 z-[1] w-px"
          style={{ backgroundColor: textColor }}
          animate={{ opacity: borderOpacity }}
          transition={VARIANT_TRANSITION}
        />
        <motion.span
          {...decorative}
          className="absolute top-0 right-0 bottom-0 z-[1] w-px"
          style={{ backgroundColor: textColor }}
          animate={{ opacity: borderOpacity }}
          transition={VARIANT_TRANSITION}
        />

        {/* Label stack: two identical layers in a 19px clipped line box. */}
        <div className="relative z-[5] block h-[19px] w-min overflow-clip whitespace-pre text-[16px] leading-[19px] font-normal">
          {/* Resting layer — plain text (single text runs, like the reference). */}
          <motion.p
            className="m-0"
            animate={{ y: hovered ? -LABEL_HEIGHT : 0 }}
            transition={VARIANT_TRANSITION}
          >
            {labelParts.map((part, index) =>
              typeof part === "string" || typeof part === "number" ? (
                part
              ) : (
                <span
                  key={`n${index}`}
                  style={nodeBoxStyle(index > 0, index < labelParts.length - 1)}
                >
                  {part}
                </span>
              ),
            )}
          </motion.p>
          {/* Hover layer — rolls up from below and re-reveals per character. */}
          <motion.p
            ref={hoverLayerRef}
            aria-hidden
            className="absolute top-0 left-0 m-0"
            animate={{ y: hovered ? 0 : LABEL_HEIGHT }}
            transition={VARIANT_TRANSITION}
          >
            {labelTokens.map((token) => (
              <span
                key={token.key}
                className="inline-block"
                style={token.kind === "node" ? nodeBoxStyle(token.gapLeft, token.gapRight) : undefined}
              >
                {token.kind === "char" ? token.text : token.node}
              </span>
            ))}
          </motion.p>
        </div>

        {/* Scan element: accent line / fill / band. */}
        <motion.span
          {...decorative}
          className="absolute z-[1]"
          style={{ backgroundColor: accentColor }}
          animate={scanTarget}
          transition={VARIANT_TRANSITION}
        />
      </div>
    </>
  );

  const sharedClassName = cn(
    "relative inline-flex w-min cursor-pointer flex-col items-start justify-center gap-[30px] " +
      "font-scan text-[16px] leading-[19px] font-normal no-underline",
    className,
  );
  const sharedProps = {
    className: sharedClassName,
    style: { color: textColor, ...restStyle },
    ...hoverHandlers,
  };

  if (to) {
    return (
      <Link to={to} {...(rest as ComponentPropsWithoutRef<"a">)} {...sharedProps}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        {...(rest as ComponentPropsWithoutRef<"a">)}
        {...sharedProps}
      >
        {content}
      </a>
    );
  }

  return (
    <button type={type ?? "button"} {...rest} {...sharedProps}>
      {content}
    </button>
  );
}
