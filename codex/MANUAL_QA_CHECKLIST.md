<!-- FILE: codex/MANUAL_QA_CHECKLIST.md -->
# Manual QA Checklist — Requested Website Edits (1–8)

Complete this checklist after `bash scripts/codex.requested-edits.sh` is green.

## How to preview locally
- Run a static server from the repo root (example): `python3 -m http.server 8000`
- Open these pages in a browser:
  - `index.html`
  - `about.html`
  - `services.html`
  - `book.html`
  - `contact.html`
  - at least one niche page under `niches/` (e.g., `niches/real-estate.html`)

## 1) Counters slowed (index + about)
- [x] On `index.html`, counters animate noticeably slower than before (≈2.6s feel, not a “flash”).
- [x] On `about.html`, counters animate at the same slower speed.
- [x] Niche pages (stats with `data-counter="off"`) do not animate.

## 2) index.html disclaimer removed
- [x] The two disclaimer sentences are not visible anywhere on the homepage.

## 3) Grey→white changes + exceptions

### index.html
- [x] Muted/grey copy across non-CTA sections is now white.
- [x] This CTA subtitle remains grey (unchanged):
  - “Discover how personalised automation can drive efficiency, productivity and growth across your organisation.”
- [x] These three proof-card taglines remain grey (unchanged):
  - “Less manual admin and follow-up.”
  - “Automated reminders and confirmations.”
  - “Always-on first response.”

### about.html
- [x] Muted/grey copy across non-CTA sections is now white.
- [x] This CTA phrase remains grey (unchanged):
  - “Ready to streamline your business and unlock new possibilities? Our team is eager to help you succeed.”

### services.html
- [x] Muted/grey copy across non-CTA sections is now white.
- [x] For each service card: the paragraph(s) between the card title and bullet list remains the original grey (unchanged).
- [x] CTA banner at the bottom retains its original font colors (no unintended white conversion).

### niches/*.html (spot-check at least 1 niche)
- [x] Muted/grey copy across non-CTA sections is now white.
- [x] For each niche card: the paragraph(s) between the card title and bullet list remains the original grey (unchanged).
- [x] CTA banner at the bottom retains its original font colors (no unintended white conversion).

### book.html
- [x] Muted/grey copy across non-CTA sections is now white.
- [x] This CTA phrase remains grey (unchanged):
  - “We’re excited to learn about your business and design a solution that fits.”

## 4) contact.html phrase whitening
- [x] This sentence is white:
  - “Share a quick overview of your situation. We’ll come back with suggestions or next steps – no spam, no pressure to commit.”
- [x] Address block is white, including the email link:
  - Address: 4 Deacon Street, SE17 1GE, London, UK
  - Email: info@silverstone-ai.com (mailto link)
- [x] These two paragraphs are white:
  - “Immerse yourself in the Silverstone experience across our curated social channels—crafted for leaders who expect design-led intelligence, cinematic storytelling, and premium service cues at every touchpoint.”
  - “Follow us for prototype reveals, executive insights, and a first look at the intelligent automations shaping tomorrow’s operations.”

## 5) Pricing section styling (index/services/niches)
On each of: `index.html`, `services.html`, and one niche page:
- [x] Pricing section uses the site’s Blue / White / Grey font system (no black-on-white “default” look).
- [x] Background feels aligned with the site art (matches the vibe of `body-section-background-2025.webp`).
- [x] Neon blue + pink accents are present but still premium/professional (not loud).
- [x] Sparkles animation is clearly visible on the new background (noticeable, not faint).

## 6) Per-digit price animation (index/services/niches)
- [x] Toggling monthly/annual causes the price to animate per-digit (each digit scrolls/rolls).
- [x] The whole number does NOT slide as a single block.
- [x] If you enable reduced motion in the OS/browser, price updates without scrolling animation.

## Sign-off
- [x] Manual QA completed for requested edits (1–8).
