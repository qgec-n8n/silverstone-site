# Services dropdown hover-safe navigation update

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated as you work. Maintain it in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture
Enable a desktop hover dropdown for the Services nav item that keeps the header expanded while users hover either the top bar or the dropdown itself, adds a visible arrow next to “Services,” and introduces a dedicated full-screen Services submenu experience on mobile. Visitors should be able to access niche links without the header minimizing unexpectedly.

## Progress
- [x] (2025-12-05 16:57Z) Initial codebase orientation and design reference notes.
- [x] (2025-12-05 17:02Z) First implementation of navigation dropdown.
- [x] (2025-12-05 17:15Z) Refinement pass on navigation after visual QA.
- [x] (2025-12-05 17:25Z) Final verification on all affected pages.

## Surprises & Discoveries
- None yet.

## Decision Log
- Decision: Use the existing nav list markup and augment with a Services dropdown trigger + submenu to avoid duplicating nav structure across pages.
  Rationale: Keeps consistency across static HTML pages and aligns with current script.js overlay logic.
  Date/Author: 2025-12-05 / GPT-5.1-Codex-Max.

## Outcomes & Retrospective
- Pending implementation.

## Context and Orientation
- Core pages: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`, etc. All share a header with `.site-header`, `.nav-toggle`, and `nav ul` links.
- Styles live primarily in `assets/css/styles.css` with overrides in `assets/css/custom-styles.css`, `assets/css/custom.css`, and `assets/css/mobile.css`. The header uses CSS variables (e.g., `--headerH`) and classes like `.header-hidden` for minimization.
- Navigation behaviour is controlled in `assets/js/script.js`, which manages the minimizing header, desktop hover reveal, mobile full-screen overlay, and indicator bar. Menu links currently sit directly inside `nav ul` without dropdowns.
- Mobile navigation already presents a full-screen overlay (`nav ul.open`) and includes a prepended back button item for overlay closing.

## Plan of Work
1. Update the navigation markup across shared pages (starting with `index.html` then propagate consistently) to wrap Services in a dropdown trigger containing an arrow icon and nested submenu list of niche links.
2. Extend CSS (likely in `assets/css/styles.css` plus targeted overrides) to style the dropdown: vertical list, hover visibility, arrow alignment without hiding “Services,” and hover state that keeps header expanded.
3. Enhance `assets/js/script.js` to:
   - Keep the header from auto-hiding while the Services dropdown or trigger is hovered/focused.
   - Manage desktop hover open/close of the dropdown.
   - On mobile, intercept Services clicks to present a dedicated full-screen submenu overlay view, including a back affordance to return to main nav.
4. Validate on `index.html`, `about.html`, `services.html`, `book.html`, and `contact.html`: header minimization pauses while hovering dropdown, arrow remains visible, submenu is vertical, and mobile shows overlay submenu on tap.

## Concrete Steps
- Edit HTML nav markup to add dropdown structure and submenu links.
- Update or add CSS rules for dropdown positioning, arrow, hover/focus states, and mobile submenu view.
- Modify `assets/js/script.js` to manage hover hold-open and mobile Services submenu overlay.
- Run `npm test` if available (none noted); otherwise, manual browser validation.

## Validation and Acceptance
- Desktop: hover header to expand, hover Services to open vertical dropdown; move cursor between top bar and dropdown without header minimizing; confirm arrow next to Services text remains visible; each submenu link navigates correctly.
- Desktop scroll: header auto-hides after delay when not hovered; remains visible while hovering dropdown.
- Mobile: open nav overlay via hamburger; tapping Services opens full-screen submenu overlay with listed niches; back control returns to main menu; overlay scroll/close works.
- Quick checks on `index.html`, `about.html`, `services.html`, `book.html`, `contact.html` for consistent header and footer behaviour.

## Idempotence and Recovery
- HTML edits are additive and can be repeated; if markup misaligns, restore nav list to previous structure from git history.
- CSS additions are scoped; removing the added blocks reverts dropdown styling.
- JS changes guarded by feature classes/data attributes; reverting file restores previous behaviour.
- If mobile overlay locks scroll, reload page or reset body inline styles as per `closeNavMenu` logic.

## Artifacts and Notes
- Record key selectors: `.nav-item-services`, `.services-dropdown`, `.services-toggle`, `.services-submenu`, `.services-mobile-panel`.
- Document hover guard logic in `script.js` to keep header visible while dropdown is active.

## Interfaces and Dependencies
- New dropdown classes in HTML will be referenced by CSS and `script.js` for hover/overlay behaviour.
- JS depends on existing `navMenu` and `navToggle` elements plus new `.services-toggle` trigger and `.services-submenu` list. Mobile submenu overlay will use a data attribute/class to manage state without conflicting with existing `open` class.
