<!-- FILE: ExecPlan.md -->
# Hero shader colors + hero layout (no glass) + subtitle grey + index pill nowrap + image cover-fill (Requested Edits 1–7)

This ExecPlan is a **living document**. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan must be maintained in accordance with `PLANS.md`.

## Purpose / Big Picture

From a visitor’s perspective, after this change:

- Each main page has a distinct hero shader color (about neon yellow; services green; book neon pink; contact fire orange).
- Hero copy + CTA buttons are readable without sitting inside a blurred/glass “panel,” and they no longer block the shader animation running across the middle of the hero.
- The index “Streamline Workflows” pill button stays on one line and looks balanced.
- Body-section subtitles directly under blue section titles are grey (not white) across **all** pages including `niches/*.html`, with explicit exclusions.
- The specified about/services images fill their cards using center-crop (object-fit cover), so cards look polished.

How to see it working:
- Build bundles and run the grader: `bash scripts/codex.requested-edits.sh` (must pass).
- Manually spot-check pages in a browser using `codex/MANUAL_QA_CHECKLIST.md`.

## Progress

- [x] (2025-12-30 12:56Z) Gate 0 — Setup and baseline captured in `codex/UI_CHANGE_LOG.md`.
- [x] (2025-12-30 12:57Z) Gate 1 — Discovery complete; `codex/REPO_UI_MAP.md` updated for all edits.
- [x] (2025-12-30 12:58Z) Gate 2 — Implementation approach written per edit in `codex/UI_CHANGE_LOG.md`.
- [x] (2025-12-30 12:59Z) Gate 3 — Requested Edit 1 implemented and verified.
- [x] (2025-12-30 13:00Z) Gate 4 — Requested Edits 2–3 implemented and verified (hero glass removed + hero content repositioned).
- [x] (2025-12-30 13:01Z) Gate 5 — Requested Edit 4 implemented and verified (index button one line).
- [x] (2025-12-30 13:01Z) Gate 6 — Requested Edit 5 implemented and verified (qualifying subtitles grey across all pages).
- [x] (2025-12-30 13:02Z) Gate 7 — Requested Edits 6–7 implemented and verified (image cover-fill).
- [ ] (YYYY-MM-DD HH:MMZ) Gate 8 — Automated validation passing + manual QA complete + evidence table filled.

## Surprises & Discoveries

Record unexpected behaviors, hidden dependencies, or confusing selectors.

- Observation:
  - Evidence:

## Decision Log

Record every notable decision.

- Decision:
  - Rationale:
  - Date/Author:

## Outcomes & Retrospective

Summarize outcomes, gaps, and lessons learned at the end of the work (or at major milestones).

## Context and Orientation

Key repo structure (restate for novices):

- Pages:
  - Root: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`
  - Niche pages: `niches/*.html` (all in scope for hero and subtitle changes)
- CSS pipeline:
  - Source: `src/css/**`
  - Output: `assets/css/styles.css` via `npm run build:css`
- JS pipeline:
  - Source: `src/js/**`
  - Output: `assets/js/app.js` via `npm run build:js`
- Hero shader implementation:
  - Source module: `src/js/hero-shader.js` (bundled into `assets/js/app.js`)
  - Variant chosen via `data-variant` on `#hero-shader-canvas` in each page.
- Validation tooling:
  - `bash scripts/codex.requested-edits.sh` rebuilds bundles and runs `node scripts/assert-ui-spec.js`.

Source-of-truth specification:
- `codex/REQUESTED_EDITS_SPEC.md` (requirements + proof markers)
- `codex/VERIFICATION_PROTOCOL.md` (how to verify + what “done” means)

## Plan of Work

Milestones (each must be independently verifiable):

### Milestone 0 — Setup + baseline (Measure-first)
Goal:
- Confirm environment builds and capture baseline failures.

Work:
- Run `bash scripts/codex.setup.sh`.
- Run `bash scripts/codex.requested-edits.sh` and record failures in `codex/UI_CHANGE_LOG.md` under “Baseline”.

Proof:
- Baseline output captured.

### Milestone 1 — Discovery & mapping
Goal:
- Identify exactly where each requested edit is controlled.

Work:
- Read relevant HTML/CSS/JS files.
- Run `node scripts/ui-audit.js` to print current page inventory and hero variants.
- Update `codex/REPO_UI_MAP.md` with:
  - file paths
  - selectors/classes
  - relevant constraints/pitfalls

Proof:
- REPO_UI_MAP updated for all edits.

### Milestone 2 — Requested Edit 1 (shader colors per page)
Goal:
- About/services/book/contact heroes use the correct shader colors.

Work:
- Implement per-page shader variants and theme values.
- Ensure HTML per page sets the correct `data-variant`.
- Add proof marker: `SPEC: REQ1_HERO_SHADER_COLORS_PER_PAGE_2025_12_30`.

Proof:
- `bash scripts/codex.requested-edits.sh` passes the Req 1 assertions for variant mapping and theme presence.

### Milestone 3 — Requested Edits 2–3 (remove hero glass + reposition hero content)
Goal:
- Remove blurred/glass hero panel and reposition hero copy/CTAs so they do not sit over the shader midline (desktop + mobile), while remaining readable.

Work:
- Remove the glass/blur look (no backdrop blur, no translucent panel).
- Adjust typography and layout placement to keep the midline visually open.
- Add proof markers:
  - `SPEC: REQ2_HERO_GLASS_PANEL_REMOVED_2025_12_30`
  - `SPEC: REQ3_HERO_COPY_CTA_POSITIONED_OFF_MIDLINE_2025_12_30`

Proof:
- `bash scripts/codex.requested-edits.sh` passes hero CSS assertions.
- Manual QA confirms the midline is not obstructed.

### Milestone 4 — Requested Edit 4 (index “Streamline Workflows” one line)
Goal:
- The “Streamline workflows” pill button on index stays on one line and is visually centered with balanced spacing.

Work:
- Add a targeted class to the specific button and apply nowrap + centering styling.
- Add proof marker: `SPEC: REQ4_INDEX_STREAMLINE_WORKFLOWS_ONE_LINE_2025_12_30`.

Proof:
- `bash scripts/codex.requested-edits.sh` passes the index nowrap assertion.

### Milestone 5 — Requested Edit 5 (qualifying subtitles grey across all pages)
Goal:
- Any qualifying subtitle under a blue section title in body sections becomes grey across root pages and all `niches/*.html`, excluding subtitles inside cards/CTA banners/pill buttons.

Work:
- Implement a narrowly-scoped CSS rule that targets only qualifying subtitles (definition in spec).
- Remove/avoid inline color overrides that force white for qualifying subtitles.
- Add proof marker: `SPEC: REQ5_SECTION_SUBTITLES_GREY_2025_12_30`.

Proof:
- `bash scripts/codex.requested-edits.sh` passes the subtitle rule presence assertion.
- Manual QA confirms multiple pages (including niche pages) show grey subtitles under blue titles.

### Milestone 6 — Requested Edits 6–7 (image cover-fill)
Goal:
- About page: `Silverstone_22.jpg` and `Silverstone_28.jpg` fill their containers (center-crop).
- Services page: `General_Services_1.jpeg`, `General_Services_2A.jpeg`, `General_Services_2B.jpeg`, `General_Services_3.jpeg` fill their containers (center-crop).

Work:
- Add a narrowly-scoped utility/class for “cover + center” and apply it only to the required images.
- Ensure CSS on services page properly overrides any contain/centering overrides that would prevent cover-fill.
- Add proof markers:
  - `SPEC: REQ6_ABOUT_IMAGES_COVER_CENTER_2025_12_30`
  - `SPEC: REQ7_SERVICES_IMAGES_COVER_CENTER_2025_12_30`

Proof:
- `bash scripts/codex.requested-edits.sh` passes image assertions.
- Manual QA confirms images are centered and cropped by card bounds.

### Milestone 7 — Final verification + evidence capture
Goal:
- Prove all edits are correct and complete.

Work:
- Run `bash scripts/codex.requested-edits.sh` (must pass).
- Complete `codex/MANUAL_QA_CHECKLIST.md`.
- Fill the evidence table below.

Proof:
- All checks passed + evidence table completed.

## Concrete Steps

All commands are run from the repository root.

1) Setup:
- `bash scripts/codex.setup.sh`

2) Baseline validation:
- `bash scripts/codex.requested-edits.sh`

3) During implementation (after each edit or micro-gate):
- `bash scripts/codex.requested-edits.sh`

4) Manual QA:
- Follow `codex/MANUAL_QA_CHECKLIST.md`.

## Validation and Acceptance

Acceptance criteria are defined in:
- `codex/REQUESTED_EDITS_SPEC.md`

Automated grader contract:
- `bash scripts/codex.requested-edits.sh` must pass.

Manual QA contract:
- `codex/MANUAL_QA_CHECKLIST.md` must be completed.

## Final evidence table (fill before completion)

- Edit 1 — Per-page hero shader colors
  - Evidence: `bash scripts/codex.requested-edits.sh` PASS (2025-12-30)
  - Proof marker: `SPEC: REQ1_HERO_SHADER_COLORS_PER_PAGE_2025_12_30`
  - Pages verified: about.html, services.html, book.html, contact.html (automated); manual QA pending

- Edit 2 — Hero glass/blur panel removed
  - Evidence: `bash scripts/codex.requested-edits.sh` PASS (2025-12-30)
  - Proof marker: `SPEC: REQ2_HERO_GLASS_PANEL_REMOVED_2025_12_30`
  - Pages verified: all hero pages (automated); manual QA pending

- Edit 3 — Hero copy/CTA placement and readability (no midline obstruction)
  - Evidence: `bash scripts/codex.requested-edits.sh` PASS (2025-12-30)
  - Proof marker: `SPEC: REQ3_HERO_COPY_CTA_POSITIONED_OFF_MIDLINE_2025_12_30`
  - Pages verified: all hero pages (automated layout check); manual QA pending

- Edit 4 — Index “Streamline Workflows” button one line + centered
  - Evidence: `bash scripts/codex.requested-edits.sh` PASS (2025-12-30)
  - Proof marker: `SPEC: REQ4_INDEX_STREAMLINE_WORKFLOWS_ONE_LINE_2025_12_30`
  - Pages verified: index.html (automated); manual QA pending

- Edit 5 — Qualifying section subtitles grey across all pages incl. niches
  - Evidence: `bash scripts/codex.requested-edits.sh` PASS (2025-12-30)
  - Proof marker: `SPEC: REQ5_SECTION_SUBTITLES_GREY_2025_12_30`
  - Pages verified: all pages (automated rule check); manual QA pending

- Edit 6 — About images cover-fill
  - Evidence: `bash scripts/codex.requested-edits.sh` PASS (2025-12-30)
  - Proof marker: `SPEC: REQ6_ABOUT_IMAGES_COVER_CENTER_2025_12_30`
  - Pages verified: about.html (automated); manual QA pending

- Edit 7 — Services images cover-fill
  - Evidence: `bash scripts/codex.requested-edits.sh` PASS (2025-12-30)
  - Proof marker: `SPEC: REQ7_SERVICES_IMAGES_COVER_CENTER_2025_12_30`
  - Pages verified: services.html (automated); manual QA pending

## Idempotence and Recovery

- The validation scripts are safe to re-run repeatedly.
- If a change causes unintended collateral styling:
  - Revert the smallest selector/rule first.
  - Prefer page-scoped selectors (`.page-about`, `.page-services`, `.page-niche`) and narrowly applied classes.
- Keep build outputs updated:
  - If source is updated (`src/css` or `src/js`), the corresponding bundle must be rebuilt in `assets/`.

## Artifacts and Notes

Where to record work:
- Baseline output, approach notes, and micro-gate results: `codex/UI_CHANGE_LOG.md`
- Discovery mapping: `codex/REPO_UI_MAP.md`

## Interfaces and Dependencies

- Node + npm (for build scripts and graders)
- Bash (for the primary validation scripts)
- A local static server for manual QA (any simple HTTP server is fine)

---

Change log note (required for plan edits):
- If you revise this ExecPlan while working, append a short note here describing what changed and why.
- 2025-12-30: Updated Progress gates 0–7 timestamps and filled evidence table with automated results; manual QA marked pending.
