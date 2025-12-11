<!-- FILE: .agent/PLANS.md -->

# Codex Execution Plans (ExecPlans) for the Silverstone site

This file defines how execution plans (“ExecPlans”) are written and used for this repository. ExecPlans are long‑lived design documents that Codex follows step‑by‑step to implement large, multi‑file changes like the Silverstone CSS/JS refactor.

Treat this file as the contract for how plans are structured and maintained.

---

## 1. What an ExecPlan is

An ExecPlan is a single Markdown document that:

- Describes a concrete engineering outcome in this repo.
- Contains all context needed for a new contributor (human or agent) to complete that work starting from a clean checkout.
- Stays in sync with reality as the work progresses (it is edited during implementation, not just before).

For this project, the primary plan is:

- `.agent/ExecPlan.SilverstoneFrontend.md` – end‑to‑end refactor of CSS, JS, and HTML wiring according to `Output_2.md`.

Codex must treat that file as the source of truth for how to carry out the refactor.

---

## 2. When to use ExecPlans

Codex (and humans) must use an ExecPlan when:

- Changing more than one HTML page, or
- Modifying both CSS and JS in the same task, or
- Deleting or moving files, or
- Touching any of the “final architecture” paths described in `Output_2.md` (e.g. `src/css/**`, `src/js/**`, `assets/css/styles.css`, `assets/js/app.js`).

For small, strictly local edits (e.g. copy updates in a single HTML file) ExecPlans are optional.

For the Silverstone refactor specifically:

- All work covered by `Output_2.md` **must** flow through `.agent/ExecPlan.SilverstoneFrontend.md`.
- Do not start ad‑hoc refactors that conflict with, duplicate, or bypass that plan.

---

## 3. Required sections for every ExecPlan

Each ExecPlan must contain the following sections, in this order:

1. **Title line**

   - Short, action‑oriented description (e.g. “Consolidate Silverstone CSS/JS into `src` and a single bundle”).

2. **Purpose / Big Picture**

   - Plain‑language explanation of what the change enables and how someone can see it working in the browser.
   - Mention which pages, features, and user flows are affected.

3. **Progress**

   - A checklist of granular tasks with timestamps.
   - Every stopping point must be reflected here (including partially completed work).
   - Use one checkbox per concrete unit of work (e.g. “Move base typography to `src/css/base/typography.css`”).

4. **Surprises & Discoveries**

   - Short bullet points for unexpected behavior, bugs, or important observations.
   - Include minimal evidence (e.g. a summarized test output or log line).

5. **Decision Log**

   - Append‑only list of decisions.
   - Each entry includes the decision, rationale, and date.
   - Example format: “Decision: … / Rationale: … / Date: 2025‑10‑07”.

6. **Outcomes & Retrospective**

   - Summaries written at major milestones and at completion.
   - Compare results against the original Purpose section.
   - Note remaining work, risks, or future follow‑ups.

7. **Context and Orientation**

   - Describe the current state relevant to this work as if the reader knows nothing about the repo.
   - Name key files with repository‑relative paths.
   - Define any non‑obvious terminology.
   - For this project, tie back to the mapping in `Output_1.md` so the reader can find the relevant HTML, CSS, and JS.

8. **Plan of Work**

   - Narrative description of the intended sequence of changes.
   - For each step, specify which files will be edited or created and at what level of granularity (functions, selectors, modules).
   - For the Silverstone refactor, the Plan of Work must directly mirror the step ordering defined in Section 6 of `Output_2.md`.

9. **Concrete Steps**

   - Exact commands and working directories required to carry out the plan (e.g. `npm run build`, `rg "marquee"`).
   - Keep this section updated as new scripts or tools are added.
   - Reference validation scripts, build steps, and useful search commands for this repo.

10. **Validation and Acceptance**

    - How to prove the work is correct.
    - Include:

      - Commands to run (build, lint, tests) and what success looks like.
      - Manual browser checks: which pages to load, what to click or scroll, and what visual behavior to expect.
    - For this refactor, align with Section 7 of `Output_2.md` and the final checklist in Section 8.

11. **Idempotence and Recovery**

    - Guidance on re‑running steps safely.
    - Describe what happens if a step is interrupted and how to safely retry or roll back using git.

12. **Artifacts and Notes**

    - Short, focused snippets that are helpful to future readers (e.g. simplified diffs, trimmed logs).
    - Avoid dumping entire files or giant patches.

13. **Interfaces and Dependencies**

    - Enumerate important public interfaces this work touches (selectors, IDs, data attributes, JS entrypoints, build scripts).
    - Spell out the intended final structure (for this refactor, the `src/css/**` and `src/js/**` layouts and the final `assets/css/styles.css` and `assets/js/app.js` bundles).

---

## 4. Non‑negotiable rules

These rules apply to **every** ExecPlan in this repository:

- **Self‑contained**

  - An ExecPlan must carry enough information for a new contributor to succeed without reading external docs.
  - You may reference `Output_1.md` and `Output_2.md`, but any critical detail they contain that you rely on for this plan must also be summarized inside the ExecPlan.

- **Living document**

  - As work progresses, update the ExecPlan.
  - Progress, Decisions, Surprises, and Concrete Steps must always represent the current state of the implementation.

- **Outcome‑focused**

  - Plans must be phrased in terms of observable behavior and verifiable outcomes, not just file edits.
  - Acceptance criteria should read like “user behavior works” checks, not “file X changed”.

- **Repository‑specific**

  - Name files with repository‑relative paths (e.g. `assets/css/styles.css`, `src/css/pages/home.css`).
  - Use selectors, IDs, and JS hooks that actually exist according to `Output_1.md`.

- **Safe and reversible**

  - Prefer additive changes with explicit cleanup steps.
  - Spell out any destructive step (deletion or heavy rewrites) and ensure it is backed by git commands and safe retries.

- **No scope creep**

  - Do not add new product features, unrelated copy changes, or visual redesigns.
  - Only perform work in scope of the ExecPlan and the refactor described in `Output_2.md`.

---

## 5. ExecPlans in this repository

Currently, the canonical plan is:

- `.agent/ExecPlan.SilverstoneFrontend.md`

This ExecPlan:

- Implements the full CSS/JS/HTML refactor described in `Output_2.md`.
- Uses the HTML/CSS/JS mapping in `Output_1.md` to stay aligned with real selectors and files.
- Drives the migration from scattered CSS/JS files to the new `src/css/**` and `src/js/**` modules and single built bundles.

When adding new ExecPlans in the future:

- Place them under `.agent/ExecPlan.<Name>.md`.
- Mention them in this section with a one‑line description and scope.
- Keep each ExecPlan focused on a single coherent piece of work.

---

## 6. How Codex should use ExecPlans

Codex must follow this discipline:

1. **Before coding**

   - Read `AGENTS.md` from the repo root.
   - Read `.agent/PLANS.md` (this file).
   - Read `.agent/ExecPlan.SilverstoneFrontend.md` in full when working on the refactor.
   - Skim `Output_1.md` and `Output_2.md` to anchor in the mapping and detailed refactor plan.

2. **While coding**

   - Keep the ExecPlan open and update:

     - `Progress` whenever you complete or start a task.
     - `Surprises & Discoveries` when you learn something new.
     - `Decision Log` when you make a choice between alternatives.
   - Respect the sequencing in the ExecPlan unless an explicit, documented decision changes it.

3. **When blocked or surprised**

   - First, revisit `Output_1.md`, `Output_2.md`, and the ExecPlan’s Context and Plan of Work sections.
   - If the repository and docs still leave something ambiguous, make a conservative assumption, record it in the Decision Log, and proceed.

4. **At completion**

   - Ensure the ExecPlan’s Progress section is fully consistent with the actual state of the codebase.
   - Write a final entry under Outcomes & Retrospective summarizing:

     - What changed.
     - How it was validated.
     - Any remaining risks or follow‑ups.

---

## 7. Silverstone‑specific notes

To reduce hallucinations and keep the refactor aligned with reality:

- Treat `Output_1.md` as the authoritative map from visuals to HTML/CSS/JS files.
- Treat `Output_2.md` as the authoritative, high‑level refactor plan and final state.
- When in doubt about where a component “lives”:

  - Check `Output_1.md` for the mapping.
  - Check the relevant section in the ExecPlan (e.g. CSS modules, JS modules, or HTML wiring).

Do **not** invent new file layouts, framework migrations, or pipelines. The goal is to cleanly refactor **within** the existing static‑site architecture, not to transform it into something else.
