# AGENTS.override

This file is the Codex instruction source for `/web`. It defines the active React application boundary.

## Scope

- `/web` is the active application.
- New implementation work belongs under `/web`.
- Routes, components, styles, tests, content implementation, application assets, scripts, and integrations for the new website belong under `/web`.
- The legacy root website is read-only migration evidence unless a future prompt explicitly names root legacy files.
- Applicable documentation under `/docs/silverstone-transformation/` is authoritative.
- The active homepage uses the V2 dark cinematic presentation layer under `/web/src/visual/home-v2/**`, `/web/src/data/home-v2/**`, and `/web/src/styles/visual/home-v2.css`, routed via `/web/src/routes/company/home.tsx` -> `home-v2.tsx`. It replaces presentation only; routing, data, content, and SEO/staging safety are preserved. See `/docs/silverstone-redesign/`.
- Future work must not assume separate transformation branches exist. Work from the current repository state unless the user explicitly says otherwise.

## Non-Negotiables

- Preserve existing unrelated behavior.
- Evidence first: reproduce and measure before editing when the task changes behavior.
- Minimal diffs only.
- No broad refactors, renames, or style-only formatting churn.
- No production deployment or production integration changes.
- No DNS, Netlify publishing, production analytics, production email delivery, production booking, production environment, or production Calendly mutation.
- Do not commit dependency folders, build output, framework caches, coverage output, Playwright reports, test results, local logs, `.DS_Store`, or editor metadata.

## Required Workflow

1. Read the relevant project documentation before editing.
2. Confirm the current branch and exact scope.
3. Reproduce the issue or baseline with a focused command, test, or inspection.
4. Make the smallest useful change inside `/web/**` unless the user explicitly names another path.
5. Run tests and validation from `/web`.
6. Record the evidence and exact paths changed.

## Capability-selection protocol

- Before substantial `/web` work, read `/docs/codex/skill-mcp-routing.md`.
- Classify every new subtask before selecting capabilities.
- Explicitly load every materially relevant skill for the subtask.
- Query every materially relevant MCP server before designing major UI, choosing library APIs, or changing framework/tooling behavior.
- Use multiple complementary skills and MCPs when they provide distinct value; avoid irrelevant calls.
- Document capability use with task classification, skills loaded, MCPs queried, evidence, decision, implementation, and verification.
- Preserve `/web` as the active application and preserve the V2 design direction.
- Aim for an ultra-futuristic, high-tech, premium, luxurious, and conversion-focused experience.
- Verify work through browser inspection and automated tests before claiming completion.

## Image-Asset Review Gate

- Before designing or substantially revising any route, read:
  - `/docs/codex/image-assets/page-image-selection-policy.md`
  - `/docs/codex/image-assets/verified-image-asset-manifest.json`
  - `/docs/codex/image-assets/route-image-candidates.json`
- Inspect actual shortlisted files before selecting them.
- Use relevant high-quality existing imagery where it improves the page.
- Do not omit images merely for implementation convenience.
- Do not add images without a clear design function.
- Prefer verified high-fit assets and proper desktop/mobile pairs.
- Record the page-level image decision.

## Industry Background Invariant

- `/industries` and `/industries/*` use Cybercore intro plus Background Gradient body.
- No other route may use those backgrounds.
- Industry routes must not mount Aether or `particles.js`.
- All non-industry routes retain Aether plus `particles.js`.
- CoreSpin Loader and Expendable Hero Button remain canonical and shared.

## Implementation Boundary

- Use the approved React Router/Vite application architecture inside `/web`.
- Keep `/web` isolated from the frozen legacy root until a separately approved cutover.
- Treat non-`/web` changes as governance, documentation, or configuration changes only when explicitly required by the task.
- Source-controlled generated application contracts under `/web/src/**/generated/` may be changed only through their documented scripts or with matching source evidence.

## Validation Gates

- Run commands as `cd web && <command>`.
- Do not claim success without fresh verification.
- Keep tests, screenshots, and command output aligned to the changed paths.
- If a regression appears, stop, isolate the cause, and revert the smallest change that introduced it.
