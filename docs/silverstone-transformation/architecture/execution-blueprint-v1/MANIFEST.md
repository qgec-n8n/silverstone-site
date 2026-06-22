# Silverstone execution blueprint v1 — manifest

**Created:** 2026-06-22 (Europe/London)  
**Archive:** `silverstone-execution-blueprint-v1.zip`  
**Repository destination:** `/docs/silverstone-transformation/architecture/execution-blueprint-v1/`  
**Authority:** Becomes authoritative after owner upload.  
**Consumers:** D-02 onward.  
**Implementation status:** Planning and governance only; no repository or production code was implemented.

## Governing boundary

- New application: `/web`.
- Legacy root: untouched.
- Production `main`, Netlify, DNS, live environment variables, Resend, analytics and Calendly: not mutated or authorised for mutation.
- Staging: non-indexable and incapable of production email or booking.
- Codex/Replit: no overlapping file edits.

## Contents

| File | Purpose | Bytes | SHA-256 |
|---|---|---:|---|
| `acceptance-criteria-v1.csv` | 36 measurable acceptance criteria. | 5157 | `12ca4bf81ad36ef030462b3261b55d950afdd43011d9aaf5620b271ffec1b29a` |
| `animation-responsibility-model-v1.md` | CSS/Framer/GSAP/shader ownership and motion acceptance. | 3514 | `9b5cd79ce35e17f88fb557c21e9e03c993b7b0623729c2eb0eccca2984dc8a79` |
| `branch-and-ownership-model-v1.md` | Exact branch/worktree topology, leases and Codex/Replit file ownership. | 6562 | `d3f639e2fd2b5aec7b2e706c8d78636deb23be567643d0804a359ff9b100fd02` |
| `dependency-graph-v1.mmd` | Mermaid dependency and delivery graph. | 924 | `2d18db7c7c35d6f94a9c1842d483c3ecff4fc56a0fb59ff1ea46eeb37d0d31e9` |
| `handoff-contracts-v1.md` | Mandatory handoff schemas and rejection conditions. | 3418 | `9a43702c613368a533af80a9c80e115bf2296693643d36b225696ad7435a2974` |
| `integration-safety-model-v1.md` | Adapters, secrets, staging isolation and production safeguards. | 4393 | `86603be9ab1b3dc9303240aaa0e446657be63b7f63b172938a5c247d07b2dcb6` |
| `performance-budgets-v1.json` | Machine-readable performance, accessibility, animation and route budgets. | 2183 | `6b8356f2e0406e1ffa02dbed79c748973a9326b96b6e8d54af119eac270afecf` |
| `quality-gates-v1.md` | G0–G7 gates, testing pyramid and defect severity. | 4495 | `85aa51d4f4c0de3e851800d54765cb0a9e0928c752c4ea3a0ddb1a13de74ada7` |
| `rollback-checkpoint-plan-v1.md` | Checkpoints, triggers, rehearsal and future cutover boundary. | 3385 | `27f64671710c3eb82de4b32c3e34d9c8d9c7478d21704d981be346f723018b57` |
| `route-content-migration-plan-v1.md` | 50-route migration waves, parity, content disposition and SEO rendering. | 5789 | `acd6db4ec143dbfbe36330c18f72d194779400a72dec0e2c10c8a15e249f8b93` |
| `target-architecture-v1.md` | Application, content, routing, rendering, component and environment architecture. | 12126 | `a1cf425c7cd862d095072ef526228a523126410e93e0b714b485a6bd3a4dfca6` |

## Source authority

Primary repository evidence: A-01 audits and inventories, A-02 external live audit, B-01 platform research, B-02 benchmark research and `rebuild-decision-v1.md` on `transformation/audit`.

## Validation record

- PASS — all 12 required filenames are present.
- PASS — destination is exact.
- PASS — D-02 onward are identified as consumers.
- PASS — route baseline is exactly 50.
- PASS — `/web` boundary and untouched legacy root are explicit.
- PASS — branch names and worktree topology are exact and consistent.
- PASS — Codex/Replit ownership boundaries prohibit overlapping edits.
- PASS — production safeguards cover main, Netlify, DNS, environment variables, Resend, analytics and Calendly.
- PASS — staging is blocked from indexing and production email/booking.
- PASS — measurable targets include JavaScript, LCP, CLS, INP, accessibility, long tasks, FPS, reduced motion and native scrolling.
- PASS — acceptance CSV parses with 36 unique IDs.
- PASS — JSON parses and Mermaid file is non-empty.
- PASS — every manifest content hash matches the packaged file.
- PASS — no repository code or production system was changed.

## Upload instruction

Extract or upload the directory contents unchanged to `/docs/silverstone-transformation/architecture/execution-blueprint-v1/`. Preserve filenames. This manifest becomes the package index.
