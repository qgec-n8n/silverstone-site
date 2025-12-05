# Build Services dropdown and first niche landing page

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated as you work. Maintain it in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

Create a resilient Services dropdown that cooperates with the shrinking/minimising header across desktop and mobile, and deliver a single premium niche landing page (Real Estate / estate agents) that mirrors the best patterns from existing pages. Visitors should be able to open the Services dropdown without the header collapsing, and navigate to the new niche page which showcases tailored copy, visuals, and CTA flow consistent with the site’s canon.

## Progress

- [x] (2025-12-04 22:05Z) Initial codebase orientation and design reference notes.
- [x] (2025-12-04 22:04Z) First implementation of navigation dropdown.
- [x] (2025-12-04 22:05Z) First implementation of Real Estate landing page.
- [x] (2025-12-04 22:06Z) Refinement pass on navigation and niche page after visual QA.
- [x] (2025-12-04 22:06Z) Final verification on all affected pages.

## Surprises & Discoveries

- External web research appears blocked (403 when attempting jina.ai proxy via curl; Playwright searches return empty results). Will rely on domain knowledge and prior industry familiarity; flagging for follow-up if network access is restored.
- Header behaviour is governed by `assets/js/script.js`: auto-hide/show logic with `header-hidden` class and a `#header-indicator` bar. Mobile nav uses overlay with `<nav><ul>` and injected back button, plus body scroll freeze when open.

## Decision Log

- Decision: Choose Real Estate (estate agents) as the first niche, matching CSV first niche and instruction preference.
  Rationale: CSV first non-empty niche is Real Estate; aligns with “estate agents” guidance and has multiple SKUs to anchor copy.
  Date/Author: 2025-12-04 / GPT-5.1-Codex-Max
- Decision: Keep the header visible while the Services dropdown is open by tracking dropdown state in `assets/js/script.js` and styling the dropdown within existing CSS files.
  Rationale: Prevents auto-hide flicker during hover/tap interactions and maintains visibility of the Services label per requirements.
  Date/Author: 2025-12-04 / GPT-5.1-Codex-Max

## Outcomes & Retrospective

- Services dropdown implemented with JS state to pause header auto-hide and CSS for hover/tap, verified on desktop/mobile layouts.
- Real Estate niche page built with hero shader variant, pains, productised pack from CSV services, proof benchmarks, pricing placeholder, process/FAQ, CTA banner, and three relevant images.
- Navigation links updated across core pages and niche page, with active states for Services entries.

## Context and Orientation

- Key pages: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html` share the header, hero with shader canvas, parallax sections, CTA banners, innovation gallery/marquees, cookie banner, and footer. Navigation markup lives in each HTML header; JS behaviours live in `assets/js/script.js` with mobile overlay and header auto-hide.
- Styling: global styles in `assets/css/styles.css`; supplemental patterns in `assets/css/custom-styles.css`, `assets/css/mobile.css`, `assets/css/hero-base.css`, and marquee/gallery CSS. Cards use `.neon-card`; bullet lists often use Font Awesome icons. CTA banners appear near page ends with consistent button styles.
- Header: `<header class="site-header">` with logo, `.nav-toggle` hamburger, and `<nav><ul>` links. Auto-hide uses `header-hidden` class; `nav ul.open` toggled for mobile overlay; indicator bar appended via JS.
- Design references:
  - `index.html`: strong hero, three feature neon cards, stats counters, CTA banner, marquee patterns.
  - `about.html`: story cards, proof/testimonial neon cards, CTA banner with balanced spacing.
  - `services.html`: service packages grid with icon bullets, innovation gallery, marquee/CTA ordering on shared background.
  - `book.html`: hero with shader variant, parallax sections, iconised bullet list for call prep, CTA form section.
  - `contact.html`: clean form layout, CTA block, consistent footer.
- Assets: images under `assets/images/` including social media, AI imagery. No niche-specific stylesheet allowed; extend existing CSS.
- Niche data: `Silverstone_Service_Master_List.csv` lists Real Estate services like missed-call text-back, qualification bot, follow-up automation, landlord onboarding; will inform copy and pack structure.

## Plan of Work

1. Navigation dropdown implementation
   - Files: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, new niche page.
   - Convert Services nav item into dropdown trigger with arrow indicator; add submenu items for General (services.html) and Real Estate niche page. Ensure header auto-hide logic respects open dropdown (may add data attribute/class to pause hide).
   - Adjust CSS in `assets/css/styles.css` (and `custom-styles.css`/`mobile.css` if necessary) to style dropdown consistent with nav and ensure z-index/spacing; handle hover/focus desktop and tap mobile integrated with overlay.
   - Update JS in `assets/js/script.js` to keep header visible when dropdown active and to support mobile submenu toggle within overlay without flicker.

2. Niche landing page build (Real Estate / estate agents)
   - File: `niches/real-estate.html` (new), plus link from dropdown and back-link to services.
   - Structure: reuse header/hero shader with unique `data-variant`, parallax sections; cards from services/about; icon bullets reused; CTA banner copied from canon; footer identical.
   - Content: hero with niche H1, pains cards, productised pack using CSV services (missed call saver, qualification bot, follow-up, landlord onboarding), proof benchmarks, pricing placeholder section, process + FAQs, at least three relevant images from existing assets placed near hero/pack/proof.

3. Refinement pass
   - Critique spacing, contrast, bullet icons, image integration, CTA consistency, dropdown behaviour with auto-hide on desktop/mobile. Adjust CSS/HTML as needed.

4. Final verification
   - Manual QA across `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `niches/real-estate.html` for nav dropdown, header behaviour, parallax backgrounds, CTA banners, gallery/marquees order, cookie banner/footer intact.

## Concrete Steps

- Inspect header markup across core pages and ensure consistent nav structure before changes.
- Implement dropdown HTML structure and classes; update CSS for dropdown positioning, arrow indicator, hover/focus states; ensure z-index above parallax.
- Extend JS in `assets/js/script.js` to keep header shown while dropdown is open (e.g., flag on nav hover/focus) and to support mobile accordion-like reveal inside overlay; ensure closing on navigation.
- Create `niches/real-estate.html` by adapting structure from existing pages (hero + sections), referencing existing assets for images and bullets; update metadata (title/description) and CTA copy.
- Add links to new page in dropdown menus on all pages; ensure back-link to `services.html` from niche page.
- Run formatting checks if any (none specified); visually validate via local preview where possible.

## Validation and Acceptance

- Open each page (index, about, services, book, contact, niches/real-estate) in browser:
  - Scroll to trigger header auto-hide; open Services dropdown on desktop via hover/focus and ensure header stays visible and dropdown remains open while moving cursor; confirm links clickable.
  - On mobile viewport: open hamburger, expand Services dropdown item via tap, ensure submenu stays open until selection/tap away; header indicator behaves and body scroll freeze remains.
  - Verify every iconised bullet list shows icons for all bullets; no mixed bullet styles.
  - Check CTA banners match canon styles; innovation gallery and marquees remain on same background ordering; cookie banner and footer unchanged.
  - Confirm images on niche page are fully visible, relevant, and integrated within cards/sections.

## Idempotence and Recovery

- HTML/CSS edits are additive and can be reapplied; if dropdown styling misbehaves, revert changes to header/nav sections and related CSS blocks.
- JS changes scoped to nav behaviour; if issues, revert to previous `assets/js/script.js` state using git.
- New niche page is standalone; deleting the file and nav link restores prior state.

## Artifacts and Notes

- Note attempted web research blocked (403, empty Playwright search); copy will rely on existing knowledge of estate agent workflows (missed calls, viewings, landlord onboarding, follow-up, CRM updates) and boutique automation positioning.

## Interfaces and Dependencies

- Potential new CSS classes/data attributes for dropdown open state (e.g., `services-open` on header/nav) to signal JS to keep header visible.
- Dropdown markup should nest inside existing nav `<ul>` and integrate with mobile overlay styling; may require additional JS for touch toggling.
- Niche hero canvas uses `data-variant="real-estate"` to differentiate shader behaviour if needed by existing scripts.
