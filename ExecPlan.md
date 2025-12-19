<!-- FILE: ExecPlan.md -->
# ExecPlan — Requested Front-End Edits (1–8)

## Canonical references
- Spec (single source of truth): `codex/REQUESTED_EDITS_SPEC.md`
- Guardrails: `AGENTS.md`
- ExecPlan rules: `PLANS.md`

## Goal
Implement requested edits **1–8** exactly as described in the Spec, with deterministic validation and minimal diffs.

## Non-goals
- No redesigns, refactors, or “nice-to-haves”.
- Do not change pricing copy data (`PRICING_COPY_MAP.md`, `pricing-widget/src/pricing-copy-map.json`).
- Do not touch pages outside the Spec’s in-scope list.

## Expected working set (files likely to change)
- HTML:
  - `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `niches/*.html`
- CSS sources:
  - `src/css/base/variables.css`
  - `src/css/base/layout.css`
  - `src/css/pages/contact.css`
- JS source:
  - `src/js/stats.js`
- Pricing widget:
  - `pricing-widget/src/PricingWidget.jsx`
  - `pricing-widget/src/pricing-widget.css`
- Rebuilt outputs:
  - `assets/css/styles.css`
  - `assets/js/app.js`
  - `assets/css/pricing-widget.css`
  - `assets/js/pricing-widget.js`
- Validators/tooling:
  - `scripts/codex.requested-edits.sh`
  - `scripts/validate-requested-edits.js`
  - `scripts/validate-pricing-ui-tuning.js`

If you need to edit anything outside this list, stop and justify it in the Decision Log first.

---

## Gate-by-gate execution

### Gate 0 — Preflight baseline
1) Run setup (idempotent): `bash scripts/codex.setup.sh`
2) Run full baseline validation: `bash scripts/codex.requested-edits.sh`

Expected outcome:
- It may fail (because requested edits are not yet implemented). That’s fine.

Done when:
- You can run the script end-to-end and you understand the failure set.

### Gate 1 — Slow down counters (Edit 1)
Implementation:
- Update `src/js/stats.js` to slow the animation duration to **2600ms**.
- Add marker `SS_STATS_SPEC: COUNTER_DURATION_SLOWDOWN_2600MS` near the duration change.

Rebuild:
- `node scripts/build-js.js`

Validate:
- `node scripts/validate-requested-edits.js --strict`

Done when:
- Counter slowdown checks pass and rebuilt `assets/js/app.js` includes the marker.

### Gate 2 — index.html disclaimer removal (Edit 2A)
Implementation:
- Remove the two disclaimer sentences from `index.html` (exact text in the Spec).

Validate:
- `node scripts/validate-requested-edits.js --strict`

Done when:
- Those exact sentences are no longer present in `index.html`.

### Gate 3 — Add missing body classes (Edits 2B + 3)
Implementation:
- Add `page-home` to the `<body>` of `index.html`.
- Add `page-about` to the `<body>` of `about.html`.

Validate:
- `node scripts/validate-requested-edits.js --strict`

Done when:
- Body-class checks pass.

### Gate 4 — Grey→white color system + exceptions (Edits 2B, 3, 4, 5)
Implementation (required pattern; see Spec):
1) Add `--color-silver-original` to `src/css/base/variables.css` with marker:
   - `SS_TEXT_SPEC: SILVER_ORIGINAL_TOKEN`
2) In `src/css/base/layout.css`, add a page-scoped override that makes muted silver render white:
   - marker: `SS_TEXT_SPEC: SILVER_TO_WHITE_NON_CTA_SECTIONS`
   - scope only to: `page-home`, `page-about`, `page-services`, `page-niche`, `page-book`
   - apply only inside `.section:not(.brand-gradient)` (CTA banners must not change)
3) Add exceptions in `layout.css` (marker: `SS_TEXT_SPEC: KEEP_GREY_EXCEPTIONS`):
   - Keep `index.html` proof-card taglines grey (`--color-silver-original`)
   - Keep services + niche card mid-paragraph(s) grey: `.service-content p` (`--color-silver-original`)

Rebuild:
- `node build-css.js`

Validate:
- `node scripts/validate-requested-edits.js --strict`

Done when:
- Validator passes for the grey→white system and exceptions.

### Gate 5 — contact.html phrase whitening (Edit 6)
Implementation:
- Make the four specified phrases render white (see Spec).
- Required approach for determinism:
  - Phrase (1) and the address block must be white via inline `color: var(--color-white)` in `contact.html`.
  - Social callout paragraphs must be white via `src/css/pages/contact.css`.
- Add marker(s):
  - `SS_CONTACT_SPEC: SOCIAL_COPY_WHITE` (in `contact.css`)
  - Any additional `SS_CONTACT_SPEC:` markers as needed.

Rebuild:
- `node build-css.js`

Validate:
- `node scripts/validate-requested-edits.js --strict`

Done when:
- Contact checks pass.

### Gate 6 — Pricing theme updates (Edit 7)
Implementation:
- Update pricing widget theme per Spec:
  - Background references `body-section-background-2025.webp`
  - Use Blue / White / Grey font system; add more neon blue + pink
  - Sparkles are more visible
- Add required markers:
  - `SS_PRICING_SPEC: THEME_MATCH_BODY_SECTION_BACKGROUND_2025` (CSS)
  - `SS_PRICING_SPEC: SPARKLES_MORE_VISIBLE` (CSS + JS near the change)

Rebuild:
- `(cd pricing-widget && npm run build)`

Validate:
- `node scripts/validate-requested-edits.js --strict`
- `node scripts/validate-pricing-ui-tuning.js --strict`

Done when:
- Both validators pass and rebuilt widget outputs are updated.

### Gate 7 — Per-digit price animation (Edit 8)
Implementation:
- Replace whole-number roll with per-digit scrolling.
- Add marker: `SS_PRICING_SPEC: PRICE_SCROLL_PER_DIGIT`
- Remove legacy whole-number roll usage (no `.ss-pricing__price-roll`).

Rebuild:
- `(cd pricing-widget && npm run build)`

Validate:
- `node scripts/validate-requested-edits.js --strict`
- `node scripts/validate-pricing-ui-tuning.js --strict`

Done when:
- Validators confirm per-digit behavior and no legacy class remains.

### Gate 8 — Final regression + manual QA
1) Run: `bash scripts/codex.requested-edits.sh`
2) Complete: `codex/MANUAL_QA_CHECKLIST.md`

Done when:
- The script passes and the manual checklist is completed.

---

## Progress tracker
- [ ] Gate 0 — Baseline run recorded
- [ ] Gate 1 — Counters slowed
- [ ] Gate 2 — Index disclaimer removed
- [ ] Gate 3 — Body classes added
- [ ] Gate 4 — Grey→white system + exceptions complete
- [ ] Gate 5 — Contact phrases white
- [ ] Gate 6 — Pricing theme updated
- [ ] Gate 7 — Per-digit pricing animation implemented
- [ ] Gate 8 — Full regression pass + manual QA

## Decision log
(Record any ambiguity resolution here.)

- None yet.
