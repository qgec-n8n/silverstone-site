# ExecPlans

This repository uses “ExecPlans” as self-contained design-and-implementation documents for complex or multi-step work. ExecPlans are described in detail in `.agent/PLANS.md` and stored under `.agent/plans/`.

Codex (and human contributors) should treat an ExecPlan as the single source of truth for how to design, implement, and validate a feature, especially when the work spans multiple files or has detailed UX requirements.


## When to use an ExecPlan

Use an ExecPlan when:

- You are implementing a new user-facing page or feature that touches multiple files, such as:
  - A new niche landing page (e.g. the Estate Agents / Real Estate page).
  - A significant redesign of an existing section (hero, services, CTA, etc.).
  - Changes that affect shared components such as the header, footer, hero shader, or parallax system.
- You are performing a non-trivial refactor across HTML, CSS, and JS.
- You are unsure how many steps the work will take and need a written plan to keep track of progress.

You may **skip** an ExecPlan when:

- The change is small, localised, and obviously safe, for example:
  - Updating a single paragraph of copy on one page.
  - Swapping out an image while keeping the same markup and layout.
  - Tuning a single CSS value in one file, with no structural implications.

When in doubt, prefer creating or updating an ExecPlan. ExecPlans make it easier for future contributors (and Codex) to understand why changes were made and how to extend them.


## Where ExecPlans live

- Global planning rules: `.agent/PLANS.md`
- This file: `.agent/AGENTS.md`
- Individual ExecPlans: `.agent/plans/*.md`

For the Estate Agents / Real Estate niche landing page, the canonical ExecPlan path is:

- `.agent/plans/real-estate-landing-page.md`

If a user asks you to “follow the Real Estate ExecPlan” or “implement the Estate Agents niche page”, you should:

1. Read `.agent/PLANS.md` in full.
2. Read `.agent/plans/real-estate-landing-page.md` in full.
3. Execute the ExecPlan step by step, updating its living sections as you work.


## How Codex should use ExecPlans

When you are launched to work on this repository:

1. Check whether the requested task is simple or complex.
   - If it is simple and clearly localised, you may work directly.
   - If it is complex (multi-file, multi-step, or user-facing), use an ExecPlan.
2. For complex work:
   - If an ExecPlan already exists for the feature, read it end-to-end and follow it.
   - If no ExecPlan exists yet, create a new one in `.agent/plans/` following the structure and rules in `.agent/PLANS.md`, then implement it.
3. While implementing:
   - Keep the ExecPlan’s `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` sections accurate and up to date.
   - Make design decisions explicit in the `Decision Log` so future contributors understand them.
4. At completion:
   - Ensure the ExecPlan is still self-contained and reflects what was actually implemented.
   - Note any remaining follow-up work in `Outcomes & Retrospective`.


## Special case: Estate Agents / Real Estate niche landing page

The Estate Agents / Real Estate niche landing page is the canonical example of when to use an ExecPlan in this repo.

When working on this page:

- Use `.agent/plans/real-estate-landing-page.md` as the authoritative specification.
- Treat the copy and section ordering from the Real Estate Niche Page Template as **fixed** unless the ExecPlan explicitly notes adjustments.
- Reuse existing components:
  - Hero shader layout (`hero title-band`, `#hero-shader-canvas` with a `data-variant`).
  - Neon service cards (`.service-row`, `.service-image`, `.service-content.neon-card`).
  - Values cards (`.values .value-card.neon-card`).
  - Stats strip (`.stats` with `.neon-card.stat`).
  - FAQ structure (`<details class="neon-card faq-item">`).
  - CTA and footer blocks.
- Respect the parallax/background rules:
  - Use `data-parallax-theme="book"` so that `book-hero-calendly-mobile-2025@*x.webp` is the only background image on this niche page.


## Bullet list and icon rules

For any UI work that modifies or adds bullet lists (especially on niche pages such as Estate Agents), Codex MUST:

- Use icon bullets rather than plain browser bullets.
- Use the site’s local webfonts and icon definitions:
  - Webfonts: `assets/webfonts/` (Font Awesome).
  - Icon CSS: `assets/css/icons.css` (defines `.fa`, `.fa-solid`, `.fa-brands` and specific icons).
- Copy bullet patterns from existing pages:
  - `services.html` service rows: `<li><i class="fa-solid fa-check-circle"></i> …</li>`
  - `index.html` hero bullets: `<ul class="hero-bullets"><li><i class="fa-solid …"></i><span>…</span></li>…</ul>`
  - `book.html` discovery call bullets: similar `<li><i class="fa-solid …"></i>…</li>` structure.

The strict rule is:

- **No list item on the Estate Agents page (or similar niche pages) may be left without an icon.**  
  For every `<li>` that appears as a bullet, either:
  - Include an explicit `<i class="fa-solid …"></i>` icon at the start of the `<li>`, using icon names defined in `assets/css/icons.css`, or
  - Use a helper such as an `icon-list` class that injects an icon for every list item via CSS.

If you are unsure whether an icon exists, check `assets/css/icons.css` for the `fa-solid` mapping before using it.


## Shorthand for users

When users are prompting Codex, they can use the following shorthand:

- “ExecPlan” — refers to the ExecPlan mechanism described in `.agent/PLANS.md`.
- “Real Estate ExecPlan” or “Estate Agents ExecPlan” — refers to `.agent/plans/real-estate-landing-page.md`.

Example prompts:

- “Use the Real Estate ExecPlan to implement the Estate Agents niche landing page.”
- “Update the Estate Agents ExecPlan to reflect the changes we just made, then finish the remaining steps.”
