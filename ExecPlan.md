<!-- FILE: ExecPlan.md -->
# ExecPlan — SEO Indexability + Sitemap Compliance

## Active Override (2026-02-05) - SEO Indexability + Sitemap Compliance

Conflict resolution (priority order for this request):
1) This section's SEO/indexability requirements.
2) `AGENTS.md` guardrails (parallax must remain; minimal diffs; evidence-first) stay in force.
3) Other ExecPlans and the historical sections below.

Problem statement:
- Ensure every public HTML page is indexable by Google and that `sitemap.xml` meets Search Console requirements.
- Keep canonical URLs, robots directives, and favicon/manifest references consistent across all HTML pages.
- Make sitemap generation repeatable and verifiable via repo scripts.

Target pages:
- `index.html`
- `about.html`
- `services.html`
- `book.html`
- `contact.html`
- `privacy-policy.html`
- `niches/*.html` (all files listed by `rg --files -g "*.html"`)

Implementation constraints (hard rules):
- No visual or behavioral changes beyond SEO/indexability fixes.
- Do not add `noindex` or block crawling unless explicitly required.
- Derive sitemap URLs from each page's canonical link; include only indexable pages.
- `lastmod` must be W3C date format (`YYYY-MM-DD`) derived from file modification time.
- Use `scripts/seo-audit.js` to validate and regenerate `sitemap.xml`.
- Parallax must remain functional on mobile + desktop.

Stepwise execution (must follow):
1) Baseline: inventory HTML pages and compare canonicals vs current `sitemap.xml`.
2) Add/update SEO audit + sitemap generation scripts and update governance docs.
3) Regenerate `sitemap.xml` from canonical URLs and verify with `node scripts/seo-audit.js`.
4) Confirm no unintended `noindex` tags or robots blocks exist.

Acceptance criteria:
- `node scripts/seo-audit.js` passes with zero errors.
- `sitemap.xml` matches the canonical URLs for all indexable HTML pages.
- `robots.txt` advertises the sitemap and favicon/manifest references resolve.
- No visual or behavioral changes outside SEO scope.

Verification checklist:
- Run `node scripts/seo-audit.js`.
- If sitemap is out of sync, run `node scripts/seo-audit.js --write-sitemap` and re-run the audit.

Note: The remainder of this document is historical and should not be executed unless explicitly re-activated.

## Historical: Mobile URL-Bar White Overlay (Mobile-only)

Conflict resolution (priority order for this request):
1) This section's mobile URL-bar overlay requirements.
2) `AGENTS.md` guardrails (parallax must remain; minimal diffs; evidence-first) stay in force.
3) Other ExecPlans and the historical sections below.

Problem statement:
- Add a **white overlay bar** at the bottom of the mobile viewport that **covers the browser URL bar area** and **tracks its expand/collapse**.
- The overlay must be **mobile-only**; desktop must remain entirely unchanged.
- Page content must **scroll underneath** the bar (reveals from behind), not be pushed above it.

Target pages (all mobile HTMLs):
- `index.html`
- `about.html`
- `services.html`
- `book.html`
- `contact.html`
- `privacy-policy.html`
- `niches/*.html` (all files listed by `rg --files -g "*.html"`)

Implementation constraints (hard rules):
- Gate **mobile-only** via existing mobile breakpoint(s) and/or `matchMedia`; **desktop must not render the overlay** (height 0 or element not present).
- Track URL bar dynamics using `window.visualViewport` when available; listen to `visualViewport.resize` and `visualViewport.scroll`.
- Compute bottom occlusion as `max(0, innerHeight - (visualViewport.height + visualViewport.offsetTop))`, clamp to a conservative max to avoid spikes, and update a CSS var (e.g., `--urlbar-overlay-height`).
- Provide fallback when `visualViewport` is unavailable: default the CSS var to `env(safe-area-inset-bottom)` (or `0px`) and keep behavior stable.
- Overlay styling: `position: fixed; bottom: 0; left: 0; width: 100%; height: var(--urlbar-overlay-height); background: #fff; z-index` above page content; `pointer-events: none`.
- **Do not add bottom padding/margins** that push content upward; content must scroll under the overlay.
- Parallax must remain functional on mobile + desktop.

Stepwise execution (must follow):
1) Baseline measurement (mobile Safari + Chrome): log `visualViewport.height`, `visualViewport.offsetTop`, and `innerHeight` while expanding/collapsing the URL bar to determine expected overlay height behavior.
2) Implement a **shared** overlay element (prefer runtime injection in `src/js/app.js`) and global CSS (prefer `src/css/base/layout.css`) so all HTML pages get the overlay without manual duplication.
3) Add a mobile-only runtime updater: on `visualViewport` resize/scroll (plus `orientationchange`), set `--urlbar-overlay-height` on `document.documentElement` using the computed occlusion; use `requestAnimationFrame` to avoid layout thrash.
4) Verify on every HTML page that the overlay tracks the URL bar and content reveals from behind; confirm desktop has zero changes (overlay absent or height 0).

Acceptance criteria:
- Mobile (all HTML pages): white bar visibly covers the bottom URL bar area and **moves with** URL bar expand/collapse.
- Mobile: content scrolls underneath the bar (no artificial bottom spacing).
- Desktop: no overlay or layout changes; console remains clean.
- Parallax behavior unchanged on mobile + desktop.

Verification checklist (explicit desktop-unaffected checks):
- Mobile Safari + Mobile Chrome: scroll to collapse/expand URL bar; confirm overlay height updates and content reveals from behind.
- Desktop Chrome: confirm overlay does not exist or has height 0; compare computed styles/layout to baseline.

Note: The remainder of this document is historical for the prior Requested Edits 1-8 and should not be executed for this request unless explicitly re-activated.

## Purpose / Big Picture

Implement the **exact** Requested Edits 1–8 from `codex/REQUESTED_EDITS_SPEC.md` with:
- minimal targeted changes
- strict desktop-only vs mobile-only behavior
- root-cause-first execution (no guessing)
- automated verification (repo grader) + manual responsive QA

This ExecPlan is the authoritative runbook. Follow it in order.

---

## Scope

### In scope (ONLY these)

1) **Desktop only:** wrap Hero Shader copy + CTA buttons in a tightly-wrapping container for legibility. Mobile must remain unchanged from this desktop-only change.
2) **Desktop only (about.html):** Silverstone_22.jpg + Silverstone_28.jpg must fill container; neon border must tightly wrap container.
3) **Desktop only (services.html):** General_Services_*.webp images look pixelated (including baked-in overlay copy) — fix so desktop rendering is high-definition.
4) **Mobile only (services.html):** those General_Services_* cards render landscape — make them match niches image-card presentation (portrait 2:3 fit).
5) **services.html Innovation Gallery Neural Grid:** replace all 1:1 + 3:2 images with allowed `services_*` images per spec.
6) **services.html Innovation Gallery Neural Grid:** replace all 2:3 images with `*_1_Mobile.jpeg` / `*_2_Mobile.jpeg` / `*_3_Mobile.jpeg` with varied prefixes.
7) **Mobile only:** remove (hide) grey hero subheadings on shader hero so mobile hero shows only title + CTAs, **without moving** the title/CTAs.
8) **index.html:** recolor two specific sentences from white to grey (only those sentences).

### Out of scope (hard constraints)

- No redesigns, no new components, no typography changes beyond what is required for the 8 edits.
- Do NOT modify anything under `pricing-widget/**`.
- Do NOT change copy text except where explicitly requested (Edit 8).
- Do NOT add new pages.
- Avoid broad refactors; prefer narrow selector scoping.

---

## Key repo grounding (where changes must happen)

- Hero layout/styling: `src/css/components/hero.css` (hero `.title-band`, `.content`, mobile/desktop media queries)
- About page images in service rows: `about.html` (Silverstone_22/28) + **desktop-only override** in `src/css/pages/about.css` (or narrowly scoped override elsewhere)
- Services General_Services cards:
  - Markup: `services.html` (four `<picture>` blocks for General_Services_1, 2A, 2B, 3)
  - Styling: `src/css/pages/services.css` (mobile-only portrait 2:3 card behavior, scoped)
- Innovation Gallery Neural Grid content is injected by JS:
  - Source of truth: `src/js/gallery.js` (`CURATED_IMAGES`)
  - Grid container: `#neural-grid` on `services.html`
- Index sentences: `index.html` + a targeted CSS utility/class (scoped to only those sentences)

Reference mappings (must follow): `codex/ASSET_REPLACEMENT_MATRIX.md`

---

## Required web reading before implementation (Codex must do this)

Using web access, open and skim the three OpenAI Cookbook pages listed in the user request:
- GPT‑5.2 prompting guide (planning + instruction patterns)
- Evaluation flywheel (measure-first, resilient prompts)
- Codex Exec Plans (plan structure + checkpoints)

Extract only actionable execution patterns and apply them while following this ExecPlan.

If web access is unavailable, proceed using the repo’s docs.

---

## Progress tracking

- Date started: 2025-12-30
- Last checkpoint time: 2025-12-30
- Current milestone: M3 — Full regression + documentation (manual QA pending)
- Blocking issues: Manual QA not yet completed; `scripts/codex.setup.sh` still fails at `sharp` install but grader runs.

---

## Surprises & Discoveries

- `scripts/codex.setup.sh` failed while installing `sharp` (missing `vips/vips8`, EPERM in `/Users/quentingeczy/.npm`); `scripts/codex.requested-edits.sh` still ran but grader failed on missing proof marker (expected pre-implementation).
- OpenAI Cookbook takeaways applied:
  - Scope control: keep explicit non-goals, change only the minimum surface area tied to requirements, and validate after each micro-change.
  - ExecPlan discipline: keep the plan updated (progress, decisions, evidence) so it remains restartable.
  - Evaluation flywheel: measure baseline → implement targeted change → re-measure → record outcome.

---

## Decision Log

- Proceed with baseline recording and code changes despite `sharp` install failure because the grader script still runs and is the contract for validation. (Revisit if build steps require `sharp` later.)

---

## Outcomes & Retrospective

- Pending until all edits implemented and verified.

---

## Context and Orientation

- Pages: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`, `niches/*.html`.
- CSS: `src/css/**` → build via `npm run build:css` → `assets/css/styles.css`.
- JS: `src/js/**` → build via `npm run build:js` → `assets/js/app.js`.
- Validation: `bash scripts/codex.requested-edits.sh` (builds + runs `node scripts/assert-ui-spec.js`).

---

## Plan of Work

- M0: Setup + baseline (measure-first).
- M1: Root-cause confirmation + log notes.
- M2: Implement edits 1–8 in order with proof markers and per-edit validation.
- M3: Full regression + documentation (grader + manual QA + evidence table).

---

## Concrete Steps

1) Run setup + baseline grader; log failures.  
2) Confirm root causes per edit in `codex/UI_CHANGE_LOG.md`.  
3) Implement each edit in order; run `bash scripts/codex.requested-edits.sh` after each edit/group.  
4) Complete manual QA + evidence table + final summaries.

---

## Validation and Acceptance

- Automated: `bash scripts/codex.requested-edits.sh` must pass after each milestone and at end.
- Manual: `codex/MANUAL_QA_CHECKLIST.md` fully checked off for Edits 1–8.
- Evidence: ExecPlan table filled for each edit.

---

## Artifacts and Notes

- `codex/UI_CHANGE_LOG.md` (baseline, root-cause notes, iteration log, final summary).
- `codex/REPO_UI_MAP.md` (selectors + file map for edits).
- `codex/ASSET_REPLACEMENT_MATRIX.md` (deterministic image mapping).
- `codex/MANUAL_QA_CHECKLIST.md` (manual verification).

---

## Interfaces and Dependencies

- Build scripts: `build-css.js`, `scripts/build-js.js`.
- Grader: `scripts/assert-ui-spec.js`.

---

## Milestones & Stop/Go Gates

### M0 — Setup + baseline (measure-first)

1. Run setup:
   - `bash scripts/codex.setup.sh`
2. Run baseline grader:
   - `bash scripts/codex.requested-edits.sh`
3. Record baseline outcome (failures expected until edits implemented):
   - Update `codex/UI_CHANGE_LOG.md` → Baseline section

**GO / NO-GO gate:** Do not edit code until baseline is recorded.

---

### M1 — Repo analysis & root-cause confirmation

For each edit, confirm *where the behavior originates* (HTML/CSS/JS) and document a 1–3 sentence root cause in `codex/UI_CHANGE_LOG.md`.

Must specifically confirm:
- Hero shader content structure uses `.hero.title-band .content` across pages.
- About images have `img-cover-center` but are overridden by a more specific rule on desktop.
- Services General_Services “pixelation” is due to desktop selecting `.webp` sources (and the baked-in text is visibly degraded).
- Services mobile card aspect mismatch is caused by page-specific aspect-ratio/contain rules overriding the mobile card behavior.
- Innovation Gallery images are injected by `src/js/gallery.js` (not the fallback HTML), so replacements must occur there.

**GO / NO-GO gate:** You may proceed only after each root cause is written down.

---

### M2 — Implement edits with isolated changes + proof markers

Implement in order, running the grader after each edit (or small edit group) and keeping changes minimal.

#### Edit 1 — Desktop-only hero copy+CTA tight container
- Implement in `src/css/components/hero.css`.
- Must be desktop-only.
- Add proof marker:
  - `SPEC: HERO_DESKTOP_COPY_CTA_TIGHT_CONTAINER_2025_12_30`

Checkpoint:
- Run `bash scripts/codex.requested-edits.sh`
- Manual: Desktop hero shows container around copy+CTA; mobile unaffected by this desktop-only styling.

#### Edit 7 — Mobile-only hero grey subheading removal (no layout shift)
- Implement in `src/css/components/hero.css` under mobile media query.
- Hide the hero subheading text while preserving layout spacing so title/CTAs do not move.
- Add proof marker:
  - `SPEC: HERO_MOBILE_HIDE_GREY_SUBHEADINGS_PRESERVE_LAYOUT_2025_12_30`

Checkpoint:
- Run grader
- Manual: Mobile hero shows no grey subheading text; title+CTAs sit exactly where they did before.

#### Edit 2 — About desktop image fill + neon border wrap
- Implement as desktop-only override in `src/css/pages/about.css` (preferred) targeting the `img-cover-center` images for Silverstone_22 and Silverstone_28.
- Add proof marker:
  - `SPEC: ABOUT_DESKTOP_SILVERSTONE_22_28_COVER_FILL_NEON_WRAP_2025_12_30`

Checkpoint:
- Run grader
- Manual: desktop about service-row images fill container (no letterboxing), border is tight to container.

#### Edit 3 — Services desktop HD for General_Services images
- Implement in `services.html`: change picture sources so desktop does not use the pixelated `.webp` versions.
- Must remain desktop-only in effect (keep mobile webp).
- Add proof marker in `services.html`:
  - `SPEC: SERVICES_DESKTOP_GENERAL_SERVICES_IMAGES_HD_2025_12_30`

Checkpoint:
- Run grader
- Manual: Desktop services page image text looks crisp at 125–200% zoom.

#### Edit 4 — Services mobile General_Services cards portrait 2:3 (match niches)
- Add a scoped class hook in `services.html` on the four General_Services image-card wrappers (see spec).
- Add mobile-only CSS in `src/css/pages/services.css` so these cards render as portrait 2:3 and match niches styling.
- Add proof marker:
  - `SPEC: SERVICES_MOBILE_GENERAL_SERVICES_CARDS_PORTRAIT_2_3_2025_12_30`

Checkpoint:
- Run grader
- Manual: Mobile services General_Services cards are portrait (2:3) and visually consistent with niches image-card treatment.

#### Edits 5 & 6 — Innovation Gallery Neural Grid image replacements
- Implement in `src/js/gallery.js` by replacing `CURATED_IMAGES` file entries per `codex/ASSET_REPLACEMENT_MATRIX.md`.
- Add proof markers in `src/js/gallery.js`:
  - `SPEC: SERVICES_NEURAL_GRID_REPLACE_SQUARE_LANDSCAPE_2025_12_30`
  - `SPEC: SERVICES_NEURAL_GRID_REPLACE_PORTRAIT_2025_12_30`

Checkpoint:
- Run grader
- Manual: Services Innovation Gallery shows the new assets; no filenames with `1-1`, `3-2`, `2-3` remain in the source list.

#### Edit 8 — Index subtitle sentences white → grey
- Implement by adding a dedicated class to the exact two sentences (preferably by adding a class to their `<p>` tags) + defining that class’ color in CSS.
- Add proof marker in CSS near the class definition:
  - `SPEC: INDEX_SUBTITLES_GREY_TARGETED_SENTENCES_2025_12_30`

Checkpoint:
- Run grader
- Manual: Only those two sentences are grey; no other subtitles are unintentionally recolored.

---

### M3 — Full regression + documentation

1) Run final build + grader:
- `bash scripts/codex.requested-edits.sh`

2) Complete manual checklist:
- `codex/MANUAL_QA_CHECKLIST.md`

3) Update paper trail:
- `codex/UI_CHANGE_LOG.md` final summary section

**Definition of done:** grader passes + manual QA complete + evidence table below filled.

---

## Evidence table (must be filled before final “done”)

For each row: list files changed + proof marker + how verified.

| Edit | Desktop/Mobile scope | Files changed (paths) | Proof marker | Automated verification | Manual verification notes |
|---:|---|---|---|---|---|
| 1 | Desktop only | `src/css/components/hero.css` | HERO_DESKTOP_COPY_CTA_TIGHT_CONTAINER_2025_12_30 | `bash scripts/codex.requested-edits.sh` | Pending manual QA |
| 2 | Desktop only (about) | `src/css/pages/about.css` | ABOUT_DESKTOP_SILVERSTONE_22_28_COVER_FILL_NEON_WRAP_2025_12_30 | `bash scripts/codex.requested-edits.sh` | Pending manual QA |
| 3 | Desktop only (services) | `services.html` | SERVICES_DESKTOP_GENERAL_SERVICES_IMAGES_HD_2025_12_30 | `bash scripts/codex.requested-edits.sh` | Pending manual QA |
| 4 | Mobile only (services) | `services.html`, `src/css/pages/services.css` | SERVICES_MOBILE_GENERAL_SERVICES_CARDS_PORTRAIT_2_3_2025_12_30 | `bash scripts/codex.requested-edits.sh` | Pending manual QA |
| 5 | All devices (services gallery) | `src/js/gallery.js` | SERVICES_NEURAL_GRID_REPLACE_SQUARE_LANDSCAPE_2025_12_30 | `bash scripts/codex.requested-edits.sh` | Pending manual QA |
| 6 | All devices (services gallery) | `src/js/gallery.js` | SERVICES_NEURAL_GRID_REPLACE_PORTRAIT_2025_12_30 | `bash scripts/codex.requested-edits.sh` | Pending manual QA |
| 7 | Mobile only | `src/css/components/hero.css` | HERO_MOBILE_HIDE_GREY_SUBHEADINGS_PRESERVE_LAYOUT_2025_12_30 | `bash scripts/codex.requested-edits.sh` | Pending manual QA |
| 8 | Index only | `index.html`, `src/css/pages/home.css` | INDEX_SUBTITLES_GREY_TARGETED_SENTENCES_2025_12_30 | `bash scripts/codex.requested-edits.sh` | Pending manual QA |

---

## Idempotence & Recovery

- Keep each edit minimal and scoped by page class (`.page-services`, `.page-about`) and by media query as required.
- If a change causes unexpected cross-page impact:
  - revert the smallest change
  - tighten selector scoping or move it into the page-specific CSS file
- Do not remove proof markers; the grader requires them.
- Do not bypass the build step; always run the repo script to rebuild and validate.
