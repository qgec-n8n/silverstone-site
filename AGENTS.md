<!-- FILE: AGENTS.md -->
# Agent Roles & Handoffs (Codex CLI)

Codex should simulate these roles sequentially (or explicitly “switch hats”) to reduce mistakes. Each role has a clear output and a gate before moving on.

## Agent 1 — Repo Cartographer

Goal: Produce a grounded map of *exact* files/selectors involved in each requested edit.

Deliverables:
- Confirm the target pages and where each section lives in HTML.
- Identify the CSS sources that style those sections (in `src/css/**`).
- Identify the JS sources that control relevant behavior (in `src/js/**`).
- Note existing patterns to replicate (e.g., niche neon border approach).

Gate to proceed:
- The map in `codex/REPO_UI_MAP.md` matches repo reality and cites exact paths.

## Agent 2 — CSS/Visual Engineer

Goal: Implement visual styling changes with minimal scope and consistent aesthetics.

Primary concerns:
- Pricing light-mode tint vibrancy (Edit #1)
- Neon border parity & image fit (Edits #2, #7)
- Section subtitle color (Edit #3)
- Hero legibility and mobile layout tuning (Edits #4, #5, #6, #12b, #12c)
- Home services image tiles layout (Edit #11)

Rules:
- Prefer adding/adjusting rules in the most specific file (page CSS for page-specific, component CSS for shared).
- Avoid changing global tokens unless needed; if you add a new token, document it.

Gate to proceed:
- `npm run build:css` succeeds and phase validators pass.

## Agent 3 — JS/Interaction Engineer

Goal: Implement behavior changes without regressions.

Primary concerns:
- Mobile menu banner two-step interaction (Edit #12a)
- Lightbox wiring for new index service images (Edit #11f)
- Calendly loading strategy (Edit #8) if JS is required (prefer HTML preload first)

Rules:
- Keep changes localized; avoid rewriting large modules.
- Preserve existing accessibility patterns (ARIA attributes, focus handling).
- Add `SPEC:` markers where required.

Gate to proceed:
- `npm run build:js` succeeds and interaction-related validations pass.

## Agent 4 — Content & Markup Editor

Goal: Make exact text/content edits without layout regressions.

Primary concerns:
- About stats values and label changes (Edit #9)
- Index stats copy + numeric-only animation requirements (Edit #10)
- Index “Our Services” cards → images (Edit #11)

Rules:
- Text must match the requested wording exactly (case and punctuation included).
- Keep structure consistent with existing styles; avoid unnecessary markup changes.

Gate to proceed:
- `node scripts/validate-requested-edits.js --strict` passes.

## Agent 5 — Validation Engineer

Goal: Keep the repo’s verification scripts aligned with the spec.

Responsibilities:
- Update `scripts/validate-requested-edits.js` and other validators if the spec changes.
- Ensure validators check for required markers + critical functional requirements (not cosmetic-only).

Gate to proceed:
- Full pipeline `bash scripts/codex.requested-edits.sh` passes.

## Agent 6 — QA / Release Steward

Goal: Reduce risk of missed edge cases and ship clean.

Responsibilities:
- Run `scripts/serve.sh` and complete `codex/MANUAL_QA_CHECKLIST.md`.
- Validate mobile-only behaviors in emulation (at minimum 390×844 and 375×667).
- Ensure no unrelated pages broke.

Gate to finish:
- Manual QA checklist complete, and a short release note is written in `codex/UI_CHANGE_LOG.md`.
