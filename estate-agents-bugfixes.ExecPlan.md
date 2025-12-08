# ExecPlan: Estate Agents page bugfixes & layout consistency

**Status:** In progress (Codex must not change this to “Complete”)  
**Owner:** Codex for the Silverstone site  
**Scope:** Estate Agents niche page and shared components (cookie banner, navigation, spacing, card styling, imagery, and Codex config).

This ExecPlan is a living document and must be maintained in accordance with `PLANS.md`.

---

## Purpose / Big Picture

This plan exists to:

- Make the **Estate Agents** niche page feel as polished and robust as the main site.
- Fix cookie-consent behavior across key pages so it is predictable and shared.
- Align navigation and card styling so they feel consistent between the niche page and the main site.
- Preserve the **parallax experience** on both desktop and mobile while focusing first on:
  - Cookie banner,
  - Spacing,
  - Card backgrounds,
  - Desktop nav alignment,
  - Mobile Services pill,
  - Counters,
  - Desktop vs mobile Estate Agents images.
- Ensure the correct imagery (desktop vs mobile, hero vs parallax backgrounds) is used without regressions.

The **mobile URL-bar “jumping” issue** for parallax is explicitly deferred to a **separate ExecPlan** (`parallax-mobile-hardening.ExecPlan.md`) to avoid destructive changes in this phase.

After this plan, users should see:

- A cookie banner that behaves sensibly and consistently across the specified pages.
- Clean, even spacing between key sections on the Estate Agents page, consistent with `index.html`.
- Cards with coherent, darker background opacity on Estate Agents.
- A perfectly aligned Services item in the desktop nav and a coherent Services pill on mobile.
- Parallax still present and visually consistent (even if the mobile URL-bar jump still exists).
- Estate Agents numbers showing `68%` and `42%` as static percentages (no animation).
- Estate Agents imagery switching correctly between desktop (`Real_Estate_*.jpeg`) and mobile (`Real_Estate_*_Mobile.jpeg`) variants.

---

## Progress

- [x] (2025-12-08T22:16Z) Phase 1: Reviewed cookie banner markup and inline styles in `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, and `niches/estate-agents.html`, plus consent storage flow in `assets/js/cookie-consent.js`.
- [x] (2025-12-08T22:16Z) Phase 1: Documented Estate Agents section structure and spacing, including inline `.compact-section` padding and default `.section` spacing, and compared to baseline rhythms on `index.html`.
- [x] (2025-12-08T22:16Z) Phase 1: Mapped Estate Agents card types (`.neon-card`, `.service-content`, `.stat`, `.value-card`, `.dark-card`) and noted where darker styling is applied or missing.
- [x] (2025-12-08T22:16Z) Phase 1: Mapped desktop nav and mobile Services pill structure across `index.html`, `services.html`, `niches/estate-agents.html`, overlay markup, and the `service-pill` styles in `assets/css/styles.css`.
- [x] (2025-12-08T22:16Z) Phase 1: Reviewed parallax selectors and counter logic in `assets/css/parallax-fix.css` and `assets/js/script.js` to understand preservation requirements and animation triggers.
- [x] (2025-12-09T00:33Z) Phase 2: Hardened cookie banner persistence in `assets/js/cookie-consent.js` with safer storage reads/writes and explicit show/hide handling.
- [x] (2025-12-09T00:33Z) Phase 2: Updated Estate Agents stats to static percentages and disabled counter animation via `data-counter="off"` while keeping layout intact.
- [x] (2025-12-09T00:33Z) Phase 2: Swapped Estate Agents hero/service imagery to desktop/mobile variants via `<picture>` sources.
- [x] (2025-12-09T00:33Z) Phase 2: Scoped darker card styling for stats and branch experience content plus compact spacing between key Estate Agents sections.
- [x] (2025-12-09T00:33Z) Phase 2: Aligned desktop nav and mobile Services pill styling via targeted CSS overrides in `assets/css/custom.css` and the Estate Agents inline stylesheet.
- [ ] (pending) Phase 3: Validated all acceptance criteria on desktop and mobile for Estate Agents and related pages.

---

## Surprises & Discoveries

- Observation: All cookie banners (including `niches/estate-agents.html`) ship with inline `display: none` styles and rely on JS to flip to `flex`; if the script fails or exits early, the banner stays hidden. Estate Agents markup also hardcodes inline positioning while others rely on CSS defaults.
- Observation: `assets/js/cookie-consent.js` mixes `localStorage` (`cookieConsentChoice`) with a cookie (`cookieConsent`) for persistence; the script short-circuits if either exists, which could explain reappearance issues when markup duplicates IDs per page.
- Observation: Estate Agents stats use `.stats .number` elements with `data-target` values and no literal `%` signs; without `data-counter="off"`, the shared counter animation in `assets/js/script.js` will animate 68/42 and omit percent suffixes.
- Observation: Estate Agents imagery uses plain `<img>` tags pointing to `Real_Estate_*.jpeg` only; no `<picture>` or CSS swap to the `_Mobile` variants, so mobile devices currently load desktop assets.
- Observation: Navigation uses a mix of anchor links and the Services button (`.services-toggle`), which may explain vertical misalignment on desktop; the mobile overlay pills reuse `.service-pill` styles but the trigger pill within the nav is structurally different from overlay anchors.
- Observation: `assets/css/styles.css` is minified into a single very long line, making direct edits risky; safer to target smaller supplemental CSS files for scoped fixes.
- Observation: Parallax themes on Estate Agents rely on `data-parallax-theme="book"` with backgrounds from `assets/css/parallax-fix.css`; existing sections already opt into parallax, so preservation requires avoiding background overrides.
- Update: Cookie banner script now normalizes storage reads through a helper that tolerates blocked localStorage and falls back to the cookie before deciding to show/hide, reducing flicker and duplicate prompts across pages.
- Update: Stats block now opts out of the global counter observer (`data-counter="off"`) and renders literal `%`/`x` suffixes so animation cannot strip them.
- Update: Desktop nav alignment required flex alignment on list items and both anchors/buttons; mobile Services pill now reuses the gradient/weight from `.service-pill` via targeted overrides instead of ad hoc spacing.
- Update: Estate Agents imagery now uses `<picture>` for the three `Real_Estate_*` assets so `_Mobile` variants load on small screens while preserving parallax backgrounds.

---

## Decision Log

- Decision: Keep Phase 1 strictly analytical and avoid modifying HTML/CSS/JS until hypotheses are documented in this plan per `PLANS.md`.
  - Rationale: Reduces risk of regressions while mapping multiple cross-page issues (cookie, nav, parallax).
  - Date/Author: 2025-12-08 / Codex
- Decision: Plan to scope future styling/layout changes with page-specific selectors (e.g., `body.page-estate-agents`) or localized CSS files instead of editing the minified `assets/css/styles.css` directly.
  - Rationale: `styles.css` is a single-line build artifact; targeted overrides lower the chance of breaking other pages.
  - Date/Author: 2025-12-08 / Codex
- Decision: Preserve existing parallax behaviors in this phase and defer any mobile jump fixes to `parallax-mobile-hardening.ExecPlan.md`.
  - Rationale: Current sections already use `data-parallax-theme` with shared assets; changing the parallax stack here risks regressions and violates scope.
  - Date/Author: 2025-12-08 / Codex
- Decision: Use `<picture>` elements for Estate Agents hero/service imagery to swap to `_Mobile` assets instead of CSS background overrides to avoid parallax interference.
  - Rationale: Keeps existing parallax sections untouched while delivering correct assets per breakpoint.
  - Date/Author: 2025-12-09 / Codex
- Decision: Align nav items by enforcing flex alignment on anchors and the Services button in `assets/css/custom.css`, and reuse the `.service-pill` gradient/weight for the mobile Services trigger.
  - Rationale: Minimizes per-page overrides while addressing both desktop baseline alignment and mobile pill visual mismatch.
  - Date/Author: 2025-12-09 / Codex
- Decision: Disable Estate Agents counters via `data-counter="off"` and hard-coded `%`/`x` values instead of modifying the shared counter logic.
  - Rationale: Avoids impacting other pages’ animated stats while meeting the static-value requirement for this niche page.
  - Date/Author: 2025-12-09 / Codex

---

## Outcomes & Retrospective

Use this section after substantial implementation and validation:

- Summarize which bugs were fixed and how.
- Note where the plan had to be adjusted.
- Identify follow-up work for the parallax-hardening ExecPlan or other future tasks.

---

## Context and Orientation

### Repository context

For this plan, the main files are:

- **HTML**
  - `index.html`
  - `about.html`
  - `services.html`
  - `book.html`
  - `contact.html`
  - `niches/estate-agents.html`

- **CSS**
  - `assets/css/styles.css` – nav, base layouts, global cards/sections (minified, single line).
  - `assets/css/custom-styles.css`, `assets/css/custom.css` – supplemental styling layers for cards/sections.
  - `assets/css/mobile.css` – mobile-specific spacing and layout overrides.
  - `assets/css/parallax-fix.css` – parallax themes and background handling (used by Estate Agents sections with `data-parallax-theme="book"`).
  - `assets/css/services.css` – services-specific layout and cards.

- **JavaScript**
  - `assets/js/cookie-consent.js` – cookie banner logic and persistence via `localStorage` + cookies.
  - `assets/js/script.js` – nav/menu behavior, Services overlay, parallax scroll adjustments, counter animations.
  - `assets/js/hero-shader.js` – hero visuals.

- **Images**
  - Estate Agents imagery:
    - `assets/images/socialmedia/Real_Estate_1.jpeg` / `Real_Estate_1_Mobile.jpeg`
    - `assets/images/socialmedia/Real_Estate_2.jpeg` / `Real_Estate_2_Mobile.jpeg`
    - `assets/images/socialmedia/Real_Estate_3.jpeg` / `Real_Estate_3_Mobile.jpeg`
  - Hero/background images:
    - `assets/images/internet/hero/book-hero-calendly-mobile-2025.webp`
    - `assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp`, `@2x.webp`, `@3x.webp`

- **Config**
  - `.codex/config.toml` – Codex config (model, reasoning effort, features).

### Current-state observations (Phase 1)

- Cookie banner: Each page includes `#cookie-banner` with inline `display: none` and duplicated button IDs; Estate Agents version also inlines positioning. The JS (`assets/js/cookie-consent.js`) checks both `localStorage` and a `cookieConsent` cookie and hides the banner entirely if either exists, but it never removes inline `display: none` without running, which risks a permanently hidden banner if DOM lookup fails.
- Spacing: Estate Agents sections rely on `.section` defaults plus an inline `.compact-section` (3rem top/bottom) only on the stats block; other sections keep full padding, so gaps between “Never Miss a Viewing” → stats and “The branch experience” → “Plug, personalise, launch” likely come from stacked full-height sections without shared compact modifiers.
- Card backgrounds: Only some Estate Agents cards carry `.dark-card` (custom inline style) or neon-card defaults. “Where deals leak away” and “Answer instantly...” use `.neon-card dark-card` on textual panels, but other cards (pricing, FAQs, support) rely on base neon styling, so opacity differs across the page.
- Navigation and Services pill: Desktop nav mixes anchor `<a>` items with a `<button class="services-toggle">` controlling the dropdown. The mobile overlay uses `.service-pill` anchors inside `.services-overlay__grid`, while the nav trigger remains a button, creating potential misalignment and typography mismatches.
- Counters: The “Show the numbers” stats block uses `.stats` with `.number` elements and `data-target` attributes but no percent symbols or `data-counter="off"`. Shared counter logic in `script.js` will animate from 0 and leave raw numbers (68/42) without `%`, conflicting with static target requirement.
- Desktop vs mobile imagery: All Estate Agents images use direct `<img src="...Real_Estate_*.jpeg">` with no `<picture>` or CSS media swap, so mobile currently receives desktop-resolution assets instead of `_Mobile` variants.
- Parallax and backgrounds: Estate Agents parallax sections use `data-parallax-theme="book"`, pulling from `parallax-fix.css` (book hero imagery). JS in `script.js` supplements mobile parallax; any changes to backgrounds risk altering existing overlays, so preservation is critical this phase.


## Plan of Work

### Phase 1 – Analysis-only (no HTML/CSS/JS edits)

1. Cookie-consent:
   - Read `assets/js/cookie-consent.js`.
   - For each relevant page, inspect `#cookie-banner` markup.
   - Document:
     - Storage key(s) used.
     - When the banner is shown/hidden.
     - Differences between Estate Agents and other pages.

2. Estate Agents spacing:
   - In `niches/estate-agents.html`, identify wrappers and classes for:
     - “Never Miss a Viewing” pack.
     - “Show the numbers, not just promises”.
     - “The branch experience after launch”.
     - “Plug, personalise, launch”.
     - “Pricing”.
     - “FAQs”.
   - In `index.html`, find analogous sections and record typical spacing.

3. Card backgrounds:
   - Identify card containers (e.g. `.neon-card`, `.stat`, `.value-card`) on Estate Agents.
   - Locate CSS rules that produce darker card backgrounds (for “Show the numbers”).
   - Note which cards currently share that style.

4. Navigation & mobile Services pill:
   - Inspect header/nav markup in `index.html`, `services.html`, `niches/estate-agents.html`.
   - Inspect nav-related CSS in `assets/css/styles.css`.
   - Document:
     - Why Services sits lower (line-height, padding, flex alignment).
     - How overlay pills and the Services pill are styled/equipped differently on mobile.

5. Counters and imagery:
   - Inspect Estate Agents “Show the numbers” section markup.
   - Inspect counter logic in `assets/js/script.js`.
   - Confirm Real_Estate images usage and whether `<picture>` or CSS is already used.

6. Config:
   - Confirm `.codex/config.toml` uses `model = "gpt-5.1-codex-max"` and `model_reasoning_effort = "xhigh"` and has a `[features]` table enabling web search and image tools.

### Phase 2 – Implementation

Once the above is written into this ExecPlan, implement:

1. Cookie-consent:
   - Unify behavior so that:
     - A single stored consent value (e.g. `cookieConsentChoice`) controls visibility across all relevant pages.
     - Banner appears on load only when no choice is stored.
     - Banner remains visible until Accept/Decline.
     - After Accept or Decline, banner does not reappear.
   - Fix Estate Agents markup and inline styles to follow the same logic (no scroll-flicker behavior).

2. Estate Agents spacing:
   - Adjust section padding/margins for the three problematic gaps:
     - Never Miss ↔ Show the numbers.
     - Branch experience ↔ Plug.
     - Pricing ↔ FAQs.
   - Use existing spacing values (e.g. `3rem`, `4rem`); you may introduce a small utility like `.section-gap-top` scoped to Estate Agents.

3. Card backgrounds:
   - Implement a shared dark card variant for Estate Agents, e.g.:
     - `body.page-estate-agents .neon-card.dark-card` or similar.
   - Apply this to:
     - “Show the numbers” cards.
     - “Where deals leak away”.
     - “Answer instantly…”.
     - “Plug, personalise, launch”.
     - “Safe, compliant, and fully supported”.

4. Desktop nav alignment:
   - Normalize flex alignment and line-height for `nav ul` items and `.services-toggle`.
   - Fix misalignment using robust layout changes (not pixel hacks).

5. Mobile Services pill:
   - Ensure the overlay Services pill has:
     - Same font, size, weight, color, and centering as other overlay pills.
   - Keep the dropdown behavior intact.

6. Counters and percentages:
   - Disable counter animation for Estate Agents “Show the numbers” section (e.g. via `data-counter="off"` or by excluding those elements from the counter logic).
   - Render `68%`, `42%`, and `2x` as static text.
   - Verify other counters remain unaffected.

7. Desktop vs mobile Estate Agents images:
   - Convert Real_Estate image usages into `<picture>` elements or use CSS media queries so that:
     - Desktop uses `Real_Estate_*.jpeg`.
     - Mobile uses `Real_Estate_*_Mobile.jpeg`.

### Phase 3 – Validation

- Walk through each item in **Validation and Acceptance** (below).
- Use desktop and mobile widths to reason about appearance.
- If preview is limited, provide code-based reasoning and clearly label any partially verified items.

---

## Concrete Steps

Codex should translate this Plan of Work into a detailed action list in `Progress` during execution. The key rule:

- Phase 1 entries must be analysis-only (no code edits).
- Later entries must link specific diffs to specific bugs.

---

## Validation and Acceptance

Codex must verify these before treating this plan as functionally complete (even though `Status` remains “In progress”):

1. **Cookie-consent banner**
   - Fresh state:
     - On each of: `index.html`, `about.html`, `services.html`, `contact.html`, `book.html`, `niches/estate-agents.html`:
       - Banner appears on load.
       - Banner remains visible while scrolling until Accept or Decline is clicked.
   - Accepted state:
     - After Accept on any page, reloading each page above does **not** show the banner.
   - Declined state:
     - After Decline in a fresh state, reloading each page above does **not** show the banner.

2. **Estate Agents layout & spacing**
   - On desktop and mobile:
     - Spacing between:
       - “Never Miss a Viewing” ↔ “Show the numbers, not just promises”.
       - “The branch experience after launch” ↔ “Plug, personalise, launch”.
       - “Pricing” ↔ “FAQs”.
     - Is visually similar to the baseline spacing between “Show the numbers” and “The branch experience after launch”.
     - Uses the site’s existing spacing scale.

3. **Card backgrounds**
   - On the Estate Agents page:
     - The following cards share the darker, more opaque background:
       - “Show the numbers, not just promises”.
       - “Where deals leak away”.
       - “Answer instantly. Confirm automatically. Keep the chain warm.”
       - “Plug, personalise, launch”.
       - “Safe, compliant, and fully supported”.
   - Cards on other pages are not unintentionally altered.

4. **Navigation and mobile Services pill**
   - Desktop header on `index.html`, `services.html`, `niches/estate-agents.html`:
     - All nav items, including Services, share a common baseline (no vertical misalignment).
   - Mobile nav/menu:
     - Services pill matches other overlay pills in font family, size, weight, color, and centering.
     - Services pill still opens the Services overlay when tapped.

5. **Backgrounds and parallax (preservation only)**
   - `index.html`, `services.html`, `niches/estate-agents.html`:
     - Existing parallax sections still display appropriate backgrounds and dark overlays.
     - No large unintended zooming, cropping, or “broken” overlays are introduced by this plan.
   - The mobile URL-bar “jumping” issue may still exist; that is acceptable and explicitly addressed later by `parallax-mobile-hardening.ExecPlan.md`.

6. **Counters and percentages**
   - “Show the numbers” on Estate Agents:
     - Displays `68%`, `42%`, and `2x` as static text.
     - No counter animation runs on this section.
     - Layout remains intact.

7. **Desktop vs mobile images**
   - Estate Agents images:
     - Desktop widths show `Real_Estate_1/2/3.jpeg`.
     - Mobile widths show `Real_Estate_1/2/3_Mobile.jpeg`.
   - No 404s or obvious layout shifts.

8. **Configuration**
   - `.codex/config.toml`:
     - Uses `model = "gpt-5.1-codex-max"` and `model_reasoning_effort = "xhigh"`.
     - Has `[features]` with `web_search_request = true` and `view_image_tool = true`.
     - Remains valid TOML.

If any of these fail, Codex must continue iterating rather than editing this plan to claim success.

---

## Idempotence and Recovery

- Prefer incremental, idempotent changes:
  - Small `apply_patch` diffs with minimal context.
  - Page-scoped selectors (`body.page-estate-agents`, `.page-services`) for CSS changes.
- For risky files (especially `assets/css/styles.css`):
  - Avoid reformatting or emitting the whole file.
  - Confine edits to the smallest necessary regions (nav, pills, card styles).
- If a change introduces regressions:
  - Note them in `Surprises & Discoveries`.
  - Revert or narrow the change and attempt a better-targeted fix.

---

## Artifacts and Notes

Codex may record here:

- Key diff snippets (minimal context).
- Example console logs or errors before/after.
- “Before vs after” descriptions for specific features (cookie banner, spacing, nav, pills, cards, imagery).

---

## Interfaces and Dependencies

Key interfaces:

- HTML structure:
  - Nav, cookie banners, Estate Agents sections, stats, cards.
- CSS:
  - Classes and properties in:
    - `assets/css/styles.css`
    - `assets/css/custom-styles.css`
    - `assets/css/custom.css`
    - `assets/css/mobile.css`
    - `assets/css/parallax-fix.css`
    - `assets/css/services.css`
- JS:
  - Functions and event handlers in:
    - `assets/js/cookie-consent.js`
    - `assets/js/script.js`
- Config:
  - `.codex/config.toml`

Codex must:

- Reference these by path and name when discussing changes.
- Avoid renaming or removing core interfaces (e.g. `.parallax-section`, `.services-overlay`, `.cookie-banner`) unless absolutely necessary and documented in `Decision Log`.

This ExecPlan is functionally complete only when all **Validation and Acceptance** criteria are satisfied and the human owner is satisfied with behavior, even though the `Status` remains “In progress” until they explicitly update it.
