<!-- FILE: codex/REQUESTED_EDITS_SPEC.md -->
# Requested Edits Spec (Source of Truth) — Edits 1–7

This document is the **single source of truth** for what Codex must implement.

Key rule:
- Implement EXACTLY and ONLY the edits below.
- Do not add unrelated styling, refactors, or new features.
- Any mention of “Pricing Feature Implementation plan” is a wording mismatch; treat it as referring to these same edits.

## Definitions (use these terms consistently)

Hero section:
- The top-of-page section with `section.hero.title-band`.

Hero shader:
- The WebGL canvas with `id="hero-shader-canvas"` inside `.hero-media`.
- Shader colors are controlled by the variant key stored in `data-variant` on the canvas and the theme map in the hero shader JS.

Hero glass panel / blurred container:
- The visible translucent, blurred background behind hero copy/CTAs (currently applied via CSS on the hero’s `.content` container using background + backdrop blur).
- The requirement is to remove this visual container (no blur/glass panel behind hero text/buttons).

Qualifying subtitles (for “turn white subtitles grey”):
- A subtitle is qualifying if:
  - It sits directly underneath a blue section title in the body section.
  - The title uses `.section-title` (blue) and the subtitle is the immediately following element in the same section container.
  - It is NOT inside a card, CTA banner, or pill button.
- Practical rule of thumb:
  - Subtitles that are direct children of `.section > .container` and immediately follow a direct-child `.section-title` are in scope.

Cover-fill / center-crop:
- The image should fill its container.
- Cropping is allowed and expected.
- The focal point should remain centered.

## Proof markers (required)

Codex must add these SPEC markers near the final implementation points (in source files that compile into the bundles, or in HTML where relevant). The grader will look for them.

- `SPEC: REQ1_HERO_SHADER_COLORS_PER_PAGE_2025_12_30`
- `SPEC: REQ2_HERO_GLASS_PANEL_REMOVED_2025_12_30`
- `SPEC: REQ3_HERO_COPY_CTA_POSITIONED_OFF_MIDLINE_2025_12_30`
- `SPEC: REQ4_INDEX_STREAMLINE_WORKFLOWS_ONE_LINE_2025_12_30`
- `SPEC: REQ5_SECTION_SUBTITLES_GREY_2025_12_30`
- `SPEC: REQ6_ABOUT_IMAGES_COVER_CENTER_2025_12_30`
- `SPEC: REQ7_SERVICES_IMAGES_COVER_CENTER_2025_12_30`

## Requested Edit 1 — Per-page hero shader colors

Requirement:
- `about.html`: hero shader is neon yellow
- `services.html`: hero shader is green
- `book.html`: hero shader is bright neon pink
- `contact.html`: hero shader is fire orange

Acceptance criteria:
- Each page’s `#hero-shader-canvas` has the correct `data-variant` value matching the intended color.
- The hero shader JS contains a theme for each required variant, and those themes produce a clearly neon effect.
- The built JS bundle (`assets/js/app.js`) contains the proof marker for Edit 1.

Implementation constraints:
- Use the existing variant mechanism (do not replace the shader system).
- Prefer using existing design tokens for color inspiration when possible (e.g., existing green token).

Suggested variant keys (consistent and explicit):
- about: `neon-yellow`
- services: `green`
- book: `neon-pink`
- contact: `fire-orange`

Verification:
- Automated: `node scripts/assert-ui-spec.js` checks the per-page `data-variant` mapping and theme presence.
- Manual: verify by visually loading each page.

## Requested Edit 2 — Remove hero blurred/glass container

Requirement:
- Remove the blurred background container behind hero copy + CTA buttons.

Acceptance criteria:
- The hero `.content` no longer presents as a “panel”:
  - no backdrop blur on the container
  - no translucent background panel on the container
- The built CSS bundle contains the proof marker for Edit 2.

Implementation constraints:
- The hero content container may remain as a structural wrapper, but it must not be visually a blurred/glass card.

Verification:
- Automated: grader checks that the hero content block no longer contains backdrop blur and uses a transparent/none background.
- Manual: confirm the glass/panel is gone on desktop and mobile.

## Requested Edit 3 — Hero copy/CTA placement and styling (no midline obstruction)

Requirement:
- Update font color/style/placement so hero copy and CTA buttons on every page do not obstruct the shader animation running across the middle of the hero, but remain easy to read on mobile and desktop.

Acceptance criteria:
- On desktop and mobile:
  - Hero copy and CTA buttons are positioned away from the hero’s midline (the center region where the shader effect is most prominent).
  - Text remains readable (contrast + spacing).
- Built CSS contains the proof marker for Edit 3.

Implementation constraints:
- Keep changes minimal and consistent across pages.
- Prefer adjusting layout rules in the hero component CSS rather than per-page hacks (unless needed).
- Do not reintroduce a “glass panel” to solve readability.

Verification:
- Automated: grader checks for a non-centered layout override (the hero content is not centered in the same way as before) and for the required proof marker.
- Manual: required; this is a visual requirement.

## Requested Edit 4 — Index “Streamline Workflows” pill button stays on one line

Requirement:
- On `index.html`, make the button “Streamline Workflows” sit on one line.
- Ensure the text is centered in the pill with equal space either side.
- You may make the pill longer.

Acceptance criteria:
- The specific index button does not wrap on common mobile widths.
- The pill has balanced horizontal padding and centered text.
- The built CSS contains the proof marker for Edit 4.
- The index HTML contains a dedicated class on the specific button so the fix is targeted.

Required targeting mechanism:
- Add a unique class to that specific anchor in `index.html`:
  - `btn-streamline-workflows`

Verification:
- Automated: grader checks the class exists in HTML and a nowrap rule exists in built CSS.
- Manual: confirm at mobile widths that previously caused wrapping.

## Requested Edit 5 — Qualifying body-section subtitles must be grey across all pages (incl. niches)

Requirement:
- On all pages including `niches/*.html`, make the white subheadings under blue titles in the body sections grey.
- Exclusions: do not recolor subtitles that sit inside a card, CTA banner, or pill button.

Acceptance criteria:
- A narrowly-scoped CSS rule exists that targets qualifying subtitles and sets them to a grey (use an existing grey token).
- The built CSS bundle contains the proof marker for Edit 5.
- Multiple pages (including at least 2 niche pages) show qualifying subtitles as grey under their blue titles.

Implementation constraints:
- Do not globally recolor all text.
- Prefer a selector that:
  - targets `.section > .container` direct-child `.section-title` followed by `.section-subtitle`
  - uses the stable grey token (e.g., the “original silver” token) so it isn’t affected by page-level overrides.

Verification:
- Automated: proof marker + presence of a grey rule in built CSS.
- Manual: required cross-page spot checks.

## Requested Edit 6 — About images fill container (center-crop)

Requirement:
- On `about.html`, expand:
  - `Silverstone_22.jpg`
  - `Silverstone_28.jpg`
  so they fill their container.
- Cropping is allowed.
- Image must remain centered.

Acceptance criteria:
- Both images have cover-fill behavior (center crop) and look like they fill the card.
- Built CSS contains the proof marker for Edit 6.
- Targeting must be limited to these images only.

Required targeting mechanism:
- Add a shared class to these two images (and only these images):
  - `img-cover-center`

Verification:
- Automated: grader checks those two images have the class and that CSS defines cover-fill for that class.
- Manual: confirm fill + centered crop.

## Requested Edit 7 — Services images fill container (center-crop)

Requirement:
- On `services.html`, expand:
  - `General_Services_1.jpeg`
  - `General_Services_2A.jpeg`
  - `General_Services_2B.jpeg`
  - `General_Services_3.jpeg`
  so they fill their container.
- Cropping is allowed.
- Image must remain centered.

Acceptance criteria:
- Each specified image cover-fills its container (center crop).
- Built CSS contains the proof marker for Edit 7.
- Fix must override any services-specific “contain” rules that prevent fill.

Required targeting mechanism:
- Add the shared class to these four images (and only these):
  - `img-cover-center`

Verification:
- Automated: grader checks those four images have the class and that services CSS enables cover-fill for that class.
- Manual: confirm fill + centered crop.

## Non-goals (explicit)

- No pricing feature work (do not touch `pricing-widget/**`).
- No copy rewrites unrelated to these edits.
- No unrelated redesigns, animation changes, or refactors.
