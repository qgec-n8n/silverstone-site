# Silverstone transformation audit manifest

Audit version: v1
Completed: 2026-06-22
Repository root: `/Users/quentingeczy/Desktop/silverstone-site`
Audit branch: `transformation/audit`
Pinned source SHA: `1e445c305c30cae93d5f6427135a238be8d58c14`

## Production-safety boundary

This work was read-only with respect to production. It made no deployment, Netlify mutation, DNS change, environment-variable update, analytics change, IndexNow submission, contact-form submission, email send, or Calendly booking.

All repository additions are under:

`docs/silverstone-transformation/audits/`

## Required artifacts

| Artifact | Rows/role | SHA-256 |
|---|---|---|
| `repository-live-audit-v1.md` | authoritative audit | `e1358c4047608ea13726fa58d8bf066e33edca46243ac61c7c2710106d643265` |
| `route-inventory-v1.csv` | 50 canonical routes | `ad29a9b317f839eedcf56fd14534a5783275f1ca6f8db291ab17696f213a66bf` |
| `asset-integration-inventory-v1.csv` | 1,615 assets + 12 integrations | `d75047e67f7dd5004332df250f610fa8e6e4aa89cc16edabaf214c441c9c17c0` |
| `repo-live-diff-v1.md` | repository/live parity baseline | `4608fc5ad014bd54678681a7a96ee83b397b45945b330c963f7ff1f8c54f20ed` |
| `seo-redirect-baseline-v1.csv` | 50 canonicals + 83 unique redirect sources | `ee4ed3b0bc345451ca04ed307b20b1dd554259b3dafcb76acaa7be86b9081fe8` |
| `evidence/` | machine-readable scans, scripts, logs, screenshots | indexed below |

The manifest's own hash is intentionally omitted because adding it would change the file.

## Evidence index

| Evidence | Purpose | SHA-256 |
|---|---|---|
| `evidence/audit-summary.json` | reconciled counts and high-level signals | `2b19ff06c3b12e9ef17fceccb5fb8d9db06414911a45b52bb7cb2a6878c5eea8` |
| `evidence/repository-scan.json` | full repository page, redirect, asset, and integration scan | `e5d3a061ad8c808ea21260205f7ffc644ca8c0ce8449d9aa99437e4997c1afa6` |
| `evidence/repository-scan.mjs` | repository scan implementation | `56749ab6daf499e100f11b7ff59afd69eaa736f554adb032814e0b2bc38469c5` |
| `evidence/live-http-crawl.json` | canonical, redirect, and supporting-resource HTTP results | `905e2b162df80bc9d0245e943d27963af9d4de54c7bf46dcbbd089e0366f0b5d` |
| `evidence/live-http-crawl.mjs` | live HTTP crawl implementation | `901240d534ee3db4eea723bb5bd4bab93b7cbe19464d0dddae9336d472dd37e2` |
| `evidence/live-rendered-route-scan.json` | in-app browser scan across all canonical routes | `0de73c97188ba806eef99f044fd5a3ead64737638cf68066eac9d0e6b6a16a37` |
| `evidence/live-about-retry.json` | successful retry after one bulk-scan timeout | `a044424fba276ffbe4fbe6e800af26dce3f308478d9c4a0b02200f1a9358775c` |
| `evidence/build-comparison.json` | clean pinned-source build and generated-artifact comparison | `6d410518eceb9f097ecb8caebf1ae02f26c6bc22b4b42f48fe531476fd45a746` |
| `evidence/js-bundle-comparison.json` | raw and whitespace-normalized JS bundle comparison | `2833d98c68c55736edb99de2b59d173a750ae3678f071eea9efe82c66a464954` |
| `evidence/validation-log.md` | command outcomes and production-safety record | `9c1d3a045e8e20655073e726d44610e5799a5ec412b03d42daa9a542de8529b5` |
| `evidence/live-home-desktop.png` | live home desktop render | `6a05933646e812e2b742089bcd760ece9dc67405d9f84f8fea79297dfd427300` |
| `evidence/live-home-mobile-390x844.png` | live home mobile render | `deafebccef97b5df0f8cac43508536a71f65d710d1c24124f33df4b3725ff9c6` |
| `evidence/live-book-desktop.png` | live Calendly page render | `a03719f250aebe88021b1e48dc7144405a39bcfc9f4ee83da9c2a44a749cff83` |
| `evidence/live-contact-desktop.png` | live contact page render | `57826ab1c08b64c461d20f797f889ccab07fe452947966b43d9b32d38bdccfa7` |
| `evidence/live-pricing-desktop.png` | live React pricing widget render | `46da0f46d771aa6ca656620b0f4c3f1da10949fd7184cd547fc56864012f3c8a` |
| `evidence/benchmark-agentivelabs-desktop.png` | benchmark desktop rendered observation | `4eb0ab7532f81316f6f7ac045868e125588c9670613e4088a1fde52378250a00` |
| `evidence/benchmark-agentivelabs-mobile-390x844.png` | benchmark mobile rendered observation | `296f507ab367d2a6a7285e79a1eae711c7aae41f46f6c4654976acd19eff3b9d` |

## Inventory reconciliation

| Check | Result |
|---|---|
| Filesystem HTML pages | 50 |
| SEO inventory pages | 50 |
| Committed sitemap URLs | 50 |
| Expected canonical URLs | 50 |
| Live canonical `200` | 49 |
| Live canonical redirect loops | 1 |
| Redirect definitions | 85 |
| Unique redirect source paths | 83 |
| Asset records | 1,615 |
| Integration records | 12 |

## CSV validation

Python's standard `csv` parser was used to review every row.

| CSV | Parsed rows | Columns | Malformed rows | Duplicate keys |
|---|---:|---:|---:|---:|
| `route-inventory-v1.csv` | 50 | 30 | 0 | 0 |
| `asset-integration-inventory-v1.csv` | 1,627 | 16 | 0 | 0 |
| `seo-redirect-baseline-v1.csv` | 133 | 16 | 0 | 0 |

## Commands and tools used

Representative repository commands:

```sh
git rev-parse --show-toplevel
git status --short --branch
git remote -v
git symbolic-ref refs/remotes/origin/HEAD
git rev-parse main origin/main
git show -s --format=fuller 1e445c305c30cae93d5f6427135a238be8d58c14
git fetch origin --prune
find . -name AGENTS.md -o -name AGENTS.override.md
find .agents/skills -maxdepth 2 -name SKILL.md
rg --files
node scripts/seo-inventory.js
npm run seo:audit
node /tmp/silverstone-repository-scan.mjs
node /tmp/silverstone-live-crawl.mjs
node /tmp/silverstone-build-validate.mjs
node /tmp/silverstone-js-compare.mjs
```

The build commands ran against a temporary archive of the pinned SHA:

```sh
npm run build
npm run generate:sitemaps
```

Live inspection used read-only HTTP requests and the in-app browser at desktop and 390×844 mobile viewports.

## Capabilities

Available repository skills:

- brainstorming
- browser-use
- copywriting
- find-skills
- SEO audit
- UI/UX Pro Max
- web-design-guidelines

All seven materially informed the audit. `find-skills` also searched external skill listings for repository audit, SEO migration, and accessibility capabilities; none was installed because the existing capabilities were sufficient and dependency churn was out of scope. The in-app browser was used for rendered inspection and screenshots.

## External primary references

- Resend send-email API: <https://resend.com/docs/api-reference/emails/send-email>
- Resend domain guidance: <https://resend.com/docs/dashboard/domains/introduction>
- Web interface guidance source used by the repository skill: <https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md>

## Limitations and blockers

- `git fetch origin --prune` could not authenticate. Remote freshness beyond the local `origin/main` ref is unverified.
- Resend, Calendly, Netlify UI, analytics, Search Console, DNS, and environment-variable control planes were not accessed.
- Delivery and booking behavior were not tested because that would create production side effects.
- The benchmark was inspected only as rendered output.
- Unsupported proof means unsupported by inspected repository/live-page evidence, not proven false.
- Unreferenced assets require an owner decision before removal.

## Pre-existing dirty state

These paths were dirty before the audit and retained the same SHA-256 after the audit:

| Path | SHA-256 |
|---|---|
| `.DS_Store` | `a98657b0eb782433e37db0980620579cb886907ba288912deadf9396c011e4d9` |
| `.codex/config.toml` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `assets/images/.DS_Store` | `698a6cc70da5b890c6726a1eff35eb9c7eb0aa74ad6240ef234f717305f66b43` |

No audit-generated file remains outside `docs/silverstone-transformation/audits/`.

## Rollback

After the audit commit is created, remove only that commit from the audit branch with:

```sh
git revert <audit-commit-sha>
```

The pre-existing dirty files above are not part of the audit commit and are not affected by rollback.
