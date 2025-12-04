# Services dropdown + first niche landing page

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated as you work. Maintain it in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

Enable visitors to open a stable Services dropdown (desktop hover/tap friendly, mobile integrated) while the shrinking header remains legible, and ship a premium niche landing page that reuses Silverstone’s existing visual patterns. Users should be able to navigate from any core page to the niche page via the dropdown, explore niche-specific value (Real Estate / estate agents), and book an automation audit.

## Progress

- [x] (2025-02-04 00:15Z) Initial codebase orientation and design reference notes.
- [x] (2025-02-04 00:55Z) First implementation of navigation dropdown across core pages.
- [x] (2025-02-04 01:25Z) First implementation of Real Estate niche landing page.
- [x] (2025-02-04 01:40Z) Refinement pass on navigation and niche page after visual QA.
- [x] (2025-02-04 01:50Z) Final verification on all affected pages.

## Surprises & Discoveries

- `assets/js/script.js` contains detailed logic for the shrinking/auto-hiding header, mobile overlay nav, and indicator bar; interactions rely on classes like `.open`, `.header-hidden`, and the hamburger state. The script injects dynamic CSS for the mobile overlay.
- Service master CSV shows `Niche` values such as **Real Estate** with SKUs like “Estate Missed Call Text-Back” and “Property Lead Qualification Bot”, aligning with an estate agents focus.
- DuckDuckGo HTML responses are sparse; direct site reads are more reliable. PropTech articles highlight recurring estate agency pains: missed calls/viewing requests outside office hours, slow portal lead qualification, manual landlord onboarding/AML checks, and inconsistent viewing follow-ups.
- Added shared navigation markup for a Services dropdown and wired it to a new `niches/real-estate.html` page; introduced JS guards so the header stays visible while the dropdown is open.

## Decision Log

- Decision: Use the Real Estate (estate agents) niche as the first niche page.
  Rationale: It appears in the CSV (preferred “Estate agents” equivalent) and maps to multiple product SKUs we can group into a named pack.
  Date/Author: 2025-02-04 / Assistant

- Decision: Implement the Services dropdown as a button-triggered list with a persistent “Services” label and body flag `services-dropdown-open` to pause header auto-hide.
  Rationale: Keeps the shrinking header stable during hover/tap interactions while reusing existing nav styling across desktop and mobile.
  Date/Author: 2025-02-04 / Assistant

## Outcomes & Retrospective

(Keep updated after implementation.)

## Context and Orientation

- Core pages (`index.html`, `about.html`, `services.html`, `book.html`, `contact.html`) share a fixed `.site-header` with logo, nav links, hamburger `.nav-toggle`, and footer. The header auto-hides/minimises via `assets/js/script.js` and CSS variables (e.g., `--headerH`, `.header-hidden`).
- Navigation: currently simple list links; Services is a single link to `services.html`. Mobile uses an overlay menu toggled by the hamburger with `.open` class on `nav ul`; there’s a `#header-indicator` bar when the header hides.
- Design inventory:
  - **Index**: hero with shader canvas, neon feature cards, stats, packages grid, CTA banners with gradient backgrounds, marquee/innovation gallery on parallax sections.
  - **About**: storytelling sections with side-by-side cards, proof/values neon cards, CTA banner consistent with index.
  - **Services**: strong card patterns (`.neon-card`, service rows with icons), bullet lists with icons, CTA banner near end, innovation gallery and marquees on shared background.
  - **Book**: parallax backgrounds, form layout, bullet lists with icons for benefits, CTA-style sections.
  - **Contact**: concise hero and contact form, consistent header/footer.
- Styles: `assets/css/styles.css` (minified) defines site-wide variables, header sizing, neon cards, parallax backgrounds. `assets/css/custom-styles.css` and `assets/css/custom.css` hold overrides, bullet alignment tweaks, and mobile adjustments. No niche-specific CSS currently.
- Scripts: `assets/js/script.js` controls animations, counters, and nav hide/show including overlay menu; relies on classes `.open`, `.active`, `.header-hidden`, and indicator interactions.

## Plan of Work

1. Update navigation markup across core pages (header section) to convert the Services nav item into a dropdown trigger with arrow indicator and submenu entries (General services + niche page). Ensure mobile overlay retains Services text and allows expanding the submenu.
2. Extend existing CSS (`assets/css/styles.css` or `assets/css/custom-styles.css`) minimally to support dropdown positioning, hover/focus states, arrow styling, z-index, and mobile accordion behaviour without conflicting with the shrinking header.
3. Adjust `assets/js/script.js` to keep the header visible/locked while the Services dropdown is open (desktop hover, keyboard focus, mobile tap) and to support mobile submenu toggle within the overlay.
4. Create a new niche page under `niches/<slug>.html` (Real Estate → `niches/real-estate.html`) reusing header/footer/hero structure with shader `data-variant`, parallax sections, neon cards, icon bullets, CTA banner, and placeholders for pricing. Include at least three relevant images from existing assets and link back to services.
5. Wire the dropdown links to `services.html` (General) and the new niche page. Ensure meta title/description mention the niche.
6. Perform first-pass visual QA across index/about/services/book/contact/niche to verify dropdown behaviour, header stability, bullet icons consistency, CTA banner styling, gallery/marquee backgrounds unchanged.
7. Run critique and refinement pass to polish spacing, dropdown stability (no flicker), text contrast, and mobile interactions. Update ExecPlan logs accordingly.

## Concrete Steps

- View reference sections in core pages to mirror card and CTA structures: `sed` through headers/heroes/services cards for markup reuse.
- Implement dropdown markup updates in each HTML header block; ensure identical structure across pages.
- Edit CSS in existing files for dropdown styles; keep selectors scoped to header nav to avoid regressions.
- Update `assets/js/script.js` for dropdown open state handling (hover/focus listeners, data attribute to pause auto-hide, mobile submenu toggle integration).
- Build new niche page by copying base HTML scaffold (head, header, hero, parallax sections, CTA, footer) and adapting content and images.
- Validate locally by loading HTML in browser (manual), checking hover/tap behaviours and scroll-induced header hiding.
- Run `npm test` (if any) or basic `npm run build:css` if required; otherwise rely on manual QA.

## Validation and Acceptance

- Open `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, and `niches/real-estate.html` in browser.
- Scroll to trigger header minimising; open Services dropdown via hover/click and ensure:
  - Services label stays visible; header does not auto-hide while dropdown is open or focused.
  - Cursor can move between nav item and dropdown without flicker.
  - Mobile: open hamburger overlay, tap Services to expand submenu, select links, tap outside to close; dropdown remains stable until dismissed.
- Confirm all iconised bullet lists show icons on every bullet; CTA banners match existing style; innovation gallery/marquees remain on same background; cookie banner and footer unchanged.
- Verify niche page images render fully and align with nearby cards; hero shader uses unique `data-variant`; pricing placeholder section present.

## Idempotence and Recovery

- HTML edits are additive and repeatable; reapply dropdown markup consistently if conflicts arise.
- CSS additions are scoped; if layout breaks, revert specific selectors or compare against git to restore.
- JS additions should be wrapped in feature-specific functions; if auto-hide misbehaves, remove the new class/attribute toggles and retest.
- Niche page creation is isolated under `niches/`; safe to delete and recreate if needed.

## Artifacts and Notes

- Keep snippets of dropdown markup and any new CSS selectors documented in comments for future niches.
- Record image filenames used for the niche hero/proof sections to aid future template work.

## Interfaces and Dependencies

- New data attribute/class (e.g., `data-dropdown-open="services"` or `.services-open`) may be introduced on `body` or `header` so `script.js` can pause header auto-hide while dropdown is active.
- Mobile submenu toggle may require an additional button or `aria-expanded` attribute on the Services nav item within the overlay.
- Niche page hero uses `data-variant="real-estate"` on the shader canvas for potential JS styling hooks.
