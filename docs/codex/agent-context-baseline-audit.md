# Agent Context Baseline Audit

Date: 2026-07-02

## Safe Baseline

- Branch before edits: `main`.
- Last commit before edits: `dc881818 Merge branch 'main' of https://github.com/qgec-n8n/silverstone-site`.
- Worktree before edits: not clean.
- Pre-existing user changes were present in `web/src/features/services-v2/components/secondary-hero.tsx` and `web/src/styles/services-v2/services-v2.css`; this cleanup did not edit those files.
- No branch was created because the worktree was dirty.

## Baseline Counts

| Item | Baseline |
| --- | ---: |
| Primary always-loaded repo instruction bytes (`CLAUDE.md`, `AGENTS.md`, `web/AGENTS.override.md`, `replit.md`) | 21,678 |
| `CLAUDE.md` | 39 lines / 1,872 bytes |
| `AGENTS.md` | 139 lines / 11,053 bytes |
| `web/AGENTS.override.md` | 77 lines / 4,795 bytes |
| `replit.md` | 61 lines / 3,958 bytes |
| `.agents/SKILLS.md` | 81 lines / 3,602 bytes |
| `.agents/SKILL_REVIEW_POLICY.md` | 79 lines / 4,101 bytes |
| `docs/codex/skills-inventory.md` | 235 lines / 41,092 bytes |
| `docs/codex/skill-mcp-routing.md` | 109 lines / 7,304 bytes |
| Canonical project skills under `.agents/skills/` | 149 |
| Exposed Claude skills under `.claude/skills/` | 149 |
| Project MCP servers enabled / disabled | 7 / 0 |
| User-specific absolute-path hits in active scanned repo docs/config, excluding common build/artifact folders | 267 |

## Duplicated Or Over-Broad Themes

- Mandatory skill review appeared in `CLAUDE.md`, `AGENTS.md`, `web/AGENTS.override.md`, `replit.md`, `.agents/SKILL_REVIEW_POLICY.md`, and `docs/codex/skill-mcp-routing.md`.
- MCP use was framed as a default quality requirement rather than a task-specific capability.
- `/web` active-app and frozen legacy-root boundaries were repeated across root, `/web`, and Replit instructions.
- Image-selection manifests were mandatory for broad route work even when imagery did not change.
- Homepage/V2 visual guidance was embedded in generic routing and `/web` instructions.
- Validation language pushed broad `/web` suites for normal work instead of proportional checks.
- Shared tracked config contained user-specific absolute paths in `.mcp.json`, `.codex/config.toml`, `.codex/bin/gpt-image-2-mcp.sh`, `.claude/settings.local.json`, and `docs/codex/skills-inventory.md`.

## MCP Baseline

| Server | Enabled | Secret Requirement | Absolute Path | Routine Alternative |
| --- | --- | --- | --- | --- |
| `magicui` | yes | no | no | local components or `npx` |
| `aceternityui` | yes | no | no | local components or `npx` |
| `typeui` | yes | no | no | existing design tokens/docs |
| `untitledui` | yes | auth/plan for PRO assets | no | existing accessible components/docs |
| `shadcn` | yes | no | yes | `cd web && npx shadcn@4.11.0 ...` |
| `magic_21st` | yes | `API_KEY_21ST` | yes | manual design/code search |
| `gpt-image-2` | yes | gitignored local env file | yes | existing verified image assets |

## Large Or Noisy Tracked Content

- Large scroll audit/validation evidence under `artifacts/codex_scroll_*`, with individual text files up to about 19 MB.
- Large duplicated image assets under `assets/images/socialmedia/` and `web/public/approved-images/`.
- Image contact sheets and manifests under `docs/codex/image-assets/`.
- Package lockfiles at root, `web/`, `pricing-widget/`, and inside skill assets.
- Extensive skill support assets, references, scripts, and starter projects under `.agents/skills/`.

These were inspected as context-noise sources but not deleted.

## User-Level Claude Audit Baseline

Inspected read-only:

- `~/.claude/settings.json`
- `~/.claude/projects/-Users-quentingeczy-Desktop-silverstone-site/memory/MEMORY.md`
- Silverstone project topic memories under that same memory directory.

Absent or not found:

- `~/.claude/CLAUDE.md`
- `~/.claude/rules/`
- `~/.claude/settings.local.json`
- `/Library/Application Support/ClaudeCode/CLAUDE.md`

Findings:

- Global Claude settings enabled many plugins, including overlapping frontend design, marketing, code review, superpowers, Playwright, Chrome DevTools MCP, Firecrawl, GitHub, and skill-creator surfaces.
- The Silverstone memory index included useful but highly route-specific services-v2, industries-v2, image-generation, preview-tool, and legacy-root memories.
- Legacy root memories can conflict with the active `/web` framing unless treated as legacy-only.
- No user-level Claude file was modified.

## Classification

- Essential and retained: active `/web` boundary, frozen legacy root, production protection, secrets policy, route/content integrity, environment separation, accessibility, staging safety, minimal diffs, Git safety.
- Essential but shortened: root `CLAUDE.md`, root `AGENTS.md`, `web/AGENTS.override.md`, `replit.md`, `.agents/SKILLS.md`.
- Duplicated and consolidated: skill/MCP review rules, validation expectations, `/web` and legacy-root boundaries.
- Task-specific and moved or made conditional: image guidance, V2 presentation details, `/web` generated-file rules, specialist skill/MCP routing.
- Converted to opt-in: specialist skill exposure and optional project MCP servers.
- Replaceable with CLI: routine search, Git, validation, package, shadcn, and browser commands.
- Uncertain and left unchanged: large historical artifacts, migration/image evidence, user-level memory files, and user-level plugin settings.
