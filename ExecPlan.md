<!-- ExecPlan.md -->

# ExecPlan – Estate Agents–focused CSS/JS refactor for `silverstone-site-main`

This ExecPlan is a living document. The sections **Progress**, **Surprises & Discoveries**, **Decision Log**, and **Outcomes & Retrospective** must be kept up to date as work proceeds.

This plan must be followed in accordance with `PLANS.md` at the repository root. Treat the reader as a complete beginner to this repo: they have only the current working tree and this ExecPlan file.

> **Environment & tests (important)**  
> - The project uses the Codex **universal** image with a **Manual setup script** and **Maintenance script**.  
> - The **Setup script**:
>   - Changes into `/workspace/silverstone-site` (or first child of `/workspace`),
>   - Runs `npm ci` or `npm install` (best‑effort),
>   - Optionally runs `npx playwright install --with-deps`,
>   - Logs any npm/Playwright errors but exits successfully so the environment is always usable.
> - The **Maintenance script**:
>   - Runs on cached containers,
>   - Reinstalls npm deps only if `node_modules` is missing.
> - This matches Codex Cloud environment guidance: heavy installs in setup, light corrections in maintenance.   
>
> **Inside tasks, agents must NOT run `npm install` or `npx playwright install`.**  
> Test commands (`npm run test:*`) are *best‑effort* and assume dependencies are already installed by the setup/maintenance scripts or in local/CI environments.

---

## Purpose / Big Picture

The goal of this ExecPlan is to safely refactor the frontend of `silverstone-site-main` (static multi‑page marketing site) with a special focus on the **Estate Agents** page while preserving visual parity everywhere else.

After this refactor:

- The **Estate Agents page** (`niches/estate-agents.html`) will:
  - Have consistent card backgrounds (all cards use the same dark/opaque style).
  - Have corrected vertical spacing between key sections (no extra gaps).
  - Show the correct hero background on mobile.
  - Have stable cookie consent behaviour (no flicker, correct persistence).
  - Have properly aligned Services nav button (desktop) and matching Services pill styling (mobile overlay).
- The **header/nav, Services dropdown/overlay, Book and Contact flows** will remain visually and functionally correct.
- CSS and JS will be incrementally improved (page‑scoped overrides, reduced coupling) so future changes are easier and safer.
- When reintroduced, the Playwright tests described in `TESTS_PLAN.md` will help guard against regressions; for now treat those scenarios as manual checks.

We will do this **incrementally**, using a “strangler” pattern and the slices defined in `PLANS.md`.

---

## Progress

Use this section as a running log of progress as slices are implemented.

- [x] Slice 0 – Confirm test harness & docs (no new installs in tasks). *(2025-01-05 – Verified repo lacks the previously documented Playwright harness; aligned docs and environment notes accordingly.)*
- [x] Slice 1 – Estate card background unification. *(2025-01-05 – Added page-scoped Estate card styling so all cards share the darker background without touching global `.neon-card`.)*
- [x] Slice 2 – Estate section spacing normalization. *(2025-01-05 – Added Estate-only section hooks and padding tweaks to reduce gaps between highlighted section pairs.)*
- [x] Slice 3 – Estate hero mobile background alignment. *(2025-01-06 – Added page-scoped mobile hero background image-set and overlay for Estate Agents.)*
- [x] Slice 4 – Cookie banner stability and persistence. *(2025-01-06 – Hardened consent storage/visibility logic and centralized banner display toggles.)*
- [x] Slice 5 – Header/nav & Services dropdown (desktop + mobile pills). *(2025-01-06 – Aligned Services nav button and normalized mobile Services pill styling.)*
- [x] Slice 6 – Book & Contact UX hardening. *(2025-01-06 – Improved Calendly embed sizing and strengthened contact form feedback/submit handling.)*
- [x] Slice 7 – Estate CSS consolidation (page‑scoped). *(2025-01-06 – Moved inline Estate stats/card styles into page-scoped CSS.)*
- [x] Slice 8 – Optional global CSS architecture improvements. *(2025-01-06 – Simplified cookie banner visibility defaults to reduce flicker.)*

Update this as slices complete (with dates and brief notes).

---

## Surprises & Discoveries

Document unexpected behaviours, environment issues, or learnings.

- **Observation:** Running `npm install` inside a Codex **task** previously produced `E403` errors from `https://registry.npmjs.org/@playwright%2ftest`, indicating a network or security policy restriction rather than a bad `package.json`.
- **Mitigation:** We now run `npm ci`/`npm install` only in the **Setup** and **Maintenance** scripts (where network access is explicitly enabled) and treat failures as non‑fatal, logging a warning instead. Agents no longer call `npm install` inside tasks.
- **Observation (2025-01-05):** This branch does **not** currently include the Playwright test harness (`playwright.config.ts`, `tests/**`, `tsconfig.json`) referenced in earlier plans; `package.json` only defines a build pipeline (`build`, `build:css`) with `sharp` as the sole devDependency.
- **Mitigation:** Treat the V*/F*/D* scenarios in `TESTS_PLAN.md` as manual/aspirational until the automated suite is restored. Avoid invoking missing test scripts in Codex.

(Additional surprises should be appended here during implementation.)

---

## Decision Log

Record key decisions that shape this plan.

- **Decision:** Do not run `npm install` / `npm ci` / `npx playwright install` inside agent tasks.  
  - Rationale: Tests and devDependencies should be installed in the environment setup phase or locally/CI, not in a sandboxed task where network/blocking policies can cause sporadic errors.   
  - Date/Author: 2025‑12‑09 – ChatGPT (Codex refactor architect)

- **Decision:** Use the manual **Setup script** and **Maintenance script** to manage Node deps.
  - Rationale: Aligns with Codex Cloud Environments best practice—heavy installs in setup, light incremental fixes in maintenance, and cached containers for speed.
  - Date/Author: 2025‑12‑09 – ChatGPT

- **Decision:** Proceed with manual validation against the documented V*/F*/D* scenarios until an automated Playwright suite is reintroduced.
  - Rationale: The current branch lacks Playwright config and spec files; running non-existent test scripts would fail and waste time. Documenting the gap keeps future contributors informed.
  - Date/Author: 2025-01-05 – ChatGPT

(Additional design decisions should be added as the plan evolves.)

---

## Outcomes & Retrospective

To be filled in once major slices are completed. It should summarize:

- Which Estate Agents bugs were fixed.
- How the nav/Services overlay and Book/Contact flows behave now.
- How well the tests and baselines are working.
- Any remaining CSS/JS technical debt.

---

## Context and Orientation

### Project structure (high‑level)

Repository root (from GitHub):

- HTML:
  - `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`,
  - `privacy-policy.html`, `niches/estate-agents.html`.
- CSS:
  - `assets/css/styles.css` – global “god file”, heavy `!important`, base layout/typography/components.
  - `assets/css/custom.css`, `mobile.css`, `parallax-fix.css`, `hero-base.css`, `services.css`.
  - Misc marquee/gallery CSS and inline `<style>` in `niches/estate-agents.html`.
- JS:
  - `assets/js/script.js` – main DOM logic (nav, Services overlay, stats, parallax helper, some CSS injection).
  - `assets/js/cookie-consent.js` – cookie banner.
  - `assets/js/hero-shader.js`, marquee/gallery scripts, `neural-grid.js`, `premium-gallery.js`.
  - Inline contact form script in `contact.html`.
  - Netlify function `netlify/functions/send-email.js`.

- Tests & tooling:
  - `package.json` includes build tooling only (`build`, `build:css`) with `sharp` as the sole devDependency; no npm test scripts are defined.
  - **Playwright config, TS config, and spec files are not present in this branch.** The V*/F*/D* scenarios in `TESTS_PLAN.md` remain as a manual/aspirational reference until the suite is restored.

---

## Plan of Work (Slices Overview)

We follow the slices in `PLANS.md`:

1. **Slice 0 – Confirm test harness & docs (no new installs)**
   - Ensure `TESTS_PLAN.md`, `RULES.md`, `ESTATE-AGENTS-NOTES.md`, `CODEX_ENVIRONMENT_SETUP.md` reflect current code and tests.
   - Do **not** change devDependencies or test scripts.
   - Clarify how and where tests should run (Cloud environment setup vs local).

2. **Slice 1 – Estate card background unification**
3. **Slice 2 – Estate section spacing normalization**
4. **Slice 3 – Estate hero mobile background**
5. **Slice 4 – Cookie banner stability**
6. **Slice 5 – Header/nav & Services dropdown alignment**
7. **Slice 6 – Book & Contact UX hardening**
8. **Slice 7 – Estate CSS consolidation**
9. **Slice 8 – Optional global CSS architecture improvements**

Detailed steps and scope for each slice are in `PLANS.md`.

---

## Commands & Tests – Best‑Effort Only

Inside Codex Web:

- **Never** run:
  - `npm install`
  - `npm ci`
  - `npx playwright install` or similar.
- Test commands are **best‑effort**:
  - `npm test`
  - `npm run test:dom`
  - `npm run test:e2e`
  - `npm run test:visual`
  - `npm run test:accessibility`
- Only run a test command if:
  - The script exists in `package.json`, and
  - Node modules appear to be installed (e.g., `node_modules` exists from an environment setup step).

If a test command fails due to missing dependencies:

1. Log the failure in **Surprises & Discoveries**.
2. Do **not** attempt to fix it by running `npm install`.
3. Continue with code changes, relying on:
   - Existing tests when run locally / in CI.
   - Manual checks described in `TESTS_PLAN.md`.

*Note:* This branch does not define any `test:*` npm scripts or Playwright configs, so there are no automated commands to run inside Codex until the suite is restored.

---

## Validation & Acceptance

Same acceptance criteria as before (Estate visuals & behaviour, cookie banner, nav, Book/Contact, CSS/JS quality), plus:

- When devDependencies are installed (environment or local), the existing Playwright tests:
  - `tests/dom/*.spec.ts` (D1–D7),
  - `tests/e2e/flows.spec.ts` (F1–F6),
  - `tests/visual/visual.spec.ts` (V1–V10),
  - `tests/accessibility/accessibility.spec.ts`
  should pass after each relevant slice.

If tests cannot be run in Codex, ExecPlan must record which tests **would** be run and what needs to be validated manually.

---

## Idempotence & Recovery

- Keep changes small and scoped per slice.
- When moving styles or refactoring JS, avoid large, sweeping rewrites.
- If regressions are discovered:
  - Revert the specific files or commit.
  - Document the regression and fix strategy in this ExecPlan.

---

ExecPlan implementers must always check `PLANS.md`, `RULES.md`, `TESTS_PLAN.md`, and `ESTATE-AGENTS-NOTES.md` before making changes or running tests.
