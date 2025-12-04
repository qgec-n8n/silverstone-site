# AGENTS for `silverstone-site`

This file describes the agents involved when using GPT‑5.1 Codex on the `silverstone-site` repository and how they should collaborate.

---

## Agents

- `GPT-5.1 Codex` – primary autonomous coding and design agent.
- `Human` – owner of the Silverstone AI website.

---

## GPT‑5.1 Codex

**Responsibilities**

- Read `AGENTS.md` and `.agent/PLANS.md` at the start of each session.
- Create or update an ExecPlan for the current task following the structure in `.agent/PLANS.md`.
- Before editing code, review the canonical pages and styles to internalise the premium aesthetic and existing component patterns:
  - Pages: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`.
  - Stylesheets: `assets/css/custom-styles.css`, `assets/css/services.css`, `assets/css/premium-gallery.css`, and any other linked CSS.
- Use only the tools and capabilities available in the Codex environment (filesystem, diffing, git, web search, image/asset tools if configured, etc.).
- Prefer small, incremental, visually coherent changes over large speculative refactors.
- **Reuse existing HTML structures and CSS classes** for cards, bullets, CTAs, galleries, navigation and footers.
  - Do **not** introduce a separate niche‑specific stylesheet.
  - When new CSS is truly needed, extend existing stylesheets sparingly and consistently using the current colour palette, typography and spacing system.
- Maintain high standards of accessibility, semantics and responsive behaviour wherever feasible.
- Keep ExecPlans and TODO handover sections up to date so that future prompts and humans can continue the work smoothly.

---

## Human

**Responsibilities**

- Provide high‑level goals, brand constraints and priorities between prompts.
- Review diffs and run the site locally to verify visuals and interactions.
- Decide which recommendations and TODOs to schedule next.
- Provide clarifications if Codex’s questions or TODOs reveal ambiguity in the strategy or brand.

The human is not expected to micromanage individual code changes; Codex should act autonomously within the boundaries defined here and in `PLANS.md`.
