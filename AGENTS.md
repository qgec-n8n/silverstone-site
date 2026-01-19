<!-- FILE: AGENTS.md -->
# Codex agent roles & execution rules

Codex should behave like a small team with strict handoffs. Do not jump to patching until diagnosis is evidence-backed.

---

## Global rules (apply to every agent)

- Stay within repo scope for code changes.
- Use internet research to validate browser behavior and known pitfalls, but do not paste external code into the repo.
- Keep diffs minimal; no refactors.
- Treat any “protected behavior” named by the active ExecPlan as a hard constraint.

---

## Agent 1: Repo Scanner (read-only investigator)

Goal:
- Build a complete candidate list of everything that could block wheel/page scrolling.

Must examine:
- CSS: `overflow`, `height`, `position`, `overscroll-behavior`, `scrollbar`, `pointer-events`
- JS: `wheel`, `mousewheel`, `DOMMouseScroll`, `preventDefault`, `passive`, global listeners, scroll-lock utilities
- overlays/modals/nav: anything fixed/inset that could intercept wheel events
- third-party embeds/widgets (if any)

Deliverable:
- A short ranked list of suspects with file paths + line numbers.
- Run and attach outputs from the repo’s scroll audit script(s).

---

## Agent 2: Scroll Diagnostician (runtime proof)

Goal:
- Prove the root cause in the browser using instrumentation and devtools.

Must:
- Reproduce the bug on every listed page.
- Identify the actual scroll container (`document.scrollingElement`) and verify its computed overflow.
- Determine whether wheel events are:
  - prevented (defaultPrevented becomes true),
  - not reaching the document,
  - trapped by an overlay,
  - chained incorrectly due to scroll containers.

Deliverable:
- A single-sentence root cause statement.
- Evidence: the exact CSS rule and/or JS handler responsible.

---

## Agent 3: Minimal Patcher (surgical editor)

Goal:
- Implement the smallest safe code change that restores normal wheel scroll.

Rules:
- Do not touch unrelated files.
- If deletion is required, delete only the proven blocker.
- If scoping is safer than deletion, narrowly scope the behavior (only where needed).

Special protection:
- The pricing feature internal scroll (on `index.html` and `services.html`) must remain unchanged.

Deliverable:
- A minimal diff + rationale.

---

## Agent 4: Verifier (regression-focused)

Goal:
- Prove the fix works and nothing else changed.

Must verify:
- Wheel scroll works on all impacted pages.
- Pricing internal scroll still behaves exactly the same (no new scroll chaining, no new trapping).
- Key overlays/nav/lightboxes still open/close without breaking scroll.
- No visual differences (spot-check + quick before/after screenshots if available).

Deliverable:
- A checklist with pass/fail per page + protected component.

---

## Agent 5: Scribe (final report)

Goal:
- Produce a concise, actionable summary.

Must include:
- Root cause
- Fix description
- Files changed
- Verification steps run
- Any remaining risks (should be none)

