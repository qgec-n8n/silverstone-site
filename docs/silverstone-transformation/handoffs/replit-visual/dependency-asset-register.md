# Dependency & Asset Register — Page Features v1

What the page-feature work depends on and ships, so the production owner knows exactly what
must exist for the prototypes to run and what the React primitives rely on.

## Shared prototype runtime (owned, `web/public/prototypes/assets/`)

Loaded by every page in a fixed order (see the SHARED BUILD CONTRACT skeleton):

| File | Role | Type |
| --- | --- | --- |
| `prototype-tokens.css` | design tokens (colour/space/type scale) | CSS |
| `prototype.css` | base + home component styles | CSS |
| `pages.css` | all non-home module styles (incl. the two overflow fixes) | CSS |
| `chrome.js` | nav + footer injector, active-route, real cross-link map | ES module |
| `prototype.js` | nav compaction, disclosures, mobile panel | ES module |
| `reveal.js` | IntersectionObserver section reveal + page entry, reduced-motion aware | ES module |
| `demo.js` | accessible demo shell runtime + scenario registry | ES module |
| `tools-carousel.js` | Connector Constellation rail (filter, prev/next, status, keyboard, native scroll) | ES module |

`demo.js` and `tools-carousel.js` are loaded on every page for consistency; a page only
loads its sibling `./demo.js` when it registers a scenario.

## Per-page scenario files (owned)

15 sibling `demo.js` scenario files, each calling `window.SilverstoneDemo.register(...)`:

- Services (6): `web-conversion`, `app-state`, `voice-callflow`, `reception-console`, `content-loom`, `automation-lattice`.
- Industries (9): registered dynamically as `industry-<slug>` via `DATA.id` in each `industries/<slug>/demo.js`.

All scenario data is inline, synthetic, and deterministic — no external data source, no
network calls, no real client data.

## Visual assets

- All signature figures and icons are **inline SVG** authored in the page markup / React
  components. No raster images, sprite sheets, icon fonts, or external image requests.
- Typography uses the existing token stack (system/inline); no new web-font files were added.
- No third-party CSS/JS is fetched at runtime by any prototype page.

## React handoff dependencies (`web/src/visual/**`)

- **No new `package.json` dependencies were added** — package/config edits are outside the
  ownership envelope. The primitives are plain React + TypeScript.
- Reuses existing first-party contracts from the home handoff where relevant:
  `~/lib/visuals/lazy-visual-boundary` and `~/components/accessibility/use-reduced-motion`.
- New page-feature primitives (`DemoShell`, `ToolsCarousel`, `useSectionReveal`,
  `usePageTransition`, the six signatures, `IndustryInstrument`, `ServicesDecisionMatrix`,
  `IndustriesAtlas`) introduce no additional runtime libraries.
- Styles live in the single owned stylesheet `web/src/styles/visual/visual.css` (extended,
  not split into new files).

## Build / tooling

- Toolchain: the existing `/web` Vite + TypeScript + ESLint setup. `typecheck`, `lint`,
  `build` all pass (see `validation-matrix.md`). No build config was modified.
- Screenshot/audit tooling is throwaway (in `/tmp`), uses the project's already-installed
  bundled Chromium, and writes only into the owned `screenshots/` directory.

## What production must provide (not in this handoff)
- Real page copy, real proof/metrics, real pricing figures, real blog posts, and a real
  privacy policy — all current text is synthetic/illustrative placeholder.
- Real route wiring, data loaders, form submission/booking back-ends, and verification of
  any tool/integration claims before they are asserted as live.
