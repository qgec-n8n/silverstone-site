# Silverstone rollback and checkpoint plan v1

## 1. Rollback principle

The untouched legacy root and production `main` are the operational rollback baseline. The rebuild cannot remove or weaken that baseline before a separately approved cutover.

## 2. Checkpoints

| Checkpoint | Contents | Restore method |
|---|---|---|
| CP0 | audit and decision authority | reset documentation branch to recorded SHA |
| CP1 | `/web` foundation and SSG proof | revert foundation merge commit |
| CP2 | route/content contracts and shell | revert route-contract/shell merges |
| CP3 | main/legal route parity | revert M1/M2 batch commits |
| CP4 | services complete | revert service batch merge |
| CP5 | blog complete | revert article batch merges |
| CP6 | integrations mocked/sandboxed | revert integration merge; staging remains non-sending |
| CP7 | motion enhancement | revert motion merge; static experience remains |
| CP8 | staging candidate | redeploy previous accepted staging SHA |
| CP9 | future cutover | separate release plan; legacy deployment retained for rapid rollback |

Each checkpoint is a tagged or recorded immutable SHA with validation evidence.

## 3. Commit discipline

- One logical change per commit.
- Route batches are independently revertible.
- Motion is layered after static functionality so it can be reverted without removing content.
- Integration UI and provider adapter commits are separable.
- Generated artifacts are reproducible and not the only source.

## 4. Rollback triggers

Immediate rollback to the previous checkpoint for:

- production-boundary breach;
- staging indexability;
- production email/booking/analytics contamination;
- missing canonical route or redirect loop;
- critical accessibility regression;
- hard JavaScript ceiling breach without approved exception;
- unrecoverable build/deploy failure;
- sustained animation below budget on representative desktop;
- secrets exposure.

## 5. Staging rollback rehearsal

Before acceptance:

1. deploy candidate SHA;
2. record route and integration smoke results;
3. redeploy prior accepted SHA;
4. confirm routes, headers and mocks recover;
5. redeploy candidate only after rehearsal evidence is retained.

## 6. Future production cutover boundary

This blueprint stops before production release. A later release plan must specify Netlify configuration, DNS, environment variables, redirects, cache headers, analytics, Resend, Calendly, monitoring, rollback window and named human approvals.

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

