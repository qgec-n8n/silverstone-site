<!-- FILE: ExecPlan.whatsapp.md -->
# ExecPlan — WhatsApp Floating Button + Footer Phone (All Pages)

## Purpose / Big Picture

Implement **exactly and only** the two requested site-wide changes:

1) Add a professional **WhatsApp floating/sticky chat button** fixed to the **bottom-right** on **every** HTML page.
2) Add the mobile number **+44 7418 329232** into the footer **Contact Us** section on **every** HTML page.

This ExecPlan is the authoritative runbook for the WhatsApp + footer phone work. If any other doc conflicts, follow this plan **and** the repo convention: **ExecPlans.md decides which ExecPlan is active**.

---

## Progress

- Date started: 2026-01-08
- Current milestone: M3 (verification + QA)
- Last checkpoint: 2026-01-08
- Status: Completed

---

## Surprises & Discoveries

- Baseline `bash scripts/codex.whatsapp.sh` failed: assets/css/styles.css missing proof marker "SPEC: WHATSAPP_FLOAT_BUTTON_STYLES_2026_01_08".
- After Batch A CSS/icons, grader now fails on missing WhatsApp button markup in about.html (expected before HTML updates).

---

## Decision Log

- **Interpretation of “open up on the website”:** WhatsApp Click-to-Chat cannot be embedded as an in-page chat window using only WhatsApp. The standards-based, reliable approach is a fixed CTA that opens WhatsApp (app on mobile, WhatsApp Web on desktop) via Click-to-Chat. This matches the business goal: “start a WhatsApp chat.”
- **Icon strategy:** This repo uses locally hosted Font Awesome fonts with an explicit glyph-mapping allowlist in `src/css/base/typography.css`. To keep consistency, add glyph mappings for:
  - solid `phone` (unicode `f095`)
  - brands `whatsapp` (unicode `f232`)

---

## Outcomes & Retrospective

- Implemented WhatsApp floating button and footer phone row across all pages.
- Automated validation: `bash scripts/codex.whatsapp.sh` PASS on 2026-01-08.
- Manual QA checklist completed: `codex/WHATSAPP_MANUAL_QA_CHECKLIST.md` on 2026-01-08.

---

## Context and Orientation

### Site structure

This is a static multi-page website. There is no templating system; the footer is duplicated across pages.

**All HTML pages in scope (must all be updated):**
- Root pages:
  - `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`
- Niche pages:
  - `niches/*.html`

### Build pipeline

CSS:
- Sources: `src/css/**`
- Build: `npm run build:css` (via `build-css.js`)
- Output: `assets/css/styles.css`

JS:
- Sources: `src/js/**`
- Build: `npm run build:js` (via `scripts/build-js.js`)
- Output: `assets/js/app.js`

### Icon system (important for this task)

The repo ships local Font Awesome webfonts under `assets/webfonts/`, but only icons mapped in `src/css/base/typography.css` will render. Adding `<i class="fa-solid fa-phone"></i>` or `<i class="fa-brands fa-whatsapp"></i>` requires adding glyph mappings in that CSS file.

### Footer structure

Each page contains a footer with a `div.footer-contact` section that currently includes location and email. The new phone row must be inserted into this section on every page.

---

## Scope

### In scope

- Add a fixed-position WhatsApp CTA (bottom-right) to every HTML page.
- Add the phone number to the footer Contact Us section on every HTML page.
- Add the minimal CSS required for:
  - WhatsApp button styling
  - Font Awesome glyph mappings for `phone` and `whatsapp`
- Add/maintain the automated grader for this task:
  - `scripts/assert-whatsapp-spec.js`
  - `bash scripts/codex.whatsapp.sh`

### Out of scope (hard constraints)

- No new chat systems, no third-party chat widgets, no embedded iframe “WhatsApp in-page chat”.
- No redesign of the footer layout.
- No broad refactors.
- Do not modify anything under `pricing-widget/**`.

---

## Specification (source of truth)

Read and follow:
- `codex/WHATSAPP_SPEC.md`

If this ExecPlan and the spec disagree: **follow the spec**, then record the resolution in the Decision Log.

---

## Plan of Work

- **M0 — Baseline + repo map**: run the grader (expected to fail), confirm page list, identify exact insertion points.
- **M1 — Icons + CSS**: add Font Awesome glyph mappings and the `.wa-float` styling.
- **M2 — HTML updates (site-wide)**: add WhatsApp button markup + footer phone markup to every page.
- **M3 — Verification + QA**: automated grader passes; manual QA checklist completed.

---

## Concrete Steps

### M0 — Setup + baseline

1) Setup toolchain (idempotent):
- `bash scripts/codex.setup.sh`

2) Run baseline validation (expected to fail until implemented):
- `bash scripts/codex.whatsapp.sh`

3) Record baseline outcome (one short bullet list) in this ExecPlan under **Surprises & Discoveries**.

GO / NO-GO: Do not start edits until the baseline failure is observed.

### M1 — Icons + styling

4) Add Font Awesome glyph mappings in `src/css/base/typography.css`:
- Add a mapping for `.fa-solid.fa-phone::before` using unicode `f095`.
- Add a mapping for `.fa-brands.fa-whatsapp::before` using unicode `f232`.
- Add proof markers as comments on the same lines as the new mappings:
  - `SPEC: ICON_PHONE_GLYPH_2026_01_08`
  - `SPEC: ICON_WHATSAPP_GLYPH_2026_01_08`

5) Add WhatsApp floating button CSS in `src/css/components/buttons.css` (preferred) or another existing file already in `build-css.js` order:
- Use class name: `.wa-float`.
- Must be `position: fixed`, bottom-right.
- Must have `z-index` > 1000 (cookie banner is 1000).
- Must be obviously WhatsApp (WhatsApp green, circular, icon centered).
- Must include keyboard focus styles.
- Add proof marker in the CSS block:
  - `SPEC: WHATSAPP_FLOAT_BUTTON_STYLES_2026_01_08`

6) Rebuild CSS and confirm markers land in the built bundle:
- `npm run build:css`

### M2 — HTML updates (all pages)

7) Add WhatsApp floating button markup to **every** HTML page in the list in `codex/WHATSAPP_SPEC.md`.

Contract (must match the spec so the grader passes):
- The anchor must have `id="whatsapp-float"` and class `wa-float`.
- The href must point to WhatsApp Click-to-Chat using the digits-only number `447418329232`.
- Open in a new tab: `target="_blank"` and `rel` containing `noopener`.
- Include an accessible label: `aria-label`.
- Include the proof marker comment adjacent to the markup:
  - `SPEC: WHATSAPP_FLOAT_BUTTON_MARKUP_2026_01_08`

Insertion placement rule (keep it consistent across pages):
- Insert the button markup **after** the closing `</footer>` and **before** the first site script include at the end of `<body>`.

8) Add footer phone markup to **every** HTML page:

Contract:
- Insert inside `<div class="footer-contact">`.
- Include a phone icon `<i class="fa-solid fa-phone"></i>`.
- Link must use `tel:+447418329232`.
- Visible text must be exactly `+44 7418 329232`.
- Include the proof marker comment adjacent to the phone row:
  - `SPEC: FOOTER_CONTACT_PHONE_ADDED_2026_01_08`

9) Rebuild bundles:
- `npm run build:css`
- `npm run build:js`

### M3 — Validation + manual QA

10) Run the automated grader until it passes:
- `bash scripts/codex.whatsapp.sh`

11) Complete manual QA:
- `codex/WHATSAPP_MANUAL_QA_CHECKLIST.md`

---

## Validation and Acceptance

### Automated (must pass)

- `bash scripts/codex.whatsapp.sh` prints PASS.

This grader must verify:
- Every HTML page contains exactly one WhatsApp floating button (`#whatsapp-float.wa-float`).
- Button links to the correct number `447418329232`.
- Footer Contact Us includes `tel:+447418329232` with visible `+44 7418 329232`.
- Built CSS contains:
  - WhatsApp button styling marker
  - Font Awesome glyph mappings for phone + whatsapp

### Manual QA (must complete)

- Button appears bottom-right on desktop and mobile.
- Button is clickable and opens WhatsApp chat flow.
- Button is keyboard reachable and has a visible focus indicator.
- Button is not hidden behind the cookie banner (z-index).
- Footer shows phone number and link works.

### Acceptance criteria (ship/no-ship)

- Both features are present on **every** page listed in the spec.
- No duplicates (0 or 1 is not acceptable; must be exactly 1 per page).
- No layout regressions in footer spacing.

---

## Idempotence and Recovery

- All steps are safe to re-run.
- If the grader fails:
  - First, read the error message (it names the failing file).
  - Fix only the minimum needed change.
  - Re-run `npm run build:css` and `bash scripts/codex.whatsapp.sh`.
- If a page accidentally gets two buttons or two phone rows, remove the duplicate and re-run the grader.

---

## Artifacts and Notes

- `codex/WHATSAPP_SPEC.md` (hard spec)
- `codex/WHATSAPP_MANUAL_QA_CHECKLIST.md` (manual QA)
- `scripts/assert-whatsapp-spec.js` (automated grader)
- `scripts/codex.whatsapp.sh` (single validation command for this plan)

---

## Interfaces and Dependencies

- `build-css.js` determines which CSS source files become `assets/css/styles.css`.
- Cookie banner uses `z-index: 1000` (`src/css/components/cookie-banner.css`), so the WhatsApp button must exceed that.
- All pages load the shared bundle `assets/css/styles.css`.
