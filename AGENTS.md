<!-- FILE: AGENTS.md -->

# AGENTS — Codex Scope & Safety Rules (React Pricing Embed)

## This run’s only purpose
Embed a React pricing section (two rows) into:
- `services.html`
- `niches/estate-agents.html`
- `niches/hospitality.html`
- `niches/salons-barbers.html`
- `niches/trades-virtual-office.html`
- `niches/ecommerce.html`
- `niches/physios-chiropractors.html`
- `niches/dentists.html`
- `niches/gyms-fitness-studios.html`
- `niches/fitness-coaches.html`

…using `PRICING_COPY_MAP.md` and the UI behavior reference in `pricing_code.tsx`.

---

## Hard constraints
### 1) HTML edits must be surgical
- For each target HTML file: replace only the pricing placeholder region defined in `codex/PRICING_PAGE_MOUNT_MAP.md`.
- Do not touch hero markup, scripts, nav, or other sections.

### 2) Preserve hero shader behavior
Do not modify:
- `<canvas id="hero-shader-canvas" ...>`
- `.hero.title-band`
- hero CSS layering / z-index rules
- `src/js/hero-shader.js` unless explicitly required (normally: never)

### 3) No global CSS regressions
- Prefer Shadow DOM for the widget.
- If any host CSS must change, it must be minimal, scoped, and justified with a regression rationale.

### 4) Deterministic copy usage
- All pricing copy and values must come from `PRICING_COPY_MAP.md`.
- Do not hand-type prices into React code.
- If a value is missing, fail validation in strict mode (do not guess).

### 5) Idempotent embed
- Loader must not inject duplicate scripts.
- Mount must not run twice on the same element.

---

## Read-first order (mandatory)
1) `ExecPlan.md`
2) `codex/PRICING_COPY_PARSER_SPEC.md`
3) `codex/PRICING_WIDGET_UI_SPEC.md`
4) `codex/PRICING_PAGE_MOUNT_MAP.md`
5) `codex/PRICING_SHADER_GUARDS.md`

---

## Commands that must pass before finishing
- `npm run build:css`
- `npm run build:js`
- `node scripts/build-pricing-widget.js`
- `node scripts/validate-pricing-copy-map.js --strict`
- `node scripts/validate-pricing-embed-markup.js --strict`
- `bash scripts/codex.maintenance.sh`
