# ExecPlan: Mobile Footer Overscroll Background Reveal Fix

## Observed baseline

- The white footer (`.site-footer`) is the final opaque section on every page.
- On iPhone-style elastic bottom overscroll, the whole root scroll container moves upward temporarily. That exposes whatever sits behind the document bottom, which in this site is the shared page/parallax background.
- The previous safe-area-only footer padding fix was insufficient because it increased the visible footer box, but it did not extend the footer background beyond the actual document end.

## Root cause

- The issue is not that the footer detaches from layout. The elastic overscroll is stretching the root scrolling surface.
- Because the document ended exactly at the footer edge, the overscrolled area below the page revealed the body/parallax background behind the document instead of more footer background.

## Changes made

- Added a mobile-only hidden footer bleed in `src/css/components/footer.css`:
  - `--footer-overscroll-bleed: clamp(96px, 18vh, 180px);`
  - `padding-bottom: calc(3rem + var(--safe-area-bottom) + var(--footer-overscroll-bleed));`
  - `margin-bottom: calc(-1 * var(--footer-overscroll-bleed));`
- This extends the white footer background past the document end without changing the footer's resting visual position, so elastic overscroll reveals more footer background instead of the page background image.
- Rebuilt `assets/css/styles.css`.

## Verification

- `npm run build:css` passed.
- The mobile footer bleed rules are present in both source and compiled CSS.
- The change is scoped to the shared mobile footer media query and does not alter desktop footer styles.

## Remaining manual check

- Confirm on the iPhone that reaching and elastic-overscrolling the page bottom no longer reveals the body background behind the footer, and that the footer appears to stretch/hold to the bottom during the bounce.
