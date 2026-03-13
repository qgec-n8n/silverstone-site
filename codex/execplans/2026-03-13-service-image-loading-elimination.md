# ExecPlan: Service and Innovation Gallery Image Loading Elimination

## Observed baseline

- `services.html` contained 15 manual `<link rel="preload" as="image">` tags for Innovation Gallery assets totaling about `50.7 MB`, including several `6-7 MB` mobile JPEGs.
- `src/js/gallery.js` emptied `#neural-grid`, rebuilt the gallery at runtime, and marked every injected gallery image `loading="eager"` with `fetchpriority="high"`.
- `src/js/marquee.js` preloaded 78 marquee images on mobile and injected marquee images with `loading="eager"` on both `services.html` and `niches/*.html`.
- `services.html` still pointed its inline card images at full-size desktop JPEGs totaling about `20.9 MB` across the four card slots.
- Representative niche inline image totals before the fix:
  - `niches/ecommerce.html`: `19.8 MB`
  - `niches/trades-virtual-office.html`: `20.0 MB`
  - `niches/physios-chiropractors.html`: `13.9 MB`
  - `niches/hospitality.html`: `8.7 MB`
- `scripts/optimize-images.js` only converted `.jpg`/`.png` to WebP and did not generate responsive derivatives or include `.jpeg`.

## Root cause

- The browser was being forced to fetch far more image bytes than the rendered slots required.
- `services.html` was especially expensive because it combined:
  - large inline service JPEGs
  - 15 heavy gallery preloads
  - a JS gallery rebuild that eagerly requested the curated gallery set
  - eager marquee loading and mobile marquee preloading
- The niche pages also overfetched by using one full-resolution landscape file and one full-resolution portrait file per card instead of responsive display variants.
- Because the gallery was discovered only after JS rebuilt it, the browser could not schedule the first visible gallery tiles as early as it could from static HTML.

## Changes made

- Replaced `scripts/optimize-images.js` with a targeted derivative pipeline that:
  - includes `.jpeg` inputs
  - generates deterministic display variants under `assets/images/socialmedia/derived/`
  - outputs AVIF/WebP/JPEG variants for the targeted service-card and gallery assets
  - produced `492` derived files on build
- Updated `services.html` service-card `<picture>` blocks to use derived AVIF/WebP/JPEG variants with width-descriptor `srcset`, concrete `sizes`, eager loading, async decoding, and `fetchpriority="high"` only on the first service card.
- Updated every targeted `niches/*.html` service-card `<picture>` block with the same responsive-source strategy and lightbox source attributes.
- Added `data-lightbox-src` plus `data-lightbox-mobile-src` to the service-card triggers so the lightbox still opens the original full-resolution artwork for the active art direction.
- Removed the 15 raw image preload tags from `services.html`.
- Replaced the old static Innovation Gallery markup in `services.html` with the same curated `premium-tile` set that the old JS used to inject, now rendered directly in HTML.
- Rewrote `src/js/gallery.js` to bind lightbox behavior only; it no longer clears or rebuilds the gallery DOM.
- Updated `src/js/marquee.js` to:
  - remove the mobile marquee preload path
  - set marquee images to `loading="lazy"` and `decoding="async"`
  - initialize the single/double marquee only when near the viewport via `IntersectionObserver`
  - continue opening lightbox images from explicit full-resolution sources when present
- Rebuilt `assets/js/app.js`, `assets/css/styles.css`, and generated the new derived assets with `npm run build`.

## Verification results

- Build:
  - `npm run build` passed
  - `npm run build:js` reran cleanly after the marquee observer fix
- Services page runtime checks with headless Chrome:
  - initial DOM: `preloads=0`, `premiumTiles=15`, `neuralCards=0`, `doubleMarquee=0`
  - desktop `currentSrc` values resolve to derived AVIF assets, e.g. `General_Services_1-640.avif`
  - mobile `currentSrc` values resolve to derived AVIF assets, e.g. `General_Services_1_Mobile-768.avif`
  - after scrolling near the gallery/footer, `doubleMarquee=1`
- Niche runtime checks with headless Chrome:
  - `niches/estate-agents.html` initial `singleMarquee=0`
  - after scrolling near the footer, `singleMarquee=1`
  - desktop `currentSrc` resolves to derived AVIF assets, e.g. `Real_Estate_1-640.avif`
- Lightbox verification:
  - desktop service-card lightbox opens the full-resolution desktop original (`General_Services_1.jpeg`)
  - mobile service-card lightbox opens the full-resolution mobile original (`General_Services_1_Mobile.jpeg`)
  - gallery lightbox opens the configured full-resolution gallery original (`General_Services_2B_Mobile.jpeg`)
- Parallax non-regression check at mobile viewport:
  - `services.html`: `.parallax-mobile-stage` present and `body.parallax-stage-active=true`
  - `niches/estate-agents.html`: `.parallax-mobile-stage` present and `body.parallax-stage-active=true`

## Before / after evidence

- `services.html` desktop eager payload for targeted visible images:
  - before: about `71.6 MB` (`20.9 MB` inline service JPEGs + `50.7 MB` gallery preloads)
  - after: about `0.14 MB` (`0.04 MB` service AVIFs + `0.10 MB` first six gallery AVIFs)
- `services.html` mobile eager payload for targeted visible images:
  - before: same `50.7 MB` gallery preload burden plus large original mobile assets
  - after: about `0.24 MB` (`0.10 MB` service AVIFs + `0.14 MB` first six gallery AVIFs)
- `niches/ecommerce.html` targeted service-card payload:
  - before: about `19.8 MB`
  - after desktop: about `0.04 MB`
  - after mobile: about `0.07 MB`

## Research references used

- https://web.dev/learn/performance/image-performance
- https://web.dev/articles/browser-level-image-lazy-loading
- https://web.dev/articles/preload-responsive-images
- https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images
- https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/fetchPriority

## Remaining manual acceptance checks

- Scroll `services.html` and representative heavy niche pages on actual desktop and mobile hardware to confirm there is no visible image pop-in during human-paced scrolling.
- Confirm the marquee still appears at the intended moment visually on the live site.
