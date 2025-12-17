<!-- FILE: codex/PRICING_WIDGET_SPEC.md -->
# Pricing Widget Spec

This spec defines the required UI + behavior for the embedded React pricing widget.

Integration semantics must be derived only from:

- `PRICING_COPY_MAP.md`
- `pricing_code_prompt.md`
- `Embed_React_Guide.md`
- the referenced Medium embedding article
- the referenced 21st.dev pricing section reference

## High-level requirements

- The widget is embedded into existing static HTML pages.
- Every target page renders **two** stacked pricing sections:
  - Section 1: toggle variant (Monthly / Setup)
  - Section 2: no-toggle variant (other options summaries)
- Each section renders exactly **3 cards**.
- UI must match the visual design language of `pricing_code_prompt.md` as closely as possible.

## Widget mount contract

The embedded script must mount into any element matching:

- `.ss-pricing[data-ss-pricing-page][data-ss-pricing-section]`

The attributes determine which copy to render:

- `data-ss-pricing-page` — must equal the repo-relative HTML file path (example: `niches/dentists.html`)
- `data-ss-pricing-section` — must be `"1"` or `"2"`

The widget must be able to mount multiple times on the same page (two instances).

## Section 1 (toggle variant)

### Toggle labels and behavior

- The toggle must display:
  - “Monthly”
  - “Setup” (replaces “Yearly”)

- The sliding highlight animation must remain intact.

When toggling:

- Monthly position:
  - Show the plan’s Monthly Retainer value from `PRICING_COPY_MAP.md`
- Setup position:
  - Show the plan’s Setup Fee value from `PRICING_COPY_MAP.md`

### Price formatting

- Currency is GBP.
- Price display must not include “/year” or “Yearly”.
- For Monthly: show “/mo” (or the equivalent used by the reference) if present in the reference UI.
- For Setup: do not show “/mo”.

### Card content mapping

Each of the 3 cards maps to one Section 1 plan object:

- Plan name → main title
- Optional badge (if present) → badge label
- Best for → short supporting line
- “What’s included” bullets → bullet list
- CTA button:
  - Label: “Book a Call”
  - Link: `book.html` (relative to current page)
  - Must work from niche pages (likely `../book.html`)

## Section 2 (no-toggle variant)

### No toggle

- The toggle must not render at all.

### Card structure

Each of the 3 cards maps to one Section 2 group object:

- Group label → main title
- One-liner → supporting sentence
- Plans list → bullet list (and optional category headings)

The plan list may include category headings (e.g., “Real Estate”) and normal plan lines. Category headings should render visually distinct (but consistent with design language).

### CTA button

- Label: “Book a Call”
- Link: `book.html` (relative to current page)

## Animations and fidelity

Non-negotiable:

- Sparkle effect must work and remain visually similar to reference.
- Toggle sliding animation must work (Section 1 only).
- Bullet lists must render consistently across all cards.

## CSS isolation constraints

The widget CSS must not break the existing site.

Minimum requirement:

- No global resets that affect `html`, `body`, `*`, headings, or `.container` outside the widget.
- Widget styles must be scoped to the widget root (recommended via a wrapper selector like `.ss-pricing`).

## Performance and robustness

- The widget must fail gracefully if:
  - page key is unknown
  - section is not `"1"` or `"2"`
- If a mount fails, it must not block the rest of the page scripts.
