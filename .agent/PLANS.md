# Codex Execution Plans (ExecPlans) for this repo

This document describes how to write and maintain execution plans (“ExecPlans”) for the Silverstone marketing site. An ExecPlan is a self-contained design-and-implementation document that a coding agent (or human) can follow to deliver a working feature or change.

Treat the reader as a complete beginner to this repository: they have only the current working tree and the ExecPlan you provide. There is no memory of prior plans or prompts.

ExecPlans are especially important for complex front-end work such as the Estate Agents / Real Estate niche landing page, where copy, layout, and visual fidelity must match both a written spec and the existing design system.

## Where ExecPlans live

- Canonical planning files:
  - `.agent/PLANS.md` — this file (global guidance).
  - `.agent/AGENTS.md` — when and how to use ExecPlans.
- Individual ExecPlans:
  - ExecPlans live under `.agent/plans/` as Markdown files.
  - For the Estate Agents / Real Estate niche page, the canonical ExecPlan path is:
    - `.agent/plans/real-estate-landing-page.md`
- Other ad-hoc ExecPlans may appear at the repo root (for example `ExecPlan-*.md`), but the **authoritative pattern** for new work is:
  - Global guidance in `.agent/PLANS.md` and `.agent/AGENTS.md`.
  - Task-specific plans in `.agent/plans/<short-slug>.md`.

When you are asked to “follow the Real Estate ExecPlan” or to work on the Estate Agents / Real Estate niche page, you must read `.agent/plans/real-estate-landing-page.md` and this `.agent/PLANS.md` file in full before editing any code.

## How to use ExecPlans and PLANS.md

When authoring an ExecPlan:

- Re-read this PLANS.md **end-to-end** before you start.
- Assume the reader has only:
  - The current repository checkout.
  - The single ExecPlan file you are writing.
- Be thorough when reading source material:
  - Inspect the repository structure (HTML pages, CSS, JS).
  - Study existing design patterns (hero, cards, stats, FAQs, footer).
  - For the Real Estate niche landing page, incorporate the full design and copy spec from the “Estate Agents – Niche Landing Page Content” document; do not treat that spec as optional.
- Start from the section skeleton in “Skeleton of a Good ExecPlan” below and customize it for this repo and task.
- Do **not** point the reader to external blogs or docs. If non-obvious knowledge is required, paraphrase it into the ExecPlan itself.

When implementing an ExecPlan:

- Do not ask the user for “next steps”; follow the plan.
- Keep the living sections up to date:
  - `Progress`
  - `Surprises & Discoveries`
  - `Decision Log`
  - `Outcomes & Retrospective`
- Resolve ambiguities autonomously and record your decisions in the `Decision Log`.
- Treat ExecPlans as **living documents**: revise them whenever you change direction, uncover new constraints, or finish a milestone.

## Non-negotiable requirements for ExecPlans

Every ExecPlan for this repo must:

- Be fully self-contained:
  - It must contain all knowledge and instructions needed for a novice to implement the feature end-to-end.
- Be a living document:
  - The four living sections (Progress, Surprises & Discoveries, Decision Log, Outcomes & Retrospective) are required and must reflect reality as work proceeds.
- Produce a demonstrably working behavior:
  - Not just code changes, but a feature that can be validated in a browser by following instructions in the plan.
- Define all non-obvious terms:
  - Especially for design and layout: cards, hero shaders, parallax sections, stats strips, FAQ accordions, etc.
- Explain things in plain prose rather than dense checklists, except in the `Progress` section where checkboxes are required.

## Repository orientation for plan authors

Summarize this context inside each ExecPlan in your own words; do not rely on the reader having PLANS.md open.

High-level structure:

- Root HTML pages:
  - `index.html` — Home page (hero with shader canvas, Streamline/Optimize/Succeed cards, Proof in Numbers stats strip, FAQs, CTA, and shared footer).
  - `about.html` — About page (hero, mission content, “Our Values” cards, stats, shared footer).
  - `services.html` — Services overview (service rows with image + neon card, each with bullet lists).
  - `book.html` — Booking/automation audit page (hero with amber/gold shader variant, parallax “book” section, bullet lists, CTA).
  - `contact.html` — Contact form and details.
  - `privacy-policy.html` — Policy content with shared header and footer.
- Assets:
  - CSS under `assets/css/`:
    - `styles.css` — global layout, typography, card styles, header/footer, sections.
    - `hero-base.css` — hero layout, shader content, title-band structure.
    - `mobile.css` — responsive overrides.
    - `icons.css` — local Font Awesome integration and icon mappings.
    - Additional CSS (e.g. marquee, services, parallax) may define more utility classes.
  - JS under `assets/js/`:
    - `script.js` — navigation and minimizing header behavior, parallax background management, stats counter animation, mobile menu.
    - `hero-shader.js` — WebGL shader for hero background with named color variants (default, blue, green, amber, etc.).
    - Other scripts (neural grid, marquee, gallery) are secondary.
  - Fonts & icons:
    - Local Font Awesome webfonts are in `assets/webfonts/`.
    - Icon CSS is in `assets/css/icons.css`.
  - Images:
    - Hero/parallax backgrounds under `assets/images/internet` and `assets/images/internet/mobile`.
    - Social/marketing images, including Real_Estate_1/2/3 in `assets/images/socialmedia`.

Shared components:

- **Navigation / minimizing header**
  - Implemented as `<header class="site-header">` plus a nav overlay and a “header indicator” bar controlled by `assets/js/script.js`.
  - The header hides on scroll, and a slim “Menu” indicator appears at the top; hovering/tapping expands the header.
  - All pages must reuse this header markup and script for behavior to stay consistent.

- **Hero section**
  - Uses `<section class="hero title-band">` with:
    - `<div class="hero-media"><canvas id="hero-shader-canvas" ...></canvas></div>`
    - `<div class="content">` containing H1, copy, CTAs, and optional bullet list.
  - The hero shader color variant is controlled by `data-variant` on the canvas (for example `data-variant="amber"` on `book.html`).

- **Parallax sections**
  - Sections with background imagery use `.parallax-section` and `data-parallax-theme` attributes.
  - `script.js` maps theme names (e.g. `lines`, `mesh`, `circuit`, `book`) to background colors and `image-set` definitions, including:
    - `book` and some other themes using `assets/images/internet/mobile/book-hero-calendly-mobile-2025@*x.webp`.

- **Neon cards and service rows**
  - Service rows (on `services.html`) use `<div class="service-row">` with:
    - A `.service-image` div containing an `<img>` (with a neon “floating” feel).
    - A `.service-content.neon-card` div containing a card title, copy, `<ul>` with `<li><i class="fa-solid fa-..."></i> …</li>` bullet items, and a button.
  - Orientation (image left vs right) alternates between rows via CSS and DOM order.
  - Neon cards also appear in other contexts: stats tiles, feature cards, values cards, FAQs.

- **Values cards**
  - In `about.html`, the “Our Values” section uses `<div class="values">` containing `<div class="value-card neon-card">` cards:
    - Each card has a top-of-card icon `<i class="fa-solid fa-..."></i>`, a heading (`<h4>`), and a body paragraph.

- **Stats strip (Proof in Numbers)**
  - On `index.html` and `about.html`, stats strips use:
    - `<div class="stats">` wrapper.
    - One or more `<div class="neon-card stat">` cards with:
      - `<div class="number" data-target="..." [data-plus="+"]>0</div>`
      - `<div class="label">…</div>`
  - `script.js` uses `data-target` to animate the numbers when the section scrolls into view.

- **FAQs**
  - On `index.html`, FAQs are implemented as `<details class="neon-card faq-item">` with `<summary>` and `<p>` content.
  - `styles.css` and `mobile.css` apply custom plus/minus and animation behavior.

- **Footer**
  - All main pages share `<footer class="site-footer">` with:
    - A logo and tagline block.
    - Quick links list.
    - Contact info (location, email) with icons.
    - Social icons/links.

ExecPlans must explicitly reference these components by file and class name when instructing changes.

## Bullet icon rules (for all ExecPlans in this repo)

Bullet icons are especially fragile and must follow strict rules:

1. **Use only locally defined fa-solid icons**

   - All bullet icons must be `fa-solid` icons defined in `assets/css/icons.css` and backed by the local `assets/webfonts` files.
   - Do **not** rely on external CDNs or icon sets.
   - In markup, bullets should look like the existing patterns:

     - Example pattern:
       - `<ul>`
         - `<li><i class="fa-solid fa-chart-line"></i> Your bullet copy here.</li>`
       - `</ul>`

2. **Every bullet gets an icon**

   - Every `<li>` that is visually part of a bullet list must have its own `<i class="fa-solid fa-..."></i>` element.
   - No list item may render without an icon.

3. **Each bullet in a list uses a different icon**

   - Within a single `<ul>`, each `<li>` must use a different icon name.
   - It is acceptable to reuse icons in other lists; the uniqueness constraint applies only within each list.

4. **Icon inventory**

   - At the time of writing, `assets/css/icons.css` maps the following solid icons (from `fa-solid-900`) and these are safe to use:

     - `fa-solid fa-arrows-rotate`
     - `fa-solid fa-bell`
     - `fa-solid fa-bolt`
     - `fa-solid fa-calculator`
     - `fa-solid fa-calendar-check`
     - `fa-solid fa-chart-bar`
     - `fa-solid fa-chart-line`
     - `fa-solid fa-chart-pie`
     - `fa-solid fa-check-circle`
     - `fa-solid fa-clock`
     - `fa-solid fa-cloud`
     - `fa-solid fa-code`
     - `fa-solid fa-comments`
     - `fa-solid fa-diagram-project`
     - `fa-solid fa-ear-listen`
     - `fa-solid fa-envelope`
     - `fa-solid fa-file-invoice-dollar`
     - `fa-solid fa-file-lines`
     - `fa-solid fa-flask`
     - `fa-solid fa-gauge-high`
     - `fa-solid fa-gears`
     - `fa-solid fa-info-circle`
     - `fa-solid fa-layer-group`
     - `fa-solid fa-lightbulb`
     - `fa-solid fa-location-dot`
     - `fa-solid fa-lock`
     - `fa-solid fa-network-wired`
     - `fa-solid fa-plug`
     - `fa-solid fa-robot`
     - `fa-solid fa-rocket`
     - `fa-solid fa-shield-halved`
     - `fa-solid fa-tags`
     - `fa-solid fa-users`

   - If you need additional icons, you **must**:
     - Update `assets/css/icons.css` with the new mapping and ensure the glyph exists in `fa-solid-900`.
     - Document this as a design decision in your ExecPlan.

5. **Grounding in current HTML**

   - Base bullet list markup on the patterns in:
     - `services.html` service rows.
     - `index.html` hero bullets and other lists.
     - `book.html` bullet lists in the discovery call section.
   - Do not introduce alternative bullet styles unless the spec explicitly requires it and you document the change.

ExecPlans for UI work must restate these bullet rules and, when the task includes new bullet lists, must provide an explicit icon-to-bullet mapping.

## Additional priority constraints for this repo

For all ExecPlans that touch global layout, hero sections, cards, or niche landing pages (especially the Estate Agents / Real Estate page), the following are **non-negotiable** and must be spelled out in the plan:

- **Minimizing menu bar**

  - The header and minimizing/sticky behavior must remain identical to existing pages (`index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`).
  - Do not alter the header markup structure or break `assets/js/script.js` behavior.
  - Any new page must reuse the same `<header>` markup and scripts.

- **Hero shader & hero integration**

  - The hero section must use the existing `<section class="hero title-band">` pattern with `<canvas id="hero-shader-canvas">`.
  - The shader variant must be chosen via `data-variant` on the canvas (for example `data-variant="amber"` for a gold/amber look).
  - The hero must be perfectly aligned with the minimizing menu bar (no z-index issues, overlapping, or gaps).

- **Background image and parallax**

  - The only background image to use for full-width backgrounds on the Estate Agents page is the `book-hero-calendly-mobile-2025@*x.webp` family from `assets/images/internet/mobile/`.
  - Parallax sections on this page should use a `data-parallax-theme` that maps to that image (for example `book` or `lines` as defined in `script.js`), matching the behavior seen on `index.html` and `book.html`.
  - Content should scroll smoothly over this background with the same slight overlay used elsewhere; do not introduce new background layers.

- **Proof in Numbers strip (percentages, no counters)**

  - Stats cards must display static percentages/values as plain text.
  - The animated counter effect from `script.js` should **not** run for the Estate Agents proof-in-numbers section:
    - ExecPlans must describe how to disable counting for that specific stats block (for example, via a data attribute or class filter) without breaking counters on other pages.

- **Card backgrounds and premium look**

  - Cards used in:
    - Niche pains (3.2)
    - Bundle overview (3.3)
    - Proof in Numbers (3.4)
    - Outcomes & benefits (3.5)
    - How it works (3.6)
    - Risk & reassurance (3.7)
  - Must reuse the dark, semi-transparent neon card style:
    - Visually similar to the Streamline/Optimize/Succeed cards and stats cards on `index.html`.
    - Employing the `.neon-card` class with existing border radius, glow, and background.

- **Images with neon floating borders**

  - Images adjacent to cards must use the existing “floating neon” treatment:
    - Either by wrapping them in a `.neon-card` container.
    - Or by using the established `.service-image` + `.service-content.neon-card` layout from `services.html`.
  - The Real_Estate_1/2/3 images from `assets/images/socialmedia` must look premium and integrated with the current visual language.

- **FAQs identically styled**

  - The FAQ section on any new page must use the same `<details class="neon-card faq-item">` structure as `index.html`.
  - Visual and interactive behavior (plus/minus, transitions, typography, spacing) must match.

- **Footer logo and layout**

  - Every page must include `<footer class="site-footer">` identical to `index.html`.
  - The logo must load from the same path and use the same class names.
  - Links, contact info, and social blocks must follow the same structure, with only content variations where necessary.

- **Top-of-card icons for How It Works and Proof in Numbers**

  - Cards in:
    - How it works (3.6) — 4 steps.
    - Proof in Numbers (3.4) — 4 stats.
  - Must have a single icon at the top of each card:
    - Using `fa-solid` icons from the local set.
    - Styled identically to icons on `about.html` value cards and the Streamline/Optimize/Succeed feature cards.

- **Single background image, consistent overlay**

  - For the Estate Agents page, do not introduce new hero background images or parallax themes.
  - Reuse the existing `book-hero-calendly-mobile-2025@*x.webp` background and associated overlay so the page feels like part of the same site.

ExecPlans must explicitly mention how each of these constraints is satisfied in the implementation plan and in the validation checklist.

## Skeleton of a good ExecPlan (for this repo)

Every ExecPlan in `.agent/plans/` should follow this structure (without code fences inside the .md file):

- `# <Short, action-oriented description>`

  A title such as “Build the Estate Agents niche landing page”.

- Introductory note:

  - “This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.”
  - Reference this PLANS.md file: “This plan must be maintained in accordance with `.agent/PLANS.md` at the repository root.”

- `## Purpose / Big Picture`

  Explain why the change matters from a user’s point of view, what someone can do after implementation, and where they see it working (which URL, which section).

- `## Progress`

  - Use a checkbox list to track actual work.
  - Include timestamps in ISO format when updating (for example `(2025-12-05T14:32Z)`).
  - Every time work is paused or resumed, update this section.

- `## Surprises & Discoveries`

  - Record unexpected behavior, bugs, design constraints, or notable learnings.
  - Include short evidence snippets (for example: “Observed header overlap in Chrome at 1024px; fixed by …”).

- `## Decision Log`

  - Capture each deliberate decision, including:
    - Decision text.
    - Rationale.
    - Date/author or agent context.
  - Use this to record choices about file locations, new classes, icon mappings, etc.

- `## Outcomes & Retrospective`

  - At major milestones or completion, summarize what was achieved, what remains, and lessons learned.
  - Compare reality against the original Purpose.

- `## Context and Orientation`

  - Describe the current state relevant to the task as if the reader has never seen this repo.
  - Name key files and components with full paths.
  - For Real Estate work, include how the template’s sections map onto the site’s components.

- `## Plan of Work`

  - Narrative description of the sequence of edits and additions you will make.
  - Name specific files and elements you intend to touch and how you intend to reuse existing design patterns.

- `## Concrete Steps`

  - Concrete, numbered steps with commands and file edits.
  - Describe what to run (if anything), and how to open pages in a browser for manual verification.
  - For this static site, these steps typically include:
    - Editing HTML, CSS, and JS files via `apply_patch`.
    - Running `npm install` (once) if needed and `npm run build:css` for CSS builds when required.
    - Opening HTML files in a browser (file:// or a simple static server).

- `## Validation and Acceptance`

  - Describe exactly how to verify the change:
    - Which page to open.
    - Which sections to check.
    - What the user should see and interact with.
  - Include visual fidelity checks, responsive checks, and behavior checks (nav, hero shader, parallax, FAQs, counters).

- `## Idempotence and Recovery`

  - Explain how to safely re-run the plan or re-apply patches without breaking the site.
  - Note any risky steps and their rollback strategy.

- `## Artifacts and Notes`

  - Include only the most important snippets or mini-diffs as indented blocks (no nested fenced code).
  - Use this for subtle behaviors, example markup, or reference snippets.

- `## Interfaces and Dependencies`

  - Enumerate any CSS classes, JS functions, and shared components you rely on.
  - For example:
    - Header behavior in `assets/js/script.js`.
    - Hero shader in `assets/js/hero-shader.js`.
    - Icon definitions in `assets/css/icons.css`.
    - Parallax themes in `assets/js/script.js`.

## Additional guidance for Real Estate / Estate Agents ExecPlans

Any ExecPlan that targets the Estate Agents / Real Estate niche landing page must:

- Explicitly reference the “Estate Agents – Niche Landing Page Content” spec and treat it as normative for:
  - Copy (especially text labeled “FOLLOW ACCURATELY”).
  - Section ordering and naming (3.1–3.12).
  - URL slug and metadata.
- Map each spec section (3.1–3.7, 3.9–3.12) to an implementation plan using:
  - The hero title-band pattern.
  - Service rows with neon cards.
  - Stats strips.
  - Value-card-like rows for how-it-works and risk-reversal.
  - The existing FAQ accordion and footer.
- Encode all bullet icon requirements and additional visual constraints described earlier.
- Include a validation checklist that explicitly checks:
  - Bullet icons present and unique per list.
  - Header and hero behavior identical to existing pages.
  - Proof in Numbers section uses percentages with **no counter animation**.
  - Dark neon card backgrounds and neon image borders.
  - FAQ styling and behavior matching `index.html`.
  - Footer logo and layout matching other pages.
  - Background image and parallax behavior consistent with the rest of the site.

If you follow the guidance in this PLANS.md, a single, stateless agent—or a human developer unfamiliar with the repo—can read an ExecPlan in `.agent/plans/` and produce a working, on-brand feature without further prompts.
