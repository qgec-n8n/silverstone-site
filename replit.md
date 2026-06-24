# Replit Operating Rules

Replit is a non-production staging and editing surface for the Silverstone React application. It is not the production deploy path, not the production source of truth, and not the final release gate.

## Active Application

- The active application is `/web`.
- All active React application development belongs under `/web`.
- Routes, components, styles, tests, content implementation, assets for the new application, and integrations for the new website belong under `/web`.
- Replit must run installation, development, build, test, and validation commands from `/web`.
- The root HTML, CSS, and JavaScript website is a frozen legacy reference.
- The presence of a root `package.json` does not make the root legacy website the active application.

## Default Commands

Run commands with `/web` as the working directory:

```bash
cd web && npm ci
cd web && npm run dev -- --host 0.0.0.0 --port ${PORT:-3000}
cd web && npm run lint
cd web && npm run typecheck
cd web && npm run test
cd web && npm run test:e2e
cd web && npm run build
cd web && npm run staging:safety
```

The root `.replit` run command must start the `/web` app. Do not make a legacy root build or server command the default Replit workflow.

## Legacy Root Boundary

Do not edit legacy root HTML files, legacy CSS, legacy JavaScript, legacy assets, root build scripts, `netlify.toml`, or `netlify/functions/**` unless a future prompt explicitly names those files.

## Documentation Authority

- `/docs/silverstone-transformation/` contains authoritative project specifications, audits, decisions, and handoff records.
- Inspect the relevant documentation before editing.
- Preserve historical branch references in completed audit trails and reports, but do not create, switch, or rely on transformation branches for future work.
- Future instructed work occurs in the current repository state unless the user explicitly says otherwise.

## Safety Boundaries

- No production deployment, DNS, Netlify publishing, production environment, production analytics, production email delivery, production booking, or production integration mutation is permitted.
- Staging defaults must stay safe: analytics disabled, Resend mocked or blocked, no production email delivery, non-indexable staging, IndexNow disabled, and no production deployment command.
- Do not add secrets or real production environment values.
- Do not commit generated directories, dependency directories, framework caches, build output, coverage, Playwright reports, test results, local logs, or OS/editor metadata.

## Workspace Skills & MCP

- **Skill review is mandatory.** Immediately after every prompt, review all relevant skills in `.agents/skills/`, keep re-reviewing as the work evolves, and use the MCP servers throughout the work. This is binding — see `.agents/SKILL_REVIEW_POLICY.md`.
- Shared agent skills live in `.agents/skills/` (canonical store) and are wired into `.claude/skills/` (symlinks) and `.codex/config.toml` (MCP servers from `.mcp.json`).
- Run `node .agents/sync-skills.mjs` to regenerate the wiring after adding/removing a skill or editing `.mcp.json`; `node .agents/sync-skills.mjs --check` verifies it.
- See `.agents/SKILLS.md` for how to reuse these skills in future projects and the per-Repl isolation limitation.
- This wiring is agent tooling and is independent of the frozen legacy root and the active `/web` app.

## Handoff Expectations

- Report exact files changed, commands run, validation results, and any Preview limitations.
- Confirm the legacy root and production controls were left untouched unless the user explicitly named them.

## V2 Creative Directive (Visual Authority)

- The **V2 creative directive** at `docs/silverstone-redesign/v2-creative-directive.md` governs the current visual implementation of the `/web` application (visual, motion, brand, and presentation decisions).
- Earlier visual-direction prototype documents (e.g. under `docs/silverstone-transformation/design/visual-direction-prototype-spec-v1/`) **remain historical evidence and must not be deleted.**
- Where an earlier visual document conflicts with the V2 directive, **the V2 directive takes precedence.**
- `/web` remains the active application.
- Supporting V2 registries: `docs/silverstone-redesign/21st-component-ledger.md`, `docs/silverstone-redesign/asset-registry.md`, and `docs/silverstone-redesign/metrics-registry.md`.
