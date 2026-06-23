# Silverstone typography and layout specification v1

**Status:** Authoritative proposal  
**Date:** 2026-06-23

## 1. Typography system

**Proposal:** use **Sora Variable** for display headings and **Inter Variable** for body/interface text, self-hosted as subset WOFF2 only after licence verification. The system stack is the no-download fallback. Limit the release to two font families and no more than two preloads, matching D-01 performance budgets.

| Role | Family | Size token | Weight | Line height | Tracking | Measure |
|---|---|---|---:|---:|---:|---:|
| Display | display | `display` | 600 | 1.02 | -0.04em | 12–14ch |
| H1 | display | `h1` | 600 | 1.02–1.08 | -0.04em | 18ch |
| H2 | display | `h2` | 600 | 1.12 | -0.025em | 22ch |
| H3 | display | `h3` | 600 | 1.12 | -0.025em | 28ch |
| H4–H6 | body | `h4`–`h6` | 600 | 1.3 | -0.015em | 32ch |
| Lead | body | `body-lg` | 400 | 1.55 | 0 | 56ch |
| Body | body | `body` | 400 | 1.55 | 0 | 68ch |
| Label | body | `body-sm` | 600 | 1.3 | 0.02em | auto |
| Eyebrow | body | `caption` | 650 | 1.3 | 0.12em | auto |
| Technical | mono | `body-sm` | 500 | 1.55 | 0 | 72ch |

Rules:
- One H1 per route, matching the route registry intent.
- Do not use all caps beyond short eyebrow labels.
- Never place body copy directly on a brand-spectrum gradient without a solid/controlled overlay.
- Do not reduce font size to solve overflow; change composition, wrapping, or container constraints.
- Preserve browser text zoom and user font substitution.

## 2. Spacing rhythm

**Proposal:** a 4px base scale controls component internals; section rhythm uses 72px mobile and 120px desktop defaults. Use optical exceptions only when recorded in the component specification.

- Component gaps: 4, 8, 12, 16, 20, 24, 32px.
- Section subgroups: 32–56px.
- Section blocks: 72px mobile, 96px tablet, 120px desktop.
- Hero blocks: 96px mobile, 128px tablet, 160px desktop.
- Adjacent sections alternate surface or spacing, not both excessively.

## 3. Container and grid

| Range | Columns | Gutter | Gap | Max container |
|---|---:|---:|---:|---:|
| 320–479 | 4 | 20px | 16px | fluid |
| 480–767 | 4 | 24px | 20px | fluid |
| 768–1023 | 8 | 32px | 24px | 1120px |
| 1024–1279 | 12 | 48px | 24px | 1120px |
| 1280–1535 | 12 | 48px | 24px | 1280px |
| 1536+ | 12 | 64px | 32px | 1440px |

**Proposal:** breakpoints are implementation coordination points, not device classes. Components change when their content no longer fits, using container queries where they reduce route-specific media-query chains.

## 4. Responsive composition

- Hero copy occupies 5–6 desktop columns and 4 mobile columns; media occupies 6–7 desktop columns.
- Cards use 1 column below 640px, 2 columns when minimum card width of 280px fits, and at most 3 columns for dense service/industry lists.
- Service and industry modules alternate media only at `lg`; on smaller widths, copy precedes media unless the media is necessary to understand the heading.
- Forms use a compact 720px container; paired fields collapse before labels or error text wrap awkwardly.
- Proof logos never shrink below legible source artwork; overflow becomes a wrapped grid or user-controlled carousel.
- Demos reserve aspect-ratio space to prevent layout shift.

## 5. Reflow and zoom

**Standard requirement:** non-excepted horizontal-language content must reflow at a viewport equivalent to 320 CSS pixels; that corresponds to a 1280 CSS-pixel viewport at 400% zoom. [S5]

**Proposal:** all core routes must pass at 320px width and 400% zoom without two-dimensional page scrolling. Exceptions are deliberately scrollable data tables, code samples, and media where the contained panel remains understandable. Navigation, breadcrumbs, forms, accordions, Calendly fallback, and footer must remain operable.

## 6. Touch and pointer targets

**Standard requirement:** WCAG 2.2 AA specifies 24×24 CSS pixels or qualifying spacing/equivalent exceptions. [S6]

**Proposal:** Silverstone uses a stronger **44px preferred** interactive height for buttons, fields, menu triggers, carousel controls, accordion headers, and icon buttons. Inline text links remain text-flow exceptions but receive visible focus and adequate line height.

## 7. Safe-area and viewport units

**Proposal:** use `dvh` for full-height layouts with `vh` fallback; apply safe-area inset padding only where fixed navigation or bottom actions touch screen edges. No component assumes a stable mobile browser chrome height.

## 8. Acceptance summary

- No unintended horizontal overflow at 320, 360, 390, 768, 1024, 1280, and 1440 CSS px.
- Text remains readable at 200% text zoom and page remains usable at 400% browser zoom.
- No heading orphan shorter than three meaningful words where copy can be edited.
- No body line exceeds 75ch; preferred maximum is 68ch.
- Font loading failure preserves content order and does not hide text.

## Sources
- **[S5]** [Understanding SC 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- **[S6]** [Understanding SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
