<!-- FILE: codex/checklists/CHECKLIST.mobile-bg-gap.md -->
# Checklist: Mobile background coverage (no bottom gap)

Goal: On mobile, the background image (theme based on `body-section-background-2025.webp`) must cover the full viewport with **no visible gap** at the bottom.

Target pages:
- index.html
- about.html
- services.html
- book.html
- contact.html
- all `niches/*.html`

## Baseline capture (before changes)

- [ ] Start local server.
- [ ] Using a real mobile device if possible (plus Chrome mobile emulation):
  - [ ] Visit one root page + one niches page.
  - [ ] Capture a screenshot clearly showing the bottom gap (if present).
  - [ ] Run the diagnostic snippet from:
    - codex/snippets/SNIPPET.mobile-bg-gap-diagnostics.md
  - [ ] Save outputs to:
    - artifacts/output/mobile-gap-before.png (or similar)
    - artifacts/output/mobile-gap-metrics-before.txt

## Fix verification (after changes)

For each target page:

- [ ] Initial load (top of page):
  - [ ] No bottom-of-viewport gap.
- [ ] After scroll (force browser UI to change height):
  - [ ] Scroll slightly, then stop.
  - [ ] No bottom-of-viewport gap after address bar collapses/expands.
- [ ] Run diagnostic snippet again and save output:
  - artifacts/output/mobile-gap-metrics-after.txt
  - Confirm the element providing the background covers the viewport height.

## Parallax regression checks (mobile)

- [ ] Scroll through the page and confirm background theme transitions happen as expected:
  - The active parallax section should drive the background theme.
- [ ] Ensure there is no flashing/blanking of the background while scrolling.
- [ ] Ensure tap targets and scrolling still behave normally (no scroll-lock regressions).

## Parallax regression checks (desktop)

- [ ] On desktop, confirm parallax still behaves as before:
  - No console errors
  - Background attachment/visual effect still present
