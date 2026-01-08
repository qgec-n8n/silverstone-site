<!-- FILE: codex/WHATSAPP_FOOTER_REQUESTED_EDITS_SPEC.md -->
# WhatsApp Sticky Icon + Footer Mobile Number — Spec (Graded)

## Non-negotiable requirements

### A) WhatsApp sticky icon (all pages)

- Must be visible on every HTML page in this repo.
- Must be fixed/sticky to the bottom-right corner.
- Must start a WhatsApp chat to the configured number.
- Must be accessible:
  - Anchor/button is keyboard focusable
  - Has an `aria-label` that clearly indicates WhatsApp chat
- Must not introduce any other UI changes.

Number rules:
- Display number: `+447418329232`
- Chat-link number must be **digits-only international** (no plus, spaces, or punctuation):
  - `447418329232`

## Proof markers (required)

Codex must add these exact markers:

1) CSS marker (must appear in the built bundle `assets/css/styles.css`):
- `SPEC: WHATSAPP_STICKY_BUTTON_FIXED_BOTTOM_RIGHT_2026_01_08`

2) JS marker (must appear in the built bundle `assets/js/app.js`):
- `SPEC: WHATSAPP_STICKY_BUTTON_INJECT_ALL_PAGES_2026_01_08`

3) Footer marker (must appear in every HTML page inside the footer-contact block):
- `SPEC: FOOTER_CONTACT_MOBILE_NUMBER_2026_01_08`

## B) Footer “Contact Us” mobile number (all pages)

- Add `+447418329232` to the footer “Contact Us” section (`div.footer-contact`) on ALL pages:
  - Root pages: `*.html`
  - Niche pages: `niches/*.html`
- The number must be placed inside `div.footer-contact` and remain consistent across pages.
- Do not change address text, email, quick links, social links, or relative href paths.
- Add the footer marker comment adjacent to the inserted phone number line so a grader can reliably find it.

## Automated validation contract

The repo’s acceptance for this task is defined by:
- `bash scripts/codex.whatsapp-footer.sh`

This runs the grader:
- `node scripts/assert-whatsapp-footer.js`

If it fails, the work is not complete.

## Appendix: page list (must match)

15 pages in scope:
- `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`
- `niches/dentists.html`, `niches/ecommerce.html`, `niches/estate-agents.html`, `niches/fitness-coaches.html`,
  `niches/gyms-fitness-studios.html`, `niches/hospitality.html`, `niches/physios-chiropractors.html`,
  `niches/salons-barbers.html`, `niches/trades-virtual-office.html`
