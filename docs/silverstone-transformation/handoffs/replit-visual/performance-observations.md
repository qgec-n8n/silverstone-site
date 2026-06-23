# Performance Observations — Signal Field & Home

These are design/implementation characteristics and prototype acceptance targets.
The Playwright screenshot matrix (responsive widths, WCAG reflow zoom, reduced-motion,
no-WebGL/low-power) WAS captured after the bundled Chromium was unblocked — see
`validation-matrix.md`. However, quantitative runtime numbers (FPS, long-task ms, JS gz
size, LCP) were NOT measured here: Lighthouse / tracing were not run, and the React handoff
is not route-mounted. The production owner should measure these once the components are
mounted into a route.

## Deferral & gating (keeps the home critical path light)

- The WebGL field is a **dynamic import**, so its payload is excluded from the initial route
  bundle. In React this is `createLazyVisual(() => import("./signal-field-canvas"))`; in the
  prototype it is `import("/prototypes/assets/signal-field-shader.js")`.
- The import is additionally **idle-deferred** in both: the prototype schedules it inside
  `requestIdleCallback`; the React `SignalFieldBackground` only enables its `LazyVisualBoundary`
  after a `requestIdleCallback` (timeout 1500, `setTimeout` 600 fallback) fires — so the chunk
  never competes with first paint. This idle gate governs the **first** enable; once the chunk
  has loaded, a later re-enable (e.g. resizing back across 1024px) mounts it immediately.
- It only loads on **Tier A** (`min-width: 1024px` AND WebGL present). Below 1024px, on
  reduced-motion, or on low-power devices, the chunk is never requested.
- A static **poster is always rendered beneath** the canvas, so first paint never depends on
  the shader and any failure is invisible.

## Runtime cost controls

- Single full-screen triangle (3 vertices), one draw call per frame, two cheap trig lobes in
  the fragment shader — designed to stay well under the 45 ms long-task budget per frame.
- Device pixel ratio capped at **1.5** (`DPR_CAP`) to bound fragment work on high-density
  displays.
- `powerPreference: "low-power"`, no depth/stencil/alpha/antialias, `preserveDrawingBuffer:
  false`.
- rAF loop is **paused** when the tab is hidden (`visibilitychange`) and when the stage is
  offscreen (`IntersectionObserver`), so it never burns frames in the background.

## Resilience

- `webglcontextlost` is handled: the loop stops and the static poster is restored; no error is
  surfaced to the user.
- Shader/program compile or link failure returns `null` from the factory → React component
  renders nothing → poster remains.

## Acceptance budgets (targets, from the spec — not measured here)

| Budget | Target |
| --- | --- |
| Shader chunk | ≤ 45 KB gz |
| Sustained desktop animation | ≥ 45 FPS |
| Any animation-caused task | ≤ 45 ms |
| Shader scope | deferred, route-local, ≥ 1024px only |

---

## Page Features v1 — full-site observations

As with the home handoff, these are design/implementation characteristics and prototype
acceptance targets. Quantitative runtime numbers (FPS, long-task ms, JS gz size, LCP) were
NOT measured (no Lighthouse/tracing; React primitives not route-mounted). The overflow +
screenshot matrix WAS captured — see `validation-matrix.md`.

### Demo shell (`demo.js` / `DemoShell`)
- Deterministic synthetic scenarios; steps are advanced by a single `setInterval`, not a
  per-frame rAF loop, so there is no sustained animation cost between steps.
- `temporal: true` only for genuinely time-based instruments; otherwise Pause is hidden and
  the shell renders discrete steps with no timer running idle.
- Reduced motion replays the full sequence instantly (all info at 0ms) — no information is
  hidden behind motion, and no animation work is scheduled.
- Acceptance target (from spec): demo shell ≤ 12 KB / ≤ 18 KB ceiling. Not weighed here.

### Tools carousel (`tools-carousel.js` / `ToolsCarousel`)
- Native horizontal scroll (`overflow-x`), NO autoplay, NO cloned nodes, NO JS animation
  loop. Prev/next move by group via `scrollBy`; filtering toggles card visibility and updates
  a `[data-tools-status]` live region. Cost is limited to discrete user-driven events.
- No nested scroll containers; pause-on-hover/focus is moot because nothing auto-advances.

### Section reveal / page entry (`reveal.js` / `useSectionReveal`, `usePageTransition`)
- IntersectionObserver only — no scroll-event listeners, so no main-thread scroll handlers.
- Reduced motion / no-IO fallback renders content immediately at full opacity.

### Motion ownership (restated from spec, as authored)
- CSS hover/transition 140–220ms; disclosure ≤320ms; hero/demo reveal 480–800ms; scrolling
  is native. No animation is on a permanent rAF loop on these pages (the only rAF instrument
  in the project is the home Tier-A WebGL field, which is absent from non-home pages).

### Not measured (production owner to verify on mount)
- Per-route JS gz against the ≤220 KB target / ≤300 KB ceiling.
- Sustained ≥45 FPS and absence of >50 ms long tasks during demo playback and carousel scroll.
- LCP / Lighthouse once primitives are mounted into real routes.
