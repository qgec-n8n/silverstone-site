# ExecPlans

This repo uses “ExecPlans” as self-contained design-and-implementation documents for complex or multi-step work. ExecPlans are defined and governed by `.agent/PLANS.md`.

ExecPlans help Codex (and human contributors) deliver large, visually precise features such as niche landing pages without constant user guidance. They ensure that:

- The plan is self-contained and novice-friendly.
- Design system rules (cards, hero, bullets, icons, header, footer) are followed consistently.
- Progress and decisions are recorded as the work unfolds.

## Where planning files live

- Global guidance:
  - `.agent/PLANS.md` — how to write and use ExecPlans in this repo.
  - `.agent/AGENTS.md` — this file, explaining when to use ExecPlans.
- Task-specific ExecPlans:
  - `.agent/plans/` — directory containing one ExecPlan per complex feature.
  - The canonical ExecPlan for the Estate Agents / Real Estate niche page is:
    - `.agent/plans/real-estate-landing-page.md`

## When to use an ExecPlan

You MUST use an ExecPlan when:

- Implementing or significantly modifying a user-facing feature that spans multiple files.
- Creating new landing pages or niche pages (e.g. “Estate Agents / Real Estate”).
- Making changes that affect:
  - Shared layout or components (header, hero, parallax sections, footer).
  - Shared scripts (navigation, stats counters, hero shader).
  - Design system elements (neon cards, value cards, stats strips, FAQ blocks).

You MAY skip an ExecPlan (and make direct edits) only when:

- The change is small, localized, and clearly mirrors an existing pattern in a single file.
- The user explicitly asks for a minor tweak (for example, changing a number in a stat card without altering layout).

When in doubt, default to using an ExecPlan.

## How Codex should use ExecPlans

When you are started on a non-trivial task:

1. **Locate and read the relevant planning files**

   - Always read `.agent/PLANS.md` first.
   - Then read the specific ExecPlan for the task, if it exists (for example `.agent/plans/real-estate-landing-page.md` for the Estate Agents page).

2. **Treat the ExecPlan as the source of truth**

   - If the ExecPlan and existing code disagree, assume the ExecPlan describes the desired future state.
   - Update the plan if you discover new constraints or make significant design decisions, keeping the living sections current.

3. **Keep ExecPlans up to date**

   - Update the `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` sections as you work.
   - When you pause or complete a block of work, record what was done and what remains.

4. **Work from the ExecPlan end-to-end**

   - Use repository tools (`shell`, `apply_patch`, file search) to carry out the plan.
   - Avoid asking the user for “what next?”; instead, follow the ExecPlan’s sequence.

5. **For small, localized tasks**

   - You may skip creating a new ExecPlan if the change is trivial and touches only one file, but you should still respect the design system and safety practices described in existing ExecPlans.

## Special rules for the Estate Agents / Real Estate niche page

The Real Estate / Estate Agents page is a flagship example of how ExecPlans should be used. When asked to work on this page:

- Always read `.agent/PLANS.md` and `.agent/plans/real-estate-landing-page.md` before editing anything.
- Follow the section mapping from the spec (3.1–3.12) and re-use site components as described in the ExecPlan.
- Treat the copy in the Estate Agents Niche template as normative, especially where labeled “FOLLOW ACCURATELY”.

## Bullet lists and icons (high-priority constraint)

For any UI work that includes bullet lists — especially on the Estate Agents page — you must follow all of these rules:

1. **Use only local `fa-solid` icons**

   - Bullet icons must come from the local Font Awesome setup:
     - Fonts: `assets/webfonts/fa-solid-900.*`
     - Mappings: `assets/css/icons.css`
   - Do not rely on remote Font Awesome or new icon sets.

2. **Every bullet has an icon**

   - Every `<li>` that appears visually as part of a bullet list must include an `<i class="fa-solid fa-…"></i>` icon.
   - No bullet is allowed to render with the browser’s default bullet or without an icon.

3. **Icons must be unique within each list**

   - Within a single `<ul>`, each `<li>` must use a different `fa-solid` icon.
   - Icons can be reused in **other** lists; the uniqueness requirement applies per list.

4. **Only use icons defined in `icons.css`**

   - Before choosing an icon, confirm that `assets/css/icons.css` defines a mapping for that icon (for example `.fa-solid.fa-chart-line::before`).
   - The currently known safe `fa-solid` icons include:

     - `arrows-rotate`, `bell`, `bolt`, `calculator`, `calendar-check`, `chart-bar`, `chart-line`, `chart-pie`, `check-circle`, `clock`, `cloud`, `code`, `comments`, `diagram-project`, `ear-listen`, `envelope`, `file-invoice-dollar`, `file-lines`, `flask`, `gauge-high`, `gears`, `info-circle`, `layer-group`, `lightbulb`, `location-dot`, `lock`, `network-wired`, `plug`, `robot`, `rocket`, `shield-halved`, `tags`, `users`.

   - If you introduce a new icon name, you must update `assets/css/icons.css` and document the change in the relevant ExecPlan.

5. **Match existing markup patterns**

   - Follow the bullet markup seen in:

     - `services.html` service rows.
     - The hero bullets in `index.html`.
     - Bullet lists in `book.html`.

   - Do not create alternative bullet systems (no plain `<ul>` without icons, no experimental bullet styles) on the Estate Agents page.

ExecPlans that introduce new bullet lists must include explicit icon-to-bullet mappings and verify that the icons are defined in `assets/css/icons.css`.

## Additional priority constraints for UI work

For all complex UI tasks (including the Estate Agents page), Codex must enforce the following non-negotiable constraints:

- **Minimizing menu bar**

  - The header and minimizing/sticky nav must remain fully functional and visually identical to `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, and `privacy-policy.html`.
  - Do not break `assets/js/script.js` logic for hiding/showing the header and the `#header-indicator` bar.

- **Hero shader & hero integration**

  - The hero must use `<section class="hero title-band">` with `<canvas id="hero-shader-canvas">`.
  - The hero shader’s color variant is controlled solely via `data-variant` on the canvas (e.g. `data-variant="amber"`).
  - The hero must line up correctly with the header and parallax background, without overlapping or misaligned content.

- **Proof in Numbers percentages (no counter effect)**

  - Stats cards for the Estate Agents Proof in Numbers strip must show percentages and values as static text.
  - The animated counters in `assets/js/script.js` must not change these values:
    - Implement a clear opt-out (for example, a `data-counter="off"` attribute) and filter stats sections accordingly.

- **Card backgrounds and premium look**

  - Use existing `.neon-card` styling for cards in niche pain, bundle overview, Proof in Numbers, outcomes/benefits, how-it-works, and risk/reassurance sections.
  - Cards should have the dark, premium appearance seen in the Streamline/Optimize/Succeed cards and stats cards on `index.html`.

- **Neon image borders**

  - Real Estate images (Real_Estate_1/2/3) must appear with a neon floating border, using existing card/image patterns from `services.html`.
  - It is acceptable to place images inside neon cards to achieve this effect.

- **FAQs identical to home page**

  - The FAQ section must use the same `<details class="neon-card faq-item">` pattern as `index.html` and match its styling and animation.
  - FAQ text for the Estate Agents page must come from Section 8 of the Estate Agents spec; do not invent new questions or answers unless the spec allows.

- **Footer logo and layout**

  - All pages must include the same `<footer class="site-footer">` as `index.html`.
  - The logo `assets/logo/silverstone-logo-cropped-whitebg-v2.png` must load correctly.
  - Layout, links, and social icons must match.

- **Single background image with slight overlay**

  - For the Estate Agents page, all sections using parallax backgrounds should rely on the `book-hero-calendly-mobile-2025@*x.webp` assets via the existing `PARALLAX_MAP` themes.
  - Do not introduce new full-screen background assets or drastically different overlays.

- **Top-of-card icons on How It Works and Proof in Numbers**

  - Cards in How It Works (3.6) and Proof in Numbers (3.4) must each have a single top-of-card icon, styled consistently with existing value cards on `about.html`.

ExecPlans must repeat these constraints explicitly and include checks in their Validation and Acceptance sections.

## Shorthand for requesting plans

When prompting Codex in this repository, humans can use these shorthand phrases:

- “Create an ExecPlan to build the Estate Agents / Real Estate niche landing page” — Codex should:
  - Read `.agent/PLANS.md`.
  - Create or update `.agent/plans/real-estate-landing-page.md` following the required ExecPlan structure.

- “Follow the Real Estate ExecPlan” — Codex should:
  - Read `.agent/PLANS.md` and `.agent/plans/real-estate-landing-page.md`.
  - Execute the plan step by step, updating `Progress` and other living sections as work proceeds.

- “Update the Real Estate ExecPlan with your progress” — Codex should:
  - Modify `.agent/plans/real-estate-landing-page.md` to reflect the current state of implementation.

By following AGENTS.md and PLANS.md, Codex can work autonomously and reliably on this repo, especially for visually demanding tasks like the Estate Agents niche landing page.
