# CLAUDE

Project-level Claude guidance for `silverstone-site`.

## Core Rules

- `/web` is the site: the React/Vite application, deployed to Netlify from `web/build/client` (see root `netlify.toml`). The legacy root HTML/CSS/JS site was removed at the 2026-07-07 cutover; its history remains in git and in `docs/silverstone-transformation/`.
- To save tokens and reduce usage, default all searches, reads, edits, validation, and browser work to `/web`; avoid broad repository scans.
- Root-level files are deployment and repository infrastructure only: `netlify.toml`, `netlify/functions/` (Resend contact email), `package.json` (proxy scripts to `/web`), instruction files, and docs.
- Do not deploy, push, alter DNS, production Netlify settings, production environment variables, production Resend configuration, analytics identifiers, consent configuration, or Calendly account settings unless explicitly authorized.
- Do not send production email, create real Calendly appointments, submit IndexNow requests, expose secrets, or discard uncommitted user changes.
- Keep diffs minimal and scoped. Leave uncertain items unchanged and flag them for review.

## Model And Effort Policy

Match the model and the reasoning effort to the task. Both are cheap to change
mid-session and expensive to get wrong in either direction: under-powering silent,
hard-to-detect work costs rework; over-powering mechanical work costs time and
invites over-engineering.

### Model

- **Claude Sonnet 5 is the default.** Use it for investigation, implementation,
  debugging, testing, routine copy, CSS, config, and validation runs. Keep
  `.claude/settings.json` at `model: "claude-sonnet-5"`.
- **Escalate to Claude Opus 5** when a task holds several constraints at once and a
  mistake would be silent rather than loud. In this project that means: site-wide
  copy and H1 work that must satisfy ranking, brand voice, and a layout budget
  together; schema, metadata, or routing changes that span many routes; migrations
  over generated files; and any change to the n8n publishing workflows.
- **Claude Haiku 4.5** is fine for genuinely mechanical work — file moves, mass
  renames, formatting, reading a log for one value.
- **Claude Fable 5** is an advisor, not a driver. Use it only for bounded questions
  of direction — positioning, conversion strategy, page structure, substantial
  webcopy direction, major visual direction — and never for implementation,
  routine edits, CSS, debugging, validation, or final review. Narrow the decision
  first on the driving model, then ask Fable 5 once, in no more than 500 words of
  context, for one preferred direction. Hand the answer back to the driving model
  to implement.
- Escalate the model rather than repeating a failed attempt. Two Sonnet 5 passes at
  a problem Opus 5 solves once is the more expensive path.

### Effort

- **low / medium** — reading, summarising, confirming state, running a documented
  command, mechanical edits with an obvious correct answer.
- **high** — the working default for implementation. Use it for any multi-file
  change, and for the first turn of a long prompt so the session orients correctly
  before it starts editing.
- **max** — reserve for work where an error is silent and expensive: quality-gate
  or publishing-chain logic, scripted rewrites over generated files, and copy that
  must satisfy competing constraints simultaneously. Do not run whole sessions at
  max; it slows delivery and tends toward over-engineering on volume work.
- Change effort **between** turns, at phase gates. It applies to the message you
  send it with and cannot alter work already running.

### Guardrail

- State the model and effort in the session summary when either was escalated for a
  task, so a later reader knows the change was deliberate.

## Instructions And Skills

- Use `AGENTS.md` for the repository-wide contract and `web/AGENTS.override.md` for `/web` work.
- Use specialist skills only when they materially improve the current task. Start from `.agents/SKILLS.md` or `docs/codex/skill-mcp-routing.md`; open a full `SKILL.md` only after selecting that skill.
- Do not scan the whole skill catalogue, repeatedly re-review skills, or use MCP servers solely because they are configured.
- Use Context7 MCP for current library, framework, SDK, API, CLI, or cloud-service documentation when the task asks about those domains.

## Validation

- Match validation to the change scope.
- For documentation, instruction, skill-profile, or narrow config edits, prefer syntax checks, `node .agents/sync-skills.mjs --check`, changed JSON/TOML parsing, and targeted commands.
- For `/web` runtime changes, use the relevant commands from `web/package.json`; reserve `npm run verify` and full Playwright for broad behavior, routing, rendering, or release validation.
