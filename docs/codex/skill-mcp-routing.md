# Skill And MCP Routing Reference

This is an optional routing guide. Routine code reading, small fixes, documentation edits, and local validation do not require a skill or MCP server.

## Default Flow

1. Use local evidence first: `rg`, `find`, `git`, package scripts, lockfiles, and existing project docs.
2. If specialist guidance would materially improve the result, choose the smallest relevant skill profile from `.agents/skill-profiles.json`.
3. Open the full `SKILL.md` only for skills you actually selected.
4. Activate MCP servers only when their live remote capability is needed. Keep them disabled otherwise.

## Common Task Map

| Task | Primary Skill/Profile | Optional Secondary | Preferred CLI Alternative |
| --- | --- | --- | --- |
| Routine repo search or small fix | none | `core` if the task becomes broader | `rg`, `git diff`, targeted file reads |
| `/web` component or styling work | `frontend` | `shadcn-ui`, `tailwind-css`, `responsive-design` | existing components, `cd web && npm run lint` |
| Visual or motion work | `visual-motion` | `frontend`, targeted browser checks | local code inspection, targeted Playwright |
| SEO, schema, route metadata | `seo-content` | `schema`, `site-architecture` | route manifests, SEO docs, targeted tests |
| Tests and browser verification | `testing` | `browser-use` when interaction evidence is needed | `cd web && npm run test`, `npx playwright test` |
| Marketing copy or positioning | `marketing` | `seo-content` for search-sensitive pages | repository copy packs and approved docs |
| Image or asset selection | `image-assets` | `frontend` for route composition | inspect files, image manifests, local dimensions |
| Agent/tooling configuration | none first | `automation` only for agent UI/tool work | JSON/TOML parsing, `node .agents/sync-skills.mjs --check` |

## MCP Use

| Server | Use When | CLI/Local Alternative |
| --- | --- | --- |
| `shadcn` | Live registry lookup is needed. | `cd web && npx shadcn@4.11.0 ...` |
| `magicui` | A Magic UI registry component is explicitly needed. | Existing components, local docs, manual implementation. |
| `aceternityui` | Aceternity-specific component lookup is needed. | Existing components, local docs, manual implementation. |
| `typeui` | Remote TypeUI design-system data is necessary. | Existing project tokens and component patterns. |
| `untitledui` | Untitled UI React metadata is necessary. | Existing accessible components and React Aria docs when relevant. |
| `magic_21st` | Authenticated 21st.dev generated variants or logo/icon search are needed. | Manual design/code search. |
| `gpt-image-2` | New generated imagery is explicitly required. | Existing verified assets and local image manifests. |

Activate by editing `.mcp.json`, setting the server's `enabled` field to `true`, running `node .agents/sync-skills.mjs`, and restarting the MCP host/session if required. Return optional servers to `false` after use unless there is evidence they should stay enabled.

## Documentation MCP

Use Context7 for current library, framework, SDK, API, CLI, or cloud-service documentation when a task asks about those domains. Prefer local package files and repository scripts for information already present in the repo.

## Validation Tiers

- Tier 1: documentation, instruction, skill-profile, or narrow config edits. Use syntax checks, JSON/TOML parsing, symlink checks, `node .agents/sync-skills.mjs --check`, and targeted commands.
- Tier 2: affected `/web` runtime changes. Run the relevant subset of lint, typecheck, test, build, and staging safety.
- Tier 3: broad behavior, routing, rendering, deployment config, or release validation. Use `npm run verify` and relevant Playwright/E2E.
