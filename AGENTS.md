<!-- FILE: AGENTS.md -->
# Silverstone Static Site — Codex Agent Guardrails (UI/UX Fixes A–H)

This repo is a static multi-page HTML site. Your job (when running Codex) is to implement **all** UI/UX fixes A–H exactly as specified in **PLANS.md** by following the step-by-step workflow in **ExecPlan.md**.

## Golden rules

1. **Requirements win.** If any existing file content conflicts with the A–H requirements, **change the code** to satisfy A–H (do not preserve conflicting behavior).
2. **No scope creep.** Do not redesign, refactor, rename, or “improve” unrelated parts of the site. Only touch what is required to satisfy A–H.
3. **Reuse existing tokens/classes.** Do **not** introduce new color tokens or arbitrary hex colors. Reuse existing CSS tokens and existing responsive conventions.
4. **Source-of-truth is `src/`.**  
   - Edit **`src/css/**` and **`src/js/**`** (and the relevant `.html` pages).  
   - Then rebuild outputs: **`assets/css/styles.css`** and **`assets/js/app.js`**.
   - Do **not** hand-edit built assets unless a plan step explicitly requires it (it shouldn’t).
5. **Make changes deterministic & reviewable.** Small diffs, clear intent, no drive-by formatting.

## Repo map (what to edit)

### Pages
- Core pages (blue hero shader required): `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`
- Niche pages (purple hero shader required): `niches/*.html`

### JavaScript
- Hero shader: `src/js/hero-shader.js`
- Header / menu banner behavior: `src/js/header-nav.js`
- Single & double marquee logic: `src/js/marquee.js`
- Animations / intersection observer: `src/js/animations.js` (only if necessary for A–H)

### CSS
- Global section padding + overlay: `src/css/base/layout.css`, `src/css/base/variables.css`
- Hero layout (CTA positioning): `src/css/components/hero.css`
- Header/menu banner + mobile panels: `src/css/components/header.css`
- Services & niche shared spacing class: `src/css/pages/estate-agents.css` (contains `.compact-section`)

### Build outputs
- CSS build entry: `build-css.js` → outputs `assets/css/styles.css`
- JS build entry: `scripts/build-js.js` → outputs `assets/js/app.js`

## Build & validate commands (expected in ExecPlan)

- Install deps:
  - `npm install`
- Build:
  - `node build-css.js`
  - `node scripts/build-js.js`
- Validate (scripts are designed to fail until the A–H changes are implemented):
  - `node scripts/validate-core-pages.js`
  - `node scripts/validate-services-page.js`
  - `node scripts/validate-niche-pages.js`
  - `node scripts/generate-marquee-images.js --check`
  - `node scripts/assert-ui-spec.js`
  - `bash scripts/codex.maintenance.sh` (runs the full set)

## Accessibility & interaction expectations

- Do not break keyboard navigation: maintain sensible `aria-*` attributes and focus behavior.
- Desktop hover behavior must be gated to true hover devices (use `matchMedia('(hover: hover) and (pointer: fine)')`).
- Mobile interactions should remain tap-first and reliable.

## Output expectations (for Codex run)

When Codex finishes:
- Provide a **short change summary** grouped by requirement (A–H).
- List **all files changed**.
- Confirm you rebuilt CSS/JS outputs and ran the validation scripts.
