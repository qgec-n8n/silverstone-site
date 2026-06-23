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
