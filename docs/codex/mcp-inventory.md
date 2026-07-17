# MCP Inventory

No secret values are recorded here. Project MCP servers are optional and disabled by default.

## Source Of Truth

- Server definitions: `.mcp.json`
- Generated Codex MCP config: `.codex/config.toml`
- Sync command: `node .agents/sync-skills.mjs`

Activate a server by setting `enabled` to `true` in `.mcp.json`, running the sync command, and restarting the MCP host/session if required.

## Project Servers

| Server | Default State | Purpose | Requires Secret | CLI/Local Alternative | Reason |
| --- | --- | --- | --- | --- | --- |
| `aceternityui` | enabled | Aceternity component registry lookup through `aceternity-mcp` 2.1.0 for animated marketing UI. | no | Existing components, local code search, manual implementation. | Enabled for the `/blog` card upgrade and installed in an isolated `pipx` environment. |
| `gpt-image-2` | disabled | Generate or edit imagery through the local gpt-image-2 wrapper. | local gitignored env file | Existing verified image assets and manifests. | Unique capability, but only for explicit image-generation tasks. |
| `magic_21st` | enabled | Current authenticated 21st.dev catalog, component retrieval, generated variants, and icon/logo search. | `API_KEY_21ST` | `npx @21st-dev/cli@1.7.2 ...` | Enabled for the `/blog` card upgrade through `https://21st.dev/api/mcp`. |
| `magicui` | disabled | Magic UI registry lookup for animated UI components. | no | Existing components, local code search, manual implementation. | Useful only when Magic UI is explicitly in scope. |
| `shadcn` | disabled | shadcn MCP registry access from `/web`. | no | `cd web && npx shadcn@4.11.0 ...` | CLI is sufficient for routine shadcn work. |
| `typeui` | disabled | Remote TypeUI design-system and layout metadata. | no | Existing project tokens and components. | Specialist design reference, not a default dependency. |
| `untitledui` | disabled | Untitled UI React metadata and accessible component references. | plan/auth may limit PRO assets | Existing accessible components and docs. | Optional provider; PRO resources require confirmed access. |

## Task Profiles

- Frontend component work: usually no MCP; use `shadcn` only for live registry work.
- Visual exploration: optionally enable one provider at a time, such as `typeui`, `magicui`, `aceternityui`, or `magic_21st`.
- Image generation: enable `gpt-image-2` only for explicit generated-image work.
- Routine validation: no MCP; use `npm`, `npx`, Playwright CLI, and repository scripts.

## Portability Notes

- `.mcp.json` and `.codex/config.toml` use repository-relative shell commands where local wrappers are needed.
- The gpt-image wrapper resolves the external server from `GPT_IMAGE_2_MCP_DIR` or `$HOME/.claude-mcp-servers/gpt-image-2-mcp`.
- Secrets must stay in environment variables or gitignored local env files, never in tracked MCP config.
