<!-- FILE: codex/PRICING_INTEGRATION_SPEC.md -->
# Pricing Widget Integration Spec (Static HTML + Embedded React)

This spec defines **where** and **how** to embed the pricing React widget into the existing static site **without** disturbing the rest of the layout.

All integration semantics must follow the embedding approach described in:

- `Embed_React_Guide.md`
- the referenced Medium embedding article

## Target pages

The canonical list is in:

- `scripts/pricing.constants.js`
- `codex/PRICING_COPY_MAP_SPEC.md`

Do not expand scope beyond those pages.

## DOM injection location (per page)

Each target page already contains:

- `<section id="pricing"> ... </section>`

Inside that section, there is placeholder content that must be replaced.

### Replace only the pricing placeholder

Allowed HTML changes are limited to:

1. Replace the placeholder content inside `<section id="pricing">` with the mount markup
2. Add one `<link>` tag for pricing widget CSS
3. Add one `<script>` tag for pricing widget JS

Everything else stays untouched.

## Mount markup (required)

Inside `<section id="pricing">`, insert exactly two mount containers:

- One for section 1 (toggle)
- One for section 2 (no toggle)

Example shape (attribute values must match each page):

- `<div class="ss-pricing" data-ss-pricing-page="services.html" data-ss-pricing-section="1"></div>`
- `<div class="ss-pricing" data-ss-pricing-page="services.html" data-ss-pricing-section="2"></div>`

Requirements:

- Both mounts must be inside the `<section id="pricing">`
- Both mounts must share the same `data-ss-pricing-page` (the current page path)
- `data-ss-pricing-section` must be `"1"` and `"2"` respectively

## Asset output contract (required)

The widget build must produce stable (non-hashed) files committed to:

- `assets/js/pricing-widget.js`
- `assets/css/pricing-widget.css`

Do not generate `pricing-widget.[hash].js` in `assets/`.

## HTML asset includes (required)

### Root pages

For `services.html`, the includes must use:

- `assets/css/pricing-widget.css`
- `assets/js/pricing-widget.js`

### Niche pages

For `niches/*.html`, the includes must use:

- `../assets/css/pricing-widget.css`
- `../assets/js/pricing-widget.js`

### Where to place tags

CSS:

- Add `<link rel="stylesheet" href="...assets/css/pricing-widget.css">` in `<head>`
- Place it after the existing site stylesheet include(s), so widget styles load after the site.

JS:

- Add `<script src="...assets/js/pricing-widget.js"></script>` near the end of `<body>` (alongside `assets/js/app.js`)
- The widget JS must mount after DOM is ready (either by script placement or by listening to DOMContentLoaded internally).

## Validation requirements

After implementation:

- `node scripts/validate-pricing-mounts.js` must pass.

This validator asserts:

- Every target page contains exactly two mounts inside `<section id="pricing">`
- Placeholder text is removed
- The correct asset includes exist with correct relative paths
- Hero shader canvas is still present
- Built widget assets exist on disk

## Integration safety notes

Do not:

- Move or remove the hero shader canvas or its containing section
- Change global CSS files in `assets/css/styles.css` except where absolutely necessary
- Rename existing site classes or restructure page layout outside `<section id="pricing">`
