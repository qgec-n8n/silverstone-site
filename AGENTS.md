<!-- FILE: AGENTS.md -->

# AGENTS.md – Silverstone static site

This file tells Codex how to work safely and effectively on the Silverstone marketing site, especially for the large CSS/JS refactor described in `Output_2.md`.

---

## Repository overview

- Static HTML site; no SPA framework or server‑side rendering.
- Key pages (all in repo root unless noted):

  - `index.html` – home.
  - `about.html`
  - `services.html`
  - `book.html`
  - `contact.html`
  - `privacy-policy.html`
  - `niches/estate-agents.html`

- Frontend assets:

  - CSS under `assets/css/`
  - JS under `assets/js/`
  - Images under `assets/images/` (and subfolders)
  - Fonts/icons under `assets/webfonts/`

- Existing JS is mostly vanilla JavaScript; no bundler in production yet.
- Node tooling is used for CSS builds and image optimization.

Authoritative docs:

- `Output_1.md` – HTML/CSS/JS mapping and analysis.
- `Output_2.md` – detailed refactor plan and final state.
- `.agent/PLANS.md` – ExecPlan rules.
- `.agent/ExecPlan.SilverstoneFrontend.md` – main refactor plan.

When working on the refactor, **read all of these first**.

---

## Environment & commands

Run all commands from the repository root unless stated otherwise.

- **Node / npm**

  - Dependencies are installed via `npm` using the standard `package.json`.
  - Heavy dependency installation should happen in the environment setup script (`scripts/codex.setup.sh`).
  - Prefer `npm ci` when `package-lock.json` is present; otherwise `npm install`.

- **Build & tooling (current baseline)**

  - CSS build: `npm run build:css` (calls `build-css.js`).
  - Full build (if defined): `npm run build`.
  - There is currently no real `npm test` script; tests and linters may be added as part of the refactor according to `Output_2.md`.

- **Search & inspection**

  - Prefer `rg` (ripgrep) or `git grep` for searching.
  - When mapping selectors or IDs, also consult `Output_1.md` to avoid chasing dead code.

Codex Cloud environments:

- The cloud environment should be configured so that:

  - The **setup script** is `scripts/codex.setup.sh`.
  - The **maintenance script** is `scripts/codex.maintenance.sh`.
  - Agent internet access during tasks is kept as strict as possible; assume internet is off and do not rely on external HTTP calls.

---

## Code style & architecture

### HTML

- Stay within the existing semantic structure; do not introduce new frameworks or templating engines.
- Only change markup when necessary to align with the new CSS/JS modules (e.g. adding/removing classes or data attributes).
- Keep accessibility neutral or improved; do not remove ARIA attributes or landmark elements.

### CSS

Planned final structure:

- `src/css/base/variables.css`
- `src/css/base/typography.css`
- `src/css/base/layout.css`
- `src/css/components/*.css` (header, footer, hero, cards, buttons, stats, FAQ, cookie banner)
- `src/css/features/*.css` (parallax, gallery, marquee, lightbox)
- `src/css/pages/*.css` (home, services, about, book, contact, estate‑agents)

Guidelines:

- Prefer small, focused modules over new “kitchen sink” files.
- Keep component rules in `components/`, feature behaviors in `features/`, and page‑specific tweaks in `pages/`.
- Only delete selectors once you have:

  - Verified they are unused via search, **and**
  - Confirmed they do not appear as JS hooks (string literals) or in the mapping in `Output_1.md`.

### JavaScript

Planned final structure:

- `src/js/header-nav.js`
- `src/js/scroll-reveal.js`
- `src/js/stats.js`
- `src/js/parallax.js`
- `src/js/hero-shader.js`
- `src/js/magnetic-buttons.js`
- `src/js/marquee.js`
- `src/js/gallery.js`
- `src/js/cookie-consent.js`
- `src/js/contact-form.js`
- `src/js/app.js` (entrypoint)

Guidelines:

- Use modern, vanilla JS. No new external frameworks unless explicitly requested.
- Treat each module as a small initializer with a single exported function (e.g. `initHeaderNav()`).
- Guard modules against missing DOM elements (check for existence before attaching listeners).
- Respect user preferences such as `prefers-reduced-motion` when dealing with animations.

---

## Refactor workflow with ExecPlans

For the Silverstone refactor:

1. **Always use the ExecPlan**

   - The canonical plan is `.agent/ExecPlan.SilverstoneFrontend.md`.
   - Do not improvise a separate large‑scale plan in chat; update the ExecPlan instead.

2. **Respect the order from `Output_2.md`**

   - Follow the step ordering in Section 6 of `Output_2.md`:

     - Environment & capability scan.
     - Create new `src/css` and `src/js` structure.
     - Migrate base CSS, components, features, and pages.
     - Migrate JS into modules and bundle to `assets/js/app.js`.
     - Update HTML to point at the new bundles.
     - Remove legacy CSS/JS.
     - Run validations and final checklist.

   - Use the ExecPlan to keep track of progress through those steps.

3. **Updates & communication**

   - At the start of a long cloud task:

     - Briefly summarize your understanding of the plan and which step you are starting.
   - During execution:

     - After each major step (e.g. after finishing base CSS, after wiring JS modules), send a concise update listing:

       - What you just completed.
       - What you will do next.
       - Any risks or surprises.

   - At the end:

     - Provide a final summary focusing on:

       - Files changed or created.
       - Any deviations from `Output_2.md` and why (with references to the ExecPlan’s Decision Log).
       - Validation commands run and their outcomes.

   - Avoid long code dumps; refer to file paths and high‑level changes unless the user specifically asks for snippets.

---

## Tool usage (Codex CLI / Cloud)

Codex should use tools in a predictable way:

- **File edits**

  - Prefer the `apply_patch` editing tool when available, rather than rewriting entire files.
  - Keep patches focused and minimal; avoid mixing unrelated changes.

- **Shell / terminal**

  - Set the working directory to the repo root whenever possible.
  - Use `rg`/`git grep` for search, `ls`/`find` to explore, and `npm`/`node` to run tooling.
  - When a build or check fails, summarize key lines of output and adjust the plan; do not silently ignore failures.

- **Batching**

  - For large migrations, process related files together:

    - E.g. move all base CSS modules in one slice; then all components; then pages.
  - When running commands, batch them logically (e.g. build, then lint, then tests) rather than many tiny invocations.

- **Safety**

  - Never delete or rename files outside the patterns described in `Output_2.md` without explicit instruction in the ExecPlan.
  - Do not revert user changes you did not make.
  - If git indicates unrelated local changes, leave them untouched.

---

## Scope control

To minimize hallucinations and scope creep:

- Stay within the refactor described by `Output_2.md`.
- Use `Output_1.md` to map visuals to selectors and files instead of guessing.
- Do not:

  - Introduce new frameworks (React, Vue, Tailwind, etc.).
  - Add new marketing sections, forms, or flows.
  - Make cross‑cutting copy changes unrelated to the refactor.

If you need to make an assumption (e.g. choosing a simple concatenation script vs. a full bundler):

- Choose the simplest approach that satisfies `Output_2.md`.
- Record the assumption and decision in the ExecPlan’s Decision Log.
- Keep the implementation small and easy to revise.

---

## Testing & validation expectations

- During the refactor, run validation at the checkpoints described in `Output_2.md`:

  - Build commands (`npm run build` or `npm run build:css`).
  - Any lint/test scripts that exist.
  - Repo‑wide searches to confirm old CSS/JS filenames are gone.

- For front‑end behavior, focus on:

  - Navigation, header, and footer on every page.
  - Hero and parallax sections.
  - Service cards and innovation gallery.
  - Marquee behavior.
  - Contact form behavior and cookie banner.

Use `Output_1.md` and `Output_2.md` as checklists for what must still behave correctly after the refactor.
