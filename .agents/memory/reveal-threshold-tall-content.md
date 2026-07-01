---
name: RevealSection whileInView threshold vs tall content
description: A fractional viewport `amount` permanently hides any reveal block taller than viewport/amount; use amount:"some" for content wrappers of unknown height.
---

# whileInView `amount` threshold silently hides tall blocks (opacity:0 forever)

**Rule:** A motion `whileInView` reveal that starts at `initial="hidden"` (opacity:0)
and uses a fractional `viewport.amount` (e.g. 0.24) will NEVER transition to `show`
if the element is taller than `viewport_height / amount`. The IntersectionObserver
ratio caps at `viewport_height / element_height`; for a block several times the
viewport height that cap sits below the fractional threshold, so the reveal never
fires and the block stays painted invisible even though its content is fully in the DOM.

**Why:** The shared `RevealSection` (used by `RoutePageFrame` to wrap page `{children}`)
wrapped a full service body (~10,900px, ~12× viewport). At amount 0.24 it needed ~24%
visible but max achievable was ~8% → reveal never fired → the entire body copy was
invisible while small siblings (h1, "Related pages" nav) revealed fine. User-visible
symptom: frame chrome renders but the body copy is missing.

**How to apply:** For any RevealSection / content wrapper whose height is unbounded or
unknown, use `viewport.amount: "some"` (threshold 0 — fires as soon as any pixel enters),
NOT a fractional amount. Keep fractional `amount` (`motionViewport.standard`) only for
small, bounded sections. The token `motionViewport.block`
(`{ once:true, margin:"0px 0px -12% 0px", amount:"some" }`) exists for exactly this.
Diagnose with a Playwright `getComputedStyle(opacity)` walk up the ancestor chain — the
culprit is an empty-className `m.div` with `opacity:0` + a `translateY` transform.
