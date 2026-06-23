# Implementation Addendum v1 — Replit Visual Prototype & React Handoff

**Status:** ADD-ONLY addendum. This file does not modify any v1 specification document; it
maps the locked specification to the prototype + React handoff produced on Replit.

**Created:** 23 June 2026 (Europe/London)
**Relates to:** `sitewide-art-direction-v1.md`, `motion-storyboards-v1.md`,
`responsive-reduced-motion-v1.md`, `shader-component-decision-v1.md`,
`page-visual-concepts-v1.md`, `prototype-acceptance-v1.csv`.

## What was built

- **Static prototype (acceptance surface):** `web/public/prototypes/**`, served at
  `/prototypes/...`. Self-contained tokens/CSS/JS, no external network.
- **Typed React handoff (not route-rendered):** `web/src/visual/**` +
  `web/src/styles/visual/visual.css`. Verified by `typecheck` + `lint` + `build`.

## Spec → implementation map

| Spec element | Prototype | React handoff |
| --- | --- | --- |
| Precision Luminescence (70/20/10) art direction | `assets/prototype-tokens.css` | `styles/visual/visual.css` (`--vx-*` fallbacks on `.ss-visual-root`) |
| Home concept "From friction to flow" | `home/index.html` hero | `components/home-hero.tsx` |
| Operating-system / Connector Constellation | `assets/constellation.js` | `components/operating-system-constellation.tsx` (geometry ported verbatim) |
| Asymmetric service field | `home/index.html` services band | `components/services-overview.tsx` |
| Graphite conversion chamber | `home/index.html` CTA section | `components/primary-cta.tsx` + `.ss-cta-chamber` |
| Machined Signal icon language | inline SVG in prototype | `icons/machined-signal-icons.tsx` (`ICON_PATHS` + `MachinedSignalIcon`) |
| Sticky nav + visual states | `assets/prototype.js` `initStickyNav`/disclosures | `components/nav-visual-states.tsx` |
| Loading skeleton | `assets/prototype.js` `initSkeletons` | `components/visual-loading-fallback.tsx` |
| Static poster / low-power end-state | `home/index.html` poster layer | `components/low-power-poster.tsx` |
| Deferred gated WebGL signal field | `assets/signal-field-shader.js` + `initShader` gate | `shader/signal-field-background.tsx` + `shader/signal-field-canvas.tsx` |
| Capability tiering (A/B/C) | `assets/prototype.js` `resolveCapabilityTier` | `hooks/use-capability-tier.ts` + reused `use-reduced-motion` |

## Acceptance criteria status (vs `prototype-acceptance-v1.csv` intent)

- Met and verified (render + source): copy-first hero, constellation, focus ring, keyboard
  operability, no horizontal overflow, shader deferred and off below 1024px, reduced-motion
  and low-power fallbacks, context-loss resilience.
- Not measured in this environment: gz size, FPS, long-task ms, automated a11y score, LCP —
  the headless browser/Lighthouse are unavailable here (see
  `../../handoffs/replit-visual/validation-matrix.md`). These remain acceptance targets for
  the production owner to measure.

## Constraints honoured

- No route/config/package/content/SEO edits; no new dependencies; legacy root and production
  controls untouched. Reused existing `lazy-visual-boundary` and `use-reduced-motion`
  contracts rather than adding new ones.
