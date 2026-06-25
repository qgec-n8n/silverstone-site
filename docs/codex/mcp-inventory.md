# MCP Inventory

Generated for the Codex preparation task on 2026-06-25.

No secret values are recorded here. Environment variable names are preserved where relevant.

## Summary

| Server | Scope | Transport | Health |
| --- | --- | --- | --- |
| `magicui` | project | stdio via `npx -y @magicuidesign/mcp@2.0.0` | Healthy |
| `aceternityui` | project | stdio via `npx -y aceternityui-mcp@1.0.2` | Healthy |
| `typeui` | project | remote URL `https://mcp.typeui.sh` | Healthy, authenticated free plan |
| `untitledui` | project | remote URL `https://www.untitledui.com/react/api/mcp` | Healthy for public/free resources; PRO blocked by auth/plan |
| `shadcn` | project | stdio via `npx -y shadcn@4.11.0 mcp` | Config repaired; fresh session required for MCP cwd to take effect |
| `magic_21st` | project | stdio helper `.codex/bin/21st-magic-mcp.sh` | Healthy when `API_KEY_21ST` is available |
| `context7` | user | stdio via `npx -y @upstash/context7-mcp@latest` | Healthy |
| `playwright` | user | stdio via `npx @playwright/mcp@latest` | Healthy |
| `github` | user app/plugin | authenticated app tools | Healthy |
| `figma` | user plugin | remote OAuth app | Configured; not tested without a file key |
| `microsoft-learn` | user | stdio via `npx -y @microsoft/microsoft-lean-mcp-server` | Configured |
| `linear` | user app/plugin | OAuth app | Blocked: not logged in |
| `resend` | user | stdio with user-configured env | Configured; not used for this task |
| `framer-mcp-server` | user | stdio with user-configured env | Configured; not used for this task |

## Project MCP configuration

Project configuration is stored in:

- `/Users/quentingeczy/Desktop/silverstone-site/.mcp.json`
- `/Users/quentingeczy/Desktop/silverstone-site/.codex/config.toml`
- `/Users/quentingeczy/Desktop/silverstone-site/.agents/sync-skills.mjs`

The sync script now preserves URL transports, `cwd`, `env_vars`, enabled state, startup timeouts, tool timeouts, and approval mode when regenerating `.codex/config.toml`.

## Server details

### magicui

- Source: Magic UI MCP package.
- Transport: stdio.
- Command: `npx -y @magicuidesign/mcp@2.0.0`
- Configured in: project `.mcp.json` and regenerated `.codex/config.toml`.
- Representative test: component search for integration-logo marquee patterns.
- Result: returned useful component matches including `marquee` and `animated-beam`.
- Homepage relevance: high for Magic UI component inspiration, animated UI patterns, and alternative implementations.

### aceternityui

- Source: Aceternity UI MCP package.
- Transport: stdio.
- Command: `npx -y aceternityui-mcp@1.0.2`
- Configured in: project `.mcp.json` and `.codex/config.toml`.
- Representative test: component search for background and hero patterns.
- Result: returned useful matches including `background-beams`, `hero-highlight`, and hero components.
- Homepage relevance: high for cinematic hero effects, premium animation patterns, and marketing sections.

### typeui

- Source: official TypeUI MCP URL.
- Transport: remote URL.
- URL: `https://mcp.typeui.sh`
- Configured in: project `.mcp.json` and `.codex/config.toml`.
- Representative tests: access check, design-system search, section listing.
- Result: authenticated free plan available; returned the Luxury design system and 52 section groups.
- Limitation: TypeUI-generated UI requires installing the relevant project skills before generation.
- Homepage relevance: high as the primary design-system and layout guidance source.

### untitledui

- Source: official Untitled UI React MCP URL.
- Transport: remote URL.
- URL: `https://www.untitledui.com/react/api/mcp`
- Configured in: project `.mcp.json` and `.codex/config.toml`.
- Representative tests: search and registry listing.
- Result: public/free component metadata returned successfully.
- Limitation: PRO assets are unavailable unless authenticated access is confirmed.
- Homepage relevance: medium for accessible React Aria component references and conventional UI foundations.

### shadcn

- Source: official shadcn CLI MCP command.
- Transport: stdio.
- Command: `npx -y shadcn@4.11.0 mcp`
- CWD: `/Users/quentingeczy/Desktop/silverstone-site/web`
- Configured in: project `.mcp.json` and `.codex/config.toml`.
- Representative tests: current live MCP server still reflected the old cwd and could not resolve project registries; direct CLI execution from `/web` successfully searched the configured Aceternity registry.
- Result: configuration repaired for fresh threads. Restart the MCP session before relying on the server.
- Homepage relevance: medium for component registry retrieval and project-compatible UI references.

### magic_21st

- Source: 21st.dev Magic MCP helper.
- Transport: stdio helper script.
- Command: `/bin/zsh .codex/bin/21st-magic-mcp.sh`
- Environment variables: `API_KEY_21ST`
- Configured in: project `.mcp.json` and `.codex/config.toml`.
- Representative tests: helper launch, logo search.
- Result: server launches when `API_KEY_21ST` is present and returned real logo-search results.
- Homepage relevance: high for generated component variants, logo/icon search, and 21st.dev design exploration.

### context7

- Source: user-level Context7 MCP.
- Transport: stdio.
- Representative tests: React Router, Vite, and Tailwind documentation queries.
- Result: returned current library documentation.
- Homepage relevance: high for framework, library, SDK, CLI, and cloud-service docs.

### playwright

- Source: user-level Playwright MCP.
- Transport: stdio.
- Representative test: navigated to a harmless data URL and returned a snapshot.
- Result: healthy.
- Homepage relevance: high for browser inspection, screenshots, and interaction verification.

### github

- Source: GitHub app/plugin tools.
- Representative test: read-only repository listing.
- Result: authenticated and able to access `qgec-n8n/silverstone-site`.
- Homepage relevance: medium for repository archaeology, issues, PRs, and remote history when needed.

## Authentication blockers and limitations

- `linear` is configured but not logged in.
- `figma` is configured through OAuth, but no harmless project file key was available for a representative test.
- Untitled UI PRO resources are not available unless explicit authenticated access is confirmed.
- OpenAI Developer Docs is available as an installed plugin/app capability for OpenAI Platform flows, but no dedicated OpenAI documentation MCP server is configured in this project.
- Secrets remain in user-level configuration only and were not copied into tracked files.

## Routing guidance

Use TypeUI as the primary visual authority for design system and layout guidance. Use Untitled UI React for accessible conventional React components. Use Aceternity and Magic UI for intentional premium animation and high-impact sections. Use 21st.dev Magic for generated variants and icon/logo search when authentication is available. Use Context7 before answering or implementing library/framework/API/CLI questions.
