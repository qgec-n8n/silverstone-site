<!-- FILE: ExecPlan.md -->
# ExecPlan: Silverstone UI/UX + Content Fixes (Requested Edits 1–12, 2025-12)

Owner: Codex CLI (gpt-5.2-codex)  
Status: ACTIVE  
Last updated: 2025-12-29

## Mission

Implement the requested UI/UX fixes and content edits **exactly as specified** across:

- `index.html`
- `about.html`
- `services.html`
- `book.html`
- `contact.html`
- `niches/*.html`
- Pricing widget assets used on `index.html`, `services.html`, and `niches/*.html`

This ExecPlan is intentionally **checkpoint-heavy**. Do not skip gates.

## Hard constraints

- Do not introduce new UI/UX changes beyond the 12 requested edits.
- Do not rename files or restructure directories unless explicitly required by a requested edit.
- Do not “invent” selectors, IDs, or files. Use only what exists in the repo; if new hooks are needed, add the smallest possible ones and document them.
- Keep `src/` sources and built `assets/` outputs in sync by running the repo build scripts (do not hand-edit built bundles unless a build script cannot represent the change).

## Repo grounding map (key files)

HTML pages:
- `index.html` (body class: `page-home`)
- `services.html` (body class: `page-services`)
- `about.html` (body class: `page-about`)
- `book.html` (body class: `page-book`)
- `contact.html` (body class: `page-contact`)
- `niches/*.html` (body class: `page-niche`)

CSS sources (built by `node build-css.js` via `npm run build:css`):
- Global layout/typography: `src/css/base/layout.css`, `src/css/base/variables.css`
- Header/mobile nav: `src/css/components/header.css`
- Hero + shader overlay: `src/css/components/hero.css`
- Cards + service-image wrappers: `src/css/components/cards.css`
- Stats/counters: `src/css/components/stats.css`
- Home page sections/grid: `src/css/pages/home.css`
- Services page layout: `src/css/pages/services.css`
- Niche page styling (example): `src/css/pages/estate-agents.css` (contains the “tight neon image border” approach to replicate)

JS sources (built by `node scripts/build-js.js` via `npm run build:js`):
- Mobile menu + header indicator logic: `src/js/header-nav.js`
- Stats animation: `src/js/stats.js`
- Marquee + premium lightbox: `src/js/marquee.js`
- Hero shader canvas: `src/js/hero-shader.js`

Pricing widget (built from its subproject):
- Pricing CSS source: `pricing-widget/src/pricing-widget.css`
- Build output targets: `assets/css/pricing-widget.css`, `assets/js/pricing-widget.js`
- Build command: from repo root run `bash scripts/codex.requested-edits.sh` (or `cd pricing-widget && npm run build`)

Automated verification scripts:
- `scripts/codex.requested-edits.sh` (main pipeline)
- `scripts/validate-requested-edits.js` (requirements-focused checks)
- `scripts/validate-pricing-ui-tuning.js` (light-mode background alpha checks)
- `scripts/validate-services-page.js`, `scripts/validate-niche-pages.js`, `scripts/validate-core-pages.js`
- `scripts/validate-homepage-index-sections.js`
- `scripts/assert-ui-spec.js` (spec-marker enforcement)

## Success definition

All 12 requested edits are implemented, AND:

- `bash scripts/codex.requested-edits.sh` exits 0
- Manual QA checklist (`codex/MANUAL_QA_CHECKLIST.md`) passes on:
  - Desktop (Chrome): 1440×900
  - Mobile emulation (Chrome): 390×844 and 375×667
- No unrelated visual regressions on pages listed above

## Progress checklist (update as you work)

Discovery / baselines
- [ ] Run `bash scripts/codex.setup.sh`
- [ ] Run `bash scripts/codex.requested-edits.sh` to capture baseline failures (if any)
- [ ] Read: `codex/REQUESTED_EDITS_SPEC.md`, `codex/REPO_UI_MAP.md`, `PLANS.md`, `AGENTS.md`

Implementation phases (do in order; each phase has a gate)
- [ ] Phase 1 — Pricing light-mode vibrancy (Edit #1)
- [ ] Phase 2 — Services image neon border parity with niches (Edit #2)
- [ ] Phase 3 — “White sentences” under blue headings to grey (Edit #3)
- [ ] Phase 4 — Hero subtitle non-white + hero legibility premium approach (Edits #4–#5)
- [ ] Phase 5 — Hero CTA spacing (Edit #6)
- [ ] Phase 6 — Service-image quality: no crop, no pixelation, tight border (Edit #7)
- [ ] Phase 7 — Calendly load performance (Edit #8)
- [ ] Phase 8 — About stats copy update (Edit #9)
- [ ] Phase 9 — Index “No hype” stats copy + numeric-only animation (Edit #10)
- [ ] Phase 10 — Index “Our Services” image tiles + mobile variants + lightbox (Edit #11)
- [ ] Phase 11 — Mobile-only header/menu behavior (Edit #12a)
- [ ] Phase 12 — Mobile-only hero CTA/title/subtitle positioning (Edits #12b–#12c)

Finalization
- [ ] Run full pipeline again
- [ ] Complete manual QA checklist
- [ ] Update `codex/UI_CHANGE_LOG.md` with decisions and any deviations

## Execution strategy: phased with eval gates

Each phase follows the same pattern:

1. Discover: locate exact selectors/markup in the target files.
2. Implement: minimal changes only, add required `SPEC:` marker(s).
3. Build: run `npm run build:css` / `npm run build:js` / `pricing-widget` build if applicable.
4. Gate: run the relevant validator(s) and fix until green.
5. Verify: spot-check in a browser (manual QA slice for that phase).
6. Log: note any deviation or tricky decision in `codex/UI_CHANGE_LOG.md`.

### Phase 1 — Pricing light-mode background vibrancy (Requested Edit #1)

Goal: Make the pinks and blues in the pricing “white background” noticeably more vibrant/visible while preserving the existing aesthetic.

Primary files:
- `pricing-widget/src/pricing-widget.css` (source of background layers)
- `assets/css/pricing-widget.css` (built output)

Approach:
- Identify the light-mode background stack for `.ss-pricing[data-ss-pricing-page="index.html"]` and `.ss-pricing[data-ss-pricing-page="services.html"]` and `.ss-pricing[data-ss-pricing-page="niches/..."]`.
- Increase vibrancy by:
  - Slightly increasing the alpha of the pink/blue radial layers, and/or
  - Slightly decreasing the alpha of the white linear overlay layer,
  while staying within acceptable readability and “premium” look.

Required proof marker:
- Add or update: `SS_PRICING_SPEC: LIGHT_MODE_BG_VIBRANCY_BOOST_2025_12` near the tuned background declaration.

Gate:
- Run `node scripts/validate-pricing-ui-tuning.js`
- Ensure pricing pages visually retain “white” theme but with more visible pink/blue tint.

Rollback criteria:
- If text contrast on pricing cards decreases materially, reduce alphas and re-run checks.

### Phase 2 — Services images neon border parity with niches (Requested Edit #2)

Goal: `services.html` images next to the cards (General_Services_*.webp) must have the same tight neon border wrapping implemented on `niches/*.html`.

Primary files:
- `services.html` (image markup lives here)
- `src/css/pages/services.css` (services image wrapper styling)
- Reference for correct approach: `src/css/pages/estate-agents.css` (niche page service-image styling)

Approach:
- Compare how niche pages achieve the tight border:
  - `.page-niche .service-image.neon-card { padding: 0; overflow: hidden; }`
  - `.page-niche .service-image .service-img { object-fit: contain; }`
  - `.page-niche .service-image { aspect-ratio: 79 / 53; }`
- Replicate the same technique for `.page-services` (do not change niche styling).

Required proof marker:
- `SPEC: SERVICES_IMAGE_NEON_BORDER_MATCH_NICHES_2025_12` in `src/css/pages/services.css`.

Gate:
- Run `node scripts/validate-services-page.js --strict`
- Visual check: the neon border should “hug” the image with no extra inner padding and no cropping.

### Phase 3 — Section subtitles: white → grey (Requested Edit #3)

Goal: Across all listed pages, the sentence(s) directly under blue section headings (not inside cards) should be grey, not white.

Primary files:
- `src/css/base/layout.css` (section title/subtitle styling)
- Potentially `src/css/base/variables.css` (define a dedicated muted-grey token if needed)

Approach:
- Target the shared pattern used across pages: `.section-title` + `.section-subtitle`.
- Ensure the subtitle grey is visibly grey (not near-white) while remaining readable.
- Do not affect text inside `.neon-card` cards.

Required proof marker:
- `SPEC: GLOBAL_SECTION_SUBTITLE_GREY_2025_12` in `src/css/base/layout.css` (or variables file if you introduce a new token).

Gate:
- `node scripts/validate-requested-edits.js --strict` (covers this)

### Phase 4 — Hero subtitle non-white + premium legibility (Requested Edits #4–#5)

Goals:
- The sentence directly under the hero title is not pure white.
- Hero text is more legible while preserving a clearly visible shader animation.

Primary files:
- `src/css/components/hero.css`
- `src/js/hero-shader.js` (only if absolutely necessary; prefer CSS-first)

Approach (premium/professional):
- Keep the shader fully visible as the background, but add a subtle “glass” readability layer behind the hero text block:
  - semi-transparent dark panel
  - soft blur (backdrop-filter) where supported
  - subtle border using existing accent color language
- Reduce reliance on heavy text shadows; achieve readability via panel + balanced contrast.

Required proof markers:
- `SPEC: HERO_SUBTITLE_NONWHITE_2025_12`
- `SPEC: HERO_TEXT_LEGIBILITY_GLASS_PANEL_2025_12`

Gate:
- Manual visual: shader clearly visible; copy readable at first glance.
- `node scripts/validate-requested-edits.js --strict`

### Phase 5 — Hero CTA spacing (Requested Edit #6)

Goal: Across all pages with hero CTAs, stacked buttons never touch (both vertical and horizontal stacking).

Primary files:
- `index.html` (hero CTA markup differs from niche/services patterns)
- `src/css/components/hero.css`

Approach:
- Normalize hero CTA markup to use a consistent container (existing pattern: `.cta-buttons` on services/niches).
- Apply flex-wrap + gap on the CTA container; remove reliance on ad-hoc margins.

Required proof marker:
- `SPEC: HERO_CTA_GAP_2025_12`

Gate:
- Manual: shrink viewport to force wrapping; buttons always separated.
- `node scripts/validate-requested-edits.js --strict`

### Phase 6 — Service image quality & fit (Requested Edit #7)

Goal: Images next to cards (about/services/niches) are:
- not pixelated
- not cropped
- fully visible
- have a tight neon border
- appear high-definition (no accidental low-res or wrong asset)

Primary files:
- `about.html` (service-image assets and attributes)
- `src/css/components/cards.css` (shared service-image img rule currently uses object-fit)
- `src/css/pages/services.css`
- `src/css/pages/estate-agents.css` (reference)

Approach:
- Ensure service-image wrappers use `padding: 0` (tight border) where required.
- Ensure images use `object-fit: contain` (not cover) for these “next to cards” use cases.
- Verify referenced image files actually exist (no broken filenames).

Required proof marker:
- `SPEC: SERVICE_IMAGES_CONTAIN_NO_CROP_2025_12`

Gate:
- Manual: inspect each page and confirm no cropping and crisp text.
- `node scripts/validate-requested-edits.js --strict`

### Phase 7 — Speed up Calendly load (Requested Edit #8)

Goal: Calendly embed loads faster (less “buffering” when user scrolls to it).

Primary files:
- `book.html` (Calendly embed + script tag)
- Optional: a small JS hook in `src/js/` if needed for preloading (prefer HTML preload first)

Approach:
- Start downloading the Calendly JS earlier using preload and/or moving the script to head with `defer`.
- Keep existing `preconnect` and `preload` for CSS; add script preload as needed.

Required proof marker:
- `SPEC: CALENDLY_EARLY_LOAD_2025_12` in `book.html`.

Gate:
- Manual: hard refresh; scroll down—widget should initialize faster.
- `node scripts/validate-requested-edits.js --strict`

### Phase 8 — About page “Experience by the Numbers” updates (Requested Edit #9)

Goal: Replace the 4 stats to exactly:
- 17 Clients Served
- 18 Automations Delivered
- 2,300+ Hours Saved
- 9 Industries Served
Remove “30 minute AI Audit”.

Primary file:
- `about.html`

Approach:
- Update `data-target` values and `data-plus` (for 2,300+).
- Update labels and ensure the stats animation still works.

Required proof marker:
- `SPEC: ABOUT_STATS_UPDATED_2025_12` in `about.html`.

Gate:
- `node scripts/validate-requested-edits.js --strict`

### Phase 9 — Index “No hype. Just measurable wins.” stat copy (Requested Edit #10)

Goal:
- Replace two stat labels:
  - “100 Times Better Contact Odds in 5 Minutes” → “of all calls, emails and texts answered”
  - “80 Callers Lost to Voicemail” → “Lead Conversion Rate”
- Numbers become:
  - “100%” (blue), numeric-only animation: animate 100, suffix % static
  - “10x” (blue), numeric-only animation: animate 10, suffix x static

Primary file:
- `index.html` (stats section)

Approach:
- Use existing stats system: set `data-target="100" data-plus="%"` and `data-target="10" data-plus="x"`.
- Keep `.number` element as the blue styling hook; labels remain white.

Required proof marker:
- `SPEC: INDEX_NO_HYPE_STATS_COPY_UPDATED_2025_12` in `index.html`.

Gate:
- `node scripts/validate-requested-edits.js --strict`

### Phase 10 — Index “Our Services” becomes image tiles + mobile variants + lightbox (Requested Edit #11)

Goal:
- Remove 4 text cards in “Our Services” section and replace with 4 images from `assets/images/socialmedia/`.
- Desktop: 2×2 grid maintained.
- Mobile: use `*_mobile.jpg` and stack vertically with spacing.
- Images not cropped; copy readable.
- Each tile has a well-designed button linking to services/relevant.
- Each image opens the same premium lightbox used by marquee images.
- Make click-to-expand obvious on desktop and mobile.

Primary files:
- `index.html` (section markup)
- `src/css/pages/home.css` (grid item styling)
- `src/js/` (add minimal hook so clicking these images triggers premium lightbox)

Assets (must be used as provided):
- Desktop: `assets/images/socialmedia/services_consulting.jpg`, `services_lead_followup.jpg`, `services_workflow_automation.jpg`, `services_data_integration.jpg`
- Mobile: `assets/images/socialmedia/services_consulting_mobile.jpg`, `services_lead_followup_mobile.jpg`, `services_workflow_automation_mobile.jpg`, `services_data_integration_mobile.jpg`

Required proof markers:
- `SPEC: INDEX_SERVICES_IMAGE_GRID_2025_12` in `index.html`
- `SPEC: INDEX_SERVICES_IMAGE_LIGHTBOX_2025_12` in the JS that wires the click handler

Gate:
- Manual: click each image => premium lightbox opens; close works; button navigates.
- `node scripts/validate-homepage-index-sections.js --strict`
- `node scripts/validate-requested-edits.js --strict`

### Phase 11 — Mobile menu banner two-step behavior (Requested Edit #12a)

Goal (mobile only):
- First click on the menu banner (header indicator) only maximizes the banner/header.
- Only after clicking the hamburger (top right) should the nav panel appear.
- Only the back button in the panel closes it.
- When back is pressed: panel slides out; banner stays maximized until panel fully out; then auto-minimize.

Primary files:
- `src/js/header-nav.js`
- `src/css/components/header.css`

Approach:
- Adjust the header indicator click handler to call “show header” only (no panel open).
- Ensure nav toggle only opens the panel; do not allow it (or the backdrop) to close it.
- Keep existing slide-out animation; schedule minimize after the transition completes.

Required proof marker:
- `SPEC: MOBILE_MENU_BANNER_TWO_STEP_2025_12` in `src/js/header-nav.js`.

Gate:
- Manual mobile emulation.
- `node scripts/validate-requested-edits.js --strict` (static checks for handler wiring + marker)

### Phase 12 — Mobile hero CTA + shader title/subtitle positioning (Requested Edits #12b–#12c)

Goals (mobile only):
- Move hero CTA buttons up so they are fully visible above the URL bar.
- Shader hero: move title up so it sits just under the maximized menu bar.
- Reduce subtitle font size and place it just under the title.

Primary file:
- `src/css/components/hero.css`

Approach:
- Use mobile media queries to adjust `.title-band` padding/alignment and CTA layout.
- Avoid layout shifts on desktop.

Required proof marker:
- `SPEC: MOBILE_HERO_LAYOUT_TUNING_2025_12` in `src/css/components/hero.css`.

Gate:
- Manual mobile emulation: CTA visible immediately; title/subtitle placement correct.
- `node scripts/validate-requested-edits.js --strict`

## Surprises & discoveries (fill in during work)

- (none yet)

## Decision log (fill in during work)

- (none yet)

## Outcomes & retrospective (fill in at end)

- (pending)
