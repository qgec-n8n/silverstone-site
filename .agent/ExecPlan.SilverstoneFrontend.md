<!-- FILE: .agent/ExecPlan.SilverstoneFrontend.md -->

# Silverstone frontend CSS/JS consolidation and cleanup

This ExecPlan is a living document for the full front‑end refactor of the Silverstone marketing site. It must stay in sync with reality as work proceeds.

The plan implements the refactor described in `Output_2.md`, using the mapping in `Output_1.md` to stay aligned with actual HTML, CSS, and JS.

If you are Codex, **do not** improvise a separate plan; instead, update this document as you work.

---

## Purpose / Big Picture

From a user’s perspective, this refactor should:

- Preserve the current look and behavior of the site (hero, parallax, cards, marquees, gallery, cookie banner, contact form, Calendly embed).
- Make the CSS and JS codebase easier to understand and maintain by:

  - Moving all source styles into `src/css/` and bundling them into a single `assets/css/styles.css`.
  - Moving all behavior into modular `src/js/` files and bundling them into a single `assets/js/app.js`.

- Remove legacy and unused CSS/JS files and selectors identified in the analysis.

After the refactor:

- Every HTML page uses the **same** CSS and JS entrypoints.
- Visual elements and behaviors can be traced cleanly back to specific modules under `src/css` and `src/js`.
- Old, duplicate, and unused assets (e.g. `neural-grid.css`, `neural-grid.js`, unused footer CSS) are gone.

---

## Progress

Use this checklist to track granular progress. Each item should be timestamped as you update it.

- [ ] (YYYY‑MM‑DD hh:mmZ) Step 1 – Environment & capability scan completed (files listed, commands discovered, lists from 6.1–6.3 re‑verified).
- [ ] Step 2 – `src/css` and `src/js` directory structures created.
- [ ] Step 3 – Base CSS migrated to `src/css/base/variables.css`, `typography.css`, `layout.css`.
- [ ] Step 4 – Component CSS migrated to `src/css/components/*.css`.
- [ ] Step 5 – Feature CSS migrated to `src/css/features/*.css`.
- [ ] Step 6 – Page‑specific CSS migrated to `src/css/pages/*.css`, inline `<style>` blocks removed.
- [ ] Step 7 – CSS build pipeline produces consolidated `assets/css/styles.css` from `src/css/**`.
- [ ] Step 8 – Unused CSS files and legacy CSS assets removed as per Section 6.1 and Step 8 of `Output_2.md`.
- [ ] Step 9 – JS logic migrated into `src/js/*.js` modules (header, scroll reveal, stats, parallax, hero shader, magnetic buttons, marquee, gallery, cookie consent, contact form).
- [ ] Step 10 – JS build/concatenation produces `assets/js/app.js`.
- [ ] Step 11 – HTML updated to reference the new CSS/JS entrypoints only.
- [ ] Step 12 – Legacy JS files removed (`assets/js/script.js`, `hero-shader.js`, `cookie-consent.js`, `magnetic-buttons.js`, `marquee-*.js`, `premium-gallery.js`, `neural-grid.js`).
- [ ] Step 13 – Automated validation commands run and passing.
- [ ] Step 14 – Hand‑off notes and human validation checklist updated; Outcomes & Retrospective section completed.

If you pause mid‑step, split items into “completed” vs “remaining” and capture that here.

---

## Surprises & Discoveries

Record unexpected findings during implementation.

- Observation:
  - …
  - Evidence:
    - …

Update this section whenever you discover something that changes your understanding of the site (e.g. hidden dependencies, browser quirks, unexpected selectors).

---

## Decision Log

Record every notable decision, especially when multiple approaches are possible.

- Decision:
  - …
  - Rationale:
    - …
  - Date/Author:
    - …

Examples include: choice of concatenation vs. bundler for JS, how to map overlapping selectors into new modules, or how to handle borderline “unused” selectors.

---

## Outcomes & Retrospective

Fill this section in once major phases complete and at the end of the refactor.

- What was achieved vs. the original Purpose.
- Any compromises or deviations from `Output_2.md` (with references to Decision Log entries).
- Remaining risks, follow‑ups, or potential future improvements.

---

## Context and Orientation

This section explains the current codebase layout before the refactor, using information from `Output_1.md`.

### HTML

Main user‑facing pages:

- `index.html` – home / main marketing page.
- `about.html`
- `services.html` – includes the “Innovation Gallery”.
- `book.html` – Calendly booking embed.
- `contact.html` – contact form and details.
- `privacy-policy.html`
- `niches/estate-agents.html` – niche landing page.

These pages share global components:

- Cookie banner (`#cookie-banner`).
- Site header (`header.site-header`) and services overlay (`.services-overlay`).
- Hero sections (variants of `section.hero.title-band`).
- Parallax sections (`.parallax-section` and related backgrounds).
- Site footer (`footer.site-footer`).

### CSS before refactor

Key CSS files under `assets/css/` (from `Output_1.md`):

- Global/base:

  - `assets/css/styles.css` – main “kitchen sink” file: variables, typography, layout, many component styles.
  - `assets/css/custom.css` – hero/parallax tweaks, cookie banner, header sizing, neon card tuning.
  - `assets/css/mobile.css` – global responsive overrides.
  - `assets/css/icons.css` – icon font and icon‑related rules.

- Component/feature‑related:

  - `assets/css/hero-base.css` – hero layout and layering.
  - `assets/css/parallax-fix.css` – background/parallax scaffolding.
  - `assets/css/custom-styles.css` – home/services card and layout improvements.
  - `assets/css/services.css` – services layout, premium gallery styling.
  - `assets/css/premium-gallery.css` – innovation gallery grid and lightbox helpers.
  - `assets/css/marquee-single.css` – single‑row marquee styling.
  - `assets/css/marquee-double.css` – double‑row marquee styling.

- Legacy / unused:

  - `assets/css/neural-grid.css` – older gallery styling, no longer used.
  - `assets/css/home-services-fix.css` – older services fixes, not linked to pages.
  - `assets/css/footer.css` – unused standalone footer styling.

### JavaScript before refactor

Key JS files (from `Output_1.md`):

- Global:

  - `assets/js/script.js` – monolithic script handling header/nav, services dropdown, dynamic CSS loading (`ensureStylesheet`), scroll reveal, stats counters, and parallax behavior.
  - `assets/js/hero-shader.js` – WebGL canvas shader for the hero background.
  - `assets/js/cookie-consent.js` – cookie banner show/hide and local storage.

- Feature modules:

  - `assets/js/magnetic-buttons.js` – magnetic hover for `.btn` elements.
  - `assets/js/marquee-single.js` – single‑row marquee.
  - `assets/js/marquee-double.js` – double‑row marquee for services page.
  - `assets/js/premium-gallery.js` – innovation gallery / neural grid interactions.

- Legacy / unused:

  - `assets/js/neural-grid.js` – legacy gallery script that is no longer referenced.

There is also serverless / tooling code (Netlify function, image optimization scripts, CSS build script), which must continue to work but is not part of the front‑end bundle.

### Desired final structure

CSS source:

- `src/css/base/variables.css`
- `src/css/base/typography.css`
- `src/css/base/layout.css`
- `src/css/components/header.css`
- `src/css/components/footer.css`
- `src/css/components/hero.css`
- `src/css/components/cards.css`
- `src/css/components/buttons.css`
- `src/css/components/stats.css`
- `src/css/components/faq.css`
- `src/css/components/cookie-banner.css`
- `src/css/features/parallax.css`
- `src/css/features/gallery.css`
- `src/css/features/marquee.css`
- `src/css/features/lightbox.css`
- `src/css/pages/home.css`
- `src/css/pages/services.css`
- `src/css/pages/about.css`
- `src/css/pages/book.css`
- `src/css/pages/contact.css`
- `src/css/pages/estate-agents.css`

JS source:

- `src/js/header-nav.js`
- `src/js/scroll-reveal.js`
- `src/js/stats.js`
- `src/js/parallax.js`
- `src/js/hero-shader.js`
- `src/js/magnetic-buttons.js`
- `src/js/marquee.js`
- `src/js/gallery.js`
- `src/js/cookie-consent.js`
- `src/js/contact-form.js`
- `src/js/app.js` (entrypoint)

Built assets:

- `assets/css/styles.css` – single CSS bundle generated from `src/css/**`.
- `assets/js/app.js` – single JS bundle generated from `src/js/**`.

HTML pages must reference only these built bundles plus any essential third‑party scripts (e.g. Calendly, external icon fonts).

---

## Plan of Work

This plan mirrors the step ordering in Section 6 of `Output_2.md`.

### Phase 1 – Environment and capability scan

- Ensure the working tree is clean.
- Record the current commit SHA (for rollback).
- List all key files (HTML, CSS, JS, build scripts) and confirm they match `Output_1.md`.
- Discover available `npm` scripts:

  - Note any `build`, `build:css`, `test`, `lint`, or `format` scripts.
  - If no scripts exist, note that and plan to rely on simple Node commands and searches.

- Re‑load the lists of unused CSS files and selectors from Sections 6.1, 6.2, and 6.3 of `Output_1.md`.

### Phase 2 – Create new `src/css` structure

- Create directories:

  - `src/css/base/`
  - `src/css/components/`
  - `src/css/features/`
  - `src/css/pages/`

- Do not delete any existing CSS yet.
- Add empty placeholder files for all target modules listed in “Desired final structure”.

### Phase 3 – Migrate base CSS

- From `assets/css/styles.css` (and related files), move:

  - CSS variables, color palette, and typographic scales into `src/css/base/variables.css`.
  - Global text styles, headings, body copy rules into `src/css/base/typography.css`.
  - Layout primitives (containers, grids, sections, spacing) into `src/css/base/layout.css`.

- Remove these base rules from the old CSS files once they are safely migrated.
- Ensure no base concerns remain in component or page modules.

### Phase 4 – Migrate component CSS

For each component module:

- `src/css/components/header.css`

  - Header layout, navigation links, services overlay, active states.

- `src/css/components/footer.css`

  - Footer layout and typography, moving any useful rules out of `footer.css` and `styles.css`.

- `src/css/components/hero.css`

  - Hero section layout, hero copy, buttons within hero, hero media container, and WebGL canvas wrapper.

- `src/css/components/cards.css`

  - Shared card styles for all card types (neon cards, feature cards, value cards, pricing cards, stats cards, FAQ items).

- `src/css/components/buttons.css`

  - Core `.btn` baseline, variants, hover/active/focus states, alignment with `magnetic-buttons.js`.

- `src/css/components/stats.css`

  - Stats section, counters, layout around stats blocks.

- `src/css/components/faq.css`

  - FAQ item layout, expansion/collapse cues.

- `src/css/components/cookie-banner.css`

  - Cookie banner positioning, typography, close button.

Process:

- Move rules from `styles.css`, `custom.css`, `custom-styles.css`, `services.css`, and inline styles into the appropriate component modules.
- Use searches and `Output_1.md` to ensure each selector is moved to exactly one module.
- After migration, remove the moved rules from the original CSS files.

### Phase 5 – Migrate feature CSS

- `src/css/features/parallax.css` – background layers, parallax offsets, and scroll effects.
- `src/css/features/gallery.css` – innovation gallery grid, image treatments, lightbox overlay.
- `src/css/features/marquee.css` – single and double marquee rows, animations, responsive behavior.
- `src/css/features/lightbox.css` – lightbox overlay, transitions, content styling.

Process:

- Consolidate all parallax, gallery, marquee, and lightbox rules from existing CSS files.
- Remove legacy `neural-grid` rules that are truly unused.

### Phase 6 – Migrate page‑specific CSS and inline styles

For each page:

- `src/css/pages/home.css`
- `src/css/pages/services.css`
- `src/css/pages/about.css`
- `src/css/pages/book.css`
- `src/css/pages/contact.css`
- `src/css/pages/estate-agents.css`

Tasks:

- Move inline `<style>` blocks from each HTML page into the corresponding page module.
- Move page‑specific layout tweaks from `styles.css`, `custom.css`, `custom-styles.css`, and `services.css` into the page modules.
- Update HTML to remove inline `<style>` tags once everything has been migrated.

### Phase 7 – Build CSS bundle

- Implement a simple build pipeline (or reuse `build-css.js`) that:

  - Concatenates or processes `src/css/base/*.css`, `src/css/components/*.css`, `src/css/features/*.css`, and `src/css/pages/*.css` into a single `assets/css/styles.css`.
  - Ensures ordering is sensible: base → components → features → pages → responsive overrides.

- Ensure:

  - All styling needed for the site is present in the new `assets/css/styles.css`.
  - Old CSS files (`custom.css`, `custom-styles.css`, `mobile.css`, `parallax-fix.css`, `premium-gallery.css`, `services.css`, `marquee-*.css`, `icons.css` if merged) are no longer required, except where they remain as external‑resource wrappers.

### Phase 8 – Remove unused and legacy CSS assets

- Using the lists from `Output_1.md` Section 6.1 and the new structure:

  - Delete `assets/css/neural-grid.css`, `home-services-fix.css`, `footer.css` and any other now‑obsolete CSS files once confirmed unused.
  - Confirm via search that no HTML or JS still references any removed CSS filenames.

### Phase 9 – Create `src/js` modules

- Create `src/js/` with modules:

  - `header-nav.js` – header, nav, services overlay behavior.
  - `scroll-reveal.js` – intersection observer / scroll reveal effects.
  - `stats.js` – stats counters and any animated numbers.
  - `parallax.js` – parallax scrolling behavior.
  - `hero-shader.js` – WebGL hero canvas initialization.
  - `magnetic-buttons.js` – magnetic hover for buttons.
  - `marquee.js` – single and double marquee behaviors.
  - `gallery.js` – innovation gallery interactions (including any lightbox).
  - `cookie-consent.js` – cookie banner show/hide and local storage.
  - `contact-form.js` – contact form enhancement / Netlify or email integration.
  - `app.js` – entrypoint that wires all initializers.

Process:

- Extract logic from `assets/js/script.js` into the appropriate modules.
- Move code from `hero-shader.js`, `cookie-consent.js`, `magnetic-buttons.js`, `marquee-*.js`, and `premium-gallery.js` into the `src/js` equivalents.
- Ensure each module exports a single initializer function and gracefully no‑ops when its target elements do not exist.

### Phase 10 – Build JS bundle

- Implement a simple build step (Node script or bundler) that combines the `src/js` modules into `assets/js/app.js`.

  - For this static site, a straightforward concatenation with clear ordering is acceptable as long as it is deterministic and maintainable.

- Ensure the bundle exports or invokes the entry logic in `src/js/app.js`.

### Phase 11 – Update HTML `<link>` and `<script>` tags

- For every HTML page:

  - Replace multiple CSS `<link>` tags for local CSS with a single `<link>` to `assets/css/styles.css` (plus any required external icon or font links).
  - Replace local JS `<script>` tags for `script.js`, `hero-shader.js`, `cookie-consent.js`, `magnetic-buttons.js`, `marquee-*.js`, `premium-gallery.js`, and `neural-grid.js` with a single `<script>` tag for `assets/js/app.js`.
  - Keep external scripts (e.g. Calendly widgets) as separate tags.

- Use relative paths appropriate for nested pages like `niches/estate-agents.html`.

### Phase 12 – Remove legacy JS files

- After verifying that all behavior works through the new `assets/js/app.js` bundle:

  - Delete the legacy JS files from `assets/js/`:

    - `script.js`
    - `hero-shader.js`
    - `cookie-consent.js`
    - `magnetic-buttons.js`
    - `marquee-single.js`
    - `marquee-double.js`
    - `premium-gallery.js`
    - `neural-grid.js`

- Ensure there are no remaining references to these filenames in HTML or build scripts.

### Phase 13 – Automated validation checks

- Run all relevant commands discovered in Phase 1:

  - `npm run build` and/or `npm run build:css`, if present.
  - Any `lint`, `format`, or `test` scripts, if present.

- Run repo‑wide searches to confirm:

  - Old CSS filenames are not referenced.
  - Old JS filenames are not referenced.
  - Unused selectors identified earlier have been removed.

- Fix any issues revealed by these checks.

### Phase 14 – Hand‑off and human validation

- Update this ExecPlan:

  - Mark all completed steps in the Progress section.
  - Fill out the Outcomes & Retrospective section.
  - Ensure the Decision Log captures any deviations from `Output_2.md`.

- Add a concise human validation checklist (browser flows) under “Validation and Acceptance”.

---

## Concrete Steps

As you work, keep this section aligned with the actual commands you are running. At minimum, it should include:

- Environment preparation commands:

  - `npm ci` or `npm install` (depending on lockfile presence).
  - `npm run build` or `npm run build:css` once the new pipeline exists.

- Search commands:

  - For tracking unused assets and selectors.
  - For confirming that references to removed files are gone.

- Build and validation commands:

  - Bundling CSS and JS.
  - Any test or lint scripts.

Update this section as new scripts are added or existing ones change.

---

## Validation and Acceptance

The refactor is considered successful when:

- All pages (`index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`, `niches/estate-agents.html`) render correctly and behave as before, including:

  - Header navigation and services overlay.
  - Hero sections and parallax scrolling.
  - Service cards and innovation gallery (including lightbox).
  - Marquee behavior where applicable.
  - Cookie banner and contact form behavior.

- CSS:

  - All styling originates from `src/css/**` and is bundled into `assets/css/styles.css`.
  - Legacy CSS files listed in this plan and in `Output_1.md` Section 6.1 are removed.
  - No unused, clearly dead selectors from the earlier unused‑selector list remain.

- JS:

  - All interactive behavior is implemented by `src/js/**` and bundled into `assets/js/app.js`.
  - Legacy JS files listed in this plan are removed.
  - No old JS filenames remain in HTML or build scripts.

- Automated checks:

  - All build, lint, and test commands discovered during the environment scan complete successfully.
  - Any new scripts introduced as part of the refactor also pass.

---

## Idempotence and Recovery

- Each phase should be safe to rerun after a clean git checkout.
- If an operation fails halfway (e.g. partial file moves):

  - Use `git status` to see which files changed.
  - Revert partial changes with `git restore` or `git checkout` where appropriate.
  - Reapply the step following the instructions in this plan.

- Avoid destructive operations that cannot be reversed with git.

---

## Artifacts and Notes

Use this section for the most helpful supporting artifacts:

- Short sample diffs showing the before/after structure of key files.
- Minimal build outputs when documenting validation steps.
- Any small code snippets that clarify how modules are wired together.

Keep artifacts concise so this plan stays readable.

---

## Interfaces and Dependencies

Key “interfaces” to keep stable:

- CSS selectors and IDs used as JS hooks (as identified in `Output_1.md`).
- HTML structure required by the new components and features.
- Paths and names of build scripts (`build-css.js`, any new JS build scripts).
- Final built assets:

  - `assets/css/styles.css`
  - `assets/js/app.js`

All changes must respect these interfaces as they are defined or evolved in this plan.
