# ExecPlan: Favicon Recovery and Sitewide Logo Migration

## 2026-04-02 update

### Observed baseline

- The repo had since been refreshed with a new `redketchup` favicon package whose root assets intentionally did not include `favicon-48x48.png`.
- Runtime HTML and `scripts/seo-audit.js` still required `/favicon-48x48.png`, so the site contract no longer matched the favicon package the user wanted deployed.
- `npm run seo:audit` was already failing before this favicon pass, but the failure was unrelated to favicon inventory: `sitemap.xml` was stale relative to the April 1, 2026 services-page commits.

### Root cause

- The previous recovery restored a generated `favicon-48x48.png` to preserve the old head contract, but the current desired state is to use the downloaded favicon package as-is.
- The HTML head block, audit rules, and manifest needed to be realigned around the new canonical root favicon set instead of rebuilding the removed 48x48 derivative.

### Changes made

- Replaced the root favicon binaries with the provided `redketchup` versions for:
  - `favicon.ico`
  - `favicon-32x32.png`
  - `favicon-16x16.png`
  - `apple-touch-icon.png`
  - `android-chrome-192x192.png`
  - `android-chrome-512x512.png`
- Removed `favicon-48x48.png` from the repo root.
- Updated all 50 runtime HTML pages to remove the `/favicon-48x48.png` reference and instead expose:
  - `/favicon.ico`
  - `/apple-touch-icon.png`
  - `/android-chrome-192x192.png`
  - `/favicon-32x32.png`
  - `/favicon-16x16.png`
  - `/site.webmanifest`
- Replaced the copied manifest placeholders so `site.webmanifest` keeps `name` and `short_name` as `Silverstone AI`.
- Updated `scripts/seo-audit.js` so the required favicon asset inventory and per-page head checks match the new favicon set.
- Regenerated `sitemap.xml` after verification confirmed the audit failure was stale generated output rather than a bad services inventory rule.

### Verification

- Confirm root icon inventory now matches the provided package plus the preserved manifest identity fields.
- Confirm no runtime HTML references `/favicon-48x48.png`.
- Confirm homepage, one blog page, and one service page expose the same new favicon block.
- Run `npm run seo:audit` after regenerating the sitemap if needed.

## Observed baseline

- Every runtime page still referenced `/favicon.ico`, `/favicon-48x48.png`, `/favicon-32x32.png`, `/favicon-16x16.png`, and `/site.webmanifest`.
- The refreshed favicon family was present at the root except for `favicon-48x48.png`, which had been deleted while the HTML and SEO audit still expected it.
- `favicon.ico` was current, but it only contained 16x16 and 32x32 icon frames, so it could not serve as the source for a true 48x48 PNG export.
- The old logo filename was still referenced across 50 runtime HTML pages: 8 root pages, 33 blog pages, and 9 service pages.
- Those references covered visible header/footer logos, `srcset` pairs, OG/Twitter tags, and JSON-LD image/logo fields.

## Root cause

- The favicon inventory became inconsistent when `favicon-48x48.png` was removed without updating the shared head markup or the SEO audit expectations.
- The new logo master had been added to `assets/logo/`, but no optimized 1x/2x web pair had been generated and no runtime references had been migrated off the legacy filename.

## Changes made

- Generated `favicon-48x48.png` from the refreshed `android-chrome-512x512.png` source so the root favicon family is complete again without changing the existing head contract.
- Re-exported `assets/logo/silverstone-logo-new.png` as the 1x site logo at `628x351` and generated `assets/logo/silverstone-logo-new@2x.png` at `1256x702`.
- Preserved alpha support on both logo assets and reduced the served 1x file from the original raw upload size to a web-ready PNG.
- Replaced legacy logo filename references across root, blog, and service runtime HTML pages, including visible logo `img` tags, `srcset` pairs, OG/Twitter images, and JSON-LD logo/image fields.

## Verification

- Confirm root icon inventory:
  - `favicon.ico`
  - `favicon-48x48.png`
  - `favicon-32x32.png`
  - `favicon-16x16.png`
  - `apple-touch-icon.png`
  - `android-chrome-192x192.png`
  - `android-chrome-512x512.png`
- Confirm asset dimensions:
  - `favicon-48x48.png` -> `48x48`
  - `assets/logo/silverstone-logo-new.png` -> `628x351`
  - `assets/logo/silverstone-logo-new@2x.png` -> `1256x702`
- Confirm both new logo assets retain alpha channels.
- Run `rg` to verify no runtime HTML still references `silverstone-logo-cropped-whitebg-v2.png` or `silverstone-logo-cropped-whitebg-v2@2x.png`.
- Run `node scripts/seo-audit.js`.
- Run browser checks on homepage, one blog page, and one service page to confirm:
  - header logo renders
  - footer logo renders
  - page source exposes the new OG/Twitter/JSON-LD image URL
  - favicon assets load without 404s
- Run `git diff --check`.
