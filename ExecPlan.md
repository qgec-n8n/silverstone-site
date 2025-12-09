<!-- ExecPlan.md -->
# ExecPlan – Estate Agents–focused CSS/JS refactor for `silverstone-site-main`

This ExecPlan is a living document. The sections **Progress**, **Surprises & Discoveries**, **Decision Log**, and **Outcomes & Retrospective** must be kept up to date as work proceeds.

This plan must be followed in accordance with `PLANS.md` at the repository root. Treat the reader as a complete beginner to this repo: they have only the current working tree and this ExecPlan file.

> **Important: npm / Playwright in Codex sandbox**  
> The repo already contains a Playwright test harness:
> - `playwright.config.ts`
> - `tsconfig.json`
> - `tests/**` (accessibility, dom, e2e, visual specs)
> - `package.json` devDependencies (`@playwright/test`, `axe-core`, `http-server`, `jsdom`, `typescript`, `vitest`, `sharp`)
>
> However, running `npm install` from inside a Codex Web sandbox produced:
>
> ```text
> npm ERR! code E403
> npm ERR! 403 Forbidden - GET https://registry.npmjs.org/@playwright%2ftest
> npm ERR! 403 In most cases, you or one of your dependencies are requesting
> npm ERR! 403 a package version that is forbidden by your security policy, or
> npm ERR! 403 on a server you do not have access to.
> ```
>
> This matches npm’s standard 403 guidance (security policy / access issue, not a syntax bug)  and Codex Cloud’s model where:
> - **Setup scripts** run with full internet access.  
> - The **agent phase** runs inside a sandbox with network disabled by default.   
>
> **Therefore:**
> - This ExecPlan MUST NOT instruct agents to run `npm install`, `npm ci`, or `npx playwright install` from inside tasks.
> - Test dependencies must be installed either:
>   - In a **Codex Cloud environment setup script** (preferred), or  
>   - On a **local/CI environment** outside Codex.
> - Inside Codex, tests are **best‑effort**: only run `npm run test:*` if dependencies already exist.

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
- The existing Playwright tests will help guard against regressions when dependencies are available.

We will do this **incrementally**, using a “strangler” pattern and the slices defined in `PLANS.md`.

---

## Progress

Use this section as a running log of progress as slices are implemented.

- [ ] Slice 0 – Confirm test harness & docs (no new installs).
- [ ] Slice 1 – Estate card background unification.
- [ ] Slice 2 – Estate section spacing normalization.
- [ ] Slice 3 – Estate hero mobile background alignment.
- [ ] Slice 4 – Cookie banner stability and persistence.
- [ ] Slice 5 – Header/nav & Services dropdown (desktop + mobile pills).
- [ ] Slice 6 – Book & Contact UX hardening.
- [ ] Slice 7 – Estate CSS consolidation (page‑scoped).
- [ ] Slice 8 – Optional global CSS architecture improvements.

Update this as slices complete (with dates and brief notes).

---

## Surprises & Discoveries

Document unexpected behaviours, environment issues, or learnings.

- **Observation:** `npm install` inside Codex Web sandbox fails with `E403` for `@playwright/test`.  
  - Evidence:  
    - Codex Exec output shows 403 from `https://registry.npmjs.org/@playwright%2ftest`.  
    - This matches npm docs that 403 usually indicates a security policy or access restriction, not a missing package.   
    - Codex Cloud docs note that agents run in secure containers with network disabled; only environment setup has internet. 
- **Conclusion:** Installing Playwright and other devDependencies must happen in:
  - Codex Cloud **environment setup script**, or
  - Local / CI environment.  
  The agent must **not** call `npm install` or `npx playwright install` from within tasks.

(Additional surprises should be appended here during implementation.)

---

## Decision Log

Record key decisions that shape this plan.

- **Decision:** Do not run `npm install` / `npm ci` / `npx playwright install` inside agent tasks.  
  - Rationale: Codex sandbox/network policies produce 403 errors; recommended pattern is to install dependencies in environment setup or locally.   
  - Date/Author: 2025‑12‑09 – ChatGPT (Codex refactor architect)

- **Decision:** Keep workspace‑write sandbox network access disabled in repo‑local `.codex/config.toml`.  
  - Rationale: Avoid accidental network access from agents; environment setup script or local machine is the correct place for npm calls. If an advanced user wants sandbox network, they should enable it in their personal `~/.codex/config.toml` with full awareness of risks.   
  - Date/Author: 2025‑12‑09 – ChatGPT

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
  - `package.json` (with `@playwright/test`, `axe-core`, `http-server`, `jsdom`, `typescript`, `vitest` devDeps and test scripts).
  - `playwright.config.ts` (test projects: dom, e2e, visual‑desktop, visual‑mobile, accessibility).
  - `tsconfig.json` (includes tests and Playwright config).
  - Test specs:
    - `tests/dom/*.spec.ts` (cookie banner, nav/overlay, stats, contact form).
    - `tests/e2e/flows.spec.ts` (flows F1–F6).
    - `tests/visual/visual.spec.ts` (visual baselines V1–V10).
    - `tests/accessibility/accessibility.spec.ts` (axe smoke check).

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
