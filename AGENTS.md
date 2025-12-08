# AGENTS.md – Silverstone Marketing Site

This file gives Codex persistent guidance for working on the **Silverstone** static marketing website. It complements your global Codex configuration and any local `AGENTS.md` in parent directories.

Codex must read this file, then `PLANS.md`, then any relevant ExecPlan before performing significant work in this repository.

---

## Project Overview

This repository contains the static marketing site for Silverstone, including:

- A primary marketing homepage.
- A services overview page and multiple niche pages, including a dedicated **Estate Agents** niche.
- Supporting pages such as About, Contact, Book, and Privacy Policy.

The site is primarily HTML/CSS/JavaScript with no heavy framework. Interactivity is handled via small JS modules, and visuals are driven by hand-authored CSS plus a parallax and hero shader system.

---

## Tech Stack

- **HTML**: Multiple static pages, each with its own `<head>` and `<body>`; some niche pages live under `niches/`.
- **CSS**:
  - `assets/css/styles.css` – core site styling (layout, typography, cards, header).
  - `assets/css/custom.css` – overrides and project-specific additions (cookie banner, nav tweaks).
  - `assets/css/custom-styles.css` – additional layout, card, and proof/values styles.
  - `assets/css/mobile.css` – mobile-specific overrides for sections, hero, values, etc.
  - `assets/css/parallax-fix.css` – parallax background system for “themed” sections.
  - `assets/css/hero-base.css` – shader hero layout.
- **JavaScript**:
  - `assets/js/script.js` – navigation, mobile menu, animation triggers, stats counters, and parallax control.
  - `assets/js/cookie-consent.js` – cookie-consent banner behavior and persistence.
- **Images**:
  - `assets/images/` – hero/parallax backgrounds, social media and niche-specific imagery.
  - `assets/images/socialmedia/Real_Estate_*.jpeg` and `*_Mobile.jpeg` – Estate Agents imagery.
  - `assets/images/internet/hero/book-hero-calendly-mobile-2025*.webp` – book/hero background.
- **Config**:
  - `.codex/config.toml` – per-repo Codex configuration for model selection, reasoning, and tool flags.

---

## Repository Layout

At the repo root:

- Top-level pages:
  - `index.html`
  - `about.html`
  - `services.html`
  - `contact.html`
  - `book.html`
  - `privacy-policy.html`
- Niche pages:
  - `niches/estate-agents.html`
- Assets:
  - `assets/css/` – CSS files.
  - `assets/js/` – JS files.
  - `assets/images/` – images and backgrounds.
  - `assets/icons/` – icon assets.
- Automation / utilities:
  - `build-css.js` – optional Node script to normalise CSS breakpoints.
  - `scripts/optimize-images.js` – optional image optimisation script.
- Codex configuration:
  - `.codex/config.toml`

There is no framework-specific build pipeline; the site can be run directly as static files.

---

## How to Run and Preview

When you want to preview changes:

1. From the repo root, start a simple static server. Examples (choose one based on the environment):

   - Python:

     - `python -m http.server 8000`

   - Node (using `serve`):

     - `npx serve .`

2. Open the site in a browser:

   - `http://localhost:8000/index.html`
   - Other pages via direct paths, e.g.:
     - `/services.html`
     - `/niches/estate-agents.html`
     - `/about.html`
     - `/contact.html`
     - `/book.html`

3. For mobile testing, use the browser’s responsive design mode or a device emulator.

Codex should use these commands as needed when instructed to run tests or perform visual verification.

---

## Code Style & Conventions

- **HTML**
  - Stick to existing indentation and formatting patterns for each file.
  - Prefer adding small, semantic class names over changing existing ones.
  - Use `body` classes (e.g. `page-estate-agents`) for page-specific overrides.

- **CSS**
  - Keep **global** changes to a minimum; favour scoped selectors:
    - e.g. `body.page-estate-agents .section.compact-section { ... }`.
  - Reuse existing variables and design tokens from `styles.css` (e.g. `--color-green`, `--color-blue`).
  - If adjusting responsive behavior, update both base and mobile overrides in a coordinated way.

- **JavaScript**
  - Follow the existing style and comment patterns in `assets/js/script.js` and `assets/js/cookie-consent.js`.
  - Prefer small, focused changes with clear comments explaining why they are safe and scoped.
  - Avoid introducing new third-party JS libraries.

- **Accessibility**
  - Preserve ARIA attributes on nav buttons and overlays (`aria-expanded`, `aria-hidden`, `aria-label`).
  - Maintain reasonable color contrast when adjusting backgrounds.

- **Formatting**
  - Avoid mass reformatting or reflowing HTML/CSS/JS, as that obscures diffs.
  - Limit changes to necessary lines plus a small context where needed.

---

## ExecPlans and PLANS.md

For any substantial work (multi-file or multi-step), Codex must use **ExecPlans** defined by `PLANS.md`:

- **Always:**
  - Read `PLANS.md` first.
  - Then read the ExecPlan referenced by the user (for this project, the estate-agents bugfix ExecPlan in the repo root).

- ExecPlans in this repo must:
  - Assume the reader is new to the project.
  - Clearly document context, goals, non-goals, impacted files, risks, and step-by-step work.
  - Include sections for `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective`.

- When the user says “follow the Estate Agents ExecPlan” or similar:
  - Open that `*.ExecPlan.md` file.
  - Follow it milestone by milestone, updating the plan as you go.
  - Do not pause to ask for “next steps” unless you hit an ambiguity that cannot be resolved safely using available context and internet access.

---

## Estate Agents Bugfix Workflow

The Estate Agents page (`niches/estate-agents.html`) and its related shared components (cookie banner, nav, parallax, card styling, counters, responsive imagery) are high-priority areas.

When working on tasks that mention Estate Agents or the associated bug list:

1. **Files to inspect first**
   - `niches/estate-agents.html`
   - `index.html` and `services.html` (for shared patterns).
   - `assets/css/styles.css`
   - `assets/css/custom.css`
   - `assets/css/custom-styles.css`
   - `assets/css/mobile.css`
   - `assets/css/parallax-fix.css`
   - `assets/js/script.js`
   - `assets/js/cookie-consent.js`
   - `.codex/config.toml`

2. **Behavior to consider**
   - Cookie-consent banner consistency across `index`, `about`, `services`, `contact`, `book`, and `niches/estate-agents`.
   - Section spacing on the Estate Agents page.
   - Card background opacity and consistency across:
     - “Show the numbers, not just promises”.
     - “Where deals leak away”.
     - “Answer instantly. Confirm automatically. Keep the chain warm.”
     - “Plug, personalise, launch.”
     - “Safe, compliant, and fully supported.”
   - Desktop nav alignment and Services dropdown.
   - Mobile Services overlay, especially the Services pill styling.
   - Parallax background behavior on `index`, `services`, and `niches/estate-agents`.
   - Stats/counter behavior (animations vs static numbers and percent signs).
   - Desktop vs mobile Estate Agents imagery.

3. **Scope discipline**
   - Confine changes to what the active ExecPlan and bug list require.
   - Prefer page-specific CSS/JS adjustments over global changes.

---

## Models, Reasoning Effort, and Internet Access

For this repository:

- **Preferred model**: `gpt-5.1-codex-max`.
- **Reasoning effort**:
  - Use `model_reasoning_effort = "xhigh"` for:
    - Layout debugging.
    - Navigation and menu changes.
    - Parallax and background behavior.
    - Any multi-step change spanning HTML, CSS, JS, and config.
- **Internet access**:
  - When Codex Cloud or the Codex web interface allows internet access, you should:
    - Use it to consult official Codex docs (ExecPlans, AGENTS.md, config).
    - Research browser behavior for sticky backgrounds, mobile address bar issues, and CSS/JS best practices.
    - Avoid off-topic browsing.

The `.codex/config.toml` file in this repo is the local source of truth for project-level Codex configuration. However:

- If `.codex/config.toml` conflicts with explicit instructions in:
  - `AGENTS.md`,
  - `PLANS.md`,
  - An active ExecPlan,
  - or these custom instructions,
- Then **prefer the more specific, project-scoped instructions** and surface the conflict in the chat so the human can decide whether to adjust the config.

---

## Working with `.codex/config.toml`

- The file currently enables:
  - Web search (`web_search_request = true`).
  - Image viewing (`view_image_tool = true`).
- As part of the Estate Agents bugfix ExecPlan, Codex may:
  - Set:
    - `model = "gpt-5.1-codex-max"`.
    - `model_reasoning_effort = "xhigh"`.
  - Move or duplicate tool flags into a `[features]` table as recommended by the Codex example config (e.g. `view_image_tool = true`, `web_search_request = true`).

When editing `.codex/config.toml`:

- Follow the official example config format from the Codex docs.
- Keep the configuration as minimal as possible while meeting project needs.
- Document changes in the ExecPlan `Decision Log`.

---

## Safety and Security

- Do not introduce any code that sends data to external services unless explicitly requested.
- Do not hard-code secrets, tokens, or API keys.
- If you encounter email addresses or contact details, leave them unchanged unless the task explicitly involves updating them.

---

## How to Use This File

- Codex should read this `AGENTS.md` on every new session in this repo.
- Then it should read `PLANS.md`.
- For complex tasks, Codex should:
  - Create or follow an existing ExecPlan in the repo root (e.g. `estate-agents-bugfixes.ExecPlan.md`).
- For simple, localised fixes that clearly do not affect multiple files or complex behavior, Codex may operate without a full ExecPlan, but must still respect the scope, model, and safety guidance here.

Treat `AGENTS.md` as a living document; maintainers may update it as the project evolves.
