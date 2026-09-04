# AGENTS

Permanent repository contract for agents working in `silverstone-site`.

## Architecture Boundary

- `/web` is the single website implementation: the React/Vite application, deployed to Netlify from `web/build/client` via the root `netlify.toml` (`npm --prefix web run build:production`).
- The legacy root HTML/CSS/JS site was deleted at the 2026-07-07 cutover on explicit user instruction; its history lives in git and in the transformation docs. Root-level runtime files are now limited to `netlify.toml`, `netlify/functions/` (Resend contact email) and the proxy `package.json`.
- `/docs/silverstone-transformation/` contains authoritative architecture, route, functional, redirect, asset, quality, and decision records.
- `web/AGENTS.override.md` contains `/web`-specific rules.

## Token And Read Scope

- Default all investigation, search, file reads, edits, validation, and browser work to `/web`, the active React/Vite website.
- Use root-level files only when they are repository instructions or active configuration needed for the current task, such as `AGENTS.md`, `CLAUDE.md`, `netlify.toml`, `netlify/functions/`, `.claude/settings.json`, `.gitignore`, or targeted docs under `docs/silverstone-transformation/`.
- When searching, prefer scoped commands such as `rg <pattern> web` or commands run from `/web`. Do not run broad repository scans unless the user explicitly asks for repository-wide forensics.
- Read documentation surgically: open only the specific project document needed for the task, not whole docs folders.

## Model And Effort Policy

Match the model and the reasoning effort to the task. Both are cheap to change mid-session and expensive to get wrong either way: under-powering silent, hard-to-detect work costs rework, while over-powering mechanical work costs time and invites over-engineering.

### Model

- Claude Sonnet 5 is the default for investigation, implementation, debugging, testing, routine copy, CSS, config, and validation runs. Keep `.claude/settings.json` at `model: "claude-sonnet-5"`.
- Escalate to Claude Opus 5 when a task holds several constraints at once and an error would be silent rather than loud: positioning and conversion strategy, page structure, substantial webcopy direction, major visual direction, significant redesigns, feature architecture, schema/metadata/routing changes spanning many routes, migrations over generated files, and any change to the n8n publishing workflows.
- Claude Haiku 4.5 is appropriate for genuinely mechanical work — file moves, mass renames, formatting, reading a log for one value.
- Do not use Fable 5. There is no active credit for it; any instruction naming it as an advisor is superseded by this section.
- Escalate the model rather than repeating a failed attempt. Two Sonnet 5 passes at a problem Opus 5 solves once is the more expensive path.

### Effort

- Low or medium: reading, summarising, confirming state, running a documented command, mechanical edits with an obvious correct answer.
- High: the working default for implementation. Use it for any multi-file change, and for the first turn of a long prompt so the session orients correctly before editing.
- Max: reserve for work where an error is silent and expensive — quality-gate or publishing-chain logic, scripted rewrites over generated files, and copy that must satisfy competing constraints simultaneously. Do not run whole sessions at max.
- Change effort between turns, at phase gates. It applies to the message it is sent with and cannot alter work already running.
- State the model and effort in the session summary when either was escalated, so a later reader knows the change was deliberate.

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
