<!-- FILE: AGENTS.md -->
# Agent Rules — Static Site + Embedded React Widgets

These rules apply to Codex agents working in this repo.

## 0) Model constraint
Use only **GPT-5.1 Codex Max** or **GPT-5.2**.

---

## 1) Task selection (do not mix scopes)

This repo has multiple Codex task tracks. Pick ONE per run:

### A) Pricing widget (existing tracks)
- Pricing embed: `codex/CODEX_INIT_PROMPT.md` + `ExecPlan.md`
- Pricing UI tuning: `codex/CODEX_INIT_PROMPT_PRICING_UI_TUNING.md` + `ExecPlan_Pricing_UI_Tuning.md`

### B) Site UI fixes (THIS track)
- Use: `codex/CODEX_INIT_PROMPT_SITE_UI_FIXES.md`
- Follow: `.agent/ExecPlan.SiteUI.Fixes.md`
- Spec: `codex/SITE_UI_FIXES_SPEC.md`

Do not interleave pricing work with site UI work in the same run.

---

## 2) Safety rules (must follow)
- Minimize diffs. No mass formatting changes.
- No unrelated refactors.
- Respect desktop-vs-mobile gating.
- Keep build architecture: edit `src/**` + `.html`, then rebuild outputs.

---

## 3) Site UI fixes: hard constraints (summary)
For full detail, follow `codex/SITE_UI_FIXES_SPEC.md`. Key non-negotiables:
- Desktop Services dropdown must open on hover AND include a hoverable “corridor” covering the gap to the dropdown.
- Spacing must be uniform site-wide for `.section` blocks, with tighter spacing applied at specified boundaries on `services.html` and `niches/*.html`.
- Mobile marquees must not show late-loading pop-in; preload/decode before animation.

---

## 4) Verification rules (Site UI fixes)
Before finalizing:
- `npm run build`
- `bash scripts/codex.ui-fixes.sh`
- Manual smoke:
  - Desktop Services hover corridor + minimize timing
  - Mobile nav panel timing + “<-- Services” font size parity
  - Mobile marquee: no pop-in during motion
  - Spacing consistency across multiple pages

---

## 5) Stop conditions (must stop and report)
Stop immediately if:
- The hover corridor requirement seems to require a redesign of header layout.
- Uniform section spacing requires rewriting page markup beyond adding/removing utility classes.
- You feel compelled to invent new tokens/classes for Services C1 color rules.
