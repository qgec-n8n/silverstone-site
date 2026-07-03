# Replit Operating Rules

Replit is a non-production staging and editing surface for the `/web` React application. It is not the production deploy path, production source of truth, or final release gate.

## Active Application

- Run Replit install, dev, build, test, and validation commands from `/web`.
- The root HTML/CSS/JS site is frozen legacy reference material, even though the repository root contains a `package.json`.
- The root `.replit` run command must start the `/web` app.

## Commands

```bash
cd web && npm ci
cd web && npm run dev -- --host 0.0.0.0 --port ${PORT:-3000}
cd web && npm run lint
cd web && npm run typecheck
cd web && npm run test
cd web && npm run build
cd web && npm run staging:safety
```

Run `cd web && npm run test:e2e` only when browser behavior, routes, accessibility, or release validation require it.

## Safety Boundaries

- Do not use Replit for production deployment, DNS, Netlify publishing, production environment changes, production analytics, production email delivery, production booking, or production integration mutation.
- Staging defaults must remain safe: analytics disabled or staging-only, Resend mocked or blocked, no production email delivery, non-indexable staging, IndexNow disabled, and no production deployment command.
- Do not add secrets or real production environment values.
- Do not commit dependency directories, build output, framework caches, coverage, Playwright reports, test results, local logs, `.DS_Store`, or editor metadata.

## Documentation

- Read only the documentation relevant to the Replit task. General repository rules are in `AGENTS.md`; `/web` rules are in `web/AGENTS.override.md`.
- Preserve historical branch references in completed audit trails and reports, but do not create, switch, or rely on transformation branches unless the user explicitly asks.

## Handoff

Report exact files changed, commands run, validation results, and any Replit preview limitations. Confirm the legacy root and production controls were left untouched unless the user explicitly named them.
