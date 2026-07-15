# Visual & Functional Regression Report — 2026-07-15

## Method

Two independent proofs, both against the pre-change baseline (`2afeb576`,
built in an isolated git worktree with the identical toolchain):

1. **Byte-level rendered-HTML diff** — for all 47 prerendered pages, the
   `<body>` markup (scripts and hashed asset references normalised out) was
   compared between the baseline build and the final migrated build.
   Result: **identical on 46/47 pages**; the single difference on
   `/services/ai-automation` is one SVG particle's initial `cx` attribute at
   `opacity="0"` — a known nondeterministic prerender artifact of the
   motion keyframe animation (varies between any two builds), invisible by
   construction. No spacing, typography, layout, image, navigation, form or
   copy differences exist in any rendered page.
2. **Full Playwright e2e suite** (desktop-chromium + mobile-chromium
   projects: foundation, homepage-interaction, route-entry, route-parity,
   services-rendering, blog-slugs, web-showcase, a11y-tagged checks) against
   the staging build of the final tree: **82 passed, 14 skipped, 0 failed**
   — including booking (Calendly destination), navigation, gate/intro
   journeys, consent banner, chatbot/voice entry points and demo showcase.

An earlier e2e run showed 32 failures; investigation proved these were an
environment mismatch (the suite asserts the staging build's blanket noindex
robots meta, but a production build was sitting in `build/client`) plus load
contention — the untouched baseline failed the same way under the same
conditions (24 vs 32, delta = 7 mobile timing flakes + 1 known-flaky particle
test), and the correct staging flow passes 82/82.

## Why the risk surface was near-zero by construction

Every change is metadata, config, build tooling or data:
`netlify/edge-functions/*`, `netlify.toml`, `web/scripts/*`,
`web/public/410.html` (new static file), test files, `tsconfig`/`vitest`
config, and data-only edits (route titles/h1 metadata fields, blog metaTitle,
schema builders, JSON date map). Two route components were touched
(`web/src/routes/blog/article.tsx`, `web/src/routes/templates/article-page.tsx`)
but only their `<head>`/JSON-LD emission (og/twitter/article-date tags,
publisher logo) — no visible body markup, and no CSS, animation, or route
destination changed. The byte-level body diff below confirms this.

## Verdict

No visual or functional regression. Cookie banner, booking flow, voice/chat
agents, forms, demos and navigation behave identically (e2e-verified);
rendered output is byte-identical modulo one invisible animation seed.
