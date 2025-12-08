# Codex Execution Plans (ExecPlans) for this repo

This `PLANS.md` defines how **ExecPlans** are written and executed in the `silverstone-site` repository.

ExecPlans here follow the ExecPlans guidance from the Codex cookbook, adapted to this static marketing site. They are **living, self-contained design documents** that a novice can follow to deliver a working change end-to-end.

Treat this document as **non-negotiable** instructions for any ExecPlan in this repo.

---

## 1. Purpose of ExecPlans

An ExecPlan is an executable specification for a multi-step task. It exists to:

- Force **deep research and understanding** of the current code.
- Decompose work into **phases** and **concrete steps**.
- Capture **discoveries and decisions** as you go.
- Define **clear acceptance criteria** that must be met in the running site.

ExecPlans are intended for **multi-iteration, multi-step work**, not one-shot patches.

---

## 2. How Codex must use ExecPlans

Whenever Codex is asked to follow an ExecPlan in this repo:

1. **Load instructions in order**

   - Read `AGENTS.md`.
   - Read this `PLANS.md`.
   - Read the specific `*.ExecPlan.md` mentioned by the user (for Estate Agents work: `estate-agents-bugfixes.ExecPlan.md`, and optionally `parallax-mobile-hardening.ExecPlan.md`).
   - Read `.codex/config.toml`.

2. **Treat the ExecPlan as the primary specification**

   - Follow the ExecPlan “to the letter” for that task.
   - If ExecPlan metadata (e.g. `Status`, old checkboxes) conflicts with actual behavior, treat that metadata as **stale**.
   - The ExecPlan’s **Validation and Acceptance** section and the human’s feedback are the source of truth.

3. **Behave like a novice to the repo**

   - Assume no prior memory.
   - Rely only on:
     - The current working tree.
     - `AGENTS.md`, `PLANS.md`.
     - The ExecPlan itself.

4. **Do not mark an ExecPlan as “Complete”**

   - ExecPlans may have a `Status` field, but Codex must **not** set it to “Complete”.
   - Codex may update:
     - `Progress`
     - `Surprises & Discoveries`
     - `Decision Log`
     - `Outcomes & Retrospective`
     - (optionally) `Artifacts and Notes`
   - The human owner decides later whether the plan is actually complete.

5. **Use ExecPlans as long-horizon guides**

   - A quick pass with minimal diffs and shallow analysis is considered **plan failure**, not success.
   - ExecPlans are explicitly meant to support multi-iteration tasks:
     - First iteration: **analysis-only**.
     - Later iterations: implementation and validation.

---

## 3. Required structure of ExecPlans

Every ExecPlan in this repo **must** include the following sections (names can vary slightly, but meaning must be preserved):

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

Additional sections (Goals, Non-goals, Risks, etc.) are encouraged when helpful.

Key rules:

- **Self-contained:** Each ExecPlan must contain everything a novice needs:
  - File paths.
  - Key selectors/IDs/classes.
  - Relevant functions and scripts.
  - Commands to run, if any, and how to interpret their output.
- **Living document:** As work proceeds, Codex must keep the ExecPlan up to date so a future contributor can restart from the plan alone.
- **Working behavior:** The plan must result in observable behavior changes that match the acceptance criteria, not just code edits.

---

## 4. Formatting and checklists

- ExecPlans are Markdown files (`*.ExecPlan.md`) whose entire content is the plan.
  - Do **not** wrap the whole file in code fences.
- Use headings (`#`, `##`, etc.) with blank lines before/after.
- **Checklists are only allowed in the `Progress` section.**
  - All other sections (Plan of Work, Validation, etc.) should use bullet/numbered lists or prose, not `[ ]`/`[x]`.

Example checklist entry inside `Progress`:

- `[x] (2025-12-08T10:15Z) Analyzed cookie banner behavior in niches/estate-agents.html and assets/js/cookie-consent.js.`
- `[ ] (2025-12-08T10:40Z) Implement cross-page consent persistence and verify on all six pages.`

(When you write these in an ExecPlan, you do not need the backticks; they are written as normal Markdown list items with checkboxes.)

---

## 5. Repo-specific requirements for ExecPlans

Because this is a static marketing site with subtle layout and interaction requirements, ExecPlans here must go deeper than generic plans.

### 5.1 Context and Orientation

ExecPlans must describe:

- HTML pages involved:
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
- Key selectors and attributes:
  - `.parallax-section`, `data-parallax-theme`
  - `.cookie-banner`, `#cookie-banner`
  - `.services-toggle`, `.services-menu`, `.services-overlay`, `.service-pill`, `.service-link`
  - `.stats`, `.stat`, `.number`
  - `.neon-card`, `.dark-card`, `.section`, `.compact-section`
  - Page-level classes like `body.page-estate-agents`, `body.page-services`, `body.page-book`, etc.

ExecPlans must also note that the repo may contain **partial or broken changes from earlier Codex attempts**, and must:

- Treat the **current code** (including regressions) as the starting point.
- Identify and fix regressions, not assume existing behavior is correct.

### 5.2 Plan of Work / Concrete Steps (Estate Agents focus)

ExecPlans dealing with the Estate Agents bugfix work must require:

- **Thorough analysis before edits**:
  - For each of the following, the ExecPlan must include analysis steps and hypotheses:
    - Cookie banner behavior and persistence across relevant pages.
    - Estate Agents section spacing vs `index.html`.
    - Card background opacity for all Estate Agents cards.
    - Desktop navigation alignment and mobile Services pill styling.
    - Background images and parallax behavior on `index.html`, `services.html`, and `niches/estate-agents.html`.
    - Counter effect for “Show the numbers, not just promises” and how values are rendered.
    - Desktop vs mobile image selection for Estate Agents.

- **Per-bug hypotheses**:
  - For each bug or requested change:
    - Describe the current behavior.
    - Identify the likely cause (files, selectors, functions).
    - Form a hypothesis linking the code to the observed behavior.

- **Surgical changes**:
  - Name the exact files, sections, and selectors to change.
  - Prefer small, localized edits.
  - Scope CSS changes by page-level classes (e.g. `body.page-estate-agents`) where possible.
  - Avoid global rewrites of `styles.css` or `script.js`, especially given existing duplication and noisy edits from the past.

### 5.3 Validation and Acceptance

ExecPlans must define **observable acceptance criteria** for each concern, for example:

- Cookie banner:
  - Fresh, accepted, and declined states across all relevant pages.
- Layout and spacing:
  - Specific section pairs on the Estate Agents page must visually match baseline spacing (e.g. between “Show the numbers” and “The branch experience after launch”), using the design system’s scale.
- Navigation and mobile menu:
  - Desktop Services button aligned vertically with other nav items.
  - Mobile Services pill matching other overlay pills (font, color, size, alignment) while still functioning as dropdown trigger.
- Backgrounds and parallax:
  - Correct background images on each page.
  - Parallax effect remains present on desktop and mobile (for the first Estate Agents ExecPlan, only preservation is required; the “jumping URL bar” issue on mobile is deferred to a **separate parallax ExecPlan**).
- Counters & percentages:
  - `68%` and `42%` rendered as literal percentages, with no animation.
- Desktop vs mobile images:
  - Estate Agents images correctly switching between `Real_Estate_*.jpeg` and `Real_Estate_*_Mobile.jpeg`.

Validation must be framed in terms of what a human sees when loading/resizing pages, not just internal code structure.

### 5.4 Idempotence and Recovery

ExecPlans must:

- Encourage additive, testable changes that can be run multiple times.
- Provide guidance for rolling back or narrowing risky changes:
  - Especially for parallax logic (`assets/js/script.js`) and large CSS files (`assets/css/styles.css`), which already contain noisy, duplicated rules and stray fragments from past runs.
- Treat **removing mobile parallax entirely** as a last resort that requires explicit human approval.

---

## 6. Specific guidance for the Estate Agents ExecPlans

There are two main ExecPlans for this work:

1. `estate-agents-bugfixes.ExecPlan.md`
   - Focus: cookie banner, spacing, card backgrounds, nav alignment, mobile Services pill, counters, and Estate Agents imagery.
   - Priority: fix those behaviors thoroughly while preserving the existing parallax implementation.

2. `parallax-mobile-hardening.ExecPlan.md`
   - Focus: refining parallax behavior and backgrounds across `index.html`, `services.html`, and `niches/estate-agents.html`, including the **mobile URL-bar jumping** issue.
   - Should be run **after** the first ExecPlan’s acceptance criteria have been satisfied.

For the first ExecPlan:

- Parallax must be **preserved**, not disabled.
- Eliminating the mobile URL-bar “jumping” is **not required**; it is explicitly handled by the second ExecPlan.

For the second ExecPlan:

- Parallax behavior on mobile must be refined to avoid URL-bar-induced jumps without breaking layout.
- Dangerous CSS/JS changes must be applied carefully and documented in the plan.

---

## 7. Execution phases (for all ExecPlans)

When implementing any ExecPlan in this repo, Codex must:

1. **Phase 1 – Analysis-only**
   - Read all relevant files.
   - Update ExecPlan sections:
     - `Context and Orientation`
     - `Surprises & Discoveries`
     - `Decision Log` (for any early design choices)
     - `Progress` (with checkboxes for analysis steps)
   - **Do not call `apply_patch` or modify any HTML/CSS/JS during this phase.** The only allowed edits are to the ExecPlan itself.

2. **Phase 2 – Implementation**
   - For each concern:
     - Plan a specific, localized change.
     - Apply a small diff using `apply_patch`.
     - Immediately update `Progress`, and `Surprises & Discoveries` / `Decision Log` if new information arises.
   - Avoid reformatting entire CSS/JS files or duplicating large blocks.

3. **Phase 3 – Validation**
   - Use the ExecPlan’s `Validation and Acceptance` section as a checklist.
   - For each item, either:
     - Confirm the behavior now matches criteria, or
     - Mark it as partially complete with notes on what remains.

4. **Iteration**
   - If the user reports remaining issues, treat the ExecPlan as **still in progress** and continue from the relevant phase, updating the living sections accordingly.

---

## 8. File naming and location

- `PLANS.md` lives in the **repository root**.
- ExecPlans live in the repository root with names such as:
  - `estate-agents-bugfixes.ExecPlan.md`
  - `parallax-mobile-hardening.ExecPlan.md`
- Any new ExecPlans must follow this document’s structure and rules.
