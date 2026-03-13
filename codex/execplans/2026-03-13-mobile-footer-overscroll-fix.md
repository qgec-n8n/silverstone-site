# ExecPlan: Mobile Footer Overscroll Background Reveal Fix

## Observed baseline

- The white footer (`.site-footer`) is the final opaque section on every page.
- After the earlier `viewport-fit=cover` mobile fix, the hero and fixed mobile chrome were updated to respect `--safe-area-bottom`, but the shared footer was not.
- On mobile, `body` can still show the shared page background behind the document edges, so when the visible viewport shifts at the bottom of the page the footer can expose that background behind its lower edge.

## Root cause

- The footer background stopped at the content box bottom on mobile.
- Because the footer did not extend through the bottom safe area, mobile browser bottom-toolbar/overscroll movement could briefly reveal the page background behind the footer edge.

## Changes made

- Added a mobile-only footer bottom padding override in `src/css/components/footer.css`:
  - `padding-bottom: calc(3rem + var(--safe-area-bottom));`
- Rebuilt `assets/css/styles.css`.

## Verification

- `npm run build:css` passed.
- The footer safe-area padding is present in both source and compiled CSS.
- The change is scoped to the shared mobile footer media query and does not alter desktop footer styles.

## Remaining manual check

- Confirm on the iPhone that reaching and elastic-overscrolling the page bottom no longer reveals the body background behind the footer.
