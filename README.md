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
  assets/            # project images, portrait, experience card artwork
  components/
    animate-ui/      # Animate UI adaptations: TextReveal, BlurFade
    background/      # ReactBits-style ParticleGrid canvas (hero)
    experience/      # Experience page: Orbit career scene and the Contour career timeline (+ their math)
    home/            # Hero, FeaturedProjects, AboutPreview, SkillsStrip, ContactCTA
    layout/          # Navbar, Footer, RootLayout, ScrollToTop
    react-bits/      # TechText (React Bits "Tech Text"), used for the hero name
    ui/              # Button, Badge, ArrowLink, SectionHeading, Reveal, icons
  lib/               # site.ts (all copy), tokens.ts, mui-theme.ts, utils.ts
  pages/             # home-page + placeholders for the 4 upcoming pages
  routes/            # router.tsx (single route table, lazy pages)
  styles/            # globals.css: design tokens, Tailwind theme, plugins
```

## Which library does what

| Library | Used for |
| --- | --- |
| Untitled UI | Design language for the `ui/` primitives (Badge, SectionHeading, ArrowLink patterns). |
| Quick Scan Button (Framer) | The global `ui/button.tsx`: a frame-accurate port of the free Framer component "Quick Scan Button" (scanbutton.framer.website) — viewfinder markers that morph cross ↔ bracket, accent fill, 1s `[0.44,0,0,1]` tween, per-character label cascade. |
| HeroUI | Project cards (`Card`, `Chip`), `HeroUIProvider` wired to React Router. Theme remapped to the palette in `src/heroui.ts`. |
| Flowbite React | `Footer`, `FooterCopyright`, `FooterIcon`, `FooterTitle`. |
| MUI (sparingly) | Tooltips on the skills strip. Themed in `src/lib/mui-theme.ts`. |
| Animate UI (adapted) | `TextReveal` (word masks) and `BlurFade` (skills stagger) in `components/animate-ui/`. |
| ReactBits (adapted) | `ParticleGrid` interactive dot field in `components/background/`; `TechText` hero heading in `components/react-bits/` (vendored verbatim from the React Bits source, MIT). |
| Framer Motion | All scroll reveals, hover micro-interactions, navbar drawer, page transitions. `MotionConfig reducedMotion="user"` globally. |
| GSAP + ScrollTrigger | Hero only: entrance timeline (per-character name reveal) and scroll parallax. The two libraries never own the same effect. |

## Editing colors, fonts, and copy

- Colors: `src/styles/globals.css` (`@theme` block defines `--color-bg`, `--color-fg`, `--color-muted`, `--color-accent`, consumed as `bg-bg`, `text-fg`, `text-muted`, `bg-accent`, ...). The first three are the neutral palette; `--color-accent` (#ff0000) is the Quick Scan Button's Accent Color, the one hue the global button introduces. These hex values are also mirrored in `src/lib/tokens.ts`, which feeds `src/heroui.ts` and `src/lib/mui-theme.ts`. Change both places together.
- Fonts: self-hosted via Fontsource, imported in `src/main.tsx`. Families are mapped in the same `@theme` block: `--font-sans` (Archivo Variable, body), `--font-display` (Instrument Serif, headlines), and `--font-scan` (Inter — the global button's label, as in the reference component). To swap a font, change the import and the `--font-*` token; no component edits.
- Copy: everything (name, role, email, socials, projects, skills, about text) lives in `src/lib/site.ts` with `PLACEHOLDER` markers on every value to replace.
- Images: swap the files in `src/assets/projects/` and `src/assets/about/` (keep the filenames, or update the imports at the top of `site.ts`). Alt text placeholders are in `site.ts` too. The five career cards read their artwork from `src/assets/experience/`, bound in `src/lib/experiences.ts` — keep those `new URL(..., import.meta.url)` paths as static literals so Vite can rewrite them.

## The hero heading

The name in the hero `<h1>` is drawn by **React Bits "Tech Text"** (`src/components/react-bits/tech-text.tsx`, vendored verbatim from the React Bits MIT source). It is a canvas component, not DOM text, so:

- The component auto-sizes the wordmark to its box: it fits to 90% of the width and 66% of the height. The wrapper is `h-[1.04em]` of the heading's `clamp()` size, which lands the name on almost exactly the same pixel size the old CSS produced. Change the clamp and the canvas follows.
- The typeface comes from CSS inheritance, not a hardcoded prop: the wrapper sits inside the `font-display` heading, so swapping `--font-display` in `globals.css` is enough. `fontWeight` is pinned to `400` because Instrument Serif only ships 400 and anything heavier would be browser-synthesized faux bold.
- A visually hidden copy of the name stays in the heading and the canvas is `aria-hidden`, so screen readers and crawlers still get real text.
- Pointer interactions (hover outline, selection frame, dragging a letter) need a real pointer; touch drags a letter too, and the container is `touch-action: pan-y` so the page still scrolls.
- With `prefers-reduced-motion` the component skips its idle sweep and renders the static solid wordmark.

## The Experience page

`/projects` is the Experience page. It has three parts:

1. A hero (`experience-page-hero` in `src/styles/experience.css`).
2. **Orbit** — a frame-accurate rebuild of the Framer component saved as `Orbit Projects.html`. Source values, retained settings and the intentional differences are in `docs/experience-reference.md`; the numbers live in `src/components/experience/orbit-math.ts`.
3. **Career timeline** — a rebuild of the component saved as `timeline.html` (contour-timeline.framer.website): a ribbon whose arch, marker and stem glide to the selected station while that station's label scales up and the card below brightens. Five company cards sit in one row, one per employer. Values are in `src/components/experience/contour-math.ts`, provenance and differences in `docs/experience-timeline-reference.md`.

Both scenes read the same data file, `src/lib/experiences.ts`: company, role, years, a short station label, the card artwork, and `responsibilities` — the bullet list on each timeline card. Replace the fifteen `Placeholder — …` lines there with the real responsibilities; the layout tolerates two to four lines per card.

## Accessibility and motion

- Semantic landmarks, single h1 per page, heading hierarchy, skip link, focus-visible outlines, aria-labels on icon-only controls, mobile drawer with Escape close, scroll lock, and focus move.
- `prefers-reduced-motion`: Framer Motion is simplified globally via `MotionConfig`, both text-reveal components render plain text, GSAP timelines are skipped, the particle field renders one static frame with no loop, and the hero TechText skips its idle sweep.
- Canvas and decorative layers are `aria-hidden`; split-text headings carry a visually hidden copy for screen readers, and the canvas hero name does the same (hidden copy in the heading, `aria-hidden` canvas beside it).

## Adding the next pages

Create `src/pages/<name>-page.tsx`, add a route entry in `src/routes/router.tsx`, and add the nav label in `navLinks` inside `src/lib/site.ts` if needed. The layout, transitions, and footer come along automatically.
