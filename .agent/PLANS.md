# ExecPlans for `silverstone-site`

This file defines how to write and maintain an execution plan (“ExecPlan”) for
complex work on the `silverstone-site` static website (Silverstone AI).

ExecPlans are Markdown design documents, checked into the repo, that a coding
agent or novice human can follow to implement a feature end‑to‑end. They are
living documents: every time meaningful progress is made, the ExecPlan should
be updated.

## When to create an ExecPlan

Create or update an ExecPlan when:

- You are adding or overhauling multiple pages (e.g. new niche landing pages,
  major `services.html` redesign).
- You are changing shared navigation, headers, or layout that appears on
  several pages.
- You expect the work to involve multiple rounds of reading files, editing,
  and validation.

Name ExecPlan files at the repo root using:

- `ExecPlan-<short-name>.md`, e.g. `ExecPlan-silverstone-niches.md`.

For very small, one‑off edits (single copy tweak, tiny CSS fix), you may work
without an ExecPlan.

## General requirements

Every ExecPlan **MUST**:

- Be self‑contained: a new contributor with only the current working tree and
  the ExecPlan can complete the work.
- Explain what user‑visible behaviour will exist after the change and how to
  see it working.
- Use explicit repository‑relative paths for all files and commands.
- Stay in sync with reality: whenever work progresses, update the ExecPlan
  before continuing.
- Include a clear path to validate success (manual checks, browser flows, or
  tests).

## Required sections

Each ExecPlan must use the following sections and headings.

### Purpose / Big Picture

Explain, in a few sentences:

- What someone gains after this change (from a user/business perspective).
- How they can observe it working (e.g. “open `services.html` in a browser and…”,
  “click the Services dropdown and…”).

Keep this focused on outcomes, not implementation details.

### Progress

Maintain a checklist of granular steps with timestamps. Example:

- `[x] (2025‑12‑01 10:40Z) Audited existing services.html structure.`
- `[ ] (2025‑12‑01 11:05Z) Implemented niche pages for all CSV niches.`

Guidelines:

- Every meaningful stopping point must be reflected here, even partially
  completed steps.
- Include short notes like “completed: X; remaining: Y” when splitting tasks.
- This section must always reflect the actual current state of the work.

### Surprises & Discoveries

Record unexpected behaviours, constraints, or helpful insights discovered while
working. For each item, briefly describe:

- The observation.
- Evidence or the file/command where it was observed.

Example:

- `Observation: services hero shader variant is reused by other pages. Evidence: hero canvas configuration in assets/js/hero-shader.js.`

### Decision Log

Log important decisions and why you made them. For each entry:

- `Decision:`
- `Rationale:`
- `Date/Author:` (e.g. `2025‑12‑01 / Codex`)

These are especially important for navigation structure, URL patterns, niche
naming, and visual patterns.

### Outcomes & Retrospective

At major milestones or completion, summarise:

- What was actually achieved.
- What remains for future work.
- Any lessons learned or follow‑ups needed.

Keep this tightly linked to the Purpose / Big Picture section.

### Context and Orientation

Describe the current relevant state of the repo as if the reader knows nothing:

- List key files and directories with full paths (e.g. `index.html`,
  `services.html`, `assets/css/custom-styles.css`, `assets/images/socialmedia/...`).
- Explain any non‑obvious concepts used in the plan (e.g. “hero shader”,
  “parallax body”, “niche landing page”).
- Mention any external constraints (e.g. “live site at https://silverstone-ai.com is read-only; only edit local repo”).

Avoid references like “as described earlier” or external documents; include
necessary explanations directly here.

### Plan of Work

In prose, describe the sequence of edits and additions you intend to make. For
each step:

- Name the file(s) and locations (selectors, sections, functions).
- Describe what you will add/change at a high level (e.g. “add a Services
  dropdown markup block reusing existing nav classes”).

This should read like a narrative of the implementation, not a checklist.

If the task involves drafting copy or designing page layouts, include a step to
perform web searches using the `web` tool. Research industry‑specific pain
points, typical outcomes, or premium design patterns relevant to the domain
you are targeting. Summarise these findings in the ExecPlan’s `Surprises &
Discoveries` or `Decision Log` sections and use them to inform your content
and design choices.

### Concrete Steps

List the concrete commands and manual actions needed to execute the plan, e.g.:

- Which directories to work in.
- Which HTML/CSS/JS files to open.
- Any build or preview commands (if applicable).

Example (if a static preview script exists):

- `From repo root, run: npm run dev`
- `Open http://localhost:3000/services.html and check the Services dropdown.`

If no tooling exists, describe how to open the HTML files locally in a browser.

### Validation and Acceptance

Define how to verify that the work is correct, phrased as behaviours a human can
observe. For example:

- “Open `index.html` and confirm that the Services nav item shows a dropdown
  listing General + all niche pages.”
- “Navigate to `/niches/estate-agents.html` and confirm hero shader uses a
  unique variant and body content scrolls over the Calendly background.”

Include:

- Which flows to click through.
- What should appear on desktop and mobile views.
- Any test commands, if they exist.

### Idempotence and Recovery

Describe:

- How to safely re‑run steps (e.g. re‑applying patches, re‑running generators).
- Any risky changes and how to roll them back (e.g. restore files from git,
  revert specific diff hunks).

Aim for changes that can be applied multiple times without corrupting the repo.

### Artifacts and Notes

Optionally include small, focused snippets:

- Short code excerpts or diffs that clarify non‑obvious edits.
- Example HTML fragments for new sections.
- Notes for future contributors.

Avoid pasting huge diffs; prefer small, representative snippets.

### Interfaces and Dependencies

If work introduces or relies on specific interfaces, conventions, or identifiers,
name them explicitly, for example:

- The naming scheme for niche page filenames and URLs.
- The IDs of pricing placeholder containers (e.g. `pricing-root`,
  `pricing-services-root`, `pricing-<niche-slug>-root`).
- Any JS hooks used for dropdown behaviour.

Be precise so future work can build on these decisions.

## Maintaining ExecPlans

While implementing a plan:

- Read the ExecPlan from top to bottom before making edits.
- After finishing a meaningful chunk of work, update:
  - `Progress`
  - Any relevant parts of `Context and Orientation`, `Plan of Work`, or
    `Concrete Steps` if reality diverged
  - `Decision Log` for new decisions
  - `Surprises & Discoveries` if anything unexpected occurred
- At completion, update `Outcomes & Retrospective` to reflect what was
  actually delivered and what remains.

ExecPlans should always be accurate, self‑contained, and sufficient for a
novice to understand and continue the work.