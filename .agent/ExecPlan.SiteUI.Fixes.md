<!-- FILE: .agent/ExecPlan.SiteUI.Fixes.md -->

# ExecPlan: Site UI Fixes (Hero shaders, marquees, nav hover, spacing)

**Goal:** Implement the required UI fixes across top-level pages + all `niches/*.html` while preserving the site’s current architecture (static HTML + modular CSS in `src/css/**` + vanilla JS in `src/js/**`, bundled to `assets/**`).

## Model constraint
Use only **GPT-5.1 Codex Max** or **GPT-5.2**.

---

## Non-negotiable rules (do not violate)

1. **Desktop vs Mobile separation must be explicit**
   - Desktop-only behavior must be gated with `(hover:hover) and (pointer:fine)` and/or `matchMedia(...)`.
   - Mobile-only behavior must be gated with `(max-width: 768px)` and/or `(hover:none)`.

2. **No styling-token invention for Services C1**
   - Reuse the **exact** existing color tokens/inline-style technique already used in the “General Service Lines:” heading pattern.
   - Do NOT add new color variables for that change.

3. **Minimize diffs**
   - No sweeping reformatting.
   - No unrelated refactors.

4. **Build artifacts must remain consistent**
   - Make changes in `src/**` and relevant `.html` files.
   - Rebuild to update `assets/css/styles.css` and `assets/js/app.js`.

---

## Required reading order (must read before editing)

1. `codex/CODEX_INIT_PROMPT_SITE_UI_FIXES.md`
2. `codex/SITE_UI_FIXES_SPEC.md`
3. `AGENTS.md` (general repo safety rules)
4. Code targets:
   - Desktop/mobile nav: `src/js/header-nav.js`, `src/css/components/header.css`
   - Marquees: `src/js/marquee.js`, `src/css/features/marquee.css`
   - Section spacing: `src/css/base/layout.css`, `src/css/base/typography.css`, `src/css/base/variables.css`
   - Parallax/mobile backgrounds: `src/js/parallax.js`, `src/css/features/parallax.css`
   - Hero shaders: `src/js/hero-shader.js` + affected `.html` pages

---

## Execution workflow (evaluation flywheel)

### Gate 0 — Baseline (no edits)
Run:
- `bash scripts/codex.setup.sh`
- `node scripts/validate-site-ui-fixes.js` (may fail pre-fix; capture output)

Stop if baseline build/validators fail due to repo corruption (missing files, broken scripts).

### Gate 1 — Desktop Services hover + “hover corridor” (NEW emphasis)
Implement **Desktop-only** Services dropdown behavior per spec D1, including:
- Open dropdown on hover over the Services button.
- Keep dropdown + banner maximized while cursor travels downward into the dropdown:
  - Expand hover-recognition area to include:
    - Services button
    - gap between button and dropdown
    - dropdown list area
- Close/minimize timing rules must match the spec exactly.

Run:
- `npm run build`
- `node scripts/validate-site-ui-fixes.js --strict` (must pass hover bridge + hover open checks)

### Gate 2 — Uniform spacing + specified boundary reductions (NEW emphasis)
Implement global, uniform section spacing across the site (all pages), plus additional reductions at the specific boundaries for:
- `services.html`
- all `niches/*.html`

Run:
- `npm run build`
- `node scripts/validate-site-ui-fixes.js --strict` (must pass spacing tokens + boundary-class checks)

### Gate 3 — Mobile marquee “always loaded” behavior (NEW emphasis)
Implement mobile-only marquee loading guarantees:
- All marquee images should be fully loaded/decoded before animation runs on mobile.
- No “appearing/disappearing” due to late image loads.

Run:
- `npm run build`
- `node scripts/validate-site-ui-fixes.js --strict` (must pass “mobile ready gate” checks)

### Gate 4 — Remaining A–E requirements
Finish remaining spec items (hero shader variants, niche background parity on mobile, services C1/C2, niche side-images preloading, overlay opacity, shuffle-all social media images).

Run:
- `bash scripts/codex.ui-fixes.sh` (wrapper)
- Manual smoke checks (see below)

### Final Gate — Manual smoke tests (required)
In a browser:

**Desktop**
- Hover Services button: dropdown opens immediately.
- Move cursor downward into dropdown through the gap: dropdown stays open + banner stays expanded.
- Leave dropdown to page (not header): dropdown closes first; ~1s later banner may minimize.
- Move from dropdown to banner: dropdown closes; banner remains expanded; leaving banner minimizes quickly.

**Mobile**
- Both nav panels: buttons start appearing only after panel has slid ~60% in.
- “<-- Services” button matches font size of other panel-1 items.
- Single/double marquee: no visible pop-in / late-loading images during motion.

---

## Stop conditions (must stop + report)
Stop and report if:
- Meeting the hover corridor requirement requires a redesign of the header layout.
- Global spacing uniformity cannot be achieved without rewriting section markup across pages (beyond adding/removing section utility classes).
- Marquee “always loaded” can only be achieved by removing marquee animation entirely.
