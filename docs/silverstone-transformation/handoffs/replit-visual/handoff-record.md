# Handoff Record — High-Visibility Home (Precision Luminescence)

## Metadata

- handoff_id: replit-visual/high-visibility-home-v1
- from: Replit visual prototyping + React handoff
- to: Production implementation (route integration owner)
- branch: main
- commit: checkpoint `visual-high-visibility-v1` (created at handoff)
- base_commit: 281b5a73ad3c2576b359bbf161be8f3ef1916757

## Ownership

- paths_owned:
  - `web/public/prototypes/**` — previewable static acceptance surface (served at `/prototypes/...`)
  - `web/src/visual/**` — typed React handoff (typecheck/lint/build only; NOT route-rendered)
  - `web/src/styles/visual/**` — CSS imported by the `.tsx` handoff
  - `docs/silverstone-transformation/handoffs/replit-visual/**` — evidence/handoff
  - `docs/silverstone-transformation/design/visual-direction-prototype-spec-v1/implementation-addendum-v1.md` — ADD-ONLY addendum
- next_owner_constraints:
  - These components are NOT wired into any route. The production owner mounts them into real routes/loaders.
  - Keep the shader hard-gated: Tier A only (`min-width: 1024px` AND WebGL), deferred, paused when hidden/offscreen, poster on context loss.
  - Reuse existing contracts: `~/lib/visuals/lazy-visual-boundary` and `~/components/accessibility/use-reduced-motion`.
  - Do not promote the prototype's static `/prototypes/**` HTML into production routes; it is an acceptance surface only.

## Scope completed

- scope_completed:
  - Shared prototype foundation (self-contained tokens, components, behaviour) under `web/public/prototypes/assets/**`.
  - Two materially-different directions prototyped and compared; Direction A "Platinum Constellation" selected (see `visual-decision-log.md`).
  - Full selected home experience at `web/public/prototypes/home/index.html`: sticky nav with compaction, copy-first hero + operating-system constellation, value strip, six-service field, graphite CTA chamber, Machined Signal icons, loading skeleton, deferred gated WebGL signal field, reduced-motion + low-power fallbacks.
  - Typed React handoff mirroring the prototype under `web/src/visual/**` + `web/src/styles/visual/visual.css`, with a mountable `fixtures/visual-smoke.tsx` and `index.ts` barrel.

## Tests

- tests:
  - command: `cd web && npm run typecheck`
    result: PASS (clean)
  - command: `cd web && npm run lint`
    result: PASS (eslint `--max-warnings=0`, strictTypeChecked + stylisticTypeChecked)
  - command: `cd web && npm run build`
    result: PASS (built; prerender + SPA fallback emitted; server build removed by `ssr:false`)
  - command: visual render check (platform browser) of `/prototypes/home/index.html`
    result: PASS (matches locked art direction; see `screenshots/home-desktop.jpg`)

## Artifacts

- artifacts:
  - `web/public/prototypes/home/index.html` (+ `assets/**`, `directions/**`, `index.html` review hub)
  - `web/src/visual/**` (13 modules) + `web/src/styles/visual/visual.css`
  - `docs/silverstone-transformation/handoffs/replit-visual/screenshots/home-desktop.jpg`
  - `docs/silverstone-transformation/handoffs/replit-visual/screenshots/direction-a-platinum.jpg`
  - `docs/silverstone-transformation/handoffs/replit-visual/screenshots/direction-b-graphite.jpg`
  - `docs/silverstone-transformation/handoffs/replit-visual/{visual-decision-log,validation-matrix,performance-observations}.md`
  - `docs/silverstone-transformation/design/visual-direction-prototype-spec-v1/implementation-addendum-v1.md`

## Budgets

- budgets:
  - javascript_gzip_kb: shader chunk target ≤45 KB gz (prototype acceptance budget; not measured — see Known deviations)
  - lcp_ms: not measured in this environment (Lighthouse/headless browser unavailable — see Known deviations)

## Accessibility

- accessibility:
  - automated_score: not run (headless browser unavailable in this environment — see Known deviations)
  - critical_violations: none found by source inspection — visible focus ring on every interactive element via `:focus-visible` (`--ss-shadow-focus-light: 0 0 0 2px #fff, 0 0 0 4px #39454d`; dark variant on graphite), skip link, keyboard-operable disclosures/toggles with `aria-expanded`, decorative canvas/SVG marked `aria-hidden`.

## Production boundary

- legacy_root_unchanged: true
- production_controls_untouched: true

## Known deviations

- known_deviations:
  - Full Playwright responsive/zoom/reduced-motion/no-WebGL screenshot matrix could NOT be captured: the bundled Chromium fails to launch with `libgbm.so.1: cannot open shared object file`. Installing that system library would require package/config edits, which are out of this task's ownership scope. Responsive/a11y/gating behaviour was instead validated by source inspection (see `validation-matrix.md`) and a working desktop render via the platform screenshot service.
  - Performance budgets (JS gz size, FPS, long-task duration, LCP) are prototype acceptance targets, not measured implementation results, for the same reason.

## Open risks

- open_risks:
  - The React handoff is not route-rendered, so it is compiler-verified (typecheck/lint/build) but not runtime-verified in a browser. The production owner must smoke-test once mounted.
  - WebGL signal-field visual parity between the prototype (`signal-field-shader.js`) and the React port (`shader/signal-field-canvas.tsx`) was matched by porting the GLSL/geometry verbatim; confirm on real hardware.

## Rollback

- rollback:
  - revert_commit_or_instruction: Roll back to base_commit `281b5a73ad3c2576b359bbf161be8f3ef1916757`, or restore the checkpoint immediately preceding `visual-high-visibility-v1`. All changes are additive within the owned paths; no routes/config/packages were modified.
