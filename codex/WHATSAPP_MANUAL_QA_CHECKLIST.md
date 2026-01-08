<!-- FILE: codex/WHATSAPP_MANUAL_QA_CHECKLIST.md -->
# Manual QA Checklist — WhatsApp Button + Footer Phone

Complete this checklist before declaring the task done.

## Setup

- [ ] Run `bash scripts/codex.whatsapp.sh` and confirm it prints PASS.
- [ ] Serve the site locally (any static server is fine) and test in a modern browser.

## WhatsApp floating button (every page)

For each page in `codex/WHATSAPP_SPEC.md`:

- [ ] Button is visible at bottom-right (desktop + mobile).
- [ ] Button stays fixed when scrolling.
- [ ] Button is not hidden behind the cookie banner (should be above it).
- [ ] Clicking opens the WhatsApp chat flow in a new tab/window.
- [ ] The chat targets the correct number (digits-only: 447418329232).
- [ ] Hover state (desktop) feels intentional (subtle, not jarring).
- [ ] Keyboard: can tab to the button and see a visible focus style.
- [ ] Screen reader: the button announces a meaningful label (aria-label or equivalent).

## Footer Contact Us phone row (every page)

For each page in `codex/WHATSAPP_SPEC.md`:

- [ ] Footer Contact Us section shows the phone row.
- [ ] Visible text is exactly `+44 7418 329232`.
- [ ] Phone row uses the phone icon (Font Awesome solid phone).
- [ ] Phone row link uses `tel:+447418329232`.
- [ ] Spacing in the footer remains clean (no overlaps, no broken columns).

## Regression quick-scan

- [ ] No duplicate WhatsApp buttons on any page.
- [ ] No duplicate phone rows in any footer.
- [ ] No unexpected changes to other sections.
