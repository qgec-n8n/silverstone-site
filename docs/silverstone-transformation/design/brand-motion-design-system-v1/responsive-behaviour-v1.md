# Silverstone responsive behaviour v1

**Status:** Authoritative proposal  
**Principle:** responsive changes protect reading order, target size, reflow, and conversion clarity; they do not merely shrink the desktop composition.

## Breakpoint policy

| Token | Min width | Primary use |
|---|---:|---|
| `xs` | 360px | compact phone refinements |
| `sm` | 480px | paired micro-layouts |
| `md` | 768px | 8-column/tablet composition |
| `lg` | 1024px | desktop navigation and split modules |
| `xl` | 1280px | wide 12-column composition |
| `2xl` | 1536px | capped 1440px canvas |

Breakpoints are proposals. Components should use intrinsic layout (`minmax`, wrapping, container queries) before adding route-specific breakpoints.

## Component behaviour matrix

| Component | <480 | 480–767 | 768–1023 | ≥1024 |
|---|---|---|---|---|
| navigation | mobile disclosure | mobile disclosure | mobile disclosure | full nav + disclosures |
| hero | single column, copy first | single column | 7/8 copy + media below/aside if fit | 5/7 or 6/6 split |
| CTA group | full-width stack | wrap or pair | inline pair | inline pair |
| card grid | 1 column | 1–2 intrinsic | 2 columns | 3 columns max |
| service/industry module | copy then media | copy then media | copy then media/compact split | alternating split |
| form | 1 column | 1 column | optional paired short fields | compact 2-column short fields |
| breadcrumbs | wrap; collapse middle via disclosure only if needed | wrap | full where fit | full |
| Calendly shell | fallback-first, reserved frame | reserved frame | embed + fallback | embed + supporting panel |
| logo system | wrapping grid | wrapping grid | grid/controlled carousel | grid/controlled carousel |
| footer | stacked groups | 2-column groups | 3–4 groups | full multi-column |

## Mobile requirements

- Minimum page gutter 20px at 320–479px.
- Primary actions use 48–56px height; secondary/controls at least 44px preferred.
- Sticky elements must not cover focused fields, errors, booking controls, or browser zoomed content.
- No fixed-height content cards.
- Media uses explicit aspect ratio and dimensions; crop focal points are content-managed.
- Tables receive a labelled horizontal-scroll region and remain independently understandable.
- Decorative side glows may clip; meaningful content may not.

## Zoom and reflow test grid

Standard basis: content reflows at a viewport equivalent to 320 CSS pixels. [S5]

Required manual matrix:
- 320×568, 360×800, 390×844, 412×915;
- 768×1024 portrait;
- 1024×768 landscape;
- 1280×800 and 1440×900;
- 200% text-only zoom where available;
- 400% browser zoom from a 1280px viewport;
- forced-colours and reduced-motion combinations.

## Orientation and input

No experience is locked to portrait or landscape. Hover enhancements apply only under `(hover: hover) and (pointer: fine)`. All actions remain available under coarse pointer, keyboard, touch, switch/voice-generated keyboard events, and zoom.

## Responsive motion

- Below `lg`, remove pinned scroll scenes and large lateral travel.
- Below `md`, use static hero background or simplified shader fallback.
- Motion distance scales down before duration; reduced-motion overrides both.
- ResizeObserver invalidates measured timelines; rebuild only affected timelines, not the whole page. [S11]

## Acceptance

PASS requires no unintended horizontal page overflow, no clipped focus ring, no overlapping controls, readable labels/errors, logical DOM order, no CSS reordering that changes meaning, and preserved fallback actions at every required size.

## Sources
- **[S5]** [Understanding SC 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- **[S6]** [Understanding SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- **[S11]** [MDN ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
