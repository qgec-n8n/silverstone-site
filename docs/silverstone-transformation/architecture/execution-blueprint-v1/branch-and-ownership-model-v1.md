# Silverstone branch and ownership model v1

**Status:** Authoritative after upload  
**Applies to:** D-02 onward

## 1. Branch topology

```text
main                                  # production baseline; immutable
└── transformation/audit              # evidence and architecture authority
    └── transformation/react-vite      # integration branch for /web
        ├── worktree/foundation
        ├── worktree/content
        ├── worktree/routes-main
        ├── worktree/routes-services
        ├── worktree/routes-blog
        ├── worktree/integrations
        ├── worktree/motion
        ├── worktree/quality
        └── transformation/staging     # release-candidate branch
```

Branch names are exact. Temporary branches follow `dNN/<workstream>-<slug>` and are deleted after merge.

`main` is not a merge target during D-02 onward. `transformation/audit` receives documentation-only authority updates. `/web` implementation merges into `transformation/react-vite`. Only validated release-candidate commits are promoted to `transformation/staging`.

## 2. Worktree rules

- Each active Codex task uses a dedicated Git worktree and branch.
- One worktree has one named workstream owner.
- Worktrees are rebased or merged from `transformation/react-vite` before handoff, not edited against stale snapshots indefinitely.
- A worktree cannot contain unrelated changes.
- No agent may resolve a semantic conflict without the owning workstream's handoff notes.

## 3. Exact file ownership

| Path | Primary editor | Secondary role | Concurrency rule |
|---|---|---|---|
| `/web/package.json`, lockfile, Vite/TS/Tailwind config | Codex foundation | Replit read-only | exclusive Codex lease |
| `/web/src/app/**` | Codex foundation | Replit review only | exclusive Codex lease |
| `/web/src/routes/**` | Codex route worktrees | Replit visual feedback only | split by route-group directories |
| `/web/src/content/**` | Codex content migration | ChatGPT editorial review | no Replit direct edits |
| `/web/src/components/ui/**` | Codex | Replit may propose patches on separate branch | file-level lease required |
| `/web/src/components/sections/**` | Codex | Replit may visually edit assigned files | explicit non-overlap list |
| `/web/src/features/**` | Codex | Replit preview only unless assigned | feature-directory lease |
| `/web/src/integrations/**` | Codex only | Replit test UI only | Replit prohibited from editing |
| `/web/src/seo/**` | Codex only | ChatGPT review | Replit prohibited from editing |
| `/web/src/motion/gsap/**` | Codex motion | Replit rendered feedback | Codex only |
| `/web/src/motion/framer/**` | Codex motion | Replit may edit assigned presentational variants | file-level lease |
| `/web/src/styles/**` | Codex design-system owner | Replit assigned token-neutral polish only | no simultaneous editing |
| `/web/src/assets/**`, `/web/public/**` | Codex asset owner | Replit may add approved exports to assigned folder | manifest update required |
| `/web/tests/**`, `/web/src/test/**` | Codex quality | Replit app-testing evidence | Replit does not rewrite assertions |
| `/web/scripts/**` | Codex only | none | exclusive |
| `/docs/silverstone-transformation/**` | ChatGPT/Codex documentation owner | Replit read-only | separate documentation PR |

## 4. Ownership lease

Before an editing session, the owner records:

```yaml
lease_id: D02-<workstream>-<sequence>
branch: dNN/<workstream>-<slug>
owner: Codex | Replit
paths:
  - exact/glob/path
start_commit: <sha>
purpose: <one sentence>
expires: <date or handoff condition>
```

Leases live in the PR description or workstream handoff; no new repository coordination file is required unless D-02 creates one. A lease must be closed before another platform edits the same path.

## 5. Replit boundary

Replit may:

- inspect and preview a clean checkout;
- use Canvas/Visual Editor for explicitly assigned presentational files;
- produce responsive screenshots and visual findings;
- run staging-only app tests;
- commit to a dedicated Replit branch.

Replit may not:

- edit integration, SEO, build, environment, test-oracle or deployment files;
- modify the same file or glob under an active Codex lease;
- publish production;
- introduce secrets;
- merge its own branch;
- treat Preview behaviour as release proof.

## 6. Merge order

1. foundation;
2. typed route/content contracts;
3. shared shell and primitives;
4. main/legal routes;
5. service routes;
6. blog routes;
7. integrations;
8. motion and shader enhancement;
9. quality hardening;
10. staging candidate.

Cross-cutting config changes merge before dependent route work. Content records merge before pages that consume them. Motion enhancement merges after static and reduced-motion routes pass.

## 7. Required PR evidence

Every PR includes:

- scope and exact paths;
- start and end commit;
- tests executed and outcomes;
- route(s) affected;
- bundle impact;
- accessibility impact;
- screenshots where visual;
- integration/environment impact;
- known deviations;
- rollback commit or revert instruction;
- confirmation that legacy root and production controls were untouched.

## 8. Conflict policy

- Textual conflict: owning workstream resolves.
- Contract conflict: architecture owner decides before code changes continue.
- Route/content conflict: route registry and content owner decide.
- Visual conflict: design-system owner decides after reduced-motion and accessibility review.
- Integration conflict: integration owner and release owner jointly decide.
- Production-boundary conflict: stop; no merge until owner authorisation.

## Evidence authority

This blueprint is derived from the following repository authorities on branch `transformation/audit`:

- `../../audits/MANIFEST.md` (`A01-MANIFEST`)
- `../../audits/repository-live-audit-v1.md` (`A01-AUDIT`)
- `../../audits/route-inventory-v1.csv` (`A01-ROUTES`)
- `../../audits/asset-integration-inventory-v1.csv` (`A01-ASSETS`)
- `../../audits/repo-live-diff-v1.md` (`A01-DIFF`)
- `../../audits/seo-redirect-baseline-v1.csv` (`A01-SEO`)
- `../../audits/external-live-audit/` (`A02-*`)
- `../../research/platforms/` (`B01-*`)
- `../../research/benchmarks/` (`B02-*`)
- `../rebuild-decision-v1.md` (`C01-DECISION`)

Where evidence conflicts, the precedence order is: current owner-approved decision record; fresh implementation-baseline crawl; A-01 route/redirect inventories; A-02 advisory findings; platform and benchmark research. No conflict may be silently reconciled.

