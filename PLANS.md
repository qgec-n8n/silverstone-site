# Codex Execution Plans (ExecPlans) for this repo

This `PLANS.md` defines how **ExecPlans** are written and executed in the `silverstone-site` repository.

ExecPlans here follow the structure from the Codex PLANS.md cookbook, adapted to this static marketing site. They are **living, self-contained design documents** that a novice can follow to deliver a working change end-to-end.

Treat this document as **non-negotiable** instructions for any ExecPlan in this repo.

---

## 1. Purpose of ExecPlans

An ExecPlan is an executable specification for a multi-step task. It exists to:

- Force **deep research and understanding** of the current code.
- Decompose work into **milestones** and **concrete steps**.
- Capture **discoveries and decisions** as you go.
- Define **clear acceptance criteria** that must be met in the running site.

ExecPlans are designed for tasks that benefit from **multi-hour, multi-iteration work**.

---

## 2. How Codex must use ExecPlans

When Codex is asked to follow an ExecPlan in this repo:

1. **Load instructions in order**

   - Read `AGENTS.md`.
   - Read this `PLANS.md`.
   - Read the specific `*.ExecPlan.md` mentioned by the user (for Estate Agents work: `estate-agents-bugfixes.ExecPlan.md`).
   - Read `.codex/config.toml`.

2. **Treat the ExecPlan as the primary spec**

   - The ExecPlan must be followed “to the letter” for that task.
   - If it conflicts with actual site behavior (e.g. it says “complete” but acceptance tests fail), assume the **ExecPlan metadata is stale** and the acceptance criteria are the source of truth.

3. **Behave like a novice to the repo**

   - Assume no prior memory.
   - Rely only on:
     - The current working tree.
     - `AGENTS.md`, `PLANS.md`.
     - The ExecPlan itself.

4. **Do not mark the ExecPlan as “Complete” yourself**

   - ExecPlans may have a `Status` field, but Codex must **not** set it to “Complete”.
   - Codex updates:
     - `Progress`
     - `Surprises & Discoveries`
     - `Decision Log`
     - `Outcomes & Retrospective`
   - The human owner decides later whether to treat the plan as completed.

5. **Use ExecPlans as “long-horizon” guides**

   - A quick pass with minimal diffs and no real debugging is considered **plan failure**, not success.
   - ExecPlans are explicitly meant to support multi-hour, multi-iteration tasks.

---

## 3. Required structure of ExecPlans

Every ExecPlan in this repo **must** include at least the following sections, using headings exactly or very close to these names (ordering can be adjusted slightly, but all must exist):

1. `# <Short, action-oriented description>`
2. `## Purpose / Big Picture`
3. `## Progress`
4. `## Surprises & Discoveries`
5. `## Decision Log`
6. `## Outcomes & Retrospective`
7. `## Context and Orientation`
8. `## Plan of Work`
9. `## Concrete Steps`
10. `## Validation and Acceptance`
11. `## Idempotence and Recovery`
12. `## Artifacts and Notes`
13. `## Interfaces and Dependencies`
14. Any additional repo-specific sections (e.g. Goals, Non-goals, Risks) as needed.

Key rules:

- **Self-contained:** The ExecPlan must contain everything a novice needs, including:
  - File paths.
  - Key selectors/IDs/classes.
  - Commands to run.
  - How to interpret outputs.
- **Living document:** As progress is made, the ExecPlan must be updated so that a future contributor can restart from the plan alone.
- **Working behavior:** The plan must lead to observable, verifiable behavior in the running site, not just code changes.

---

## 4. Formatting and checklists

- ExecPlans are Markdown files (`*.ExecPlan.md`) whose **entire content** is the ExecPlan.
  - Do **not** wrap the entire file in triple backticks.
- Use headings (`#`, `##`, etc.) with two newlines after each heading.
- **Checklists are only allowed in the `Progress` section.**
  - All other sections (e.g. Plan of Work, Validation) should use prose and bullet/numbered lists without `[ ]` or `[x]`.

Example checklist entry (to be used only inside `Progress`):

- `[x] (2025-12-08T10:15Z) Analyzed cookie banner behavior in niches/estate-agents.html and assets/js/cookie-consent.js.`
- `[ ] (2025-12-08T10:40Z) Implement cross-page consent persistence and verify on all six pages.`

(When you write these in an ExecPlan, you do not need the backticks; they are written as normal Markdown list items with checkboxes.)

---

## 5. Repo-specific requirements for ExecPlans

Because this is a static marketing site with subtle interactions, ExecPlans here must:

### 5.1 Context and Orientation

ExecPlans must describe:

- Relevant HTML pages:
  - `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `niches/estate-agents.html`.
- Main CSS files:
  - `assets/css/styles.css`
  - `assets/css/custom-styles.css`
  - `assets/css/custom.css`
  - `assets/css/mobile.css`
  - `assets/css/parallax-fix.css`
  - `assets/css/services.css`
- Main JS files:
  - `assets/js/script.js`
  - `assets/js/cookie-consent.js`
  - `assets/js/hero-shader.js`
- Key classes/attributes:
  - `.parallax-section`, `data-parallax-theme`, `.cookie-banner`, `#cookie-banner`, `.services-toggle`, `.services-menu`, `.services-overlay`, `.service-pill`, `.service-link`, `.stats`, `.number`, etc.

ExecPlans must explicitly note that the repo may contain **partial or broken changes from prior attempts** and must:

- Treat the **current code** as the starting point.
- Identify and fix regressions caused by earlier edits, not assume they are correct.

### 5.2 Plan of Work / Concrete Steps

ExecPlans for the Estate Agents bugfix work must require:

- **Thorough analysis before edits**:
  - Read and summarize current behavior of:
    - Cookie banner logic across all relevant pages.
    - Estate Agents section spacing.
    - Card background opacity.
    - Desktop navigation and mobile menu.
    - Parallax backgrounds on `index.html`, `services.html`, and `niches/estate-agents.html`.
    - Counter logic for “Show the numbers, not just promises”.
    - Image selection logic for desktop vs mobile assets.

- **Per-bug hypotheses**:
  - For each bug (cookie banner, spacing, nav, mobile pill, parallax, etc.), state:
    - What the bug looks like in the UI.
    - Which code (HTML/CSS/JS) is likely responsible.
    - A hypothesis for why the bug occurs.

- **Surgical changes**:
  - Name the **exact files** and **selectors** to be changed.
  - Prefer small edits scoped by body classes (e.g. `body.page-estate-agents`) or specific sections.
  - Avoid global refactors or rewiring the parallax or navigation systems.

### 5.3 Validation and Acceptance

ExecPlans must define **explicit acceptance criteria** for each major concern, including:

- Cookie banner behavior:
  - Fresh state, accepted state, and declined state across all relevant pages.
- Layout and spacing:
  - Specific section pairs on the Estate Agents page, compared to a baseline.
- Navigation and mobile menu:
  - Alignment and pill styling on desktop and mobile.
- Backgrounds and parallax:
  - Correct visual scale of backgrounds.
  - Parallax behavior preserved on desktop, and on mobile without URL-bar jumpiness.
- Counters and percentages:
  - `68%` and `42%` displayed literally with no animation.
- Desktop vs mobile images:
  - Estate Agents images correctly switching between `Real_Estate_*.jpeg` and `Real_Estate_*_Mobile.jpeg`.

Validation must be framed as **observable behavior** (what you see on each page and viewport), not just “code updated”.

### 5.4 Idempotence and Recovery

ExecPlans must:

- Encourage additive, testable changes that can be re-run.
- Provide guidance for backing out any destructive steps (e.g. if a CSS change breaks parallax, how to narrow the change or restore prior behavior).
- Treat “disabling parallax entirely” as a **last resort only**, requiring explicit human approval. For the Estate Agents ExecPlan, parallax must remain on mobile unless the human changes requirements.

---

## 6. Specific guidance for the Estate Agents ExecPlan

The `estate-agents-bugfixes.ExecPlan.md` is the canonical ExecPlan for:

- Estate Agents niche page bugfixes and layout consistency.
- Cross-page cookie-consent behavior.
- Background and parallax behavior on `index.html`, `services.html`, and `niches/estate-agents.html`.
- Navigation alignment and mobile menu styling.
- Counter effect and percentages.
- Desktop vs mobile image selection for Estate Agents.
- `.codex/config.toml` alignment.

Additional rules for this plan:

- It must explicitly note:
  - That disabling mobile parallax or replacing it with static backgrounds is **not allowed** as a final solution.
  - That multiple background images must not be layered incorrectly on the Estate Agents body.
- It must require Codex to:
  - Audit prior changes and regressions (e.g. zoomed backgrounds, destroyed mobile parallax).
  - Restore correct behavior where it has been broken.
  - Only consider the parallax problem solved when the effect works and no jumping occurs with browser URL-bar changes on mobile.

---

## 7. How Codex should implement ExecPlans

When implementing any ExecPlan in this repo, Codex must:

1. Work through milestones sequentially, but may iterate within a milestone until acceptance is met.
2. Use the `Progress` section to record:
   - Every meaningful stopping point.
   - What was done.
   - What remains.
3. Update `Surprises & Discoveries` and `Decision Log` as non-trivial findings and choices arise.
4. Only update `Outcomes & Retrospective` when significant portions of the plan have been executed and validated.
5. Never rely on ExecPlan status alone to declare success; use the **Validation and Acceptance** section and actual UI behavior.
6. If the user later reports issues, treat the plan as **still in progress** and continue iterating.

---

## 8. File naming and location

- Place this `PLANS.md` in the **repository root**.
- Place ExecPlans in the repository root with names like:
  - `estate-agents-bugfixes.ExecPlan.md`
- When adding new ExecPlans, follow this document and use the same structure and depth.
