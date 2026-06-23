---
name: Playwright screenshot matrix on NixOS (this repo)
description: How to actually run the bundled-Chromium screenshot matrix against the /web static prototypes here.
---

# Running a Playwright screenshot matrix in this environment

**Launch blocker:** the bundled Chromium aborts with `libgbm.so.1: cannot open shared
object file`. Installing `mesa` alone is NOT enough on this nixpkgs channel — `libgbm`
is a separate attr. Install BOTH via `installSystemDependencies({packages:["mesa","libgbm"]})`.
Once present, headless Chromium launches and swiftshader WebGL works (so desktop Tier-A
shaders actually render in captures).

**Why:** this is a pure environment quirk, not discoverable from the code. It cost real
time the first pass (assumed mesa covered it).

**How to apply:**
- Drive the matrix from a throwaway CJS script in `/tmp` that does
  `require('/home/runner/workspace/web/node_modules/@playwright/test')`. ESM `import` from
  `/tmp` fails module resolution; CJS require of the absolute path works. Do NOT add test
  files under `web/tests/` for this (outside prototype ownership; those are main-app e2e).
- Each `chromium.launch()` gets a fresh context — fine for a one-shot matrix.
- The prototype URL needs the explicit `.html`: `http://localhost:5000/prototypes/home/index.html`.
  Bare directory URLs are shadowed by the Vite SPA fallback and serve the React app instead.
- Emulate browser zoom the WCAG 1.4.10 way: set the viewport to the effective CSS width
  (1280 ÷ zoom → 640px for 200%, 320px for 400%) and assert no horizontal overflow. A CSS
  `zoom` transform only scales the raster (gives bogus scrollWidth like 1350/2700) and is
  not a faithful reflow test.
- Browser-console noise during runs (Invalid hook call / Hydration failed) is main-app Vite
  re-optimization transients, NOT the prototype; the static prototype records 0 console errors.
