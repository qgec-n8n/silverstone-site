# ExecPlan: Lightbox Open Lag Fix

## Observed baseline

- `src/js/marquee.js` handled every `.js-premium-lightbox` "Tap to expand" button.
- On click, that handler swapped `#lightbox-img` straight to the heavyweight `data-lightbox-src` or `data-lightbox-mobile-src` asset.
- Representative eCommerce service-card asset sizes on disk:
  - `assets/images/socialmedia/eComm_1.jpeg`: `6.6 MB` and identified by `file` as a `2528 x 1696` PNG payload with a `.jpeg` extension.
  - `assets/images/socialmedia/derived/eComm_1-960.jpg`: `60 KB`
  - `assets/images/socialmedia/eComm_1_Mobile.jpeg`: `6.6 MB`
  - `assets/images/socialmedia/derived/eComm_1_Mobile-768.jpg`: `84 KB`
- `closeLightbox()` in `src/js/marquee.js` removed the active class but left the previous image source in place.
- `src/js/gallery.js` still contained a separate lightbox implementation that blanked the modal image before waiting for a preload, even though `.js-gallery-lightbox` markup is no longer present in live HTML.

## Root cause

- The "Tap to expand" buttons were intentionally opening original full-resolution artwork rather than the already-rendered inline derivatives.
- Those originals are much larger than the inline images, so the modal had to wait for a new fetch and decode cycle on first open.
- Because `closeLightbox()` did not clear `#lightbox-img` in the service-tile flow, the previous modal image stayed attached to the DOM and could flash while the next target finished loading.
- The inactive gallery lightbox path had the same user-visible failure mode in a different form: it explicitly cleared the modal image and only populated it after an off-DOM preload completed.

## Changes made

- Updated `src/js/marquee.js` so the service-tile lightbox now:
  - resolves an immediate preview source from the already-rendered inline `<img>`
  - opens the modal with that preview source immediately
  - preloads the heavyweight lightbox target in the background and upgrades only when the requested image is ready
  - tracks a request id so a slower previous preload cannot overwrite a newer click
  - clears `#lightbox-img` on close so the old image cannot flash on the next open
  - warms the heavyweight target on `pointerenter`, `touchstart`, and `focus`
- Updated `src/js/gallery.js` with the same preview-first behavior so the dormant gallery lightbox code matches the active service-tile path.
- Rebuilt `assets/js/app.js` with `npm run build:js`.

## Verification results

- Build:
  - `npm run build:js` passed
- Clean runtime check on `http://127.0.0.1:4173/niches/ecommerce.html`:
  - Playwright console log on load: `0` errors, `0` warnings
  - Opening the first "Tap to expand" card set the modal source to `../assets/images/socialmedia/eComm_1.jpeg`
  - Closing the modal reset the modal source to an empty string
  - Opening the second "Tap to expand" card set the modal source to `../assets/images/socialmedia/eComm_2.jpeg`
- Preview-first fallback proof:
  - Temporarily changed the first trigger's `data-lightbox-src` to `/assets/images/does-not-exist.jpg?preview-check=1`
  - Clicking the trigger still opened the modal immediately with `assets/images/socialmedia/derived/eComm_1-640.avif`
  - This confirms the modal no longer depends on the heavyweight target arriving before anything is shown

## Before / after evidence

- Before:
  - first open had no already-loaded modal fallback; the modal waited on a heavyweight target fetch/decode
  - subsequent opens could reuse the previous `#lightbox-img` source until the next target finished
- After:
  - every open starts from the already-rendered inline image, so the modal has pixels immediately
  - the heavyweight lightbox target upgrades in the background when available
  - closing the modal clears stale image state, so an old image cannot appear before the next one

## Tradeoffs / follow-ups

- The lightbox still upgrades to the original full-resolution asset when one is configured, so users keep the sharper expanded image without paying the blank-state penalty.
- Warming on hover/touch/focus keeps the change localized and avoids reintroducing eager page-load fetching for all heavy originals.
