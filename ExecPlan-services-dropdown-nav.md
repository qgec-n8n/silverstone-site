# Services navigation dropdown and mobile overlay

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated as you work. Maintain it in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

Add a Services dropdown to the primary navigation that opens on hover with a vertical list of service niches. While the dropdown is open, the minimized header should stay expanded. On mobile, tapping Services inside the nav opens a full‑screen overlay sub-menu instead of the hover dropdown. Visitors can reliably access all service links without the header collapsing mid-navigation.

## Progress

- [x] (2025-12-05 16:16Z) Initial codebase orientation and design reference notes.
- [x] (2025-12-05 16:20Z) First implementation of navigation dropdown.
- [x] (2025-12-05 16:20Z) First implementation of mobile Services overlay.
- [x] (2025-12-05 16:21Z) Refinement pass on navigation after visual QA.
- [x] (2025-12-05 16:21Z) Final verification on all affected pages.

## Surprises & Discoveries

- None yet.

## Decision Log

- Decision: Use a dedicated Services dropdown nested in the nav list with a hover trigger on desktop and a scripted overlay on mobile using the existing nav container.
  Rationale: Keeps markup consistent across pages and reuses existing nav overlay styles/behavior.
  Date/Author: 2025-12-05 / ChatGPT

## Outcomes & Retrospective

_To be completed after implementation._

## Context and Orientation

- Navigation markup is duplicated across `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, and `privacy-policy.html` under `<header class="site-header">` with a `.nav-toggle` for mobile and `<nav><ul>…</ul></nav>` items.
- `assets/js/script.js` controls header auto-hide/minimize behavior, the mobile nav overlay (`nav ul.open`), and the header indicator bar. It already tracks `header`, `.nav-toggle`, and `nav ul`, and prevents hiding while the overlay is open.
- Global styles (including header sizing and nav overlay) live in the minified `assets/css/styles.css`. `assets/css/custom-styles.css` is currently included on `index.html` and `services.html` for layout tweaks; nav-specific styles will need to go into the main stylesheet or be added globally.
- Header auto-hide: `scheduleHeaderAutoHide` hides the header unless the nav overlay is open. Hovering the header shows it; leaving hides it. On mobile, scrolling hides the header unless the overlay is open.

## Plan of Work

1. Update navigation markup on all pages to wrap the Services item in a dropdown trigger containing the Services label, a downward arrow indicator, and a vertical submenu list of the provided service niches. Ensure Services text remains visible alongside the arrow.
2. Add desktop styles for the dropdown: vertical list, aligned under Services, hover-reveal behavior, and prevent horizontal layout. Style arrow indicator and hover states to match brand aesthetic. Ensure the dropdown stays visible while hovered and does not trigger header minimization.
3. Enhance `assets/js/script.js` to:
   - Track dropdown hover/focus state to keep the header shown (block auto-hide) while interacting with the dropdown.
   - Provide mobile behavior: tapping Services inside the mobile nav opens a full-screen overlay panel listing the service niches with a back control to return to the main menu; ensure overlay respects existing scroll lock and close logic.
4. Verify interactions across desktop and mobile widths on all affected pages, checking header minimization, hover behavior, and mobile overlay navigation.

## Concrete Steps

- Edit each HTML page with a header to replace the Services nav item with dropdown markup and submenu links.
- Append/insert CSS rules (likely near the end of `assets/css/styles.css` to avoid minified edits elsewhere) for dropdown layout, arrow icon, hover states, and mobile overlay styling if needed.
- Update `assets/js/script.js` to manage dropdown state, prevent header hide while active, and build/show a mobile Services overlay within the nav overlay context.
- Run `npm test` or equivalent if applicable (none expected); perform manual browser checks via `npm run build` not required; rely on static HTML preview.

## Validation and Acceptance

- Desktop: load `index.html`, hover Services; dropdown opens vertically with arrow indicator next to text; moving the cursor within dropdown keeps header visible (no minimization). Links highlight and navigate.
- Desktop minimized header: after header auto-hides, hover indicator to reveal header, then hover Services; dropdown stays open and header stays visible while hovering.
- Mobile (viewport ≤ 768px): open nav via hamburger, tap Services; full-screen overlay sub-menu appears with provided links and a way back to the main nav; exiting overlay returns to nav; tapping a link closes menus as appropriate.
- Regression: CTA banners, innovation gallery, marquees, cookie banner, and footer remain unchanged across pages.

## Idempotence and Recovery

- HTML and CSS edits are additive or replace single nav list items; reapplying the patch is safe if conflicts are resolved manually.
- JS changes encapsulated in new handlers/flags; rerunning file edits overwrites with latest logic. If interrupted, reset with `git checkout -- <files>` and reapply steps.

## Artifacts and Notes

- Capture key CSS selectors and JS hooks used for the dropdown (e.g., `.nav-item-services`, `.services-dropdown`, `.services-overlay`).
- Note any adjustments to header auto-hide conditions tied to dropdown state.

## Interfaces and Dependencies

- New HTML classes: `.nav-item-services`, `.services-trigger`, `.services-arrow`, `.services-dropdown`, `.services-overlay`, `.services-overlay-back`.
- JS dependencies: `assets/js/script.js` will query and manage these classes; ensure they exist on all pages.
- CSS dependencies: uses existing color variables (e.g., `--color-white`, `--color-blue`, `--color-green`) defined in `assets/css/styles.css`.
