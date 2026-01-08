<!-- FILE: ExecPlan.whatsapp-footer.md -->
# ExecPlan — WhatsApp Sticky Icon + Footer Mobile Number (All Pages)

## Purpose / Big Picture

Implement **exactly and only**:
1) A **fully functional WhatsApp sticky chat icon** fixed to the **bottom-right** on **every HTML page**, and
2) Add the mobile number **+447418329232** into the footer **“Contact Us”** section on **every HTML page**.

This ExecPlan is the authoritative runbook for this scope.

## Scope

### In scope (ONLY these)

- WhatsApp sticky icon:
  - Fixed position: bottom-right corner
  - Present on ALL HTML pages
  - Click launches WhatsApp “start chat” behavior
  - WhatsApp number: +447418329232 (display number); chat-link must use digits-only format (see Spec)

- Footer update:
  - Add **+447418329232** into the footer “Contact Us” section on ALL HTML pages

### Out of scope (hard constraints)

- No redesigns.
- No new sections.
- No analytics, tracking, or third-party widgets.
- No unrelated refactors or formatting churn.
- Do not touch `pricing-widget/**`.
- Do not alter any copy other than adding the phone number line in the footer.

## Repo orientation (ground truth)

This is a static multi-page website.

HTML pages in scope (15 total):
- Root:
  - `index.html`
  - `about.html`
  - `services.html`
  - `book.html`
  - `contact.html`
  - `privacy-policy.html`
- Niche pages:
  - `niches/dentists.html`
  - `niches/ecommerce.html`
  - `niches/estate-agents.html`
  - `niches/fitness-coaches.html`
  - `niches/gyms-fitness-studios.html`
  - `niches/hospitality.html`
  - `niches/physios-chiropractors.html`
  - `niches/salons-barbers.html`
  - `niches/trades-virtual-office.html`

Footer structure:
- Each page contains:
  - `<footer class="site-footer">`
  - A `div.footer-contact` block with heading “Contact Us”, address + email
- Root pages use asset paths like `assets/...`
- Niche pages use asset paths like `../assets/...`

Build pipeline:
- CSS sources: `src/css/**` → bundle: `assets/css/styles.css` via `npm run build:css`
- JS sources: `src/js/**` → bundle: `assets/js/app.js` via `npm run build:js`

## Required spec + markers

Follow `codex/WHATSAPP_FOOTER_REQUESTED_EDITS_SPEC.md` exactly, including proof markers:
- CSS proof marker (in built CSS)
- JS proof marker (in built JS)
- Footer proof marker (in every HTML page’s footer-contact section)

## Progress (update as you go)

- [x] M0 Baseline recorded (grader fails expected)
- [x] M1 Repo mapping complete (where to change JS/CSS + all footer locations confirmed)
- [x] M2 Implement WhatsApp sticky icon (global) + add proof markers
- [x] M3 Add footer mobile number to all pages + proof markers
- [ ] M4 Automated grader passes + manual QA complete

## Surprises & Discoveries (update as you go)

- Baseline `bash scripts/codex.whatsapp-footer.sh` failed on missing CSS proof marker (expected pre-implementation).

## Decision Log (update as you go)

- Ran the grader after both M2 + M3 changes were applied in one batch to avoid extra rebuild cycles.

## Outcomes & Retrospective (fill at end)

- Automated grader PASS on 2026-01-08; manual QA still pending.

## Plan of Work

### M0 — Baseline (measure-first)

1) Run:
   - `bash scripts/codex.whatsapp-footer.sh`
2) Record failures (expected before implementation).

Stop/Go:
- Do not implement until the baseline run is recorded.

### M1 — Map the change surfaces (Scout / Mapper)

Confirm:
- All 15 HTML pages contain the same footer-contact structure.
- All pages load `assets/js/app.js` (relative path differs) and `assets/css/styles.css`.

Write a short mapping note inside the Spec doc (Appendix section) if anything differs.

### M2 — Implement WhatsApp sticky icon (global behavior)

Implement a single global solution that reliably applies to all pages:
- Prefer a single JS/CSS integration (not 15 manual insertions).
- Use existing design language (Font Awesome is already used site-wide).
- Add proof markers required by the Spec (CSS + JS).

Critical: keep it bottom-right and ensure it stays clickable above most content.

### M3 — Add footer mobile number (propagate to all pages)

For each of the 15 HTML pages:
- Add the number `+447418329232` inside the footer `div.footer-contact`, beneath the existing email line (or next to it, but consistent across pages).
- Add the footer proof marker comment in the same footer-contact block (required by the grader).
- Do not change any other footer content, links, or relative paths.

### M4 — Verify and finish

1) Run:
   - `bash scripts/codex.whatsapp-footer.sh`
2) Complete manual QA using:
   - `codex/MANUAL_QA_WHATSAPP_FOOTER.md`
3) Confirm git diff is limited to the files required by this plan.

## Validation and Acceptance

Automated:
- `bash scripts/codex.whatsapp-footer.sh` must PASS.

Manual:
- Verify WhatsApp icon appears bottom-right on:
  - Home + 1 niche page + contact page (desktop + mobile).
- Verify footer “Contact Us” shows the phone number on:
  - Home + 1 niche page + services page.

## Idempotence and Recovery

- If the grader fails:
  - Read the exact missing marker / missing page list it prints.
  - Fix only what the grader reports.
  - Re-run `bash scripts/codex.whatsapp-footer.sh`.

- If a page is missed:
  - Update only that HTML footer-contact block; avoid global refactors.

## Interfaces and Dependencies

- Runner: `scripts/codex.whatsapp-footer.sh`
- Grader: `scripts/assert-whatsapp-footer.js`
- Spec: `codex/WHATSAPP_FOOTER_REQUESTED_EDITS_SPEC.md`
- Manual QA: `codex/MANUAL_QA_WHATSAPP_FOOTER.md`
