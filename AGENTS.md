<!-- AGENTS.md -->

# AGENTS – Guidance for Codex on `silverstone-site-main`

This file tells Codex **how to behave** when working in the `silverstone-site-main` repository. It defines roles, constraints, and how to use the other project docs.

---

## Repository expectations

- This repo is a static multi‑page marketing site deployed on Netlify.
- Visual parity is critical: aside from explicitly documented bugs, pages should look and behave exactly as they do now.
- The **Estate Agents** page (`niches/estate-agents.html`) is the top‑priority area for refactors and bugfixes.
- The key control documents are:
  - `ExecPlan.md` – Current execution plan for the Estate Agents & CSS/JS refactor.
  - `PLANS.md` – Slice‑level breakdown and instructions for using ExecPlans.
  - `RULES.md` – CSS & JS rules of engagement.
  - `TESTS_PLAN.md` – Test IDs (V*, F*, D*) and scenarios.
  - `ESTATE-AGENTS-NOTES.md` – Brief of known Estate Agents issues and desired outcomes.

Codex must **always read these files** before performing multi‑step refactors.

---

## ExecPlans

When working on complex features or significant refactors in this repo:

- Treat `ExecPlan.md` as the **single source of truth** for the current refactor.
- Follow the structure defined in `PLANS.md` and the skeleton recommended for ExecPlans.
- Update the ExecPlan as you discover surprises, make decisions, and complete progress.

---

## Roles / Agents

These “agents” are conceptual roles that Codex may adopt. When a human asks Codex to act as one of these agents, follow the guidance below.

### 1. Planner Agent

**Role:** Decide which slice and subtask to work on next, based on the repo state and this documentation.

**Responsibilities:**

- Read `ExecPlan.md`, `PLANS.md`, `RULES.md`, `TESTS_PLAN.md`, and `ESTATE-AGENTS-NOTES.md`.
- Determine the next slice that:
  - Respects ordering (Slice 0 → 8).
  - Has prerequisites satisfied (tests in place, prior slices done).
- Break the slice into small, incremental steps (e.g., “adjust Estate card backgrounds for one section, run tests, then expand”).

**Constraints:**

- Do not modify code directly; instead, propose which files and sections should be edited.
- Always tie work to specific tests (e.g., “This step will be validated by V2, F2, D6”).

---

### 2. CSS Refactor Agent

**Role:** Implement safe CSS changes according to the rules of engagement.

**Responsibilities:**

- Work primarily in:
  - `assets/css/styles.css`
  - `assets/css/mobile.css`
  - `assets/css/custom.css`
  - `assets/css/hero-base.css`
  - `assets/css/services.css`
  - Estate‑specific styles and any new CSS files introduced for page‑scoped overrides.
- Apply the “strangler” pattern:
  - Use page‑scoped wrappers (e.g., `.page-estate-agents`) and modifiers.
  - Avoid global changes until tests and prior slices are stable.

**Constraints (summarized from `RULES.md`):**

- Do **not** introduce new `!important` declarations except where explicitly allowed and justified in `ExecPlan.md`.
- Do **not** change:
  - Base `.neon-card` styles in early slices (0–3).
  - Global `section` spacing in early slices (0–2).
- Keep nav and Services overlay styling adjustments narrowly scoped to the relevant selectors (e.g., `.site-header`, `.services-toggle`, `.services-menu`, `.service-pill`).

---

### 3. JS Refactor Agent

**Role:** Implement safe JS changes for cookie banner, nav/overlay, stats, and contact flows.

**Responsibilities:**

- Work primarily in:
  - `assets/js/script.js`
  - `assets/js/cookie-consent.js`
  - Inline contact JS in `contact.html`
- Keep external behaviour stable except where the ExecPlan explicitly calls for a change.

**Constraints (summarized from `RULES.md`):**

- Do not change DOM hooks (IDs, classes, `data-*` attributes) without updating **all** references and tests.
- Preserve:
  - Cookie banner semantics: Accept/Decline persistence and storage keys.
  - Nav accessibility (ARIA attributes).
  - Stats counters (trigger once per view).
  - Contact form API contract with `netlify/functions/send-email.js`.
- Prefer small, targeted refactors (e.g., introducing helper functions) over wholesale rewrites.

---

### 4. Tester Agent

**Role:** Run and interpret tests, and suggest fixes based on failures.

**Responsibilities:**

- Use the test commands defined in `package.json` once Slice 0 is implemented:
  - `npm run test:dom`
  - `npm run test:e2e`
  - `npm run test:visual`
  - `npm run test:accessibility` (if available)
- Map failing tests back to test IDs (V*, F*, D*) using `TESTS_PLAN.md`.
- Report test failures in a form that the CSS/JS Refactor Agents can act on.

**Constraints:**

- Do not change code; only run commands and report results.
- Always mention which slice and test IDs are being validated.

---

### 5. Reviewer Agent

**Role:** Review diffs against the rules of engagement and tests before changes are accepted.

**Responsibilities:**

- Inspect diffs produced by Codex or humans.
- Check:
  - Whether diffs respect `RULES.md`.
  - Whether relevant tests were run and passed.
  - Whether changes are appropriately scoped to the current slice.

**Constraints:**

- Do not modify code in this role; suggest follow‑ups instead.
- For questionable changes, refer back to `ExecPlan.md` and `PLANS.md` and recommend adjustments.

---

## Tools & behaviour for Codex

- **File operations:** Use `apply_patch` to make small, targeted edits. Avoid huge patches that touch many unrelated areas.
- **Shell commands:** Use `npm` commands described in `ExecPlan.md` and `TESTS_PLAN.md` once they exist. Always show the working directory and the exact command.
- **Web search:** Use web search only for:
  - Library or tool documentation (e.g., Playwright API).
  - Clarifying generic concepts (e.g., Lighthouse usage).
  - **Never** for guessing about this particular repo; prefer reading local files.

---

## Summary of must‑follow rules

- Always read `ExecPlan.md` and `PLANS.md` before starting multi‑step work.
- Follow slices in order; do not skip ahead to global cleanup before tests and Estate fixes are in place.
- Keep diffs small and scoped.
- Treat tests (V*, F*, D*) as mandatory gates.
- Prioritize stability of the Estate Agents page, nav, cookie banner, and Book/Contact flows.
