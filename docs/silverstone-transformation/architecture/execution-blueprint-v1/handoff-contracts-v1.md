# Silverstone handoff contracts v1

## 1. Universal handoff schema

```yaml
handoff_id: DNN-workstream-sequence
from: person/platform
to: person/platform
branch: exact-branch
commit: exact-sha
base_commit: exact-sha
paths_owned:
  - exact path/glob
scope_completed:
  - measurable outcome
tests:
  - command: ...
    result: pass|fail
artifacts:
  - path or URL
budgets:
  javascript_gzip_kb: number
  lcp_ms: number|null
accessibility:
  automated_score: number|null
  critical_violations: number
production_boundary:
  legacy_root_unchanged: true
  production_controls_untouched: true
known_deviations:
  - id and approval
open_risks:
  - owner and next action
rollback:
  revert_commit_or_instruction: ...
next_owner_constraints:
  - do not edit ...
```

## 2. ChatGPT to Codex

Must include approved decisions, exact repository paths, acceptance IDs, unresolved questions, prohibited changes and source-artifact references. Recommendations are not implementation authority unless marked approved.

## 3. Codex to Replit

Must include a clean commit, exact files Replit may edit, exact files it may not edit, design tokens, target viewports, reduced-motion expectation, commands to run and screenshot checklist. Replit must not begin while the same paths are leased by Codex.

## 4. Replit to Codex

Must include commit SHA, file list, screenshots, Preview limitations, any Visual Editor transformations and confirmation that no integration/build/SEO/environment files changed. Codex re-runs tests and may rewrite the patch before integration.

## 5. Route migration handoff

For every migrated route or batch:

- route IDs and canonical paths;
- source records;
- content disposition;
- claims/deviations;
- metadata/schema snapshot;
- screenshots;
- no-JS result;
- link-check result;
- accessibility result;
- bundle delta;
- acceptance row IDs.

## 6. Integration handoff

Includes provider contract, environment matrix, mock/sandbox design, failure modes, secret names only, tests, side-effect evidence and explicit statement that no production action occurred.

## 7. QA to staging

Includes candidate SHA, clean-build log, route report, budget report, accessibility report, redirect report, robots/header evidence, secrets scan, integration guard results and rollback rehearsal.

## 8. Rejection conditions

A handoff is rejected if it lacks exact commit/path authority, contains unreviewed production-impact changes, omits failed tests, hides deviations, uses stale screenshots or permits overlapping edits.

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

