# Silverstone repository-to-live difference baseline v1

Date: 2026-06-22
Pinned repository SHA: `1e445c305c30cae93d5f6427135a238be8d58c14`
Live origin: `https://silverstone-ai.com`

## Method

Fifty repository canonical URLs were requested from production. Live HTML was compared with the pinned repository file before and after removing Netlify's injected Real User Monitoring script. Redirect sources, supporting SEO files, the web manifest, selected assets, and the form-function GET endpoint were also requested.

Rendered inspection used the in-app browser. No form was submitted, no Calendly booking was created, and no production state was changed.

## Canonical parity

| Result | Count |
|---|---:|
| Canonical routes inventoried | 50 |
| Live canonical routes returning `200` | 49 |
| Live canonical redirect loops | 1 |
| Repository/live HTML equal after removing Netlify RUM | 49 |
| Material repository/live content differences after RUM normalization | 0 |

**Live-HTTP evidence:** `/blog/ai-lead-capture-trades-uk-2026` exceeds the redirect limit.

**Repository evidence:** `netlify.toml` contains a forced redirect from `/blog/ai-lead-capture-trades-uk-2026` to the identical path.

**Inference:** The live failure is configuration parity, not an unpublished repository-only defect.

## Known difference matrix

| Surface | Repository | Live | Classification | Migration treatment |
|---|---|---|---|---|
| Netlify RUM on 47 healthy pages | no committed RUM tag | one Netlify-injected tag | hosting injection | refactor ownership; do not hard-code deploy tokens |
| Netlify RUM on `/services` and `/blog` | one committed stale RUM tag in each file | committed tag plus one current injected tag | repository defect amplified by hosting | rewrite to one hosting-owned integration |
| `sitemap.xml` | correct 50-URL set; all `lastmod` values stale at 2026-04-01 | correct 50-URL set with current generated dates | generated-artifact drift | generate from route source during build |
| Lead-capture canonical | HTML file and sitemap entry exist | redirect loop | redirect defect | unresolved URL/content target; rewrite rule |
| `robots.txt` | allows crawling and names sitemap | same observable behavior | parity | retain |
| `site.webmanifest` | valid manifest content | same content, served as `application/octet-stream` | header/content-type difference | refactor hosting header |
| Form function GET | serverless source returns friendly `200` plus noindex header | `200`, `X-Robots-Tag: noindex, nofollow` | parity | retain crawl behavior while rewriting POST safety |

## Rendered route findings

**Live-browser evidence**

- All 49 successfully loaded canonical routes rendered one H1.
- No loaded image had zero natural width.
- No horizontal overflow was observed at the audited desktop viewport.
- The single route that did not render failed with `ERR_TOO_MANY_REDIRECTS`.
- `services` and `blog` each rendered two RUM scripts; other healthy routes rendered one.
- A retry of `/about` completed successfully after the bulk scan's initial load timeout.

The complete route scan is in:

- `evidence/live-rendered-route-scan.json`
- `evidence/live-about-retry.json`

## Runtime integration parity

### Parallax and shader

**Repository and live-browser evidence**

- Repository source contains desktop fixed-background and mobile staged-layer implementations.
- The home page rendered three fixed desktop parallax sections.
- At 390×844, the body entered `parallax-stage-active`, retained three layers, and kept one active layer after scrolling.
- The home shader canvas rendered.

No live/repository behavior difference was identified for this contract.

### Pricing

**Repository and live-browser evidence**

- Repository HTML and generated widget bundles define two pricing roots.
- Live pricing rendered two roots, ten pricing cards, monthly/setup controls, nine niche controls, and ten booking links.

No material live/repository difference was identified.

### Calendly

**Repository and live-browser evidence**

- Repository event URL: `https://calendly.com/silverstone-ai/30min`.
- Live iframe loaded the same event with embed parameters.
- The repository and live page provide a `/contact` fallback.

Provider-side settings remain unverified.

### Contact form

**Repository and live-browser evidence**

- Live fields and honeypot match repository markup.
- JavaScript intercepts submit and targets the Netlify function.
- No POST parity test was run because it would send production email.

Delivery behavior remains unresolved.

## Supporting-resource observations

**Live-HTTP evidence**

| Resource | Status | Notable observation |
|---|---:|---|
| `/robots.txt` | 200 | allows crawl; sitemap declared |
| `/sitemap.xml` | 200 | current production dates |
| `/site.webmanifest` | 200 | `application/octet-stream` content type |
| `/.netlify/functions/send-email` GET | 200 | noindex/nofollow header |
| sampled HTML/CSS/images | 200 | `public,max-age=0,must-revalidate` |

HSTS was present. Explicit CSP, Referrer-Policy, Permissions-Policy, and X-Content-Type-Options headers were not observed in the sampled responses.

## Production-only and repository-only state

Production-only:

- Netlify runtime monitoring injection.
- Generated-current sitemap dates.
- Hosting headers and runtime function environment.

Repository-only or committed:

- stale RUM deployment token embedded in `services.html` and `blog.html`;
- stale committed sitemap dates;
- exact redirect source that reproduces the live loop;
- source CSS/JS and image sources not served as public page content.

## Benchmark boundary

`https://www.agentivelabs.co.uk/` was observed only for rendered comparison. Its code and creative expression were not copied. The benchmark evidence is limited to information hierarchy, responsive behavior, visible navigation, rendered interaction, and browser-console observations documented in the main audit.
