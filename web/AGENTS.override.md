# AGENTS.override

This file is the Codex instruction source for `/web`. It defines the active React application boundary.

## Scope

- `/web` is the active application.
- New implementation work belongs under `/web`.
- Routes, components, styles, tests, content implementation, application assets, scripts, and integrations for the new website belong under `/web`.
- The legacy root website is read-only migration evidence unless a future prompt explicitly names root legacy files.
- Applicable documentation under `/docs/silverstone-transformation/` is authoritative.
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

## V2 Creative Directive (Visual Authority)

- The **V2 creative directive** at `docs/silverstone-redesign/v2-creative-directive.md` governs the current visual implementation of `/web` (visual, motion, brand, and presentation decisions).
- Earlier visual-direction prototype documents (e.g. under `docs/silverstone-transformation/design/visual-direction-prototype-spec-v1/`) **remain historical evidence and must not be deleted.**
- Where an earlier visual document conflicts with the V2 directive, **the V2 directive takes precedence.**
- `/web` remains the active application.
- Supporting V2 registries: `docs/silverstone-redesign/21st-component-ledger.md`, `docs/silverstone-redesign/asset-registry.md`, and `docs/silverstone-redesign/metrics-registry.md`.
