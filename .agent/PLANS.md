# Codex Execution Plans (ExecPlans) for this repo

This document describes how to write and maintain execution plans (“ExecPlans”) for this repository so that a coding agent (GPT-5-Codex in Codex CLI) can repeatedly deliver high-quality features such as the Real Estate niche landing page.

Treat the reader as a complete beginner to this repository: they have only the current working tree and the single ExecPlan file you provide. There is no memory of prior plans and no external context.

## How to use ExecPlans and PLANS.md

When authoring an ExecPlan, follow this PLANS.md **to the letter**:
- If you are started with a system prompt that tells you to automatically execute `.agent/plans/real-estate-landing-page.md`, your first steps are:
  1. Confirm `.agent/PLANS.md` and `.agent/plans/real-estate-landing-page.md` exist.
  2. Read both files in full.
  3. Begin working through that ExecPlan’s “Concrete Steps” and “Plan of Work”, updating `Progress` and other living sections as you go.
- Before you write or update an ExecPlan, re-read this PLANS.md end-to-end to refresh the requirements.
- Be thorough when reading source material:
  - Inspect the repository structure (HTML pages, CSS, JS).
  - Study the existing design system and shared patterns.
  - For the Real Estate niche landing page, incorporate the full on-page copy, section ordering, and visual intent from the Real Estate Niche Page Template that the user has supplied.
- When creating a new ExecPlan, start from the skeleton in the “Skeleton of a Good ExecPlan” section below and customize it for the task at hand.

When implementing an ExecPlan:

- Do not ask the user for “next steps”; instead, follow and update the plan.
- Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` up to date as you work.
- Resolve ambiguities autonomously and record the choices you make in the `Decision Log`.
- Treat ExecPlans as living documents: you must revise them as you learn more or change direction, and each revision must remain fully self-contained.

ExecPlans are mandatory for multi-file or multi-section work in this repo, including creation and significant evolution of the Real Estate niche landing page.

## Non-negotiable requirements

Every ExecPlan in this repo must satisfy the following:

- **Self-contained:** Each ExecPlan must contain all knowledge and instructions needed for a novice to succeed. Do not require outside docs, prior plans, or private context.
- **Living document:** ExecPlans must be updated as progress is made, as discoveries occur, and as design decisions are finalized. A partially updated ExecPlan is considered broken.
- **Novice-friendly:** A complete beginner to this repo must be able to implement the feature end-to-end by following the ExecPlan and reading the code it points to.
- **Behavior-focused:** Each ExecPlan must define observable user-facing behavior (for example, “there is a working Real Estate niche landing page at `/niches/estate-agents`”) rather than only code edits.
- **Plain language:** Define every term of art in ordinary English or don’t use it.
- **Outcome-first:** Start by explaining why the work matters from a user’s perspective and how to see it working in the running site.

The agent executing your plan can:

- List and read files, search within the repo, run the project, and run tests or build scripts.
- Use `shell` and `apply_patch` via Codex CLI, subject to sandboxing and approvals.

Assume no prior context: repeat any assumptions you rely on, including how to run the site and where key components live.

## Repository-specific orientation (high level)

This repo is a marketing site for automation services, with a shared visual design system and several existing pages. The exact file layout may vary between revisions, but you should expect patterns similar to:

- **Top-level pages** (usually HTML files):
  - `index.html` — home page, containing the main hero, “Proof in Numbers” stats strip, FAQs, CTA, and footer.
  - `about.html` — about page, including “values” cards and other neon-card-based blocks.
  - `services.html` or `pages/services.html` — services listing, with `.service-row` layouts (image + neon card content).
  - `book.html` — booking/contact page, with CTA and footer patterns reused from the other pages.
- **Assets and design system:**
  - CSS under `assets/css/`, including:
    - `styles.css` — global styles, colors, typography, neon cards, stats cards, FAQ, footer.
    - Possibly additional files like `hero-base.css` or similar for hero background animations and layout.
  - JavaScript under `assets/js/` (for example, `scripts.js`) to handle behaviors such as FAQ accordions.
  - Images under `assets/images/` and subfolders such as `assets/images/socialmedia/` (for example, `Real_Estate_1.jpeg`, `Real_Estate_2.jpeg`, `Real_Estate_3.jpeg` for the Real Estate page illustrations).
- **Key CSS selectors likely to be reused:**
  - `.section`, `.hero`, `.neon-card`, `.service-row`, `.service-image`, `.service-content`, `.stats-card`, `.faq-item`, `.faq-question`, `.faq-answer`, `footer .footer-column`, CTAs and button classes.

When writing ExecPlans:

- Do **not** assume these paths exist; instead, instruct the reader (and Codex) to confirm them using commands such as `ls`, `find`, or `rg --files`, then adapt accordingly.
- Treat the existing home, about, services, and booking pages as canonical examples for layout, class naming, and animation patterns. ExecPlans must explicitly point readers to those files when describing how to mirror patterns.

## Real Estate niche page as a recurring reference

The Real Estate niche landing page is a primary use case for ExecPlans in this repo:

- It targets independent UK estate and lettings agents.
- It must follow the section ordering and copy defined in the Real Estate Niche Page Template (hero, pains, bundle, proof strip, outcomes, how it works, risk/reassurance, pricing placeholder, FAQs, final CTA, footer) and reuse existing layout components (neon cards, stats cards, FAQ accordion, CTAs, footer) instead of inventing new patterns.
- It must reuse tokens and typography from the shared design system (brand colors, heading scale, fonts) and keep additional CSS minimal and token-based.

When you write ExecPlans for this page or similar niche pages, always embed the relevant copy and structure directly in the plan so a novice does not need to open the original `.docx`.

## Formatting rules for ExecPlans

ExecPlans are Markdown documents with a fixed structure:

- In **Git** (saved as a `.md` file under `.agent/plans/`), an ExecPlan is a plain Markdown document starting with a top-level `#` heading.
- In **chat**, when an ExecPlan is shared inline, it must be enclosed in a single fenced code block labeled `md`, with no nested triple-backtick fences inside. When showing commands, diffs, or code snippets, use indentation rather than inner fences.

Within an ExecPlan:

- Use headings (`#`, `##`, etc.) and blank lines correctly.
- Use prose as the default. Lists are allowed where they clarify information, especially in `Progress` and where the Real Estate spec uses bullets for content.
- The `Progress` section must use checkboxes (`- [ ]` / `- [x]`) and include timestamps when updated during execution.

## Guidelines for ExecPlans in this repo

### Self-containment and plain language

- Do not rely on external blogs or docs. If you need information about the design system, embed a concise summary from this repo directly in the ExecPlan (for example, describing how `.neon-card` and `.stats-card` are styled in `assets/css/styles.css`).
- Define non-obvious terms such as “hero shader animation”, “neon card”, or “stats strip” directly in the ExecPlan, referring to the concrete files where they appear.

### Repository-specific best practices

ExecPlans for this repo must:

- **Reuse existing layouts and components:**
  - When creating new sections (for example, for the Real Estate niche page), mirror the markup, classes, and structure of:
    - Hero sections from `index.html` or `book.html`.
    - `.service-row` layouts from `services.html`.
    - Stats cards from the “Proof in Numbers” strip on the home page.
    - Values / feature cards from `about.html`.
    - FAQ accordion markup and behavior from `index.html` and associated JS.
    - CTA and footer blocks from existing pages.
- **Respect the design system:**
  - Use the existing color tokens (for example, a primary neon green, secondary blue, tertiary purple, dark backgrounds, silver/grey text) and typography (headings vs body fonts).
  - Do not hard-code new hex colors or fonts unless the ExecPlan explicitly justifies and the change is clearly additive and token-based.
- **Keep CSS additive:**
  - Prefer adding small, composable classes or reusing utility classes to rewriting large blocks of CSS.
  - Avoid general, risky changes to global selectors; instead, scope new rules to new page-specific classes (for example, `.niche-estate-agents`).
- **Be safe with file edits:**
  - Use `apply_patch` for small, focused changes.
  - Avoid large rewrites of core pages (home, about, services) unless the ExecPlan explicitly covers the migration, testing, and rollback strategy.

### Milestones and observable outcomes

- Break the work into milestones that each describe:
  - The new behavior or UI that will exist at the end of the milestone (for example, “a complete hero section for the Real Estate page that uses the shader animation and includes both CTAs with correct copy”).
  - The files that will be edited.
  - How to prove the milestone is complete (for example, by running the site and visually confirming that the hero section matches the spec).
- For multi-section page work (like the Real Estate niche page), a typical milestone breakdown is:
  - Milestone 1: Orient in the repo and set up the new page skeleton and routing.
  - Milestone 2: Implement hero, pains, and bundle sections.
  - Milestone 3: Implement proof strip and outcomes sections.
  - Milestone 4: Implement how-it-works, risk/reassurance, and pricing placeholder.
  - Milestone 5: Implement FAQs, final CTA, footer, and nav links; run validation and refinements.

Each milestone must be independently verifiable and incrementally move the site closer to the final behavior.

### Validation and safety

ExecPlans must include:

- Exact commands to:
  - List and inspect files (`ls`, `find`, `rg`).
  - Run the site (for example, `npm run dev`, `npm run start`, or opening HTML directly), based on what the repo’s `README.md` and `package.json` specify.
  - Run any tests or build steps, if present (`npm test`, `npm run build`, or equivalents).
- Detailed instructions for visually validating the Real Estate niche page:
  - Which URL or file to open (for example, `/niches/estate-agents` or `niches/estate-agents.html`).
  - Which sections to verify and in what order.
  - Key content (headlines, CTA labels, numbers) that must match the spec exactly.
- A description of acceptance criteria written as user-visible behavior, such as:
  - “On desktop, four stats cards appear in a single row; on mobile they wrap gracefully.”
  - “Clicking each FAQ question expands and collapses its answer using the same animation as the home page.”

ExecPlans must also explain idempotence and recovery: how to re-run steps safely, how to recover from failed edits, and how to avoid corrupting shared layouts.

## Skeleton of a Good ExecPlan for this repo

When creating a new ExecPlan (for example, for the Real Estate niche landing page), start from the following skeleton and then fill it in with repo-specific details and the page’s content.

    # <Short, action-oriented description>

    This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept accurate as work proceeds.

    This plan must be maintained in accordance with `.agent/PLANS.md` at the repository root.

    ## Purpose / Big Picture

    Explain in a few sentences what someone gains after this change and how they can see it working (for example, navigating to a new URL and seeing the new page).

    ## Progress

    Use a checklist of granular steps with timestamps that you update as you work.

    - [ ] (YYYY-MM-DD hh:mmZ) Example pending step.
    - [x] (YYYY-MM-DD hh:mmZ) Example completed step.

    ## Surprises & Discoveries

    Note any unexpected behaviors, file structures, or design details found while implementing the plan.

    ## Decision Log

    - Decision: …
      Rationale: …
      Date/Author: …

    Record every material decision here.

    ## Outcomes & Retrospective

    Summarize what was achieved and how it compares to the original purpose. Note any gaps or future work.

    ## Context and Orientation

    Describe the current repo state relevant to the task, naming key files with full paths (for example, `index.html`, `assets/css/styles.css`, `assets/js/scripts.js`). For Real Estate work, embed the section map and exact copy.

    ## Plan of Work

    In prose, describe the sequence of edits and new files. Group work into narrative milestones, each with:
    - Scope and goal.
    - Files you will touch.
    - How success for that milestone is shown.

    ## Concrete Steps

    List the exact commands to run (with working directory) to:
    - Explore the repo.
    - Implement the changes, using `apply_patch` for code edits.
    - Run build/test/dev commands.

    Indent commands as code examples without extra fences.

    ## Validation and Acceptance

    Describe how to exercise the system (for example, starting the site and visiting the new page) and what to observe. State clear acceptance criteria tied to the intended user behavior.

    ## Idempotence and Recovery

    Explain how steps can be repeated safely and what to do if a patch or command fails.

    ## Artifacts and Notes

    Include short, focused terminal transcripts, diff fragments, or notes that help a future reader understand what happened.

    ## Interfaces and Dependencies

    Be explicit about which CSS selectors, JS behaviors, and HTML structures must exist at the end of the work (for example, that the Real Estate FAQ uses the same `.faq-item` markup and JS behavior as the home page).

If you follow this structure, a stateless agent or a human novice can read the ExecPlan top-to-bottom and produce a working, visually correct Real Estate niche landing page (or similar feature) that fits seamlessly into this repo’s existing design system.
