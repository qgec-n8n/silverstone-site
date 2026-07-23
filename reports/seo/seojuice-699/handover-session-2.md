# Handover — Session 2

## State

| Item | Value |
|---|---|
| Repo | `/Users/quentingeczy/Desktop/silverstone-site` (`github.com/qgec-n8n/silverstone-site`) |
| Branch | `seo/seojuice-699-session-1` |
| HEAD | `bfcc95cd` — *fix(seo): stop SEOJuice rewriting live metadata; declare blog og:image size* |
| Parent / `main` / `origin/main` | `49c3f617` — all three identical; `main` is untouched |
| Working tree | clean except untracked `claude-seo/` (unrelated plugin dir — leave it) |
| Pushed / deployed | **No.** Nothing pushed, nothing deployed, no production settings changed. |

## Read first
`count-reconciliation.md` → `root-cause-groups.md` → `staged-remediation-plan.md`
→ `session-1-changes.md`. Then `issue-cards.csv` (699 rows, one per card, with
`status`, `root_cause_groups`, `stage`) and `issue-instances.csv` (701 rows,
card × URL, each carrying live-measured evidence).

Source export: `/Users/quentingeczy/Desktop/SEOJuice - All 699 Issues.rtf` — do
not modify. Convert a copy with `textutil -convert txt`.

## Settled — do not re-investigate

1. **699 cards is accurate**; 701 URL instances across **59 URLs** — ~12 cards
   per page. 10 exact duplicates (cards 491–500 repeat as 501–510).
2. **All 59 live URLs** are 200, have a meta description, exactly one
   prerendered h1, a self-referencing canonical and JSON-LD; min `<main>` text
   is 2,492 chars. The meta-description (389), thin-content (188), schema (244)
   and dates (85) families are **refuted by measurement**.
3. SEOJuice's 481/530/543-char figures reproduce a **pre-`49c3f617`** crawl.
4. **FAQ rich results were deprecated by Google in May 2026** — do not add
   FAQPage schema (151 cards).
5. **RC-06 is fixed**: the SEOJuice script rewrote titles on 3/3 pages; it is
   now gated behind `VITE_SEOJUICE_ENABLED`, default off. 0 references in
   `build/client`.
6. The build already gates one-h1 and an 800-char floor
   (`generate-seo-artifacts.mjs:392-397`, `:378-386`).
7. **SEOJuice MCP is not connected** — no server in `.mcp.json`. Confirmation
   needs deploy + recrawl.

## Stage 2 scope (235 cards / 238 instances)
Rendering-only heading semantics, all invisible to the build gate. Full table
with file:line in `staged-remediation-plan.md` §Stage 2. Highest value:

- **2.1** `visual/components/route-experience-intro.tsx:96` — intro splash `<m.h1>` → non-heading. Causes a second h1 in the hydrated DOM on **every gated non-home route**. Prerendered = 1, hydrated = 2 (measured live).
- **2.2** `components/layout/shell/site-footer.tsx:160` — 3 × `<h2>` on every route.
- **2.3** Silktide modal `<h1>` — re-tag post-init; also gives the modal an accessible name (currently no `role="dialog"`, no `aria-modal`, no label).
- **2.4/2.5** h2→h4 skip on 31 articles + 2 service pages.
- **2.6** `color: transparent` gradient text — the likely trigger for the 2 contrast cards.
- **Guard:** extend `crawlable-content.spec.ts` to assert raw HTML, scope to `<main>`, count h1 in the hydrated DOM, and assert hydrated `document.title` equals the prerendered `<title>`.

## Risks / constraints
- Design and interaction are **fixed constraints**. 2.1 touches a visual
  component: verify with a production build + screenshot diff before/after
  Explore, desktop and mobile, that the splash title is pixel-identical.
  Tailwind preflight normalises h1 margins/size, which is why the swap is
  expected to be inert — **prove it, don't assume it**.
- Do not push or deploy without explicit instruction.
- `npm run format:check` fails on `web/src/data/blog-posts.ts` **at HEAD** —
  pre-existing, n8n-generated, not yours.
- `route-entry.spec.ts` has a known pre-existing failure signature (consent
  banner z-index vs return-to-intro button). Check before blaming a regression.

## First commands
```bash
cd /Users/quentingeczy/Desktop/silverstone-site
git status --short && git log --oneline -3
git rev-parse --abbrev-ref HEAD          # expect seo/seojuice-699-session-1
cd web && npm run test                   # expect 41 files / 211 tests green
```

## Exit criteria for Session 2
1. Stage 2 items implemented with proven UI/UX invariance (before/after
   captures at desktop + mobile, both gate states).
2. Hydrated DOM shows exactly one h1 per route.
3. `npm run test`, `typecheck`, `lint`, `build:production` green;
   `test:a11y` and `test:e2e` run, with any pre-existing failures identified as such.
4. `issue-cards.csv` updated with resolution evidence for Stage 2 rows.
5. `session-2-changes.md` + `session-2-validation.md` written.
6. A Session 3 handover produced if Stage 3 remains.
