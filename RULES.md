<!-- RULES.md -->
# RULES – CSS & JS Rules of Engagement

These rules apply to all Codex work on `silverstone-site-main`.

---

## Global CSS Rules

- **No new `!important`** unless:
  - There is no other reasonable fix.
  - The selector is narrowly scoped (ideally page‑specific).
  - The use is documented in `ExecPlan.md` → **Decision Log**.
- **Do not change (early slices)**:
  - Base `.neon-card` rules in `assets/css/styles.css`.
  - Global `section` padding/margins in `assets/css/styles.css`.
- Prefer:
  - **Page‑scoped overrides** (e.g., `.page-estate-agents .neon-card`) instead of global changes.
  - New utility classes over broad tag selectors when refining visuals.
- For `assets/css/styles.css`:
  - Prefer additive overrides (in `custom.css` or an Estate‑specific CSS file) over editing existing declarations, until Slice 8.

---

## Estate Agents CSS Rules

- Scope Estate‑specific rules via a clear hook (e.g., `<body class="page-estate-agents">`).
- Key selectors:
  - Cards: `.neon-card`, `.dark-card`, `.value-card`, `.stats .neon-card`.
  - Sections: `.section` variants, with additional descriptive classes when needed.
  - Wrappers: `.compact-section`, `.stats`, etc.
- Card background unification:
  - Implement by overriding within Estate scope:
    - e.g., `.page-estate-agents .neon-card { /* unified dark background */ }`
  - Do not adjust `.neon-card` globally until Slice 8.
- Section spacing:
  - Fix gaps by targeting explicit relationships:
    - e.g., `.page-estate-agents .section--branch + .section--plug { margin-top: ... }`
  - Avoid deep `nth-child` chains if you can add/use descriptive classes instead.
- Inline `<style>`:
  - May be read and gradually reduced over Slices 1–7.
  - When moving rules out:
    - Recreate them in a page‑scoped CSS file.
    - Remove inline versions only after visual parity is confirmed.

---

## Header/Nav & Services Overlay CSS Rules

- Key selectors:
  - `.site-header`, `.nav`, `.nav-list`, `.nav-item`, `.nav-toggle`.
  - `.services-toggle`, `.services-menu`, `.services-overlay`, `.service-pill`.
- Desktop:
  - Align Services nav item with others via flexbox/line‑height/padding, not pixel‑perfect hacks wherever possible.
- Mobile:
  - `.service-pill` for Services must match other pills in:
    - Font family, size, weight.
    - Colour.
    - Horizontal/vertical alignment.
- Accessibility:
  - Keep `role="navigation"`, `aria-expanded`, and other ARIA attributes unless you replace them with equally accessible alternatives.

---

## Mobile & Parallax CSS Rules

- Do not globally alter `.section.bg-*` or parallax helper classes except in Slice 8.
- For Estate hero mobile:
  - Follow the hero pattern used by `book.html` for mobile background images.
  - Apply via Estate page scope to avoid impacting other pages.
- `mobile.css`:
  - Use for breakpoint‑specific tweaks, ideally under page scopes (e.g., `.page-estate-agents`) when fixes apply to specific pages.

---

## Global JS Rules

- Keep DOM hooks stable:
  - IDs, classes, and `data-*` attributes referenced in JS must not be renamed or removed without updating all references.
- Avoid:
  - Adding new global variables.
  - Packing more unrelated logic into already large functions.
- Prefer:
  - Small helper functions (`toggleCookieBanner`, `hasCookieConsent`, etc.) to improve clarity.
- Do not introduce new JS dependencies that would require `npm install` in the sandbox.

---

## Cookie Banner JS Rules

- File: `assets/js/cookie-consent.js`.
- Must:
  - Use a single, consistent storage key for consent (e.g., `localStorage`).
  - Show banner only when consent is “unknown”.
  - Hide banner permanently after Accept or Decline.
- Must NOT:
  - Change the semantics of Accept vs Decline.
  - Tie visibility to scroll in ways that cause flicker.
- Keep DOM structure expectations stable (banner container, buttons, IDs).

---

## Header/Nav & Services Overlay JS Rules

- File: `assets/js/script.js`.
- Must:
  - Respect ARIA attributes for nav toggles and overlays.
  - Keep responsibilities separated: nav toggle, Services overlay, scroll handling, etc.
- May:
  - Simplify event handlers and naming for clarity.
  - Guard against missing DOM elements (null checks).
- Must NOT:
  - Introduce redundant global event listeners.
  - Break mobile vs desktop nav behaviour distinctions.

---

## Stats Counters & Scroll Behaviour Rules

- Stats counters:
  - Should animate **once** when the stats section enters view.
  - Should not re‑run on every minor scroll.
- Adjustments should:
  - Use simple guard flags (e.g., `hasAnimatedStats = true`).
  - Avoid complex or performance‑heavy scroll listeners.

---

## Contact Form & Netlify Rules

- Keep `netlify/functions/send-email.js` API contract intact.
- Inline contact JS in `contact.html` may:
  - Be refactored into a separate JS file for clarity.
  - Be simplified, provided:
    - Form submission still works with Netlify.
    - User feedback messages remain visible and accessible.
- Ensure:
  - Form labels, fields, and error messages retain accessibility.
  - Any changed selectors are updated consistently in HTML and JS.

---

Any necessary deviations from these rules must be justified and recorded in `ExecPlan.md` → **Decision Log**.
