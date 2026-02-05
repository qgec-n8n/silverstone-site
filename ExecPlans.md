<!-- FILE: ExecPlans.md -->
# ExecPlans index

This repo uses **ExecPlans** (evidence-driven, checkpointed execution documents) to prevent scope creep and keep fixes minimal-risk.

## Active ExecPlans

1) **SEO indexability + sitemap compliance**  
   - Plan: `codex/execplans/2026-02-05_seo-indexability-and-sitemap.md`  
   - Status: READY  
   - Target outcomes:
     - All HTML pages are indexable (no unintended `noindex`).
     - Canonical URLs are absolute and align with sitemap entries.
     - `sitemap.xml` is generated from canonical URLs and uses valid `lastmod` dates.
     - `robots.txt` advertises the sitemap and favicon/manifest references resolve.
   - Execution steps (summary):
     1. Baseline: inventory HTML pages and confirm sitemap coverage vs canonical URLs.
     2. Update SEO scripts + docs; generate a compliant sitemap.
     3. Verify with `node scripts/seo-audit.js`.

2) **Mobile URL-bar white overlay (mobile-only; desktop unaffected)**  
   - Plan: `codex/execplans/2026-02-04_mobile-urlbar-white-overlay.md`  
   - Status: READY  
   - Target outcomes:
     - Mobile (all HTML pages): a white overlay bar covers the bottom URL bar area and tracks expand/collapse; content scrolls underneath (no push-up).
     - Desktop: no visual or behavioral changes; overlay not present.
     - Parallax remains functional on mobile + desktop.
   - Execution steps (summary):
     1. Baseline: measure `visualViewport` vs `innerHeight` on mobile Safari/Chrome to quantify URL-bar occlusion height.
     2. Implement shared overlay (global CSS + `src/js/app.js`) gated to mobile; set `--urlbar-overlay-height` from `visualViewport` resize/scroll with fallback to `env(safe-area-inset-bottom)`.
     3. Verify across all HTML pages: overlay tracks URL bar; content reveals from behind; desktop unchanged.

3) **Update favicon link tags across all HTML pages**  
   - Plan: `codex/execplans/2026-02-03_update-favicon-links.md`  
   - Status: READY  
   - Target outcomes:
     - All HTML heads contain the new favicon snippet only (no legacy icons).
     - No other visual or functional changes.

4) **Fix mobile background coverage gap + remove desktop console 404s**  
   - Plan: `codex/execplans/2026-01-21_fix-mobile-bg-gap_and_console-404s.md`  
   - Status: READY  
   - Target outcomes:
     - Mobile: background image covers full viewport with no bottom gap (all listed pages).
     - Desktop: zero console errors on load; eliminate all 404s from the provided console log.
     - Parallax remains functional on mobile + desktop; no other visual/function changes.

## Archived / reference ExecPlans

- Scroll wheel behavior validation (historical): `codex/checklists/CHECKLIST.scroll-wheel-validation.md`  
- Legacy initiation prompt (historical): `codex/prompts/CODEX_INITIATION_PROMPT_SCROLL_WHEEL.md`

## How Codex should use this file

1. Read `AGENTS.md` first.
2. Pick the ACTIVE ExecPlan that matches the user's request (SEO plan for SEO/indexability work).
3. Keep the diff minimal, and continuously re-validate against the ExecPlan acceptance criteria.
