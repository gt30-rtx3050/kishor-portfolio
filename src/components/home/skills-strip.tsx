import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { BlurFade } from "@/components/animate-ui/blur-fade";

/*
  Tools I reach for — stacking cards edition
  5 rectangular cards, sticky stacking on scroll.
  Each card groups tools by purpose with detailed copy.
*/

type ToolDetail = {
  name: string;
  purpose: string;
};

type ToolCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  tools: ToolDetail[];
  meta: string;
};

const toolCards: ToolCard[] = [
  {
    id: "01",
    eyebrow: "Analytics & Attribution",
    title: "Measure what moves revenue",
    description:
      "I don't report vanity metrics. I build measurement systems that tie every click, scroll, and conversion to business outcomes — so we know exactly what to double down on.",
    meta: "Reporting • Attribution • ROI",
    tools: [
      {
        name: "Google Analytics",
        purpose: "Full-funnel GA4 tracking, custom events, conversion paths & attribution modeling",
      },
      {
        name: "Looker Studio",
        purpose: "Live executive dashboards that turn raw data into decisions at a glance",
      },
      {
        name: "AgencyAnalytics",
        purpose: "Client-ready reporting that unifies SEO, PPC, and social in one view",
      },
    ],
  },
  {
    id: "02",
    eyebrow: "Paid Media & Programmatic",
    title: "Precision targeting at scale",
    description:
      "Every dollar has a job. From hyper-targeted paid social to programmatic domination, I build acquisition engines that scale ROAS, not just reach.",
    meta: "Acquisition • ROAS • Scale",
    tools: [
      {
        name: "Paid Marketing",
        purpose: "Meta, Google Ads, LinkedIn — campaigns engineered for ROAS and pipeline",
      },
      {
        name: "Google DV 360",
        purpose: "Programmatic buying, advanced audience segmentation & cross-channel frequency control",
      },
    ],
  },
  {
    id: "03",
    eyebrow: "SEO & Local Growth",
    title: "Organic growth that compounds",
    description:
      "Visibility you own. I build SEO systems that keep working long after the campaign ends — from technical health to local pack domination.",
    meta: "Organic • Local • Compounding",
    tools: [
      {
        name: "Semrush",
        purpose: "Competitor gap analysis, keyword strategy, technical audits & content opportunities",
      },
      {
        name: "Brightlocal",
        purpose: "Local SEO, citation management, rank tracking & reputation monitoring",
      },
    ],
  },
  {
    id: "04",
    eyebrow: "CRM & Lifecycle",
    title: "Systems that nurture & convert",
    description:
      "Leads are nothing without follow-through. I build automation that turns interest into revenue and first-time buyers into loyal customers.",
    meta: "Automation • Retention • LTV",
    tools: [
      {
        name: "HubSpot",
        purpose: "Enterprise CRM, lead scoring, lifecycle workflows & marketing automation",
      },
      {
        name: "GoHighLevel (GHL)",
        purpose: "Funnels, calendars, unified inbox & all-in-one client acquisition system",
      },
      {
        name: "Klaviyo",
        purpose: "Email & SMS flows that recover carts, retain customers and drive LTV",
      },
    ],
  },
  {
    id: "05",
    eyebrow: "Web Stack & Operations",
    title: "Fast sites that convert",
    description:
      "Performance is a feature. I ship fast, accessible, search-friendly experiences that are built to convert — and keep operations running smoothly.",
    meta: "Performance • Conversion • Ops",
    tools: [
      {
        name: "WordPress",
        purpose: "Flexible CMS builds when clients need ownership and speed to market",
      },
      {
        name: "Next.js + React",
        purpose: "Blazing-fast, SEO-optimized web apps with modern UX and 90+ Lighthouse",
      },
      {
        name: "Asana",
        purpose: "Campaign ops, sprint planning & launch coordination that keeps teams aligned",
      },
    ],
  },
];

function StackingCard({
  card,
  index,
  total,
}: {
  card: ToolCard;
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });

  // Entrance scale / opacity as card enters viewport
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  // Subtle background variations for depth, staying inside black/white palette
  const bgStyles = [
    "bg-[#0e0e0e] border-fg/10",
    "bg-[#111111] border-fg/[0.12]",
    "bg-[#0c0c0c] border-fg/10",
    "bg-[#131313] border-fg/[0.13]",
    "bg-[#0a0a0a] border-fg/10",
  ];

  return (
    <div
      ref={cardRef}
      className="sticky"
      style={{
        top: `calc(6rem + ${index * 18}px)`,
        zIndex: index + 1,
        marginBottom: index === total - 1 ? "0" : "6vh",
      }}
    >
      <motion.div
        style={{
          scale: scale as any,
          opacity: opacity as any,
          y: y as any,
        }}
        className="will-change-transform"
      >
        <div
          className={`group relative overflow-hidden rounded-[28px] border ${bgStyles[index % bgStyles.length]} shadow-[0_20px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all duration-500 hover:border-fg/20 hover:shadow-[0_30px_100px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]`}
        >
          {/* Subtle grain + gradient highlight */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_0%_0%,rgba(255,255,255,0.08),transparent_60%),radial-gradient(800px_400px_at_100%_100%,rgba(255,255,255,0.04),transparent_50%)]" />
            <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }} />
          </div>

          {/* Large watermark number */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-8 select-none font-display text-[11rem] leading-none tracking-[-0.06em] text-fg/[0.035] sm:text-[13rem]"
          >
            {card.id}
          </div>

          <div className="relative grid gap-8 p-7 sm:p-9 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:p-11">
            {/* Left: header + description */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-fg/15 bg-fg/[0.06] text-[11px] font-medium tracking-widest text-fg/70">
                  {card.id}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-fg/45">
                  {card.eyebrow}
                </span>
              </div>

              <h3 className="mt-6 font-display text-[1.9rem] leading-[0.95] tracking-[-0.03em] text-fg sm:text-[2.4rem] lg:text-[2.7rem]">
                {card.title}
              </h3>

              <p className="mt-4 max-w-[36ch] text-[15px] leading-relaxed text-muted/80">
                {card.description}
              </p>

              <div className="mt-7 flex items-center gap-2">
                <div className="h-px w-8 bg-fg/20" />
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-fg/35">
                  {card.meta}
                </span>
              </div>

              {/* Mobile tools list is here, desktop in right column */}
              <div className="mt-8 lg:hidden">
                <ToolList tools={card.tools} />
              </div>
            </div>

            {/* Right: tools purpose list */}
            <div className="relative flex flex-col justify-between">
              <div className="hidden lg:block">
                <ToolList tools={card.tools} />
              </div>

              {/* Bottom bar: progress + visual */}
              <div className="mt-8 flex items-center justify-between border-t border-fg/[0.08] pt-6 lg:mt-auto">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    {Array.from({ length: total }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-fg" : i < index ? "w-1.5 bg-fg/40" : "w-1.5 bg-fg/15"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-[11px] font-medium tabular-nums tracking-wide text-fg/40">
                    {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-fg/30">
                  <span className="hidden sm:inline">Purpose-built stack</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-fg/10 bg-fg/[0.04]">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                      <path d="M1 5H9M9 5L5 1M9 5L5 9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hover sheen */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
            <div className="absolute -inset-[1px] rounded-[28px] bg-gradient-to-b from-fg/[0.08] to-transparent" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ToolList({ tools }: { tools: ToolDetail[] }) {
  return (
    <ul className="space-y-4">
      {tools.map((tool) => (
        <li key={tool.name} className="group/item relative pl-6">
          <span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-fg/60 transition-all duration-300 group-hover/item:bg-fg group-hover/item:scale-125" />
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-[15px] font-medium leading-tight tracking-[-0.01em] text-fg">
              {tool.name}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-fg/25">—</span>
          </div>
          <p className="mt-1.5 text-[13.5px] leading-[1.5] text-muted/70">
            {tool.purpose}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function SkillsStrip() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="skills-heading"
      className="relative border-t border-fg/10 bg-bg"
    >
      {/* Top fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fg/15 to-transparent" />

      <div className="shell py-24 sm:py-28 lg:py-36">
        <SectionHeading
          id="skills-heading"
          eyebrow="Skills"
          title="Tools I reach for"
          align="center"
        />

        <Reveal>
          <p className="mx-auto -mt-6 mb-16 max-w-2xl text-center text-[15px] leading-relaxed text-muted/70 sm:mb-20 sm:text-[16px]">
            Not a laundry list. A purpose-built stack — each tool chosen for a specific job in the growth system.
            <span className="mt-3 block text-[13px] tracking-wide text-fg/35">
              Scroll to stack • 5 systems • Built for performance
            </span>
          </p>
        </Reveal>

        {/* Stacking cards container */}
        <div className="relative mx-auto max-w-[1100px]">
          {/* Vertical line hint for desktop */}
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-fg/10 via-fg/[0.04] to-transparent lg:block" />

          <div className="flex flex-col">
            {toolCards.map((card, index) => (
              <StackingCard key={card.id} card={card} index={index} total={toolCards.length} />
            ))}
          </div>
        </div>

        {/* Bottom quick glance - keeps original skills as glanceable chips */}
        <div className="mx-auto mt-20 max-w-4xl sm:mt-28">
          <BlurFade delay={0.1}>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-fg/10" />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-fg/30">
                All tools at a glance
              </span>
              <div className="h-px w-12 bg-fg/10" />
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              {toolCards.flatMap((c) => c.tools).map((t, i) => (
                <span
                  key={`${t.name}-${i}`}
                  className="inline-flex items-center rounded-full border border-fg/10 bg-fg/[0.03] px-3.5 py-1.5 text-[12.5px] font-medium tracking-wide text-fg/60 backdrop-blur-sm transition-colors hover:border-fg/20 hover:bg-fg/[0.06] hover:text-fg/80"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </BlurFade>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-fg/10 to-transparent" />
    </section>
  );
}
