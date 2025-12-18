<!-- FILE: ExecPlan_Site_UI_Fixes.md -->

# ExecPlan: Site UI Fixes A–E (Desktop + Mobile)

## Mission
Implement the exact UI fixes in `codex/SITE_UI_FIXES_SPEC.md` (requirements A–E). Keep diffs minimal and scoped. Do not redesign.

## Ground truth (read first)
1. `AGENTS.md` (repo-wide constraints + build rules)
2. `codex/SITE_UI_FIXES_SPEC.md` (the spec; A–E are mandatory)
3. `scripts/validate-site-ui-fixes.js` (automated acceptance checks)

If any older plan/docs conflict with this spec, **the spec wins for this run**.

## Allowed Codex models (constraint)
Use only:
- `gpt-5.2` (default)
- `gpt-5.1-codex-max` (fallback for tricky UI logic)

## Execution strategy (evaluation flywheel)
Work in small phases. After each phase:
- rebuild assets if needed (`npm run build:css`, `npm run build:js`)
- run `node scripts/validate-site-ui-fixes.js`
- fix failures before moving on

### Phase 0 — Baseline
- Run: `bash scripts/codex.ui-fixes.sh`
- Record failures (expected initially).

### Phase 1 — Shader variants + niche eager images + overlay opacity
Implement:
- A: hero shader variants (blue on main pages; purple/default on niches)
- A: niche “service images” must not be lazy-loaded
- A: reduce `--body-section-overlay-opacity` slightly (spec-defined)

Gate:
- `node scripts/validate-site-ui-fixes.js`

### Phase 2 — Mobile niche background fix (niches/*)
Implement:
- B: remove the mobile-only niche body background override that differs from the established pattern
- B: ensure the parallax mobile stage uses a path that works from `/niches/*.html`

Gate:
- `node scripts/validate-site-ui-fixes.js`

### Phase 3 — Marquee image list: use all + shuffled
Implement:
- A: marquee image list must include **all** eligible images and be **mixed** (not grouped by aspect ratio)

Gate:
- `node scripts/validate-site-ui-fixes.js`

### Phase 4 — services.html required edits (C1 + C2)
Implement:
- C1: “Core Bundle Bullets” two-line heading with correct blue/white tokens and the same line-break technique pattern
- C2: enforce the exact desktop left/right alternation for the four image/card rows (without breaking mobile stacking)

Gate:
- `node scripts/validate-site-ui-fixes.js`
- `node scripts/validate-services-page.js --strict` (regression)

### Phase 5 — Menu banner behavior (Desktop) + Mobile nav fixes
Implement:
- D1: hover-based Services dropdown + header minimize timing rules (desktop-only)
- D2: mobile nav font-size parity + item reveal timing (~60% into slide)

Gate:
- `node scripts/validate-site-ui-fixes.js`
- Manual checks from `codex/SITE_UI_FIXES_SPEC.md`

### Phase 6 — Spacing reduction review (services + niches)
Implement:
- E: add `tight-bottom` to the exact sections listed in the spec (services + each niche page)
- E: ensure `.section.tight-bottom` utility exists in base layout CSS

Gate:
- `node scripts/validate-site-ui-fixes.js`

## Final gate (must pass before finishing)
Run the full suite:
- `bash scripts/codex.maintenance.sh`

## Deliverable format
At completion, output:
- A checklist mapping each requirement (A–E) → files changed → how it was verified
- Any manual QA notes (especially Desktop Services dropdown + header minimize behavior)
