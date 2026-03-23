# ExecPlan: Desktop Body Background and Single Marquee Load Timing

## Observed baseline

- Desktop homepage body sections were already resolving `assets/images/body_section_parallax/body-section-background-2025.webp`, but the rendered crop looked effectively blank because the visual content of that asset is concentrated near the top while desktop rules were centering it vertically.
- Browser evidence before the fix:
  - `#primary-site-links` and `section.parallax-section.bg-lines` resolved the body-section asset on desktop with `background-attachment: fixed`.
  - The rendered desktop capture showed mostly dark filler in the body section area.
- The single footer marquee is created by `src/js/marquee.js` only when the footer enters an `IntersectionObserver` root margin.
- The same module was still using the March 13 loading strategy that deferred marquee creation and treated marquee images as lazy-loaded content.
- Network evidence before the fix:
  - A pre-scroll network capture contained no marquee image requests before the footer-near observer fired.
  - A post-scroll network capture showed the marquee image burst only after the bottom section was approached.
- The unique image set behind `MARQUEE_IMAGES` totals about `12.6 MB` on disk across `78` WebP sources.

## Root cause

- Desktop background issue:
  - The body-section image is top-weighted, but desktop CSS was using a centered crop.
  - That centered crop landed on the darkest middle portion of the asset, which made the section look like it had no background image.
- Single marquee issue:
  - The single marquee waited too long to begin requesting its image set because it was mounted only when the footer observer tripped.
  - The animated strip is not a good fit for lazy loading because images that are about to slide into view need to be ready before they are visible.

## Changes made

- Updated `src/css/base/layout.css` so the base body-section background crop uses `background-position: center top`.
- Updated `src/css/base/typography.css` so the desktop fixed-background rule also uses `background-position: center top !important`.
- Updated `src/js/marquee.js` so the single footer marquee:
  - starts observing with a larger root margin (`2200px 0px`) to begin work earlier,
  - prewarms the first `12` marquee images when the observer fires,
  - creates the single-row marquee with `loading="eager"` on its images,
  - gives the leading image batch `fetchPriority="high"`,
  - leaves the double marquee behavior unchanged.
- Rebuilt:
  - `assets/css/styles.css`
  - `assets/js/app.js`

## Verification results

- Build verification:
  - `npm run build:css` passed.
  - `npm run build:js` passed.
- Desktop visual verification:
  - Desktop Playwright capture shows the homepage body sections using the intended magenta/blue body-section artwork on desktop.
  - Homepage load reported `0` console errors and `0` warnings.
- Single marquee verification:
  - Cache-busted Playwright check confirmed the mounted single marquee now resolves its leading image as `loading="eager"` with `fetchPriority="high"`.
  - Desktop footer capture shows the footer marquee rendered with images present.
- Mobile regression verification:
  - Cache-busted mobile Playwright check confirmed `body.parallax-stage-active === true`, `mobileStageCount === 1`, and `mobileLayerCount === 2`.
  - Mobile capture shows the mobile parallax presentation intact.

## Tradeoffs / follow-ups

- The single marquee now begins image work earlier and more aggressively than before to remove visible pop-in at the footer. That is a deliberate tradeoff in favor of bottom-of-page visual readiness.
- The single marquee still uses the original social-media WebP assets. If more reduction is needed later, the next step would be to move that strip onto dedicated derived marquee variants rather than the original sources.
