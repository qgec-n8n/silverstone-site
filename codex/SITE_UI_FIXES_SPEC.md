<!-- FILE: codex/SITE_UI_FIXES_SPEC.md -->

# Site UI Fixes Spec (A–E)

This spec is the authoritative reference for the implementation run.

## Scope guardrails
- Implement ONLY what is required in A–E.
- Preserve existing design system tokens and responsive conventions.
- Do not refactor unrelated HTML/CSS/JS.
- Rebuild compiled assets whenever `src/css/**` or `src/js/**` changes:
  - `npm run build:css`
  - `npm run build:js`

## Assumptions (explicit, used to remove ambiguity)
1. “Purple shader” means using the hero shader **default** theme (i.e., omit `data-variant` or set `data-variant="default"`).
2. “Marquee images in assets/images/socialmedia” refers to the **social-media marquee set**: files whose names start with `1-1_`, `2-3_`, or `3-2_` (any of: `.jpg`, `.jpeg`, `.webp`). Use exactly one file per stem (do not duplicate stems across extensions).
3. “Reduce spacing” is implemented via a reusable utility class:
   - add `tight-bottom` to specific `<section>` elements
   - define `.section.tight-bottom` in `src/css/base/layout.css`

## Automated acceptance gate (non-negotiable)
After implementation: `node scripts/validate-site-ui-fixes.js` must pass.

---

# A) General fixes/changes for Desktop and Mobile

## A1) Hero shader variants
Requirement:
- index.html, about.html, services.html, book.html, contact.html → BLUE shader
- niches/*.html → PURPLE shader

Implementation targets:
- `index.html`
- `about.html`
- `services.html`
- `book.html`
- `contact.html`
- All HTML files under `niches/`

Acceptance:
- Main pages have `<canvas id="hero-shader-canvas" ... data-variant="blue">`
- Niche pages have `data-variant` omitted OR `data-variant="default"`

## A2) Double + single marquees use all images, shuffled
Requirement:
- Double and single marquees: must use all images in assets/images/socialmedia, but shuffled
- Must not be sequentially grouped by aspect ratio (not all 1:1, then all 2:3, then all 3:2)

Implementation targets:
- `src/js/marquee.js`

Implementation constraints:
- Include all eligible marquee stems (prefix `1-1_`, `2-3_`, `3-2_`).
- Order must be mixed; avoid long consecutive runs of the same prefix.

Acceptance:
- `scripts/validate-site-ui-fixes.js` passes marquee checks.

## A3) niches/*: service-row images must be present before user reaches them
Requirement:
- On niches/*.html: images next to cards should already be present before the user reaches the image (not only appearing when the user scrolls down to it)

Implementation targets:
- All niche pages under `niches/`

Implementation rule:
- For images with `class="service-img"` on niche pages: remove `loading="lazy"` (prefer `loading="eager"` or omit loading).

Acceptance:
- `scripts/validate-site-ui-fixes.js` finds no `loading="lazy"` on `.service-img` in `niches/*.html`.

## A4) Dark overlay over body-section-background-2025.webp slightly less opaque
Requirement:
- Make the dark overlay over “body-section-background-2025.webp” slightly less opaque.

Implementation targets:
- `src/css/base/variables.css`

Implementation rule:
- Reduce `--body-section-overlay-opacity` from `0.24` to a value in the range `0.18–0.22` (recommended: `0.20`).

Acceptance:
- `scripts/validate-site-ui-fixes.js` confirms the new value is lower than `0.24` and within range.

---

# B) Mobile niche background fix (niches/*) — MOBILE ONLY
Requirements:
- MOBILE only: ensure every niches/*.html page uses the same body section background image + dark overlay pattern used by the site’s other HTML pages.
- Specifically ensure “body-section-background-2025.webp” is applied the same way as the established pattern.
- Do not change desktop appearance unless the established pattern already does so responsively.

Implementation targets:
- `src/css/pages/estate-agents.css` (currently applies to `body.page-niche` on mobile)
- `src/js/parallax.js` (mobile stage image URL must work from `/niches/*.html`)

Implementation rules:
1. Remove/replace the mobile-only `body.page-niche { background-image: ...book-hero-calendly-mobile... }` override.
2. Ensure `parallax.js` uses an asset URL that is valid from nested pages:
   - Prefer absolute `/assets/images/body_section_parallax/body-section-background-2025.webp`

Acceptance:
- `scripts/validate-site-ui-fixes.js`:
  - rejects the old book-hero mobile background on `body.page-niche`
  - requires `BASE_IMAGE` to start with `/assets/`

---

# C) Additional required fixes on services.html

## C1) “Core Bundle Bullets” heading formatting + color
Target card:
- The card whose headline text is exactly (or near-exactly):
  “start small. ship fast. expand when it is working.”

Requirements:
- Change the phrase “Core bundle bullets” from white font to blue font.
- Change the single-line text “Core bundle bullets (applies across packs):” into a two-line heading formatted exactly as:
  - Line 1: “Core Bundle Bullets:” (BLUE font)
  - Line 2: “(applies across packs)” (WHITE font)

Implementation constraints (strict):
- Reuse the exact existing CSS classes/tokens used elsewhere on the page for blue headings and white subtext.
- Mirror the “General Service Lines:” and its parent pattern.
- Do NOT invent new colors or styling tokens.
- Use the same markup/line-break technique already used by:
  “General Service Lines:” followed by “(modules that can extend any niche pack)”.

Implementation rule:
- Implement as a single heading element containing two block-level spans:
  - First span: blue via existing token `var(--color-blue)` and `display: block`
  - Second span: white via existing token `var(--color-white)` and `display: block`

Acceptance:
- Old string removed.
- New two-line text present near the target card.
- `scripts/validate-site-ui-fixes.js` passes C1 checks.

## C2) Desktop alternation for the four “cards with images” rows
Scope:
- The rows using images:
  - General_Services_1.jpeg
  - General_Services_2A.jpeg
  - General_Services_2B.jpeg
  - General_Services_3.jpeg

Required desktop layout order (| = midline):
- General_Services_1.jpeg (Left) | Card (Right)
- Card (Left) | General_Services_2A.jpeg (Right)
- General_Services_2B.jpeg (Left) | Card (Right)
- Card (Left) | General_Services_3.jpeg (Right)

Constraints:
- Preserve vertical sequence as-is; only swap left/right placement per pair.
- Preserve existing mobile stacking/behavior as much as possible.
- Only enforce desktop alternation using existing responsive layout conventions (order rules at desktop breakpoint).

Implementation rule (recommended and testable):
- Add a `data-desktop-order` attribute to each of the four `div.service-row` elements:
  - `data-desktop-order="img-left"` for rows where image must be left on desktop
  - `data-desktop-order="img-right"` for rows where image must be right on desktop
- Add desktop-only CSS in `src/css/pages/services.css` that applies the ordering based on `data-desktop-order`.
- Do not change mobile stacking rules.

Acceptance:
- `scripts/validate-site-ui-fixes.js` confirms required `data-desktop-order` values for each of the four images.

---

# D) Menu banner distinct fixes for Desktop and Mobile

## D1) Desktop menu banner behavior (desktop only)
Requirements:
- Services dropdown appears on hover over the Services button.
- When cursor is over the dropdown list area (General/Niche) OR over the Services button, the minimizing feature of the menu banner is entirely disabled.
- If cursor leaves the dropdown list and is hovering over an area that is not the menu banner or the dropdown list:
  - dropdown disappears first
  - then ~1 second after dropdown has fully disappeared the menu banner may minimize.
- If cursor moves off the dropdown list directly onto the menu banner:
  - only dropdown disappears
  - banner remains expanded
  - if cursor then leaves the menu banner, banner can minimize almost right away.

Implementation targets:
- `src/js/header-nav.js`

Implementation rules:
- Desktop-only gating: use `(hover: hover) and (pointer: fine)` or a width breakpoint, so touch devices do not rely on hover.
- Add hover open/close behavior (mouseenter/pointerenter + mouseleave/pointerleave) for:
  - Services toggle button
  - Services dropdown panel
- Ensure header auto-hide timers are cleared/disabled while hovered over toggle or dropdown.
- On dropdown close due to leaving both header+dropdown: delay header minimize by about 1.3s (1.0s after a 0.3s dropdown fade).

Acceptance:
- Manual verification (see checklist below).
- `scripts/validate-site-ui-fixes.js` confirms hover handlers exist (basic static check).

## D2) Mobile nav panel fixes
Requirements:
- The “<-- Services” button must have the same font size as “Home”, “About”, “Book”, and “Contact” on the first menu panel.
- Buttons for both menu panels should begin appearing after their respective menu panel has slid about 60% into place.

Implementation targets:
- `src/css/components/header.css`
- `src/js/header-nav.js`

Implementation rules:
1. Set an explicit `font-size` on `.mobile-nav-link` so `<a>` and `<button>` render identically.
2. Replace the item reveal delay formula so it starts at ~60% of panel slide time:
   - JS sets `--mobile-nav-item-reveal-delay-base-ms = slideMs * 0.6`
   - CSS uses `--mobile-nav-item-reveal-delay-base-ms` as the base in `animation-delay`

Acceptance:
- `scripts/validate-site-ui-fixes.js` confirms font-size + delay variable wiring.

---

# E) Spacing reduction review (services.html and niches/*.html)

## E1) Utility: .section.tight-bottom
Implementation targets:
- `src/css/base/layout.css`

Implementation rule:
- Add `.section.tight-bottom` that reduces bottom padding enough to visibly reduce the gap (recommended bottom padding: `2.5rem` on desktop; `2.0rem` on mobile).

Acceptance:
- `scripts/validate-site-ui-fixes.js` confirms utility exists.

## E2) services.html boundaries to tighten
Map (section numbers are in-page order, where Hero is #1):
- Reduce space between 2 & 3
- Reduce space between 3 & 4
- Reduce space between 4 & 5
- Reduce space between 5 & 6
- Reduce space between 8 & 9
- Reduce space between 9 & 10

Implementation rule:
- Add `tight-bottom` to the predecessor sections:
  - #2, #3, #4, #5, #8, #9

Acceptance:
- `scripts/validate-site-ui-fixes.js` confirms those sections have `tight-bottom`.

## E3) niches/*.html boundaries to tighten
Map (Hero is #1):
- Reduce space between 2 & 3
- Reduce space between 3 & 4
- Reduce space between 4 & 5
- Reduce space between 5 & 6
- Reduce space between 8 & 9

Implementation rule:
- Add `tight-bottom` to the predecessor sections:
  - #2, #3, #4, #5, #8 (on every niche page)

Acceptance:
- `scripts/validate-site-ui-fixes.js` confirms those sections have `tight-bottom`.

---

# Manual QA checklist (must be performed after automation passes)

## Desktop (hover-capable) — Services dropdown + banner minimize
1. Hover Services button → dropdown appears.
2. While cursor is over Services button OR dropdown panel:
   - banner does NOT minimize (no timer-based hide).
3. Move cursor from dropdown panel to non-header area:
   - dropdown disappears first
   - ~1 second after dropdown is fully gone, banner may minimize.
4. Move cursor from dropdown panel directly onto the header/banner:
   - dropdown disappears
   - banner stays expanded
   - leaving the banner then minimizes almost right away.

## Mobile
1. Open mobile menu → “<-- Services” has the same font size as other top-level items.
2. Open menu panels → items begin appearing once the panel is ~60% slid in.
