# Validation Matrix — High-Visibility Home (Precision Luminescence)

Scope: the static prototype (`web/public/prototypes/home/index.html`) is the primary
acceptance surface; the React handoff (`web/src/visual/**`) is compiler-verified.

## Toolchain gate (React handoff)

| Check | Command | Result |
| --- | --- | --- |
| TypeScript | `cd web && npm run typecheck` | PASS — clean |
| Lint | `cd web && npm run lint` | PASS — eslint `--max-warnings=0` |
| Build | `cd web && npm run build` | PASS — prerender + SPA fallback emitted |

## Render / console (prototype, platform browser)

| Check | Result |
| --- | --- |
| Home renders to locked art direction (platinum-led, cyan "flow" accent, constellation) | PASS — `screenshots/home-desktop.jpg` |
| Console on reload | CLEAN — no errors on second load |
| First-load transient (`Invalid hook call` / `Hydration failed`) | KNOWN, NOT FROM THIS WORK — one-time Vite dep re-optimization artifact on the main React app routes after a build/restart; clears on reload. The prototype is static HTML (no React) and the handoff is not route-rendered, so neither can produce it. Cannot be removed without editing `vite.config` (out of ownership scope). |

## Screenshot matrix (Playwright, bundled Chromium) — EXECUTED

The earlier launch blocker (`libgbm.so.1: cannot open shared object file`) was resolved by
installing the `mesa` and `libgbm` system libraries (permission for this step was granted).
Captures were driven by a throwaway script against the running prototype URL
(`http://localhost:5000/prototypes/home/index.html`); no tracked files were added outside
the owned `screenshots/` directory. Chromium build 149.0.7827.55.

| Viewport / condition | Screenshot | Horizontal overflow | Console errors |
| --- | --- | --- | --- |
| 320×568 | `screenshots/home-320x568.jpg` | none (sw=cw=320) | 0 |
| 360×800 | `screenshots/home-360x800.jpg` | none (sw=cw=360) | 0 |
| 390×844 | `screenshots/home-390x844.jpg` | none | 0 |
| 412×915 | `screenshots/home-412x915.jpg` | none | 0 |
| 768×1024 | `screenshots/home-768x1024.jpg` | none | 0 |
| 1024×768 | `screenshots/home-1024x768.jpg` | none | 0 |
| 1280×800 | `screenshots/home-1280x800.jpg` | none | 0 |
| 1440×900 | `screenshots/home-1440x900.jpg` | none | 0 |
| 200% zoom (WCAG 1.4.10 reflow → 640 CSS px) | `screenshots/home-zoom200.jpg` | none (sw=cw=640) | 0 |
| 400% zoom (WCAG 1.4.10 reflow → 320 CSS px) | `screenshots/home-zoom400.jpg` | none (sw=cw=320) | 0 |
| Reduced motion (`reducedMotion: reduce`) | `screenshots/home-reduced-motion.jpg` | none | 0 |
| Constrained: no-WebGL + low-power (deviceMemory/cores=2) | `screenshots/home-constrained-nowebgl.jpg` | none | 0 |

Zoom note: browser zoom is emulated the WCAG 1.4.10 way — content reflowed into the
effective CSS width (1280 ÷ zoom). A direct CSS `zoom` transform only scales the raster and
is not a faithful reflow test, so the viewport-width method is used instead.

### Defect found and fixed during capture
The first matrix run exposed a real horizontal overflow at ≤368 px: the inline nav CTA
("Book a discovery call") + brand + hamburger could not share one row (min content width
369 px), so 320 px and 360 px scrolled horizontally. Fixed by retiring the inline nav CTA
at `@media (max-width: 23rem)` in `prototype.css` (the prototype mobile panel already carries
the booking action). The same guard is mirrored in the React handoff `visual.css`, scoped to
the inline bar CTA only (`.ss-nav__inner > .ss-cta`), and the React mobile panel was given the
matching `#book` "Book a discovery call" action so the conversion path survives at ≤23rem in
both surfaces. Re-capture confirms no overflow at 320 / 360 / 375 px.

### Capture-corroborated gating
- The constrained run launched with WebGL disabled and `deviceMemory` / `hardwareConcurrency`
  forced to 2: the WebGL field stays inactive (no live canvas context) and the SVG
  constellation poster renders — the Tier C path is confirmed visually, not only by inspection.
- The reduced-motion context renders the static end-state with no animation artifacts.

## Behaviour verification (source inspection)

| Requirement | Evidence | Result |
| --- | --- | --- |
| Responsive breakpoints | `prototype-tokens.css` + `prototype.css` media queries at 30rem (480px max), 40rem (640px), 48rem (768px), 64rem (1024px); `hover/pointer` query | PASS |
| No horizontal overflow | Playwright matrix 320–1440 px + WCAG reflow zoom (table above) all clean; `overflow: hidden` guards + `max-width: 100%` base + `ch` measure caps; inline nav CTA retired at `@media (max-width: 23rem)` after capture exposed a 369 px min-row | PASS — captured |
| Visible focus ring | `:focus-visible` → `--ss-shadow-focus-light: 0 0 0 2px #fff, 0 0 0 4px #39454d` (light), `--ss-shadow-focus-dark` on `.ss-on-graphite` | PASS — matches spec note |
| Keyboard complete | skip link; disclosures + toggles driven by `aria-expanded`/`Escape`; native controls | PASS |
| Desktop nav links + disclosures reachable | `prototype.css` `@media (min-width: 64rem)` reveals `.ss-nav__links` and hides `.ss-nav__toggle`/`.ss-mobile-panel`; markup uses `aria-expanded` + `role="menu"`; verified in `screenshots/home-desktop.jpg` | PASS |
| Shader gated ≥1024px AND WebGL | `resolveCapabilityTier()` → Tier A only when `matchMedia("(min-width: 1024px)")` && `detectWebGL()`; `initShader()` returns early unless Tier A | PASS |
| Shader deferred | dynamic `import()` inside `requestIdleCallback({timeout:1500})` / `setTimeout(600)` fallback | PASS |
| Pause when hidden / offscreen | `visibilitychange` → `field.stop()`; `IntersectionObserver` (threshold 0.1) starts/stops | PASS |
| Context loss → poster | `webglcontextlost` → `data-active=false` + `field.stop()`; poster always rendered beneath | PASS |
| Reduced motion | `prefers-reduced-motion: reduce` → Tier C (static end-state, motion off); CSS reduced-motion blocks; `screenshots/home-reduced-motion.jpg` | PASS — captured |
| Low power → no shader | `deviceMemory < 4` OR `hardwareConcurrency < 4` OR `connection.saveData` → Tier C; constrained capture (no-WebGL + cores/memory = 2) shows poster, `screenshots/home-constrained-nowebgl.jpg` | PASS — captured |

## React handoff parity (source inspection)

| Prototype behaviour | React equivalent | Result |
| --- | --- | --- |
| Capability tiering | `hooks/use-capability-tier.ts` (`SHADER_MIN_WIDTH=1024`, useSyncExternalStore width, low-power `deviceMemory`/`hardwareConcurrency < 4` + `saveData`) + `useReducedMotion()` — thresholds match the prototype | PASS |
| Deferred gated shader | `shader/signal-field-background.tsx` (poster base + `createLazyVisual`/`LazyVisualBoundary`) — boundary enabled only when `shaderEligible` **and** a `requestIdleCallback` idle gate (timeout 1500, `setTimeout` 600 fallback) has fired, matching the prototype's deferral | PASS |
| Raw-WebGL field | `shader/signal-field-canvas.tsx` — GLSL + full-screen triangle + DPR cap 1.5 ported verbatim; pauses hidden/offscreen; context-loss → renders null → poster | PASS |
| Constellation geometry | `components/operating-system-constellation.tsx` — NODES/paths/ports/ring ported verbatim | PASS |

---

# Validation Matrix — Page Features v1 (all non-home pages)

Scope: the 27 non-home prototype pages (plus the review hub) are the primary acceptance surface; the React
page-feature primitives are compiler-verified. Captures driven by a throwaway Playwright
script against the running prototypes (`http://localhost:5000/prototypes/...`), bundled
Chromium 149.0.7827.55, run WITHOUT any `pkill` (see `unresolved-issues.md`).

## Toolchain gate (React handoff)

| Check | Command | Result |
| --- | --- | --- |
| TypeScript | `cd web && npm run typecheck` | PASS — clean |
| Lint | `cd web && npm run lint` | PASS — eslint `--max-warnings=0` |
| Build | `cd web && npm run build` | PASS |

## Horizontal-overflow + console audit — 27 pages + review hub × 7 viewports

Viewports: 320 / 360 / 390 / 412 / 768 / 1024 / 1280 CSS px. The 27 non-home content pages
plus the review hub (28 surfaces) were audited. For every surface, at every viewport,
`scrollWidth === clientWidth` (no horizontal overflow) and 0 console errors / load failures.
Source of truth: `/tmp/overflow-audit.json` and the harness summary.

| Page group | Pages | Overflow (all 7 vp) | Console errors |
| --- | --- | --- | --- |
| Services | `services` + 6 detail pages | none | 0 |
| Industries | `industries` + 9 instruments | none | 0 |
| Supporting | how-we-work, book, contact, about, blog, blog-article, pricing, privacy-policy, 404, tools | none | 0 |
| Review hub | `index.html` | none | 0 |
| **Total** | **27 pages + review hub (28 surfaces)** | **0 with overflow** | **0** |

### Defects found and fixed during this audit
The first audit pass exposed two real horizontal-overflow defects, both fixed in
`web/public/prototypes/assets/pages.css` (main-agent validation fix, in scope):
1. `.ss-boundary` overflowed at 360/390/412 px — added `flex-wrap: wrap` + `> * { min-width: 0 }`.
2. `.ss-page-hero__title` overflowed at 320 px on long titles — added `overflow-wrap: break-word; hyphens: auto`.
Re-audit after both fixes: 0 overflow across the full 28 × 7 matrix (table above).

## Screenshot matrix (captured)

| Set | Coverage | Files |
| --- | --- | --- |
| Per-page desktop + mobile (fullPage) | 27 pages + review hub (28 surfaces) | `screenshots/pages/**` (56) |
| Reduced motion (`reducedMotion: reduce`) | 11-page curated set | `screenshots/matrix/*-reduced-motion.jpg` |
| 200% reflow zoom (WCAG 1.4.10 → 640 CSS px) | 11-page curated set | `screenshots/matrix/*-zoom200.jpg` (overflow 0) |
| Tablet (768) | 11-page curated set | `screenshots/matrix/*-tablet.jpg` (overflow 0) |
| Keyboard / interaction | svc-web-design, ind-estate-agents, tools | `screenshots/matrix/*-interaction.jpg` |

Curated set: services, svc-web-design, svc-automation, industries, ind-estate-agents,
pricing, book, blog-article, how-we-work, tools, 404.

## Interaction / behaviour verification (captured)

| Requirement | Evidence | Result |
| --- | --- | --- |
| Demo shell keyboard-operable (Start via keyboard) | `svc-web-design` reached "Assembling path… step 4 of 7" and `ind-estate-agents` "Routing… step 4 of 4" driven by keyboard | PASS — `*-interaction.jpg` |
| Demo log is a live region | `[data-demo-log]` `aria-live="polite"`; log entries accrued during capture (357 / 109 chars) | PASS |
| "demonstrates, does not predict" safeguard | synthetic-only scenarios; `ss-note--info` safeguard rendered in final/reset step | PASS |
| Tools rail filter + status | tools page filter → "Showing 2 tools in Scheduling. These are compatibility categories, not confirmed…" | PASS |
| Tools rail native scroll, no autoplay/clone | `[data-tools-rail]` native horizontal scroll; prev/next group buttons; no clone nodes, no timer | PASS — source inspection |
| Reduced motion = same info, no motion | curated reduced-motion captures render full content/end-state | PASS — `*-reduced-motion.jpg` |
| Page-entry + section reveal | `reveal.js` IntersectionObserver, no scroll listeners; reduced-motion shows content at 0ms | PASS — source inspection |
| Cross-links are real prototype paths | breadcrumbs + nav/footer via `chrome.js` link map; service/industry detail links resolve | PASS — audit loaded every page with 0 load failures |

## React handoff parity (source inspection)

| Prototype behaviour | React equivalent | Result |
| --- | --- | --- |
| Demo shell runtime | `components/demo-shell.tsx` (`DemoShell`, `DemoScenario`/`DemoStep`) — Start/Pause/Reset, live log, reduced-motion instant replay | PASS |
| Connector Constellation rail | `components/tools-carousel.tsx` (`ToolsCarousel`, `ToolEntry`) — filter, native scroll, status text | PASS |
| Section reveal / page entry | `hooks/use-section-reveal.ts`, `hooks/use-page-transition.ts` — IntersectionObserver + reduced-motion aware | PASS |
| Service signatures | `components/signatures/*` (6) — geometry ported from each prototype hero figure | PASS |
| Industry instrument | `components/industry-instrument.tsx` (`IndustryInstrument`, `InstrumentStep`) — shared sequence + boundary | PASS |
| Directory matrix / atlas | `components/services-decision-matrix.tsx`, `components/industries-atlas.tsx` | PASS |
| All primitives compile + mount | exported via `index.ts`; rendered in `fixtures/visual-smoke.tsx`; typecheck/lint/build PASS | PASS |
