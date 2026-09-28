# Experience page: Contour Timeline reference

## Provenance

The user supplied `timeline.html` in the repository root and asked for a new Experience-page section with five company cards that animate exactly like it.

The file is a saved render of **https://contour-timeline.framer.website/**, a Framer component preview ("Contour Timeline — an original, responsive timeline with a moving ribbon and editable milestones"). It arrives with the site's server-rendered markup, one frame of the component's state, and its own `<style>` block; the interactive bundle (`timeline_files/script_main.*.mjs`, which no longer exists) was not uploaded.

What could be recovered from the upload, and what that gives us:

- The component's **DOM and inline styles** for the frame where the third station is selected: both echo paths, the main ribbon path, the stem, the marker circle and dot, the station grid (`left`, width, insets, padding), the active station's `translateY(3px) scale(1.16)` and its hidden 6px dot, and the detail card's radius / border / shadow / type scale.
- The **station layout rule**: five stations across a 1064px track → 212.8px cells, each station 198.8px wide with a 7px inset either side, centres at `212.8 * (index + 0.5)`.
- The **ribbon geometry**: flat run at `y = 90`, arch 62px above it, curve releases 145px either side of the centre, control offsets 60.9px (baseline) and 69.6px (peak), echo lines 4px lower and 1.6px less tall each, strokes 1.5 / 0.825, echo opacities 0.7 and 0.62, marker `r=13` with a 1px stroke, inner dot `r=5`.
- The **motion library**: the page loads Framer Motion (`motion.GXCUF0RE.mjs`), so the ribbon is animated with motion values/springs. The exact spring config lives in the missing bundle and is **not** recoverable, so `CONTOUR.spring` is an explicit reconstruction (see below) rather than a recovered value.

Everything above is transcribed into `src/components/experience/contour-math.ts` and asserted in `tests/contour-math.test.mjs`, including a test that reproduces the reference path string character for character at the reference's own coordinates.

## Retained from the reference

- Ribbon shape, echo lines, stroke widths, opacities, marker and dot radii, and the draw order (echoes → main path → stem → opaque marker circle, which is what hides the head of the stem).
- Station cells: equal columns, 7px inset per station, centres at the middle of each cell.
- Station label rules: 34px label, `-0.05em`, `padding: 7px 9px`; 10px caption at `0.045em`; a 6px dot per station on the line; active state = label scaled `1.16` and shifted `3px`, caption and label in the accent colour, dot animated to `opacity: 0` and `r: 0` (the reference scales its dot away; an SVG circle shrinks by radius here).
- Card surface rules: 18px radius, 1px border, the reference's type scale for the eyebrow, the title and the body copy, and a small accent bullet before each line.
- The rail behaves like the reference's `data-rail`: a native horizontal scroller with `overscroll-behavior-x: contain` and no visible scrollbar.
- Keyboard and screen-reader behaviour follows the reference's own markup: stations are buttons with `aria-current="step"` and an `"<years>: <company>"` accessible name, grouped under a labelled `role="group"`, plus a visually hidden `role="status"` live region announcing the selection.
- Reduced-motion users get the state changes without the travel (no spring) and without card scaling, matching how the rest of the site treats motion.

## Intentional changes

- **Layout.** The reference stacks *card above, stations below* and shows one card at a time. The user asked for the five cards in one horizontal row, so the order becomes *station labels → ribbon → cards*, with the marker's stem now dropping down to the selected card instead of rising to it. The arch still rises to the selected station, which is what the reference's ribbon does.
- **Five cards, one per employer**, from `src/lib/experiences.ts` rather than the reference's demo milestones. Each card carries the company name, the years, the role and the key responsibilities. The reference's demo images and "Explore chapter" link are dropped: this is a career timeline, not a link list.
- **Black surface.** The reference renders on paper (`#f7f4ee`) with the accent `#713b4a` and the line `#d7cac3`. The brief asks for a black section, so the paper colour becomes the text, the accent keeps its hue at a lightness that reads on black (`#c98b9b`), and the line keeps its hue at low alpha. No new hue is introduced, and no site token is changed.
- **The arch narrows near the ends of the rail.** The reference's 145px arch would run past the track at the first and last station; `humpHalfWidth()` shrinks the arch (keeping its centre and height) just enough to keep a 12px flat run.
- **Responsive floor.** Below ~950px of available width the rail pans sideways rather than squeezing five cards into unreadable slivers, and selecting a station scrolls that card into view.
- **Placeholder copy.** The user chose to supply the real responsibilities themselves; every one of the fifteen lines in `src/lib/experiences.ts` is an explicit `Placeholder — …` marker to be replaced. Nothing on those cards is represented as real work history.

## Motion note

Motion values are driven by one spring (`CONTOUR.spring`) so the ribbon paths, stem and marker circles move as a single object. The saved markup proves the *states*, not the interpolation: geometry, active/inactive values and the library are faithful, while the spring numbers are a documented reconstruction of the original glide. If the user wants a different feel, that single constant is the knob.

## Checks

```sh
npm run build
npx eslint src/components/experience src/lib/experiences.ts src/pages/projects-page.tsx tests
node --experimental-strip-types --test tests/contour-math.test.mjs
node --experimental-strip-types --test tests/orbit-math.test.mjs
```

The full `npm run lint` reports three pre-existing `no-explicit-any` errors in `src/components/home/skills-strip.tsx` (lines 173–175), unchanged by this work.
