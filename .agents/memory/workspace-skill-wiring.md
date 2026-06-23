---
name: workspace skill & MCP wiring
description: How shared agent skills and MCP servers are wired across tooling in this repo, and how to keep them in sync.
---

# Workspace skill & MCP wiring

`.agents/skills/<name>/SKILL.md` is the **canonical store** (single source of truth)
for every agent skill. `.mcp.json` is the **single source of truth** for MCP servers.

`node .agents/sync-skills.mjs` regenerates all cross-tool wiring (idempotent):
- `.claude/skills/<name>` symlinks → `../../.agents/skills/<name>` (prunes stale/broken).
- `[mcp_servers.*]` block of `.codex/config.toml` from `.mcp.json` (preamble preserved).
- Validates each `SKILL.md` frontmatter has `name` + `description`.
- `--check` verifies without writing, exits 1 on drift. Bootstraps missing dirs/config.

**Why:** keeps Replit / Claude / Codex exposing the same skills + MCP without hand-editing
each tool dir. Run it after adding/removing a skill or editing `.mcp.json`.

**How to apply:** never hand-edit `.claude/skills/` or the Codex MCP block — change the
canonical source and re-run the script. `.codex/*` is gitignored except `config.toml` +
`README.md`, so agent tooling (script/docs) lives under `.agents/`, not `.codex/`.
Each Repl is isolated: there is no cross-Repl auto-sync; reuse is an explicit per-project
step (fork the repo, copy `.agents/skills/`, or re-install from `skills-lock.json`).
See `.agents/SKILLS.md`.
