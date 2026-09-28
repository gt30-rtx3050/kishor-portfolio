/**
 * Contour Timeline — geometry recovered from the user-supplied `timeline.html`
 * (a saved render of https://contour-timeline.framer.website/).
 *
 * Every number below is read out of that file's server-rendered markup, which
 * contains one frame of the component with the third station selected: the
 * ribbon path, both echo paths, the stem, the marker circles and the active
 * station's transforms. See docs/experience-timeline-reference.md.
 *
 * Vertical mapping, rail space (y grows downward):
 *
 *   labels row     station labels (years + company)      ← our cards' labels
 *   -------------------------------- strip top (0)
 *   marker circle / arch peak       (peakY   = 30)
 *   station dots + flat run         (baselineY = 92)
 *   stem                            (down to stripHeight = 140)
 *   cards row      the five company cards                ← the reference's card
 *
 * The reference stacks the same three pieces in the opposite order (card above
 * the rail, stations below it). The arch, marker and stem keep the reference's
 * exact geometry; only where the stem points — down at the card instead of up
 * at it — is mirrored.
 */

export const CONTOUR = {
  /**
   * The flat run of the ribbon. The reference has it at y = 90 in a 122px SVG
   * with the card above it; here the labels are above and the cards below, so
   * the same 62px arch sits a little higher in a 140px strip.
   */
  baselineY: 92,
  /** Reference: 90 − 62 = 28, so the arch rises 62px above the flat run. */
  humpHeight: 62,
  /** Reference: the curve leaves the flat run 145px either side of the station. */
  humpHalfWidth: 145,
  /** Reference control points: (x − 60.9, baseline) and (x − 69.6, peak). */
  controlOuter: 60.9,
  controlInner: 69.6,
  /** Reference echo 1: baseline 94 / peak 29.6; echo 2: 98 / 31.2. */
  echoOffsetY: 4,
  echoPeakOffsetY: 1.6,
  echoWidth: 0.825,
  echoOpacity: [0.7, 0.62] as const,
  /** Reference: main path stroke-width 1.5. */
  lineWidth: 1.5,
  /** Reference: stem stroke-width 1.5, circle r=13 with a 1px stroke, dot r=5. */
  stemWidth: 1.5,
  markerRadius: 13,
  markerDotRadius: 5,
  markerStrokeWidth: 1,
  /** Reference: a 6px station dot, hidden while its station is active. */
  dotSize: 6,
  /** Distance from the dot's centre up to the flat run of the ribbon. */
  dotLift: 12,
  /** Reference: the active station's year renders translateY(3px) scale(1.16). */
  activeScale: 1.16,
  activeShiftY: 3,
  /** Reference: stations are inset 7px inside their 212.8px cell. */
  cellInset: 7,
  /** Rail strip: peak (38) + marker (13) above, 40px of stem below the baseline. */
  stripHeight: 140,
  /** Below this a card stops being readable; the rail scrolls instead. */
  minCell: 190,
  /** Keep a short flat run either side of the arch at the first/last station. */
  edgePadding: 12,
  /**
   * The reference animates with Framer Motion springs. Its exact spring config
   * is not present in the saved markup (it lives in the JS bundle that was not
   * uploaded), so this is the closest reconstruction of that glide: quick to
   * leave, no visible overshoot on a 200–900px travel.
   */
  spring: { type: "spring", stiffness: 210, damping: 26, mass: 0.9 },
} as const;

export const PEAK_Y = CONTOUR.baselineY - CONTOUR.humpHeight;

/** Ready for SVG: trims the float noise JS otherwise prints. */
const round = (value: number) => Number(value.toFixed(4));

/** Centre of a station's cell — the reference uses `index + 0.5` of the cell. */
export function stationCenter(index: number, count: number, trackWidth: number) {
  if (count <= 0 || trackWidth <= 0) return 0;
  return (trackWidth / count) * (index + 0.5);
}

/** Visible width of a station/card inside its cell (reference: cell − 14). */
export function stationWidth(count: number, trackWidth: number) {
  const cell = trackWidth / Math.max(count, 1);
  return Math.max(cell - CONTOUR.cellInset * 2, 0);
}

/**
 * The rail never gets narrower than five readable cells, so a phone gets a
 * swipeable rail instead of five unreadable slivers.
 */
export function trackWidthFor(available: number, count: number) {
  return Math.max(Math.round(available), Math.round(CONTOUR.minCell * Math.max(count, 1)));
}

/**
 * Near the first and last station the reference's 145px arch would run past the
 * end of the track, so it is narrowed just enough to stay inside the rail. The
 * arch keeps its height and its centre, so the marker stays on the station.
 */
export function humpHalfWidth(x: number, trackWidth: number) {
  const reachable = Math.max(trackWidth - x - CONTOUR.edgePadding, 0);
  return Math.max(Math.min(CONTOUR.humpHalfWidth, Math.max(x - CONTOUR.edgePadding, 0), reachable), 1);
}

interface RibbonOptions {
  baselineY?: number;
  peakY?: number;
  /** Echo index (1 or 2) drops the line by 4px per step, peak by 1.6px. */
  echo?: number;
}

/**
 * The reference path at x = 532 in a 1064px track, verbatim:
 *   M 0 90 H 387 C 471.1 90, 462.4 28, 532 28 C 601.6 28, 592.9 90, 677 90 H 1064
 * This function reproduces that string exactly for the unclamped case and
 * scales the control points with the arch when it has to narrow.
 */
export function ribbonPath(x: number, trackWidth: number, options: RibbonOptions = {}) {
  const echo = options.echo ?? 0;
  const baselineY = (options.baselineY ?? CONTOUR.baselineY) + CONTOUR.echoOffsetY * echo;
  const peakY = (options.peakY ?? PEAK_Y) + CONTOUR.echoPeakOffsetY * echo;
  const halfWidth = humpHalfWidth(x, trackWidth);
  const scale = halfWidth / CONTOUR.humpHalfWidth;
  const outer = CONTOUR.controlOuter * scale;
  const inner = CONTOUR.controlInner * scale;
  const left = x - halfWidth;
  const right = x + halfWidth;

  return [
    `M 0 ${round(baselineY)}`,
    `H ${round(left)}`,
    `C ${round(x - outer)} ${round(baselineY)}, ${round(x - inner)} ${round(peakY)}, ${round(x)} ${round(peakY)}`,
    `C ${round(x + inner)} ${round(peakY)}, ${round(x + outer)} ${round(baselineY)}, ${round(right)} ${round(baselineY)}`,
    `H ${round(trackWidth)}`,
  ].join(" ");
}

/**
 * The reference draws the stem from the card edge to the arch peak *before* the
 * marker, whose opaque fill then hides the overlap. Same trick here: the stem
 * runs the full strip and the marker circle covers its top.
 */
export function stemPath(x: number, stripHeight = CONTOUR.stripHeight, peakY = PEAK_Y) {
  return `M ${round(x)} ${round(peakY)} V ${round(stripHeight)}`;
}

/** Clamp a station index coming from a scroll or a key press. */
export function clampIndex(index: number, count: number) {
  if (count <= 0) return 0;
  return Math.min(Math.max(index, 0), count - 1);
}

/** Next/previous station, wrapping — used by the roving-tabindex arrow keys. */
export function stepIndex(index: number, count: number, direction: 1 | -1) {
  if (count <= 0) return 0;
  return (index + direction + count) % count;
}
