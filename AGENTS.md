<!-- AGENTS.md -->

# ExecPlans for `silverstone-site`

When you are acting as a coding agent on this repository, use an ExecPlan (execution plan) for any non‑trivial work, especially anything that touches navigation, shared layout, or multiple pages. The detailed requirements for ExecPlans live in `.agent/PLANS.md`.

Use an ExecPlan whenever:

- You change the header, navigation, menus, or footer.
- You create or significantly redesign a page (`index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, or any niche page).
- You add more than a small, localised change (for example, more than ~30 lines of HTML/CSS/JS or more than one file).

You may skip ExecPlans only for tiny, isolated fixes (for example, a single copy tweak or one CSS value change).

## Expectations for agents

When working from an ExecPlan:

1. **Read first, then act**

   Before editing, read:

   - `.agent/PLANS.md`
   - the specific ExecPlan file for your task (for example, `ExecPlan-first-niche-and-nav.md`)
   - the core reference pages:

     - `index.html`
     - `about.html`
     - `services.html`
     - `book.html`
     - `contact.html`

   Treat their typography, cards, CTA banners, bullet lists, spacing, and background usage as the **visual canon** for all new work.

2. **Re‑use design patterns**

   - Prefer copying and lightly adapting existing **card**, **list**, **CTA**, and **section** structures instead of inventing new ones.
   - Do **not** introduce a niche‑specific stylesheet. Re‑use and extend existing stylesheets in a minimal, consistent way (for example, by adding a few carefully chosen classes to existing CSS files).
   - Ensure any new bullet lists that use icons re‑use the **same iconised bullet pattern** already used on `services.html` and `book.html`.  
     Do **not** mix icon bullets and plain bullets within the same list, and do **not** show an icon only on the first bullet.

3. **Protect shared structures**

   - Keep the **header**, shrinking / minimising behaviour, **Services navigation**, **innovation gallery**, **single/double marquees**, CTA banners, cookie banner, and **footer** working and visually intact on every page.
   - Do **not** wrap the innovation gallery or marquees in new sections with alternate backgrounds; they must continue to sit on the **same parallax background** as the surrounding content.
   - Do **not** introduce extra parallax backgrounds or overlays behind sections that currently share a single background.

4. **Research and copywriting**

   - When writing new marketing copy, use the `web` tool to research:

     - pains, workflows, and outcomes for the target niche; and  
     - premium boutique automation / SaaS agency sites for tone and structure.

   - Capture short research notes inside the ExecPlan (for example, under **Surprises & Discoveries**, **Context**, or a dedicated research subsection).
   - Then write **concise, premium, niche‑specific copy** in the codebase that:

     - mirrors the tone of `about.html` and `services.html`; and
     - reinforces “Book a free 30‑minute automation audit” as the primary CTA.

5. **Iterate for polish**

   For navigation and niche landing pages, the ExecPlan must include **at least two passes**:

   - a first implementation of layout, copy, and interactions; and  
   - a refinement pass based on your **own critique** of contrast, spacing, alignment, responsiveness, and behaviour.

   Treat “premium boutique studio” quality as the **minimum bar**:

   - no generic white cards sitting directly on the parallax background unless that pattern already exists and looks good;
   - no cramped text or edges touching card borders;
   - legible font sizes and contrast comparable to `about.html` and `index.html`;
   - images fully visible and well integrated with surrounding text, never awkwardly cropped.

ExecPlans must always be kept up to date as you work so that a new contributor could resume the task using only the ExecPlan and the current working tree.
