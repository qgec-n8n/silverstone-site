# Validation Report

Generated for the Codex preparation task on 2026-06-25.

## Dependency validation

| Check | Result | Classification |
| --- | --- | --- |
| `npm ci` | Passed: 473 packages installed, 0 vulnerabilities | Pass |
| Programmatic 51-package manifest check | Passed: all 51 in `package.json` | Pass |
| Programmatic 51-package lockfile check | Passed: all 51 in `package-lock.json` | Pass |
| Programmatic resolver check | Passed: all 51 resolved by import, require, package root, type package, or CSS package fallback as appropriate | Pass |
| `npm ls <all 51 packages>` | Passed | Pass |
| `npm ls --depth=0` | Passed | Pass |
| Runtime/import smoke checks | Passed for React, React Router, GSAP, `@gsap/react`, Framer Motion, Lenis, Three.js, R3F, Drei, postprocessing, Paper shaders, `particles.js`, Tailwind, Radix, Simple Icons, Playwright, axe, Testing Library, Vitest, local fonts, and `tw-animate-css` stylesheet | Pass |
| Lockfile drift check | Passed after npm normalized optional Tailwind WASM bundled entries; second `npm install --package-lock-only --ignore-scripts` produced the same lockfile hash | Pass |

## Project validation

| Command | Result | Classification |
| --- | --- | --- |
| `npm run format:check` | Failed: 41 existing `/web/src` and config files are not Prettier-formatted | Pre-existing source-format defect |
| `npm run lint` | Passed | Pass |
| `npm run typecheck` | Passed: `react-router typegen` and `tsc --noEmit` | Pass |
| `npm run test` | Passed: 16 files, 33 tests | Pass |
| `npm run build` | Passed: React Router staging build and prerender completed | Pass |
| `npm run bundle:report` | Exited 0; reported `Foundation JavaScript: 289.33 KB gzip (target-miss)` | Performance baseline warning |
| `npm run staging:safety` | Passed | Pass |
| `npm run test:e2e` | Passed: 32 Playwright tests | Pass |
| `npm run test:a11y` | Passed: 2 Playwright/axe tests | Pass |
| `npm run dev -- --port 4177` plus `curl -I /` | Passed: dev server launched and homepage returned HTTP 200 | Pass |

## Baseline failures and warnings

- Prettier formatting drift is pre-existing and was not repaired because it would touch unrelated application files outside this preparation scope.
- Foundation JavaScript gzip size misses the current report target, but the script exits successfully. Treat as a performance baseline warning for future homepage work.
- Playwright emitted `NO_COLOR`/`FORCE_COLOR` warnings from the web server process; tests still passed.

## Generated-output handling

- The temporary Playwright MCP snapshot directory created by the MCP smoke test was removed before staging.
- Build output, Playwright reports, node_modules, and local caches remain untracked/ignored.
