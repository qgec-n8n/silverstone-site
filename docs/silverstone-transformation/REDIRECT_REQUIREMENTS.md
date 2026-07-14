# Silverstone Redirect Requirements

**Status:** Current production redirect and URL-variant contract.
**Last updated:** 2026-07-14.
**Sources:** `netlify.toml`, `netlify/edge-functions/reject-noncanonical-paths.ts`, `web/react-router.config.ts`, `web/scripts/generate-seo-artifacts.mjs`.

## Contract

- The only production redirect is the permanent hostname redirect from `https://www.silverstone-ai.com/*` to `https://silverstone-ai.com/:splat`.
- The hostname redirect preserves the complete path and Netlify-forwarded query string and terminates at the final canonical host in one hop.
- No legacy-path, `.html`, niche, service-alias, article-alias, or catch-all redirect is active or approved.
- Every canonical application route is prerendered and must return `200` directly from the publish directory.
- Netlify Pretty URLs are disabled so slashless canonical requests are not redirected to trailing-slash paths.
- Non-root trailing-slash, repeated-slash, and `.html` variants return `404` through the narrowly matched edge guard. Uppercase and mixed-case route variants miss the case-sensitive static files and return `404` naturally.
- Unknown paths and removed aliases return genuine `404` responses. They must not be rewritten to the React shell or another valid page.
- Static assets, `sitemap.xml`, and `robots.txt` are served as files and are not subject to an application fallback.

## Active Redirect Inventory

`netlify.toml` contains exactly one `[[redirects]]` entry:

| Source | Destination | Status | Forced | Query handling |
| --- | --- | ---: | --- | --- |
| `https://www.silverstone-ai.com/*` | `https://silverstone-ai.com/:splat` | 301 | yes | forwarded by Netlify |

There is no `_redirects` file in `web/public` or the generated publish directory.

## Canonical Route Policy

- The root canonical is `https://silverstone-ai.com/`.
- Every non-root canonical is lowercase and slashless.
- Service canonicals are the seven approved `/services/<service>` routes.
- Industry canonicals are `/industry` and the nine approved `/industry/<slug>` routes.
- Blog canonicals are `/blog` and the published `/blog/<slug>` routes.
- `/industries`, `/services/<industry>`, `/services/website-design-development`, and `/services/ai-agents-automation` are not routes or redirect sources.

## Sitemap Contract

- `web/scripts/generate-seo-artifacts.mjs` derives the production sitemap from self-canonical, indexable prerendered HTML.
- The generator rejects wrong-origin, query-bearing, fragment-bearing, trailing-slash, and `.html` sitemap URLs.
- The generic React Router SPA fallback is removed from the publish artifact after route generation.
- Every emitted sitemap URL must have a matching prerendered document and return `200` without a redirect.

## Verification Procedure

- Parse `netlify.toml` and fail unless there is exactly one redirect with the source, destination, status, and force values above.
- Run the configured Netlify build command and confirm `web/build/client` is the publish output.
- Confirm the approved canonical routes are prerendered and alias/fallback documents are absent.
- Check canonical, hostname, variant, query-string, missing-resource, static-asset, sitemap, and robots requests with deployment-equivalent tooling when available.
- Fail on a canonical redirect, redirect chain, wrong host, query loss, soft 404, alias `200`, duplicate sitemap URL, or schema/canonical mismatch.
