import { RouterProvider } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "@mui/material/styles";
import { muiTheme } from "@/lib/mui-theme";
import { router } from "@/routes/router";

/*
  Provider order:
  - MUI ThemeProvider: keeps the sparingly used MUI pieces (tooltips) on palette.
  - MotionConfig reducedMotion="user": globally simplifies Framer Motion
    animations for users with prefers-reduced-motion.
  - RouterProvider: hosts the layout, which in turn provides HeroUIProvider
    (it needs router context to wire client-side navigation).
*/
export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </ThemeProvider>
  );
}
