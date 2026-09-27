/*
  Design tokens for TypeScript-land (HeroUI + MUI theming).
  Keep these in sync with src/styles/globals.css @theme block.
  Components should consume them through those theme providers, never raw.
*/
export const tokens = {
  bg: "#000000",
  fg: "#ffffff",
  muted: "#e7e7e7",
  /**
   * Accent of the global Quick Scan Button — the exact "Accent Color"
   * property default (rgb(255, 0, 0)) of the reference Framer component.
   * The single hue allowed outside the neutral palette.
   */
  accent: "#ff0000",
} as const;

/** White at arbitrary alpha over black: stays inside the approved palette. */
export const whiteAlpha = (alpha: number): string =>
  `rgba(255, 255, 255, ${alpha})`;
