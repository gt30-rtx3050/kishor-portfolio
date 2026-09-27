/*
  Design tokens for TypeScript-land (HeroUI + MUI theming).
  Keep these in sync with src/styles/globals.css @theme block.
  Components should consume them through those theme providers, never raw.
*/
export const tokens = {
  bg: "#000000",
  fg: "#ffffff",
  muted: "#e7e7e7",
} as const;

/** White at arbitrary alpha over black: stays inside the approved palette. */
export const whiteAlpha = (alpha: number): string =>
  `rgba(255, 255, 255, ${alpha})`;
