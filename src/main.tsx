import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Self-hosted variable fonts (Fontsource): body + display.
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";

import "./styles/globals.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
