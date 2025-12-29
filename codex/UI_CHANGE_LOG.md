<!-- FILE: codex/UI_CHANGE_LOG.md -->
# UI Change Log

Use this log to record decisions, deviations, and verification notes while implementing Requested Edits 1–12.

## Baseline

- Date: 2025-02-12
- `bash scripts/codex.requested-edits.sh` baseline result: failed
- Known issues before changes:
  - Missing required marker in `pricing-widget/src/pricing-widget.css`: `SS_PRICING_SPEC: LIGHT_MODE_BG_VIBRANCY_BOOST_2025_12`
  - Pricing UI tuning validator could not find expected light-mode background stack or extract tint alpha values

## Decisions (why we chose an approach)

Record only decisions that could otherwise be “mysterious” later.

- Date — Area — Decision — Why — Alternatives considered
  - 2025-02-12 — About CTA copy — Changed the about-page CTA to “Book a Free Automation Audit” to remove the “Minute Automation Audit” string — Required by Edit #9 validator and keeps CTA intent intact — Alternative was to keep 30‑minute phrasing and adjust validator (rejected).

## Deviations (when repo reality conflicts with request)

Format:
- Date
- Requested edit #
- Conflict (what didn’t match repo reality)
- Deviation (what we did)
- Why it still satisfies user intent
- Follow-up (if any)

## Changelog (what changed)

- Date — Files changed — Summary — Validations run — Manual checks done
  - 2025-02-12 — `pricing-widget/src/pricing-widget.css`, `assets/css/pricing-widget.css`, `assets/js/pricing-widget.js`, `src/css/pages/services.css`, `src/css/base/layout.css`, `src/css/components/hero.css`, `src/css/components/cards.css`, `src/css/pages/home.css`, `src/js/marquee.js`, `src/js/header-nav.js`, `index.html`, `about.html`, `book.html`, `contact.html`, `codex/REPO_UI_MAP.md`, `codex/MANUAL_QA_CHECKLIST.md` — Implemented Requested Edits 1–12 (pricing tint, service image borders/fit, subtitle grey, hero legibility/CTA/mobile layout, Calendly preload, stats updates, services image tiles + lightbox, mobile menu behavior) — `bash scripts/codex.requested-edits.sh`, `node scripts/validate-pricing-ui-tuning.js`, `node scripts/validate-homepage-index-sections.js --strict`, `node scripts/validate-requested-edits.js --strict` — Manual QA not completed (see checklist note).

## Final verification summary

When finished:
- Automated: list commands that passed
- Manual QA: confirm completion of `codex/MANUAL_QA_CHECKLIST.md`
- Remaining risks / known limitations (should be empty or explicitly accepted)
  
Automated:
- `bash scripts/codex.requested-edits.sh` (pass)

Manual QA:
- Not completed (server started, but no browser verification; see `codex/MANUAL_QA_CHECKLIST.md`)

Remaining risks / known limitations:
- Manual QA steps still required in a browser environment.
