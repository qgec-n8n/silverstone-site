<!-- FILE: codex/MANUAL_QA_CHECKLIST.md -->
# Manual QA Checklist — Requested Edits 1–4

Use this checklist after validators pass. Do not skip mobile checks.

## Setup

- Serve the repo locally (any static server is fine) so assets load correctly.
- Test at least these viewport sizes:
  - Mobile: 375×667 (or 390×844)
  - Desktop: 1280×800 (or wider)

## 1) Pricing color washout tuning

On each page below, scroll to the pricing section(s) and confirm:
- background shows clearly visible blue + pink washes
- still feels light mode (not dark, not neon-heavy)
- card readability remains strong (text contrast still good)

Pages:
- `index.html` (pricing sections 1 and 2)
- `services.html` (pricing sections 1 and 2)
- One niche page under `niches/` (pricing sections 1 and 2)

## 2) Pricing cards CTA alignment

At desktop width where the grid is 3 columns:
- In each 3-card row, the “Book a Call” buttons align horizontally.
- Check both pricing sections:
  - section 1 plan cards
  - section 2 group cards

Repeat the check on:
- `index.html`
- `services.html`

## 3) services.html mobile image container tight wrap

At mobile width on `services.html`, verify these sections:
- “Where revenue (and time) quietly leaks away.”
- “Start small. Ship fast. Expand when it is working.”
- “General Service Lines:”
- “What changes once the basics are automated”

For each:
- the image container hugs the image (no large empty vertical space above/below)
- the image still renders crisply and preserves aspect ratio
- the desktop layout is unchanged (quick spot-check at desktop width)

## 4) index.html Our Services icon/title inline layout

On `index.html`, in the “Our Services” card grid:
- each card shows the icon at top-left
- the title sits directly to the right of the icon on the same row
- verify on both mobile and desktop widths

## Regression spot-checks (quick)

- No obvious layout breakage in the header/nav and footer on `index.html` and `services.html`.
- No missing CSS/JS assets (no 404s in browser network panel).
