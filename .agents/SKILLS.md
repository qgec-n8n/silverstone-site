# Workspace Skills And MCP

This repository keeps project skills and optional MCP server configuration in tracked files, but only a small skill profile is exposed by default.

## Layout

| Path | Role |
| --- | --- |
| `.agents/skills/<name>/SKILL.md` | Canonical project skill store. |
| `.agents/skill-profiles.json` | Source of truth for default and specialist skill exposure profiles. |
| `.claude/skills/<name>` | Symlinks for the currently active skill profile only. |
| `.mcp.json` | Repository MCP server definitions. Optional servers are disabled by default. |
| `.codex/config.toml` | Codex config; the MCP section is generated from `.mcp.json`. |
| `.agents/sync-skills.mjs` | Validates skills, syncs active links, and regenerates Codex MCP config. |

Each skill must be a directory with `SKILL.md` frontmatter containing at least `name` and `description`. Supporting files stay inside that skill directory.

## Sync Commands

```bash
node .agents/sync-skills.mjs
node .agents/sync-skills.mjs --profile core
node .agents/sync-skills.mjs --profile frontend
node .agents/sync-skills.mjs --profile visual-motion
node .agents/sync-skills.mjs --profile seo-content
node .agents/sync-skills.mjs --profile testing
node .agents/sync-skills.mjs --profile marketing
node .agents/sync-skills.mjs --profile automation
node .agents/sync-skills.mjs --profile image-assets
node .agents/sync-skills.mjs --profile all
node .agents/sync-skills.mjs --check
```

`CLAUDE_SKILL_PROFILE=<profile> node .agents/sync-skills.mjs` is equivalent to `--profile`.

The script:

1. Inventories every canonical project skill.
2. Validates required skill frontmatter.
3. Reads the selected profile from `.agents/skill-profiles.json`.
4. Links only selected skills into `.claude/skills/`.
5. Prunes stale, broken, wrong-target, or inactive links.
6. Regenerates the Codex MCP section from `.mcp.json`.
7. Prints active and inactive skill counts.

## Skill Selection

- Use no skill for routine code reading, simple local edits, or straightforward CLI validation.
- Use the smallest relevant skill set for specialist work.
- Read the inventory or profile list first; open full `SKILL.md` files only after selecting them.
- Switch profiles deliberately, run the task, then return to `core` if the specialist profile is no longer needed.

## MCP Servers

Project MCP servers are optional and disabled by default. For routine work, prefer:

- `rg`, `find`, and `git` for repository discovery.
- `npm`, `npx`, and package scripts for local validation and scaffolding.
- `cd web && npx shadcn@4.11.0 ...` for shadcn CLI work.
- Existing documentation and lockfiles before remote documentation lookups.

To activate an MCP server for a task, edit `.mcp.json`, set that server's `enabled` field to `true`, run `node .agents/sync-skills.mjs`, and restart the MCP host/session if required by the host. Return it to `false` after the task unless there is evidence it should stay default.

Never put token or secret values in `.mcp.json`, `.codex/config.toml`, prompts, or docs. Use environment variables or gitignored local env files.
