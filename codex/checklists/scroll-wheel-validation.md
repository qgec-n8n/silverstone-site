<!-- FILE: codex/checklists/scroll-wheel-validation.md -->
# Scroll wheel validation checklist (page scroll + pricing internal scroll)

Use this checklist both **before** and **after** the fix.

Goal: confirm that page-level mouse wheel scrolling is restored everywhere, while the pricing widget’s internal scroll behavior remains unchanged.

---

## Test environment notes (fill in)

- OS:
- Browser + version:
- Mouse / trackpad type:
- Viewport(s) tested:
  - Desktop width (e.g., 1440px)
  - Mobile width (e.g., 390px) if relevant

---

## Baseline capture (before fix)

For each page:

- Confirm:
  - Page is scrollable with mouse wheel (expected: currently broken).
  - If scrollbars exist, note whether dragging the scrollbar works (optional diagnostic).
  - Note whether keyboard scroll works (optional diagnostic).

Record results in a table:

| Page | Wheel scrolls page? | Notes (what happens) |
|---|---:|---|
| /index.html |  |  |
| /about.html |  |  |
| /services.html |  |  |
| /book.html |  |  |
| /contact.html |  |  |
| /niches/<one example>.html |  |  |

---

## Wheel event / scroll container diagnostics (before fix)

On any affected page (preferably one WITHOUT the pricing widget, e.g., /about.html):

1) In DevTools console, confirm the scroll container:

   - `document.scrollingElement`
   - Computed styles of `html`, `body`, and `document.scrollingElement`:
     - `overflow-y`
     - `height`
     - `position`

2) Confirm whether wheel is being prevented:
   - Add a capture-phase wheel listener that logs:
     - event target
     - `defaultPrevented`
     - `cancelable`
     - `deltaY`
   - If `defaultPrevented` becomes true, identify who calls `preventDefault` (trace).

Use the snippet file:
- `codex/snippets/wheel-debug-snippet.md`

---

## After fix: required validations

### A) Page-level wheel scroll (all target pages)

Open each page and verify:
- Mouse wheel scroll moves the page up/down.
- Scroll does not “stick” at some sections.
- No new jitter, snap, or custom scrolling appears (should remain native).

| Page | Wheel scrolls page? | Pass/Fail | Notes |
|---|---:|---:|---|
| /index.html |  |  |  |
| /about.html |  |  |  |
| /services.html |  |  |  |
| /book.html |  |  |  |
| /contact.html |  |  |  |
| /niches/<at least 2 niche pages>.html |  |  |  |

### B) Protected behavior: pricing widget internal scroll (index + services)

On `/index.html` and `/services.html`:

1) Locate the pricing includes list that is supposed to scroll internally:
   - `.ss-pricing ... .ss-pricing__includes-body`

2) Verify internal scroll:
   - Hover cursor over the includes list.
   - Use mouse wheel:
     - The list should scroll internally (its `scrollTop` changes).
     - The page should not unexpectedly jump while the list is actively scrolling.

3) Boundary behavior:
   - Scroll the includes list all the way to top and bottom.
   - Observe what happens when continuing to wheel:
     - Record baseline behavior and confirm it is unchanged post-fix.
     - If behavior differs, treat it as a regression.

4) Verify no visual changes:
   - Spacing, card heights, and overflow presentation must look identical.

### C) Scroll-lock overlays still behave correctly (no regressions)

These components intentionally lock scroll *sometimes*. After the fix, verify they still work and still restore scroll afterward.

1) Mobile nav (test at mobile width):
   - Open mobile nav: page should not scroll behind it.
   - Close mobile nav: page wheel scroll should work immediately again.

2) Services overlay (if present):
   - Open overlay: scroll lock may engage (expected).
   - Close overlay: scroll must restore immediately.

3) Lightbox / gallery (if present on the page you test):
   - Open lightbox: scroll lock may engage (expected).
   - Close lightbox: scroll must restore.

### D) “No other changes” audit

- Confirm build still succeeds:
  - `npm run build:css`
  - `npm run build:js`

- If in a git repo:
  - Review `git diff --stat` and `git diff`.
  - Ensure changes are strictly necessary to restore wheel scroll.
  - Confirm no images/fonts/static assets changed.

- Run:
  - `bash scripts/codex.validate.scroll.sh`

---

## Acceptance criteria (must all be true)

- Wheel scroll works on:
  - index, about, services, book, contact, and niche pages.
- Pricing internal scroll on index/services is unchanged and still works.
- No visual/UX changes beyond restoring wheel scroll.
- Any code removed was proven to be the blocker (documented in ExecPlan).
