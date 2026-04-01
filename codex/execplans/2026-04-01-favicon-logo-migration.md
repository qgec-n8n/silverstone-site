# ExecPlan: Favicon Recovery and Sitewide Logo Migration

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
