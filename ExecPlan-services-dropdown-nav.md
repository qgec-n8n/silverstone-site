# Services dropdown navigation updates

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated as you work. Maintain it in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture
Enable a hover-triggered Services dropdown in the site header that keeps the minimizing menu visible while the dropdown is open, shows a clear downward arrow indicator, and switches to a full-screen Services submenu on mobile taps. Visitors should be able to access all niche links without the header collapsing while interacting with the dropdown.

## Progress
- [x] (2024-06-03 00:00Z) Initial codebase orientation and design reference notes.
- [x] (2024-06-03 00:40Z) First implementation of navigation dropdown.
- [x] (2024-06-03 00:55Z) Refinement pass after visual QA and hover/auto-hide review.
- [x] (2024-06-03 01:05Z) Final verification on header behaviour and mobile overlay logic.

## Surprises & Discoveries
- Base styles are largely minified in `assets/css/styles.css`, so contextual snippets are needed when updating selectors.
- Mobile overrides live in `assets/css/mobile.css`, already adjusting nav list layout for small screens.

## Decision Log
- Decision: Implement dropdown markup directly in the shared header across all pages to keep consistency without introducing templates.
  Rationale: Each page contains its own header markup; updating all instances ensures identical behavior sitewide.
  Date/Author: 2024-06-03 / Assistant

## Outcomes & Retrospective
(To be completed after implementation.)

## Context and Orientation
- Header markup appears near the top of `index.html`, `about.html`, `services.html`, `book.html`, and `contact.html`, each with a `header.site-header` containing a nav list.
- Core styling is in `assets/css/styles.css` (minified but includes header height vars, nav layout, header-hidden state) with mobile adjustments in `assets/css/mobile.css`.
- Header behaviour (auto-hide/minimize, indicator bar, mobile menu overlay) is controlled in `assets/js/script.js` via `header-hidden`, `nav-toggle` interactions, and hover/scroll handlers.

## Plan of Work
1. Update header nav markup on each primary page to wrap the Services link in a dropdown trigger with a caret and add the vertical submenu items specified.
2. Extend global CSS to style the dropdown (hover display, arrow, alignment, layering) and ensure the header stays expanded while interacting with the dropdown; add mobile-specific overlay styling in `mobile.css`.
3. Adjust `assets/js/script.js` to keep the header shown while the dropdown or its trigger is hovered and to present a full-screen Services submenu when tapped on mobile, closing appropriately.
4. Verify behaviour on desktop (hover keeps header open, vertical dropdown) and mobile (Services opens overlay), ensuring header minimization logic respects dropdown hover state.

## Concrete Steps
- Edit HTML headers in `index.html`, `about.html`, `services.html`, `book.html`, `contact.html` to add Services dropdown structure with required links and caret.
- Update `assets/css/styles.css` with dropdown positioning/visibility, hover interactions, arrow styling, and z-index alignment with header.
- Update `assets/css/mobile.css` to provide full-screen Services overlay styling and hide desktop dropdown behaviour on small screens.
- Modify `assets/js/script.js` to add hover/pointer tracking for the dropdown, prevent header auto-hide while active, and implement mobile overlay open/close on Services tap including closing on back/other interactions.
- Re-run necessary formatting checks (manual review) and validate in browser if possible.

## Validation and Acceptance
- Desktop: Hover over Services in header keeps menu expanded and reveals vertical dropdown; moving cursor between header and dropdown does not minimize until leaving both; Services text and downward arrow remain visible; dropdown links are clickable.
- Mobile (<=768px): Tapping Services opens a full-screen overlay listing all dropdown links vertically; tapping Back or closing returns to main nav; header auto-hide resumes after closing.
- Header still hides when neither header nor dropdown is hovered; other nav links and hamburger toggle continue to function; footer, marquees, galleries unaffected.

## Idempotence and Recovery
- HTML updates are additive and can be reapplied; if a page header corrupts, copy the header block from a verified page.
- CSS additions are appended in targeted blocks; remove added selectors to revert.
- JS changes are isolated within navigation handling; revert by resetting `assets/js/script.js` to previous version via Git.

## Artifacts and Notes
- Capture key CSS/JS snippets in the final diff for future contributors.

## Interfaces and Dependencies
- New dropdown classes (e.g., `.nav-item-dropdown`, `.services-dropdown`) and a mobile overlay container will be added for styling and JS hooks.
- JS relies on existing header show/hide helpers and viewport detection to manage dropdown hover and mobile overlay lifecycle.
