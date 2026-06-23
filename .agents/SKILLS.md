# Workspace Skills & MCP

This workspace is a multi-agent environment. Agent **skills** (reusable
instruction packs) and **MCP servers** (tool integrations) are shared across the
agent tooling used here so every agent — Replit, Claude, Codex — can reach the
same capabilities.

## Layout

| Path | Role |
| --- | --- |
| `.agents/skills/<name>/SKILL.md` | **Canonical store.** The single source of truth for every skill. |
| `.claude/skills/<name>` | Symlinks back into `.agents/skills/` so Claude tooling resolves the same skills. |
| `.mcp.json` | **Canonical MCP server list** (used by Claude / Replit). |
| `.codex/config.toml` | Codex config; its `[mcp_servers.*]` section is generated from `.mcp.json`. |
| `.agents/sync-skills.mjs` | The repeatable wiring generator (below). |

Each skill is a directory with a `SKILL.md` that begins with YAML frontmatter
containing at least `name` and `description`. Supporting files (scripts,
references) live alongside it in the same directory.

## Keeping it wired: `sync-skills.mjs`

One script (re)generates all cross-tool wiring. It is idempotent — safe to run
any time, especially after adding, removing, or renaming a skill, or after
editing `.mcp.json`.

```bash
node .agents/sync-skills.mjs          # apply: link skills + regenerate MCP section
node .agents/sync-skills.mjs --check  # verify only; exits 1 if anything is out of sync
```

What it does:

1. Inventories every skill in `.agents/skills/` and validates each `SKILL.md`
   has `name` + `description` frontmatter.
2. Regenerates `.claude/skills/` symlinks to match the canonical store and prunes
   stale, broken, or wrong-target links.
3. Regenerates the `[mcp_servers.*]` block of `.codex/config.toml` from
   `.mcp.json` (the rest of the Codex config is left untouched), so both tools
   expose the same MCP servers.

Use `--check` in a verification step to catch drift before it ships.

## MCP servers

`.mcp.json` is the source of truth. To add or change an MCP server, edit
`.mcp.json` and run `node .agents/sync-skills.mjs` to propagate it into
`.codex/config.toml`. The currently configured servers are the React
component-library registries (Magic UI, Aceternity UI); both run over stdio via
`npx` and need no API key.

## Reusing these skills in future projects

Each Replit Repl is an **isolated environment**. From inside a Repl we can make
everything available workspace-wide here and ship a portable, repeatable
mechanism, but we **cannot** silently auto-inject these skills into a separate
future Repl. There is no cross-Repl background sync — adoption is an explicit,
one-time step per project. Pick whichever path fits:

1. **Fork / use as template (recommended).** Create the new project from this
   repo. The `.agents/skills/` store, `.claude/skills/` links, `.mcp.json`, and
   `.codex/config.toml` come with it. Run `node .agents/sync-skills.mjs` once to
   refresh symlinks (symlinks may not survive every copy mechanism).

2. **Copy the store into an existing project.** Copy the `.agents/skills/`
   directory (and `.mcp.json` if you want the MCP servers) into the target repo,
   then copy `.agents/sync-skills.mjs` and run it. It will create
   `.claude/skills/` and the Codex MCP section from scratch.

3. **Re-install from source.** `skills-lock.json` records the upstream source
   (GitHub repo + path + hash) for each externally sourced skill, so a skill can
   be re-fetched or audited against its origin.

After any of these, always finish with:

```bash
node .agents/sync-skills.mjs --check
```

to confirm the wiring resolves in the new project.
