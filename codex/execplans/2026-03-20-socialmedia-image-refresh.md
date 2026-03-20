# ExecPlan: Social Media Image Refresh for Services and Niche Pages

## Observed baseline

- The targeted service and niche `<picture>` blocks still referenced the previous asset families:
  - `services.html`: `General_Services_1`, `General_Services_2A`, `General_Services_2B`, `General_Services_3`
  - `niches/salons-barbers.html`: `Salon_2`, `Salon_3`
  - `niches/physios-chiropractors.html`: `Physio_1`, `Physio_3`
  - `niches/dentists.html`: `Dentists_1`, `Dentists_2`, `Dentists_3`
  - `niches/gyms-fitness-studios.html`: `Gyms_1`, `Gyms_2`, `Gyms_3`
  - `niches/fitness-coaches.html`: `Online_Coach_1`, `Online_Coach_2`, `Online_Coach_3`
- `scripts/optimize-images.js` generated responsive derivatives for the legacy `.jpeg` service image families only, so the newly added kebab-case `.png` sources would not be optimized or available through the existing AVIF/WebP/JPEG `<picture>` pattern.
- The newly added source PNGs are large enough to support the existing responsive widths:
  - desktop sources sampled at `2528x1696`
  - mobile sources sampled at `1696x2528`

## Root cause

- The HTML still pointed at the old image names, so the new artwork was never selected.
- The derivative pipeline did not know about the new kebab-case PNG sources, so simply swapping the filenames in HTML would have broken the optimized image flow used everywhere else on the site.

## Changes made

- Updated `scripts/optimize-images.js` to include the new PNG refresh sets:
  - `general-services-{1,2a,2b,3}`
  - `salon-{2,3}`
  - `physio-{1,3}`
  - `dentist-{1,2,3}`
  - `gyms-{1,2,3}`
  - `onlinecoach-{1,2,3}`
- Kept the existing responsive derivative widths unchanged:
  - desktop: `640`, `960`
  - mobile: `480`, `768`
- Updated only the targeted `<picture>` blocks and lightbox source attributes in:
  - `services.html`
  - `niches/salons-barbers.html`
  - `niches/physios-chiropractors.html`
  - `niches/dentists.html`
  - `niches/gyms-fitness-studios.html`
  - `niches/fitness-coaches.html`
- Left the untouched cards on mixed pages alone:
  - `Salon_1` remains unchanged
  - `Physio_2` remains unchanged

## Verification results

- Derivative generation:
  - `node scripts/optimize-images.js` completed successfully
  - targeted derivative count check returned `204` files for the refreshed source set
  - generated filenames now exist for all requested desktop/mobile variants, for example:
    - `assets/images/socialmedia/derived/general-services-1-640.avif`
    - `assets/images/socialmedia/derived/general-services-1-mobile-480.avif`
    - `assets/images/socialmedia/derived/dentist-1-640.avif`
    - `assets/images/socialmedia/derived/onlinecoach-3-mobile-768.webp`
- Static reference audit:
  - grep confirmed the targeted old references were replaced
  - unchanged intended references remained in place (`Salon_1`, `Physio_2`)
- Runtime browser verification on `http://127.0.0.1:4173`:
  - checked `12` page/viewport combinations across:
    - `services.html`
    - `niches/salons-barbers.html`
    - `niches/physios-chiropractors.html`
    - `niches/dentists.html`
    - `niches/gyms-fitness-studios.html`
    - `niches/fitness-coaches.html`
  - desktop verification:
    - each targeted card resolved `currentSrc` to the expected optimized desktop AVIF derivative
    - first parallax section computed `background-attachment: fixed`
    - no page errors
    - no `>=400` network responses
  - mobile verification:
    - after scrolling lazy cards into view, each targeted card resolved `currentSrc` to the expected optimized mobile derivative
    - `.parallax-mobile-stage` present
    - `body.parallax-stage-active === true`
    - parallax mobile sections active
    - no page errors
    - no `>=400` network responses

## Before / after evidence

- Before:
  - the refreshed pages still pointed at legacy service image names
  - the optimizer had no route to produce responsive derivatives for the new PNG sources
- After:
  - the targeted pages point at the new PNG originals for lightbox use
  - rendered images continue to load through optimized derived AVIF/WebP/JPEG variants
  - both desktop and mobile art direction resolve correctly for the refreshed images

## Tradeoffs / follow-up

- `node scripts/optimize-images.js` regenerates the whole derived asset set, not just the refreshed files. That is consistent with the repo’s existing image workflow, but it means future targeted refreshes will continue to rebuild all derivatives unless the pipeline is narrowed later.
