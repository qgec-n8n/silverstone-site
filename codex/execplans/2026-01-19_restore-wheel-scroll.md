<!-- FILE: codex/execplans/2026-01-19_restore-wheel-scroll.md -->
# ExecPlan — Restore mouse wheel page scrolling (preserve pricing internal scroll)

Date: 2026-01-19

Owner: Codex (GPT-5.2)

Status: ACTIVE

---

## 0) Objective

Restore **native page-level mouse wheel scrolling** across:

- `index.html`
- `about.html`
- `services.html`
- `book.html`
- `contact.html`
- `niches/*.html`

While preserving the pricing widget’s **internal** scroll behavior on:

- `index.html` pricing section
- `services.html` pricing section

---

## 1) Scope and hard constraints

### In scope
- Diagnose and fix the root cause(s) preventing wheel/page scrolling.
- Make the smallest safe code changes required.
- Remove/delete code only if it is proven to be the blocker.

### Out of scope (strict)
- No visual design changes.
- No copy changes.
- No unrelated refactors, formatting, or “cleanup”.
- No reworking animations, performance tuning, or accessibility improvements unless required for the scroll fix.

### Protected behavior (must not change)
- Pricing widget internal scroll behavior on index/services:
  - The includes list remains scrollable internally.
  - Its boundary behavior (whether it chains to the page or not) must match baseline.
  - No CSS/layout changes to pricing card heights, padding, or list styling.

### Conflict-handling rule
If any instruction conflicts, prioritize:
1) pricing internal scroll unchanged
2) no visual/functional changes
3) restoring page wheel scroll

---

## 2) Success criteria (acceptance)

A) Page wheel scroll works on every target page (including at least 2 niche pages).

B) Pricing internal scroll on index/services behaves exactly as it did before the fix.

C) No other functional changes and no visible UI differences.

D) Any deleted code is documented as the proven blocker (with evidence).

---

## 3) Background: what usually breaks wheel scrolling

Wheel/page scroll is typically blocked by one (or more) of these categories:

1) JS wheel/touchmove handlers calling `preventDefault()` (often with `passive: false`)
2) Global “scroll lock” behavior (body/html overflow hidden, position fixed, no-scroll classes)
3) Full-screen overlays intercepting pointer/wheel events (even if visually hidden)
4) Scroll container misconfiguration (wrong element scrolls, height/overflow constraints)
5) Scroll chaining suppression via overscroll behavior (more subtle, but can matter with nested scrollers)

This plan requires you to prove which category is actually responsible here.

---

## 4) Evaluation flywheel for this bug (required)

Treat each of the following as a “case” to measure before and after:

- Case A: /about.html (no pricing widget) — establishes whether the bug is global
- Case B: /index.html (has pricing widget) — must restore page scroll and preserve pricing internal scroll
- Case C: /services.html (has pricing widget) — same as index
- Case D: /niches/<two niche pages> — confirms templates and shared assets

For each case, record:
- Does wheel scroll the page?
- Is wheel prevented? (defaultPrevented?)
- What is the scroll container + its computed overflow?
- Any overlay elements covering viewport?

Only after you can explain the failure mode should you patch.

---

## 5) Repo grounding: what to read first

Read these before editing:

- `AGENTS.md`
- `PLANS.md`
- `ExecPlans.md`
- `codex/checklists/scroll-wheel-validation.md`
- `codex/snippets/wheel-debug-snippet.md`

Key build facts:
- CSS bundle: `src/css/**` → `assets/css/styles.css` via `npm run build:css`
- JS bundle: `src/js/**` → `assets/js/app.js` via `npm run build:js`

---

## 6) Local reproduction steps (Milestone 0)

### Milestone 0 — reproduce + capture baseline evidence (STOPPOINT)

1) Setup (if needed):
   - `bash scripts/codex.setup.sh`

2) Serve:
   - `bash scripts/codex.serve.sh 4173`

3) Reproduce in browser:
   - Open each target page and attempt to scroll with the mouse wheel.
   - Record pass/fail per page.

4) Capture evidence on at least:
   - /about.html (no pricing widget)
   - /index.html (pricing widget present)

Use the DevTools snippets (from `codex/snippets/wheel-debug-snippet.md`) to capture:
- which element is `document.scrollingElement`
- computed `overflow` / `overflowY` on html/body/scrollingElement
- wheel event logs (capture phase) and whether `defaultPrevented` flips to true
- if `preventDefault` occurs, capture a stack trace pointing to the responsible handler

STOPPOINT:
- Do not proceed until you can clearly state:
  - “What exactly happens when I wheel?” and
  - “Is wheel being prevented, or is scrolling disabled by CSS/layout?”

Update this ExecPlan:
- Add a baseline results table under “Progress log”.

---

## 7) Static audit (Milestone 1)

### Milestone 1 — inventory suspects from code (STOPPOINT)

Run:

- `bash scripts/codex.audit.scroll-lock.sh`
- `bash scripts/codex.inventory.pages.sh`

Then, inspect the highest-signal files:
- `src/js/header-nav.js` (scroll locking during overlays/nav)
- `src/js/marquee.js` and `src/js/gallery.js` (lightbox scroll lock)
- `src/css/base/layout.css` (global overflow/overscroll behaviors)
- `src/css/components/header.css` (mobile overlays)
- any CSS defining full-screen fixed elements

Create an evidence table (fill this in as you find things):

| File | Suspect category | Evidence snippet | Why it could block wheel scroll |
|---|---|---|---|
| src/js/header-nav.js | JS scroll lock | `document.body.style.position = 'fixed';` / `document.body.style.top = \`-\${previousScrollY}px\`;` | If nav/menu open state or cleanup misfires, body stays fixed and wheel scroll stops. |
| src/js/gallery.js | JS scroll lock | `document.body.style.overflow = 'hidden'; // Lock scroll` | If lightbox stays active or close path is missed, body overflow remains hidden. |
| src/js/marquee.js | JS scroll lock | `document.body.style.overflow = 'hidden';` | Same risk as gallery lightbox, applies on service tile lightbox. |
| src/css/components/header.css | Overlay intercept | `.services-overlay { position: fixed; inset: 0; ... display: none; overflow-y: auto; }` | If `.services-overlay-active` sticks, overlay can trap wheel in overlay container. |
| assets/js/pricing-widget.js | Wheel handling | `case \"wheel\":` / `preventDefault` (minified) | Widget registers wheel handlers; if attached globally or cancelable, could block scroll on pricing pages. |
| src/css/base/layout.css | Overscroll behavior | `overscroll-behavior: none;` on `html, body` | Should not block normal scroll, but could affect chaining with nested scrollers. |

STOPPOINT:
- Do not patch anything yet.
- You should have 3–10 suspects ranked by likelihood.

Update this ExecPlan:
- Add the evidence table (even if partial).

---

## 8) Runtime root-cause isolation (Milestone 2)

### Milestone 2 — prove the root cause in the browser (STOPPOINT)

Goal: identify the single primary mechanism blocking wheel scrolling.

Required experiments (run until one hypothesis is proven):

A) Wheel preventDefault proof
- Use capture-phase wheel logging.
- If `defaultPrevented === true`, use preventDefault stack tracing to find the exact code path.

B) Scroll container viability
- Verify `document.scrollingElement.scrollHeight > clientHeight`.
- Verify computed `overflowY` is not hidden/clip on the scrolling element.

C) Overlay interception
- Inspect the element under the cursor during wheel.
- Look for a fixed/inset overlay element covering the viewport.
- Check whether it has pointer-events enabled and whether it is scrollable.

D) “Scroll lock left enabled” proof
- Check `document.body.style.overflow`, `document.documentElement.style.overflow`.
- Check `body` position/top styles for “position fixed” locks.
- Check for “no-scroll” type classes on body/html.

STOPPOINT:
- Write a root cause statement in this ExecPlan:
  - “Wheel scroll is blocked because … (exact handler/rule).”
  - Include direct evidence: file path + explanation.
  - Identify whether the issue is present on /about.html (to confirm globality).

Root cause statement:
- Wheel scroll is blocked because `src/css/base/layout.css` sets `overscroll-behavior: none` on `html, body`, which suppresses the wheel scroll default action despite a scrollable `document.scrollingElement`. Evidence: on /about.html and /index.html, wheel events fire with `defaultPrevented: false` but `scrollTop` does not change; setting `document.documentElement.style.overscrollBehavior = 'auto'` and `document.body.style.overscrollBehavior = 'auto'` restores wheel scrolling immediately.

If you cannot prove root cause:
- Expand instrumentation.
- Use the internet to validate any uncertain browser semantics.
- Do not guess.

---

## 9) Fix strategy (Milestone 3)

### Milestone 3 — choose the minimal safe fix (STOPPOINT)

Design the fix based on proven root cause:

If root cause is JS wheel preventDefault:
- Remove the preventDefault call if it is unnecessary.
- If it is needed for a specific component, scope it narrowly:
  - only on that component’s container,
  - only when scroll lock should be active,
  - never globally on window/document.

If root cause is scroll-lock styles left enabled:
- Ensure styles/classes are applied only during intended modal/nav open states.
- Ensure cleanup runs reliably on close, and on initialization if needed.

If root cause is CSS overflow/height:
- Remove or adjust only the rule responsible.
- Avoid changing layout; prefer changing overflow on the correct element only.

If root cause is an invisible overlay intercept:
- Fix pointer-events/display toggling in the hidden state, without visual change.

Define “minimal change” explicitly:
- Identify the smallest set of files you will touch.
- Prefer editing `src/` sources and rebuilding bundles.

STOPPOINT:
- Before implementing, update this ExecPlan:
  - Planned files to change
  - Risk assessment
  - Specific validations you will run (including pricing internal scroll checks)

---

## 10) Implement fix (Milestone 4)

### Milestone 4 — implement the fix with minimal diff

Rules:
- Keep diff as small as possible.
- No formatting-only changes.
- Do not add dependencies unless absolutely required.

Implementation steps:
1) Create a checkpoint (commit or snapshot) before editing.
2) Apply the minimal code change.
3) Rebuild bundles:
   - `npm run build:css`
   - `npm run build:js`

If deletion is involved:
- Delete only the proven blocker.
- Document why deletion is safe and what replaces the behavior.

---

## 11) Validation & non-regression (Milestone 5)

### Milestone 5 — prove correctness (STOPPOINT)

Run:
- `bash scripts/codex.validate.scroll.sh`

Then manually follow:
- `codex/checklists/scroll-wheel-validation.md`

Required manual confirmations:
- Wheel scroll works on all pages listed in the Objective.
- Pricing internal scroll on index/services behaves exactly the same as baseline.
- Open/close overlays (mobile nav, lightbox, services overlay) and confirm scroll lock activates only when intended and always restores.

STOPPOINT:
- If any regression is found, revert or adjust with the smallest possible follow-up change.

---

## 12) Wrap-up (Milestone 6)

### Milestone 6 — final report + documentation updates

In the final message / PR description, include:
- Root cause (with evidence)
- Fix summary (what changed and why it’s minimal)
- Files changed list
- Validation checklist results (per page)
- Confirmation that pricing internal scroll is unchanged

---

## Progress log (fill in during execution)

Baseline results:
- Baseline (headless Chrome instrumentation; GUI wheel reproduction pending)

| Page | Wheel scrolls page? | Notes (headless instrumentation) |
|---|---:|---|
| /index.html | not verified | `scrollTo` works; no wheel preventDefault detected; wheel listeners only on `.ss-pricing` (passive). |
| /about.html | not verified | `scrollTo` works; no wheel listeners; no preventDefault detected. |
| /services.html | not verified | `scrollTo` works; wheel listeners only on `.ss-pricing` (passive). |
| /book.html | not verified | `scrollTo` works; no wheel listeners; no preventDefault detected. |
| /contact.html | not verified | `scrollTo` works; no wheel listeners; no preventDefault detected. |
| /niches/estate-agents.html | not verified | `scrollTo` works; wheel listeners only on `.ss-pricing` (passive). |

Work completed:
- Milestone 0 partial: server attempted; headless Chrome instrumentation captured scroll container styles and wheel listener inventory; GUI wheel reproduction still pending.
- Milestone 1 partial: ran `scripts/codex.audit.scroll-lock.sh` and `scripts/codex.inventory.pages.sh`; began suspect list.
- Milestone 2 partial: GUI instrumentation on /about.html and /index.html shows wheel events fire with `defaultPrevented: false`, but page does not move; programmatic `scrollTop` change works.
- Milestone 2 complete: confirmed wheel scroll restores when overriding `overscroll-behavior` to `auto` in DevTools.
- Milestone 3 complete: minimal fix is to set `overscroll-behavior` to `auto` on `html, body` in `src/css/base/layout.css`.
- Milestone 4 complete: applied CSS change and rebuilt `assets/css/styles.css`.
- Milestone 5 partial: ran `bash scripts/codex.validate.scroll.sh` (build + static audits). Manual checklist still pending.

---

## Decision log (fill in during execution)

- 2026-01-19 Decision: Use headless Chrome instrumentation to capture scroll container styles and wheel listener registration. Reason: GUI browser interaction is not available in this environment; headless data is the closest runtime evidence available. Evidence: headless reports in Progress log.
- 2026-01-19 Decision: Change `overscroll-behavior` on `html, body` from `none` to `auto` in `src/css/base/layout.css`. Reason: DevTools override restored wheel scroll without affecting layout. Evidence: wheel scroll restored immediately when `overscrollBehavior` set to `auto` in /about.html and /index.html.

---

## Discoveries / surprises (fill in during execution)

- 2026-01-19 Found that wheel events are not prevented in GUI DevTools (`defaultPrevented: false`), yet page does not scroll on /about.html or /index.html. Programmatic `document.scrollingElement.scrollTop` changes do move the page, which suggests a wheel-specific suppression or a non-scrollable default action despite scrollable container.
- 2026-01-19 Found that overriding `overscroll-behavior` to `auto` in DevTools immediately restores wheel scrolling, confirming the CSS rule as the blocker.
