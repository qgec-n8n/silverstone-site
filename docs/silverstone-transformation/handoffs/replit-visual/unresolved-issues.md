# Unresolved Issues & Caveats — Page Features v1

Open items the production owner must resolve. None block the prototype acceptance surface;
all concern the move from prototype to production.

## Not runtime-verified
- **React primitives are not route-mounted.** They are compiler-verified (typecheck / lint /
  build pass) and exercised in `fixtures/visual-smoke.tsx`, but never rendered in a real
  browser route. The owner must smoke-test each primitive on mount (focus order, demo
  playback, carousel scroll, reduced-motion behaviour).

## Not measured
- **Performance budgets are targets, not results.** No Lighthouse run, no tracing, no FPS or
  long-task capture, no per-route JS gz weighing. Verify against ≤220 KB target / ≤300 KB
  ceiling, ≥45 FPS, no >50 ms task, and the demo-shell ≤12/18 KB target after mounting.

## Synthetic / placeholder content (must be replaced)
- All demo scenarios, tools-rail entries, blog posts, about narrative, pricing figures, and
  the privacy policy are **synthetic and illustrative**. No real client names, results, or
  metrics were invented, and tool categories are framed as "compatibility categories, not
  confirmed live integrations." Production must supply real content and independently verify
  any integration/partnership claim before stating it.
- Booking and contact forms are visual only — no submission, validation back-end, or real
  booking. Wire to a real (non-production-mutating) back-end before launch.

## Environment quirks (for whoever re-runs the visual tooling)
- **Bundled Chromium screenshots must run WITHOUT any `pkill`.** A `pkill -f chrome|chromium|
  playwright|headless` SIGKILLs the agent's own bash (exit 137, no output), which previously
  looked like a Chromium OOM. It was not memory (cgroup ~8 GB, ~3.4 GB used). Launch
  Playwright directly and never pkill. Recorded in `.agents/memory/`.
- Chromium needs the `mesa` + `libgbm` system libraries on this NixOS image (installed/
  authorized during the home handoff). Without them it fails with
  `libgbm.so.1: cannot open shared object file`.
- `fullPage` screenshots on the tallest pages are the one real memory spike — capture in
  small slices (~5 pages) to stay under the bash timeout.

## Known, not from this work
- A one-time `Invalid hook call` / `Hydration failed` warning can appear on the **main React
  app routes** after a build/restart — it is a transient Vite dependency re-optimization
  artifact that clears on reload. The prototypes are static HTML and the handoff is not
  route-rendered, so neither can produce it; it cannot be removed without editing
  `vite.config` (out of ownership scope).

## Scope boundaries left intact
- No route wiring, no core-engineering edits, no legacy-root changes, no package/config
  edits, no production deployment/DNS/analytics/email/booking mutations. The only shared-asset
  edit was the two `pages.css` overflow fixes during the main-agent validation phase.
