<!-- FILE: codex/WHATSAPP_SPEC.md -->
# WhatsApp + Footer Phone — Implementation Spec (Hard Contract)

This document is the **hard spec** for the two requested changes:

1) WhatsApp floating chat button on every page (bottom-right, fixed).
2) Add the mobile number to the footer Contact Us section on every page.

If anything conflicts (ExecPlan, prompts, scripts), this spec wins. Record any conflict resolution in the active ExecPlan.

---

## Constants (must be used consistently)

- WhatsApp number (digits-only, for Click-to-Chat links): `447418329232`
- Phone link (tel URI): `tel:+447418329232`
- Phone display text (exact, for consistency across pages): `+44 7418 329232`

---

## WhatsApp button — UX + behavior

### Supported behavior (important constraint)

WhatsApp Click-to-Chat launches WhatsApp **outside** the website:
- Mobile: opens the WhatsApp app if installed (or WhatsApp Web fallback).
- Desktop: opens WhatsApp Web.

There is no standards-based way to open a native WhatsApp chat window **inside** the website without introducing a third-party widget or using other products/services. For this task, implement the **reliable Click-to-Chat** entry point.

### Link format

Use WhatsApp Click-to-Chat. Construct the href as:

- Base: `'wa' + '.me' + '/' + '447418329232'`
- Optional prefilled message: append `'?text=' + encodeURIComponent(<message>)`

Rules:
- Do **not** include a leading `+` in the digits portion.
- Do **not** include spaces, brackets, or dashes in the digits portion.

Recommended prefilled text (exact):
- `Hi Silverstone team — I’d like to chat about automation.`

### Markup contract (must match exactly)

Add this element to every HTML page:

- Tag: anchor (`<a> ... </a>`)
- `id`: `whatsapp-float`
- `class`: includes `wa-float`
- `target`: `_blank`
- `rel`: must include `noopener` (prefer `noopener noreferrer`)
- `aria-label`: `Chat on WhatsApp`

Content:
- Use Font Awesome **brands** icon:
  - `<i class="fa-brands fa-whatsapp"></i>`
- Include a visually-hidden label for accessibility OR rely on `aria-label`.

Proof marker (must be present adjacent to the element):
- `SPEC: WHATSAPP_FLOAT_BUTTON_MARKUP_2026_01_08`

Placement (must be consistent on all pages):
- Insert **after** `</footer>` and **before** the first script include at the end of `<body>`.

### Styling contract

CSS must create a professional, recognizable WhatsApp CTA:

- Selector: `.wa-float`
- `position: fixed`
- bottom-right placement (respect safe-area if possible)
- circular button, sized for touch targets (>= 44px)
- WhatsApp green background (use `#25D366`)
- white icon
- subtle shadow; hover/active states
- keyboard focus ring (visible)
- `z-index` must be > 1000 (cookie banner is 1000)

Proof marker inside the CSS block:
- `SPEC: WHATSAPP_FLOAT_BUTTON_STYLES_2026_01_08`

---

## Footer Contact Us — phone row

### Markup contract

In every page footer, inside `<div class="footer-contact">`, add a phone row:

- Include the icon: `<i class="fa-solid fa-phone"></i>`
- Include a clickable tel link with `href="tel:+447418329232"`
- Visible text must be exactly: `+44 7418 329232`

Proof marker adjacent to the row:
- `SPEC: FOOTER_CONTACT_PHONE_ADDED_2026_01_08`

Placement in footer-contact:
- Recommended order:
  1) location
  2) phone (new)
  3) email

---

## Font Awesome glyph mappings (required in this repo)

This repo only renders icons that are explicitly mapped in `src/css/base/typography.css`.

Add these two mappings:

- `.fa-solid.fa-phone::before` uses unicode `f095`
  - Proof marker on the same line: `SPEC: ICON_PHONE_GLYPH_2026_01_08`

- `.fa-brands.fa-whatsapp::before` uses unicode `f232`
  - Proof marker on the same line: `SPEC: ICON_WHATSAPP_GLYPH_2026_01_08`

---

## Pages that must be updated (enumerated)

Root pages:
- `index.html`
- `about.html`
- `services.html`
- `book.html`
- `contact.html`
- `privacy-policy.html`

Niche pages:
- `niches/dentists.html`
- `niches/ecommerce.html`
- `niches/estate-agents.html`
- `niches/fitness-coaches.html`
- `niches/gyms-fitness-studios.html`
- `niches/hospitality.html`
- `niches/physios-chiropractors.html`
- `niches/salons-barbers.html`
- `niches/trades-virtual-office.html`

---

## Non-goals

- Do not add additional phone numbers, contact methods, or footer sections.
- Do not add analytics/tracking.
- Do not change copy elsewhere.
- Do not touch `pricing-widget/**`.
