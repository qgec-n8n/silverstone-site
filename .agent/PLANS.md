<!-- .agent/PLANS.md -->

# Codex Execution Plans (ExecPlans) for `silverstone-site`

This document defines how to write and maintain ExecPlans in this repository. ExecPlans are **living design documents** that describe what to build, how to build it, and how to prove it works. A new engineer with only the ExecPlan and the repo should be able to complete the work.

## How to use this file

When a prompt or `AGENTS.md` tells you to “use an ExecPlan”:

1. Read this `PLANS.md` from top to bottom.
2. Create or update a single ExecPlan Markdown file at the repository root, named for the task, for example:

   - `ExecPlan-first-niche-and-nav.md`

3. Follow the skeleton below. Unless explicitly stated otherwise, **every section is required**.
4. Keep the sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` in sync with the actual work as you go.
5. Implement the code according to the ExecPlan. If you change direction, update the plan first and record the decision.

## Non‑negotiable requirements

- Every ExecPlan must be **self‑contained**: it contains all context required to implement the task.
- Every ExecPlan is a **living document**: update it when you complete a step, discover something new, or change a design decision.
- ExecPlans must describe **behaviour**, not just code. They must explain what a human can see or do after the change and how to verify it.
- ExecPlans must be safe to follow multiple times: prefer additive changes, clear validation commands, and rollback guidance where needed.

## Skeleton of a good ExecPlan

Use this skeleton for all ExecPlans in this repo. When writing to a `.md` file, **omit** the outer ```md fence.

```md
# <Short, action-oriented description>

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated as you work. Maintain it in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

Explain in a few sentences what this change enables for a Silverstone AI visitor and how they can see it working (for example, “a visitor can open the Services dropdown, keep it open while the header shrinks on scroll, and navigate to the <Niche> page”).

## Progress

Use a checklist with timestamps. Every stopping point must be reflected here.

- [ ] (YYYY-MM-DD hh:mmZ) Initial codebase orientation and design reference notes.
- [ ] (YYYY-MM-DD hh:mmZ) First implementation of navigation dropdown.
- [ ] (YYYY-MM-DD hh:mmZ) First implementation of <Niche> landing page.
- [ ] (YYYY-MM-DD hh:mmZ) Refinement pass on navigation and niche page after visual QA.
- [ ] (YYYY-MM-DD hh:mmZ) Final verification on all affected pages.

Update this section **as you go**, splitting steps as needed into “completed” and “remaining”.

## Surprises & Discoveries

Record unexpected behaviours, bugs, design quirks, and research findings. Include short evidence snippets (for example, relevant HTML/CSS excerpts, screenshots references, or console output).

## Decision Log

Record each decision in the format:

- Decision: …
  Rationale: …
  Date/Author: …

Include changes in navigation behaviour, design trade‑offs, and copy tone.

## Outcomes & Retrospective

Summarise what was achieved, what remains, and any lessons that would help the next contributor. Compare outcomes to the original Purpose.

## Context and Orientation

Describe the current state relevant to this task as if the reader knows nothing about the repo. Name key files and paths explicitly, such as:

- `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`
- any existing niche pages (if present)
- stylesheets under `assets/css/…`
- JavaScript controlling header minimising / navigation behaviour and any mobile menu.

Explain:

- how the header, menus, CTA banners, innovation gallery, marquees, cookie banner, and footer currently behave;
- which page(s) contain the best‑looking cards, bullet lists, and CTA banners; and
- where those components are defined in HTML and CSS.

## Plan of Work

Describe, in prose, the sequence of edits you will make. For each edit, name:

- the file (with repository‑relative path),
- the approximate location (for example, “main nav bar markup in header”), and
- what will change (for example, “wrap Services in a dropdown trigger and add a menu overlay”).

Keep the plan focused on **user‑visible behaviour** and layout, not incidental implementation details.

## Concrete Steps

List the exact commands to run (for example:

- starting a dev server or `live-server` preview,
- running a linter or formatter,

and where to run them. Show short expected outputs so a reader can recognise success.

## Validation and Acceptance

Describe how to manually exercise the feature in a browser, for example:

- open `index.html`, `about.html`, `services.html`, and the new niche page in a browser;
- scroll until the header minimises;
- open the Services dropdown, move the cursor between the menu bar and dropdown, and confirm:
  - the header does **not** collapse while the dropdown is open;
  - the word “Services” remains visible;
  - all links in the dropdown are reachable and hoverable.

Include validation steps for:

- bullet icons (every bullet in iconised lists shows an icon),
- CTA banners (consistent style on `index.html`, `about.html`, `services.html`, and the new niche page),
- innovation gallery and marquees (no extra backgrounds or offsets),
- cookie banner and footer (unchanged structure and styling),
- images on the new niche page (fully visible and harmoniously integrated).

## Idempotence and Recovery

Document which steps are safe to repeat and how to recover if a step is interrupted. Prefer additive, reversible changes and keep manual instructions simple.

## Artifacts and Notes

Include small but important diffs, HTML snippets, command transcripts, or textual descriptions of screenshots that help future readers understand the implementation. Keep them concise and focused on what proves success.

## Interfaces and Dependencies

Call out any new or modified JavaScript functions, CSS classes, or HTML structures that other features will rely on, for example:

- a CSS class that keeps the header expanded while the Services dropdown is open;
- a data attribute used by JavaScript to detect the chosen niche page.

Name files and selectors precisely.
