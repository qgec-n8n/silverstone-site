# CLAUDE

Project-level Claude guidance for `silverstone-site`.

## Core Rules

- `/web` is the site: the React/Vite application, deployed to Netlify from `web/build/client` (see root `netlify.toml`). The legacy root HTML/CSS/JS site was removed at the 2026-07-07 cutover; its history remains in git and in `docs/silverstone-transformation/`.
- To save tokens and reduce usage, default all searches, reads, edits, validation, and browser work to `/web`; avoid broad repository scans.
- Root-level files are deployment and repository infrastructure only: `netlify.toml`, `netlify/functions/` (Resend contact email), `package.json` (proxy scripts to `/web`), instruction files, and docs.
- Do not deploy, push, alter DNS, production Netlify settings, production environment variables, production Resend configuration, analytics identifiers, consent configuration, or Calendly account settings unless explicitly authorized.
- Do not send production email, create real Calendly appointments, submit IndexNow requests, expose secrets, or discard uncommitted user changes.
- Keep diffs minimal and scoped. Leave uncertain items unchanged and flag them for review.

## Model Advisory Policy

- Claude Sonnet 5 is the primary model for investigation, implementation, debugging, testing, copy, and routine decisions.
- Claude Code project settings must keep `.claude/settings.json` configured with `model: "claude-sonnet-5"` and `advisorModel: "claude-fable-5"` so Sonnet 5 runs with Fable 5 as advisor.
- Fable 5 is the advisor to Sonnet 5 for major unresolved strategic decisions only.
- Use at most one Fable 5 consultation per substantial task, after Sonnet 5 has inspected the project and narrowed the decision.
- Give Fable 5 no more than 500 words of relevant context and ask for one preferred direction in no more than 600 words.
- Do not use Fable 5 for implementation, routine edits, CSS, minor copy changes, debugging, general reassurance, or final review unless a major strategic uncertainty remains.

## Instructions And Skills

- Use `AGENTS.md` for the repository-wide contract and `web/AGENTS.override.md` for `/web` work.
- Use specialist skills only when they materially improve the current task. Start from `.agents/SKILLS.md` or `docs/codex/skill-mcp-routing.md`; open a full `SKILL.md` only after selecting that skill.
- Do not scan the whole skill catalogue, repeatedly re-review skills, or use MCP servers solely because they are configured.
- Use Context7 MCP for current library, framework, SDK, API, CLI, or cloud-service documentation when the task asks about those domains.

## Validation

- Match validation to the change scope.
- For documentation, instruction, skill-profile, or narrow config edits, prefer syntax checks, `node .agents/sync-skills.mjs --check`, changed JSON/TOML parsing, and targeted commands.
- For `/web` runtime changes, use the relevant commands from `web/package.json`; reserve `npm run verify` and full Playwright for broad behavior, routing, rendering, or release validation.
