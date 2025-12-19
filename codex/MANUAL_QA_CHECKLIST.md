<!-- FILE: codex/MANUAL_QA_CHECKLIST.md -->
# Manual QA Checklist — Requested UI Fixes (1–5)

Run these checks after `bash scripts/codex.requested-edits.sh` passes.

## Setup

- Serve locally from repo root:
  - `python3 -m http.server 8000`
- Use DevTools responsive mode for mobile checks (e.g., 390×844).
- Test at least these pages:
  - `/index.html`
  - `/services.html`
  - `/about.html`
  - 2+ niche pages, e.g. `/niches/dentists.html`, `/niches/estate-agents.html`

## 1) Pricing “£” alignment (index/services/niches)

On each tested page with pricing:

- Toggle between billing modes (Monthly / Setup):
  - Confirm “£” sits on the same baseline as the digits for every price shown.
- Check both breakpoints:
  - Desktop (~1440px width)
  - Mobile (~390px width)
- Confirm there is no weird vertical “float” of the symbol during digit animation.

Pass condition:
- “£” alignment looks consistent and intentional across all pricing cards and modes.

## 2) Pricing background redesign (index/services/niches)

On each tested page with pricing:

- Background aesthetic:
  - Looks light-mode (bright surfaces) and premium/luxurious.
  - Clearly inspired by the site’s 2025 body-section background palette/vibe, but not visually identical.
- Sparkles:
  - Immediately noticeable on load (not faint).
  - Still visible when scrolling and when interacting with pricing toggle.
- “Book a Call” buttons:
  - Visually prominent and enticing (premium gradient, good contrast).
  - Hover/focus states look deliberate and accessible.
- Copy/layout/functionality:
  - Pricing layout unchanged.
  - CTA text remains exactly “Book a Call”.
  - Toggle behavior works exactly as before.

Pass condition:
- Pricing sections meet all aesthetic requirements with zero copy/layout/function changes.

## 3) Services mobile-only image/top-of-card pattern (services.html)

On `/services.html`:

- Desktop (~1440px):
  - Service rows continue to alternate image left/right as before.
- Mobile (~390px):
  - For each service row with an image:
    - Image appears above the corresponding text card.
    - Image is not embedded inside the text card.
  - No layout breakage:
    - No overlapping cards
    - No clipped images
    - Spacing feels consistent with niche pages

Pass condition:
- Mobile service rows match the niche-page pattern while desktop remains unchanged.

## 4) Stats icons on index + about

On `/index.html` and `/about.html`:

- Each stat card has an icon above the number.
- Icons render correctly (no missing glyph boxes).

Pass condition:
- All stat cards have icons, and icons appear above numbers.

## 5) Stats styling consistency (all target pages)

On `/index.html`, `/about.html`, `/services.html`, and 2+ niche pages:

- Icon color: green
- Number color: blue
- Label text under number: white

Pass condition:
- The above color rules hold everywhere without exceptions.

## Final sign-off

- All automated checks pass.
- All manual checks pass.
- No unrelated pages/components visibly regressed during spot-check browsing.
