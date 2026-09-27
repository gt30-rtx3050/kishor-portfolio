import { createTheme } from "@mui/material/styles";
import { tokens, whiteAlpha } from "@/lib/tokens";

/*
  MUI is used sparingly (tooltips today). This theme keeps it on-palette and
  mirrors the tokens in src/styles/globals.css.
*/
export const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: tokens.fg },
    background: { default: tokens.bg, paper: tokens.bg },
    text: { primary: tokens.fg, secondary: tokens.muted },
    divider: whiteAlpha(0.14),
  },
  typography: {
    fontFamily: '"Archivo Variable", ui-sans-serif, system-ui, sans-serif',
    // Mirrors the global weight rules: headings Normal (400), body Light (300).
    fontWeightLight: 300,
    fontWeightRegular: 400,
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: tokens.bg,
          color: tokens.fg,
          border: `1px solid ${whiteAlpha(0.16)}`,
          borderRadius: "10px",
          padding: "8px 12px",
          fontSize: "0.8125rem",
          fontWeight: 300,
          lineHeight: 1.4,
          boxShadow: `0 12px 32px rgba(0, 0, 0, 0.6)`,
        },
      },
    },
  },
});
