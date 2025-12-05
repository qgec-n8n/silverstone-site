# Services dropdown navigation upgrade

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated as you work. Maintain it in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

Deliver a premium Services dropdown that keeps the header from minimising while open, introduces a clear downward arrow next to “Services”, and provides tailored desktop and mobile experiences. Visitors should be able to expand a vertical dropdown on desktop without being redirected, and mobile users should tap into a dedicated Services overlay with pill-style links for each niche before navigating away.

## Progress

- [x] (2025-12-05 17:00Z) Initial codebase orientation and design reference notes.
- [x] (2025-12-05 17:45Z) First implementation of navigation dropdown.
- [x] (2025-12-05 18:05Z) Refinement pass on navigation after visual QA.
- [x] (2025-12-05 18:15Z) Final verification on all affected pages.

## Surprises & Discoveries

- Existing navigation is duplicated across `index.html`, `about.html`, `services.html`, `book.html`, and `contact.html`. Updates must be applied consistently to each page.
- Mobile navigation overlay styling is heavily customised via injected styles in `assets/js/script.js` and multiple overrides in `assets/css/mobile.css`, so new dropdown behaviour needs to cooperate with that system.

## Decision Log

- Decision: Use a button-based Services trigger with an inline caret icon to prevent default navigation when toggling the dropdown.  
  Rationale: Keeps the header stationary while allowing users to choose a destination from the dropdown.  
  Date/Author: 2024-06-04 / Assistant

## Outcomes & Retrospective

_To be completed after implementation._

## Context and Orientation

- Key pages: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html` share the header markup with the Services link. Hero CTAs and marquee/gallery elements reference shared styling in `assets/css/styles.css`, `assets/css/custom.css`, and `assets/css/mobile.css`.
- Navigation behaviour: `assets/js/script.js` manages the shrinking header, mobile overlay (`nav ul.open`), back button injection, and auto-hide timers. The header hides on scroll/mobile but reappears on hover or via the indicator bar. Mobile overlay styling is injected at runtime with additional spacing overrides in `assets/css/mobile.css` (around lines 655–760).
- Brand styling: Base colours and card aesthetics live in `assets/css/styles.css` with adjustments in `assets/css/custom.css`. Mobile-specific tweaks for the nav overlay and sections are in `assets/css/mobile.css`.

## Plan of Work

1. Update header navigation markup across all main pages to replace the Services anchor with a button + caret and add dropdown/overlay containers holding the required niche links. Ensure the markup supports both desktop dropdown and mobile overlay variants.
2. Extend CSS (preferably in `assets/css/custom.css` plus targeted mobile rules) to style the Services trigger, caret, desktop dropdown panel (vertical list), and the mobile overlay with pill buttons and back control while keeping the word “Services” visible.
3. Enhance `assets/js/script.js` to manage Services dropdown state: toggle on click without navigation, keep header from minimising while open, close when navigating elsewhere, and present the mobile overlay when on small viewports. Include outside-click handling and cleanup when nav overlay closes.
4. Perform manual verification on desktop and mobile breakpoints across the main pages to confirm dropdown behaviour, header locking, and link interactions without breaking existing nav overlays or auto-hide behaviours.

## Concrete Steps

- Edit `index.html`, `about.html`, `services.html`, `book.html`, `contact.html` to inject the new Services dropdown markup with arrow indicator and dropdown links.
- Update `assets/css/custom.css` (and add mobile-specific rules as needed) for desktop dropdown styling and Services trigger visuals; supplement with `assets/css/mobile.css` if mobile-only overrides are required.
- Modify `assets/js/script.js` to handle Services dropdown/overlay toggling, header locking, and graceful close interactions on navigation or outside clicks.
- (Optional) Run `npm run build-css` if CSS build pipeline requires regeneration (not expected for direct CSS edits).

## Validation and Acceptance

- Open each main page in a browser. Scroll until the header minimises, then click “Services”: dropdown should open vertically under the nav, header stays expanded, and clicking outside or the toggle closes it; the “Services” label and arrow remain visible.
- While dropdown is open, verify header does not auto-hide. Navigating to another page resets the header behaviour.
- Hover over dropdown links to confirm premium styling and vertical stacking; “General” links to `services.html`, other niches are presented as provided labels.
- On mobile (≤768px), open the hamburger menu, tap Services: a dedicated overlay with pill buttons appears. Use a back/close control or re-tap Services to return to the main menu. Selecting a link navigates away and closes overlays.
- Confirm cookie banner, marquees, innovation gallery, and CTA sections remain visually intact; no new backgrounds added.

## Idempotence and Recovery

- HTML edits are additive and can be reapplied by re-copying the updated nav block across pages.
- CSS additions are scoped to new classes and safe to reapply; if styling conflicts arise, remove the new blocks from `assets/css/custom.css`/`assets/css/mobile.css`.
- JS changes isolate Services-specific logic; reverting `assets/js/script.js` restores prior navigation behaviour.

## Artifacts and Notes

- Capture key diffs for the Services nav markup and JS toggle helpers in the final summary.

## Interfaces and Dependencies

- New classes: `.nav-services`, `.services-toggle`, `.services-caret`, `.services-dropdown`, `.services-mobile-overlay`, `.services-mobile-grid`, `.services-pill`.
- JS relies on the existing header/nav selection in `assets/js/script.js` and adds listeners for `.services-toggle`, dropdown states, and overlay visibility classes (`.services-open`, `.services-mobile-open`).
