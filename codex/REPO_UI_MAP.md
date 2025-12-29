<!-- FILE: codex/REPO_UI_MAP.md -->
# Repo UI Map (Grounding Reference)

This file is a quick “where things live” map for the Requested Edits (1–12). Paths and selectors below are taken from the repository.

## Pages

- Home: `index.html` (body class `page-home`)
- About: `about.html` (body class `page-about`)
- Services: `services.html` (body class `page-services`)
- Book: `book.html` (body class `page-book`)
- Contact: `contact.html` (body class `page-contact`)
- Niches: `niches/*.html` (body class `page-niche`)

## Key UI systems and where they are implemented

### Pricing widget background (Edit #1)

- Source CSS: `pricing-widget/src/pricing-widget.css`
  - Light-mode “white background” stack is defined under `.ss-pricing[data-ss-pricing-page="..."]` rules.
- Built CSS output: `assets/css/pricing-widget.css`
- Build: `cd pricing-widget && npm run build`

Validation:
- `scripts/validate-pricing-ui-tuning.js`

### Service-row “image next to cards” layouts (Edits #2 and #7)

Markup pattern:
- `.service-row` container with `.service-image.neon-card` holding an `<img class="service-img">` (services/niches) or plain `img` (about).

Relevant files:
- About: `about.html` (service-image blocks)
- Services: `services.html` (General_Services_*.webp images)
- Niches: `niches/*.html` (per-niche service images)

Shared component styling:
- `src/css/components/cards.css` (shared `.service-image` and image rules)

Page-specific styling:
- Services page: `src/css/pages/services.css`
- Niche reference: `src/css/pages/estate-agents.css` (contains the tight neon border / contain-fit approach)

### Section subtitle styling (Edit #3)

- Primary selector: `.section-subtitle`
- Source file: `src/css/base/layout.css`
- Color tokens: `src/css/base/variables.css`

### Hero shader + copy + CTAs (Edits #4, #5, #6, #12b, #12c)

Hero CSS:
- `src/css/components/hero.css`
  - `.hero.title-band` is the shader hero variant used across pages.
  - CTA layout is currently inconsistent between pages (index vs services/niches).

Shader JS:
- `src/js/hero-shader.js` (canvas)

CTA markup:
- Services & niches: hero contains `<div class="cta-buttons">` with 2 buttons
- Index: hero currently uses 2 `<a class="btn ...">` without a `.cta-buttons` wrapper

### Premium lightbox used by marquee images (Edit #11f)

- JS source: `src/js/marquee.js`
- Lightbox element ID: `premium-lightbox`
- Marquee images open lightbox by calling an internal `openLightbox(src)` function

Index services tiles must open the same lightbox:
- Likely requires a small shared hook that reuses the same DOM structure (`#premium-lightbox`)

### Stats / counters (Edits #9 and #10)

- Markup: `.stats .number[data-target="..."]` and optional `data-plus`
- JS animation: `src/js/stats.js`
- Styling: `src/css/components/stats.css`

About stats section:
- `about.html` under “Experience by the Numbers”

Home stats section:
- `index.html` under “No hype. Just measurable wins.”

### Calendly embed (Edit #8)

- Page: `book.html`
- External script currently referenced: Calendly widget JS
- Optimization opportunities: preload/early fetch in head, keep CSS preload

### Mobile header/menu behavior (Edit #12a)

- JS logic: `src/js/header-nav.js`
  - Header indicator element: `#header-indicator`
  - Nav toggle button: `#nav-toggle`
  - Mobile panel/back button elements are created in JS

- CSS: `src/css/components/header.css`
  - Mobile panel uses `body.mobile-nav-open` + `.nav-backdrop` + `.mobile-nav-panel`

## Build & validation commands

Build:
- `npm run build:css`
- `npm run build:js`
- `cd pricing-widget && npm run build`

Verify:
- `bash scripts/codex.requested-edits.sh`

Serve for manual QA:
- `bash scripts/serve.sh`
