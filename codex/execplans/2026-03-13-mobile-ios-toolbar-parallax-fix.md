# ExecPlan: Mobile iOS Transparent Toolbar and Parallax Fix

## Observed baseline

- All 36 HTML pages share the same `assets/css/styles.css`, the same `assets/js/app.js`, and the same `.hero.title-band` shell, so the reported bugs were shared-template issues rather than isolated page defects.
- No page used `viewport-fit=cover`; every viewport tag was `width=device-width, initial-scale=1.0`.
- The hero used dynamic viewport sizing (`100dvh`), which ties the hero box to the visible viewport rather than the stable/edge-to-edge iPhone viewport.
- Mobile parallax painted the body-section background twice:
  - globally on `body`
  - again via `.parallax-mobile-stage`
- The fixed mobile stage was resized from `visualViewport`, including a `visualViewport.scroll` listener and an iOS Safari overscan branch. That made the background layer follow browser-chrome changes rather than stay stationary.

## Source references used for the fix

- WebKit iPhone safe-area guidance: `viewport-fit=cover` plus `env(safe-area-inset-*)`
  - https://webkit.org/blog/7929/designing-websites-for-iphone-x/
- MDN viewport units reference: `dvh` tracks the dynamic viewport; `vh` maps to the large viewport
  - https://developer.mozilla.org/en-US/docs/Web/CSS/length
- MDN visual viewport guidance: the Visual Viewport API is for visible/device-fixed behaviors, not for sizing a stationary page background
  - https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API
- WebKit bug history showing third-party iOS browser viewport-unit inconsistencies still exist, so CSS units alone are not sufficient for Chrome/Google App hardening
  - https://bugs.webkit.org/show_bug.cgi?id=279998

## Root cause

- Safari hero gap: the hero box was sized to the dynamic/visible viewport (`100dvh`) and pages did not opt into edge-to-edge layout with `viewport-fit=cover`, so the hero could end above Safari’s transparent toolbar area on first paint.
- Safari/Chrome/Google App background movement and flicker: the mobile background layer was both duplicated and tied to `visualViewport` changes, so the “stationary” body background effectively behaved like browser-chrome-following UI.

## Changes made

- Added `viewport-fit=cover` to all 36 HTML viewport meta tags.
- Added a shared `viewport-metrics` runtime that sets `--mobile-stable-vh` from stable viewport measurements and never shrinks it on `visualViewport.scroll`.
- Added shared CSS vars:
  - `--safe-area-top`
  - `--safe-area-bottom`
  - `--header-safe-offset`
  - `--mobile-stable-vh`
- Updated the shared hero so mobile uses a stable minimum height (`var(--mobile-stable-vh, 100vh)`) instead of `100dvh`.
- Updated the hero shader to use `ResizeObserver` so the canvas follows CSS-driven hero height changes.
- Removed mobile parallax stage sizing from `visualViewport`; the fixed stage is now sized by CSS and the stage no longer writes inline width/height values.
- Added `parallax-stage-active` so the fixed stage becomes the single mobile parallax background source while active; `body` retains the image only as the fallback path.
- Added compositor-stability rules to the mobile parallax stage/layers to reduce iOS bottom-edge repaint flicker.
- Added safe-area spacing for fixed mobile UI surfaces:
  - site header
  - header indicator
  - mobile nav header/track/view
  - services overlay
  - cookie banner

## Verification and evidence

- `npm run build:js` passed.
- `npm run build:css` passed.
- Shared coverage checks:
  - `viewport-fit=cover` now appears in all 36 HTML files.
  - all 36 HTML files still reference the shared CSS bundle.
  - all 36 HTML files still reference the shared JS bundle.
  - built JS no longer contains the parallax `visualViewport.scroll` sizing path.
- Representative mobile DOM checks with local server + headless Chrome at iPhone width:
  - `index.html`, `services.html`, `book.html`, `blog.html`, `niches/estate-agents.html`, and `blog/ai-receptionist-small-business-2026.html` all render:
    - the updated viewport meta tag
    - `.hero.title-band`
    - `body.parallax-stage-active` when parallax sections are present
    - `.parallax-mobile-stage` without inline width/height sizing
  - `privacy-policy.html` renders the updated viewport meta tag and hero shell without a parallax stage, which matches its no-parallax structure.
- Desktop sanity check:
  - headless desktop DOM for `index.html` did not contain `.parallax-mobile-stage` or `body.parallax-stage-active`.

## Remaining manual acceptance checks

- Real-device iPhone 14 validation is still required for the exact Safari/Chrome/Google App toolbar behavior:
  - Safari first-paint hero coverage beneath the transparent toolbar
  - stationary body-section background behind the toolbar while scrolling
  - no bottom-edge flicker as new content enters
  - Chrome and Google App toolbar expand/collapse without moving the body-section background

## Tradeoffs

- The safe-area handling was applied globally to the shared mobile chrome because `viewport-fit=cover` changes the entire edge-to-edge layout model, not only the hero/parallax sections.
- Headless Chrome does not expose the exact iPhone transparent-toolbar delta, so the local automated checks confirm code path changes and shared-page coverage, but not the final visual Safari/iPhone behavior itself.
