import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Self-hosted fonts (Fontsource): Archivo for body copy and buttons,
// Instrument Serif for headings/display type, Inter 400 for the button label
// (the reference component's typeface).
import "@fontsource-variable/archivo";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/inter/400.css";

import "./styles/globals.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
