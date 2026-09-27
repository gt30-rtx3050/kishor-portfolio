# Experience page: Orbit reference

## Provenance

The user supplied `Orbit Projects.html` in commit `6da1de3` on `main` and asked to use Orbit Projects as the reference. That file was copied into this session's branch without switching branches or importing unrelated changes.

The HTML contains the rendered scene and references its published bundle. The bundle's source map identified the original component and the page's **actual overrides** (which differ from its default props):

- Preview: https://orbitprojects.framer.website/
- Component ("Made in Stylokit"): https://framerusercontent.com/modules/mX4NDtwWCVqGOWIIAv3Y/PjYJYM0UOVDHnPEXbdIB/OrbitProject.js
- Published page configuration: https://framerusercontent.com/modules/rrdwuQaRJxc32OH53oYA/v6ShFEwCiJxn22vkhRdi/augiA20Il.js
- Source map: https://framerusercontent.com/sites/6gaNCz3WfleY7cSHLJq6sp/shared-lib.Ck22FJeb.mjs.map

The saved HTML alone has only one frame of transforms and refers to a companion `_files` directory that was not uploaded. Reading the published modules recovered the complete scroll formulas and configuration. Framer's editor, analytics, badges, runtime, and the browser-extension styles in the saved HTML are **not** bundled into the portfolio.

## Retained from the published configuration

- Background `rgb(232, 228, 227)`; text `rgb(29, 24, 22)`.
- Inter 144px / 0.86 line-height / -0.075em desktop titles.
- Title positions at 56% and 39%, center copy at 50%.
- 460vh scroll section and sticky 100svh viewport, minimum height 600px.
- Entry lead 100% of window height, exponential damping rate 7 with delta capped at 0.064 seconds.
- Perspective 1300px; orbit radii 570px and 210px; depth 520px; rotation 250 degrees; card width 410px; vertical offset -40px.
- The original per-card reveal, orbit, and staggered flatten smootherstep ranges.
- Depth opacity 80%, depth scale 82%, card aspect 1.33, visible corner radius 8px, 2x internal rendering with compensating scale.
- Final grid: three columns, 16px gaps, maximum width 852px, centered at 52% viewport height.
- Native page scrolling; no wheel hijacking or carousel substitution.
- Direct two-column grid below 800px and single column below 640px, 14px gaps, 0px compact padding. This is what the component does on mobile, rather than shrinking the desktop orbit.

## Intentional content/integration changes

- Five cards with the user's exact company names, roles, and dates instead of six image-only project cards. The source spaces cards using `index / itemCount`, so five cards are distributed evenly using the same formula.
- The first five reference image URLs are retained as decorative artwork. The uploaded HTML did not include their binary files. These remain external requests; a failed request displays a CSS surface instead of a broken image. The artwork is not represented as work created for these employers.
- HTML headings, role descriptions, dates and a contrast gradient have been added to the cards. Unlike the reference, the cards are not links to unrelated projects.
- “CAREER / ORBIT” and career-specific center copy replace “ORBIT / PROJECTS”.
- An original introductory hero uses the portfolio's existing Instrument Serif/Archivo typography. The shared navigation/footer and existing `/projects` Experience URL are preserved.
- Reduced-motion users get the static responsive grid, with no 460vh scrolling requirement.
- The animation uses local typed React code, without a dependency on Framer's hosted editor/runtime. Observers, event listeners, and animation frames clean up on navigation/unmount.
- The home page carousel and all other pages remain unchanged.

These are source-based motion/layout settings, **not a claim of pixel-identical screenshots**: content, item count, hero, shared site chrome, and card text are intentionally different. An artwork request failure also changes appearance.

## Checks

```sh
npm run build
npx eslint src/components/experience src/lib/experiences.ts src/pages/projects-page.tsx
node --experimental-strip-types --test tests/orbit-math.test.mjs
```

The full existing `npm run lint` reports three pre-existing `no-explicit-any` errors in `src/components/home/skills-strip.tsx` (lines 173–175).
