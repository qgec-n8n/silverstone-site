# ExecPlan: Mobile URL Bar Overlay Removal

## Observed baseline

- Mobile pages load `assets/js/app.js`, which calls `initUrlbarOverlay()` on `DOMContentLoaded`.
- `src/js/app.js` creates a fixed `.urlbar-overlay` element, listens to `window.visualViewport` resize/scroll events, and updates `--urlbar-overlay-height` to track mobile browser chrome occlusion.
- `src/css/base/layout.css` styles `.urlbar-overlay` as a fixed white translucent banner pinned to the bottom of the viewport.
- Runtime baseline captured with headless Chrome using an iPhone user agent against the local server:
  - `index.html` rendered `<div class="urlbar-overlay" aria-hidden="true"></div>` and set `--urlbar-overlay-height: 87px`.
  - `services.html` rendered the same overlay and the same root variable.
  - The mobile parallax layer also rendered (`.parallax-mobile-stage` present), so the bottom banner is independent of the parallax implementation.

## Root cause

- The white mobile banner is an explicit feature, not an accidental gap. It is injected by `initUrlbarOverlay()` and intentionally resized to follow the mobile URL bar using `visualViewport`, which is why it moves with browser chrome during scroll.

## Changes made

- Removed `initUrlbarOverlay()` and its invocation from `src/js/app.js`.
- Removed the now-unused `.urlbar-overlay` and `--urlbar-overlay-height` base layout CSS from `src/css/base/layout.css`.
- Rebuilt the generated bundles so `assets/js/app.js` and `assets/css/styles.css` match the source changes.

## Verification

- Rebuild commands:
  - `npm run build:js`
  - `npm run build:css`
- Runtime checks to perform after rebuild:
  - Headless mobile DOM check on `index.html` confirms `.urlbar-overlay` is absent.
  - Headless mobile DOM check on `services.html` confirms `.urlbar-overlay` is absent.
  - Headless mobile DOM checks still show `.parallax-mobile-stage`, confirming mobile parallax remains active.
  - Search checks confirm no remaining `urlbar-overlay` or `--urlbar-overlay-height` references in source or generated bundles.

## Tradeoffs

- This removes the overlay feature globally across the site, which matches the requested outcome.
- Safe-area handling remains unchanged for any existing components that use their own padding rules; only the dedicated bottom overlay feature was removed.
