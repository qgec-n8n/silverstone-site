# Codex Execution Plans (ExecPlans) for `silverstone-site`

This document defines how to design and implement **ExecPlans** for this repository so that Codex can carry out multi-step changes safely and predictably. Treat the reader of any ExecPlan as a complete beginner to this codebase: they only have the working tree and the ExecPlan you write.

ExecPlans are **living design documents**. They must be kept up to date as work proceeds, so that someone else (or Codex in a later session) can resume work using only the ExecPlan and the repo checkout.

This file is adapted from the Codex Exec Plans cookbook article and customized for the Silverstone marketing site, with a special focus on the **Estate Agents** niche page and shared layout behavior.

---

## 1. How ExecPlans are used in this repo

When working with this repository:

- **Codex must always read, in order**:
  1. The root `AGENTS.md`.
  2. This `PLANS.md`.
  3. The specific ExecPlan referenced by the user (for this project, the Estate Agents bugfix ExecPlan in the repo root).

- ExecPlans are required for:
  - Any multi-file change (HTML + CSS, or HTML + JS).
  - Any change that affects:
    - Cookie-consent banner behavior.
    - Layout spacing between sections.
    - Background images / parallax behavior.
    - Card background opacity.
    - Desktop navigation bar alignment.
    - Mobile menu and **Services** pill styling.
    - Stats / “Proof in Numbers” / “Show the numbers, not just promises” counters.
    - Desktop vs mobile image selection (especially for Estate Agents imagery).
    - `.codex/config.toml`.

- When an ExecPlan is in play:
  - **Do not** ask the user for “next steps”.
  - Proceed autonomously through the milestones defined in the plan.
  - Keep the ExecPlan updated with progress and discoveries.

---

## 2. Non-negotiable requirements for ExecPlans

Every ExecPlan in this repository must satisfy these rules:

1. **Self-contained**
   - The ExecPlan must contain all context needed for a novice to complete the work:
     - Short description of relevant parts of the repo.
     - File paths and key selectors / functions.
     - Commands to run for testing or previewing.
   - Do not rely on “tribal knowledge” or unstated assumptions.

2. **Living document**
   - ExecPlans must be updated as work proceeds.
   - The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` are **mandatory** and must accurately reflect the current state.

3. **Concrete, user-visible outcomes**
   - Plans must describe how a human can verify the change:
     - Which page(s) to open.
     - Which behavior to look for (e.g. cookie banner presence, background behavior, card appearance, counter text).
   - The goal is working behavior, not just changed code.

4. **Clear goals and non-goals**
   - Every ExecPlan must include:
     - A **Goals** section that lists exactly what behaviors will change.
     - A **Non-goals** section that lists what must stay untouched (e.g. typography, copy, unrelated pages).

5. **Explicit file references**
   - ExecPlans must use **repo-relative paths** (from the GitHub root), such as:
     - `index.html`
     - `services.html`
     - `niches/estate-agents.html`
     - `assets/css/styles.css`
     - `assets/css/custom.css`
     - `assets/css/mobile.css`
     - `assets/css/parallax-fix.css`
     - `assets/js/script.js`
     - `assets/js/cookie-consent.js`
     - `.codex/config.toml`
   - When describing changes, name the CSS selectors, HTML classes, and JavaScript functions/blocks to be edited.

6. **Risk, validation, and idempotence**
   - ExecPlans must:
     - Identify potential risks (e.g. shared CSS affecting other pages, JS changes impacting multiple sections).
     - Propose mitigation strategies (e.g. page-specific body classes, scoped selectors).
     - Include repeatable testing / verification steps.
   - Steps should be safe to re-run (idempotent) without corrupting the repo.

---

## 3. Required sections in every ExecPlan

Each ExecPlan file in this repo must be a single Markdown document (no nested triple-backtick fences inside the file itself). It **must** include the following sections:

1. `# <Short, action-oriented description>`
2. `## Purpose / Big Picture`
3. `## Context and Current Behavior`
4. `## Goals`
5. `## Non-goals`
6. `## Impacted Files`
7. `## Plan of Work & Milestones`
8. `## Testing & Verification`
9. `## Risks & Mitigations`
10. `## Progress`
11. `## Surprises & Discoveries`
12. `## Decision Log`
13. `## Outcomes & Retrospective`

### Notes on content

- **Purpose / Big Picture**  
  Explain what a visitor to the website will notice after the change, and how they can confirm that it works (e.g. “the cookie banner appears once, behaves consistently across all pages, and does not reappear after consent”).

- **Context and Current Behavior**  
  Summarize the current state for each relevant issue:
  - Where the Estate Agents page lives (`niches/estate-agents.html`).
  - How cookie banners are structured and styled.
  - Where parallax behaviors and background images are defined.
  - Where the stats / counters logic lives.
  - How `.codex/config.toml` is currently configured.

- **Goals / Non-goals**  
  Use bullets or short paragraphs. Tie each goal explicitly to the bug/change list that motivated the ExecPlan.

- **Impacted Files**  
  List only the files you realistically expect to modify. If new files are needed (e.g. an additional CSS partial), name and justify them.

- **Plan of Work & Milestones**  
  Break work into milestones that can be validated independently. For each milestone, describe:
  - What will exist or behave differently at the end of the milestone.
  - Which files and selectors it touches.
  - How to quickly verify the milestone (e.g. reload a specific page and check a specific section).

- **Testing & Verification**  
  For this site, verification is mostly **visual and behavioral**:
  - Opening specific HTML files in a browser (via a static file server).
  - Checking behavior on both desktop-size and mobile-size viewports.
  - Confirming that changes on the Estate Agents page do not break similar sections on the home (`index.html`) or services (`services.html`) pages.

- **Progress / Surprises / Decision Log / Outcomes**  
  These are the “living” sections:
  - `Progress`: a timestamped checklist of completed vs remaining steps.
  - `Surprises & Discoveries`: notes about unexpected behavior, browser quirks, or design decisions forced by the existing code.
  - `Decision Log`: record key choices (e.g. “we added a `.page-estate-agents` scoped override instead of changing the global `.neon-card` style”).
  - `Outcomes & Retrospective`: summary at the end of the ExecPlan’s lifecycle describing what was achieved and any follow-ups.

---

## 4. Repo-specific guidance for ExecPlans

### 4.1 Estate Agents page and related sections

ExecPlans that affect the Estate Agents page **must**:

- Inspect and reason about the following areas:

  - **HTML**
    - `niches/estate-agents.html`
      - Cookie banner markup (`#cookie-banner`, `#cookie-accept-btn`, `#cookie-decline-btn`).
      - The “Show the numbers, not just promises” / stats section (`.stats`, `.number[data-target]`).
      - The “Where deals leak away”, “Answer instantly. Confirm automatically. Keep the chain warm.”, “Plug, personalise, launch”, and “Safe, compliant, and fully supported” cards and their classes (`.neon-card`, `.dark-card`, `.value-card`, etc.).
      - Real_Estate card images (e.g. `Real_Estate_1.jpeg`, `Real_Estate_2.jpeg`, `Real_Estate_3.jpeg`).
    - Shared pages:
      - `index.html`, `about.html`, `services.html`, `contact.html`, `book.html` for cross-page cookie behavior, nav, and parallax.

  - **CSS**
    - Global styles in `assets/css/styles.css` (including `.neon-card`, header/nav styles, and layout defaults).
    - Overrides in `assets/css/custom.css` (cookie-banner styles, any nav/menu tweaks).
    - Mobile adjustments in `assets/css/mobile.css` (section padding, mobile nav, values/cards layout).
    - Parallax background styles in `assets/css/parallax-fix.css` (including `data-parallax-theme="lines" | "circuit" | "mesh" | "waves" | "book"`).

  - **JavaScript**
    - `assets/js/cookie-consent.js` for banner show/hide and persistence logic.
    - `assets/js/script.js` for:
      - Stats / counter animation (`.stats`, `.number[data-target]`).
      - Mobile nav and Services overlay behavior.
      - Parallax mobile layer behavior and IntersectionObservers.

  - **Images**
    - Estate Agents images:
      - `assets/images/socialmedia/Real_Estate_1.jpeg` and `Real_Estate_1_Mobile.jpeg`
      - `assets/images/socialmedia/Real_Estate_2.jpeg` and `Real_Estate_2_Mobile.jpeg`
      - `assets/images/socialmedia/Real_Estate_3.jpeg` and `Real_Estate_3_Mobile.jpeg`
    - Background/parallax assets:
      - `assets/images/internet/hero/book-hero-calendly-mobile-2025.webp`
      - `assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp`
      - `assets/images/internet/mobile/book-hero-calendly-mobile-2025@2x.webp`
      - `assets/images/internet/mobile/book-hero-calendly-mobile-2025@3x.webp`
      - `assets/images/internet/section-waves*.webp` and `assets/images/internet/mobile/section-waves@*.webp`
      - `assets/images/internet/section-mesh*.webp` and `assets/images/internet/mobile/section-mesh@*.webp`

- Avoid unintended side effects:
  - Use page-specific body classes (e.g. `body.page-estate-agents`) and narrow selectors when modifying card backgrounds, stats, or spacing.
  - Carefully check how nav and parallax behavior differs between `index.html`, `services.html`, and `niches/estate-agents.html` before changing shared JS/CSS.

### 4.2 Cookie-consent banner ExecPlan requirements

For any ExecPlan that touches cookie behavior:

- Include explicit steps to:
  - Compare the banner markup across:
    - `index.html`
    - `about.html`
    - `services.html`
    - `contact.html`
    - `book.html`
    - `niches/estate-agents.html`
  - Review `assets/js/cookie-consent.js`.
  - Review `.cookie-banner`, `.cookie-actions`, and related CSS in `assets/css/custom.css`.
- Define the desired banner behavior clearly (when it should appear, how often, and under what persistence rules).
- Include verification steps using a **fresh browser context** (e.g. “clear localStorage and cookies for the test domain, then reload”).

### 4.3 ExecPlans that interact with `.codex/config.toml`

If an ExecPlan proposes changes to `.codex/config.toml`:

- First, describe the current contents of `.codex/config.toml` in the `Context and Current Behavior` section.
- Then, in the plan:
  - State the desired default model (`gpt-5.1-codex-max`).
  - State the desired reasoning level (`model_reasoning_effort = "xhigh"`).
  - State the desired internet/search and image tools configuration (web search enabled, view-image tools enabled).
- Any proposed edits should:
  - Follow the official `config.toml` schema from the Codex configuration docs.
  - Preserve or re-create equivalent behavior for any existing settings (e.g. ensuring web search remains enabled).
- Include a **configuration verification step** in the Testing section:
  - Confirm that Codex sessions against this repo report the expected model and tools availability.
  - Confirm there are no syntax errors in `config.toml`.

---

## 5. Implementing an ExecPlan

When Codex executes an ExecPlan in this repository, it must:

1. **Read and re-orient**
   - Re-read `AGENTS.md`, `PLANS.md`, and the active ExecPlan before making changes.
   - Summarize the intended work and confirm the list of impacted files in the ExecPlan itself.

2. **Work milestone by milestone**
   - Do not skip milestones, even if the work looks trivial.
   - Update the `Progress` section as each milestone or subtask is completed.

3. **Use Git (if available) or clear change logs**
   - Where possible, group related changes into logical commits with descriptive messages.
   - If commits are not used, write a short **change log** in the ExecPlan or in the chat (file-by-file overview of edits).

4. **Validate at each major step**
   - After changes to cookie banners, nav, parallax, counters, or images:
     - Reload the affected pages.
     - Re-check behavior on desktop and mobile.
   - Only move on once the milestone’s acceptance criteria are satisfied.

5. **Finish with a retrospective**
   - At the end of the ExecPlan’s lifecycle, fill in `Outcomes & Retrospective`:
     - What was fixed and where.
     - How to verify the final state.
     - Any follow-up work that should be captured in a future plan.

---

## 6. Format reminder

- Each ExecPlan is stored in a `*.ExecPlan.md` file at the repo root (for this project, we use a dedicated Estate Agents ExecPlan).
- The file itself contains **plain Markdown**, not wrapped in triple-backtick code fences.
- When showing commands or code snippets inside an ExecPlan, use indentation rather than nested fences, to avoid prematurely closing the ExecPlan when it is embedded elsewhere.
