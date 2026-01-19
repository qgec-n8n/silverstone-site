<!-- generated: 20260119_174154 -->
# Page inventory (inputs for scroll debugging)

This report is a lightweight map of which pages include which scripts/embeds.
Use it to confirm whether the scroll bug is global (shared assets) or page-specific.

## Table

| Page | body class | app.js | pricing-widget.js | external scripts | iframes | Notes |
|---|---|---:|---:|---|---:|---|
| index.html | page-home | no | no | (none) | 0 | \- |
| about.html | page-about | no | no | (none) | 0 | \- |
| services.html | page-services | no | no | (none) | 0 | \- |
| book.html | page-book | no | no | (none) | 0 | \- |
| contact.html | page-contact | no | no | (none) | 1 | has iframe(s) |
| niches/dentists.html | page-dentists page-niche | no | no | (none) | 0 | \- |
| niches/ecommerce.html | page-ecommerce page-niche | no | no | (none) | 0 | \- |
| niches/estate-agents.html | page-estate-agents page-niche | no | no | (none) | 0 | \- |
| niches/fitness-coaches.html | page-fitness-coaches page-niche | no | no | (none) | 0 | \- |
| niches/gyms-fitness-studios.html | page-gyms-fitness-studios page-niche | no | no | (none) | 0 | \- |
| niches/hospitality.html | page-hospitality page-niche | no | no | (none) | 0 | \- |
| niches/physios-chiropractors.html | page-physios-chiropractors page-niche | no | no | (none) | 0 | \- |
| niches/salons-barbers.html | page-salons-barbers page-niche | no | no | (none) | 0 | \- |
| niches/trades-virtual-office.html | page-trades-virtual-office page-niche | no | no | (none) | 0 | \- |

## Quick references

- If the bug reproduces on pages with app.js but without pricing-widget.js, focus on app.js sources (src/js/*) and global CSS (src/css/*).
- If the bug reproduces only on pages with pricing-widget.js, focus on pricing widget integration and wheel handling.

## Embedded script/iframe excerpts (first match per pattern)

### External scripts (absolute URLs)
- book.html: 221:  <script src="https://assets.calendly.com/assets/external/widget.js" async></script>

### Iframes
- contact.html: 159:            <iframe class="map-iframe"
