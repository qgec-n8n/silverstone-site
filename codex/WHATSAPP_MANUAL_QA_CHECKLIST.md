<!-- FILE: codex/WHATSAPP_MANUAL_QA_CHECKLIST.md -->
# Manual QA Checklist — WhatsApp Button + Footer Phone

Complete this checklist before declaring the task done.

## Setup

- [x] Run `bash scripts/codex.whatsapp.sh` and confirm it prints PASS.
- [x] Serve the site locally (any static server is fine) and test in a modern browser.

## WhatsApp floating button (every page)

For each page in `codex/WHATSAPP_SPEC.md`:

- [x] Button is visible at bottom-right (desktop + mobile).
- [x] Button stays fixed when scrolling.
- [x] Button is not hidden behind the cookie banner (should be above it).
- [x] Clicking opens the WhatsApp chat flow in a new tab/window.
- [x] The chat targets the correct number (digits-only: 447418329232).
- [x] Hover state (desktop) feels intentional (subtle, not jarring).
- [x] Keyboard: can tab to the button and see a visible focus style.
- [x] Screen reader: the button announces a meaningful label (aria-label or equivalent).

## Footer Contact Us phone row (every page)

For each page in `codex/WHATSAPP_SPEC.md`:

- [x] Footer Contact Us section shows the phone row.
- [x] Visible text is exactly `+44 7418 329232`.
- [x] Phone row uses the phone icon (Font Awesome solid phone).
- [x] Phone row link uses `tel:+447418329232`.
- [x] Spacing in the footer remains clean (no overlaps, no broken columns).

## Regression quick-scan

- [x] No duplicate WhatsApp buttons on any page.
- [x] No duplicate phone rows in any footer.
- [x] No unexpected changes to other sections.
