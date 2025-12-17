<!-- FILE: AGENTS.md -->
# Agent Rules — Static Site + Embedded React Widgets

These rules apply to Codex agents working in this repo.

## 1) Primary objective

Safely embed a React “Pricing Section” widget into:
- `services.html`
- every niche page in `niches/*.html` that contains pricing sections

WITHOUT breaking the existing static site layout.

## 2) Allowed sources for pricing integration semantics (non-negotiable)

When working on the pricing widget, only use:
- `PRICING_COPY_MAP.md`
- `pricing_code_prompt.md`
- `Embed_React_Guide.md`
- the referenced Medium embedding article
- the referenced 21st.dev Pricing Section 4 reference UI

You may use OpenAI Cookbook pages only to improve execution planning / robustness, not to change integration behavior.

## 3) Safety rules (must follow)

- Minimize diffs. No mass formatting changes.
- Do not modify unrelated sections of HTML pages.
- Do not delete or refactor existing site CSS globally.
- Do not touch hero shader DOM structure or its script references:
  - `id="hero-shader-canvas"` must remain present and functional.
- Keep changes localized to:
  - pricing widget code (in an isolated folder)
  - target pricing placeholder regions in the specified pages
  - widget asset includes (one CSS link + one JS script per page)

## 4) Visual fidelity rules (non-negotiable)

- The pricing UI must preserve the baseline look from `pricing_code_prompt.md`
- Preserve:
  - toggle sliding animation (section 1 only)
  - sparkle animation
  - bullet formatting consistency
  - overall layout and design language

## 5) Copy rules (non-negotiable)

- Copy must match `PRICING_COPY_MAP.md` exactly.
- Do not reword, summarize, or “fix” copy.
- Do not edit `PRICING_COPY_MAP.md`. If it appears inconsistent, stop and report.

## 6) Data + mapping rules

- Each target page must render **two distinct pricing sections** stacked vertically.
- Each section has exactly **3 cards**.
- Use both attributes on each mount element:
  - `data-ss-pricing-page="<repo-relative-path>"` (example: `niches/dentists.html`)
  - `data-ss-pricing-section="1"` or `"2"`

Section behavior:
- Section 1:
  - toggle labels must be “Monthly” and “Setup”
  - toggle switches between monthly retainer and setup fee values for that card
- Section 2:
  - toggle does not exist
  - cards restyled only as necessary to fit copy (keep overall design)

## 7) Verification rules

Before finalizing:
- Run base validators:
  - `node scripts/validate-services-page.js --strict`
  - `node scripts/validate-niche-pages.js --strict`
- Run pricing validators:
  - `node scripts/validate-pricing-copy-map.js`
  - `node scripts/validate-pricing-mounts.js` (post-embed)
- Ensure no pricing placeholder text remains on target pages.

If a validator fails:
- Fix the minimum necessary code.
- Do not expand scope.

## 8) Stop conditions (must stop and report)

Stop immediately if:
- A target page is missing `<section id="pricing">`
- The pricing placeholder region cannot be replaced without layout changes outside that section
- CSS isolation cannot be guaranteed
- You find yourself changing global CSS rules used across the site
