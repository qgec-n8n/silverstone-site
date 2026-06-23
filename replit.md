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

## Handoff Expectations

- Report exact files changed, commands run, validation results, and any Preview limitations.
- Confirm the legacy root and production controls were left untouched unless the user explicitly named them.
