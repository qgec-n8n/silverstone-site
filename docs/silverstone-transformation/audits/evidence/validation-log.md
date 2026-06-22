# Audit validation log

Date: 2026-06-22
Pinned source: `1e445c305c30cae93d5f6427135a238be8d58c14`

## Git and instructions

- `git rev-parse --show-toplevel` → `/Users/quentingeczy/Desktop/silverstone-site`
- initial branch → `main`
- local `main` → `1e445c305c30cae93d5f6427135a238be8d58c14`
- local `origin/main` → `1e445c305c30cae93d5f6427135a238be8d58c14`
- `origin/HEAD` → `origin/main`
- `git fetch origin --prune` → failed because GitHub credentials were unavailable
- applicable instruction files → `AGENTS.md` only
- audit branch → `transformation/audit`

## Inventory

- filesystem/indexability inventory → 50 HTML pages
- groups → 7 main, 1 legal, 9 service, 33 blog
- sitemap URL set → 50, equal to expected canonical set
- redirect definitions → 85
- unique redirect sources → 83
- duplicate redirect sources → 2
- forced self-redirects → 1
- public asset records → 1,615
- asset bytes → 703,128,292
- integration contracts → 12

## SEO audit

Command:

```sh
npm run seo:audit
```

Result:

```text
SEO audit failed: sitemap.xml: generated sitemap content is stale; run npm run generate:sitemaps
```

The sitemap membership is correct. All 50 committed `lastmod` values are stale relative to Git-derived generator output. Production serves a generated-current sitemap.

## Clean pinned-source build

Commands ran in a temporary Git archive and did not write to the working tree:

```sh
npm run build
npm run generate:sitemaps
```

Results:

- build succeeded;
- sitemap generation succeeded;
- 23 CSS source files built;
- 15 JavaScript source files built;
- 1,263 image-generation operations reported;
- committed/generated CSS hashes match;
- committed/generated JavaScript raw hashes differ but match after whitespace normalization;
- committed/generated sitemap hashes differ;
- committed derivative files: 1,227;
- clean-build derivative files: 1,251;
- matching derivatives: 1,215;
- differing derivatives: 12, all `blog_39` variants;
- generated-only derivatives: 24, all expected `blog_40` and `blog_41` variants;
- repository-only derivatives: 0.

Machine-readable details:

- `build-comparison.json`
- `js-bundle-comparison.json`

## Live HTTP and browser

- canonical requests → 49 `200`, 1 redirect loop;
- redirect requests → all 83 unique source paths returned configured status/location;
- rendered bulk scan → 50 attempted;
- `/about` initial bulk-scan timeout → retry passed;
- lead-capture canonical → `ERR_TOO_MANY_REDIRECTS`;
- successfully rendered routes → one H1, no loaded broken images, no horizontal overflow;
- desktop parallax → fixed backgrounds observed;
- mobile home parallax → staged root/layers remained active after scroll;
- contact form → inspected without POST;
- Calendly → iframe inspected without booking;
- benchmark → rendered observation only.

## Production-safety confirmation

No production deployment, Netlify mutation, DNS change, environment-variable change, analytics mutation, IndexNow submission, contact-form submission, email send, or Calendly booking occurred.
