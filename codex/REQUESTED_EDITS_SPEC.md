<!-- FILE: codex/REQUESTED_EDITS_SPEC.md -->
# Requested Edits Spec (Codex Contract) — UI Fixes 1–4

This document is the **contract** for the current Codex run. Implement **only** what is listed here.

## Scope

In-scope (must implement):
1) Pricing color washout tuning (extremely important)
2) Pricing cards CTA alignment
3) `services.html` mobile image container padding
4) `index.html` “Our Services” cards icon/title layout

Out-of-scope (must not do):
- Any other UI polish, refactors, or content edits
- Any copy changes (including punctuation/capitalization)
- Any dependency upgrades
- Any accessibility or SEO work not required by these fixes

## Global constraints and conflict-handling

- Preserve the existing light-mode look and site design language.
- Conflict-handling priority (highest → lowest):
  1) Maintain light-mode vibe
  2) Increase visibility of blues/pinks
  3) Minimal change surface area
  4) Consistency across pages

## Required marker comments (must be added exactly)

These comments are used by repo validators. Place each marker adjacent to the change it refers to.

Pricing (in `pricing-widget/src/pricing-widget.css`):
- `SS_PRICING_SPEC: LIGHT_MODE_WASHOUT_TUNING_2025_12`
- `SS_PRICING_SPEC: CTA_BUTTON_ROW_ALIGNMENT_2025_12`

Services (in `src/css/pages/services.css`):
- `SS_SERVICES_SPEC: MOBILE_IMAGE_CONTAINER_TIGHT_WRAP_2025_12`

Home (in `src/css/pages/home.css`):
- `SS_HOME_SPEC: SERVICE_ICON_TITLE_INLINE_2025_12`

## Requested Edit 1 — Pricing color washout tuning

### Targets

- Must cover pricing sections on:
  - `index.html`
  - `services.html`
  - `niches/*.html`

### What to understand first

The pricing widget defaults to dark styling; “light mode” styling is applied by page attribute selectors in:
- `pricing-widget/src/pricing-widget.css`
  - `.ss-pricing[data-ss-pricing-page="index.html"], ...`
  - `.ss-pricing[data-ss-pricing-page="services.html"], ...`
  - `.ss-pricing[data-ss-pricing-page^="niches/"], ...`

The “washed out” look typically comes from:
- a very opaque white/near-white linear gradient layer
- low-opacity blue/pink radial gradient layers
- additional layers (gridlines/glow/surface) that can mute color

### Required change

Dial down washout so the blue and pink background washes in pricing sections are **significantly more visible** while staying clearly light-mode.

Use the smallest possible change surface:
- prefer adjusting the existing light-mode `--ss-pricing-bg` gradient alphas
- avoid adding new decorative layers unless strictly necessary

### Acceptance criteria

Visual:
- On desktop and mobile, the pricing section background shows clearly visible blue and pink washes (not just “almost white”).
- The section still reads as light-mode (no dark-mode look, no neon saturation).

Deterministic (enforced by validator):
- In the light-mode `--ss-pricing-bg` definition, the gradient alpha values must fall within these ranges:
  - White linear gradient alphas:
    - start alpha in [0.88, 0.95]
    - mid alpha in [0.84, 0.92]
    - end alpha in [0.80, 0.88]
  - Blue radial gradient alphas (circle at 20% 18%):
    - 0% stop alpha in [0.34, 0.55]
    - 45% stop alpha in [0.20, 0.40]
  - Pink radial gradient alphas (circle at 82% 12%):
    - 0% stop alpha in [0.30, 0.50]
    - 45% stop alpha in [0.18, 0.35]

### Verification

- Rebuild pricing widget so `assets/css/pricing-widget.css` updates.
- Run: `node scripts/validate-pricing-ui-tuning.js --strict`
- Manual check:
  - `index.html` pricing sections 1 and 2
  - `services.html` pricing sections 1 and 2
  - at least one niche page pricing sections 1 and 2

## Requested Edit 2 — Pricing cards CTA alignment

### Requirement

For every row of 3 pricing cards, the “Book a Call” buttons must align horizontally (same vertical position across the row).

This applies to:
- section 1 (plan cards)
- section 2 (group cards)

### Required implementation approach (to keep it deterministic)

Use a CSS layout strategy that anchors the CTA location consistently across cards.

Default approach for this repo:
- Anchor `.ss-pricing__cta` using `margin-top: auto;`
- Ensure `.ss-pricing__includes` does **not** use `margin-top: auto;` (it prevents CTA alignment)

If a different strategy is used, it must still satisfy the deterministic validator expectations.

### Acceptance criteria

Visual:
- At desktop widths where pricing cards are in a 3-column grid, the CTA buttons align across the row.

Deterministic (enforced by validator):
- `.ss-pricing__cta` includes `margin-top: auto;`
- `.ss-pricing__includes` does not include `margin-top: auto;`
- Both required pricing marker comments are present.

### Verification

- Rebuild widget.
- Run: `node scripts/validate-pricing-ui-tuning.js --strict`
- Manual check on `index.html` and `services.html` at desktop widths.

## Requested Edit 3 — services.html mobile image container padding

### Requirement

On mobile, the image containers above these services cards have too much empty vertical padding/space; the containers do not tightly wrap the images:

- “Where revenue (and time) quietly leaks away.”
- “Start small. Ship fast. Expand when it is working.”
- “General Service Lines:”
- “What changes once the basics are automated”

Fix so the containers wrap tightly around images with no extra empty space above/below.

### Expected root cause

`src/css/pages/services.css` contains overrides that can force `.service-image` to stretch (e.g., `height: 100%` + flex), which breaks the tighter mobile behavior defined in `src/css/components/cards.css`.

### Acceptance criteria

Visual:
- On mobile widths, the image area hugs the image (no tall container with dead space).
- Desktop layout remains unchanged.

Deterministic:
- `src/css/pages/services.css` contains the required marker comment.
- A mobile (`max-width: 768px`) override exists that:
  - makes the image container wrap content (e.g., `height: auto` and `display: block`)
  - forces the image to `width: 100%` and `height: auto`

### Verification

- Rebuild site CSS so `assets/css/styles.css` updates.
- Run: `node scripts/validate-requested-edits.js --strict`
- Manual check on `services.html` at mobile viewports.

## Requested Edit 4 — index.html “Our Services” cards icon/title layout

### Requirement

In the “Our Services” cards on `index.html`:

- icons stay top-left
- titles are placed directly to the right of icons on the same row (inline)

### Acceptance criteria

Visual:
- Icon + title share a row, with the icon on the left and title immediately to its right.
- Works on desktop and mobile.

Deterministic:
- `src/css/pages/home.css` contains the required marker comment.
- `.packages-grid .service-title` uses a flex row layout.
- `.packages-grid .service-icon-img` no longer enforces a bottom margin that stacks it above the title (margin-bottom must be 0 via rule or override).

### Verification

- Rebuild site CSS.
- Run: `node scripts/validate-requested-edits.js --strict`
- Manual check on `index.html`.
