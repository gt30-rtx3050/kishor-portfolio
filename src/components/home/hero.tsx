import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { site } from "@/lib/site";
import TechText from "@/components/react-bits/tech-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  MailIcon,
  MapPinIcon,
} from "@/components/ui/icons";

gsap.registerPlugin(ScrollTrigger);

/*
  Hero: full viewport height with the site's single GSAP moment.
  GSAP owns the entrance timeline (masked heading reveal + staggered
  support elements) and the scroll-linked parallax. Everything else on the
  page uses Framer Motion, so each effect has exactly one owner.

  The name is drawn by the React Bits "Tech Text" canvas component, which
  owns its own rAF loop for the pointer/sweep outline reveal, the selection
  frame and the draggable-letter spring. The container is a single element,
  so the entrance masks that one block instead of per-character spans.
*/
export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Reduced motion: default markup is already the final visible state.
      if (reduceMotion) return;

      const timeline = gsap.timeline({ delay: 0.15, defaults: { ease: "power4.out" } });
      timeline
        .fromTo(
          "[data-hero='name']",
          { yPercent: 118 },
          { yPercent: 0, duration: 1.05 },
          0,
        )
        .fromTo("[data-hero='role']", { yPercent: 115 }, { yPercent: 0, duration: 0.9 }, 0.4)
        .fromTo(
          "[data-hero='fade']",
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.09 },
          0.55,
        );

      // Scroll parallax: hero content drifts up and dims as it leaves view.
      gsap.to(content, {
        yPercent: -12,
        autoAlpha: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom 20%",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Introduction"
      className="relative flex min-h-svh items-center justify-center overflow-hidden"
    >
      <video
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="https://www.pexels.com/download/video/36703282/" type="video/mp4" />
      </video>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/50" />

      <div ref={contentRef} className="shell relative flex flex-col items-center py-32 text-center">
        <p data-hero="fade">
          <Badge>
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fg opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-fg" />
            </span>
            {site.availability}
          </Badge>
        </p>

        <h1 className="mt-8 font-display text-[clamp(103.68px,15.12vw,218.88px)] leading-[1.04] font-normal tracking-[-0.03em] max-[799px]:text-[clamp(97.92px,17.28vw,144px)]">
          {/* React Bits "Tech Text": the name is a canvas, so the entrance mask
              wraps one block instead of per-character spans. The sr-only copy
              keeps the real name in the heading for screen readers and search. */}
          {/* TechText auto-fits its glyphs to 90% of its own box, so the drawn
              size follows the box, not font-size. All three of its inputs have
              to scale by the same factor or one of them caps the others: this
              frame (120% wide, recentred with left-1/2 + -translate-x-1/2), the
              frame height (1.04em of the h1 clamp, itself 1.2x larger) and the
              fontSize ceiling below.

              No viewport cap here, deliberately. Capping the frame at the
              viewport (calc(100vw-2rem)) is what made the previous pass a
              near no-op on phones: at 375px it left the frame 343px wide and
              the name only 5% larger. The cap was guarding against clipping the
              glyphs, but the glyphs only ever occupy 90% of the frame, and
              measured across 320-1920px they stay inside the viewport — the
              tightest is 3.5px of margin per side, at 560px. Whatever does
              spill past the viewport is the frame's own empty margin, which the
              section's overflow-hidden trims without touching the letters. */}
          <span className="relative left-1/2 block w-[120%] -translate-x-1/2 overflow-hidden pb-[0.06em] -mb-[0.06em]">
            <span className="sr-only">{site.name}</span>
            <span data-hero="name" className="block h-[1.04em] will-change-transform" aria-hidden="true">
              <TechText
                text={site.name}
                fontWeight={400}
                fontSize={216}
                color="#ffffff"
                accentColor="#ffffff"
              />
            </span>
          </span>
          <span className="mt-2 block overflow-hidden pb-[0.12em] -mb-[0.12em] text-[clamp(1.62rem,4.08vw,3.3rem)] font-normal tracking-[-0.02em] text-fg/85">
            <span data-hero="role" className="block px-[0.08em] italic will-change-transform">
              {site.role}
            </span>
          </span>
        </h1>

        <p
          data-hero="fade"
          className="mt-8 max-w-xl text-base font-light leading-relaxed text-muted/90 sm:text-lg"
        >
          {site.intro}
        </p>

        <div data-hero="fade" className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button to="/projects" size="lg">
            View Work
            <ArrowRightIcon className="size-4" />
          </Button>
          <Button href={`mailto:${site.email}`} variant="secondary" size="lg">
            <MailIcon className="size-4" />
            Contact Me
          </Button>
        </div>

        <p data-hero="fade" className="mt-14 flex items-center justify-center gap-2 text-sm text-fg/45">
          <MapPinIcon className="size-4" />
          {site.location}
        </p>
      </div>

      {/* Scroll cue: GSAP fades the wrapper, Framer bounces the chevron. */}
      <div data-hero="fade" className="absolute inset-x-0 bottom-8 flex justify-center">
        <motion.a
          href="#work"
          aria-label="Scroll to featured work"
          className="inline-flex rounded-md p-2 text-fg/50 transition-colors hover:text-fg"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDownIcon className="size-6" />
        </motion.a>
      </div>
    </section>
  );
}
