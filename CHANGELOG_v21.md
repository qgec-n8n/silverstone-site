# Silverstone v21 – Change Log

All changes applied per instructions, scoped to the referenced pages and verified to avoid cross-page side effects.

**assets/js/script.js** — Appended v21 equalizeServiceRows() for image/text midline alignment on Services page. (appended/edited; file now has ~155 lines).
**assets/css/styles.css** — Added v21 opacity override for Services text boxes (.service-content.neon-card). (appended/edited; file now has ~1759 lines).
**assets/css/styles.css** — Fallback: Disabled neon styles for .gallery-grid first two cards via CSS nth-child selector. (appended/edited; file now has ~1759 lines).
**assets/css/styles.css** — Forced 4-column grid and disabled animations for first two gallery cards on Services page. (appended/edited; file now has ~1759 lines).
**book.html** — Added body class 'page-book' for page-scoped CSS. (appended/edited; file now has ~126 lines).
**assets/css/styles.css** — Added Book page overrides to prevent cropping and to center calendar image. (appended/edited; file now has ~1759 lines).
**contact.html** — Added body class 'page-contact' for page-scoped CSS. (appended/edited; file now has ~120 lines).
**assets/css/styles.css** — Removed neon/animations for Contact form and Map via scoped overrides and adjusted spacing. (appended/edited; file now has ~1759 lines).
**assets/css/styles.css** — Added helpers for centering service images and letting JS do exact midline alignment. (appended/edited; file now has ~1759 lines).

## Detailed Notes
1. **Services page — Image alignment**
   - Implemented `equalizeServiceRows()` in `assets/js/script.js` to match each `.service-image` min-height to its sibling `.service-content.neon-card` and vertically center the image. Runs on `DOMContentLoaded` and `resize` for widths ≥ 768px. This achieves pixel-perfect midline matching without altering text box sizes or cropping images.
   - Added CSS helpers to ensure images are centered within wrappers; JS sets exact height for precision.

2. **Services page — Text box opacity**
   - Increased `.service-content.neon-card` background opacity from ~0.55 to **0.80**, improving legibility while keeping the neon circuit background faintly visible.

3. **Services page — Innovation Gallery**
   - Removed neon box/animations **only** for the **two leftmost images in the top row** by removing the `neon-card` class on the first two `.gallery-card` elements in `services.html`. If markup changes in the future, a CSS fallback disables neon on `:nth-child(-n+2)`.
   - Forced a visually pleasing **4‑column grid** at desktop (`≥1024px`) with equal spacing. Cards remain responsive below that width.

4. **Book page — Calendar image**
   - Added `page-book` body class and CSS overrides to **remove cropping**, allow flexible sizing, and **center** the calendar image. Aspect ratio is not forced; the image uses `object-fit: contain` and natural dimensions.

5. **Contact Us page — Remove neon boxes**
   - Added `page-contact` body class and page-scoped CSS to remove neon backgrounds, borders, glows, and **all related animations/transitions** around the contact form and Google Maps section, while maintaining layout. Slight spacing adjustments applied for aesthetics.

6. **Code cleanliness**
   - Scoped all overrides to page-level body classes to prevent bleed-through.
   - Avoided deleting global CSS to preserve other pages. No unused selectors remain from our specific removals (only class tokens removed on two gallery cards).
