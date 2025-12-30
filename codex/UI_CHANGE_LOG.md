<!-- FILE: codex/UI_CHANGE_LOG.md -->
# UI Change Log (Evaluation Flywheel Logbook)

Use this file to record:
- baseline failures
- discoveries that change your approach
- the per-edit implementation strategy
- verification evidence

This is the paper trail that lets a future contributor understand what happened and why.

## Baseline (Measure-first)

Date: 2025-12-30
- Environment notes: Node v24.7.0, npm 11.6.4; `bash scripts/codex.setup.sh` required escalated permissions to complete npm install.

Commands run:
- `bash scripts/codex.setup.sh`
- `bash scripts/codex.requested-edits.sh`

Baseline result (paste a concise summary of failures):
- Failures:
  - Missing proof markers REQ1–REQ7 in built bundles.
  - Per-page hero shader variants not set (about/services/book/contact all still `data-variant="blue"`); JS missing expected variant keys.
  - Hero glass/blur still present and hero layout still centered (REQ2/REQ3).
  - Index “Streamline workflows” button missing class hook and nowrap CSS (REQ4).
  - About and services images missing `img-cover-center` class and CSS rule (REQ6/REQ7).
- Suspected causes: Edits not yet implemented; baseline reflects pre-change state.

## Per-edit approach (fill before implementing)

For each Requested Edit, write:

### Edit 1 — Hero shader colors per page
Change locations: `about.html`, `services.html`, `book.html`, `contact.html` (`#hero-shader-canvas` `data-variant`); `src/js/hero-shader.js` theme map.
Risks: Variant key mismatch or colors not perceived as “neon”.
Mitigations: Use spec keys (`neon-yellow`, `green`, `neon-pink`, `fire-orange`) and vivid RGB theme values; re-run grader.
Proof marker: `SPEC: REQ1_HERO_SHADER_COLORS_PER_PAGE_2025_12_30` in `src/js/hero-shader.js`.
Verification: `bash scripts/codex.requested-edits.sh` + manual color check on about/services/book/contact.

### Edit 2 — Remove hero glass/blur container
Change locations: `src/css/components/hero.css` (`.hero.title-band .content`).
Risks: Readability decreases after removing panel.
Mitigations: Keep text shadow + adjust layout positioning for contrast without adding blur/backdrop.
Proof marker: `SPEC: REQ2_HERO_GLASS_PANEL_REMOVED_2025_12_30` in `src/css/components/hero.css`.
Verification: `bash scripts/codex.requested-edits.sh` + manual hero checks (desktop/mobile).

### Edit 3 — Hero copy/CTA placement (no midline obstruction)
Change locations: `src/css/components/hero.css` (`.hero`, `.hero.title-band`, `.hero.title-band .content`, mobile overrides).
Risks: Layout shifts could misalign CTA or overflow on small screens.
Mitigations: Use flex alignment (top/left) and bounded max-width; validate at mobile widths.
Proof marker: `SPEC: REQ3_HERO_COPY_CTA_POSITIONED_OFF_MIDLINE_2025_12_30` in `src/css/components/hero.css`.
Verification: `bash scripts/codex.requested-edits.sh` + manual midline visibility check.

### Edit 4 — Index “Streamline Workflows” one line
Change locations: `index.html` (add class `btn-streamline-workflows`); `src/css/pages/home.css` (nowrap + padding/width).
Risks: Button could overflow narrow widths.
Mitigations: Keep width capped via `min()` and allow modest padding increases only for the targeted class.
Proof marker: `SPEC: REQ4_INDEX_STREAMLINE_WORKFLOWS_ONE_LINE_2025_12_30` in `src/css/pages/home.css`.
Verification: `bash scripts/codex.requested-edits.sh` + quick mobile check.

### Edit 5 — Qualifying subtitles grey across all pages
Change locations: `src/css/base/layout.css` (targeted selector for `.section-title + .section-subtitle`).
Risks: Over-coloring subtitles inside cards/CTA banners.
Mitigations: Use direct-child selector `.section > .container > .section-title + .section-subtitle` and grey token `--color-silver-original`.
Proof marker: `SPEC: REQ5_SECTION_SUBTITLES_GREY_2025_12_30` in `src/css/base/layout.css`.
Verification: `bash scripts/codex.requested-edits.sh` + manual checks on root + 2 niche pages.

### Edit 6 — About images cover-fill
Change locations: `about.html` (add class `img-cover-center` to Silverstone_28/22 images); `src/css/base/layout.css` (define class).
Risks: Unintended impact on other images if class reused.
Mitigations: Apply class only to the two specified images.
Proof marker: `SPEC: REQ6_ABOUT_IMAGES_COVER_CENTER_2025_12_30` in CSS.
Verification: `bash scripts/codex.requested-edits.sh` + manual image crop check.

### Edit 7 — Services images cover-fill
Change locations: `services.html` (add `img-cover-center` class to four specified images); `src/css/pages/services.css` (override contain rules).
Risks: Existing `!important` contain rules may override.
Mitigations: Use more specific selectors with `!important` and set width/height to 100% with `object-fit: cover`.
Proof marker: `SPEC: REQ7_SERVICES_IMAGES_COVER_CENTER_2025_12_30` in CSS.
Verification: `bash scripts/codex.requested-edits.sh` + manual image crop check.

## Iteration log (Analyze → Measure → Improve)

Use one entry per loop.

- Loop:
  - Analyze (what failed; why):
  - Measure (what command; what changed in output):
  - Improve (what targeted change you made):
  - Result:

## Final summary (fill at the end)

- What changed (high-level):
- What commands pass:
- Any known limitations (ideally none):
- Where evidence is recorded (ExecPlan evidence table, QA checklist):
