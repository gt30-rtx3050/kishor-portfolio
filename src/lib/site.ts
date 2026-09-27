/*
  ---------------------------------------------------------------------------
  SITE CONTENT: single source of truth for all copy on the Home page.
  Every value below is a clearly labeled PLACEHOLDER. Replace these values
  with real content before launch; no component edits should be needed.
  ---------------------------------------------------------------------------
*/

import projectAurora from "@/assets/projects/project-aurora.jpg";
import projectAtlas from "@/assets/projects/project-atlas.jpg";
import projectPulse from "@/assets/projects/project-pulse.jpg";
import portrait from "@/assets/about/portrait.jpg";

export interface Project {
  title: string;
  description: string;
  image: string;
  /** Alt text is intentionally a labeled placeholder too. */
  imageAlt: string;
  tags: string[];
  href: string;
}

export interface Skill {
  name: string;
  /** Shown in a tooltip. Keep it short. */
  note: string;
}

export const site = {
  // PLACEHOLDER: your name (used in the navbar, hero, footer, page title).
  name: "Your Name",
  // PLACEHOLDER: your role (hero headline, meta description).
  role: "Full-Stack Developer",
  // PLACEHOLDER: one sentence positioning statement.
  tagline: "I build fast, accessible products for the web.",
  // PLACEHOLDER: hero supporting paragraph.
  intro:
    "I design and build web experiences from first commit to production: resilient APIs, thoughtful interfaces, and the details in between.",
  // PLACEHOLDER: your email (mailto links).
  email: "hello@example.com",
  // PLACEHOLDER: where you are based.
  location: "Your City, Country",
  // PLACEHOLDER: availability line shown as a badge in the hero.
  availability: "Available for new projects",
  // PLACEHOLDER: social profile URLs.
  socials: {
    github: "https://github.com/your-handle",
    linkedin: "https://www.linkedin.com/in/your-handle",
    x: "https://x.com/your-handle",
  },
} as const;

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Experience", to: "/projects" },
  { label: "Skills", to: "/skills" },
  { label: "Contact", to: "/contact" },
] as const;

/* PLACEHOLDER projects: swap titles, blurbs, tags, images, and links. */
export const featuredProjects: Project[] = [
  {
    title: "Aurora Analytics",
    description:
      "Real-time analytics platform with streaming dashboards, role-based access, and sub-second queries over billions of events.",
    image: projectAurora,
    imageAlt: "PLACEHOLDER: replace with a screenshot of Aurora Analytics",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    href: "/projects",
  },
  {
    title: "Atlas Commerce",
    description:
      "Headless storefront with edge-rendered product pages, a one-page checkout, and a consistent 98+ Lighthouse score.",
    image: projectAtlas,
    imageAlt: "PLACEHOLDER: replace with a screenshot of Atlas Commerce",
    tags: ["Next.js", "GraphQL", "Redis", "Stripe"],
    href: "/projects",
  },
  {
    title: "Pulse Messenger",
    description:
      "End-to-end encrypted chat with offline sync, typing indicators, and reliable push delivery across devices.",
    image: projectPulse,
    imageAlt: "PLACEHOLDER: replace with a screenshot of Pulse Messenger",
    tags: ["React", "WebSockets", "Docker", "Redis"],
    href: "/projects",
  },
];

/* PLACEHOLDER about preview: a two sentence story, plus quick facts. */
export const aboutPreview = {
  eyebrow: "About",
  heading: "Engineer by craft, designer at heart.",
  paragraphs: [
    "I am a full-stack developer with six years of experience shipping products for startups and established teams. I care about clean architecture, honest typography, and interfaces that feel effortless.",
    "Away from the keyboard you will find me with coffee, cameras, and climbing walls.",
  ],
  facts: [
    { label: "Location", value: "Your City, Country" },
    { label: "Experience", value: "6+ years" },
    { label: "Currently", value: "Freelance, open to offers" },
  ],
  image: portrait,
  imageAlt: "PLACEHOLDER: replace with a photo of you",
} as const;

/* PLACEHOLDER skills: names plus the short tooltip note for each. */
export const skills: Skill[] = [
  { name: "TypeScript", note: "Primary language, 5+ years" },
  { name: "React", note: "Daily driver for UI work" },
  { name: "Next.js", note: "SSR and edge rendering" },
  { name: "Node.js", note: "APIs, tooling, and services" },
  { name: "PostgreSQL", note: "Schema design and query tuning" },
  { name: "GraphQL", note: "Typed data layers" },
  { name: "Tailwind CSS", note: "Design systems at speed" },
  { name: "Docker", note: "Reproducible environments" },
  { name: "AWS", note: "Hosting and CI/CD" },
  { name: "Redis", note: "Caching and queues" },
  { name: "Vitest", note: "Testing across the stack" },
  { name: "Figma", note: "Prototyping and handoff" },
];

/* PLACEHOLDER contact section copy. */
export const contactCta = {
  eyebrow: "Contact",
  heading: "Let's build something great.",
  copy: "Have a project in mind, a role to fill, or just want to say hi? My inbox is always open.",
  buttonLabel: "Get in Touch",
} as const;
