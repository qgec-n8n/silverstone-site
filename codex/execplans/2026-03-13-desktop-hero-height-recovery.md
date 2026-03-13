# ExecPlan: Desktop Hero Height Recovery Without Mobile Changes

## Observed baseline

- The shared hero source in `src/css/components/hero.css` applies `min-height: var(--mobile-stable-vh, 100vh)` at the base `.hero` level, outside any mobile media query.
- The mobile viewport fix also changed the shared hero from a fixed viewport height (`height: 100svh; height: 100dvh;`) to `height: auto`.
- `src/js/hero-shader.js` sizes the canvas to the hero element, so any extra desktop hero height directly extends the shader surface.
- The global layout reset uses `box-sizing: border-box`, so restoring desktop hero height at the CSS box level is sufficient to bring the visual hero back to one initial viewport tall.

## Root cause

- The mobile stable-height variable was promoted into the shared desktop hero box sizing, and the old fixed desktop viewport height was removed.
- As a result, desktop heroes stopped being constrained to the initial viewport height on load, so the shader area extended farther down the page before the next section appeared.

## Changes made

- Removed the base `.hero` dependency on `--mobile-stable-vh`.
- Restored fixed viewport hero sizing only inside the shared desktop breakpoint:
  - `min-height: 100vh`
  - `height: 100svh`
  - `height: 100dvh`
- Left the mobile `.hero.title-band` stable-height rule unchanged so the iPhone transparent-toolbar fix remains intact.
- Left `viewport-metrics.js` and `hero-shader.js` unchanged because the regression source was isolated to shared CSS.

## Verification procedure

- Build CSS with `npm run build:css`.
- Confirm in source and built CSS:
  - base `.hero` no longer references `--mobile-stable-vh`
  - desktop breakpoint restores fixed viewport hero sizing
  - mobile `.hero.title-band` still uses `min-height: var(--mobile-stable-vh, 100vh)`
- Desktop regression checks:
  - inspect `index.html`, `services.html`, `about.html`, `book.html`, `contact.html`, and `blog.html` at widths `>= 769px`
  - verify the hero height matches the initial viewport and the next body section appears as soon as scrolling begins
- Mobile non-regression checks:
  - inspect representative hero pages at iPhone 14 portrait width
  - verify the stable mobile hero height path is still active and the earlier mobile toolbar/parallax fix remains in place

## Verification results

- `npm run build:css` passed and rebuilt `assets/css/styles.css`.
- Source verification:
  - `src/css/components/hero.css` base `.hero` no longer references `--mobile-stable-vh`
  - desktop breakpoint now restores `height: 100svh; height: 100dvh`
  - mobile `.hero.title-band` still uses `min-height: var(--mobile-stable-vh, 100vh)`
- Runtime verification with headless Google Chrome against `http://127.0.0.1:4173`:
  - Desktop at `1440x900`: `index.html`, `services.html`, `about.html`, `book.html`, `contact.html`, `blog.html`, and `blog/ai-receptionist-uk-costs-roi-2026.html` all rendered `.hero.title-band` at `900px`, matching `window.innerHeight`, with `nextGap: 0`
  - Desktop shader sizing: representative shader pages (`index.html`, `services.html`, `about.html`, `book.html`, `contact.html`, `blog.html`) all rendered `#hero-shader-canvas` at the same height as the hero
  - Mobile emulation using iPhone 14 metrics: `index.html`, `services.html`, `about.html`, `book.html`, `contact.html`, and `blog.html` all kept the mobile stable-height path active with `rootStableVh: 844px` and hero/canvas height `844px` while `window.innerHeight` was `664px`

## Notes

- This is intentionally CSS-only to minimize risk and avoid touching the mobile runtime that currently hardens iPhone toolbar behavior.
