<!-- PLANS.md -->
# PLANS – Refactor slices for `silverstone-site-main`

This file defines the slice‑by‑slice roadmap for refactoring `silverstone-site-main`, with a focus on the **Estate Agents** page and core flows.

Assumptions:

- Repo is connected to Codex via GitHub at the root.
- Codex reads `ExecPlan.md`, `AGENTS.md`, `RULES.md`, `TESTS_PLAN.md`, and this file before making changes.
- The Playwright test harness is already present (see `playwright.config.ts`, `tests/**`, `tsconfig.json`, and `package.json`).
- **No `npm install` or `npx` calls occur inside Codex agent tasks.** DevDependencies are installed via Cloud environment setup or locally.

Refer to `TESTS_PLAN.md` for test IDs (V*, F*, D*).

---

## Slice 0 – Confirm test harness & docs (no new installs)

**Goal**

Ensure the existing tests and docs are aligned with the refactor plan and Codex sandbox constraints, without modifying devDependencies or running `npm install` inside tasks.

**Files in scope**

- `TESTS_PLAN.md`
- `RULES.md`
- `ESTATE-AGENTS-NOTES.md`
- `CODEX_ENVIRONMENT_SETUP.md`
- `ExecPlan.md` (context sections)
- `package.json` (read‑only unless minor script comment/description tweaks are needed)
- `playwright.config.ts`, `tsconfig.json`, `tests/**` (read‑only, used for orientation)

**Out of scope**

- Adding/removing devDependencies.
- Creating new test projects or changing Playwright config structure.
- Any CSS/JS behavioural changes.

**Key subtasks**

1. Verify that `TESTS_PLAN.md`’s scenarios (V1–V10, F1–F6, D1–D7) match existing Playwright tests:
   - V* → `tests/visual/visual.spec.ts` (projects `visual-desktop`, `visual-mobile`).
   - F* → `tests/e2e/flows.spec.ts` (project `e2e`).
   - D* → `tests/dom/*.spec.ts` (project `dom`).
   - Accessibility → `tests/accessibility/accessibility.spec.ts` (project `accessibility`).
2. Ensure `RULES.md` clearly encodes CSS/JS constraints for the refactor.
3. Ensure `ESTATE-AGENTS-NOTES.md` accurately summarises current Estate issues and desired outcomes.
4. Ensure `CODEX_ENVIRONMENT_SETUP.md` explains:
   - Why `npm install` should be done in Cloud environment setup or locally.
   - How to run tests outside Codex.
5. Update `ExecPlan.md` **Surprises & Discoveries** and **Decision Log** to capture the npm 403 / sandbox constraints (already done).

**Tests (best‑effort)**

- Inside Codex: no test runs required for this slice.
- Outside Codex (local/CI, once dependencies are installed):
  - `npm run test:dom`
  - `npm run test:e2e`
  - `npm run test:visual`
  - `npm run test:accessibility`

---

## Slice 1 – Estate card background unification

**Goal**

Make all cards on `niches/estate-agents.html` use a consistent dark/opaque background in a DRY, page‑scoped way.

**Files in scope**

- `niches/estate-agents.html`
- `assets/css/custom.css` or a new Estate‑specific CSS file
- Inline `<style>` within `niches/estate-agents.html` (to be reduced gradually)

**Out of scope**

- Global `.neon-card` styles in `assets/css/styles.css` (unless explicitly allowed in `RULES.md` in Slice 8).
- Card styles on non‑Estate pages.

**Subtasks**

1. Identify all card types on Estate Agents (value props, stats, pricing, FAQ, etc.).
2. Introduce/confirm a page scope hook (e.g., `<body class="page-estate-agents">`).
3. Add CSS overrides to ensure all Estate cards share a unified dark background and consistent border/shadow.
4. Move duplicated inline card background rules into an external, page‑scoped CSS block, preserving visuals.

**Tests (best‑effort)**

- Visual: V2/V3 (Estate cards & spacing), via `tests/visual/visual.spec.ts`.
- E2E: F2/F3 (Estate flows) via `tests/e2e/flows.spec.ts`.

---

## Slice 2 – Estate section spacing normalization

**Goal**

Normalize vertical gaps between specific Estate sections without affecting other pages or sections.

**Files in scope**

- `niches/estate-agents.html`
- `assets/css/custom.css` / Estate‑specific CSS

**Out of scope**

- Global `section` spacing in `assets/css/styles.css`.
- Spacing on non‑Estate pages.

**Subtasks**

1. Identify the section wrappers (classes/IDs) for:
   - “The branch experience after launch”
   - “Plug, personalise, launch”
   - “Pricing”
   - “FAQs”
   - “Never Miss a Viewing”
   - “Show the numbers, not just promises”
2. Use page‑scoped, explicit selectors to adjust only these gaps.
3. Avoid selectors relying on `nth-child`/`nth-of-type` if dedicated classes are available.
4. Validate visually at both mobile and desktop breakpoints.

**Tests (best‑effort)**

- Visual: V3 (Estate Pricing + FAQs), and V2 (cards/stats).
- E2E: F2/F3 for flows through Estate page.

---

## Slice 3 – Estate hero mobile background

**Goal**

Ensure the Estate Agents mobile hero uses the correct background image and remains compatible with any existing parallax behaviour.

**Files in scope**

- `niches/estate-agents.html`
- `assets/css/hero-base.css`
- `assets/css/mobile.css`
- `assets/css/parallax-fix.css` (read/adjust with care)

**Out of scope**

- Global parallax behaviour for non‑Estate pages.

**Subtasks**

1. Inspect how `book.html` and other relevant pages specify the mobile hero background (`book-hero-calendly-mobile-2025@*x.webp`).
2. Apply the same pattern to Estate Agents, using page‑scoped hero classes or attributes.
3. Ensure desktop backgrounds remain unchanged.
4. Confirm parallax or background scroll behaviour is consistent with other pages.

**Tests (best‑effort)**

- Visual: V1 (Estate hero desktop), V4 (Estate hero mobile).
- E2E: F2/F3 to ensure hero loads correctly during Estate flows.

---

## Slice 4 – Cookie banner stability & persistence

**Goal**

Fix the cookie banner so it behaves consistently on all pages (including Estate):

- Appears once for new visitors.
- Remains visible until Accept/Decline.
- Does not reappear once a choice is stored.
- Does not flicker on scroll.

**Files in scope**

- `assets/js/cookie-consent.js`
- Shared header/footer HTML where cookie banner markup lives.
- Minimal CSS tweaks for banner if needed.

**Out of scope**

- Analytics or third‑party scripts.
- Breaking changes to storage keys (unless absolutely necessary and clearly documented).

**Subtasks**

1. Document current storage mechanism (e.g., localStorage key name, values for Accept/Decline).
2. Simplify or reorganize logic to:
   - Detect and respect stored consent.
   - Avoid scroll‑based show/hide logic that causes flicker.
3. Ensure behaviour is consistent across all pages, especially `niches/estate-agents.html`.

**Tests (best‑effort)**

- DOM: D1–D3 via `tests/dom/cookie-banner.spec.ts`.
- E2E: F1, F3, F6 via `tests/e2e/flows.spec.ts`.

---

## Slice 5 – Header/nav & Services dropdown alignment

**Goal**

Fix desktop nav alignment and mobile Services pill styling, preserving accessibility.

**Files in scope**

- `assets/css/styles.css` (nav layout only, minimal changes).
- `assets/css/custom.css`, `assets/css/mobile.css`.
- `assets/js/script.js` (nav/Services overlay behaviour).
- Header/nav HTML.

**Out of scope**

- Global typography and unrelated nav colours/hover styles.

**Subtasks**

1. Align desktop Services nav item to match neighbours (line height, padding, flex alignment).
2. Ensure mobile Services pill matches other pills for font family, size, colour, and alignment.
3. Keep ARIA attributes (`aria-expanded`, `role="navigation"`, etc.) intact.

**Tests (best‑effort)**

- DOM: D4–D5 via `tests/dom/nav-and-overlay.spec.ts`.
- Visual: V4 (nav presence) and V5 (Home hero/header).
- E2E: F1, F2, F5 via `tests/e2e/flows.spec.ts`.

---

## Slice 6 – Contact & Book UX hardening

**Goal**

Ensure Book and Contact pages are robust and user‑friendly.

**Files in scope**

- `book.html`, associated hero and embed sections.
- `contact.html`, inline contact JS.
- `netlify/functions/send-email.js`.
- `assets/css/custom.css` / `mobile.css`.

**Out of scope**

- API contract changes for the Netlify function (beyond minor internal refactors).

**Subtasks**

1. Confirm Calendly embed visibility across common viewport sizes, adjusting container styles as needed.
2. Verify contact form validation and submission logic; ensure user feedback messages (success/error) are clear and visible.
3. Keep JS changes minimal and scoped; maintain Netlify function contract.

**Tests (best‑effort)**

- DOM: D7 via `tests/dom/contact-form.spec.ts`.
- E2E: F3–F6 via `tests/e2e/flows.spec.ts`.
- Visual: V5–V6 (Book/Contact) via `tests/visual/visual.spec.ts`.

---

## Slice 7 – Estate CSS consolidation

**Goal**

Consolidate Estate‑specific CSS into a clear, page‑scoped structure to reduce future risk.

**Files in scope**

- `niches/estate-agents.html`
- `assets/css/custom.css` or a dedicated `assets/css/estate-agents.css`.
- Inline `<style>` in Estate page.

**Out of scope**

- Global CSS architecture changes (Slice 8).

**Subtasks**

1. Identify Estate‑specific rules scattered across `styles.css`, `custom.css`, `mobile.css`, and inline styles.
2. Move Estate‑only rules into page‑scoped CSS (e.g., `.page-estate-agents` namespace).
3. Remove or simplify duplicates once parity is confirmed.
4. Update HTML to link new CSS file if created.

**Tests (best‑effort)**

- Visual: V1–V4 on Estate page.
- E2E: F2–F3 (Estate flows).
- DOM: D1–D3, D6 where relevant.

---

## Slice 8 – Optional global CSS architecture improvements

**Goal**

Carefully improve global CSS architecture (reduce `!important`, clarify layers, use modern CSS patterns) while preserving visuals.

**Files in scope**

- `assets/css/styles.css`
- `assets/css/custom.css`
- `assets/css/mobile.css`
- Any new CSS partials.

**Out of scope**

- Structural HTML changes, unless required to support safer CSS.

**Subtasks**

1. Identify worst global CSS offenders (overly broad selectors, `!important` chains, legacy hacks).
2. Gradually introduce better structure (e.g., clearer base/layout/component layers, utilities) while keeping semantics the same.
3. Ensure all pages remain visually identical (except previously fixed bugs).

**Tests (best‑effort)**

- Full test battery (V*, F*, D*), where dependencies exist.
- Manual sweep of all pages at key breakpoints.

---

At every slice, Codex should update `ExecPlan.md`’s **Progress**, **Surprises & Discoveries**, **Decision Log**, and **Outcomes & Retrospective**.
