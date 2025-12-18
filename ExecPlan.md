<!-- FILE: ExecPlan.md -->
# Exec Plan — Silverstone UI/UX Bug Fixes & Layout Changes (A–H)

Follow this plan in order. Do not skip validation gates. The detailed spec is in **PLANS.md**; agent guardrails are in **AGENTS.md**.

---

## Mission

Implement **all** UI/UX requirements A–H from PLANS.md across:
- Core pages: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`
- Niche pages: `niches/*.html`
- Shared JS/CSS: marquee, header/nav, overlay, spacing, hero CTA positioning

### Definition of Done

- All requirements A–H satisfied (including exact strings and filename references).
- CSS/JS rebuilt into:
  - `assets/css/styles.css`
  - `assets/js/app.js`
- Validations pass:
  - `node scripts/validate-core-pages.js`
  - `node scripts/validate-services-page.js`
  - `node scripts/validate-niche-pages.js`
  - `node scripts/generate-marquee-images.js --check`
  - `node scripts/assert-ui-spec.js`
  - `bash scripts/codex.maintenance.sh`
- Manual verification completed for the interaction-heavy requirements:
  - desktop header hover behavior (D1)
  - mobile menu panel timing & typography (D2)
  - mobile marquee preload behavior (F)
  - mobile hero CTA cutoff fix (H)
  - overlay opacity and niche mobile background parity (A4, B)

---

## Working agreements

- **Requirements override repo.** If current code conflicts, change code to satisfy PLANS.md.
- **Minimal diffs.** No unrelated refactors.
- **Edit sources first** (`src/css`, `src/js`, `.html`), then rebuild `assets/*`.
- **Do not invent new styling tokens** (no new colors). Reuse existing tokens; define missing aliases only if they are already referenced in markup.

---

## Gate 0 — Preflight & inventory

1. Read: `AGENTS.md`, `PLANS.md`, this file.
2. Run setup:
   - `bash scripts/codex.setup.sh`
3. Inventory niche pages:
   - list every `niches/*.html` file (there are multiple).
4. Snapshot current failures (optional but useful):
   - run `bash scripts/codex.maintenance.sh` to see what currently fails.

**Exit gate when**
- You can name the exact file targets for each requirement.
- You understand the build workflow (`src/*` → build scripts → `assets/*`).

---

## Gate 1 — Hero shader variants (A1)

**Implement**
- Core pages: set `data-variant="blue"` on `<canvas id="hero-shader-canvas">`.
- Niche pages: remove the non-purple variants so niches render purple by default (no `data-variant` or `data-variant="default"`).

**Validate**
- `node scripts/validate-core-pages.js`

**Exit gate when**
- All targeted pages pass shader-variant checks.

---

## Gate 2 — Marquees: full image set + mixed order + mobile preload (A2, F)

### 2.1 Expand marquee image set to all socialmedia assets
**Implement**
- Add `scripts/generate-marquee-images.js` (already in repo after you apply this instruction package).
- Run generator (write mode) to update `MARQUEE_IMAGES` in `src/js/marquee.js`.
- Ensure both:
  - double marquee (services)
  - single marquee (auto-inserted elsewhere)
  use the same `MARQUEE_IMAGES` list.

**Validate**
- `node scripts/generate-marquee-images.js --check`

### 2.2 Ensure aspect ratios appear mixed
**Implement**
- The generator already interleaves aspect buckets (`1-1_`, `2-3_`, `3-2_`, `other`) so the array order is mixed.
- Do not re-sort the list in runtime.

**Validate**
- Generator `--check` (it recomputes the expected interleaved ordering)

### 2.3 Mobile marquee preload
**Implement**
- In `src/js/marquee.js`, preload marquee images on mobile devices before starting animation.
- Requirements:
  - avoid “popping” on scroll
  - do not block forever: include a timeout fallback
  - work for both single and double marquees

**Validate**
- Manual: throttle network in devtools, refresh on mobile viewport, confirm no marquee pop-in.

**Exit gate when**
- Generator check passes.
- Manual mobile marquee test passes.

---

## Gate 3 — Niche images load earlier (A3)

**Implement**
- In every `niches/*.html`, update `.service-img` so it is not `loading="lazy"` (remove the attribute or switch to eager).
- Do not restructure the page; only adjust loading behavior for the relevant images.

**Validate**
- `node scripts/validate-niche-pages.js`
- `node scripts/assert-ui-spec.js`

**Exit gate when**
- All niche pages pass validation (no lazy-loading on `.service-img`).

---

## Gate 4 — Background overlay opacity + niche mobile background parity (A4, B)

### 4.1 Reduce overlay opacity slightly
**Implement**
- `src/css/base/variables.css`: reduce overlay variables slightly.
- `src/css/base/layout.css`: reduce the mobile overlay pseudo-element opacity (or convert it to use a variable).
- Keep readability.

### 4.2 Niche mobile body background parity
**Implement**
- `src/css/pages/estate-agents.css`: remove/replace the mobile-only `body.page-niche` background that currently diverges from the site pattern.
- Niche pages on mobile must follow the established pattern used by other pages (section backgrounds + overlay).

**Validate**
- `node scripts/validate-niche-pages.js` (contains checks ensuring the old mobile niche body background image string is gone)

**Exit gate when**
- Mobile niche pages match the site background pattern (manual check).
- Overlay is slightly lighter (manual check) without harming readability.

---

## Gate 5 — Services page required changes (C, E, G)

### 5.1 “Core Bundle Bullets” two-line heading (C1)
**Implement**
- In `services.html`, replace:
  - `Core bundle bullets (applies across packs):`
- With the two-line heading specified in PLANS.md:
  - `Core Bundle Bullets:` (blue)
  - `(applies across packs)` (white)
- Use the same markup technique as the existing “General Service Lines” heading.
- Ensure the existing blue token resolves (add a missing alias variable if required).

**Validate**
- `node scripts/validate-services-page.js`

### 5.2 Desktop alternation of the four image/card pairs (C2)
**Implement**
- Ensure DOM order for the 4 required service rows matches the required left/right pairing.
- Remove/neutralize the unstable `.service-row:nth-of-type(even)` ordering rule in `src/css/components/cards.css`.

**Validate**
- `node scripts/validate-services-page.js`

### 5.3 Spacing reduction (E)
**Implement**
- Add `compact-section` to Services sections 2, 3, 5.
- Reduce `.section.compact-section` padding slightly in `src/css/pages/estate-agents.css`.

**Validate**
- `node scripts/validate-services-page.js` (compact-section count check)

### 5.4 Services image/card structure parity (G)
**Implement**
- Verify the 4 image/card pairs use the sibling structure used in niche pages (image block is not nested inside card).
- Preserve mobile stacking.

**Validate**
- Manual check.
- `node scripts/validate-services-page.js` (basic structure assertions)

**Exit gate when**
- Services validations pass.
- Desktop layout matches specified alternation (manual check).

---

## Gate 6 — Header/menu banner desktop hover + mobile panels (D)

### 6.1 Desktop hover dropdown + minimize locking (D1)
**Implement**
- Update `src/js/header-nav.js`:
  - Open Services dropdown on hover (desktop only).
  - Keep banner expanded while dropdown open or while cursor is in the button↔dropdown gap.
  - Close dropdown first; allow banner minimize ~1s after dropdown closes (when cursor is outside banner+gap+dropdown).
  - Ensure reliability across repeated interactions (no one-time-only).
- Update `src/css/components/header.css`:
  - Add a hover “bridge” area (pseudo-element) to remove dead zone.

**Validate**
Manual behavior matrix:
1. Hover Services → dropdown opens; banner stays expanded.
2. Move cursor from Services into dropdown (through gap) → no minimize, dropdown remains open.
3. Leave dropdown to outside page → dropdown closes; after ~1s banner may minimize.
4. Leave dropdown onto banner area → dropdown closes; banner stays expanded; banner may minimize only after leaving banner.
5. Repeat all steps multiple times (reliability).

### 6.2 Mobile menu panels (D2)
**Implement**
- Ensure “← Services” button typography matches other links.
- Adjust animation timing so items fade in after ~50% of panel slide.

**Validate**
- Manual on mobile viewport:
  - font sizes match
  - item fade begins mid-slide on both panels

**Exit gate when**
- Desktop hover behavior matches the matrix.
- Mobile panel behavior matches D2.

---

## Gate 7 — Mobile hero CTA positioning (H)

**Implement**
- In `src/css/components/hero.css`, adjust mobile-only hero spacing so CTA buttons are not cut off at the bottom.
- Prefer extra bottom padding (respect safe-area insets when present).

**Validate**
- Manual mobile check:
  - `index.html`
  - `services.html`
  - one niche page
  - `book.html`
- Confirm desktop unchanged.

**Exit gate when**
- CTA cutoff is resolved on mobile across pages.

---

## Finalization — Build, validate, and report

1. Rebuild outputs:
   - `node build-css.js`
   - `node scripts/build-js.js`
2. Run:
   - `bash scripts/codex.maintenance.sh`
3. Summarize changes grouped by A–H. Include:
   - what changed
   - where
   - how validated

---

## Progress tracker (keep updated during execution)

- [x] Gate 0 complete
- [x] Gate 1 complete (A1)
- [x] Gate 2 complete (A2, F)
- [x] Gate 3 complete (A3)
- [x] Gate 4 complete (A4, B)
- [x] Gate 5 complete (C, E, G)
- [x] Gate 6 complete (D)
- [x] Gate 7 complete (H)
- [x] Finalization complete

---

## Surprises log (append-only)

Record anything unexpected (e.g., hidden CSS ordering rules, runtime DOM insertion nuances, layout regressions) with:
- what happened
- where
- how it was resolved

- `scripts/validate-niche-pages.js` validates spacing (E) + overlay (A4) in addition to A3; implemented those niche-scoped E/A4/B changes before re-running the Gate 3 validation to satisfy the single validator gate.
- `src/js/marquee.js` had duplicate `MARQUEE_IMAGES` constants (single vs double marquee); consolidated into one shared list so the generator/check reflects what both marquees render.

---

## Decision log (append-only)

Record decisions that could have been done multiple ways (e.g., how you implement hover bridging, how you interpret “use all images” with multiple renditions).

- Marquee preload (F): preload all `MARQUEE_IMAGES` on mobile with a `1400ms` timeout fallback (start marquee after preload completes or timeout).
- Marquee list (A2): keep exactly one `const MARQUEE_IMAGES = [ ... ];` block in `src/js/marquee.js` so `scripts/generate-marquee-images.js` remains the source-of-truth for both single + double marquees.
- Overlay (A4): replaced the legacy `rgba(..., 0.6)` section overlay in `src/css/base/layout.css` with `rgba(0, 0, 0, var(--body-section-overlay-opacity))` to align with the existing overlay token.
