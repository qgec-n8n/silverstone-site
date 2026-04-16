# ExecPlan: Desktop Hero CTA Fit

## Observed baseline

- Target pages: `index.html`, `services.html`, `pricing.html`, and all `services/*.html` pages.
- Desktop hero sizing is fixed to the initial viewport through `height: 100svh; height: 100dvh`, which must be preserved so the shader canvas remains one viewport tall.
- The desktop hero content panel was top-positioned through `.hero.title-band` padding plus a desktop-only `.content` top margin.
- Niche service pages receive an additional desktop secondary pricing CTA from `src/js/pricing-deeplinks.js`, so their hero CTA row contains one primary button and two secondary buttons at runtime.
- Fresh local Playwright reproduction against `http://localhost:4173` found:
  - `1440x900`: 2 of 12 target pages overflowed; worst was `/services/fitness-coaches.html` by `25.6px`.
  - `1366x768`: 9 of 12 target pages overflowed; worst was `/services/fitness-coaches.html` by `159.1px`.
  - `1280x720`: 10 of 12 target pages overflowed; worst was `/services/fitness-coaches.html` by `180.4px`.
  - `1024x600`: all 12 target pages overflowed; worst was `/services/physios-chiropractors.html` by `335.4px`.

## Root cause

- The desktop panel used narrow width and large typography/button sizing, causing long service-page copy and CTA labels to wrap vertically.
- The desktop CTA flex layout allowed all buttons to wrap as separate tall rows, and the injected niche pricing CTA increased that stack.
- Because the panel was pinned from the top instead of centered within equal vertical hero padding, overflow appeared at the bottom of the initial viewport on shorter desktop windows.

## Changes made

- Kept desktop fixed hero viewport sizing unchanged.
- Changed the desktop `.hero.title-band` alignment to vertically center the left-positioned content panel with equal top and bottom padding.
- Widened the desktop hero content panel to reduce text and CTA wrapping while keeping it left-positioned and leaving shader animation visible behind and to the right.
- Reduced desktop hero-only CTA min-height, padding, font size, and letter spacing without changing the global `.btn` styles.
- Forced the primary CTA onto its own first row and allowed the secondary CTAs to sit side by side when they fit.
- Added desktop short-height rules at `max-height: 720px` and `max-height: 640px` to scale panel padding, typography, paragraph spacing, and CTA sizing down for shorter desktop viewports.
- No HTML copy changes were needed.

## Verification procedure

- Rebuild CSS with `npm run build:css`.
- Run local Playwright measurements for all target pages at:
  - `1440x900`
  - `1366x768`
  - `1280x720`
  - `1024x600`
- Confirm:
  - `.hero.title-band .content` top is not above the viewport.
  - `.hero.title-band .content` bottom is not below the viewport.
  - `.hero.title-band .cta-buttons` bottom is not below the viewport.
  - `.hero.title-band` and `#hero-shader-canvas` remain the same height as the viewport on desktop.
  - The hero content remains left-positioned.
  - The primary CTA is above every secondary CTA.
  - Secondary CTAs sit on the same row wherever the computed widths fit.
- Regression checks:
  - desktop console/page errors on target page load
  - representative desktop parallax state after scrolling
  - representative mobile hero/parallax path

## Verification results

- `npm run build:css` passed and rebuilt `assets/css/styles.css`.
- Source/bundle checks confirmed the new desktop rules are present in both `src/css/components/hero.css` and `assets/css/styles.css`.
- Browser verification against `http://localhost:4173` with the local-only Netlify RUM request stubbed:
  - `1440x900`: 0 failures, 0 console errors; worst remaining content overflow was `/services/ecommerce.html` at `-266.2px`.
  - `1366x768`: 0 failures, 0 console errors; worst remaining content overflow was `/services/ecommerce.html` at `-203.7px`.
  - `1280x720`: 0 failures, 0 console errors; worst remaining content overflow was `/services/estate-agents.html` at `-203.2px`.
  - `1024x600`: 0 failures, 0 console errors; worst remaining content overflow was `/services/ecommerce.html` at `-156.5px`.
- Across all verified desktop viewports:
  - hero content top and bottom stayed inside the viewport.
  - CTA container bottom stayed inside the viewport.
  - `.hero.title-band` and `#hero-shader-canvas` matched the viewport height.
  - the copy panel remained left-positioned.
  - the primary CTA stayed above the secondary CTAs.
  - secondary CTAs shared a row on all target pages where two secondary CTAs were present.
- Narrow desktop edge verification:
  - `769x600`: 0 fit failures on the hardest service-page samples; content width was `496px` and the panel right edge was `0.69` of viewport width.
  - `781x600`: 0 fit failures on the hardest service-page samples; injected secondaries shared a row where their computed widths fit. The longest `/services/hospitality.html` secondary CTA wrapped to a second secondary row, with the CTA container still `140.3px` above the viewport bottom.
- Desktop parallax regression check on `services.html` at `1280x720`:
  - 11 `.parallax-section` elements found.
  - first parallax section kept `background-attachment: fixed` before and after scrolling.
  - no `.parallax-mobile-stage` was present on desktop.
  - hero and shader canvas both measured `720px` high.
- Mobile regression check on `services.html` at `390x844`:
  - `--mobile-stable-vh` was `844px`.
  - hero and shader canvas both measured `848px` high.
  - mobile hero paragraph remained hidden.
  - `.parallax-mobile-stage` existed with an active layer.
  - `body.parallax-stage-active` and `.parallax-mobile-active` were present.

## Follow-up: top-left desktop panel

### Follow-up baseline

- After the first fit pass, the desktop hero panel fit but remained vertically centered:
  - `1440x900`: 0 fit failures; average content top was `272.8px`; max panel right edge was `0.53` of viewport width.
  - `1366x768`: 0 fit failures; average content top was `212px`; max panel right edge was `0.56` of viewport width.
  - `1280x720`: 0 fit failures; average content top was `214.1px`; max panel right edge was `0.59` of viewport width.
  - `1024x600`: 0 fit failures; average content top was `165.3px`; max panel right edge was `0.66` of viewport width.

### Follow-up root cause

- The first fit pass intentionally centered the panel vertically, but the follow-up direction requires the hero panel to sit directly beneath the fully expanded desktop header/menu area.
- The first fit pass also widened the panel to prevent overflow. That solved cropping but covered more shader than needed once copy was shortened.

### Follow-up changes

- Changed desktop `.hero.title-band` alignment from vertical centering to top-left placement below `--header-safe-offset`.
- Reduced desktop panel width to expose more shader while keeping the CTA and copy fit guarantees.
- Changed the desktop panel fill to a directional dark glass gradient with stronger blur/saturation and a quieter cyan glow, allowing slightly more shader color to show through without sacrificing text legibility.
- Applied the requested minimal copy reductions to hero paragraphs and service-page `hero-context` copy only.
- Kept mobile hero CSS, shader source, parallax source, CTA labels, and CTA destinations unchanged.

### Follow-up verification

- `npm run build:css` passed and rebuilt `assets/css/styles.css`.
- Browser verification against `http://localhost:4173` with the local-only Netlify RUM request stubbed:
  - `1440x900`: 0 failures, 0 console errors; worst remaining content overflow was `/services/hospitality.html` at `-392.1px`; max panel right edge was `0.46`.
  - `1366x768`: 0 failures, 0 console errors; worst remaining content overflow was `/services/hospitality.html` at `-276.1px`; max panel right edge was `0.49`.
  - `1280x720`: 0 failures, 0 console errors; worst remaining content overflow was `/services/ecommerce.html` at `-324.5px`; max panel right edge was `0.52`.
  - `1024x600`: 0 failures, 0 console errors; worst remaining content overflow was `/services/hospitality.html` at `-192.2px`; max panel right edge was `0.58`.
  - `769x600`: 0 failures, 0 console errors; worst remaining content overflow was `/services/gyms-fitness-studios.html` at `-205.9px`; max panel right edge was `0.62`.
  - `781x600`: 0 failures, 0 console errors; worst remaining content overflow was `/services/gyms-fitness-studios.html` at `-164.3px`; max panel right edge was `0.61`.
- Across all follow-up desktop checks:
  - panel top stayed below the required expanded-header clearance.
  - panel and CTA bottoms stayed inside the viewport.
  - `.hero.title-band` and `#hero-shader-canvas` matched viewport height.
  - primary CTAs remained above secondary CTAs.
  - secondary CTAs shared a row where their computed widths fit; the longest hospitality secondary CTA still wrapped on narrow desktop widths and remained fully visible.
  - computed panel styles included `linear-gradient(100deg, rgba(7, 12, 20, 0.66), rgba(7, 12, 20, 0.48))` and `blur(10px) saturate(1.45)`.
- Desktop parallax regression check on `services.html` at `1280x720`:
  - 11 `.parallax-section` elements found.
  - first parallax section kept `background-attachment: fixed` before and after scrolling.
  - no `.parallax-mobile-stage` was present on desktop.
  - hero and shader canvas both measured `720px` high.
- Mobile regression check on `services.html` at `390x844`:
  - `--mobile-stable-vh` was `844px`.
  - hero and shader canvas both measured about `848px` high.
  - mobile hero paragraph remained hidden.
  - `.parallax-mobile-stage` existed with an active layer.
  - `body.parallax-stage-active` and `.parallax-mobile-active` were present.

## Follow-up: slightly clearer premium glass

### Glass baseline

- The top-left panel used `linear-gradient(100deg, rgba(7, 12, 20, 0.66), rgba(7, 12, 20, 0.48))`, `backdrop-filter: blur(10px) saturate(145%)`, and `border: rgba(154, 201, 244, 0.22)`.
- The panel already fit and preserved legibility, but the right side of the glass could be made slightly clearer so more shader color shows through.

### Glass changes

- Changed the desktop panel background to `linear-gradient(105deg, rgba(7, 12, 20, 0.6), rgba(7, 12, 20, 0.38))`.
- Changed the desktop panel border to `rgba(196, 229, 255, 0.24)`.
- Changed the desktop panel backdrop filter to `blur(11px) saturate(155%)` and added matching `-webkit-backdrop-filter`.
- Kept panel size, position, CTA layout, copy, shader source, parallax source, and mobile hero CSS unchanged.

### Glass verification

- `npm run build:css` passed and rebuilt `assets/css/styles.css`.
- Representative and edge desktop browser verification against `http://localhost:4173` with the local-only Netlify RUM request stubbed:
  - `1440x900`: 0 failures, 0 console errors; worst remaining content overflow was `/services/hospitality.html` at `-392.1px`; max panel right edge was `0.46`.
  - `1280x720`: 0 failures, 0 console errors; worst remaining content overflow was `/services/hospitality.html` at `-324.5px`; max panel right edge was `0.52`.
  - `1024x600`: 0 failures, 0 console errors; worst remaining content overflow was `/services/hospitality.html` at `-192.2px`; max panel right edge was `0.58`.
  - `769x600`: 0 failures, 0 console errors; worst remaining content overflow was `/services/hospitality.html` at `-233.8px`; max panel right edge was `0.62`.
  - `781x600`: 0 failures, 0 console errors; worst remaining content overflow was `/services/hospitality.html` at `-192.2px`; max panel right edge was `0.61`.
- Computed style checks confirmed:
  - panel background was `linear-gradient(105deg, rgba(7, 12, 20, 0.6), rgba(7, 12, 20, 0.38))`.
  - panel backdrop filter was `blur(11px) saturate(1.55)`.
  - panel border color was `rgba(196, 229, 255, 0.24)`.
- Mobile regression check on `services.html` at `390x844`:
  - `--mobile-stable-vh` was `844px`.
  - hero and shader canvas both measured `848px` high.
  - mobile hero paragraph remained hidden.
  - `.parallax-mobile-stage` existed with an active layer.
  - `body.parallax-stage-active` and `.parallax-mobile-active` were present.
