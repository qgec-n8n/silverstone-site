# ExecPlan: Transformation Governance And Foundation

## Objective

Establish the ownership, handoff, and instruction controls required before implementation work begins on the approved `/web` rebuild.

## Authority

This ExecPlan is subordinate to the following authoritative architecture files:

- `/docs/silverstone-transformation/architecture/rebuild-decision-v1.md`
- `/docs/silverstone-transformation/architecture/execution-blueprint-v1/MANIFEST.md`
- `/docs/silverstone-transformation/architecture/execution-blueprint-v1/branch-and-ownership-model-v1.md`
- `/docs/silverstone-transformation/architecture/execution-blueprint-v1/handoff-contracts-v1.md`
- `/docs/silverstone-transformation/architecture/execution-blueprint-v1/quality-gates-v1.md`
- `/docs/silverstone-transformation/architecture/execution-blueprint-v1/rollback-checkpoint-plan-v1.md`

## Observed baseline

- `transformation/audit` was clean at `c38aa61a21fa0a1c3772a31c761db1f3981d43db` before the foundation branch was created.
- The required audit, blueprint, and research artifacts were present and matched their manifests.
- The repository did not yet contain a `/web` instruction file, a root `replit.md`, a governance ownership register, or a handoff template.
- The repo remains the legacy-root Silverstone site, so governance files must not mutate production content or controls.

## Scope

- Create the repository instruction files required to govern the transformation.
- Define file ownership and handoff boundaries before any implementation work.
- Keep all non-governance application, legacy-site, Netlify, and integration files unchanged.

## Checkpoint names

The checkpoint names are fixed and match the rollback plan:

| Checkpoint | Name |
|---|---|
| CP0 | Audit and decision authority |
| CP1 | `/web` foundation and SSG proof |
| CP2 | Route/content contracts and shared shell |
| CP3 | Main and legal route parity |
| CP4 | Services parity |
| CP5 | Blog parity |
| CP6 | Integrations mocked and sandboxed |
| CP7 | Motion enhancement |
| CP8 | Staging candidate |
| CP9 | Future cutover boundary |

## Acceptance criteria

- `/web/AGENTS.override.md` explicitly permits the approved rebuild only inside `/web`.
- `/replit.md` exists at the repository root and states that Replit is non-production staging with explicit owned directories and Preview requirements.
- `/docs/silverstone-transformation/architecture/file-ownership-register-v1.csv` defines Codex-owned, Replit-owned, frozen, and handoff-only paths.
- `/docs/silverstone-transformation/handoffs/HANDOFF_TEMPLATE.md` contains the mandatory handoff schema.
- No application, legacy-site, Netlify, or integration files are changed by this governance commit.
- The new instructions are loadable from a fresh context rooted at `/web`.

## Verification plan

1. Confirm the audit branch SHA and the new foundation branch SHA.
2. Validate the manifests and instruction files with targeted reads.
3. Confirm `git status` shows only the approved governance paths.
4. Commit the governance files with a documentation-only message.

## Rollback

- Revert the governance commit if any instruction file is malformed or if an unapproved path changes.
- Do not touch `main`.

## CP2 execution record — route/content migration framework

The route/content contract workstream was executed on `transformation/foundation` from start commit `d48cebd4`.

- 50 A-01 canonical routes are represented in the future route manifest.
- 133 A-01 SEO/redirect records have exactly one typed disposition.
- Route groups, content extraction, SEO generation, redirect validation, internal-link validation, route templates, lazy route modules, prerendering and route-parity tests are implemented.
- One former self-loop route remains explicitly draft and unresolved; no content decision was invented.
- Replit-owned paths, the legacy root and production `netlify.toml` remain unchanged.
- Implementation evidence and rollback instructions are recorded in `route-migration-implementation-v1.md`.
