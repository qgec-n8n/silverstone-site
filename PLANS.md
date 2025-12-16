<!-- FILE: PLANS.md -->

# PLANS — Operating Playbook for Codex (React Pricing Embed)

## Operating principles
1) **Surgical scope**
- Implement only the pricing embed feature described in `ExecPlan.md`.
- Do not refactor, rename, or reformat unrelated code.

2) **Deterministic mapping**
- `PRICING_COPY_MAP.md` is the only source of truth for pricing copy and values.
- Copy/prices must be generated/parsed — not retyped into React code.

3) **Isolation first**
- Prefer Shadow DOM + shadow-scoped CSS to avoid host-site regressions.
- Avoid changing global CSS unless absolutely necessary (and if done, must be tiny and justified).

4) **Preserve shader & DOM**
- Hero shader depends on existing markup and CSS stacking.
- Treat `.hero.title-band` and `#hero-shader-canvas` as “do not touch”.

---

## Gate sequence (must follow)
### Gate 0 — Read-first and inventory
- Read: `AGENTS.md`, `ExecPlan.md`
- Read: `codex/PRICING_COPY_PARSER_SPEC.md`, `codex/PRICING_WIDGET_UI_SPEC.md`, `codex/PRICING_SHADER_GUARDS.md`
- Confirm target pages contain the pricing placeholder text.

### Gate 1 — Copy pipeline
- Implement generator + validator:
  - `scripts/pricing-copy-map-to-json.js`
  - `scripts/validate-pricing-copy-map.js --strict`
- Confirm generated JSON contains all 10 page keys and correct counts.

### Gate 2 — Widget implementation
- Implement a self-contained React widget bundle with a global mount API.
- Implement exact UI behavior from the specs:
  - Row 1 toggle
  - Setup fee switching
  - Row 2 without toggle

### Gate 3 — Widget build
- Implement `scripts/build-pricing-widget.js` and ensure it:
  - runs copy generation first
  - produces `assets/js/ss-pricing-widget.iife.js`

### Gate 4 — Loader + HTML mounts
- Add loader module to `src/js/` and include it in `scripts/build-js.js`.
- Replace pricing placeholder region only with mount containers per `codex/PRICING_PAGE_MOUNT_MAP.md`.

### Gate 5 — Verification
Must run:
- `npm run build:css`
- `npm run build:js`
- `node scripts/build-pricing-widget.js`
- `node scripts/validate-pricing-copy-map.js --strict`
- `node scripts/validate-pricing-embed-markup.js --strict`
- `bash scripts/codex.maintenance.sh`

Manual browser checks are required (see ExecPlan Gate 6).

---

## Completion definition
- All gates passed.
- Validators pass in strict mode.
- No shader regressions observed.
- Diff is limited to allowed change surface from `ExecPlan.md`.
