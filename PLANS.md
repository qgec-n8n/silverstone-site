# Codex Execution Plans (ExecPlans) for the Silverstone site

This repository contains a static marketing site for Silverstone, built with HTML, CSS, and vanilla JavaScript. To help Codex safely perform multi-step work (especially on the Estate Agents niche page), we use **ExecPlans** guided by this `PLANS.md` file.

ExecPlans are detailed, self-contained design documents that Codex follows from analysis through implementation. They are intended for complex or multi-hour tasks where we want predictable behavior and clear progress.

## How to use PLANS.md and ExecPlans

When Codex is asked to perform non-trivial work in this repo:

1. **Always read these documents in this order:**
   - `AGENTS.md` (project expectations and setup).
   - `PLANS.md` (how ExecPlans work in this repo and what plans exist).
   - The specific ExecPlan markdown file for the task (for Estate Agents work: `ExecPlan.estate-agents-page-fixes.md` at the repo root).

2. **When authoring or updating an ExecPlan in this repo:**
   - Follow the structure defined in the “ExecPlan requirements” section below.
   - Make the ExecPlan **fully self-contained**: a new engineer should be able to succeed with only the working tree and that ExecPlan.
   - Treat the ExecPlan as a **living document**:
     - Update the Progress, Surprises & Discoveries, Decision Log, and Outcomes sections as work proceeds (when a future task explicitly asks you to update it).
     - Record important choices and tradeoffs directly in the ExecPlan.

3. **When implementing an ExecPlan:**
   - Do not ask the user for “next steps” while the ExecPlan already defines them. Move to the next step autonomously.
   - Keep patches small and reviewable; do not refactor unrelated code.
   - Validate your work according to the ExecPlan’s “Validation and Acceptance” section before declaring the task done.

4. **Do not edit `AGENTS.md` or `PLANS.md`** unless the user explicitly requests it. They are treated as stable guidance for this project.

## ExecPlan requirements (adapted from the Codex ExecPlans guide)

Every ExecPlan in this repository must:

- Be self-contained:
  - Include all context needed to understand the feature or bugfix.
  - Define important terms and assumptions in plain language.
- Be a living document:
  - Include sections to track progress, discoveries, decisions, and outcomes.
  - Remain useful to restart work later with only the ExecPlan and the repo.
- Enable a working, validated outcome:
  - The plan must end in a demonstrable behavior change (not just “code edited”).

Each ExecPlan should, at minimum, include the following headings:

- **Purpose / Big Picture**
- **Progress**
- **Surprises & Discoveries**
- **Decision Log**
- **Outcomes & Retrospective**
- **Context and Orientation**
- **Plan of Work**
- **Concrete Steps**
- **Validation and Acceptance**
- **Idempotence and Recovery**
- **Artifacts and Notes**
- **Interfaces and Dependencies**

Formatting rules in this repo:

- ExecPlans are stored as `.md` files at the repository root (or inside a dedicated `plans/` folder if we add one later).
- ExecPlan files themselves **do not** include triple backtick fences in the file content; they are plain Markdown.
- Commands and code snippets inside an ExecPlan use normal Markdown indentation or inline backticks.

## Current ExecPlans

### 1. `ExecPlan.estate-agents-page-fixes.md`

**Short description:**  
Fix and polish the Estate Agents niche page and closely related shared components, focusing on cookie behavior, spacing, card backgrounds, nav alignment, background images/parallax, counters/percentages, and responsive Real_Estate images.

**Scope and goals (high level):**

Work is restricted to:

- `niches/estate-agents.html`
- Shared header/navigation used by:
  - `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, and `niches/estate-agents.html`.
- Shared CSS and JS that directly affect the Estate Agents page or global header:
  - CSS: `assets/css/styles.css`, `assets/css/custom.css`, `assets/css/custom-styles.css`, `assets/css/mobile.css`, `assets/css/parallax-fix.css`, `assets/css/hero-base.css`, `assets/css/services.css`.
  - JS: `assets/js/script.js`, `assets/js/cookie-consent.js`, `assets/js/hero-shader.js`.

The ExecPlan details eight specific bugfix / polish areas:

1. **Cookie consent behavior on Estate Agents page**
   - Ensure the cookie banner:
     - Appears on page load only when no accept/decline decision has been stored.
     - Remains visible and stable while scrolling until the user clicks accept or decline.
     - Does not reappear on any page after accept/decline (including Estate Agents).
     - Respects choices made from any other page (i.e. cross-page persistence via `localStorage` and cookies).

2. **Extra vertical spacing between specific sections**
   - Reduce vertical gaps so the spacing:
     - Between “The branch experience after launch” and “Plug, personalise, launch”.
     - Between “Pricing” and “FAQs”.
     - Between “The ‘Never Miss a Viewing’ pack” and “Show the numbers, not just promises”.
   - Matches the visual gap between “Show the numbers, not just promises” and “The branch experience after launch”.
   - Limit changes to Estate Agents sections and relevant breakpoints only.

3. **Card background opacity consistency**
   - Make all cards on the Estate Agents page share the same dark, more opaque background as the reference cards in “Show the numbers, not just promises” (or whichever card style proves most legible after inspection).
   - Implement this in a DRY, maintainable way (shared class or estate-specific CSS, not copy-paste per card).

4. **Services dropdown menu button alignment (desktop)**
   - On desktop, ensure the “Services” dropdown button in the header (`<li class="nav-dropdown">`) sits exactly in line with its neighboring menu items (Home, About, Book, Contact).
   - Fix via CSS/markup adjustments that do not change the overall nav behavior or structure.

5. **Services pill styling (mobile menu overlay)**
   - In the mobile overlay navigation, ensure the “Services” pill/dropdown button:
     - Uses the same font family, font color, font size, and center alignment as other mobile menu pills.
   - Reuse existing classes (e.g. `.service-pill`, `.service-link`) to keep styling consistent.

6. **Missing background image on mobile Estate Agents page**
   - Ensure the mobile version of the Estate Agents page uses:
     - `book-hero-calendly-mobile-2025@*x.webp` (1x/2x) as the background image for the relevant hero/section background.
   - Approach:
     - Fix relative paths used by the mobile parallax layer in `assets/js/script.js` and ensure they work from the nested `niches/` path as well as root pages.
     - Confirm CSS in `assets/css/mobile.css` and `assets/css/parallax-fix.css` still applies correctly.
   - Keep the parallax effect correct on both mobile and desktop.

7. **Counter effect and percentages in “Show the numbers, not just promises”**
   - Disable the animated counter behavior for this specific stats block on the Estate Agents page.
   - Change the metrics so they render as static values:
     - Use `68%` and `42%` (with visible percent signs) for the relevant stats.
   - Preserve counter behavior on other pages (`index.html`, `about.html`) where animation is still desired.

8. **Responsive Real_Estate images**
   - For all Estate Agents `Real_Estate_*` imagery:
     - Use `Real_Estate_*_Mobile.jpeg` on mobile viewports.
     - Use `Real_Estate_*.jpeg` on desktop viewports.
   - Implement using best-practice responsive image patterns in plain HTML:
     - Prefer `<picture>` + `<source media="(max-width: …)">` or `srcset`/`sizes` while preserving current classes and layout.

Additional configuration work:

- Review `.codex/config.toml` (if present, in the user’s Codex home or project config):
  - Prefer `model = "gpt-5.1-codex-max"`.
  - Prefer `model_reasoning_effort = "xhigh"` for this repo.
  - Enable minimal internet access tools (web search) for documentation-only lookups (e.g. `developers.openai.com`, `cookbook.openai.com`, `agents.md`) if helpful.
- If `.codex/config.toml` is missing, suggest a minimal configuration in a future task; do not block these fixes on its existence.

Codex MUST NOT:

- Redesign the site, change copy, or adjust typography/colors outside of what is absolutely necessary to fix the listed bugs.
- Refactor unrelated components or introduce new frameworks/libraries.
- Edit `AGENTS.md`, `PLANS.md`, or `ExecPlan.estate-agents-page-fixes.md` unless a future task explicitly instructs it to do so.
