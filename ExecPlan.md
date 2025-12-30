<!-- FILE: ExecPlan.md -->
# ExecPlan — Requested Edits 1–8 (Hero / About / Services / Neural Grid / Index)

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

- Date started:
- Last checkpoint time:
- Current milestone:
- Blocking issues:

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
| 1 | Desktop only |  | HERO_DESKTOP... | `bash scripts/codex.requested-edits.sh` |  |
| 2 | Desktop only (about) |  | ABOUT_DESKTOP... | `bash scripts/codex.requested-edits.sh` |  |
| 3 | Desktop only (services) |  | SERVICES_DESKTOP... | `bash scripts/codex.requested-edits.sh` |  |
| 4 | Mobile only (services) |  | SERVICES_MOBILE... | `bash scripts/codex.requested-edits.sh` |  |
| 5 | All devices (services gallery) |  | SERVICES_NEURAL_GRID... | `bash scripts/codex.requested-edits.sh` |  |
| 6 | All devices (services gallery) |  | SERVICES_NEURAL_GRID... | `bash scripts/codex.requested-edits.sh` |  |
| 7 | Mobile only |  | HERO_MOBILE... | `bash scripts/codex.requested-edits.sh` |  |
| 8 | Index only |  | INDEX_SUBTITLES... | `bash scripts/codex.requested-edits.sh` |  |

---

## Idempotence & Recovery

- Keep each edit minimal and scoped by page class (`.page-services`, `.page-about`) and by media query as required.
- If a change causes unexpected cross-page impact:
  - revert the smallest change
  - tighten selector scoping or move it into the page-specific CSS file
- Do not remove proof markers; the grader requires them.
- Do not bypass the build step; always run the repo script to rebuild and validate.
