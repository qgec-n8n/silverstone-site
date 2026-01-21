<!-- FILE: codex/execplans/2026-01-21_fix-mobile-bg-gap_and_console-404s.md -->
# ExecPlan: Fix mobile background coverage gap + remove desktop console 404s

Owner: Codex (GPT-5.2)  
Date: 2026-01-21  
Scope: Minimal, targeted fixes only. Preserve all visuals/behavior except the two outcomes below.

## Primary outcomes (acceptance criteria)

A) Mobile (all pages listed below): the background image using `body-section-background-2025.webp` covers the full mobile viewport with **no visible bottom gap**.

B) Desktop: Chrome console shows **zero errors** on page load. Specifically, eliminate all `404 (Not Found)` errors present in the provided desktop console log.

C) Parallax continues to work on both mobile + desktop. No disabling or removing parallax is allowed.

D) No other visual or functional changes.

Target pages:
- `index.html`
- `about.html`
- `services.html`
- `book.html`
- `contact.html`
- `niches/*.html`

## Inputs

- Repo zip (already unpacked).
- Desktop Chrome console log file (place it at `artifacts/input/desktop-console.log`).

## Progress checklist

- [ ] Create a working branch for the fix.
- [ ] Baseline: reproduce mobile gap on at least 2 target pages + capture evidence.
- [ ] Baseline: reproduce desktop console 404s locally + confirm they match the provided log.
- [ ] Root cause analysis: mobile gap (confirm which element fails to cover).
- [ ] Root cause analysis: 404s (map every 404 to its source reference in the repo).
- [ ] Implement smallest-possible fix for 404s.
- [ ] Implement smallest-possible fix for mobile gap.
- [ ] Validate outcomes on all target pages (mobile + desktop).
- [ ] Regression check: parallax behavior still correct (mobile + desktop).
- [ ] Final diff review: ensure only necessary files changed.
- [ ] Update this ExecPlan: discoveries, decision log, and verification steps.

## Baseline & reproduction protocol (must do before editing)

1) Prepare artifacts folders:

   - mkdir -p artifacts/input artifacts/output

2) Save the provided desktop console log as:

   - artifacts/input/desktop-console.log

3) Start a local static server (choose one):

   - bash scripts/codex.serve.sh
     OR
   - python3 -m http.server 8080

4) Desktop baseline:
   - Open each target page in desktop Chrome.
   - Open DevTools → Console + Network.
   - Hard reload (disable cache).
   - Capture:
     - Console errors (copy/paste text into `artifacts/output/desktop-console-before.txt`)
     - Any 404 Network entries (copy request URLs and initiators)

5) Mobile baseline:
   - Use one real device if possible (iOS Safari is ideal) plus Chrome mobile emulation.
   - For at least 2 pages (one root page + one `niches/` page), capture:
     - A screenshot showing the bottom-of-viewport gap
     - Computed measurements using `codex/snippets/SNIPPET.mobile-bg-gap-diagnostics.md`
       Save output in `artifacts/output/mobile-gap-metrics-before.txt`

## Issue 1: Mobile background coverage gap (hypothesis matrix)

Goal: Identify which “background provider” fails to cover the full mobile viewport.

Key repo components to inspect:
- CSS: `src/css/features/parallax.css` (mobile parallax stage/layers)
- JS: `src/js/parallax.js` (mobile stage creation + background image URLs)
- JS: `src/js/app.js` and `assets/js/app.js` (page bootstrap; loads stylesheets; initializes parallax)
- HTML: target pages for `parallax-section` markup and nesting

Hypotheses (test in order; stop when one is confirmed):

H1) Dynamic mobile viewport sizing issue (address bar / visual viewport vs layout viewport)
- Symptom match: background appears full-height initially, then shows a bottom gap when browser UI changes.
- Prove/disprove:
  - On the affected device, run the diagnostic snippet and compare:
    - window.visualViewport.height (if present)
    - window.innerHeight
    - `.parallax-mobile-stage` bounding rect height
  - If stage height < visual viewport height (or fails to update), this is likely the root cause.
- Likely minimal fixes (choose the smallest that works):
  - CSS-only: ensure the element that paints the background uses dynamic viewport units (dvh) or equivalent.
  - JS assist (only if needed): listen to visualViewport resize events and set stage height.

H2) Wrong asset URL base on pages in subdirectories (e.g., `niches/`)
- Symptom match: backgrounds work on root pages but break or partially render on `niches/*.html`.
- Prove/disprove:
  - On a `niches/*.html` page, check Network for 404s for background image URLs.
  - Inspect runtime computed background-image on `.parallax-mobile-layer.is-active` and confirm the URL resolves to an existing asset.
- Likely minimal fixes:
  - Make asset URLs robust across root + `niches/` pages (avoid document-relative `./assets/...` assumptions).
  - Prefer a minimal change that does not introduce a site-wide “base href” change.

H3) Mobile parallax stage is present but clipped/stacked incorrectly
- Symptom match: stage exists, but a container paints an opaque background over part of it.
- Prove/disprove:
  - Inspect stacking context and z-index:
    - `.parallax-mobile-stage`
    - `.parallax-section.parallax-mobile-active`
    - any full-height wrappers/overlays with background-color
  - Use DevTools “Layers” (Chrome) or element highlight to see what actually covers the bottom area.
- Likely minimal fixes:
  - Adjust stacking context/z-index only as much as necessary.
  - Avoid touching unrelated layout.

H4) The stage exists but the active layer is not fully opaque / not activated when expected
- Prove/disprove:
  - Confirm `.parallax-mobile-layer.is-active` exists and has opacity 1.
  - Check that IntersectionObserver is running and not throwing.
- Likely minimal fixes:
  - Fix activation logic only if truly broken.

## Issue 2: Desktop console 404s (hypothesis matrix)

The provided desktop console log shows `404 (Not Found)` for CSS resources (e.g., `custom.css` and `mobile.css`).

Key repo components to inspect:
- `src/js/app.js` and `assets/js/app.js` (look for runtime stylesheet injection)
- `assets/css/` directory contents
- HTML files for any `<link>` references to non-existent assets

Hypotheses:

D1) The site injects CSS links to files that do not exist in the repo
- Prove/disprove:
  - Run: bash scripts/codex.audit.console-404s.sh artifacts/input/desktop-console.log
  - Confirm referenced paths are missing on disk.
- Minimal fixes:
  - Add the missing files (empty or with only necessary overrides) OR remove the injection (only if truly unused).
  - Ensure the fix works on both root pages and `niches/` pages (path resolution).

D2) The files exist but the injected href is wrong on subdirectory pages
- Prove/disprove:
  - Open a `niches/*.html` page and inspect the injected `<link>` href value.
  - If it points to a non-existent subpath, this is the cause.
- Minimal fixes:
  - Make the injected href robust across root + `niches/` pages without changing page markup.

D3) 404s originate from HTML references, not JS injection
- Prove/disprove:
  - Search HTML for the missing filenames and confirm initiators in DevTools Network.
- Minimal fixes:
  - Fix the reference path or remove if unused.

## Implementation constraints (hard rules)

- Do not remove parallax.
- Do not change page layout, spacing, typography, or colors.
- Avoid build pipeline churn. If rebuilding generates large diffs, prefer small, direct edits.
- Keep changes localized; do not “clean up” unrelated code.

## Validation gates (must pass)

Gate 1: 404 elimination
- Desktop Chrome, hard reload:
  - Console has zero errors
  - Network shows no 404s
  - Repeat on one `niches/*.html` page

Gate 2: Mobile background coverage
- On each target page:
  - No visible bottom gap at initial load
  - No visible bottom gap after scrolling (address bar collapse scenario)
  - Run the diagnostic snippet; stage/layer measurements are consistent with full viewport coverage

Gate 3: Parallax behavior
- Desktop: scrolling shows expected parallax behavior; no jank.
- Mobile: background transitions between themes as you scroll through parallax sections.

Gate 4: Diff sanity
- git diff shows only necessary files changed
- No unexpected asset deletions
- No unrelated formatting-only churn

## Decision log (fill as you go)

- Decision: Fix 404s by adding placeholder CSS files and switching injected stylesheet hrefs to root-absolute paths; fix mobile gap by syncing mobile parallax stage size to the visual viewport on resize/scroll.
  - Why: 404s originate from JS-injected `custom.css`/`mobile.css` references and missing files; mobile gap likely tied to layout vs visual viewport sizing on mobile address-bar collapse.
  - Alternatives considered: Remove stylesheet injection (rejected: behavior change risk); duplicate assets into `/niches/assets` (rejected: unnecessary churn); CSS-only `dvh` sizing (deferred: uncertain coverage across browsers).
  - Evidence: `artifacts/input/desktop-console.log` 404 tokens + `rg` hits in `src/js/app.js`/`assets/js/app.js`; parallax stage created in `src/js/parallax.js` with fixed positioning.
- Risk assessment: Low; changes are localized and only affect missing assets + mobile stage sizing. Parallax logic remains intact.
- Validation result: Pending local browser verification (see validation gates).
- Decision: Extend mobile parallax stage height on iOS Safari with a small overscan derived from `screen.height - visualViewportHeight` (clamped), to cover the bottom URL bar area.
  - Why: Safari iOS shows a visible gap even when stage height equals visual viewport height; the URL bar area is outside the visual viewport but still visible.
  - Alternatives considered: Pure CSS `dvh` sizing (uncertain Safari behavior), forcing `inset` negative bottom (less precise).
  - Evidence: User screenshots show gap; diagnostics report `innerHeight === stageHeight` with gap still visible.
  - Risk assessment: Low; overscan applies only to iOS Safari and is clamped to 160px.
  - Validation result: Pending on‑device verification (rerun snippet + screenshots).
- Decision: Add a mobile-only body background using the same parallax image + overlay as the stage to ensure Safari paints the background under the bottom URL bar.
  - Why: Safari iOS still shows a gap even with overscan; body background should render under UI where fixed elements may not.
  - Alternatives considered: viewport-fit=cover + safe-area padding (riskier layout impact), adjusting z-index stacking.
  - Evidence: Diagnostics show `stageHeight` > `innerHeight` while the gap persists; user screenshot confirms.
  - Risk assessment: Low; background matches existing parallax image, scoped to mobile only.
  - Validation result: Pending on‑device verification.

## Notes / discoveries (fill as you go)

- Desktop console log present at `artifacts/input/desktop-console.log` (copied from `artifacts/input/silverstone-ai.com-1769009826045.log`) shows 404s for `custom.css` and `mobile.css`.
- 404 initiator: runtime stylesheet injection in `src/js/app.js` and `assets/js/app.js` via `ensureStylesheet('assets/css/custom.css')` and `ensureStylesheet('assets/css/mobile.css')`.
- Relative `./assets/...` href resolves to `/niches/assets/...` on niche pages, so 404s can occur even if files exist at `/assets/...`.
- Mobile background gap: unable to run the diagnostic snippet or capture device screenshots in this environment; applied the minimal visualViewport sizing fix to the mobile parallax stage based on H1.
- Safari iOS (iPhone 14, iOS 26.2) shows bottom gap despite stage height matching `innerHeight`/`visualViewportHeight` (gap visible under bottom URL bar); Chrome iOS does not show the gap per user report.
- Safari iOS diagnostics after overscan show `stageHeight` > `innerHeight`, yet gap still visible; added mobile body background with the same parallax image as a fallback to cover the bottom URL bar area.
- Verification steps pending (run locally with DevTools):
  1) Start server, open `index.html` + one `niches/*.html`, hard reload, confirm zero console errors and zero 404s.
  2) On mobile viewport, run `codex/snippets/SNIPPET.mobile-bg-gap-diagnostics.md` on a root + niche page before/after scroll.
  3) Scroll through parallax sections on mobile + desktop to confirm transitions still work.
