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

## Environment blocker — full screenshot matrix

The planned Playwright matrix (320/360/390/412/768/1024/1280/1440 px, 200%/400% zoom,
reduced-motion, low-power/no-WebGL) could not be captured: the bundled Chromium aborts at
launch with `libgbm.so.1: cannot open shared object file`. Resolving it requires installing
system libraries / nix packages — a package/config edit explicitly out of this task's
ownership scope ("No route/config/package edits. No new deps."). The platform `screenshot`
service (separate, working browser infra) was used for the desktop render; the behaviours
below were verified by source inspection instead of headless capture.

## Behaviour verification (source inspection)

| Requirement | Evidence | Result |
| --- | --- | --- |
| Responsive breakpoints | `prototype-tokens.css` + `prototype.css` media queries at 30rem (480px max), 40rem (640px), 48rem (768px), 64rem (1024px); `hover/pointer` query | PASS |
| No horizontal overflow | seven `overflow: hidden` guards on stage/cards/chambers; `max-width: 100%` base; measure caps (`ch`) on text blocks | PASS |
| Visible focus ring | `:focus-visible` → `--ss-shadow-focus-light: 0 0 0 2px #fff, 0 0 0 4px #39454d` (light), `--ss-shadow-focus-dark` on `.ss-on-graphite` | PASS — matches spec note |
| Keyboard complete | skip link; disclosures + toggles driven by `aria-expanded`/`Escape`; native controls | PASS |
| Desktop nav links + disclosures reachable | `prototype.css` `@media (min-width: 64rem)` reveals `.ss-nav__links` and hides `.ss-nav__toggle`/`.ss-mobile-panel`; markup uses `aria-expanded` + `role="menu"`; verified in `screenshots/home-desktop.jpg` | PASS |
| Shader gated ≥1024px AND WebGL | `resolveCapabilityTier()` → Tier A only when `matchMedia("(min-width: 1024px)")` && `detectWebGL()`; `initShader()` returns early unless Tier A | PASS |
| Shader deferred | dynamic `import()` inside `requestIdleCallback({timeout:1500})` / `setTimeout(600)` fallback | PASS |
| Pause when hidden / offscreen | `visibilitychange` → `field.stop()`; `IntersectionObserver` (threshold 0.1) starts/stops | PASS |
| Context loss → poster | `webglcontextlost` → `data-active=false` + `field.stop()`; poster always rendered beneath | PASS |
| Reduced motion | `prefers-reduced-motion: reduce` → Tier C (static end-state, motion off); CSS reduced-motion blocks | PASS |
| Low power → no shader | `deviceMemory < 4` OR `hardwareConcurrency < 4` OR `connection.saveData` → Tier C | PASS |

## React handoff parity (source inspection)

| Prototype behaviour | React equivalent | Result |
| --- | --- | --- |
| Capability tiering | `hooks/use-capability-tier.ts` (`SHADER_MIN_WIDTH=1024`, useSyncExternalStore width, low-power `deviceMemory`/`hardwareConcurrency < 4` + `saveData`) + `useReducedMotion()` — thresholds match the prototype | PASS |
| Deferred gated shader | `shader/signal-field-background.tsx` (poster base + `createLazyVisual`/`LazyVisualBoundary`) — boundary enabled only when `shaderEligible` **and** a `requestIdleCallback` idle gate (timeout 1500, `setTimeout` 600 fallback) has fired, matching the prototype's deferral | PASS |
| Raw-WebGL field | `shader/signal-field-canvas.tsx` — GLSL + full-screen triangle + DPR cap 1.5 ported verbatim; pauses hidden/offscreen; context-loss → renders null → poster | PASS |
| Constellation geometry | `components/operating-system-constellation.tsx` — NODES/paths/ports/ring ported verbatim | PASS |
