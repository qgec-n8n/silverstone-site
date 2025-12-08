# Codex Execution Plans (ExecPlans) for this repo

This document defines how **ExecPlans** work in the `silverstone-site` repository and how Codex should read, write, and execute them.

ExecPlans are **design documents for Codex**, not for humans alone. Treat them as step-by-step, executable specifications that a fresh coding agent can follow to deliver a working change, with no prior memory of the project beyond:

- The current working tree.
- This `PLANS.md` file.
- The specific ExecPlan file.

Always assume the reader is a **beginner to the repo**.

---

## 1. What is an ExecPlan?

An ExecPlan is a Markdown file (named like `some-task.ExecPlan.md`) that:

- Describes a concrete engineering task or feature.
- Explains the current behavior and desired behavior.
- Lists files and components to inspect.
- Breaks work into milestones with checklists and clear outcomes.
- Defines testing and verification steps.
- Records key decisions, risks, and tradeoffs.

ExecPlans **do not** replace Codex’s reasoning — they **organize** it. Codex still needs to:

- Explore the codebase.
- Form hypotheses about bugs.
- Decide precisely how to implement changes.
- Keep the ExecPlan updated as progress is made.

---

## 2. How to read an ExecPlan (Codex behavior)

When Codex is asked to “follow an ExecPlan” in this repo, it must:

1. From the repository root:
   - Read `AGENTS.md`.
   - Read `PLANS.md`.
   - Read the specific `*.ExecPlan.md` mentioned by the human (for this project: `estate-agents-bugfixes.ExecPlan.md`).

2. Summarize the ExecPlan to itself:
   - List goals.
   - List non-goals.
   - List the key milestones and target files.

3. Execute the plan **end-to-end**:
   - Do **not** ask the user for “next steps” at each milestone.
   - Instead, move through milestones autonomously, reporting progress and surfacing only important decisions, ambiguities, or tradeoffs.

4. Keep the ExecPlan as a **living document** when appropriate:
   - Update checkboxes (`[ ]` → `[x]`) as milestones and tasks are completed.
   - Add brief notes to “Progress” or “Decision log” sections when available.
   - Do not erase the original intent; append your findings.

5. For any ambiguity:
   - First resolve it by reading more of the code.
   - Only ask the human if the intent truly cannot be inferred.

---

## 3. How to author an ExecPlan in this repo

When creating a new ExecPlan here, follow this structure (adapt and extend as needed):

1. **Title & metadata**
   - Short title (task name).
   - Status (Not started / In progress / Complete).
   - Date and context (optional).
   - Owner (usually “Codex for \<user name\>”).

2. **Summary / Overview**
   - 3–7 bullet points summarizing what this ExecPlan will achieve.
   - Mention the key pages/components affected.

3. **Context & current behavior**
   - For each issue, describe:
     - What currently happens (as observed in the code and UI).
     - Where in the codebase this behavior seems to live (filenames, selectors, functions).
   - Keep this concise but specific enough that a fresh agent can orient quickly.

4. **Goals**
   - Use a checklist of concrete, testable goals:
     - `[ ]` Cookie banner behaves consistently across listed pages.
     - `[ ]` Estate Agents mobile background image appears as intended.
     - etc.

5. **Non-goals**
   - Explicitly list what is **out of scope**, e.g.:
     - No global redesign of the navigation.
     - No changes to SEO/meta tags.
     - No framework migration.

6. **Impacted files & components**
   - List all files that are likely to be inspected or edited.
   - Prefer grouping by concern, for example:
     - **Estate Agents page markup:** `niches/estate-agents.html`
     - **Shared pages:** `index.html`, `services.html`, `about.html`, `book.html`, `contact.html`
     - **CSS:** `assets/css/styles.css`, `assets/css/custom-styles.css`, `assets/css/custom.css`, `assets/css/mobile.css`, `assets/css/parallax-fix.css`, `assets/css/services.css`, and any inline `<style>` blocks.
     - **JS:** `assets/js/script.js`, `assets/js/cookie-consent.js`, `assets/js/hero-shader.js`
     - **Config:** `.codex/config.toml`

7. **Detailed plan & milestones**
   - Break the work into numbered milestones with checklists.
   - Each milestone should:
     - Name the concern it addresses (e.g. “Cookie banner behavior”).
     - Describe the **analysis steps** (what to read, what to run or preview).
     - Describe the **implementation strategy** in words (not raw diffs).
     - Describe the **verification steps** for that milestone.
   - Keep each milestone small enough that Codex can reasonably complete it and then re-check the UI.

8. **Risks & mitigations**
   - Note possible breakages (e.g. “Cookie banner might disappear on all pages” or “Parallax fixes might disable animations on desktop”).
   - For each risk, state a mitigation, such as:
     - Use page-specific selectors or body classes (`.page-estate-agents`) to scope CSS.
     - Verify `index.html`, `services.html`, and `book.html` after parallax-related changes.

9. **Testing & verification plan**
   - List specific steps Codex must perform at the end:
     - Which pages to open.
     - Which viewport sizes to simulate (e.g. 320–400px width, ~768px, ~1440px).
     - Which interactions to test (scrolling, clicking cookie buttons, opening mobile menu, etc.).
   - Include any commands to run (if applicable), such as:
     - `npm install` (initially, if dependencies are missing).
     - `npm run build:css` or `npm run build` to ensure scripts and CSS builds still succeed.

10. **Logging / change tracking**
    - Encourage Codex to:
      - Keep a short “Change summary” section.
      - Update a “Decision log” if the ExecPlan already has one (e.g. “Decided to keep parallax disabled on mobile after testing multiple approaches”).

---

## 4. Repo-specific guidance for ExecPlans

For this repository, ExecPlans **must**:

1. **Treat the reader as new to the repo**
   - Assume they only see:
     - The code in the current working tree.
     - This `PLANS.md`.
     - The ExecPlan itself.
   - Ensure the ExecPlan points clearly to relevant files and body classes/IDs (e.g. `.page-estate-agents`, `.cookie-banner`, `.parallax-section`, `.service-pill`).

2. **Describe current state before proposing changes**
   - For each bug or requested change:
     - Summarize how the feature currently works on:
       - The Estate Agents page (`niches/estate-agents.html`).
       - Any other affected pages (`index.html`, `services.html`, `about.html`, `book.html`, `contact.html`).
     - Mention where key CSS and JS live (`assets/css/*.css`, `assets/js/script.js`, `assets/js/cookie-consent.js`, etc.).
   - Only after this summary should the ExecPlan outline the implementation plan.

3. **Stay within the defined scope**
   - For the Estate Agents bugfix ExecPlan in particular, focus on:
     - Cookie-consent banner behavior and persistence across pages.
     - Vertical spacing between named sections on `niches/estate-agents.html`.
     - Card background opacity consistency on that page.
     - Desktop navigation banner alignment and the Services dropdown.
     - Mobile menu pill styling (especially the Services entry).
     - Background images and parallax behavior (desktop and mobile, including URL-bar-related jumps).
     - Counter effect removal and adding `%` symbols.
     - Desktop vs mobile image selection for Estate Agents (`Real_Estate_*.jpeg` vs `Real_Estate_*_Mobile.jpeg`).
     - Use of `book-hero-calendly-mobile-2025@*x.webp` for Estate Agents mobile background where appropriate.
   - Avoid opportunistic refactors or new features beyond what is required to satisfy the ExecPlan’s goals.

4. **Interact carefully with `.codex/config.toml`**
   - If an ExecPlan involves Codex configuration:
     - Include an explicit step to open and read `.codex/config.toml`.
     - Compare it with the official Codex config docs (model selection, `model_reasoning_effort`, feature flags, sandbox/network settings).
     - Note whether:
       - The model is set to `gpt-5.1-codex-max` or something else.
       - `model_reasoning_effort` is set (and to what).
       - Internet access features (like `web_search_request`) are enabled in the right section.
     - Decide whether to:
       - Keep it as-is.
       - Update it (preferred for aligning with this repo’s guidance).
       - Or recommend removing/ignoring it (rare; document why).
   - Any change to `.codex/config.toml` must remain compatible with the official schema (e.g. `[features]` table, sandbox sections).

---

## 5. How Codex should implement an ExecPlan here

When executing any ExecPlan in this repo, Codex should:

1. **Work autonomously through milestones**
   - Do not prompt the user after each small change.
   - Only pause to ask questions when:
     - Requirements conflict.
     - A decision has significant UX or product implications.
     - The codebase and documentation do not make the intent clear.

2. **Use small, reviewable edits**
   - Prefer editing only the relevant sections of files.
   - Avoid mass search-and-replace on generic classes unless the ExecPlan explicitly endorses it.
   - Keep styling changes scoped via page-specific body classes where possible.

3. **Verify as you go**
   - After each major milestone, re-open the affected page(s) and check:
     - Desktop layout and behavior.
     - Mobile layout and behavior (orientation changes, scroll, URL bar show/hide).
   - Re-run build commands if they are likely to be affected (`npm run build:css`, `npm run build`).

4. **Document progress**
   - Mark milestone checkboxes as `[x]` when complete.
   - Add short notes under any “Progress” or “Decision log” section in the ExecPlan.
   - Summarize final changes in a way that a human reviewer can quickly understand.

5. **Respect project boundaries**
   - If you need to touch a file outside the ExecPlan’s impacted list, first:
     - Explain (in the chat and/or ExecPlan) why it is necessary.
     - Keep the change as minimal as possible.

---

## 6. File naming and location

- Place ExecPlans at the **repository root**.
- Use names like:
  - `estate-agents-bugfixes.ExecPlan.md`
  - `navigation-cleanup.ExecPlan.md`
- This `PLANS.md` file belongs in the repository root, alongside `AGENTS.md`.

Any agent working on this repo should treat `PLANS.md` and the active ExecPlan as the primary specification for how to plan and execute multi-step work.
