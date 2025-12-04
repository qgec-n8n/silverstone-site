# ExecPlans for `silverstone-site`

ExecPlans are markdown files (for example `.agent/ExecPlan-silverstone-niches.md`) that describe what GPT‑5.1 Codex is doing, why, and how. They make multi‑step work on the `silverstone-site` repo understandable and resumable by both the human and future Codex sessions.

This document defines the required structure and expectations for all ExecPlans in this repository, with a strong emphasis on preserving the site’s premium visual design.

---

## When to create or update an ExecPlan

- **Create a new ExecPlan** when you start a non‑trivial piece of work (multi‑file, multi‑step, or spanning multiple prompts).
- **Reuse and update** an existing ExecPlan if a new prompt continues a previous stream of work.
- **Update the ExecPlan** whenever:
  - You complete a meaningful chunk of work.
  - You change direction or discover a new constraint.
  - You add or resolve TODO items.

ExecPlans should always reflect the current truth of the work, not an aspirational plan that has gone stale.

---

## Required sections in every ExecPlan

Each ExecPlan **must** contain at least the following top‑level headings. It may add more headings if helpful, but should avoid unnecessary complexity.

### 1. Context and Orientation

Explain, in a few short paragraphs:

- What problem or feature you are working on.
- Which part of the `silverstone-site` experience it affects (e.g. services hub, niche landing pages, navigation).
- Which files and assets you expect to touch.
- Any relevant business/brand constraints that came from the human or previous prompts.

This section should be enough for a new reader to understand the task at a glance.

---

### 2. Big Picture / Outcomes

Describe the desired end‑state in **user‑visible** terms, not implementation details. For example:

- “Visitors in niche X land on a page that feels as premium as the existing About page.”
- “Services is now a hub page that routes people into niche packs.”
- “The Services dropdown is intuitive and works across desktop and mobile without layout glitches.”

Make it clear how success will be recognised.

---

### 3. Progress

Maintain a simple, textual progress log such as:

- `Not started / In progress / Mostly done / Done`
- Short bullet points noting what has been completed and what is still pending.

---

### 4. Visual & UX Baseline (silverstone‑site specific)

This section is **mandatory** for any work that touches HTML/CSS/JS for the marketing site.

Summarise what “good” looks like by referencing the actual files and components in the repo:

- **Canonical pages**
  - `index.html`
  - `about.html`
  - `services.html`
  - `book.html`
  - `contact.html`
- **Key layout & component patterns**
  - Header + navigation, hero shader, and hero typography.
  - Card families: `.neon-card`, `.service-row`, `.service-card`, `.service-card-inner`, `.packages-grid` and related grids.
  - Icon bullet patterns used in service and package lists (`.bullet`, `.bullet-icon`, `.bullet-text` or `<li><i …></i>Text</li>`).
  - CTA banners (`.section.brand-gradient` with `.neon-card.cta-card` inside).
  - Innovation gallery (`#innovation-gallery`) and marquee strips.
  - Cookie consent banner and global footer.

Document the **non‑negotiable constraints** that must be respected, for example:

- Do **not** introduce new plain white, generic cards; reuse the existing premium card styles (neon/frosted panels, premium borders, generous padding).
- Every bullet in a styled list must have the same icon structure; no “icon on the first bullet only”.
- Images should be fully visible, well framed and integrated into cards/sections using existing patterns; avoid awkward cropping or tiny thumbnails in large white boxes.
- CTA banners must be present and visually consistent on `index.html`, `about.html`, `services.html` and all niche pages.
- The innovation gallery and marquees must remain on the same background and in the same order relative to the final CTA/footer; do not move them into separate sections with new backgrounds.
- Navigation (including the Services dropdown) must remain readable and easy to use; the word “Services” must remain visible.

Also note how existing stylesheets support this baseline:

- Primary stylesheets: `assets/css/styles.css` (or equivalent), `assets/css/custom-styles.css`, `assets/css/services.css`, `assets/css/premium-gallery.css`, plus any inline `<style>` blocks on core pages.
- The rule: **reuse these styles** and extend them minimally instead of creating new visual systems or a niche‑specific stylesheet.

---

### 5. Plan of Work

In prose, describe the **sequence of edits** you intend to make. For each step, mention:

- The files and sections you will touch (selectors, IDs, or component names).
- What you plan to add/change at a high level (e.g. “add a Services dropdown using existing nav classes”, “add three niche‑specific cards reusing the `.neon-card` pattern”).
- Any open questions or risks you anticipate.

This should read like a short project plan, not a line‑by‑line diff.

---

### 6. Concrete Steps

Translate the Plan of Work into an ordered checklist of specific actions (one per line), e.g.:

- `[ ]` Parse service master CSV and derive niche list.
- `[ ]` Create `/niches/<slug>.html` pages by copying `about.html` skeleton.
- `[ ]` Wire niche links into the Services dropdown and `services.html`.
- `[ ]` Run visual QA checklist (cards, bullets, CTAs, galleries, nav, cookie banner).

Update the checkboxes as you complete each step.

---

### 7. Surprises & Discoveries

Record things you learn while working, such as:

- Outcomes of web‑based research about a niche or about premium automation agency design.
- Hidden constraints discovered in the repo (e.g. a CSS rule that affects multiple pages).
- Any regressions you notice and fix.

Keep entries short, time‑ordered bullets.

---

### 8. Decision Log

For each meaningful decision (e.g. “we will use About page layout as the template for niches”), add a bullet:

- Brief context.
- Options considered.
- The chosen option and why.

This helps future sessions understand why the site looks the way it does.

---

### 9. Outcomes & Retrospective

At the end of the work (or at a natural breakpoint), summarise:

- What was actually delivered.
- What remains undone and why.
- Any design or technical debt you introduced deliberately.

---

### 10. TODO / Handover

Maintain a list of TODO items and recommendations that should appear in the final `TODO_AND_RECOMMENDATIONS_BLOCK`, for example:

- Remaining niches to build.
- Optional polish ideas.
- Follow‑up tasks for the next prompt (e.g. React pricing implementation).

---

### 11. Validation & Acceptance

Explain how you will validate that the work meets the brief, for example:

- “All niche pages visually match the quality of About and Services pages.”
- “Services dropdown is keyboard‑navigable and does not disappear while interacting.”
- “Bullet icons and CTAs are present and visually consistent on all relevant pages.”

Include any manual checks (open specific pages, resize viewport, hover over dropdown, etc.) and any automated checks (lint, basic HTML validation) that are relevant.

---

### 12. Idempotence and Recovery

Describe any state that must remain safe if the same ExecPlan is run again or partially re‑run (e.g. re‑applying patches). Note any fragile areas of the codebase that require special care.

---

### 13. Artifacts and Notes

Link to or describe any supporting artifacts created during the work (e.g. new asset filenames, stub data, or sample copy that lives outside the main pages).

---

### 14. Research and Inspiration

For tasks that involve new copy or layouts:

- Use the configured web search tool to:
  - Understand typical pains/workflows/outcomes for each niche.
  - Collect inspiration from premium, boutique automation/SaaS agency sites.
- Summarise research in this section or in `Surprises & Discoveries`; do **not** paste raw search results.
- Never copy layouts or copy verbatim; always paraphrase and adapt to Silverstone’s brand.

---

## Maintaining ExecPlans

While implementing a plan:

- Read the ExecPlan from top to bottom before making edits.
- After finishing a meaningful chunk of work, update:
  - `Progress`
  - Any relevant parts of `Context and Orientation`, `Visual & UX Baseline`, `Plan of Work` or `Concrete Steps` if reality diverged.
  - `Decision Log` for new decisions.
  - `Surprises & Discoveries` when you learn something important.
- At completion, update `Outcomes & Retrospective` and `TODO / Handover`.

ExecPlans must remain accurate, self‑contained, and understandable to a new reader who knows nothing about previous prompts.
