# AGENTS

Permanent repository contract for agents working in `silverstone-site`.

## Architecture Boundary

- This repository contains two website implementations.
- `/web` is the active React application.
- The root HTML, CSS, and JavaScript site is frozen legacy production and migration evidence. Do not delete, overwrite, migrate, or edit it unless a prompt explicitly names legacy-root files.
- `/docs/silverstone-transformation/` contains authoritative architecture, route, functional, redirect, asset, quality, and decision records.
- `web/AGENTS.override.md` contains `/web`-specific rules.

## Token And Read Scope

- Default all investigation, search, file reads, edits, validation, and browser work to `/web`, the active React/Vite website.
- Do not read, index, summarize, or scan frozen legacy-root implementation files, including root `*.html`, root `/src`, `/blog`, `/services`, `/assets`, `/attached_assets`, `/pricing-widget`, screenshots, generated artifacts, or root package/build files.
- Use root-level files only when they are repository instructions or active configuration needed for the current task, such as `AGENTS.md`, `CLAUDE.md`, `.claude/settings.json`, `.gitignore`, or targeted docs under `docs/silverstone-transformation/`.
- When searching, prefer scoped commands such as `rg <pattern> web` or commands run from `/web`. Do not run broad repository scans unless the user explicitly asks for repository-wide forensics.
- Read documentation surgically: open only the specific project document needed for the task, not whole docs folders.

## Model Advisory Policy

- Claude Sonnet 5 is the primary model for investigation, implementation, debugging, testing, copy, and routine decisions.
- Claude Code project settings must keep `.claude/settings.json` configured with `model: "claude-sonnet-5"` and `advisorModel: "claude-fable-5"` so Sonnet 5 runs with Fable 5 as advisor.
- Fable 5 is the advisor to Sonnet 5 for major unresolved strategic decisions only: positioning, conversion strategy, page structure, substantial webcopy direction, major visual direction, significant redesigns, or feature architecture.
- Use no more than one Fable 5 consultation per substantial task. Before consulting Fable 5, Sonnet 5 must inspect the project and reduce the issue to the few decisions requiring strategic judgment.
- Give Fable 5 no more than 500 words of relevant context and ask for one preferred direction in no more than 600 words.
- Do not use Fable 5 for implementation, routine edits, CSS, minor copy changes, debugging, general reassurance, or final review unless a major strategic uncertainty remains.

## Production Protection

- Do not deploy, push, modify DNS, modify production Netlify settings, change production environment variables, alter production Resend configuration, change production analytics identifiers or consent configuration, change production Calendly account/event settings, send production email, create real Calendly appointments, or submit IndexNow requests unless the user explicitly authorizes that exact action.
- Do not edit production `netlify.toml` behavior unless the task is documentation-only or explicitly authorizes deployment-layer work.
- Never expose or commit secrets. Environment examples may contain variable names and safe placeholders only.
- Local, CI, Replit preview, and staging must remain non-indexable and incapable of production email, production booking, production analytics, or production indexing submissions.

## Integrity Requirements

- Preserve required routes, redirects, metadata, canonical tags, sitemap behavior, robots controls, breadcrumbs, JSON-LD, legal text, accessibility, analytics consent, contact behavior, booking intent, and environment separation.
- The approved first-release route baseline is documented in `docs/silverstone-transformation/audits/route-inventory-v1.csv` and `web/src/data/generated/future-route-manifest.json`.
- Do not silently remove or rename routes. `/services/gyms-fitness-studios` remains canonical; `/services/gyms` is unresolved until a fresh crawl and owner decision prove otherwise.
- Preserve `/contact` behavior: visible name/email/message intent, abuse-prevention intent, accessible success/error states, and compatibility with `/.netlify/functions/send-email` unless an approved adapter or redirect replaces it.
- Preserve Calendly booking intent and the production URL `https://calendly.com/silverstone-ai/30min`, but never create a real appointment during validation.
- IndexNow is disabled outside an authorized production release.

## Implementation Rules

- Keep changes minimal and scoped to the active task.
- Do not run destructive Git commands, force checkout, force push, or discard existing uncommitted user changes unless the user explicitly requests that exact action.
- Do not run repository-wide formatters or fix unrelated warnings.
- Do not import legacy CSS wholesale into `/web`, reproduce the legacy DOM as the target model, or migrate root generated-bundle architecture.
- Do not change spacing, typography, color, copy, claims, information architecture, dependencies, or production configuration for unrelated reasons.
- Leave uncertain items unchanged and flag them for manual review.

## Skills And MCP

- Project skills live in `.agents/skills/`; `.claude/skills/` exposes only the selected active profile.
- Use the minimum skill or MCP capability that materially improves the current task. Do not scan the whole catalogue or query MCP servers merely because they are available.
- Use `node .agents/sync-skills.mjs --check` after changing skill profiles, skill links, `.mcp.json`, or generated Codex MCP config.
- Prefer ordinary CLI commands and repository scripts for routine search, validation, package, Git, and browser work.
- Use Context7 MCP for current library, framework, SDK, API, CLI, or cloud-service documentation when the task asks about those domains.

## Validation

- Validation is proportional:
  - Tier 1: documentation, instruction, skill-profile, or narrow config changes. Use syntax validation, changed JSON/TOML parsing, symlink checks, `node .agents/sync-skills.mjs --check`, and targeted commands.
  - Tier 2: affected `/web` application or shared runtime changes. Run the materially relevant subset of `cd web && npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and `npm run staging:safety`.
  - Tier 3: broad behavior, routing, rendering, deployment configuration, or release validation. Use `cd web && npm run verify` and relevant Playwright/E2E checks.
- Do not claim success without fresh verification. If a command fails or is skipped, report the exact reason.

## State Documentation

Update `docs/silverstone-transformation/PROJECT_STATE.md`, `ROUTE_MANIFEST.md`, `FUNCTIONAL_CONTRACT.md`, `ASSET_REUSE_MATRIX.md`, `QUALITY_BASELINE.md`, `REDIRECT_REQUIREMENTS.md`, or `DECISION_LOG.md` only when their governed architecture, route, functional, asset, quality, redirect, or decision contract actually changes.
