<!-- FILE: ExecPlan.md -->
# ExecPlan — Shader + Hero + Subtitle + Image Fit (Requested Edits 1–6)

## Status

- Date created/updated: 2025-12-29
- Owner: Codex CLI run (model: GPT-5.2 Codex)
- Target command (must pass at end): `bash scripts/codex.requested-edits.sh`

Progress (update as you go):
- [x] Gate 0 — Setup + baseline validation run captured
- [x] Gate 1 — Discovery + repo map updated
- [x] Gate 2 — Implementation approach written + scoped
- [x] Gate 3 — Implemented Requested Edits 1–6 (only)
- [x] Gate 4 — Automated verification passes
- [ ] Gate 5 — Manual QA checklist completed
- [ ] Gate 6 — Regression scan + final evidence table completed

---

## 0) Source of truth + scope guardrails

### Source of truth documents
- `codex/REQUESTED_EDITS_SPEC.md` (requirements, acceptance criteria, proof markers)
- `codex/VERIFICATION_PROTOCOL.md` (how to verify + what counts as proof)

### Scope guardrails (non-negotiable)
- Implement **exactly and only** Requested Edits **1–6**.
- Do **not** redesign unrelated sections, change copy, or refactor code unrelated to these edits.
- Any mention elsewhere of “Pricing Feature Implementation” is a **mislabel** and must be ignored.

### Requested Edits (1–6)
1. Shader colors per page:
   - `about.html` shader: **purple**
   - `services.html` hero shader: **green**
   - `book.html` shader: **bright neon pink**
   - `contact.html` hero shader: **fire orange**
2. Remove the blurred/background “glass” container behind hero copy + CTA buttons; keep copy/CTAs **extremely legible** (mobile + desktop) without obstructing shader.
3. On `index.html`, make the “Streamline workflows” button text stay on **one line**.
4. Across ALL pages (including `niches/*.html`), change the “white subheadings” (white subtitles under blue titles) to **grey**.
5. On `services.html` and `niches/*.html`, ensure the image **fills its card**:
   - Cropping allowed only in **width**
   - Must **not crop height**
   - Crop the **minimum necessary**
6. On `about.html`, ensure the image fits the card and **all copy in the image is visible** (copy near the top for two images).

---

## Gate 0 — Setup + baseline (measure-first)

### Goal
Confirm build + validator baseline. Record what fails before changes.

### Steps
1. Install/build:
   - `bash scripts/codex.setup.sh`
2. Run baseline validation:
   - `bash scripts/codex.requested-edits.sh`
3. Record baseline results in:
   - `codex/UI_CHANGE_LOG.md` under “Baseline”

### Exit criteria
- Baseline failures recorded with exact command output (or summarized bullet list).

---

## Gate 1 — Discovery (map before changing)

### Goal
Identify exactly where each requirement is implemented in this repo (files + selectors + attributes).

### Mandatory discovery tasks
1. Shader system mapping:
   - Identify where the shader palette/themes live.
   - Identify how each page selects a variant (e.g., data attributes).
2. Hero legibility mapping:
   - Identify the CSS rule that creates the blurred/glass container behind hero content.
   - Identify the hero typography + CTA layout rules.
3. Subtitle system mapping:
   - Find the selector for “section subtitles” and why they appear white.
   - Identify any inline styles that force subtitle colors.
4. Service/niche image fit mapping:
   - Locate the CSS rule(s) controlling `.service-image` / `.service-img`.
   - Confirm mobile vs desktop behavior.
5. About image behavior:
   - Confirm which about images have embedded copy near the top.
   - Confirm current `object-fit` and `object-position` behavior.

### Discovery artifact updates
Update these documents with your findings:
- `codex/REPO_UI_MAP.md` (add file paths, selectors, pitfalls)
- `codex/UI_CHANGE_LOG.md` (note discoveries that affect approach)

### Exit criteria
- Repo map updated with concrete pointers for each of the six edits.

---

## Gate 2 — Approach (write plan before edits)

### Goal
Write an implementation approach that is:
- minimal
- reversible
- testable (automated checks + manual QA)
- uses proof markers (SPEC tags) so validators can confirm changes

### Required approach format (write in `codex/UI_CHANGE_LOG.md`)
For each requested edit:
- Proposed change location(s)
- Minimal change strategy
- Risks + mitigations
- How you’ll verify (automated + manual)
- Proof marker(s) you’ll add

### Web research requirement
If anything is uncertain (e.g., neon pink / fire orange palette choices, or CSS technique to crop width but not height):
- Use internet search to confirm best practice
- Record only the conclusion in `codex/UI_CHANGE_LOG.md` (no long quotes)

### Exit criteria
- A per-edit approach exists in the change log and is aligned with `codex/REQUESTED_EDITS_SPEC.md`.

---

## Gate 3 — Implementation (edit-by-edit with micro-gates)

### Rules for implementation
- Implement edits in this order to reduce rework:
  1) Shader variants/colors per page  
  2) Hero glass panel removal + typography/layout tweaks  
  3) Subtitle grey globally (including inline overrides)  
  4) Index button nowrap  
  5) Services + niche images fill (width crop only)  
  6) About images copy visible (no crop; top-safe)
- After each edit, run:
  - `npm run build:css` and/or `npm run build:js` as applicable
  - the relevant validator(s) listed in `codex/VERIFICATION_PROTOCOL.md`

### Required proof markers (must be added)
Add the SPEC markers defined in `codex/REQUESTED_EDITS_SPEC.md` near the final implementation points.

### Micro-gate after each edit
- [ ] Build outputs updated successfully
- [ ] Validators related to that edit pass (or failures understood and logged)
- [ ] No unrelated file changes introduced

---

## Gate 4 — Automated verification (must all pass)

Run:
- `bash scripts/codex.requested-edits.sh`

Exit criteria:
- The script passes fully with no errors.

---

## Gate 5 — Manual QA (visual + responsive)

Follow:
- `codex/MANUAL_QA_CHECKLIST.md`

Exit criteria:
- Manual checklist completed with notes (or explicit known limitations, ideally none).

---

## Gate 6 — Regression scan + final evidence

### Regression scan
1. Confirm scope discipline:
   - Check changed file list (diff/stat) and ensure changes map only to edits 1–6.
2. Confirm no broken builds:
   - `npm run build`
3. Spot check additional pages:
   - At least 2–3 niche pages (different templates) for subtitle grey + hero legibility + image fill.

### Final evidence table (must be filled before completion)

Fill this table in-place (or replicate in `codex/UI_CHANGE_LOG.md`):

- Edit 1 — Shader colors per page  
  Evidence: `about.html` data-variant="default", `services.html` data-variant="green", `book.html` data-variant="pink", `contact.html` data-variant="orange"; theme map in `src/js/hero-shader.js` with `SPEC: SHADER_COLORS_PER_PAGE_2025_12`; `node scripts/validate-core-pages.js` + `bash scripts/codex.requested-edits.sh` pass.

- Edit 2 — Hero glass panel removed + legibility maintained  
  Evidence: `.hero.title-band .content` in `src/css/components/hero.css` has no background/border/shadow/blur and includes `SPEC: HERO_NO_GLASS_PANEL_2025_12`; `node scripts/validate-requested-edits.js --strict` pass; manual QA pending (see checklist).

- Edit 3 — Index “Streamline workflows” one-line button  
  Evidence: `index.html` anchor has `btn-nowrap`; `.btn-nowrap` rule + `SPEC: INDEX_STREAMLINE_WORKFLOWS_NOWRAP_2025_12` in `src/css/components/buttons.css`; `node scripts/validate-requested-edits.js --strict` pass; manual QA pending.

- Edit 4 — Section subtitles grey across all pages (incl. niches)  
  Evidence: `.section-subtitle` uses `var(--color-silver-original)` + `SPEC: SECTION_SUBTITLES_GREY_GLOBAL_2025_12` in `src/css/base/layout.css`; inline `color: var(--color-silver)` removed from core + niche HTML; `node scripts/validate-requested-edits.js --strict` pass.

- Edit 5 — Services + niches images fill card (width crop only; no height crop)  
  Evidence: `.page-services/.page-niche .service-img` fill rule + `SPEC: SERVICES_NICHES_IMAGES_FILL_CARD_NO_HEIGHT_CROP_2025_12` in `src/css/components/cards.css` with `height: 100%`, `width: auto`, `max-width: none`, centering; services/niche overrides aligned in `src/css/pages/services.css` + `src/css/pages/estate-agents.css`; `node scripts/validate-requested-edits.js --strict` pass; manual QA pending.

- Edit 6 — About images: copy visible (top-safe)  
  Evidence: `.page-about .service-image img` in `src/css/pages/about.css` uses `object-fit: contain` + `object-position: top center` with `SPEC: ABOUT_IMAGES_COPY_VISIBLE_NO_CROP_2025_12`; `node scripts/validate-requested-edits.js --strict` pass; manual QA pending.

Exit criteria:
- Evidence recorded for all six edits.

---

## Recovery + rollback guidance

If a validation fails or a change creates unintended layout shifts:
- Revert the smallest change set first (single file / single rule).
- Prefer targeted selectors over global overrides.
- Keep “about” image rules isolated from “services/niche” rules.

If uncertain about intent:
- Do not invent new design directions.
- Choose the most conservative change that satisfies the requirement and document why.
