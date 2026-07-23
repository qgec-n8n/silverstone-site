# Session 1 validation

| Command | Result |
|---|---|
| `npx vitest run tests/unit/seojuice.test.tsx` | **PASS** 3/3 |
| `npx vitest run tests/unit/blog-posts.test.ts` | **PASS** (after correcting the WebP parser: heroes are lossy `VP8 `, not `VP8X`) |
| `npm run lint` | **PASS** (`--max-warnings=0`) |
| `npm run typecheck` | **PASS** |
| `npm run test` | **PASS — 41 files, 211 tests** |
| `npm run build:production` | **PASS** — all SEO gates green; sitemap index 25 pages + 34 posts, robots.txt, `_redirects` (53 redirects, 45 gone), 404.html |
| `npx prettier --check` (4 changed files) | **PASS** |
| `npm run format:check` (whole project) | **FAIL — pre-existing.** `web/src/data/blog-posts.ts` is unformatted at `49c3f617`; untouched by this session (`git diff --stat` empty for that path). Not a regression. |
| `npm run test:e2e` | **NOT RUN** — full Playwright suite deferred; unit + build gates cover the changed surface, and per project memory `route-entry.spec.ts` has a known pre-existing failure signature (consent banner z-index vs return-to-intro button). |
| `npm run test:a11y` | **NOT RUN** — no a11y-affecting change in Session 1; required for Stage 2. |
| SEOJuice MCP re-check | **BLOCKED — MCP not connected.** No SEOJuice MCP server exists in `.mcp.json`; the `seojuice:*` entries are skills, not a live API. Post-fix confirmation **requires deploy + recrawl**. |

## Post-change build verification

| Assertion | Result |
|---|---|
| `grep -rl seojuice build/client` | **0 files** — dead-code eliminated |
| Blog article `og:image:width` / `height` | `1536` / `864` present |
| Blog article `<h1>` count | 1 |
| Blog article robots | `index, follow` |

## UI/UX invariance

Both changes are `<head>`-only or removal of a third-party script tag. No
component, stylesheet, animation, timing, breakpoint or interaction was
modified. The loader, expandable hero, Explore button, scroll locking, header
reveal, return-to-intro controls, particles and all integrations
(Calendly/Botpress/ElevenLabs) are untouched — none of their files appear in
the diff.

Diff scope: 4 files, all under `web/src/lib/integrations/`,
`web/src/routes/blog/` and `web/tests/unit/`.
