# Services navigation dropdown overhaul

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated as you work. Maintain it in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

Introduce a premium dropdown experience for the Services navigation item so desktop visitors can expand a vertical menu without leaving the page and keep the header visible while exploring options. On mobile, tapping Services should open a dedicated overlay of service pills within the existing nav overlay, keeping the interaction polished and consistent with the minimising header behaviour.

## Progress

- [x] (2024-07-13 15:20Z) Initial codebase orientation and design reference notes.
- [x] (2024-07-13 16:15Z) First implementation of navigation dropdown.
- [ ] (2024-07-13 ??) Refinement pass on navigation after visual QA.
- [ ] (2024-07-13 ??) Final verification on all affected pages.

## Surprises & Discoveries

- None yet.

## Decision Log

- Decision: Use a button-based Services trigger with a downward arrow and JS-managed open/close state instead of a direct link to `services.html` to prevent unwanted navigation while the dropdown is open.
  Rationale: Ensures the dropdown can expand without redirecting and keeps the label visible with accessibility attributes.
  Date/Author: 2024-07-13 / ChatGPT
- Decision: On mobile, reuse the existing nav overlay and show a full-bleed services panel of pill links when the Services trigger is tapped.
  Rationale: Provides a premium, focused overlay while respecting the current hamburger/open nav flow and avoiding new modal patterns.
  Date/Author: 2024-07-13 / ChatGPT

## Outcomes & Retrospective

- Pending implementation.

## Context and Orientation

- Key pages: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html` all share the same header/nav markup with a shrinking header managed by `assets/js/script.js`.
- Core styles live in `assets/css/styles.css` (minified) with mobile overrides in `assets/css/mobile.css`. `assets/css/custom-styles.css` is loaded on `index.html` and `services.html` for additional layout tweaks.
- Navigation behaviour, header minimising, and mobile menu overlay are controlled in `assets/js/script.js` (see header/navigation helpers around the nav toggle, header indicator, and auto-hide logic).
- Mobile nav list styling and hamburger visibility are defined near the bottom of `assets/css/mobile.css` (around the `.nav-toggle` and `nav ul` rules). Desktop nav styling is within the minified `assets/css/styles.css`.

## Plan of Work

1. Update header nav markup on all core pages to wrap the Services item in a dropdown trigger with an arrow indicator and an associated submenu containing the specified links (General -> `services.html`, plus niche pages placeholders).
2. Enhance CSS: add desktop dropdown styling (vertical dropdown, arrow alignment) and hover/active aesthetics; extend mobile styles to present a services overlay/pill layout when the Services item is tapped within the mobile nav.
3. Extend `assets/js/script.js` to control the Services dropdown: prevent default navigation on the trigger, toggle open/close states, keep header from minimising while the dropdown is open, close on outside click or navigation, and support the mobile overlay workflow.
4. Perform visual QA on desktop and mobile viewports to ensure the dropdown appears premium, arrow retains label visibility, and the header minimising logic respects the open dropdown.

## Concrete Steps

- Edit HTML headers in `index.html`, `about.html`, `services.html`, `book.html`, and `contact.html` to include the Services dropdown structure.
- Add new CSS rules to `assets/css/styles.css` (desktop dropdown styling) and `assets/css/mobile.css` (mobile overlay pills and spacing); ensure minimal overrides and alignment with existing typography.
- Update `assets/js/script.js` navigation logic to manage the dropdown trigger, open/close behaviour, header lock, and mobile overlay mode.
- Run `npm test` or relevant checks if available (likely none); manually reload affected HTML pages to verify interactions.

## Validation and Acceptance

- On desktop, open any page, scroll until header minimises, click Services: dropdown opens vertically with arrow, word remains visible; header stays visible (no auto-hide) while dropdown is open; clicking Services again closes and re-enables minimising; selecting a submenu link navigates accordingly.
- On mobile (viewport <= mobile breakpoint), open hamburger menu, tap Services: a dedicated overlay or expanded panel appears with pill-style links for all service items; closing or navigating restores normal header behaviour.
- Verify header indicator, cookie banner, marquees, and footer remain unaffected; innovation gallery and parallax backgrounds unchanged.

## Idempotence and Recovery

- HTML edits are additive structure changes; can reapply by replacing the nav list snippet across pages.
- CSS additions appended to existing files; safe to reapply by re-running patches.
- JS changes confined to navigation section in `assets/js/script.js`; if issues arise, revert file to previous version and reapply stepwise.

## Artifacts and Notes

- Capture snippets of dropdown markup and CSS selectors after implementation for future reference.

## Interfaces and Dependencies

- New classes/data attributes on the Services nav item and submenu will be used by JS (e.g., `.nav-item-services`, `.services-dropdown`, `.services-trigger`).
- JS will reference these selectors to lock header auto-hide and manage mobile overlays; CSS will define `.services-dropdown` visibility and `.nav-open-services` body/header states.
