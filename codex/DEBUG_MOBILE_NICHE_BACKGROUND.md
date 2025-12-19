<!-- FILE: codex/DEBUG_MOBILE_NICHE_BACKGROUND.md -->
# Debug Guide — Mobile niche parallax background not visible (Edit 8)

Purpose: give Codex a deterministic debugging path for why `niches/*.html` pages lose the parallax background image on mobile.

## What “good” looks like (reference)
On a mobile viewport (<= 768px), `services.html` shows:
- the body-section background image behind parallax sections
- a dark overlay on top of the image
- consistent visuals while scrolling through sections

Niche pages must match this.

## Likely failure modes (highest probability first)
1. **Wrong asset URL resolution on nested pages**
   - Mobile parallax uses a JavaScript-created “stage/layer” background image.
   - If the code uses a document-relative path like `assets/images/...`, then on `/niches/*` pages it resolves to `/niches/assets/images/...` and fails.

2. **Mobile parallax stage exists but has no active layer**
   - IntersectionObserver not observing sections due to selector mismatch.
   - Required attributes missing: `.parallax-section[data-parallax-theme]`.

3. **Layer exists but is visually hidden**
   - z-index/stacking context issues.
   - A parent background or non-transparent layer covers the stage.

## Fast diagnosis checklist (do in order)
1. Confirm the bug scope
   - Compare `services.html` vs 1 niche page at <= 768px width.

2. Inspect network requests (best signal)
   - Look for requests to `body-section-background-2025.webp`.
   - If you see a path containing `/niches/assets/images/...`, that is the smoking gun.

3. Confirm DOM plumbing exists on the niche page
   - Ensure a `.parallax-mobile-stage` element is inserted into `<body>`.
   - Ensure at least one `.parallax-mobile-layer` exists and one has `.is-active`.

4. Confirm section selector matches on niche pages
   - The script should select: `.parallax-section[data-parallax-theme]`
   - Niche pages must include `data-parallax-theme` on the parallax sections.

## Fix strategy (must stay in scope)
- Do not add per-page niche hacks.
- Fix URL resolution in `src/js/parallax.js` so the image URL works from nested directories.
- Use script-based asset base resolution (derive from the loaded `app.js` bundle location) and resolve the background image URL from that stable base.
- Add marker `SS_PARALLAX_SPEC: NICHE_MOBILE_BG_PARITY` so validators confirm the fix is present.

## After the fix
- Rebuild main JS bundle: `node scripts/build-js.js`
- Run: `bash scripts/codex.requested-edits.sh`
- Recheck on mobile: services + at least 2 niches pages
