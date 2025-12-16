<!-- FILE: PLANS.md -->

# Execution Playbook (Codex CLI) — Services Page Overhaul

This repo uses an **ExecPlan** workflow:
- `ExecPlan.md` is the task-specific executable specification.
- You must execute in phases and verify after each gate.

## Operating principles
1) Scope discipline
- Only implement what is required for the services overhaul.
- No unrelated cleanup or refactors.

2) Preserve design system
- Match estate-agents HTML structures and class patterns.
- Preserve locked Services-only blocks verbatim.

3) Continuous verification
- Run lightweight checks often (`bash scripts/codex.maintenance.sh`)
- Run strict checks before finishing (`node scripts/validate-services-page.js --strict`)

## Phase gates (must be satisfied in order)

### Gate 0 — Preflight complete
- You have read all “Read-first” docs in `AGENTS.md`.
- You have identified the exact HTML ranges for:
  - Innovation Gallery + Double Marquee block
  - Final CTA banner block
- You understand the **special-case**: Section 3.5 is split into **two cards**.

### Gate 1 — WebP assets generated
- `node scripts/convert-services-images-to-webp.js` runs without errors
- All required `.webp` outputs exist next to their `.jpeg` counterparts:
  - `General_Services_1(.webp)` + `_Mobile`
  - `General_Services_2A(.webp)` + `_Mobile`
  - `General_Services_2B(.webp)` + `_Mobile`
  - `General_Services_3(.webp)` + `_Mobile`

### Gate 2 — services.html rebuilt structurally
- `services.html` now follows estate-agents’ section patterns
- Copy applied from `Services_Overhaul_Copy.md` (instructions obeyed)
- 3.4 / 3.5 / 3.7 image sections use WebP-first `<picture>`
- Section 3.5 is implemented as **two stacked cards** with alternating layout.

### Gate 3 — Locked blocks restored verbatim
- Innovation Gallery + Double Marquee block inserted verbatim
- Final CTA banner preserved verbatim and remains immediately above the footer
- No Single Marquee is introduced
- `<body class="page-services">` remains

### Gate 4 — Final validation pass
Run and pass:
- `bash scripts/codex.maintenance.sh`
- `node scripts/validate-services-page.js --strict`
- `npm run build:css`
- `npm run build:js`

## What “done” means
Done means:
- The page matches estate-agents structure (visually and structurally)
- Services-only locked blocks are unchanged
- WebP-first images are implemented (including 2A + 2B for section 3.5)
- Icon usage is valid and mapped
- Strict validation passes
