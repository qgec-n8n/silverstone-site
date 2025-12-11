<!-- FILE: AGENTS.md -->

# AGENTS.md – Silverstone static site (phase‑2 CSS/JS decomposition)

This file tells Codex how to work safely and effectively on the Silverstone marketing site. It is read automatically before each task in this repository.

This updated version reflects the state **after** the initial consolidation refactor and adds guidance for the final CSS/JS decomposition described in:

- `Output_1.md` – HTML/CSS/JS mapping. :contentReference[oaicite:7]{index=7}  
- `Output_2.md` – Refactor plan. :contentReference[oaicite:8]{index=8}  
- `.agent/ExecPlan.SilverstoneFrontend.md` – Phase‑1 plan and outcomes.
- `.agent/ExecPlan.FinalDecomposition.md` – **This run’s** plan.

---

## 1. Project overview (current baseline)

- Static HTML site; no SPA framework or server‑side rendering.
- Key pages:

  - `index.html` – home.
  - `about.html`
  - `services.html`
  - `book.html`
  - `contact.html`
  - `privacy-policy.html`
  - `niches/estate-agents.html`

- Bundled assets:

  - CSS:
    - Source under `src/css/**`.
    - Built bundle at `assets/css/styles.css` (via `node build-css.js` or `npm run build:css`).
  - JS:
    - Source under `src/js/**`.
    - Built bundle at `assets/js/app.js` (via `node scripts/build-js.js` or `npm run build:js`).

- Initial refactor state (from `ExecPlan.SilverstoneFrontend.md` “Outcomes & Retrospective”):

  - CSS/JS moved into `src/` and bundled to single entrypoints.
  - HTML pages updated to reference `assets/css/styles.css` and `assets/js/app.js` only.
  - Legacy scattered CSS/JS removed.
  - **Remaining work**:
    - `src/css/base/layout.css` and some other files still act as “kitchen sinks” instead of clean modules.
    - Several CSS component modules are empty.
    - Some JS modules are stubs; `src/js/app.js` holds too much behaviour.

---

## 2. How to work in this repo

### 2.1 Always read the plans first

If you are Codex running in this repo:

1. Read **this** `AGENTS.md` file.
2. Read `.agent/PLANS.md` to understand how ExecPlans work here.
3. Read `Output_1.md` and `Output_2.md` for structure and intent. 
4. For front‑end work, read:

   - `.agent/ExecPlan.SilverstoneFrontend.md` for historical context.
   - `.agent/ExecPlan.FinalDecomposition.md` as the **active plan** for this phase.

Do **not** invent a separate plan or ignore these documents. If something seems inconsistent between them, favour:

1. Behavioural correctness and non‑destructive changes.
2. The architecture described in `Output_2.md`.
3. The actual selectors and hooks in the current HTML/JS, as mapped in `Output_1.md`.

### 2.2 Branch and safety expectations

- Treat each Codex Cloud task as if you are working on a dedicated feature branch.
- Assume a human has created a branch for this phase (for example, `final-css-js-decomposition`).
- Never:
  - Delete unrelated files.
  - Introduce breaking HTML changes.
  - Re‑introduce previously removed unused CSS/JS files or selectors.

When making changes:

- Prefer `apply_patch` or equivalent patch‑style edits instead of rewriting entire files.
- Keep diffs focused on the scope of the current ExecPlan.

---

## 3. Phase‑2 CSS/JS decomposition guidance

This section is **only** for the final CSS/JS decomposition described in `.agent/ExecPlan.FinalDecomposition.md`.

### 3.1 Scope for this phase

Within this phase:

- **DO**:
  - Refactor CSS rules across `src/css/**` to match the ownership map in the phase‑2 ExecPlan.
  - Move JS behaviours from `src/js/app.js` into their corresponding modules and expose `init*` functions.
  - Keep `build-css.js` and `scripts/build-js.js` as the canonical build scripts.
- **DO NOT**:
  - Change HTML structure, ARIA attributes, or semantics unless a selector mismatch forces a minimal, obvious correction.
  - Introduce new visual features or change animation timing beyond what’s needed to keep behaviour intact.
  - Change the public assets paths (`assets/css/styles.css`, `assets/js/app.js`).

### 3.2 CSS working style

When working on CSS:

1. **Use the ownership map**

   - Treat the module mapping in `Output_2.md` and `.agent/ExecPlan.FinalDecomposition.md` as canonical. 
   - When in doubt, search HTML and JS for how a class is used and choose the module that best matches the feature or page.

2. **Move, don’t reinvent**

   - Move existing rules from `layout.css` or other catch‑all files into the correct module.
   - Do not rewrite selectors or properties unless necessary for deduplication or obvious bug fixes.

3. **Small, verifiable steps**

   - For each concern (header, footer, cards, stats, FAQ, cookie banner, etc.):
     - Move the rules.
     - Run `npm run build:css`.
     - Optionally run a quick search to confirm the old file no longer defines those selectors.

4. **Avoid regressions**

   - Before deleting any rule, confirm it is unused via:
     - HTML class/ID search.
     - JS `querySelector`/`classList` search.
   - If a selector is used anywhere, it must still be defined somewhere after the refactor (unless `Output_2.md` explicitly declares it unused).

### 3.3 JS working style

When working on JS:

1. **Respect module boundaries**

   - `header-nav.js`, `scroll-reveal.js`, `stats.js`, and `parallax.js` should each contain a cohesive unit of behaviour with a single exported `init*` function.
   - `app.js` should **only** orchestrate calls to these and other modules.

2. **Keep global namespace disciplined**

   - Use `window.Silverstone.init*` as the central namespace for initialisers.
   - Avoid creating additional globals.

3. **Preserve behaviour first, then refactor**

   - Copy logic from `app.js` into modules without changing control flow.
   - After moving and wiring the initialiser, you may make small cleanups (variable naming, extracting helpers) as long as behaviour remains identical.

4. **Validate after each module**

   - After migrating each major concern:
     - Run `npm run build:js`.
     - Fix syntax errors immediately.
   - At the end, run `npm run build` once to verify the full pipeline.

### 3.4 Communication and output style

For this phase:

- For **small changes** (one or two files, small diffs):
  - Provide a short summary bullet list of what changed and why.
- For **medium changes** (one subsystem – e.g. header CSS + JS):
  - Provide:
    - A concise summary.
    - A per‑file bullet list of changes.
    - Any commands you ran (builds, searches) and their outcomes.
- For **large changes** (multiple subsystems or whole‑site updates):
  - Provide:
    - A high‑level summary in 3–5 bullets.
    - A table or bullet list of files touched with brief descriptions.
    - A note on validation: which `npm run` commands you executed and whether they succeeded.

Avoid:

- Dumping entire large files in the final message.
- Describing internal chain‑of‑thought.
- Proposing additional feature work unless explicitly asked.

---

## 4. Tools and commands

### 4.1 Preferred tools

When you need to inspect or modify files:

- Use:
  - `apply_patch` or an equivalent patch tool for edits.
  - `rg` / `grep` / `git grep` for search.
  - Node + build scripts:
    - `npm run build:css`
    - `npm run build:js`
    - `npm run build` (for full pipeline checks where justified).

### 4.2 When to run which commands

- **At the start of a session** for this ExecPlan:
  - `npm install` (if `node_modules` is missing).
  - `npm run build:css` and `npm run build:js` to confirm the baseline.
- **After each major CSS module migration**:
  - `npm run build:css`.
- **After each major JS module migration**:
  - `npm run build:js`.
- **Before final summary**:
  - `npm run build` once to confirm the entire pipeline still works.

If a command fails:

- Include:
  - The command you ran.
  - Key lines of output.
  - Your interpretation of the failure.
- Then:
  - Fix the issue within the scope of this ExecPlan, or
  - Clearly note why it is out of scope for this phase.

---

## 5. How to use ExecPlans in this repo

A brief reminder:

- An ExecPlan (e.g. `.agent/ExecPlan.FinalDecomposition.md`) is the **single source of truth** for a multi‑step task.
- When you are asked to do front‑end work:
  - If it matches the phase‑2 CSS/JS decomposition, follow `.agent/ExecPlan.FinalDecomposition.md` linearly.
  - Otherwise, consult `.agent/PLANS.md` and any other relevant ExecPlans, but do not mix multiple plans in one run.

You must not:

- Start ad‑hoc large‑scale refactors that conflict with any existing ExecPlan.
- Mark steps as “done” in an ExecPlan without actually performing and validating them.

---

## 6. Summary for Codex

If you read nothing else, remember:

1. **Read the plans first**: `AGENTS.md` → `.agent/PLANS.md` → `Output_1.md` → `Output_2.md` → `.agent/ExecPlan.FinalDecomposition.md`.   
2. **Finish the decomposition**:
   - Empty `layout.css` of component/page styling and fill the component/page modules.
   - Turn the JS stub modules into real modules and slim down `app.js`.
3. **Work in small, validated steps**:
   - Move code, run `npm run build:css` / `npm run build:js`, repeat.
4. **Preserve behaviour**:
   - Do not change what the site does; only how the CSS/JS is organised.
5. **Summarise clearly**:
   - At the end, explain what changed, where, and how you validated it.
