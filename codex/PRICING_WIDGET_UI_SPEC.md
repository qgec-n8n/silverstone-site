<!-- FILE: codex/PRICING_WIDGET_UI_SPEC.md -->

# Pricing Widget UI Specification (Two Rows)

## Rendering entrypoint
Widget renders into a ShadowRoot attached to the mount element. All styles are injected into the ShadowRoot.

## Inputs
- pageKey: string (must match keys in `pricing-copy.json`)
- pricing data: parsed output from `PRICING_COPY_MAP.md`

If pageKey is unknown:
- Render a minimal non-breaking message inside the mount only.
- Do not throw uncaught errors.

---

## Layout
Overall:
- Two stacked sections: Row 1 then Row 2.
- Each row has:
  - title
  - optional subtitle
  - a 3-card grid (responsive: 1 column mobile, 3 columns desktop)

---

## Row 1 (highlighted picks)
### Header
- Title: Row 1 title from copy
- Subtitle: Row 1 subtitle if present
- Toggle: MUST be visible and labeled exactly:
  - “Monthly”
  - “Setup”

### Toggle behavior
- Default selection: “Monthly”
- When “Monthly” selected:
  - Each card’s price block shows the **Monthly retainer** value for that plan.
  - Price cadence label should indicate monthly (example: “/mo”).
- When “Setup” selected:
  - Each card’s price block shows the **Setup fee** value for that plan.
  - Cadence label should indicate setup fee (example: “setup fee”).
- No other values change.

### Cards
Each of the 3 Row-1 plans renders:
- Plan name (prominent)
- Price block (prominent)
- Best for (short paragraph)
- What’s included (bulleted list)

Card 2 only:
- Must show a “Most popular” badge (exact text).
- Must be visually emphasized (slightly stronger border/shadow/background).

Styling constraints:
- Dark theme compatible with existing site.
- No global font or reset changes.
- No animation required; if present, must not depend on external libraries beyond React.

---

## Row 2 (other options summaries)
### Header
- Title: Row 2 title from copy
- Subtitle: Row 2 subtitle if present
- NO toggle (must not render toggle at all)

### Cards (3 groups)
Each group card renders:
- Group label (title)
- One-liner (short paragraph)
- Plans included (rendered from the raw block):
  - Must be scannable.
  - Acceptable rendering:
    - preserve category lines as bold labels, followed by a list
    - or render a compact list of plan strings (do not reword)
- “Slight restyle” guidance:
  - more compact typography than Row 1
  - less prominent price emphasis
  - may use a subtle divider between “One-liner” and “Plans included”

---

## Accessibility & robustness
- Toggle uses button semantics with aria-pressed or a radiogroup pattern.
- No reliance on document-level IDs.
- No host-page query selectors except within the mount element.
- Widget must not interfere with hero shader canvas or layout.
