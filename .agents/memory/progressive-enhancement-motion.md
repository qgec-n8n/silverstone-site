---
name: Progressive-enhancement reveal/page-entry motion
description: How /web gates scroll-reveal + page-entry motion so no-JS/reduced-motion always see content, and the hydration caveat it forces.
---

# Progressive-enhancement reveal / page-entry motion (/web)

When mounting the visual motion contract (`usePageTransition`,
`useSectionReveal`) into SSR/prerendered routes, the hidden initial state
(`opacity: 0`, `translateY`) lives in **global** CSS
(`web/src/styles/motion-reveal.css`, imported from `app/app.css`) and MUST be
gated behind BOTH:

- `@media (prefers-reduced-motion: no-preference)`, and
- `html[data-js="on"]`

`data-js="on"` is set on `<html>` by an inline `<script>` in `root.tsx` head.

**Why:** content must never be gated behind motion — only the *settle*
transition is. Without JS, or under reduced motion, the gate is off so every
block renders fully visible. The hooks reinforce this: under reduced motion /
missing IntersectionObserver they resolve `entered`/`revealed` to `true`.

**How to apply:**
- The inline `data-js` script mutates `<html>` before React hydrates, which
  triggers a React hydration **attribute** mismatch. Carry
  `suppressHydrationWarning` on the `<html>` element (canonical theme-script
  pattern). Do NOT render `data-js` in the SSR markup — that would defeat the
  no-JS guard.
- Keep the hooks SSR-stable: `useReducedMotion` uses `useSyncExternalStore`
  with `getServerSnapshot = false`, so the first client (hydration) render
  matches SSR (`ss-page`, no `data-revealed`) — no *structural* mismatch.
- Wrapper components call their hook unconditionally then branch on an
  `enabled` prop; home (`route.path === "/"`) is disabled because it owns its
  own hero motion. `.ss-page` page-entry is opacity-only (no transform) so it
  does not create a transform containing block that would break sticky
  descendants; `[data-reveal]` adds a small translateY that reverts to
  `transform: none` once revealed.
- The transient dev-only "Invalid hook call" / "Hydration failed (tree
  regenerated)" console errors are the Vite re-optimize artifact (see
  vite-react-reoptimize-hook-errors.md), distinct from the `data-js`
  attribute warning; a clean workflow restart clears them.
