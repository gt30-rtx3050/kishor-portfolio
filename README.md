# Kishor Portfolio

Personal portfolio website. React 19 + TypeScript + Vite, styled with Tailwind CSS v4 on a strict black (#000000), white (#ffffff), #e7e7e7 palette. The Home page is fully built; routing, layout, and navigation are already wired for the four remaining pages (About, Projects, Skills/Experience, Contact).

All names, copy, images, and links are clearly labeled placeholders. Nothing is hardcoded in components: every string lives in one content file.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck + production build to dist/
npm run preview   # serve the production build
npm run lint      # eslint
```

## Project structure

```
src/
  assets/            # placeholder project images + portrait (self-hosted by Vite)
  components/
    animate-ui/      # Animate UI adaptations: TextReveal, BlurFade
    background/      # ReactBits-style ParticleGrid canvas (hero)
    home/            # Hero, FeaturedProjects, AboutPreview, SkillsStrip, ContactCTA
    layout/          # Navbar, Footer, RootLayout, ScrollToTop
    ui/              # Button, Badge, ArrowLink, SectionHeading, Reveal, icons
  lib/               # site.ts (all copy), tokens.ts, mui-theme.ts, utils.ts
  pages/             # home-page + placeholders for the 4 upcoming pages
  routes/            # router.tsx (single route table, lazy pages)
  styles/            # globals.css: design tokens, Tailwind theme, plugins
```

## Which library does what

| Library | Used for |
| --- | --- |
| Untitled UI | Design language for the `ui/` primitives (Button, Badge, SectionHeading patterns). |
| HeroUI | Project cards (`Card`, `Chip`), `HeroUIProvider` wired to React Router. Theme remapped to the palette in `src/heroui.ts`. |
| Flowbite React | `Footer`, `FooterCopyright`, `FooterIcon`, `FooterTitle`. |
| MUI (sparingly) | Tooltips on the skills strip. Themed in `src/lib/mui-theme.ts`. |
| Animate UI (adapted) | `TextReveal` (word masks) and `BlurFade` (skills stagger) in `components/animate-ui/`. |
| ReactBits (adapted) | `ParticleGrid` interactive dot field in `components/background/`. |
| Framer Motion | All scroll reveals, hover micro-interactions, navbar drawer, page transitions. `MotionConfig reducedMotion="user"` globally. |
| GSAP + ScrollTrigger | Hero only: entrance timeline (per-character name reveal) and scroll parallax. The two libraries never own the same effect. |

## Editing colors, fonts, and copy

- Colors: `src/styles/globals.css` (`@theme` block defines `--color-bg`, `--color-fg`, `--color-muted`, consumed as `bg-bg`, `text-fg`, `text-muted`, ...). These three hex values are also mirrored in `src/lib/tokens.ts`, which feeds `src/heroui.ts` and `src/lib/mui-theme.ts`. Change all three places together.
- Fonts: self-hosted via Fontsource, imported in `src/main.tsx`. Families are mapped in the same `@theme` block: `--font-sans` (Inter Variable, body) and `--font-display` (Space Grotesk Variable, headlines). To swap a font, change the import and the `--font-*` token; no component edits.
- Copy: everything (name, role, email, socials, projects, skills, about text) lives in `src/lib/site.ts` with `PLACEHOLDER` markers on every value to replace.
- Images: swap the files in `src/assets/projects/` and `src/assets/about/` (keep the filenames, or update the imports at the top of `site.ts`). Alt text placeholders are in `site.ts` too.

## Accessibility and motion

- Semantic landmarks, single h1 per page, heading hierarchy, skip link, focus-visible outlines, aria-labels on icon-only controls, mobile drawer with Escape close, scroll lock, and focus move.
- `prefers-reduced-motion`: Framer Motion is simplified globally via `MotionConfig`, both text-reveal components render plain text, GSAP timelines are skipped, and the particle field renders one static frame with no loop.
- Canvas and decorative layers are `aria-hidden`; split-text headings carry a visually hidden copy for screen readers.

## Adding the next pages

Create `src/pages/<name>-page.tsx`, add a route entry in `src/routes/router.tsx`, and add the nav label in `navLinks` inside `src/lib/site.ts` if needed. The layout, transitions, and footer come along automatically.
