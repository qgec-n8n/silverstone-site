<!-- FILE: PLANS.md -->
# UI/UX Bugfix Spec (A–H) + Page Maps (Services + Niches)

This document is the **single source of truth** for what Codex must implement. It maps every requirement (A–H) to:
- target files
- change strategy and guardrails
- acceptance criteria
- validation steps

If anything in the repo conflicts with these requirements, **these requirements take precedence**.

---

## Global constraints (apply to every change)

- **No redesigns, no new features.** Implement only what is required.
- **No new colors/tokens.** Reuse existing tokens/classes. (Adding a missing alias variable that is already referenced in markup is allowed when it enables reuse.)
- **Keep content order the same.** Only swap left/right placement within the specified image/card pairs.
- **Preserve mobile behavior unless explicitly changed.**
- **Update sources, then rebuild outputs** (`src/*` → `assets/*`).

---

## A) General fixes/changes (desktop + mobile)

### A1. Hero shader variants (core pages = blue, niches = purple)

**What**
- Core pages must use the **blue** shader:
  - `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`
- All niche pages must use the **purple** shader:
  - `niches/*.html`

**Targets**
- HTML: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `niches/*.html`
- JS shader themes are already defined in: `src/js/hero-shader.js`

**Implementation strategy**
- The shader theme is selected via `data-variant="..."` on:
  - `<canvas id="hero-shader-canvas" ...>`
- Set:
  - core pages: `data-variant="blue"`
  - niches: remove `data-variant` (so the shader uses its default purple theme) **or** set `data-variant="default"` if you prefer explicitness.
- Do not change the hero shader DOM structure beyond this attribute change.

**Acceptance criteria**
- Each core page canvas has `data-variant="blue"`.
- Each niche page canvas has **no** `data-variant` or has `data-variant="default"`.
- No niche page uses `data-variant="amber"` after changes.

**Validation**
- `node scripts/validate-core-pages.js`


### A2. Marquee image set must include all `assets/images/socialmedia` images and be mixed (no aspect bucket grouping)

**What**
- Both **double marquee** (services page) and **single marquee** (auto-inserted on non-services pages) must draw from the **full image set** in `assets/images/socialmedia`.
- The sequence must be **mixed** so aspect ratios don’t appear grouped (avoid “all 1:1, then all 2:3, then all 3:2”).

**Targets**
- JS: `src/js/marquee.js`
- Assets: `assets/images/socialmedia/*`
- Support script (new): `scripts/generate-marquee-images.js`

**Implementation strategy**
- Treat the folder as a source-of-truth library.
- The folder contains multiple renditions (e.g., `.jpg` + `.webp`, and some `_Mobile` variants). For the marquee, include **each creative once** by choosing the preferred rendition:
  - Prefer `.webp` when available.
  - Exclude `_Mobile` renditions to avoid duplicates and unnecessary downloads.
- Use `scripts/generate-marquee-images.js` to regenerate the `MARQUEE_IMAGES` array in `src/js/marquee.js` from the folder contents.
- The generator interleaves aspect buckets (prefixes `1-1_`, `2-3_`, `3-2_`, and `other`) so the sequence is mixed.

**Acceptance criteria**
- `MARQUEE_IMAGES` in `src/js/marquee.js` contains every expected filename (per generator rules).
- No missing images; no extras.
- Aspect buckets are interleaved (not grouped).

**Validation**
- `node scripts/generate-marquee-images.js --check`
- Manual: confirm the marquee shows mixed aspect ratios (no long grouped runs).


### A3. Niche page “image next to card” must load early (not only when scrolled into view)

**What**
- On `niches/*.html`, images that sit next to cards (class `.service-img`) must be available earlier (avoid loading only when reached).

**Targets**
- HTML: `niches/*.html`

**Implementation strategy**
- Remove `loading="lazy"` from `.service-img` images (or change to `loading="eager"`).
- Do not otherwise redesign the service rows.

**Acceptance criteria**
- No `.service-img` in `niches/*.html` uses `loading="lazy"`.

**Validation**
- `node scripts/validate-niche-pages.js`
- `node scripts/assert-ui-spec.js`


### A4. Make the dark overlay on `body-section-background-2025.webp` slightly less opaque

**What**
- The dark overlay layer over `body-section-background-2025.webp` should be slightly lighter.

**Targets**
- CSS variables: `src/css/base/variables.css`
- Mobile overlay pseudo-element: `src/css/base/layout.css`

**Implementation strategy**
- Reduce overlay opacity slightly on:
  - desktop parallax overlay (uses `--body-section-overlay-opacity`)
  - mobile section overlay (currently hard-coded RGBA in layout)
- Keep the site readable: still dark enough for white text.

**Acceptance criteria**
- Visual check: background appears slightly lighter than before, while maintaining text readability.
- Overlay changes apply consistently wherever `body-section-background-2025.webp` is used.

**Validation**
- `node scripts/validate-niche-pages.js` (checks you removed the old hard-coded mobile background override)
- Manual visual review (required)


---

## B) Mobile-only niche background fix (`niches/*`)

**What**
- On **mobile only**, every `niches/*.html` must use the same **body section background + dark overlay pattern** used by the site’s other pages.
- Specifically apply `body-section-background-2025.webp` the same way as the established pattern.
- Do not change desktop appearance unless the established pattern already does so responsively.

**Targets**
- CSS: `src/css/pages/estate-agents.css` (contains a mobile-only `body.page-niche` background rule)

**Implementation strategy**
- Remove or replace the mobile-only `body.page-niche` background that currently uses the **book hero** image.
- Let niche pages inherit the same mobile background approach used elsewhere:
  - section-level backgrounds + overlay pseudo-element, based on `body-section-background-2025.webp`.

**Acceptance criteria**
- On mobile, niche pages no longer use `book-hero-calendly-mobile-2025*` as the body background.
- On mobile, niche pages match the established section background pattern used across the site.
- Desktop niche appearance remains unchanged.

**Validation**
- `node scripts/validate-niche-pages.js` (fails if the old mobile niche body background image string remains)
- Manual mobile check (required)


---

## C) Additional required fixes on `services.html`

### C1. “Core Bundle Bullets” heading formatting (color + line break)

**What**
Inside the card whose headline is near:
- “start small. ship fast. expand when it is working.”

Change the “Core bundle bullets …” heading to exactly:

- Line 1 (BLUE): `Core Bundle Bullets:`
- Line 2 (WHITE): `(applies across packs)`

Also:
- “Core bundle bullets” must render blue (not white).
- Reuse existing CSS tokens/classes; do not introduce new colors.

**Targets**
- `services.html`
- Likely also needs a token alias in `src/css/base/variables.css` (because markup already references `--color-primary`)

**Implementation strategy**
- Replace the existing single-line heading:
  - `Core bundle bullets (applies across packs):`
- With a two-line heading using the **same markup technique** already used for:
  - `General Service Lines:` + `(modules that can extend any niche pack)`
- Reuse the same existing tokens:
  - blue via `var(--color-primary)` (ensure `--color-primary` resolves to the site’s blue token)
  - white via `var(--color-white)`

**Acceptance criteria**
- The exact strings appear, with exact casing/punctuation:
  - `Core Bundle Bullets:`
  - `(applies across packs)`
- “Core Bundle Bullets:” renders in blue.
- “(applies across packs)” renders in white.
- No instance of the old full string remains.

**Validation**
- `node scripts/validate-services-page.js`


### C2. Desktop alternation of the four image/card pairs

**What**
For the section containing the four image filenames below, enforce this desktop left/right pattern (vertical order unchanged):

1. `General_Services_1.jpeg` (Left) | Card (Right)
2. Card (Left) | `General_Services_2A.jpeg` (Right)
3. `General_Services_2B.jpeg` (Left) | Card (Right)
4. Card (Left) | `General_Services_3.jpeg` (Right)

**Targets**
- `services.html`
- CSS ordering rule that currently swaps even service rows:
  - `src/css/components/cards.css` (the `:nth-of-type(even)` rule)

**Implementation strategy**
- Make desktop left/right placement depend on **DOM order** for these pairs.
- Remove or neutralize the global `service-row:nth-of-type(even)` reordering rule (it is unstable because `:nth-of-type` counts all `div` siblings, not just `.service-row`).
- In `services.html`, ensure each of the 4 relevant `.service-row` blocks has child order matching the required left/right pattern on desktop.
- Preserve mobile stacking (image above card) via the existing mobile order rules in `src/css/pages/services.css`.

**Acceptance criteria**
- On desktop, the four pairs match the required order.
- No other vertical reordering occurs (sequence stays 1, 2A, 2B, 3).
- Mobile still stacks image above card as before.

**Validation**
- `node scripts/validate-services-page.js` (checks DOM order per image row and that the unstable global CSS reorder rule is removed)
- Manual desktop check (required)


---

## D) Menu banner (desktop vs mobile)

### D1. Desktop-only banner + Services dropdown hover behavior

**What**
- Services dropdown opens on hover.
- Banner minimizing must be disabled while:
  - cursor is over Services button, OR
  - cursor is over dropdown, OR
  - cursor is between Services button and dropdown
- When cursor leaves dropdown to outside the banner+gap+dropdown:
  - dropdown hides first, then ~1s later banner may minimize
- If cursor leaves dropdown onto the banner:
  - dropdown hides; banner stays expanded; banner may minimize after cursor leaves banner
- Must work reliably every time, not just first interaction.

**Targets**
- JS: `src/js/header-nav.js`
- CSS hover gap: `src/css/components/header.css` (add a hover bridge area so there is no “dead zone” between button and dropdown)

**Implementation strategy**
- Gate hover behavior to desktop-capable pointers:
  - `matchMedia('(hover: hover) and (pointer: fine)')`
- Use a single state machine for:
  - header expanded/collapsed
  - services dropdown open/closed
  - minimize timers (clear/restart deterministically)
- Add a CSS “hover bridge” (pseudo-element) that extends the dropdown’s hoverable region upward into the gap.

**Acceptance criteria**
- All bullet behaviors above are satisfied on desktop.
- No flicker; no one-time-only behavior.
- Dropdown closes before banner minimizes when leaving to outside.

**Validation**
- Manual behavior matrix (required; see ExecPlan.md)


### D2. Mobile menu panels

**What**
- The “← Services” drill button font size must match the first panel’s links (“Home”, “About”, “Book”, “Contact”).
- Buttons on both panels should begin appearing only after the panel has slid ~50% into place.

**Targets**
- JS (button creation): `src/js/header-nav.js`
- CSS animations: `src/css/components/header.css`

**Implementation strategy**
- Ensure `.mobile-nav-link` styles apply consistently to both `<a>` and `<button>`.
- Adjust the item fade-in delay formula so it starts after `0.5 * --mobile-nav-panel-slide-ms` rather than after the full slide duration.

**Acceptance criteria**
- Font size matches across panels.
- Item fade-in starts mid-slide (not after slide completes).

**Validation**
- Manual mobile check (required)


---

## E) Spacing reduction (services + niches) — page maps + where to reduce

Goal: **consistent, very minimal, equal spacing** between sections on Services and Niche pages.

### Services page map (services.html)

1. Hero
2. Niche Pains  
   **Reduce space between 2 & 3**
3. Counter-product / bundle overview  
   **Reduce space between 3 & 4**
4. Proof in Numbers strip  
   **Reduce space between 4 & 5**
5. Outcomes & Benefits  
   **Reduce space between 5 & 6**
6. How It Works
7. Risk & Reassurance
8. Pricing  
   **Reduce space between 8 & 9**
9. FAQs  
   **Reduce space between 9 & 10**
10. Innovation Gallery + Double Marquee
11. Final CTA
12. Footer

**Targets**
- `services.html` section class lists
- `.section.compact-section` padding: `src/css/pages/estate-agents.css`

**Implementation strategy**
- Add `compact-section` to Services sections **2, 3, 5**.
- Reduce `.section.compact-section` vertical padding slightly (site-wide for services + niches).
- Keep hero and final CTA padding unchanged unless necessary.

**Acceptance criteria**
- `services.html` contains **9** occurrences of `compact-section` (was 6 before).
- Visual: spacing between the mapped section boundaries is noticeably tighter and more uniform.

**Validation**
- `node scripts/validate-services-page.js` (checks compact-section count)
- Manual desktop + mobile visual review (required)


### Niche pages map (`niches/*.html`)

1. Hero
2. Niche pains  
   **Reduce space between 2 & 3**
3. Counter-product / bundle overview  
   **Reduce space between 3 & 4**
4. Proof in Numbers strip  
   **Reduce space between 4 & 5**
5. Outcomes & benefits  
   **Reduce space between 5 & 6**
6. How it works
7. Risk & reassurance
8. Pricing  
   **Reduce space between 8 & 9**
9. FAQs
10. Final CTA
11. Single Marquee (auto-inserted by JS)
12. Footer

**Targets**
- All niche pages: `niches/*.html`
- `.section.compact-section` padding: `src/css/pages/estate-agents.css`

**Implementation strategy**
- Add `compact-section` to niche sections **2, 3, 5** on every niche page.

**Acceptance criteria**
- Every niche page contains **8** occurrences of `compact-section` (was 5 before).
- Visual: tighter, more uniform gaps between sections.

**Validation**
- `node scripts/validate-niche-pages.js` (checks compact-section count)
- Manual desktop + mobile visual review (required)


---

## F) Mobile marquee performance

**What**
- On mobile, single and double marquees must preload their images so there’s no visible lag (no “popping in” as they load).

**Targets**
- JS: `src/js/marquee.js`

**Implementation strategy**
- On mobile (`max-width: 768px` or equivalent matchMedia), preload the marquee image URLs **before** starting animation.
- Use a lightweight preloader (create `Image()` objects) and start marquee only after a short threshold:
  - either all images loaded
  - or a timeout fallback (so we don’t block forever on slow networks)

**Acceptance criteria**
- In a mobile throttled network test, marquees do not visibly appear/disappear as they load.
- The marquee should still start even if some images fail to load.

**Validation**
- Manual mobile test with throttling (required)


---

## G) Services images/cards structure parity

**What**
- `services.html` should match the niche pattern: image is a sibling element above its card on mobile (not nested inside the card).

**Targets**
- `services.html`
- `src/css/pages/services.css` (mobile ordering rules already exist)

**Implementation strategy**
- Ensure each relevant “image + card” pair is structured as:
  - `<div class="service-image ...">...</div>`
  - `<div class="service-content ...">...</div>`
  - siblings within the same `.service-row`
- Preserve the existing mobile stacking behavior (image above card) via existing CSS order rules.

**Acceptance criteria**
- No service image is nested inside `.service-content` for the four specified pairs.
- Mobile view shows image above card.

**Validation**
- Manual check (required)
- `node scripts/validate-services-page.js` checks that the image/card blocks are siblings within each `.service-row` for the 4 required filenames.


---

## H) Mobile hero CTA positioning

**What**
- On mobile only, hero primary + secondary CTA buttons across all pages should move slightly upward so they are not cut off at the hero bottom.

**Targets**
- CSS: `src/css/components/hero.css`
- Potentially also `src/css/base/layout.css` if padding interacts with hero height.

**Implementation strategy**
- Adjust mobile-only hero padding and/or CTA container spacing.
- Prefer adding breathing room via `padding-bottom` (and respect safe-area insets if present) rather than negative margins.

**Acceptance criteria**
- On mobile, both CTA buttons are fully visible (no cutoff).
- Desktop hero layout unchanged.

**Validation**
- Manual mobile check on multiple hero pages (required)
