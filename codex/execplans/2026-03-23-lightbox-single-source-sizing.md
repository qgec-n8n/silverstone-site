# ExecPlan: Tap-to-Expand Lightbox Single-Source Sizing

## Observed baseline

- The live "Tap to expand" buttons are handled by `src/js/marquee.js` via `.js-premium-lightbox`.
- Services and niche pages provide explicit `data-lightbox-src` / `data-lightbox-mobile-src` values that point to heavyweight original artwork.
- Reproduction on `services.html` showed:
  - the clicked tile image resolved to a derived asset such as `assets/images/socialmedia/derived/general-services-1-640.avif`
  - the modal immediately opened from that tile preview
  - the modal then upgraded to the explicit original `assets/images/socialmedia/general-services-1.png`
- That two-stage source change was the user-visible bug.
- The shared lightbox CSS also allowed the tile modal to grow close to full-screen, which was larger than requested for the tap-to-expand tiles.

## Root cause

- The March 20 lightbox behavior intentionally used a preview-first flow:
  - open instantly from the tile’s current image
  - preload the explicit original
  - upgrade the modal when that original finished loading
- That solved blank modal lag, but it preserved a visible second render for tiles that define explicit original lightbox targets.
- The tile lightbox used the same generic max-size rules as the marquee/gallery lightbox, so the opened tile expanded much more than “slightly larger”.

## Changes made

- Updated `src/js/marquee.js` so the tap-to-expand tile lightbox:
  - resolves to a single displayed source
  - prefers the already-rendered tile image (`currentSrc`) instead of upgrading to the explicit original
  - handles string-based marquee image triggers safely
  - applies trigger-relative lightbox sizing only for `.js-premium-lightbox` buttons
  - clears those sizing variables again on close
- Updated `src/css/features/marquee.css` so tile-triggered lightboxes respect the trigger-relative width/height caps through `premium-lightbox--tile`.
- Rebuilt:
  - `assets/js/app.js`
  - `assets/css/styles.css`

## Verification results

- Build verification:
  - `npm run build:css` passed.
  - `npm run build:js` passed.
- Fresh browser verification on `services.html`:
  - the first tile kept the same modal `src` from `t=0` through `t=2000ms`
  - modal source remained `derived/general-services-1-640.avif`
  - modal width stayed near the clicked tile width instead of expanding to the previous near-fullscreen size
- Fresh browser verification on `niches/ecommerce.html`:
  - tile `currentSrc` and modal `src` both resolved to `derived/eComm_1-640.avif`
  - modal sizing remained slightly larger than the clicked tile
- Regression verification:
  - clicking a bottom marquee image on `index.html` still opened the shared lightbox successfully

## Tradeoffs / follow-ups

- Tap-to-expand tiles now prioritize instant, single-source display over loading the full original artwork in the modal.
- The dormant `.js-gallery-lightbox` code path in `src/js/gallery.js` still uses the older preview-upgrade model, but no live HTML currently binds that selector.
