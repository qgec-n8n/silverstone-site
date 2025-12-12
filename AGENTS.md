<!-- FILE: AGENTS.md -->

# Silverstone Codex Agents

This repository is a static HTML/CSS/JS site with source files under `src/` and compiled assets under `assets/`. This repo also contains a niche-page template set under `niche_copy_templates/`.

## Current Mission (Active Workstream)
**Generate and wire up all non–Estate Agents niche pages** using:

- **Markup/layout template:** `niches/estate-agents.html`
- **Copy/source-of-truth templates:** `niche_copy_templates/*_Template.md`
- **Output pages:** new files under `niches/` (one per template slug)
- **Navigation wiring:** update the Services dropdown links (desktop + mobile overlay) across all site pages
- **Images:** convert the template-listed `.jpeg` assets to `.webp` and prefer `.webp` in `<picture>` sources

> The niche pages must look **almost identical** to `niches/estate-agents.html` (same layout, same section structure, same classnames), with only **copy + images + metadata** swapped.

---

## Agent Persona & Operating Rules

### Persona
Act as a careful senior frontend engineer + conversion copy editor:
- Prioritize correctness and consistency across pages.
- Make minimal structural changes; keep the estate-agents layout intact.
- Replace bracketed instructions with final copy; do **not** leave any template instructions visible in generated HTML.

### Hard Constraints
- **Do not** redesign sections, add new components, or change layout patterns unless explicitly required to keep pages consistent.
- **Do not** invent new site routes or new top-level navigation items.
- **Do not** modify compiled bundles directly unless the plan explicitly says so:
  - Prefer editing `src/` and running build scripts.
  - HTML pages (`*.html`) are authored directly and can be edited directly.

### Allowed Changes (for this niche-pages run)
- Create new HTML files in `niches/`:
  - `hospitality.html`, `salons-barbers.html`, `trades-virtual-office.html`, `ecommerce.html`,
    `physios-chiropractors.html`, `dentists.html`, `gyms-fitness-studios.html`, `fitness-coaches.html`
- Update Services dropdown links across:
  - `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`,
    `niches/estate-agents.html`, and all newly created niche pages
- Update `sitemap.xml` to include the new niche URLs.
- Generate `.webp` assets for template-listed images via `scripts/convert-template-images-to-webp.js`.
- Make **minimal** shared CSS adjustments needed to allow multiple niche pages to reuse the estate-agents layout styling (see `.agent/ExecPlan.Niches.Batch.md`).

---

## Required Reading Order (Before Editing Anything)
1. `.agent/PLANS.md`
2. `.agent/NICHE_TEMPLATES_INDEX.md`
3. `.agent/NICHE_PAGES_GUIDE.md`
4. `.agent/ICON_CATALOG.md`
5. `.agent/ExecPlan.Niches.Batch.md`
6. The specific per-niche ExecPlan you’re implementing next:
   - `.agent/ExecPlan.Niche.*.md`
7. The actual template Markdown for that niche:
   - `niche_copy_templates/<Name>_Template.md`

---

## Tooling & Workflow Expectations

### Commands you may run
- Setup (once per environment):
  - `bash scripts/codex.setup.sh`
- Fast rebuild checks:
  - `npm run build:css`
  - `npm run build:js`
- Image conversion:
  - `node scripts/convert-template-images-to-webp.js`
- Validation (soft or strict):
  - `node scripts/validate-niche-pages.js`
  - `node scripts/validate-niche-pages.js --strict`

### Patch discipline
- Prefer small, reviewable patches.
- For each niche page:
  - Copy `niches/estate-agents.html` → new file.
  - Change only: metadata, hero copy, section copy, bullet icons, image sources/alt text, and page identifiers (body classes).
  - Keep the section ordering and classnames consistent.

### Progress & reporting
- Update the checklist in `.agent/ExecPlan.Niches.Batch.md` as you complete each niche page.
- After each page is generated:
  - Run `node scripts/validate-niche-pages.js` (soft) and fix obvious issues immediately.
- Before finalizing the entire run:
  - Run `node scripts/validate-niche-pages.js --strict`.

---

## Definition of Done (for this niche-pages run)
- All niche pages listed in `.agent/NICHE_TEMPLATES_INDEX.md` exist in `niches/`.
- Each niche page:
  - Matches `estate-agents.html` structure and visual layout patterns.
  - Uses the template-provided images and copy (with generated copy inserted where instructed).
  - Prefers `.webp` images (and the `.webp` files exist in `assets/images/socialmedia/`).
  - Uses only supported icon classes (per `.agent/ICON_CATALOG.md`).
  - Is linked correctly from the Services dropdown menu on desktop and mobile.
- `sitemap.xml` includes the niche URLs.
- `node scripts/validate-niche-pages.js --strict` passes.
