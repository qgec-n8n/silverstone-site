# Codex Execution Plans (ExecPlans) for this repo

This document explains how to use ExecPlans in the Silverstone marketing site repository. ExecPlans are self-contained design-and-implementation guides that Codex (and humans) follow to deliver complete, working features such as the Estate Agents / Real Estate niche landing page.

Treat the reader of any ExecPlan as a complete beginner to this repo: they only have the current working tree and the single ExecPlan you provide. There is no memory of prior plans or conversations.

ExecPlans in this repo are stored under:

- `.agent/PLANS.md` — this file (the global rules and skeleton).
- `.agent/AGENTS.md` — high-level instructions about when to use ExecPlans.
- `.agent/plans/*.md` — individual ExecPlans. For the Estate Agents / Real Estate niche landing page, the canonical ExecPlan path is:
  - `.agent/plans/real-estate-landing-page.md`.

The Estate Agents page is driven by the “Estate Agents – Niche Landing Page Content” specification (a Real Estate Niche Page Template). The key copy from that document is reproduced inside the Real Estate ExecPlan so that implementers do not need the original file. :contentReference[oaicite:0]{index=0}


## How to use ExecPlans and PLANS.md

When authoring an ExecPlan:

- Follow this PLANS.md **to the letter**.
- Before drafting or updating an ExecPlan, re-read this file end-to-end.
- Assume the agent executing your plan has no prior context beyond:
  - The current working tree.
  - `.agent/AGENTS.md`.
  - This `.agent/PLANS.md`.
  - The single ExecPlan they are following.

When implementing an ExecPlan:

- Do **not** ask the user for “next steps”. Proceed through the plan’s milestones.
- Keep the ExecPlan’s living sections up to date:
  - `Progress`
  - `Surprises & Discoveries`
  - `Decision Log`
  - `Outcomes & Retrospective`
- At every pause or completion point, update `Progress` to show what is done and what remains.
- Resolve ambiguities by reading source files, researching within the repo, and making small, well-documented decisions in the `Decision Log`.


## Non-negotiable requirements

Every ExecPlan in this repo MUST:

- Be fully self-contained.
  - It must include all knowledge and instructions a novice needs to succeed.
  - If a feature is driven by an external spec (like the Real Estate Niche Page Template), summarise and embed the relevant requirements and copy in the plan itself.
- Be a living document.
  - As work proceeds, update `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective`.
- Enable end-to-end behavior, not just code edits.
  - The result must be observable in a browser as a working, visually correct page or feature.
- Define every non-obvious term in plain language.
- Prioritise user-visible purpose and outcomes before implementation details.
- Specify concrete file paths, selectors, and structures, not abstract suggestions.
- Include clear validation steps: what to open, where to click, what behavior or visuals to expect.

ExecPlans must NOT:

- Rely on links to blogs or external documentation at execution time.
- Assume unstated knowledge of this repo’s structure.
- Push key implementation decisions to the reader (“choose any approach you like”). Where trade-offs exist, the ExecPlan must choose and explain.


## Formatting

- Each ExecPlan is a Markdown file under `.agent/plans/`.
- Use standard Markdown headings and lists; avoid nested fenced code blocks.
  - When showing commands, diffs, or code, prefer inline backticks or indented blocks instead of nested triple-backtick fences.
- Use two newlines after each heading.
- Narrative sections should be prose first. Long bullet lists are acceptable in:
  - `Progress`
  - Clearly enumerated implementation steps
  - Copy that will be pasted into HTML (e.g. FAQ lists, bullet lists).


## Required sections in every ExecPlan

Each ExecPlan in this repo MUST include these sections, in this order:

1. **Purpose / Big Picture**  
   Explain what the feature accomplishes from a user’s perspective and how to see it working in the browser.

2. **Progress**  
   - Use a checklist with timestamps to track work.
   - Every stopping point should correspond to at least one checklist entry.
   - This section must always reflect reality for the latest commit.

3. **Surprises & Discoveries**  
   - Capture unexpected behaviors, bugs, performance constraints, or design insights.
   - Provide short evidence snippets if useful (e.g. a one-line console output description).

4. **Decision Log**  
   - Record each design or implementation decision as:
     - Decision:
     - Rationale:
     - Date/Author:
   - Include decisions about file locations, component reuse, icon choices, and URL structure.

5. **Outcomes & Retrospective**  
   - Summarise what was actually achieved, what remains, and lessons learned.
   - Compare against the original Purpose / Big Picture.

6. **Context and Orientation**  
   - Describe the current state relevant to the task as if the reader knows nothing.
   - Name key files and directories by full path.
   - Explain how major components fit together.

7. **Plan of Work**  
   - In prose, describe the sequence of changes: which files to touch, at a high level, and why.
   - Explain how the changes will reuse existing components / patterns instead of inventing new ones.

8. **Concrete Steps**  
   - Translate the Plan of Work into an ordered list of actionable steps.
   - Include commands (e.g. starting a static server) and browser navigation.
   - This section should be detailed enough that someone can follow it mechanically.

9. **Validation and Acceptance**  
   - Describe exactly how to verify the feature.
   - For this repo, that usually means:
     - Running a static server from the repo root.
     - Visiting specific URLs.
     - Checking visual layout, typography, animations, and interactions.

10. **Idempotence and Recovery**  
    - Explain how to safely re-run the steps or resume after a partial change.
    - Include any recommended Git workflows (e.g. commit early and often, how to revert).

11. **Artifacts and Notes**  
    - Capture any particularly helpful snippets: short HTML fragments, sample nav items, or notes about tricky CSS interactions.

12. **Interfaces and Dependencies**  
    - For this repo, “interfaces” include:
      - CSS classes and their expected semantics.
      - JavaScript selector APIs (e.g. `.stats`, `.faq-item`, `.hero-bullets`).
      - File-level dependencies (e.g. `parallax-section` markup relying on `assets/css/parallax-fix.css`).


## Context and orientation for this repo

ExecPlans must orient the reader to this site’s structure:

- **HTML pages (root):**
  - `index.html` — home page; includes:
    - Main hero with shader canvas and `.hero-bullets` list.
    - “Proof in Numbers” stats strip with `.stats` and `.neon-card.stat`.
    - FAQ list using `<details class="neon-card faq-item">`.
    - Final CTA section with `.section.brand-gradient` and `.cta-card`.
  - `about.html` — about page; includes:
    - “Our Values” cards in `.values` with `.value-card.neon-card`.
    - Another stats strip.
    - CTA section identical in structure to the home CTA.
  - `services.html` — services overview; includes:
    - Hero with `#hero-shader-canvas` and `data-variant="blue"`.
    - A `section` containing multiple `.service-row` blocks:
      - Each `.service-row` holds `.service-image` and `.service-content.neon-card`.
      - Bullets are `<li><i class="fa-solid …"></i>…</li>` for every bullet.
  - `book.html` — booking page; uses hero variant `data-variant="amber"`, discovery-call section, bullet lists with icons, and the shared CTA/footer pattern.
  - `contact.html`, `privacy-policy.html` — additional content pages with the same header, CTA (contact), and footer patterns.

- **CSS:**
  - `assets/css/styles.css` — core styles, including `.section`, `.neon-card`, and base typography.
  - `assets/css/custom.css`, `assets/css/custom-styles.css` — overrides and layout tweaks.
  - `assets/css/services.css` — service-row layout and neon card refinements.
  - `assets/css/hero-base.css` — hero layout and canvas sizing.
  - `assets/css/parallax-fix.css` — parallax background behavior using `.parallax-section` and `data-parallax-theme` such as `"lines"`, `"circuit"`, `"mesh"`, `"book"`.
  - `assets/css/icons.css` — Font Awesome webfont integration (`fa`, `fa-solid`, `fa-brands`) and custom icon helpers.

- **JS:**
  - `assets/js/script.js` — header behavior, cookie banner integration, animate-on-scroll, stats counter (`.stats .number[data-target]`), and other small enhancements.
  - `assets/js/hero-shader.js` — WebGL hero background; themes keyed by `data-variant` (e.g. `default`, `blue`, `green`, `amber`, `silver`).
  - `assets/js/cookie-consent.js` — cookie banner.
  - Other scripts such as `magnetic-buttons.js`, `marquee-*.js`, etc., power smaller effects.

- **Icons and webfonts:**
  - `assets/webfonts/` — local Font Awesome webfonts (`fa-solid-900`, `fa-brands-400`, etc.).
  - `assets/css/icons.css` — defines `.fa`, `.fa-solid`, `.fa-brands` plus specific icons like `fa-check-circle`, `fa-info-circle`, `fa-calendar-check`, `fa-users`, etc.
  - HTML bullets typically follow the pattern:
    - `<ul><li><i class="fa-solid fa-check-circle"></i> …</li>…</ul>`.


## Special guidance for visual fidelity in this repo

ExecPlans for UI work MUST:

- Reuse existing components instead of inventing new ones:
  - Hero sections should reuse `.hero.title-band` and `#hero-shader-canvas`.
  - Card sections should reuse `.neon-card` and `.service-row` / `.value-card` patterns.
  - Stats strips should reuse `.stats` with `.neon-card.stat` and `.number[data-target]`.
  - FAQ blocks should reuse the `<details class="neon-card faq-item">` pattern.

- Maintain typography and spacing:
  - Use existing heading levels and classes (`.section-title`, `.section-subtitle`).
  - Keep section spacing consistent with other pages (same `section` and `.container` structure).

- Keep CTA and footer identical:
  - For final CTAs, copy the structure from `index.html`, `about.html`, or `book.html` and swap only the heading, paragraph, and button label.
  - Footers must match the structure and classes of existing pages (`.site-footer`, `.footer-container`, `.footer-brand`, `.footer-links`, `.footer-contact`, `.footer-social`).


### Bullet icon rules (strict)

For any ExecPlan that involves bullet lists (especially niche pages such as the Estate Agents landing page):

- Plain bullets (default `ul`/`li` circles) are **not** allowed.
- Every `<li>` that is visually a bullet MUST have an icon, and that icon MUST be backed by a glyph defined in `assets/css/icons.css` and `assets/webfonts/`.
- Acceptable patterns include:
  - Explicit icon markup inside each `<li>`:
    - `<li><i class="fa-solid fa-check-circle"></i> Your bullet copy…</li>`
    - `<li><i class="fa-solid fa-calendar-check"></i> Another bullet…</li>`
  - Or an approved helper class if present (for example, an `icon-list` pattern that uses `::before` to inject icons for every `li`).

For the Estate Agents niche landing page specifically:

- ExecPlans and implementations MUST:
  - Inspect existing bullet lists in `services.html`, `index.html`, and `book.html` to mirror their markup exactly.
  - Use a Font Awesome icon for **every** `<li>` in hero bullets, niche pains, bundle bullets, outcomes, how-it-works steps (where bullets are used), and any additional bullet lists.
  - Verify at the end (manually or by searching the page) that no `<li>` on the Estate Agents page is missing an icon.


## Plan of Work guidance for this repo

When writing the `Plan of Work` section of an ExecPlan:

- Map the desired UX to existing patterns:
  - For example, a “Niche Pain” section should map to:
    - A `.section` with a `.container`.
    - A `.service-row` with `.service-image` and `.service-content.neon-card`.
    - A bullet list with `<li><i class="fa-solid …"></i>…</li>`.
- Explicitly name which reference you are reusing:
  - “Copy the service-row structure from `services.html` and adjust the heading, bullets, and image for the Estate Agents niche.”
  - “Copy the stats strip structure from `index.html` and replace numbers and labels with the specified Real Estate metrics.”
- Call out any small, necessary extensions:
  - E.g. adding a new hero shader theme alias (such as a `gold` variant) in `assets/js/hero-shader.js` if the spec requires it.


## Concrete Steps guidance

In the `Concrete Steps` section of an ExecPlan:

- Include working directory context for commands (typically the repo root).
- For this static site, common commands are:
  - `python -m http.server 8000` (or equivalent) from the repo root.
- Include instructions such as:
  - “Open `http://localhost:8000/niches/estate-agents.html` in your browser.”
  - “Resize the browser to confirm responsive behavior.”
- Where helpful, describe how to search or inspect code:
  - “Use `rg "service-row" services.html` to review existing card layouts.”


## Validation and Acceptance guidance

- Always include:
  - Which page(s) to open.
  - Which sections to scroll to.
  - What to visually confirm (text, layout, animations).
- For features that rely on JS:
  - Describe the interaction (e.g. stats numbers counting up, FAQ expand/collapse).
- For design-system fidelity:
  - Confirm that new sections “blend in” visually:
    - Same card radii, shadows, spacing.
    - Same typography and color tokens.
    - Same button hover states and transitions.
- For bullet icon integrity:
  - Confirm that no `<li>` on the new page renders with a browser default bullet.
  - Confirm that all icons render as intended (no missing squares or fallback glyphs).


## Idempotence and Recovery

ExecPlans must explain:

- How to safely re-run steps:
  - Reapplying an `apply_patch` with unchanged content should be a no-op.
  - Re-running `python -m http.server` is safe.
- How to recover if a file edit goes wrong:
  - Use Git to inspect and reset changes.
  - Prefer many small commits while implementing a plan.
- That changes to shared components (header, footer, shared CSS/JS) can affect multiple pages; validate key pages after such edits.


## Artifacts and Notes

- Use this section to record anything that will help the next person:
  - Example nav entries for the “Estate Agents” link.
  - Example markup snippets for `.service-row` or `.value-card` usage.
  - Notes about hero shader variants and their `data-variant` values.
- Keep artifacts short and focused; do not paste entire pages here.


## Interfaces and Dependencies

For UI work in this repo, “interfaces” primarily mean:

- **CSS selectors and classes**  
  e.g. `.hero.title-band`, `.service-row`, `.neon-card`, `.values`, `.cta-card`, `.site-footer`, `.stats`, `.faq-item`.

- **JavaScript hooks**  
  e.g. `.stats .number[data-target]`, `.animate`, `.parallax-section[data-parallax-theme=…]`, `#hero-shader-canvas[data-variant=…]`.

- **Assets and background themes**  
  e.g. `data-parallax-theme="book"` uses the `book-hero-calendly-mobile-2025@*x.webp` assets for backgrounds.

ExecPlans must:

- Name these interfaces explicitly when relying on them.
- Avoid introducing new “systems” unless strictly necessary; prefer small extensions consistent with existing patterns.
- For background images:
  - New niche pages must use the `book` parallax theme so that `book-hero-calendly-mobile-2025@1x/2x/3x.webp` is the only background image used in those sections, as required by the Real Estate spec.
