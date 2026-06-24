# Component Source Ledger

Maps each reference in the Silverstone Replit component pack to how it was
adapted (or deliberately not used) in the V2 `/web` rebuild. Pack location:
`docs/vendor/silverstone-replit-component-pack/`.

| Pack reference | Decision | Where it lands in `/web` | Key adaptations |
| --- | --- | --- | --- |
| **Core Spin Loader** | Adapt | Branded route loader (`RouteLoadingIndicator` / `LoadingFallback`) | Re-skinned to Precision Luminescence; emblem + luminous ring; `role="status"`, `aria-live`; honours reduced-motion (static state). |
| **Aether Flow Hero** | Adapt (concept) | Flagship hero stage (`web/src/visual/home-v2/*`) | Canvas particle idea reimplemented via R3F/drei + paper-design shaders, **dynamically imported**, gated by capability tier + reduced-motion, with prerendered poster fallback. No browser globals at module scope. |
| **Particles BG (CDN)** | **Drop** | — | Relied on a runtime CDN script — violates "no remote runtime assets". Replaced by the in-house signal-field shader + static poster. |
| **Integration Hero** | Adapt (replace assets) | Integration carousel (dual marquee rows) | Flaticon **PNGs replaced with local monochrome SVGs** in `web/public/integrations/` (currentColor → chrome on dark). Two counter-scrolling rows; marquee pauses under reduced-motion. |
| **Hero Button (expandable)** | Adapt (strip) | Primary CTAs / conversion climax | Kept the premium button treatment; **removed the fake inline form and fabricated testimonials** — no invented social proof. CTAs point to real routes (`/book`, `/services`). |
| **Display Cards** | Adapt | Services universe section (`SERVICE_UNIVERSE`) | Stacked/fanned luminous cards for the six core services; hover lifts a card to focus; links resolve to validated `/services/*` routes. |

## Global shell & system (new, not from pack)

| Surface | File(s) | Notes |
| --- | --- | --- |
| Design tokens | `web/src/styles/tokens/index.css` | Extended with near-black/blue-black/violet-black, chrome/glass/glow/iridescent/gradient families + utilities. Light tokens retained. |
| Dark default | `web/src/app/root.tsx` | `class="dark"` on `<html>` (does not invert `:root`). |
| App shell | `web/src/components/layout/app-shell.tsx` | Premium glass→solid header (React scroll state), Services/Industries mega menus, mobile drawer, full a11y; dark metallic footer. `app/components/app-shell.tsx` re-export retained. |
| Homepage | `web/src/routes/company/home.tsx` → `home-v2.tsx` | HomeV2 branch; other routes keep `CoreMarketingPage`. |

## Conventions carried over

- Single scroll owner (Lenis + GSAP); component state via CSS/Framer Motion.
- Progressive-enhancement reveal gating (`data-js` + reduced-motion).
- Visual CSS scoped under a root wrapper class to avoid leaking globals.
