<!-- FILE: AGENTS.md -->
# Agent Rules — Pricing React Embed (Static Site, No Regressions)

These rules are binding for Codex and any sub-agents.

## 1) Scope lock (what you MAY change)
Allowed changes are limited to:
- Pricing integration on:
  - `services.html`
  - `niches/*.html` (all files currently present in the repo)
- New React widget source files in a clearly isolated folder (recommended: a new top-level folder used only for the pricing widget)
- Build scripts needed to output stable pricing widget assets
- New validation scripts under `/scripts/`
- Updates to steering docs and Codex scripts/config in this repo

## 2) Out-of-scope (what you MUST NOT change)
- Do not modify hero markup/structure anywhere:
  - do not rename/remove `#hero-shader-canvas`, `.hero.title-band`, `.hero .title-wrap`, `.hero-media`
- Do not refactor, reformat, or “clean up” unrelated HTML/CSS/JS
- Do not change navigation, footer, copy outside pricing, or any other sections
- Do not introduce a framework or rebuild the site architecture
- Do not add new features (analytics, tracking, new pages, new UI components beyond what pricing requires)

## 3) Copy rules (non-negotiable)
- `PRICING_COPY_MAP.md` is the single source of truth
- Do not edit `PRICING_COPY_MAP.md`
- Do not paraphrase or invent copy
- Use the exact currency and amounts specified
- If copy is missing for a target page, STOP and fail the build with a clear error (do not guess)

## 4) Visual fidelity rules (non-negotiable)
- The pricing UI must preserve the baseline look from `pricing_code.tsx`
- Row 1 must remain visually identical aside from:
  - copy substitution
  - toggle label change (`Yearly` → `Setup`)
  - toggling numeric values between monthly and setup fee
- Row 2 may be lightly reformatted ONLY as needed to present the Row 2 copy map content (no redesign)

## 5) Integration rules (static site embedding)
- Embed React like a widget:
  - build static JS + CSS assets with stable filenames
  - include them in the target HTML pages
  - mount into a dedicated container element inside `<section id="pricing">`
- Must not interfere with existing `assets/js/app.js` execution or DOM-ready timing.

## 6) Data + mapping rules
- Use `data-ss-pricing-page` on the mount element to select the correct page block.
- The attribute value must match the page id keys used in `PRICING_COPY_MAP.md` headings (e.g. `services.html`, `niches/dentists.html`).
- Enforce “2×3 cards per page” by validation (fail if not satisfied).

## 7) Verification rules (must run)
After implementation, you must run:
- `npm run build`
- `npm run validate`
- `node scripts/validate-pricing-copy-map.js`
- `node scripts/validate-pricing-mounts.js`

If any fail:
- fix the smallest possible change
- re-run the failing command(s)
- do not proceed until passing

## 8) Safety-first defaults (when ambiguous)
If you encounter an ambiguity:
- Choose the smallest, safest interpretation that preserves the site
- Prefer adding isolated files over editing shared ones
- Prefer scoped styling over global styling
- Prefer stable, explicit page keys over inference from URL path
