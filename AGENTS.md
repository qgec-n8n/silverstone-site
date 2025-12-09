<!-- AGENTS.md -->
# AGENTS – Project-specific guidance for `silverstone-site-main`

This file guides Codex agents working on the `silverstone-site-main` repo.

Codex must always read:

- `ExecPlan.md`
- `PLANS.md`
- `RULES.md`
- `TESTS_PLAN.md`
- `ESTATE-AGENTS-NOTES.md`

before making changes.

---

## General Principles

- **No big‑bang rewrites.** Work slice by slice as defined in `PLANS.md`.
- **Visual parity first.** Except for explicit bug fixes, pages should look and behave the same.
- **Do NOT run `npm install` or `npx` inside tasks.**
  - DevDependencies (Playwright, axe, etc.) are installed via environment setup or local dev, not from the sandbox.
- **Tests are best‑effort.**
  - Run `npm run test:*` only if scripts exist and dependencies already appear installed.
  - If tests fail due to missing dependencies, log it in `ExecPlan.md` and continue.
- **Small diffs, clear rationale.**
  - Prefer localized edits with explanations in `ExecPlan.md`.

---

## Planner Agent

**Role**

- Understand goals from `ExecPlan.md`.
- Choose the next slice from `PLANS.md`.
- Keep plan docs updated.

**Responsibilities**

- Read `ExecPlan.md`, `PLANS.md`, `RULES.md`, `ESTATE-AGENTS-NOTES.md`, `TESTS_PLAN.md` on every major step.
- Respect slice ordering and dependencies (Slice 0 → 1 → 2 → …).
- Decompose slices into small subtasks.

**Constraints**

- Does not run commands or edit files directly.
- Does not attempt to alter devDependencies or install packages.

---

## CSS Refactor Agent

**Role**

- Implement CSS changes for each slice, respecting `RULES.md`.

**Responsibilities**

- Work in:
  - `assets/css/styles.css`
  - `assets/css/custom.css`
  - `assets/css/mobile.css`
  - `assets/css/parallax-fix.css`
  - `assets/css/hero-base.css`
  - `assets/css/services.css`
  - Inline `<style>` in `niches/estate-agents.html` (when instructed)
- Use **page‑scoped overrides** (e.g., `.page-estate-agents .neon-card`) instead of global changes where possible.
- Avoid adding new `!important`; if unavoidable, document in `ExecPlan.md`.

**Constraints**

- Early slices:
  - Must not change base `.neon-card` or `section` rules in `styles.css`.
- Must not introduce global spacing/typography changes unless in Slice 8.
- Must validate Estate page visuals against known baseline sections where possible.

---

## JS Refactor Agent

**Role**

- Implement JS changes within defined boundaries, improving behaviour and maintainability.

**Responsibilities**

- Work in:
  - `assets/js/script.js`
  - `assets/js/cookie-consent.js`
  - Inline contact script in `contact.html`
  - `netlify/functions/send-email.js` (if needed)
- Preserve DOM hooks (IDs, classes, `data-*`) or update all references if changed.
- For Estate Agents:
  - Fix cookie banner stability/persistence.
  - Keep stats counters and parallax/hero helpers working.

**Constraints**

- Do not change the semantics of cookie Accept/Decline.
- Do not break ARIA roles or nav overlay accessibility.
- Do not introduce new JS deps requiring `npm install`.

---

## Tester Agent

**Role**

- Coordinate tests and interpret results, within sandbox limits.

**Responsibilities**

- Read `TESTS_PLAN.md` to understand V*, F*, D*.
- Inspect `package.json` for `test`, `test:dom`, `test:e2e`, `test:visual`, `test:accessibility`.
- When dependencies appear installed (e.g., `node_modules` present):
  - Run `npm run test:dom` for D*.
  - Run `npm run test:e2e` for F*.
  - Run `npm run test:visual` and `npm run test:accessibility` for V*/accessibility.
- Summarise results in `ExecPlan.md`.

**Constraints**

- Must NOT run `npm install`, `npm ci`, or `npx playwright install`.
- If tests fail due to missing deps, must log that fact instead of trying to fix it via npm.

---

## Reviewer Agent

**Role**

- Review proposed diffs before they are considered “done”.

**Responsibilities**

- Confirm that changes:
  - Stay within slice scope.
  - Follow CSS/JS rules in `RULES.md`.
  - Do not inadvertently alter unrelated pages/components.
- Check that any tests run (when available) are noted in `ExecPlan.md`.

**Constraints**

- Must be especially cautious with edits to `assets/css/styles.css` and `assets/js/script.js`.
- Must push back on:
  - Unscoped changes to `.neon-card`, `.section`, nav CSS.
  - New `!important` usage without strong justification.

---

## Tools & Commands

- Agents may:
  - Use `ls`, `cat`, `grep`, etc. in the workspace.
  - Use `npm run test:*` **only if** deps are installed (best‑effort).
- Agents must NOT:
  - Use `npm install`, `npm ci`, `npx`, `curl`, `wget`, or any network‑fetching command from the sandbox.

---

ExecPlan and PLANS are the source of truth. Agents must keep them updated as work progresses.
