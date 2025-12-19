<!-- FILE: codex/REQUESTED_EDITS_SPEC.md -->
# Requested Website Edits Spec (1–8)

This file is the **single source of truth** for implementing the requested edits.

## In-scope pages
- `index.html`
- `about.html`
- `services.html`
- `book.html`
- `contact.html`
- `niches/*.html` (all niche pages)

No other pages may be changed unless required to rebuild committed outputs.

## Repo-grounded color definitions
- **Grey text** = any text that renders using the site variable `--color-silver` (defined in `src/css/base/variables.css` as `#c0c0c0`) or any inline/CSS rule explicitly using `var(--color-silver)`.
- **White text** = `--color-white` (`#ffffff`) or an explicit equivalent.

## Repo-grounded structure definitions
- **CTA banners at the bottom** = any `<section>` with class `brand-gradient`.
- **Services/Niches card structure** = inside `.service-row .service-content`:
  - Title: `<h3>`
  - Mid-paragraph(s): the `<p>` element(s) after the title and before the `<ul>`
  - Bullet list: the `<ul>`

## Required implementation pattern for grey→white changes
To avoid missing any “grey” selectors and to preserve exceptions deterministically:

1) Add a stable token `--color-silver-original` equal to the original silver value (`#c0c0c0`).
2) On the specified pages, in **non-CTA sections only** (`.section:not(.brand-gradient)`), override the variable `--color-silver` to resolve to `--color-white`.
3) Preserve required exceptions by explicitly setting their `color` to `var(--color-silver-original)`.
4) Do **not** use `!important` for these overrides.

This pattern is required because it is robust (covers any selector using `--color-silver`) and easy to validate.

---

# Edit-by-edit requirements and acceptance criteria

## Edit 1 — Slow down counters on about.html and index.html
Target: the animated counters within `.stats[data-counter="on"]`.

Acceptance criteria:
- In `src/js/stats.js`, the counter animation duration is changed from the current 1200ms to **2600ms** using a single explicit constant.
- Add marker comment: `SS_STATS_SPEC: COUNTER_DURATION_SLOWDOWN_2600MS` near the duration change.
- Counters still only run for `.stats[data-counter="on"]` (no global counter behavior changes).

Verification:
- Rebuild main JS (`node scripts/build-js.js`) and confirm the marker appears in `assets/js/app.js`.
- `node scripts/validate-requested-edits.js --strict` passes.

---

## Edit 2 — index.html

### 2A — Remove two disclaimer sentences
Remove these exact sentences from `index.html` (they must not appear anywhere in the file after the change):
1) “These figures are indicative industry benchmarks for automation, not guaranteed Silverstone results.”
2) “We’ll help you understand what’s realistic for your business.”

Acceptance criteria:
- Neither sentence exists in `index.html` as an exact substring.
- No other copy is modified.

### 2B — Grey→white on index.html, with exceptions
Make all muted “silver” text render white on index.html **except** these phrases must remain grey / unchanged:
- “Discover how personalised automation can drive efficiency, productivity and growth across your organisation.”
- “Less manual admin and follow-up.”
- “Automated reminders and confirmations.”
- “Always-on first response.”

Acceptance criteria:
- `index.html` `<body>` includes the class `page-home`.
- The required grey→white variable override is applied to **non-CTA** sections on `page-home`.
- Exceptions remain grey because:
  - the “Discover…” phrase stays in the CTA banner (`.section.brand-gradient`), and
  - the three proof-card tagline phrases are explicitly forced back to `--color-silver-original`.
- No CTA banner colors are altered.

Verification:
- `assets/css/styles.css` includes `SS_TEXT_SPEC` markers after rebuild.
- Manual QA confirms exceptions are muted/grey and other muted copy is white.

---

## Edit 3 — about.html grey→white with CTA exception
Exception phrase that must remain grey / unchanged:
- “Ready to streamline your business and unlock new possibilities? Our team is eager to help you succeed.”

Acceptance criteria:
- `about.html` `<body>` includes the class `page-about`.
- The required grey→white variable override is applied to **non-CTA** sections on `page-about`.
- The exception phrase remains grey (it lives in the CTA banner and must keep its muted styling).

---

## Edit 4 — services.html and niches/*.html grey→white with exceptions
Goal: brighten muted text across services and niche pages without affecting CTA banners and without changing the mid-paragraph(s) inside cards.

Acceptance criteria:
- On `services.html` (`body.page-services`) and all `niches/*.html` (`body.page-niche`):
  - The required grey→white variable override applies only inside `.section:not(.brand-gradient)`.

Exceptions:
1) **Card mid-paragraph(s) must NOT change color**
   - The `.service-content p` paragraphs (between the card title and bullet list) must remain grey.
   - Implement by forcing those paragraphs to `color: var(--color-silver-original)` on `page-services` and `page-niche`.

2) **CTA banners must NOT change**
   - Do not change any font colors inside CTA banner sections (`.section.brand-gradient`).
   - Ensure the silver→white override does not apply within `.brand-gradient`.

---

## Edit 5 — book.html grey→white with CTA exception
Exception phrase that must remain grey / unchanged:
- “We’re excited to learn about your business and design a solution that fits.”

Acceptance criteria:
- On `book.html` (`body.page-book`), apply the grey→white variable override only within `.section:not(.brand-gradient)`.
- The exception phrase remains grey in the CTA banner.

---

## Edit 6 — contact.html: make specific phrases white
Make these phrases white on `contact.html`:

1) “Share a quick overview of your situation. We’ll come back with suggestions or next steps – no spam, no pressure to commit.”
2) Address block (rendered as one block of text):
   - Address: 4 Deacon Street, SE17 1GE, London, UK
   - Email: info@silverstone-ai.com (must be a `mailto:` link)
3) “Immerse yourself in the Silverstone experience across our curated social channels—crafted for leaders who expect design-led intelligence, cinematic storytelling, and premium service cues at every touchpoint.”
4) “Follow us for prototype reveals, executive insights, and a first look at the intelligent automations shaping tomorrow’s operations.”

Deterministic implementation requirement (so validation is reliable):
- For phrases (1) and (2), ensure their containing elements in `contact.html` include inline `color: var(--color-white)` (do not rely on broad CSS overrides).
- For phrases (3) and (4), set them white via `src/css/pages/contact.css` by styling `.contact-social-callout p` to `color: var(--color-white);`.

Markers required:
- In `src/css/pages/contact.css`, add: `SS_CONTACT_SPEC: SOCIAL_COPY_WHITE`
- Any additional contact changes should use `SS_CONTACT_SPEC:` markers.

Verification:
- `node scripts/validate-requested-edits.js --strict` passes.
- Manual QA confirms all four phrases are white.

---

## Edit 7 — Pricing sections styling (index/services/niches)
Applies to the pricing widget instances on:
- `index.html`
- `services.html`
- `niches/*.html`

Goals:
- Pricing sections use the same font color system as the rest of the site: **Blue / White / Grey**.
- Keep a light-mode premium look, but reduce “plain white” feel by using more neon blue + pink.
- Make the sparkles animation more visible.
- Background/theme should match closer to `assets/images/body_section_parallax/body-section-background-2025.webp`.

Acceptance criteria:
- In `pricing-widget/src/pricing-widget.css`:
  - Add marker `SS_PRICING_SPEC: THEME_MATCH_BODY_SECTION_BACKGROUND_2025`.
  - Reference `body-section-background-2025.webp` directly in widget background styling (via `url(...)`).
  - Primary text token is white (not dark).
  - Muted text token maps to the site grey system.
  - Neon blue + pink accents are visibly used (but still premium, not loud).
  - Add marker `SS_PRICING_SPEC: SPARKLES_MORE_VISIBLE` and adjust styling to make sparkles stand out on the new background.
- In `pricing-widget/src/PricingWidget.jsx`:
  - Add marker `SS_PRICING_SPEC: SPARKLES_MORE_VISIBLE` near the sparkles logic change (if JS changes are required).
- Rebuild widget outputs so changes appear in:
  - `assets/css/pricing-widget.css`
  - `assets/js/pricing-widget.js`

---

## Edit 8 — Pricing figure animation per-digit (index/services/niches)
Goal:
- The price number transition must scroll **per digit** (each digit rolls) rather than moving the whole number as one block.

Acceptance criteria:
- Replace the current whole-number roll with a per-digit roll animation.
- Add marker `SS_PRICING_SPEC: PRICE_SCROLL_PER_DIGIT` in:
  - `pricing-widget/src/PricingWidget.jsx`
  - `pricing-widget/src/pricing-widget.css`
- Remove legacy whole-number roll usage:
  - no `.ss-pricing__price-roll` usage in final CSS or JSX
  - remove old marker `SS_PRICING_SPEC: PRICE_SCROLL_ANIMATION`
- Respect reduced motion:
  - Under `prefers-reduced-motion: reduce`, digits update without scrolling animation.

Verification:
- `node scripts/validate-requested-edits.js --strict` passes.
- Manual QA: toggling monthly/annual shows digit-by-digit scrolling.

---

## Final verification (required)
1) `bash scripts/codex.requested-edits.sh` passes.
2) Manual QA checklist `codex/MANUAL_QA_CHECKLIST.md` completed.
3) Diffs stay within the allowed scope in `AGENTS.md`.
