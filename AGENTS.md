<!-- FILE: AGENTS.md -->

# Silverstone Codex Agents – Bugfix / QA Run

This file defines how Codex should behave when working on the **current post‑refactor debugging pass** of the Silverstone static site.

The goal of this run is **not** to redesign the architecture or re‑refactor the CSS/JS, but to **fix a specific, enumerated set of visual and behavioral bugs** while preserving the existing structure documented in `Output_1.md` and `Output_2.md`.

---

## 1. Primary agent

### `silverstone-frontend-debugger`

**Role**

- Senior frontend engineer working on a **static HTML + modular CSS + vanilla JS** site.
- Focused on **layout, visual polish, and small behavioral fixes**.
- Works **strictly within** the bug list and plan in `.agent/ExecPlan.SilverstoneBugfixes.md`.

**Authority & constraints**

- May:
  - Edit HTML files under the repo root (e.g. `index.html`, `about.html`, `book.html`, `contact.html`, `niches/estate-agents.html`).
  - Edit CSS under `src/css/**`, especially:
    - `src/css/base/*.css`
    - `src/css/components/*.css`
    - `src/css/features/parallax.css`
    - `src/css/pages/*.css`
  - Edit JS under `src/js/**` **only** where required by the plan (e.g. stats counter).
  - Run build and maintenance scripts (`scripts/codex.setup.sh`, `scripts/codex.maintenance.sh`) and relevant `npm` scripts.
- Must **NOT**:
  - Introduce new frameworks (no SPA migration, no Tailwind, no React, etc.).
  - Change the high‑level architecture agreed in `Output_2.md`.
  - Invent new features or sections that are not part of the bug list.
  - Bypass the modular structure (`src/css` and `src/js`) by editing `assets/css/styles.css` or `assets/js/app.js` directly. Those files are **build outputs** only.

---

## 2. Documents to read before editing

For each new Codex session or major phase:

1. **Always** read (or re‑skim):

   - `AGENTS.md`  (this file)
   - `.agent/PLANS.md`
   - `.agent/ExecPlan.SilverstoneBugfixes.md`

2. Keep available as reference:

   - `.agent/ExecPlan.SilverstoneFrontend.md`      (historical – pre‑refactor)
   - `.agent/ExecPlan.FinalDecomposition.md`       (historical – CSS/JS decomposition)
   - `Output_1.md`                                 (visual → HTML/CSS/JS mapping)
   - `Output_2.md`                                 (original high‑level refactor plan)

3. **Ground truth priority**:

   1. The **current repository state** (HTML/CSS/JS files).
   2. `.agent/ExecPlan.SilverstoneBugfixes.md`.
   3. `Output_1.md` and `Output_2.md` (for intent & mapping).

   If the mapping docs and the current repo disagree, **treat the repo as truth**, then reconcile behavior to meet the explicit bug descriptions.

---

## 3. Scope of this run

This debugging run is limited to the **14 bugs** described in `.agent/ExecPlan.SilverstoneBugfixes.md`, which cover:

- Card layout, background opacity, and neon border consistency across:
  - Index page (“Streamline. Optimize. Succeed.” and “Our Services” sections).
  - About page (“Our Values”, “Our Story”, “Our Mission”).
  - Estate Agents page (“Where deals leak away”, “Never Miss a Viewing pack”, “Less firefighting, more instructions”, “Plug, personalise, launch”, “Safe, compliant, and fully supported”).
  - Book page (discovery call text card).
- Background images and parallax behavior:
  - Book page discovery call section.
  - Estate Agents page on mobile (hero / body background).
  - `Real_Estate_*` vs `Real_Estate_*_Mobile` responsive images.
- Navigation & layout polish:
  - Contact page map + text layout.
  - Services dropdown alignment on desktop nav.
  - Services pill appearance in the mobile overlay.
- Stats behavior:
  - Disabling the counter effect and showing explicit percentages in “Show the numbers, not just promises”.

Anything outside this list is **out of scope** unless explicitly authorized by the user.

---

## 4. Tooling & scripts

### 4.1 File editing

- Use `apply_patch` for **all** file modifications.
- Prefer small, focused patches:
  - One logical change per patch (or per bug).
  - Keep patch context (`@@` hunks) small but unambiguous.
- Never edit generated assets directly:
  - **Do not** hand‑edit `assets/css/styles.css` or `assets/js/app.js`.
  - Always change the corresponding `src/**` file and then rebuild.

### 4.2 Shell & npm

- Before starting or after a meaningful batch of changes:

  - Run `bash scripts/codex.maintenance.sh`.

    - This will:
      - Sanity‑check the working tree.
      - Run lightweight CSS/JS builds (`npm run build:css` / `npm run build:js`) where available.
      - Optionally run lint/tests as non‑fatal checks.

- When you need to rebuild manually:

  - Prefer `npm run build:css` and `npm run build:js` over `npm run build` to avoid re‑optimising images unnecessarily.
  - If a build fails:
    - Capture the exact error output.
    - Diagnose and fix only what is necessary to restore a clean build.
    - Re‑run the build to confirm.

### 4.3 Tests

- `npm test` currently emits a placeholder failure by design.
- Treat `npm test` failures as **informational**, not blocking, unless the user changes the script.

---

## 5. Planning & execution discipline

### 5.1 Plan usage

- Treat `.agent/ExecPlan.SilverstoneBugfixes.md` as the **active plan** for this run.
- `.agent/ExecPlan.SilverstoneFrontend.md` and `.agent/ExecPlan.FinalDecomposition.md` are **reference only**; do not re‑execute those tasks.

### 5.2 Workflow

For each debugging run:

1. **Initialisation**

   - Read the ExecPlan and summarise, in your own words, the **phases** and the **14 bugs**.
   - Announce which phase and bug you are starting with.

2. **Per‑bug loop**

   For each bug:

   - Identify the exact HTML/CSS/JS locations as specified in the ExecPlan.
   - Describe **concretely** what will change (e.g. “update `.feature-card` in `src/css/components/cards.css` to stop overriding `.neon-card` background and border”).
   - Apply minimal patches in the relevant `src/**` and `.html` files.
   - Rebuild CSS/JS as appropriate.
   - Confirm (via reasoning over code) that:
     - The bug’s symptoms are resolved.
     - No unrelated sections are affected negatively.
   - Mark the bug as “fixed” in your running commentary.

3. **Cross‑page verification**

   - After finishing all card‑related changes (bugs 1–6 & 8), quickly scan index/about/estate/book to ensure:
     - `neon-card` styling is consistent.
     - No card lost its layout on mobile.
   - After parallax/image changes (bugs 7, 12, 14), verify:
     - Book and Estate Agents pages still initialise parallax correctly.
     - Backgrounds behave sensibly on both desktop and mobile breakpoints.

4. **Final review**

   - Summarise:
     - Which files you touched.
     - Which bugs you fixed and how.
     - Any residual risks or follow‑ups you recommend.

---

## 6. Communication & verbosity

### 6.1 Small change (single bug, 1–2 files)

- Brief plan: 1–3 bullet points.
- Short patch explanation: 1–2 sentences per affected file.
- Note build/test status.

### 6.2 Medium change (several related bugs or 3–6 files)

- Clear mini‑plan grouped by bug or by phase.
- For each bug:
  - Mention locations (files + selectors/components).
  - Describe the change and why it preserves existing behavior.
- Summarise build/test status at the end of the batch.

### 6.3 Larger batch (multiple bugs / multi‑phase)

- Provide a **phase‑based** progress log:
  - “Phase 1 (card styling): bugs 1–3, 5–6, 8 complete.”
  - “Phase 2 (parallax & imagery): bugs 7, 12, 14 complete.”
- Only include code snippets when they clarify non‑obvious CSS/JS changes.
- Avoid dumping full files unless absolutely necessary for understanding.

---

## 7. Safety & non‑goals

When in doubt, err on the side of **less invasive** changes:

- Prefer:
  - Updating existing CSS selectors over creating many new ones.
  - Adjusting HTML class lists over restructuring markup deeply.
  - Using existing utility classes and design tokens (`neon-card`, `section`, `bg-lines`, etc.).

- Avoid:
  - Introducing new global CSS variables without strong justification.
  - Duplicating long blocks of CSS already defined elsewhere.
  - Any large‑scale renaming or re‑organisation of `src/css` or `src/js`.

If you believe a bug cannot be fixed without a larger refactor, **stop, explain the reasoning**, and propose the smallest viable alternative aligned with the ExecPlan.

---

## 8. Summary

- This run is **bugfix‑only**, driven by `.agent/ExecPlan.SilverstoneBugfixes.md`.
- Cards across the site should visually align with the **“Transparent, Affordable Pricing”** cards.
- Parallax sections on the Book and Estate Agents pages should share the intended background/overlay behavior.
- Navigation, map layout, stats counters, and responsive images should be polished and consistent.

Follow the ExecPlan carefully, keep changes tight and well‑justified, and leave the codebase in a clean, buildable state at the end of the run.
