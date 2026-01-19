<!-- FILE: codex/execplans/2026-01-19_restore-wheel-scroll.md -->
# ExecPlan: Restore mouse wheel vertical page scrolling (Silverstone site)

Date: 2026-01-19

---

## Mission

Restore **normal vertical page scrolling via mouse wheel** on:
- `index.html`
- `about.html`
- `services.html`
- `book.html`
- `contact.html`
- `niches/*.html`

While ensuring:
- **No other visual or behavioral changes** occur.
- The **pricing feature internal scroll** on `index.html` and `services.html` remains **completely unchanged**.

---

## Acceptance criteria (must all pass)

A. Wheel scroll restored
- On each impacted page, using the mouse wheel anywhere on the main page content causes the page to scroll vertically as expected.

B. Pricing internal scroll preserved
- On `index.html` and `services.html`, the pricing component’s internal scroll area behaves exactly as before.
- Treat these as protected internal scroll targets:
  - `.ss-pricing[data-ss-pricing-page="index.html"][data-ss-pricing-section="2"] .ss-pricing__includes-body`
  - `.ss-pricing[data-ss-pricing-page="services.html"][data-ss-pricing-section="2"] .ss-pricing__includes-body`

C. No collateral changes
- No layout shifts, no typography changes, no animation behavior changes, no new UI, no removed UI.

D. Minimal diff
- The fix changes the fewest lines possible and touches the fewest files possible.

---

## Non-goals

- No refactors, no cleanup, no reformatting.
- No changes to pricing widget code unless the root cause is proven to be inside it (high bar).
- No changes to UX beyond restoring page wheel scroll.

---

## Required workflow: evaluation flywheel

### Phase 0 — Setup (required)

[ ] Run repo setup (if not already done): `bash scripts/codex.setup.sh`  
[ ] Start a local static server for testing: `bash scripts/codex.serve.sh`  
[ ] Run scroll-lock audit: `bash scripts/codex.audit.scroll-lock.sh`  
[ ] Read: `ExecPlans.md`, `PLANS.md`, `AGENTS.md`

Stop condition:
- Do not patch anything until Phase 2 produces concrete runtime proof.

---

### Phase 1 — Baseline reproduction matrix (required)

For each page below, record:
- Does the scrollbar appear?
- Does mouse wheel move the page?
- Does keyboard PageDown / Space scroll?
- Does dragging the scrollbar work?
- Where does wheel fail (everywhere vs specific regions)?

Pages:
- [ ] index.html
- [ ] about.html
- [ ] services.html
- [ ] book.html
- [ ] contact.html
- [ ] niches/*.html (test at least 2 niche pages)

Also baseline pricing internal scroll:
- [ ] index.html: verify internal scroll in the pricing “includes” area
- [ ] services.html: verify internal scroll in the pricing “includes” area

---

### Phase 2 — Instrumentation to prove the cause (required)

Goal: determine whether the wheel scroll is blocked by JS event cancellation, CSS scroll locking, or overlay trapping.

#### 2A) Identify the actual scroll container
In devtools console, inspect:
- `document.scrollingElement`
- `document.scrollingElement.scrollHeight` vs `clientHeight`
- computed style:
  - `getComputedStyle(document.documentElement).overflowY`
  - `getComputedStyle(document.body).overflowY`
  - `getComputedStyle(document.scrollingElement).overflowY`

[ ] Record findings for one failing page and one “control” page (if any).

#### 2B) Check for wheel prevention (event-level)
Add temporary devtools console instrumentation (do not commit):
- Add wheel listeners at capture and bubble phases to log:
  - `defaultPrevented`
  - `cancelable`
  - `target` and a short composed path summary

Example snippet to run in console (paste as plain JS):
    (function () {
      const key = '__ssWheelDebug';
      if (window[key]?.cleanup) window[key].cleanup();
      const mk = (phase) => (e) => {
        const t = e.target;
        console.log(
          `[wheel:${phase}] prevented=${e.defaultPrevented} cancelable=${e.cancelable}`,
          t && (t.id ? `#${t.id}` : t.className ? `.${String(t.className).split(' ').join('.')}` : t.tagName),
          t
        );
      };
      const cap = mk('capture');
      const bub = mk('bubble');
      window.addEventListener('wheel', cap, { capture: true, passive: false });
      window.addEventListener('wheel', bub, { capture: false, passive: false });
      window[key] = { cleanup() {
        window.removeEventListener('wheel', cap, { capture: true });
        window.removeEventListener('wheel', bub, { capture: false });
        console.log('[wheel] debug removed');
      }};
      console.log('[wheel] debug installed; call __ssWheelDebug.cleanup() to remove');
    })();

[ ] Determine if `defaultPrevented` becomes true in bubble phase.

If `defaultPrevented` is true:
- Identify which code calls preventDefault:
  - Use devtools “Event Listeners” panel on Window/Document/Body
  - Optionally patch `Event.prototype.preventDefault` in console to capture a stack (temporary only)

#### 2C) Check for overlay trapping (layout-level)
Use devtools to confirm whether a fixed overlay is on top:
- In Elements panel, inspect the element under cursor.
- In console, sample:
  - `document.elementFromPoint(innerWidth/2, innerHeight/2)`
  - `document.elementFromPoint(innerWidth/2, 20)` (top region)
- If a full-screen overlay element is returned, inspect:
  - position, size, pointer-events, visibility, z-index
  - whether it is intended to be inert when closed

[ ] Record any overlay that covers the viewport while “inactive”.

Stop condition:
- If you cannot prove cause, do not patch. Increase instrumentation until proven.

---

### Phase 3 — Repo-wide narrowing (required)

Use the audit output plus targeted searches to find the exact source of the proven cause.

Required search themes:
- JS:
  - wheel listeners: addEventListener('wheel' …)
  - preventDefault on wheel/touchmove/scroll
  - global listeners attached to window/document/body
  - scroll-lock patterns: body.style.overflow, body.style.position, body.style.top
- CSS:
  - html/body overflow-y hidden or clip
  - wrappers set to height 100vh with overflow hidden and full-page overlays
  - pointer-events on full-screen fixed elements
- HTML:
  - onwheel / onmousewheel attributes
  - body classes that might activate scroll-lock styles by default

[ ] Reduce to one primary culprit with file + line references.

---

### Phase 4 — Minimal patch (required)

Patch policy:
- Make the smallest change that removes the proven blocker.
- Prefer scoping over deleting unless deletion is unquestionably safe.
- Do not touch pricing widget code unless the root cause is proven there.

Examples of acceptable fix shapes (choose only if it matches proven cause):
- CSS: remove or override a single scroll-lock rule applied to html/body or a wrapper
- JS: remove a single preventDefault wheel handler, or scope it to a specific component
- Overlay: ensure inactive overlays do not capture wheel events (inert display/pointer-events)

[ ] Implement fix.
[ ] Rebuild only what’s necessary (CSS bundle and/or JS bundle) if you edited sources.
[ ] Confirm diff is minimal.

---

### Phase 5 — Verification & regression (required)

Wheel scroll:
- [ ] index.html
- [ ] about.html
- [ ] services.html
- [ ] book.html
- [ ] contact.html
- [ ] niches page 1
- [ ] niches page 2

Protected behavior: pricing internal scroll
- [ ] index.html pricing includes-body scroll behavior unchanged
- [ ] services.html pricing includes-body scroll behavior unchanged

Regression sanity checks (quick):
- [ ] header nav opens/closes; scroll not broken afterwards
- [ ] any lightbox/modal opens/closes; scroll not broken afterwards
- [ ] mobile viewport sanity (basic check if possible)

No-change check:
- [ ] No visible style/layout changes spotted in primary sections (hero, header, pricing, footer)

---

### Phase 6 — Final write-up (required)

In the final response, include:
- Root cause (1–2 sentences)
- Why it blocked wheel scrolling
- Exact fix summary
- Files changed (with brief justification per file)
- Verification checklist results (pass/fail)
- Explicit statement that pricing internal scroll is unchanged

Done.
