# Codex Environment Baseline

Generated for the Codex preparation task on 2026-06-25.

## Starting repository state

- Repository root: `/Users/quentingeczy/Desktop/silverstone-site`
- Branch: `main`
- Commit: `f950740cbc0303de0caa53ff25603492c75cbb42`
- Remote: `origin https://github.com/qgec-n8n/silverstone-site.git`
- Shallow repository: `false`
- Operating system: Darwin/macOS 26.5, arm64
- Node.js: `v25.9.0`
- npm: `11.12.1`
- Package manager declared by project: none in manifest; `/web/package-lock.json` establishes npm as authoritative
- Codex CLI: `codex-cli 0.136.0`
- Active `CODEX_HOME`: environment variable unset; default user home is `/Users/quentingeczy/.codex`
- Project trust: trusted in Codex configuration

## Starting git status

```text
## main...origin/main
 M .codex/config.toml
 M .gitignore
 M AGENTS.md
 M web/components.json
?? .codex/bin/
?? assets/logo/silverstone-icon.png
```

The listed changes pre-existed this preparation run and were preserved. Files that also needed preparation edits are documented in the final change set.

## Starting hashes

| Path | SHA-256 |
| --- | --- |
| `package.json` | `f876e21c703ad6a0e40761be3fcfb7e4413aff91d555b96e990cebbc53323858` |
| `package-lock.json` | `015cda707fbd29ac7827eca44ffebac0518fc7fbc5fb353f8dcab513b5525d89` |
| `web/package.json` | `2098c47038f3519f00b72621cce7a123067e8b47a13e0d5ceb57c3c2df4e80cc` |
| `web/package-lock.json` | `2d93167d5e1aaf29bb4d6c5980a681a718a4db0190510e2e8e436e5ce241cebd` |
| `.codex/config.toml` | `e2549b8c9d6b1d45e5a7a63550c33f04e8fc35b8e3f74a9bd59bb722783484c8` |
| `.mcp.json` | `b25db24bc3f4084ba8430acc09d445dfbf6daff0c2079d3c0b84b45908391119` |
| `AGENTS.md` | `c0b382d79d45badc59d89fa602762c0f7654d562b1636fe3e758ac2da273ee75` |
| `web/AGENTS.override.md` | `36594afe6a4c169193851ea192195860a7bf5d47fb726187a2b5bf2f85f40835` |
| `replit.md` | `1c660826555b9b17a75135d151d654b68ebf2f1e2d89a052128c2d6d3fb647fb` |
| `~/.codex/config.toml` | `1db1fbb01f14dca2eb104e9d258ba943cb73f1201f39c26c986fdb950f3c6c0b` |
| `~/.codex/AGENTS.md` | `79aa93b09482ad62f690c745bdb2847d5ef0395474fd013c618c43eade24a95c` |

## Instruction chain

Precedence is highest first:

1. User prompt for this preparation task.
2. Repository-scoped supplied `AGENTS.md` instructions in the prompt.
3. `/Users/quentingeczy/Desktop/silverstone-site/web/AGENTS.override.md` for `/web` work.
4. `/Users/quentingeczy/Desktop/silverstone-site/AGENTS.md` for repository-wide rules.
5. `/Users/quentingeczy/.codex/AGENTS.md` for user-level Codex defaults.
6. Codex user and project configuration files.

No root `AGENTS.override.md` file exists. `/Users/quentingeczy/.codex/AGENTS.override.md` is also absent.

## Instruction findings

- The repository intentionally contains both the frozen legacy root site and the active React Router application under `/web`.
- `/web/AGENTS.override.md` correctly identifies `/web` as the active application boundary.
- Root `AGENTS.md` contains broad Replit and transformation language that is still useful for evidence-first workflow, but future homepage work needs the more specific `/web` V2 routing and capability protocol.
- Replit-era package registry configuration in `/web/.npmrc` and lockfile tarball URLs were stale and blocked reproducible npm installs outside Replit.
- Project `.mcp.json` and `.codex/config.toml` were incomplete relative to the requested UI/component MCP set and did not preserve URL/cwd/env metadata through the sync script.
- Project skill symlinks were intact; no broken project symlinks were found.
- Instruction file sizes remain modest. Detailed inventories were placed under `/docs/codex/` rather than copied into `AGENTS.md`.
