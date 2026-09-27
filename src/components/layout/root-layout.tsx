import { Suspense } from "react";
import { Outlet, useHref, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HeroUIProvider } from "@heroui/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/layout/scroll-to-top";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading page">
      <span className="size-2 animate-pulse rounded-full bg-fg" />
    </div>
  );
}

/*
  App shell: navbar, page outlet with a light crossfade transition, footer.
  HeroUIProvider is wired to React Router so HeroUI links/pressables
  navigate client-side instead of doing full page loads.
*/
export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ScrollToTop />
      <div className="flex min-h-svh flex-col bg-bg text-fg">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            id="main-content"
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex-1"
          >
            <Suspense fallback={<RouteFallback />}>
              <Outlet />
            </Suspense>
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </HeroUIProvider>
  );
}
