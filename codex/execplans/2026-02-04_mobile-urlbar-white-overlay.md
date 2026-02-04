<!-- FILE: codex/execplans/2026-02-04_mobile-urlbar-white-overlay.md -->
# ExecPlan: Mobile URL-bar white overlay (mobile-only)

Owner: Codex (GPT-5.2)
Date: 2026-02-04
Scope: Minimal, targeted change. Add a mobile-only white overlay covering the URL bar area. Desktop must remain unchanged.

## Conflict resolution (priority order)
1) This ExecPlan's mobile URL-bar overlay requirements.
2) `AGENTS.md` guardrails (parallax intact, minimal diffs, evidence-first).
3) Other ExecPlans listed in `ExecPlans.md`.

## Primary outcomes (acceptance criteria)
A) Mobile (all HTML pages): a white overlay bar covers the bottom URL bar area and tracks expand/collapse; content scrolls underneath (reveals from behind).
B) Desktop: no visual or behavioral changes; overlay not present or height 0.
C) Parallax continues to work on mobile + desktop.
D) No other visual or functional changes.

Target pages:
- `index.html`
- `about.html`
- `services.html`
- `book.html`
- `contact.html`
- `privacy-policy.html`
- `niches/*.html`

## Implementation approach (required)
- Prefer a shared implementation so all HTML pages are covered without manual duplication.
- Add global overlay styling in a shared CSS file (prefer `src/css/base/layout.css`).
- Insert the overlay element via shared JS (prefer `src/js/app.js`) so it exists on every page.
- Gate behavior to mobile only using the existing mobile breakpoint and/or `matchMedia`.
- Use `window.visualViewport` when available; listen to `visualViewport.resize` and `visualViewport.scroll`.
- Compute bottom occlusion as `max(0, innerHeight - (visualViewport.height + visualViewport.offsetTop))` and clamp to a conservative max. Store in `--urlbar-overlay-height` on `document.documentElement`.
- Fallback when `visualViewport` is unavailable: default `--urlbar-overlay-height` to `env(safe-area-inset-bottom)` (or `0px`).
- Overlay CSS: `position: fixed; bottom: 0; left: 0; width: 100%; height: var(--urlbar-overlay-height); background: #fff; z-index` above content; `pointer-events: none`.
- Do not add bottom padding or margins that would push content above the overlay.

## Progress checklist
- [ ] Baseline: measure `visualViewport` vs `innerHeight` while URL bar expands/collapses (mobile Safari + Chrome).
- [ ] Confirm target pages list and shared CSS/JS entry points.
- [ ] Implement overlay (CSS + JS) with mobile-only gating.
- [ ] Verify on all HTML pages; desktop unchanged; parallax still works.
- [ ] Update this ExecPlan with discoveries and verification notes.

## Baseline & measurement (must do before editing)
1) Start a local server (`bash scripts/codex.serve.sh` or `python3 -m http.server 8080`).
2) On mobile Safari and Chrome:
   - Open `index.html` and one `niches/*.html` page.
   - In DevTools console, log `visualViewport.height`, `visualViewport.offsetTop`, and `innerHeight` while collapsing/expanding the URL bar.
   - Record the expected occlusion range in `artifacts/output/mobile-urlbar-occlusion.txt`.

## Implementation steps (must follow)
1) Add overlay CSS and default `--urlbar-overlay-height` (global, mobile-only).
2) Add shared JS in `src/js/app.js` to create the overlay element and update the CSS variable.
3) Hook `visualViewport` resize/scroll and `orientationchange`; update via `requestAnimationFrame`.
4) Build assets and verify behavior on all HTML pages.

## Validation gates (must pass)
Gate 1: Mobile overlay behavior
- White bar covers the URL bar area and tracks expand/collapse on all target pages.
- Content scrolls underneath (no bottom padding push-up).

Gate 2: Desktop unaffected
- No overlay visible or measured on desktop.
- No layout or style differences from baseline.

Gate 3: Parallax behavior
- Parallax remains functional on mobile + desktop.

## Notes / discoveries (fill as you go)
- Baseline (code inspection): no existing `urlbar-overlay` element or `--urlbar-overlay-height` variable prior to this change.
- Implementation added shared CSS in `src/css/base/layout.css` and shared JS in `src/js/app.js` (visualViewport with screen.height fallback), then rebuilt `assets/css/styles.css` and `assets/js/app.js`.
- User evidence (iOS Safari screenshots): overlay not visible, implying computed height stayed at 0; updated occlusion calculation to consider `screen.height / visualViewport.scale` and `outerHeight` deltas in addition to layout viewport values, then rebuilt `assets/js/app.js`.
- User evidence (iOS Safari screenshots): overlay appeared above the URL bar; updated overlay CSS to translate downward by its own computed height so the white bar sits inside the URL bar area, then rebuilt `assets/css/styles.css`.
- Device verification pending: requires iOS Safari + Android Chrome checks by user.
