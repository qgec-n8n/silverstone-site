# Replit Runtime Audit

**Date:** 2026-06-30  
**Branch:** `codex/prompt-5-5-runtime-forensics`  
**Scope:** Prompt 5.5 runtime forensics and Replit preview correction.

## Finding

The failed previous service implementation was not only a content problem. The repository still had more than one plausible service-page runtime:

- Root `package.json` active `start` served the legacy repository root with `serve . -l 5000 --no-clipboard`.
- `.replit` already had a `/web` dev command, but root-level `start`, `build`, and preview scripts still pointed at the frozen legacy/static surface.
- `/web/public/prototypes/services/**` still contained obsolete static prototype service pages.
- `/web/src/visual/data/page-modules.tsx` still contained the old service fallback visual module with prototype body copy.
- `/web/src/content/migrated/approved/registry.ts` still registered the seven canonical services as migrated content records.

This allowed an environment that selected root `npm start`, a static preview, or stale prototype paths to show old service work even after `/web` approved-copy routes existed.

## Runtime Correction

Root scripts now delegate to `/web`:

| Script                   | Active command                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `npm run dev`            | `npm --prefix web run dev -- --port ${PORT:-5000} --strictPort`                      |
| `npm start`              | `npm run replit:dev`                                                                 |
| `npm run replit:dev`     | `npm --prefix web run dev -- --port ${PORT:-5000} --strictPort`                      |
| `npm run replit:preview` | `npm --prefix web run build && npm --prefix web run preview -- --port ${PORT:-5000}` |
| `npm run build`          | `npm --prefix web run build`                                                         |

`.replit` now uses `npm run replit:dev` for both the top-level Run command and the workflow task. The workflow still waits for port `5000`, and the command uses `--strictPort` so a port mismatch fails visibly instead of silently moving to another port.

Legacy root commands remain available only as explicit `legacy:start` and `legacy:build`.

## Smoke Evidence

- `PORT=4182 npm run replit:dev`: React Router/Vite started from `/web` on `0.0.0.0:4182`.
- Fetch `http://127.0.0.1:4182/services/web-design-development`:
  - `status: 200`
  - approved H1 present: `true`
  - approved distinctive phrase present: `true`
  - route-entry title present: `true`
  - old prototype phrase `built around a clear business problem`: `false`
  - legacy root title `<title>Silverstone Services</title>`: `false`
- `PORT=4181 npm run replit:preview`: root preview built `/web` and served the staging preview.

## Guardrail Tests

Added `web/tests/unit/replit-runtime.test.ts` to assert:

- `.replit` delegates to `npm run replit:dev`.
- Root active scripts delegate to `/web`.
- Root active `start` no longer serves `.` directly.
