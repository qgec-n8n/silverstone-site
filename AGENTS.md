# AGENTS.md

## Project overview

This repository is a static marketing site for **Silverstone**, implemented with:

- Plain HTML pages (no React/SPA framework).
- Vanilla CSS organized under `assets/css/`.
- Vanilla JavaScript under `assets/js/`.
- A small Node-based toolchain for building CSS and optimizing images (optional at runtime).

The site includes:

- Top-level pages such as:
  - `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`.
- A niche page for Estate Agents:
  - `niches/estate-agents.html`.
- Shared assets:
  - CSS: `assets/css/styles.css`, `assets/css/custom.css`, `assets/css/custom-styles.css`, `assets/css/mobile.css`, `assets/css/parallax-fix.css`, `assets/css/hero-base.css`, `assets/css/services.css`, `assets/css/icons.css`, etc.
  - JS: `assets/js/script.js`, `assets/js/cookie-consent.js`, `assets/js/hero-shader.js`.
  - Images: `assets/images/**`, including Real_Estate and hero background assets.

The HTML files share a common header and footer structure. The Estate Agents page reuses the shared header, nav, cookie banner, and parallax patterns.

---

## Setup commands

You generally do **not** need to run any build or dev server for simple HTML/CSS/JS edits, but if you need to build or verify styles:

- Install dependencies (if not already installed):

  - `npm install`

- Build CSS (if working on build-time CSS pipeline):

  - `npm run build`  
    or, if defined separately, `npm run build:css`

- Run a simple static server for manual validation (when allowed by the environment):

  - `python -m http.server 4173`  
    or `npx http-server .`  

  Then open:
  - `http://localhost:4173/index.html`
  - `http://localhost:4173/niches/estate-agents.html`

There are no automated tests configured; validation is primarily manual and visual.

---

## Code style and conventions

### HTML

- Use the existing HTML structure and semantics as a guide.
- Avoid introducing new frameworks or build steps.
- When adjusting shared components (header, footer, cookie banner):
  - Modify **shared CSS/JS**, not copy-pasted markup in individual pages.
  - Keep markup changes minimal and backwards-compatible.

### CSS

- Prefer existing utilities and patterns:
  - `.section`, `.compact-section`, `.bg-lines`, `.bg-circuit`, `.container`, `.service-row`, `.neon-card`, `.value-card`, `.faq-section`, etc.
- When creating new rules for the Estate Agents page:
  - Scope them under `body.page-estate-agents` to avoid affecting other pages.
  - Prefer small adjustments (padding/margin, background, alignment) over large layout changes.
- Keep styles DRY:
  - Avoid copy-pasting large blocks of CSS.
  - If you need a new reusable style, define a new class and apply it where needed.

### JavaScript

- All behavior is plain JS loaded from `assets/js/*.js`.
- Shared responsibilities:
  - `script.js`: enhanced nav, overlays, header behavior, parallax, stats counters.
  - `cookie-consent.js`: cookie banner logic (localStorage + cookie).
  - `hero-shader.js`: hero canvas effects.
- When fixing bugs:
  - Prefer small, targeted changes.
  - Avoid introducing new dependencies or bundlers.
  - Keep logic readable and well-commented where behavior is subtle (e.g. path handling for nested pages).

---

## Estate Agents page: focus and structure

The Estate Agents page lives at `niches/estate-agents.html` and is the primary focus of the current multi-step work.

Key characteristics:

- The `<body>` has `class="page-estate-agents"`, which should be used to scope page-specific styling and behavior.
- It reuses:
  - The shared header and nav.
  - The cookie banner markup.
  - Parallax sections with `.section bg-lines` / `.bg-circuit` and `data-parallax-theme="book"`.
- Key sections by heading include:
  - “Where deals leak away”
  - “The 'Never Miss a Viewing' pack”
  - “Show the numbers, not just promises”
  - “The branch experience after launch”
  - “Plug, personalise, launch”
  - “Safe, compliant, and fully supported”
  - “Pricing”
  - “Estate Agent Automation FAQs”
- It uses the **Real_Estate** images in `assets/images/socialmedia/`:
  - `Real_Estate_1.jpeg`, `Real_Estate_2.jpeg`, `Real_Estate_3.jpeg`
  - Mobile variants: `Real_Estate_1_Mobile.jpeg`, `Real_Estate_2_Mobile.jpeg`, `Real_Estate_3_Mobile.jpeg`

When working on the Estate Agents page, **do not** modify unrelated pages or redesign the site. Only fix the explicit issues described in `PLANS.md` and the ExecPlan.

---

## Planning with PLANS.md and ExecPlans

For multi-step work (like the Estate Agents bugfix/polish effort), this repo uses a planning pattern based on ExecPlans.

- `PLANS.md` (repo root):
  - Describes how ExecPlans are used in this repository.
  - Lists the currently active ExecPlan(s), including:
    - `ExecPlan.estate-agents-page-fixes.md`.
- `ExecPlan.estate-agents-page-fixes.md` (repo root):
  - A detailed, self-contained specification and plan for:
    - Cookie banner behavior on the Estate Agents page.
    - Section spacing adjustments.
    - Card background opacity consistency.
    - Desktop and mobile Services nav styling.
    - Background imagery and parallax behavior for the Estate Agents page.
    - Counter behavior and percentage display in “Show the numbers, not just promises”.
    - Responsive Real_Estate image handling.

**When working on multi-step Estate Agents tasks:**

1. Read `AGENTS.md` (this file).
2. Read `PLANS.md`.
3. Read `ExecPlan.estate-agents-page-fixes.md`.
4. Follow the ExecPlan’s “Plan of Work” and “Concrete Steps” sections in order.
5. Use the ExecPlan’s “Validation and Acceptance” criteria to decide when you are finished.

Only update `PLANS.md` or the ExecPlan itself if a future task explicitly asks you to; otherwise treat them as fixed specifications.

---

## Current workstreams for Codex (Estate Agents)

For the Estate Agents page, Codex should **only** make changes relevant to the following workstreams (detailed in the ExecPlan):

1. Cookie consent behavior on the Estate Agents page and consistency with other pages.
2. Vertical spacing between:
   - “The branch experience after launch” and “Plug, personalise, launch”.
   - “Pricing” and “FAQs”.
   - “The 'Never Miss a Viewing' pack” and “Show the numbers, not just promises”.
3. Card background opacity consistency across all Estate Agents cards.
4. Desktop nav “Services” dropdown button vertical alignment relative to other menu buttons.
5. Mobile overlay “Services” pill styling (font, color, size, center alignment) matching other pills.
6. Mobile background imagery for Estate Agents (ensuring `book-hero-calendly-mobile-2025@*x.webp` is used and parallax works).
7. Stats counter behavior and percentage display for “Show the numbers, not just promises” (disable animation, show `%`).
8. Responsive Real_Estate imagery (mobile vs desktop).

Do **not**:

- Re-architect navigation or layout beyond what is strictly necessary to fix these issues.
- Change copy, colors, or typography globally.
- Introduce new libraries or tooling.

---

## Codex configuration notes

Codex configuration is controlled outside this repository (e.g. via `~/.codex/config.toml` or Codex Cloud settings). For this project, we expect:

- **Model:**
  - Prefer `gpt-5.1-codex-max`.
- **Reasoning effort:**
  - Prefer `model_reasoning_effort = "xhigh"` to handle multi-step debugging and layout reasoning.
- **Project doc discovery:**
  - `AGENTS.md` and `PLANS.md` should be discoverable as project guidance.
  - If `project_doc_fallback_filenames` is set in config, including `["AGENTS.md", "PLANS.md"]` is recommended.
- **Internet access (if enabled):**
  - Use web access only to:
    - Read official documentation (e.g. `developers.openai.com`, `cookbook.openai.com`, `agents.md`).
    - Look up CSS/JS behavior on docs sites (e.g. MDN).
  - Do not fetch arbitrary external resources from the network in the course of implementing these fixes.

Codex should not modify `.codex/config.toml` as part of this work unless the user explicitly asks it to.

---

## Scope boundaries and file safety

When working in this repo:

- **Never edit the following files unless explicitly asked:**
  - `AGENTS.md`
  - `PLANS.md`
  - `ExecPlan.estate-agents-page-fixes.md`
- **Limit changes** to:
  - `niches/estate-agents.html`
  - Shared CSS/JS files that directly affect:
    - Cookie behavior (`assets/js/cookie-consent.js`, `.cookie-banner` CSS).
    - Nav and services overlay (`assets/js/script.js`, nav styles in `assets/css/styles.css` / `assets/css/custom*.css`).
    - Estate-specific spacing and card backgrounds (`assets/css/custom-styles.css`, `assets/css/custom.css`, inline Estate CSS).
    - Parallax backgrounds on mobile (`assets/js/script.js`, `assets/css/mobile.css`, `assets/css/parallax-fix.css`).
- **Be conservative with refactors:**
  - Prefer local, scoped changes over global refactors.
  - If you must touch a shared component, verify its behavior across all pages that use it.

---

## Testing and validation expectations

Because there is no automated test suite:

- For significant changes:
  - Describe manual validation steps in your final answer:
    - Which pages to load.
    - Which viewport sizes to test.
    - What behaviors to look for.
- Run any relevant build commands if you change CSS/JS in a way that might affect build pipelines.
- Keep diffs small and logically grouped so a human reviewer can validate them quickly.

Treat this AGENTS file as a living document for agents; only update it if the human user specifically requests changes or new sections.
