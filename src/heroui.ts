import { heroui } from "@heroui/react";
// Relative import: this file is loaded by Tailwind's plugin loader,
// which does not resolve the "@/" Vite alias.
import { tokens } from "./lib/tokens";

/*
  HeroUI theme: every semantic color is remapped onto the site palette so
  HeroUI components can never introduce a hue we did not approve. Whites and
  #e7e7e7 at reduced alpha are used for surfaces and dividers.
*/
export default heroui({
  defaultTheme: "dark",
  layout: {
    radius: {
      small: "8px",
      medium: "12px",
      large: "16px",
    },
    borderWidth: {
      small: "1px",
      medium: "1px",
      large: "2px",
    },
  },
  themes: {
    dark: {
      colors: {
        background: tokens.bg,
        foreground: tokens.fg,
        divider: "rgba(255, 255, 255, 0.14)",
        focus: tokens.fg,
        overlay: "rgba(0, 0, 0, 0.8)",
        content1: "rgba(255, 255, 255, 0.03)",
        content2: "rgba(255, 255, 255, 0.06)",
        content3: "rgba(255, 255, 255, 0.1)",
        content4: "rgba(255, 255, 255, 0.16)",
        default: {
          DEFAULT: "rgba(255, 255, 255, 0.1)",
          foreground: tokens.fg,
        },
        primary: {
          DEFAULT: tokens.fg,
          foreground: tokens.bg,
        },
        secondary: {
          DEFAULT: tokens.muted,
          foreground: tokens.bg,
        },
        // Success/warning/danger are pinned to neutrals: this site uses no
        // accent colors. Introduce real values here only with approval.
        success: { DEFAULT: tokens.muted, foreground: tokens.bg },
        warning: { DEFAULT: tokens.muted, foreground: tokens.bg },
        danger: { DEFAULT: tokens.muted, foreground: tokens.bg },
      },
    },
  },
});
