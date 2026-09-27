/**
 * Orbit Projects by Stylokit — published component, recovered through the
 * script references in the user-supplied `Orbit Projects.html`.
 * See docs/experience-reference.md for the exact source and page configuration.
 * Keep the source's timings and geometry here, separate from React rendering.
 */
export const ORBIT = {
  scrollLength: 460,
  startOffset: 100,
  smoothness: 7,
  perspective: 1300,
  curveWidth: 570,
  curveHeight: 210,
  depth: 520,
  rotation: 250,
  cardWidth: 410,
  offsetY: -40,
  aspect: 1.33,
  radius: 8,
  depthOpacity: 80,
  depthScale: 82,
  renderQuality: 2,
  columns: 3,
  gap: 16,
  maxWidth: 852,
  positionY: 52,
  desktopBreakpoint: 800,
  mobileBreakpoint: 640,
  centerTextWidth: 220,
  titleCenterGap: 32,
} as const;

export interface OrbitViewport {
  width: number;
  height: number;
}

export const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(Math.max(value, minimum), maximum);

export const lerp = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

export function smootherstep(start: number, end: number, value: number) {
  if (start === end) return value < start ? 0 : 1;
  const progress = clamp((value - start) / (end - start));
  return progress ** 3 * (progress * (progress * 6 - 15) + 10);
}

export function getScrollProgress(top: number, height: number, windowHeight: number) {
  const entryLead = windowHeight * (ORBIT.startOffset / 100);
  return clamp((entryLead - top) / Math.max(height - windowHeight, 1));
}

export function getOrbitCopy(progress: number, viewportWidth: number) {
  const enter = smootherstep(0, 0.2, progress);
  const exit = smootherstep(0.74, 0.94, progress);
  const centerWidth = Math.min(ORBIT.centerTextWidth, viewportWidth * 0.5);
  return {
    opacity: enter * (1 - exit),
    shift: lerp(28, 0, enter),
    offset: lerp(viewportWidth * 0.7, (centerWidth + ORBIT.titleCenterGap) / 2, enter),
    centerWidth,
    centerOpacity: smootherstep(0.12, 0.25, progress) * (1 - smootherstep(0.58, 0.82, progress)),
  };
}

export function getOrbitCard(index: number, count: number, progress: number, viewport: OrbitViewport) {
  const { width: viewportWidth, height: viewportHeight } = viewport;
  const columns = Math.min(ORBIT.columns, Math.max(count, 1));
  const rows = Math.ceil(count / columns);
  const gridWidth = Math.min(ORBIT.maxWidth, Math.max(viewportWidth - 96, 200));
  const finalWidth = Math.max(90, (gridWidth - ORBIT.gap * (columns - 1)) / columns);
  const finalHeight = finalWidth / ORBIT.aspect;
  const gridHeight = rows * finalHeight + Math.max(rows - 1, 0) * ORBIT.gap;
  const arcWidth = Math.min(ORBIT.cardWidth, viewportWidth * 0.28);
  const arcHeight = arcWidth / ORBIT.aspect;
  const curveWidth = Math.min(ORBIT.curveWidth, viewportWidth * 0.44);
  const curveHeight = Math.min(ORBIT.curveHeight, viewportHeight * 0.3);
  const depth = Math.min(ORBIT.depth, viewportWidth * 0.42);

  const reveal = smootherstep(0.025 + index * 0.01, 0.18 + index * 0.012, progress);
  const flattened = smootherstep(0.56 + index * 0.009, Math.min(0.91 + index * 0.009, 0.99), progress);
  const orbitProgress = smootherstep(0.05, 0.7, progress);
  const angle = index / Math.max(count, 1) * 360 - 125 + orbitProgress * ORBIT.rotation;
  const radians = angle * Math.PI / 180;
  const arcX = Math.sin(radians) * curveWidth;
  const arcY = Math.cos(radians + 0.65) * curveHeight - viewportHeight * 0.025 + ORBIT.offsetY;
  const arcZ = Math.cos(radians) * depth;
  const normalizedDepth = clamp((arcZ + depth) / Math.max(depth * 2, 1));
  const arcScale = lerp(ORBIT.depthScale / 100, 1, normalizedDepth);
  const arcOpacity = lerp(ORBIT.depthOpacity / 100, 1, normalizedDepth);
  const entranceOffset = (1 - reveal) * viewportHeight * 0.48;
  const column = index % columns;
  const row = Math.floor(index / columns);
  const gridLeft = -gridWidth / 2 + column * (finalWidth + ORBIT.gap);
  const gridTop = viewportHeight * (ORBIT.positionY / 100) - viewportHeight / 2 - gridHeight / 2 + row * (finalHeight + ORBIT.gap);

  const width = lerp(arcWidth, finalWidth, flattened);
  const height = lerp(arcHeight, finalHeight, flattened);
  const x = lerp(arcX - arcWidth / 2, gridLeft, flattened);
  const y = lerp(arcY - arcHeight / 2 + entranceOffset, gridTop, flattened);
  const z = lerp(arcZ, 0, flattened);
  const rotateY = lerp(-Math.sin(radians) * 62, 0, flattened);
  const rotateZ = lerp(-Math.sin(radians) * 8, 0, flattened);
  const scale = lerp(arcScale, 1, flattened);
  const opacity = clamp(lerp(arcOpacity * reveal * smootherstep(0, 0.17, progress), 1, flattened));

  // The source rasterizes at 2x and compensates with scale to keep the
  // foreground cards sharp without changing their apparent geometry.
  const quality = ORBIT.renderQuality;
  const shadowStrength = lerp(1, 0.4, flattened);
  return {
    width: width * quality,
    height: height * quality,
    opacity,
    zIndex: flattened > 0.86 ? 100 + index : Math.round(100 + normalizedDepth * 800),
    transform: `translate3d(${x - width * (quality - 1) / 2}px, ${y - height * (quality - 1) / 2}px, ${z}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale / quality})`,
    shadow: `0 ${18 * shadowStrength * quality}px ${50 * shadowStrength * quality}px rgba(0, 0, 0, ${0.12 * shadowStrength})`,
  };
}
