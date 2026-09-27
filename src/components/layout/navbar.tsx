import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRightIcon,
  CloseIcon,
  GitHubIcon,
  LinkedInIcon,
  MenuIcon,
  XIcon,
} from "@/components/ui/icons";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

const socialLinks = [
  { label: "GitHub", href: site.socials.github, Icon: GitHubIcon },
  { label: "LinkedIn", href: site.socials.linkedin, Icon: LinkedInIcon },
  { label: "X (Twitter)", href: site.socials.x, Icon: XIcon },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Transparent at the top of the page, solid + blurred once scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // While the drawer is open: lock scroll, close on Escape, focus first link.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    }, 120);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-fg/10 bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav aria-label="Primary" className="shell flex h-16 items-center justify-between">
        <Link
          to="/"
          aria-label={`${site.name}, back to home`}
          className="font-display text-lg font-normal tracking-tight"
        >
          {site.name}
          <span className="text-fg/40">.</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm transition-colors",
                    isActive ? "text-fg" : "text-fg/60 hover:text-fg",
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button to="/contact" className="hidden md:inline-flex">
            Let&apos;s Talk
          </Button>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-md text-fg transition-colors hover:bg-fg/5 md:hidden"
          >
            {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer: full-height panel, links stagger in. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-x-0 top-16 bottom-0 z-40 border-t border-fg/10 bg-bg/95 backdrop-blur-xl md:hidden"
          >
            <ul className="shell flex flex-col gap-1 pt-10">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + index * 0.06, duration: 0.4, ease: EASE }}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between rounded-xl px-4 py-4 font-display text-3xl font-normal tracking-tight transition-colors",
                        isActive ? "text-fg" : "text-fg/60 hover:text-fg",
                      )
                    }
                  >
                    {link.label}
                    <ArrowUpRightIcon className="size-5 text-fg/30" />
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            <div className="shell mt-12 flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-fg/15 text-fg/60 transition-colors hover:border-fg/40 hover:text-fg"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
