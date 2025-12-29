<!-- FILE: codex/REQUESTED_EDITS_SPEC.md -->
# Requested Edits Specification (1–12)

Version: 2025-12-29  
Applies to: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `niches/*.html`, and the pricing widget.

This document is the **requirements contract**. Codex must implement these edits exactly and prove compliance via validation + manual QA.

## Global rules

- Only implement what is requested here (no unrelated redesigns).
- All changes must be grounded in existing repo patterns.
- When touching `src/css/**` or `src/js/**`, rebuild the generated bundles in `assets/`.
- Add the required `SPEC:` proof markers so validators can confirm completion.

## Proof markers required (must be added to the implementation)

These strings must exist in the relevant source files after implementation:

Pricing widget:
- `SS_PRICING_SPEC: LIGHT_MODE_BG_VIBRANCY_BOOST_2025_12`

Global typography / hero:
- `SPEC: GLOBAL_SECTION_SUBTITLE_GREY_2025_12`
- `SPEC: HERO_SUBTITLE_NONWHITE_2025_12`
- `SPEC: HERO_TEXT_LEGIBILITY_GLASS_PANEL_2025_12`
- `SPEC: HERO_CTA_GAP_2025_12`
- `SPEC: MOBILE_HERO_LAYOUT_TUNING_2025_12`

Images next to cards:
- `SPEC: SERVICES_IMAGE_NEON_BORDER_MATCH_NICHES_2025_12`
- `SPEC: SERVICE_IMAGES_CONTAIN_NO_CROP_2025_12`

Calendly:
- `SPEC: CALENDLY_EARLY_LOAD_2025_12`

Content updates:
- `SPEC: ABOUT_STATS_UPDATED_2025_12`
- `SPEC: INDEX_NO_HYPE_STATS_COPY_UPDATED_2025_12`

Index services images:
- `SPEC: INDEX_SERVICES_IMAGE_GRID_2025_12`
- `SPEC: INDEX_SERVICES_IMAGE_LIGHTBOX_2025_12`

Mobile menu behavior:
- `SPEC: MOBILE_MENU_BANNER_TWO_STEP_2025_12`

## Requested edits

### 1) Pricing widget “white background” tint vibrancy

Scope:
- Pricing widget surfaces on: `services.html`, `index.html`, `niches/*.html`
- Source of truth: `pricing-widget/src/pricing-widget.css`

Requirement:
- The pinks and blues in the light/white background must be **more vibrant/visible**, while preserving the overall aesthetic.

Constraints:
- Do not change the core layout of pricing cards.
- Avoid reducing text legibility; if contrast drops, adjust back.

Verification:
- Automated: `node scripts/validate-pricing-ui-tuning.js`
- Visual: open pages with pricing and confirm tint is visible at a glance.

### 2) services.html images: neon border must match niches

Scope:
- `services.html` images next to cards:
  - `assets/images/socialmedia/General_Services_1.webp`
  - `assets/images/socialmedia/General_Services_2A.webp`
  - `assets/images/socialmedia/General_Services_2B.webp`
  - `assets/images/socialmedia/General_Services_3.webp`
- Reference implementation: `niches/*.html` + `src/css/pages/estate-agents.css` (tight border technique)

Requirement:
- Services page images must have the **same neon border wrapping** as niche images: tight border, no extra inner padding, no cropping.

Constraints:
- Implement using the same technique as niche pages (padding 0 on wrapper, overflow hidden, object-fit contain, consistent radius).

Verification:
- Visual parity check: open a niche page and services page; compare border+padding behavior.
- Automated: `node scripts/validate-requested-edits.js --strict` (and existing services validator).

### 3) All pages: “white sentences” under blue section headings → grey

Scope:
- Applies to: `index.html`, `about.html`, `services.html`, `niches/*.html`, `book.html`, `contact.html`

Requirement:
- Any non-card sentence directly under blue section headings (typically `.section-title`) must be grey, not white.

Implementation guidance:
- Prefer changing the shared subtitle styling token / selector (e.g., `.section-subtitle`) rather than patching per-page.

Constraints:
- Do not change text inside cards.

Verification:
- Manual sweep of all pages listed above.

### 4) Hero subtitle must be a non-white color

Scope:
- Hero section across all pages using the shader title-band hero.

Requirement:
- The sentence directly under the hero title must not render as pure white.

Verification:
- Manual: check hero subtitle color is clearly not white.

### 5) Hero shader text legibility (premium approach)

Scope:
- Shader hero with animated canvas background.

Requirement:
- Make text noticeably more legible while keeping shader animation clearly visible.

Implementation guidance (premium/professional):
- Use a subtle glass/overlay behind the text block (not a heavy full-screen overlay).
- Prefer balanced contrast and a refined panel over extreme text shadows.

Verification:
- Manual: on desktop and mobile, the shader is visible and copy is readable instantly.

### 6) Hero CTA buttons spacing (all pages)

Scope:
- Any page with hero CTAs (observed: `index.html`, `services.html`, `niches/*.html`)

Requirement:
- Add spacing so stacked buttons never touch:
  - When buttons wrap horizontally on narrow widths
  - When buttons stack vertically on mobile

Verification:
- Manual: resize viewport until wrapping occurs.

### 7) Images next to cards: quality, fit, border

Scope:
- Pages: `about.html`, `services.html`, `niches/*.html`
- Targets: the “image next to card” layouts (service-row patterns).

Requirements:
- Images must not be pixelated.
- Images must not be cropped; must be fully visible.
- Neon border must be tight and consistent.
- Images should display high-definition; text inside images must not be visibly pixelated.

Implementation guidance:
- Ensure `object-fit: contain` (not cover) for these specific images.
- Verify referenced assets exist and are high-resolution.

Verification:
- Manual: open each page and inspect all service-row images.
- Automated: `node scripts/validate-requested-edits.js --strict`

### 8) Speed up Calendly integration loading

Scope:
- `book.html` embed.

Requirement:
- Calendly integration should load faster; avoid long buffering when user scrolls to it.

Implementation guidance:
- Initiate Calendly JS fetch earlier using preload and/or moving script earlier with `defer`.

Verification:
- Manual: hard refresh then scroll; widget should initialize noticeably faster.

### 9) about.html “Experience by the Numbers” update

Scope:
- `about.html` stats section.

Requirement:
Set the 4 stats to exactly:
- 17 Clients Served
- 18 Automations Delivered
- 2,300+ Hours Saved
- 9 Industries Served

Delete the “30 minute AI Audit” stat and replace it with “9 Industries Served”.

Verification:
- Automated: `node scripts/validate-requested-edits.js --strict`
- Manual: ensure animation still works and displays comma formatting.

### 10) index.html “No hype. Just measurable wins.” replacements

Scope:
- `index.html` stats section.

Requirements:
- Replace:
  - “100 Times Better Contact Odds in 5 Minutes” → “100% of all calls, emails and texts answered”
  - “80 Callers Lost to Voicemail” → “10x Lead Conversion Rate”
- Visual requirements:
  - “100%” and “10x” are blue
  - The rest of each sentence is white underneath
- Animation requirements:
  - Animate only numeric portion:
    - animate “100” not “%”
    - animate “10” not “x”

Implementation guidance:
- Use existing stats system support for suffixes via `data-plus` (so suffix is not independently animated).

Verification:
- Automated: `node scripts/validate-requested-edits.js --strict`
- Manual: observe animation in browser.

### 11) index.html “Our Services” section swap to images (+ lightbox)

Scope:
- `index.html` section currently using `.packages-grid` with 4 cards.

Requirements:
a) Delete all 4 cards and replace with images from `assets/images/socialmedia/`:
- Desktop:
  - `services_consulting.jpg`
  - `services_lead_followup.jpg`
  - `services_workflow_automation.jpg`
  - `services_data_integration.jpg`
b) Keep 2×2 grid like original cards on desktop.
c) Images must not be cropped; big enough that copy on image is readable.
   Add a well-designed button for each image linking to `services.html` or other relevant page.
d) Mobile: use images:
  - `services_consulting_mobile.jpg`
  - `services_lead_followup_mobile.jpg`
  - `services_workflow_automation_mobile.jpg`
  - `services_data_integration_mobile.jpg`
e) Mobile: stack images vertically with spacing.
f) Each image must open the same premium lightbox used by marquee images.
   Also make it obvious the images are clickable to expand.

Verification:
- Manual: click each image on desktop and mobile -> lightbox opens.
- Automated: `node scripts/validate-homepage-index-sections.js --strict` and `node scripts/validate-requested-edits.js --strict`

### 12) MOBILE ONLY fixes

#### 12a) Menu banner two-step interaction

Requirement (mobile only):
- First click on menu banner: only maximize the menu banner.
- Only after hamburger click should the panel appear.
- Only back button in panel closes it.
- When back pressed: panel slides out; banner stays maximized until panel fully out, then auto-minimize.

Verification:
- Manual mobile emulation.
- Automated static checks in `node scripts/validate-requested-edits.js --strict`.

#### 12b) Hero CTA buttons move up

Requirement (mobile only):
- Move hero CTA buttons up on every page with hero CTAs so they are visible above the URL bar.

Verification:
- Manual: mobile emulation + scroll position at load.

#### 12c) Hero shader title/subtitle mobile tuning

Requirement (mobile only):
- Move title up so it sits just under the maximized menu bar.
- Reduce subtitle font size and place it just under the title.

Verification:
- Manual mobile emulation.
