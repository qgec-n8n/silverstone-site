# Silverstone AI — V2 Creative Directive

> Scope: presentation-layer rebuild of the active `/web` app (pack prompt
> `01-global-system-and-homepage`). Data, routing, content and SEO are preserved;
> the design system, global shell, route loader and homepage are rebuilt.

## 1. Concept — "Precision Luminescence"

**Visual metaphor:** _order resolving out of darkness._ Silverstone takes the
operational noise a business lives in — missed calls, scattered tools, cold leads
— and resolves it into one calm, luminous signal. The interface is a dark,
machined surface; intelligence shows up as light: precise, controlled, never
gaudy.

This concept is already seeded in the copy ("From friction to flow", the
"Precision Luminescence" pill) and is carried through every surface — hero,
sections, functional components (cards, counters, marquees), and the footer.
If the concept could be removed without changing a section, that section is wrong.

## 2. Tone

Elite, calm, confident. Luxury-technology, not start-up hype. The brand's own
line governs: **"No hype. Just measurable wins."** Motion and copy must feel
engineered and restrained — expensive, not loud.

## 3. Palette (dark default)

Dark is the default theme (`class="dark"` on `<html>`). Light tokens are
retained but the experience is built dark-first.

| Role | Token family | Notes |
| --- | --- | --- |
| Base void | near-black / blue-black / violet-black | layered backdrops, never flat `#000` |
| Surface | graphite / glass | translucent panels, hairline borders |
| Structure | titanium / platinum / chrome | borders, dividers, metallic text |
| Signal | electric cyan `#22D3EE` | primary luminescence, CTAs, focus |
| Signal alt | blue → violet | gradient depth, secondary accents |
| Heat | pink/iridescent | sparingly, for climax + highlights |

Luminescence is **earned**: glow concentrates on focal points (hero core, CTAs,
active states), darkness dominates everywhere else.

## 4. Typography

Use the existing type system. Display headings are large, tight and confident;
body copy is calm and readable on dark. Metallic / gradient treatments are
reserved for hero and section eyebrows — never on long-form body text.

## 5. Motion principles

- **One scroll owner.** A single Lenis + GSAP ScrollTrigger loop drives
  scroll-linked motion. Component state (hover, reveal, counters) uses CSS /
  Framer Motion. Never double-drive the same transform/opacity.
- **Progressive enhancement.** Reveal/entry hidden states are gated behind
  `prefers-reduced-motion: no-preference` **and** `html[data-js="on"]`, so the
  page is fully visible without JS and respects reduced-motion.
- **Reduced motion disables** counters, marquees, ScrollTrigger and the shader —
  content stays, animation stops.
- **Capability-tiered visuals.** The WebGL/shader hero only mounts on capable
  devices (`useCapabilityTier`); everyone else gets the prerendered poster,
  which is the static source of truth.

## 6. Heavy-visual safety

All heavy visual libraries (`three`, `@react-three/*`, `postprocessing`,
`@paper-design/shaders-react`) are **dynamically imported** behind a
`LazyVisualBoundary`. No browser globals at module scope, so SSR/prerender and
the staging build never crash. These deps are added to Vite `optimizeDeps.include`
to avoid mid-session re-optimization (which briefly duplicates React).

## 7. Claims & legal framing

Performance figures are presented as **industry benchmarks / outcomes**, never as
guaranteed Silverstone results. The benchmark disclaimer must remain visible with
the counters. See `claims-registry.md` for every figure and its source.

## 8. Staging safety (non-negotiable)

Analytics off, Resend mocked/blocked, non-indexable (`noindex`), IndexNow
disabled, no production deploy. No remote runtime assets — all imagery and logos
are local. No secrets or production values introduced.
