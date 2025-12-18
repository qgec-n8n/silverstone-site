<!-- FILE: codex/SITE_UI_FIXES_SPEC.md -->

# Site UI Fixes Spec (A–E + Mobile marquee ready-gate + Desktop hover corridor)

This spec is the source of truth for the UI fixes. Implement exactly as written.

## Scope
Target pages:
- Top-level: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`
- All niche pages: `niches/*.html`

Primary code areas:
- Hero shader: `src/js/hero-shader.js` + `<canvas id="hero-shader-canvas" ...>`
- Desktop/mobile nav: `src/js/header-nav.js`, `src/css/components/header.css`
- Marquees: `src/js/marquee.js`, `src/css/features/marquee.css`
- Spacing: `src/css/base/layout.css`, `src/css/base/typography.css`, `src/css/base/variables.css`

---

## A) General fixes (desktop + mobile)

### A1) Hero shader variants
- `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`:
  - Hero shader must use **BLUE** variant.
- All `niches/*.html`:
  - Hero shader must use **PURPLE** variant.

**Implementation rule**
- Prefer using the existing `data-variant="..."` convention on `#hero-shader-canvas`.

**Acceptance**
- Canvas exists with `id="hero-shader-canvas"` on every page.
- Main pages: `data-variant="blue"`.
- Niche pages: `data-variant="purple"`.

### A2) Marquees must use all `assets/images/socialmedia` images, shuffled
- Both single + double marquees must use **all** available images from `assets/images/socialmedia`.
- Order must be **shuffled/mixed** (not grouped by aspect ratio).

**Interpretation (explicit)**
- Treat “all images” as **all unique base images**:
  - Ignore extension duplicates (`.jpg` + `.webp`).
  - Treat `_Mobile` as a rendition, not a separate content image.

**Required implementation approach**
1. In `src/js/marquee.js`, define two generated blocks (used by validator):
   - `// BEGIN GENERATED MARQUEE BASES` … `// END GENERATED MARQUEE BASES`
   - `MARQUEE_BASES`: array of canonical base names (no extension, no `_Mobile`)
   - `MARQUEE_MOBILE_BASES`: set/list of bases that have `_Mobile` renditions
2. Derive the runtime list via a true shuffle (Fisher–Yates) before rendering.
3. Resolve filenames at runtime:
   - Desktop: `${base}.webp` preferred (fallback to jpg only if needed)
   - Mobile: `${base}_Mobile.webp` if available, else `${base}.webp`

**Acceptance**
- Validator confirms generated bases match the directory contents.
- Code contains an actual shuffle step (not just reversing a sorted list).

### A3) Niche side images must be present before the user reaches them
On `niches/*.html` service rows:
- Images next to cards must NOT rely on “reveal-on-scroll” to appear.
- They should be in the DOM and loaded early enough that they are visible when reached.

**Implementation guidance**
- Remove reveal-delay behavior for those side images on niche pages:
  - Either exclude those images from IntersectionObserver “reveal”
  - Or force them visible immediately (desktop + mobile)
- Prefer `loading="eager"` for those images only (avoid making every image eager site-wide).

### A4) Dark overlay slightly less opaque
- Reduce the perceived darkness of the overlay applied to `body-section-background-2025.webp` slightly.
- Do NOT change the background image itself.

**Implementation rule**
- Make a **small** reduction (e.g., ~10–15% lighter), not a dramatic change.

---

## B) Mobile niche background fix (niches/*) — mobile-only parity

**Mobile only**:
- Every `niches/*.html` page must use the **same** body-section background image + overlay pattern used by non-niche pages.
- `body-section-background-2025.webp` must apply the same way as the established pattern.

**Desktop constraint**
- Do not change desktop appearance unless the established pattern already does so responsively.

---

## C) services.html required fixes

### C1) “Core bundle bullets” heading formatting (exact)
Within the card whose headline is exactly/near:
> “start small. ship fast. expand when it is working.”

Change:
- The phrase “Core bundle bullets” from white to blue.
- Replace:
  - `Core bundle bullets (applies across packs):`
  with an h3 heading that is exactly two lines:

Line 1 (BLUE): `Core Bundle Bullets:`
Line 2 (WHITE): `(applies across packs)`

**Implementation constraints**
- Reuse the exact existing markup/line-break technique already used by:
  - “General Service Lines:” + “(modules that can extend any niche pack)”
- Reuse the exact existing tokens used there (inline styles and `display: block` approach).
- Do NOT invent new color tokens/classes.

### C2) Services image/card desktop alternation
In the section using images:
- `General_Services_1.jpeg`
- `General_Services_2A.jpeg`
- `General_Services_2B.jpeg`
- `General_Services_3.jpeg`

Desktop layout must alternate left/right in this exact order:
1. Image(Left) | Card(Right)
2. Card(Left) | Image(Right)
3. Image(Left) | Card(Right)
4. Card(Left) | Image(Right)

Constraints:
- Preserve vertical sequence.
- Preserve mobile stacking behavior; enforce alternation desktop-only using existing layout conventions.

---

## D) Menu banner — separate Desktop and Mobile fixes

### D1) Desktop Services hover corridor + minimize rules (NEW emphasis)
Desktop only:
1. Services dropdown appears on hover over the Services button.
2. The “hover recognition area” MUST cover:
   - Services button
   - the entire vertical gap between button and dropdown
   - the dropdown list area itself
3. While cursor is within that combined hover zone:
   - Dropdown remains open
   - Menu banner remains maximized (minimize disabled)
4. If cursor leaves dropdown zone to an area that is NOT the banner:
   - Dropdown disappears first
   - ~1 second AFTER dropdown has fully disappeared, banner may minimize
5. If cursor moves from dropdown list directly onto banner:
   - Dropdown disappears
   - Banner remains expanded
   - If cursor then leaves banner, banner may minimize almost right away

**Required implementation detail (hover corridor)**
- Implement a transparent hover “bridge” in CSS so the gap is still hoverable:
  - Recommended: `.services-menu::before` with negative `top` and `height` covering the gap.
  - The bridge must be active only when dropdown is open (pointer events enabled).

### D2) Mobile nav panels
Mobile only:
- The “<-- Services” button must have the same font size as the primary panel items (“Home”, “About”, “Book”, “Contact”).
- Buttons for both menu panels should begin appearing only after their panel has slid ~60% into place.

---

## E) Spacing reduction + global uniform spacing (NEW emphasis)

### E1) Global uniform spacing (entire site)
Ensure spacing between each copy section is uniform across the entire site (all pages, all sections that use `.section`):
- Target: minimal without looking overcrowded
- Guideline: approx **1.5×** the blue section title font size (section titles are 2rem → ~3rem scale)

**Required implementation approach**
1. Add spacing tokens in `src/css/base/variables.css`:
   - `--section-pad-y-desktop`
   - `--section-pad-y-mobile`
   - `--section-pad-y-tight`
2. Apply them consistently:
   - In `src/css/base/layout.css`: `.section { padding: var(--section-pad-y-desktop) 0; }`
   - In `src/css/base/typography.css` mobile breakpoint: `.section { padding: var(--section-pad-y-mobile) 0; }`
3. Provide utility classes:
   - `.section.tight-bottom { padding-bottom: var(--section-pad-y-tight); }`
   - `.section.tight-top { padding-top: var(--section-pad-y-tight); }`

### E2) Specific boundary reductions (services + niches)
Apply tighter spacing at these boundaries:

Services map (section numbers):
- Reduce space between: 2–3, 3–4, 4–5, 5–6, 8–9, 9–10

Niches map (section numbers):
- Reduce space between: 2–3, 3–4, 4–5, 5–6, 8–9

**Required method**
- For each boundary A–B:
  - Add `tight-bottom` to section A
  - Add `tight-top` to section B

**Acceptance**
- Validator confirms required sections have the expected utility classes.

---

## Validation requirements
- Run `npm run build` after changes.
- Run `bash scripts/codex.ui-fixes.sh`
- `node scripts/validate-site-ui-fixes.js --strict` must pass.
