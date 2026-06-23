# Silverstone semantic token map v1

**Status:** Authoritative proposal  
**Date:** 2026-06-23  
**Repository destination:** `/docs/silverstone-transformation/design/brand-motion-design-system-v1/`

## 1. Authority and evidence boundary

**Repository evidence:** D-01 fixes the `/web` boundary, Tailwind ownership of tokens/layout, shadcn/ui adaptation, visible focus, reflow, native scrolling, reduced motion, and one-animation-owner rules. The available F-01 bundle baseline is `/docs/silverstone-transformation/design/brand-motion-design-system-v1/f01-bundle-report-v1.json`: **111.83 KB gzip**, passing the D-01 **220 KB target** and **300 KB hard ceiling**. The built CSS exposes a Tailwind theme layer and semantic variables including `--background`, `--foreground`, `--primary`, `--border`, and `--ring`.

**Evidence limitation:** the requested `transformation/foundation` ref and a separately named F-01 implementation report were not available through the repository connector. This system therefore relies on the available foundation build/bundle evidence and does not claim unverified dependencies or component completion.

## 2. Naming contract

**Proposal:** use `category.role.variant.state` in design documentation and CSS custom properties generated as `--ss-<category>-<role>-<variant>-<state>`. Primitive palette tokens are never consumed directly by route components; components consume semantic aliases. Exceptions are decorative gradients, approved illustrations, and chart series.

Examples:

| Design token | CSS export | Consumer |
|---|---|---|
| `color.semantic.light.text.primary` | `--ss-color-text-primary` | all body text |
| `color.semantic.light.action.primary-bg` | `--ss-color-action-primary-bg` | button variants |
| `motion.duration.base` | `--ss-motion-duration-base` | CSS transitions |
| `layout.container.wide` | `--ss-layout-container-wide` | page shell |

## 3. Locked primitive palette

| Primitive | Hex | Approved role |
|---|---:|---|
| Silverstone Graphite | `#43555D` | light-theme text, dark support surface |
| Deep Graphite | `#39454D` | primary light text, primary dark brand surface |
| Titanium Silver | `#A0A4AB` | dark borders, disabled-only content, metallic effects |
| Platinum Silver | `#E9EAEF` | dark secondary text, subtle light dividers |
| Electric Cyan | `#5EC5D0` | dark-theme links/actions, decorative energy |
| Digital Blue | `#597FAD` | decorative gradient/chart source; not normal text on white |
| Neural Violet | `#A97CC0` | decorative gradient/large display; not normal text on white |
| Cloud White | `#FFFFFF` | canvas and inverse text |
| Electric Pink | `#C884C3` | decorative highlight; not normal text on white |
| Soft Pink Glow | `#CE98CF` | glow and ambient highlight |
| Deep Magenta | `#A96EAB` | decorative/large display source; not normal text on white |

## 4. Semantic colour policy

**Standard requirement:** normal text is specified at **4.5:1** minimum and large text at **3:1**; required UI boundaries and state indicators are specified at **3:1** against adjacent colours. Ratios are thresholds and must not be rounded up. [S2][S3]

**Proposal:**
- Light theme uses Deep Graphite for primary text (9.85:1 on white), Silverstone Graphite for secondary text (7.79:1), and derived Ink Muted `#66747B` (4.83:1).
- Dark theme uses Cloud White (9.85:1 on Deep Graphite), Platinum Silver (8.20:1), and derived Night Muted `#C4C7CC` (5.81:1).
- Brand cyan/blue/violet/pink primitives remain decorative on white unless used at a verified large-text size. Accessible derived inks carry their hue into text and controls.
- Colour never acts as the only state cue. Pair colour with icon, label, border, pattern, position, or text.

## 5. Surface and border map

| Context | Canvas | Raised | Default text | Required control border | Focus ring |
|---|---|---|---|---|---|
| Light | Cloud White | Cloud White / Canvas Subtle | Deep Graphite | Border Strong `#77858B` | 2px white gap + 2px Deep Graphite |
| Dark | Night Canvas `#202A2F` | Night Raised `#2B373D` | Cloud White | Titanium Silver | 2px Night Canvas gap + 2px Cloud White |

Subtle dividers may be lower contrast only when they do not identify a control, communicate state, or separate information required for understanding. Required input boundaries use `border.default` or stronger. [S3]

## 6. Action map

| Variant | Light theme | Dark theme | Behaviour |
|---|---|---|---|
| Primary | Deep Graphite / White | Electric Cyan / Deep Graphite | one dominant CTA per local decision area |
| Secondary | White / Deep Graphite + border | Deep Graphite / White + Titanium border | equal-height alternative action |
| Accent | Cyan Ink / White | White / Deep Graphite | restrained use for demos or booking |
| Ghost | transparent / current text | transparent / current text | hover surface plus persistent text/icon cue |
| Destructive | semantic danger tokens | semantic danger tokens | confirmation for irreversible actions |

## 7. Focus policy

**Standard requirement:** a visible authored indicator needs sufficient contrast; the Level AAA focus-appearance model describes an indicator area at least equivalent to a 2 CSS-pixel perimeter and 3:1 state contrast. [S4]

**Proposal:** adopt that stronger model throughout even though the target release claim remains WCAG 2.2 AA: a two-colour 4px total ring, 2px offset where clipping allows, never removed, never conveyed by glow alone, and never obscured by sticky navigation.

## 8. Semantic states

Success, warning, danger, and information each define foreground, background, and border tokens. Every message includes a textual label or status icon with accessible name. Form errors remain adjacent to the field and are also included in the summary/status region; success cannot be indicated by green alone.

## 9. Chart semantics

**Proposal:** charts use theme-specific six-series palettes plus direct labels, dash/shape/pattern differentiation, a data table or text summary for essential information, and 2px default strokes. Interactive marks receive a 4px visual emphasis and keyboard-readable values. The matrix records series-to-surface contrast; adjacent series must also be tested in the actual chart geometry.

## 10. Theme resolution

**Proposal:** default to light theme until an owner-approved theme control exists. If dark theme is introduced, resolve semantic aliases at the root theme boundary; do not switch primitive values inside component files. Persist explicit user choice, honour forced-colours, and test both themes at 200% and 400% zoom.

## Sources
- **[S2]** [Understanding SC 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- **[S3]** [Understanding SC 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- **[S4]** [Understanding SC 2.4.13 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
