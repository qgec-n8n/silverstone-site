# Silverstone transformation repository and live-site audit v1

Date: 2026-06-22
Pinned source: `1e445c305c30cae93d5f6427135a238be8d58c14`
Audit branch: `transformation/audit`
Repository: `/Users/quentingeczy/Desktop/silverstone-site`
Production: `https://silverstone-ai.com/`
Benchmark observed: `https://www.agentivelabs.co.uk/`

## Purpose and decision boundary

This audit supplies the evidence needed to plan a React/Vite transformation. It does not make the rebuild-versus-conversion decision and makes no implementation change.

Evidence labels are used as follows:

- **Repository evidence**: directly observed in files, Git history, generated inventories, or non-destructive local commands.
- **Live-browser evidence**: observed in the rendered page through the in-app browser at desktop or mobile viewport.
- **Live-HTTP evidence**: observed through read-only HTTP requests.
- **Inference**: a conclusion derived from the preceding evidence; it is not represented as an observed fact.

Disposition vocabulary:

- **retain**: preserve the public URL, content, asset, or runtime contract.
- **refactor**: preserve the outcome while moving it into a maintainable implementation.
- **rewrite**: replace the implementation or copy because the current contract is unsafe or unsuitable.
- **discard**: remove only after its replacement or non-use is proven.
- **unresolved**: ownership, proof, target, or migration treatment needs an explicit decision.

## Executive findings

1. **Repository evidence:** The public site consists of 50 indexable HTML documents: 7 main pages, 1 legal page, 9 industry/service pages, and 33 blog articles. Filesystem discovery, `scripts/seo-inventory.js`, and `sitemap.xml` reconcile at 50 URLs.
2. **Live-HTTP evidence:** 49 canonical URLs return `200`. `/blog/ai-lead-capture-trades-uk-2026` is unavailable because a forced redirect maps that path to itself.
3. **Repository evidence:** The project is a static HTML site with generated CSS and JavaScript bundles plus a separately built React 18 pricing island. It is not currently a Vite application.
4. **Repository evidence:** Shared markup is duplicated across 50 documents. Structural similarity reaches `0.9992` for two blog templates and `0.9974` for two service templates. Body-copy shingle similarity remains low, so this is primarily template duplication rather than wholesale duplicate article text.
5. **Repository evidence:** Public assets total 1,615 files and 703,128,292 bytes. There are 1,227 generated image derivatives, 155 unresolved unreferenced files totalling 138,847,764 bytes, and 9 byte-identical duplicate groups.
6. **Repository evidence:** A clean temporary build exposed image-pipeline drift: 24 expected derivatives are absent for `blog_40` and `blog_41`, all 12 committed `blog_39` derivatives differ from a clean pinned-source build, and the JPEG/PNG `blog_1` sources share the same output basename.
7. **Repository and live-browser evidence:** Desktop and mobile parallax are active. Desktop sections use fixed backgrounds; mobile uses the staged-layer runtime. This is a migration contract, not optional decoration.
8. **Repository evidence:** Analytics loads before consent, while `privacy-policy.html:206-207` states that non-essential cookies are set only after consent. The consent implementation stores a choice but does not gate analytics.
9. **Repository evidence:** Service pages and the home page contain quantified and absolute proof claims without attributable on-page evidence. These claims require substantiation, qualification, or rewrite before reuse.
10. **Live-browser evidence:** The site renders without horizontal overflow or broken rendered images across all successfully loaded canonical routes. The self-redirecting route is the only canonical route that could not render.

## Repository and Git baseline

**Repository evidence**

| Item | Observed value |
|---|---|
| Git root | `/Users/quentingeczy/Desktop/silverstone-site` |
| Initial branch | `main` |
| Audit branch | `transformation/audit` |
| Pinned local `main` SHA | `1e445c305c30cae93d5f6427135a238be8d58c14` |
| Pinned local `origin/main` SHA | `1e445c305c30cae93d5f6427135a238be8d58c14` |
| Remote | `origin https://github.com/qgec-n8n/silverstone-site.git` |
| Default branch indication | `origin/HEAD -> origin/main` |
| Pinned commit | `2026-06-19T20:09:33+01:00`, `email image` |

`git fetch origin --prune` could not authenticate: `fatal: could not read Username for 'https://github.com': Device not configured`. The pinned SHA therefore reflects the local `main` and local remote-tracking ref, not a freshly authenticated remote fetch.

Pre-existing dirty files were preserved and are outside this audit's scope:

- `.DS_Store`
- `.codex/config.toml`
- `assets/images/.DS_Store`

Their initial and final hashes are recorded in `MANIFEST.md`.

Only `AGENTS.md` applies. No `AGENTS.override.md` exists. The audit obeyed its minimal-diff, evidence-first, SEO, and parallax guardrails.

## Capabilities available and used

**Repository evidence**

The repository exposes seven local skills:

- `brainstorming`: used to frame evidence categories and avoid prematurely selecting a transformation strategy.
- `browser-use`: used for rendered desktop/mobile inspection and screenshots.
- `find-skills`: used to search for additional repository-audit, SEO-migration, and accessibility capabilities; no package was installed.
- `web-design-guidelines`: used with the current published guideline source to review semantics, interaction, responsive behavior, and media.
- `ui-ux-pro-max`: used to query accessibility, form, responsive, animation, and performance guidance.
- `seo-audit`: used for indexability, canonical, sitemap, redirect, schema, and internal-link checks.
- `copywriting`: used to classify proof risk, unclear guarantees, repeated boilerplate, and search-intent overlap.

The in-app browser capability was also used. No deployment, Netlify mutation, DNS change, environment-variable change, form submission, email send, booking, or production integration mutation was performed.

## Architecture and build system

**Repository evidence**

- `package.json:5-13` defines image optimization, CSS concatenation, JavaScript concatenation, sitemap generation, an SEO audit, and IndexNow submission. `npm test` is a placeholder that exits with failure.
- The root `package-lock.json` is npm lockfile v3 with 33 package records. `pricing-widget/package-lock.json` is npm lockfile v3 with 202 package records. No Yarn or pnpm lockfile exists.
- `netlify.toml:1-3` publishes the repository root after `npm run build && npm run generate:sitemaps`.
- `src/css/` contains 23 source CSS files. `assets/css/styles.css` is generated.
- `src/js/` contains 15 source JavaScript files. `assets/js/app.js` is generated.
- `pricing-widget/package.json` defines a React 18/Rollup project. Its generated runtime and stylesheet are copied to `assets/js/pricing-widget.js` and `assets/css/pricing-widget.css`.
- Authored fonts are two Google Sans Flex WOFF2 files under `assets/fonts/`; eight Font Awesome TTF/WOFF2 files are copied vendor artifacts under `assets/webfonts/`.
- The pricing widget mounts into `.ss-pricing` nodes using data attributes. Ten pages include the widget; the live pricing page rendered 2 roots and 10 pricing cards.
- There is no Vite configuration and no application-level route runtime.
- The generated CSS bundle matched a clean temporary build byte-for-byte. The JavaScript bundle differed only by whitespace. The image and sitemap outputs did not match the committed outputs.

Existing repository validation is script-based rather than test-suite based:

- `scripts/seo-audit.js`
- `scripts/seo-inventory.js`
- `scripts/generate-sitemaps.js`
- `scripts/optimize-images.js`
- historical execution plans under `codex/execplans/`

The execution plans document prior work on mobile parallax, desktop hero behavior, service image loading, crawlability, sitemap/brand SERP behavior, internal linking, pricing restoration, image refreshes, and related visual contracts. They are relevant migration history.

## Route inventory and reconciliation

The authoritative row-level inventory is `route-inventory-v1.csv`.

**Repository evidence**

| Route group | Count |
|---|---:|
| Main | 7 |
| Legal | 1 |
| Services/industries | 9 |
| Blog | 33 |
| Total | 50 |

Reconciliation:

| Source | Count | Result |
|---|---:|---|
| Filesystem HTML discovery | 50 | baseline |
| SEO inventory | 50 | matches |
| Committed sitemap URL set | 50 | matches |
| Expected canonical set | 50 | matches |
| Live canonical `200` | 49 | one redirect loop |

All 50 pages have:

- a unique canonical URL;
- a unique title;
- a unique meta description;
- exactly one repository H1;
- `index, follow`;
- a cookie banner.

Forty-nine pages contain JSON-LD; `privacy-policy.html` does not. Forty-nine pages use parallax; the privacy page does not. Seventeen use the shader. Google Analytics is present on 48 pages and absent from:

- `blog/ai-lead-capture-trades-uk-2026.html`
- `blog/ai-quote-follow-up-trades.html`

All repository-internal links resolve to known canonical routes. The least-linked blog pages receive two internal links each; their exact inlink counts appear in the CSV.

### Duplicate-pattern analysis

**Repository evidence**

Nearest structural matches include:

| Pair | Structural similarity |
|---|---:|
| `blog/dental-intake-e-consent-automation-uk.html` / `blog/estate-agent-viewing-confirmations-uk.html` | 0.9992 |
| `services/dentists.html` / `services/physios-chiropractors.html` | 0.9974 |
| `services/hospitality.html` / `services/salons-barbers.html` | 0.9971 |

After common header/footer material is removed, the highest five-word text-shingle similarity is about `0.0295`, between the two lead-capture articles.

**Inference:** React components could remove substantial template duplication without treating the article bodies as duplicate content. URL and content migration should remain independent from component extraction.

Potential search-intent overlap is unresolved for:

- `blog/ai-lead-capture-trades-uk-2026.html`
- `blog/ai-lead-capture-uk-trades-2026.html`
- `blog/ai-quote-follow-up-trades.html`
- `blog/quote-follow-up-automation-uk-trades-2026.html`
- `blog/quote-chase-automation-uk-trades-accepted-jobs-2026.html`

The audit does not decide whether to consolidate, differentiate, or retain those URLs.

## Assets, fonts, images, shaders, and animation

The authoritative row-level inventory is `asset-integration-inventory-v1.csv`.

**Repository evidence**

| Lifecycle | Files |
|---|---:|
| Authored public assets | 177 |
| Unreferenced, ownership unresolved | 155 |
| Generated bundles | 4 |
| Authored fonts | 2 |
| Image-generation sources | 42 |
| Generated image derivatives | 1,227 |
| Copied vendor files | 8 |
| Total | 1,615 |

Total public asset volume is 703,128,292 bytes. The 155 unreferenced files account for 138,847,764 bytes. “Unreferenced” means no reference was found in the scanned public HTML, source CSS/JS, build/config files, or manifest; it does not prove safe deletion.

Nine byte-identical duplicate groups were found. The largest are:

- `assets/images/email/Silverstone_28.jpeg` and `assets/images/zip/Silverstone_28.jpg`, 1,170,695 bytes each.
- `assets/images/blog/blog_1.jpeg` and `assets/images/blog_1.jpeg`, 611,389 bytes each.
- duplicated social assets with a ` 2` filename suffix.
- `assets/logo/silverstone-logo-cropped-whitebg-v2.png` and its `@2x` file are byte-identical rather than a true density pair.

The page set contains 206 `<img>` elements. All 206 lack explicit `width` and `height`; 32 have empty alt text, largely for decorative article imagery; 61 are lazy-loaded.

### Image pipeline drift

**Repository evidence**

A clean build in a temporary Git archive generated 1,251 derivative files, compared with 1,227 committed derivative files:

- 1,215 files matched.
- 12 files differed.
- 24 files existed only in the temporary build.
- No committed derivative was absent from the temporary build.

The 24 missing committed files are the 12 expected variants for each of `blog_40` and `blog_41`. All 12 committed `blog_39` derivatives differ from a clean build of the pinned source. Separately, both `assets/images/blog/blog_1.jpeg` and `assets/images/blog/blog_1.png` generate the same output basename, so one source overwrites the other's derivatives during a clean build.

**Inference:** The transformation plan needs an explicit canonical source identifier or collision-safe output naming. Copying the current derivative directory without fixing this rule would preserve nondeterminism.

### Parallax and shader contract

**Repository and live-browser evidence**

- Desktop parallax is implemented with fixed backgrounds in `src/css/features/parallax.css`.
- Mobile parallax uses a staged layer system in `src/js/parallax.js` and the `parallax-stage-active` body state.
- Reduced-motion checks exist in parallax, shader, reveal, and stat runtimes.
- On the live home page, three desktop parallax sections computed to fixed background attachment.
- At a 390×844 mobile viewport, the home page retained one staged parallax root and three layers before and after scrolling.
- The live home shader canvas rendered at desktop.

Disposition: **retain** the observable parallax and shader behavior; **refactor** their ownership only after equivalent desktop/mobile/reduced-motion verification exists.

## Integrations and external contracts

### Contact form and Resend

**Repository evidence**

Files:

- `contact.html`
- `src/js/contact-form.js`
- `netlify/functions/send-email.js`

Contract:

- visible fields: `name`, `email`, `message`;
- hidden client honeypot: `company`;
- browser sends JSON to `/.netlify/functions/send-email`;
- server requires `RESEND_API_KEY`;
- optional `CONTACT_TO`, default `info@silverstone-ai.com`;
- optional `CONTACT_FROM`, default `noreply@mail.silverstone-ai.com`;
- sender is `Silverstone AI <CONTACT_FROM>`;
- reply-to is intended to be the visitor email.

Observed risks:

- The honeypot is checked only in the browser and omitted from the server payload.
- Server validation checks presence only; it does not validate email syntax, lengths, content type, origin, or rate limits.
- The submit button is not disabled while sending.
- The status element has no `aria-live` or status role.
- Visible inputs do not declare autocomplete tokens.
- The function sends `reply_to`, undocumented/redundant `replyTo`, and a `Reply-To` header.
- The function returns the parsed Resend response to the browser and includes exception detail in `500` responses.
- No authenticated Resend dashboard or domain settings were inspected.

The official Resend send-email API documents `reply_to`, not `replyTo`: <https://resend.com/docs/api-reference/emails/send-email>. Resend's domain guidance requires an owned, verified domain and recommends a sending subdomain: <https://resend.com/docs/dashboard/domains/introduction>.

No contact form POST was submitted. Delivery, destination ownership, sender-domain verification, and inbox behavior remain unresolved.

Disposition: **rewrite** the server boundary and validation while retaining the business outcome and field intent.

### Calendly

**Repository and live-browser evidence**

`book.html:226-228` embeds `https://calendly.com/silverstone-ai/30min` with landing and event details hidden and `#00FF9D` as primary colour. The live page loaded one iframe titled “Select a Date & Time - Calendly.” A `/contact` fallback exists.

The audited contract supports only these claims:

- account slug: `silverstone-ai`;
- event slug: `30min`;
- inline widget;
- contact fallback.

Availability, buffers, confirmation behavior, calendar ownership, notification settings, and event timezone were not accessible without authenticated Calendly settings.

Disposition: **refactor** the embed wrapper while retaining the URL and fallback until the owner verifies account-side settings.

### Analytics and consent

**Repository evidence**

Measurement ID `G-7GT6DQKTT5` is loaded inline in document heads. `src/js/cookie-consent.js` records `accepted` or `declined` in local storage and a cookie but does not load, disable, or update analytics consent.

`privacy-policy.html:206-207` says non-essential cookies are set only after consent. That statement is inconsistent with the current load order.

Disposition: **rewrite** the consent/analytics contract and the related policy wording as one coordinated change.

### Other contracts

| Integration | Evidence | Current contract | Disposition |
|---|---|---|---|
| Google Maps | Repository + live browser | Lazy iframe for 4 Deacon Street, London SE17 1GE; iframe has no title | refactor |
| IndexNow | Repository | Netlify success plugin submits changed canonical URLs using root key file | refactor |
| Netlify hosting/functions | Repository | root publish, build plus sitemap generation, serverless email function | rewrite for the target architecture |
| Pricing React widget | Repository + live browser | React 18 auto-mounts into data-attributed roots | refactor |
| Web manifest | Repository + live HTTP | standalone manifest and icons; live content type is `application/octet-stream` | refactor |

## SEO, indexability, redirects, schema, and internal links

The authoritative canonical and redirect baseline is `seo-redirect-baseline-v1.csv`.

**Repository evidence**

- 50 unique canonical URLs are indexable and present in the committed sitemap.
- The sitemap URL membership and order are correct.
- All 50 committed `lastmod` values are stale at `2026-04-01T19:33:26Z`; the generator expects Git-derived dates on 2026-04-09 or 2026-04-16.
- `npm run seo:audit` fails only on this stale generated sitemap condition.
- `robots.txt` allows crawling and names the sitemap.
- There are 85 redirect definitions and 83 unique source paths.
- Two source paths are defined twice:
  - `/blog/ai-lead-capture-trades-uk-2026.html`
  - `/blog/ai-returns-triage-ecommerce-uk.html`
- One redirect is a forced self-redirect:
  - `/blog/ai-lead-capture-trades-uk-2026` → itself.

**Live-HTTP evidence**

- All 83 unique redirect sources returned the configured status and location.
- The self-redirect therefore becomes an actual browser loop.
- Live `robots.txt` and `sitemap.xml` return `200`.
- The production sitemap has current generated `lastmod` values, unlike the committed file.
- The GET form-function endpoint returns `200` with `X-Robots-Tag: noindex, nofollow`.

Schema:

- 49 pages contain parseable JSON-LD.
- `privacy-policy.html` has none.
- Schema types include WebSite, Organization, ProfessionalService, WebPage, BreadcrumbList, and page-specific entities.
- Visible breadcrumb navigation appears on 16 pages, while BreadcrumbList schema appears on 49.

Internal linking:

- No broken internal route target was found in repository HTML.
- Main and service routes receive links from all 50 pages through shared navigation/footer structures.
- Several newer blog articles receive only two internal links. Exact counts are in `route-inventory-v1.csv`.

Migration constraints:

- Preserve all retained canonical paths exactly.
- Resolve the self-redirect before asserting live parity.
- Generate the sitemap from the transformed route source of truth.
- Retain redirect history independently from the application router.
- Reconcile visible and structured breadcrumbs.

## Content and proof risk

**Repository evidence**

The service and home pages contain exact numerical or absolute claims without attributable on-page sources. Examples include:

- `index.html:392-400`: 780 hours, 100% answered, and 10× lead conversion.
- `services/estate-agents.html:393-398`: 68% and 42%.
- `services/hospitality.html:393`: £89.
- `services/trades.html:398-399`: £300+ job value.
- `services/ecommerce.html:394`: 70%.
- `services/salons-barbers.html:409-410`: up to 70% no-show reduction.
- `services/dentists.html:399-400`: 300+ lost chair hours.
- `services.html:611`: “No invented guarantees,” despite the surrounding quantified claims.

`blog/ai-booking-automation-uk-hospitality-2026.html` presents an unnamed London restaurant example and approximate outcomes without an attributable case-study source. Other articles include citations of mixed quality and should be revalidated individually before migration.

The footer year is `2025` across all 50 pages. Repeated mission, navigation, and footer copy confirms componentization potential but also multiplies stale-copy risk.

Disposition:

- Service-page proof sections and home-page statistics: **rewrite** unless substantiation is supplied.
- Article bodies: generally **refactor**, preserving meaning and sources; high-risk proof stories: **rewrite**.
- Search-intent overlap groups: **unresolved**.
- Shared mission/navigation/footer copy: **refactor** into a single governed source.

## UI, accessibility, responsive behavior, and performance

**Repository evidence**

- None of the 50 pages uses a `<main>` landmark.
- None provides a skip link.
- No page declares `theme-color`.
- The mobile navigation trigger is a focusable `<div>` with an aria-label but no button role; `src/js/header-nav.js` attaches a click handler and no keyboard handler to that element.
- The contact map iframe has no title.
- Contact status changes are not announced as live status.
- FAQ summaries remove outline without an equivalent focus style.
- All 206 HTML images lack intrinsic dimensions.

**Live-browser evidence**

- Successful desktop route renders showed one H1, no broken loaded images, and no horizontal overflow.
- The mobile home page showed no horizontal overflow and retained active parallax through scroll.
- The cookie banner occupies substantial mobile viewport area on first visit.
- Desktop pages rendered the intended navigation, shader, and parallax behavior.

**Live-HTTP evidence**

- HTML, CSS, and image responses sampled from production use `Cache-Control: public,max-age=0,must-revalidate`.
- HSTS is present.
- No explicit Content-Security-Policy, Referrer-Policy, Permissions-Policy, or X-Content-Type-Options header was observed in the sampled responses.

**Inference:** The transformation can improve semantics, asset dimensions, focus behavior, and caching without changing the visual design. Those fixes should be acceptance criteria, not incidental redesign.

## Live repository parity

See `repo-live-diff-v1.md` for the detailed matrix.

Summary:

- Forty-nine canonical pages match repository HTML after removing Netlify's runtime monitoring injection.
- `services.html` and `blog.html` already contain a committed Netlify RUM tag. Production injects another current RUM tag, so those routes render two monitoring scripts.
- The live sitemap is generated and current; the committed sitemap is stale.
- The self-redirect is defined in the repository and reproduced live.
- No other material live HTML drift was detected.

## Observable benchmark comparison

**Live-browser evidence**

The benchmark was inspected only as rendered output. No code, assets, or protected creative expression were copied.

| Observable | Silverstone | Agentive Labs benchmark |
|---|---|---|
| Positioning | Broad UK small-business automation across multiple industries | Narrower private-clinic/patient-booking focus |
| Navigation | Large route inventory with industry dropdowns, pricing, blog, booking, contact | Simpler Home/Services/About/Contact structure |
| Above-fold treatment | Shader, multiple CTAs, broad promise | Large focused statement and one prominent call-request action |
| Interaction | Parallax, shader, pricing widget, directory/blog surfaces | Interactive chat-style demonstration |
| Mobile | No observed horizontal overflow; large consent footprint | No observed horizontal overflow; compact logo/hamburger header |
| Rendered schema | Structured data present on Silverstone home | No JSON-LD detected in the benchmark's rendered DOM |
| Browser console | No home-page error/warning observed | One React Router future-flag warning observed |

**Inference:** The benchmark demonstrates the communication benefit of tighter niche focus and simpler above-fold hierarchy. It does not establish that Silverstone should discard its broader route equity or copy the benchmark's implementation.

## Disposition summary

| Area | Retain | Refactor | Rewrite | Discard | Unresolved |
|---|---|---|---|---|---|
| Public routes | 49 healthy canonical paths | route ownership in component/router source | broken redirect rule | none | self-redirected canonical |
| Content | differentiated article substance, contact/booking intent | shared copy and most articles | unsupported proof, consent wording | none | overlapping search intents |
| Visual runtime | parallax, shader, responsive appearance | component ownership and lifecycle | image pipeline naming | generated outputs only after replacement proof | unreferenced asset ownership |
| Integrations | business outcomes and public endpoints where valid | Calendly, map, pricing island, IndexNow | form boundary, analytics consent, target hosting config | redundant generated/vendor output after proof | authenticated provider settings |
| SEO | canonicals, metadata, route equity, robots intent | schema/breadcrumb governance, sitemap generation | self-redirect | duplicate redirect declarations after equivalent baseline exists | consolidation choices |

“Discard” does not authorize deletion in this audit. It identifies generated or duplicated material that may be excluded only after the transformed system reproduces required behavior.

## Rebuild-versus-conversion evidence table

This table intentionally stops short of a decision.

| Evidence | Supports conversion/preservation | Supports rebuild/recomposition | Risk if misapplied |
|---|---|---|---|
| 50 unique indexed documents | Preserve URLs, metadata, article copy, and route equity | Central route/content source can govern all documents | Bulk rewriting can lose metadata or canonical parity |
| Near-identical templates | Extract components incrementally | Eliminate duplicated HTML across 50 files | Visual behavior can drift if extraction changes DOM/CSS contracts |
| Existing modular source CSS/JS | Source files can be migrated in bounded stages | Generated monolithic bundles can be replaced | Recreating animation from appearance alone may break parallax |
| React pricing island | Existing React behavior can be incorporated | Consolidate the island into one application runtime | Pricing copy/data may diverge during merge |
| Asset inventory and image sources | Reuse proven brand/media assets | Replace nondeterministic derivative pipeline | Deleting unreferenced files before ownership review can lose source material |
| Live parity is high | Repository is a reliable starting baseline | Small known drift set is tractable | Assuming perfect parity misses RUM, sitemap, and redirect defects |
| SEO inventory and redirects exist | Preserve explicit baselines | Generate SEO from a route source of truth | Router-only redirects may not preserve edge behavior |
| Semantics and consent defects | Correct locally during migration | Establish clean application-wide policies | Combining fixes with redesign makes regressions harder to isolate |
| Unsupported proof claims | Preserve route/content intent | Rewrite proof sections under editorial governance | Blind copy migration preserves commercial/legal risk |

## Assumptions, blockers, and required owner decisions

1. Remote freshness is unverified because GitHub authentication was unavailable. The pinned SHA is exact for local `main` and local `origin/main`.
2. Resend delivery, sender verification, destination ownership, and environment values were not inspected. No email was sent.
3. Calendly account-side settings were inaccessible. No booking was created.
4. Analytics dashboard data, consent records, Search Console, Netlify UI settings, DNS, and production environment variables were not accessed.
5. The benchmark comparison is limited to observable rendered behavior.
6. Unreferenced assets are not presumed safe to delete.
7. Claims are classified as unsupported on-page; this does not prove they are false. Evidence may exist outside the repository.
8. Search-intent overlap requires an SEO/content-owner decision.

## Reproduction and verification commands

The exact command log and generated evidence are indexed in `MANIFEST.md`. Core read-only checks included:

```sh
git rev-parse --show-toplevel
git status --short --branch
git remote -v
git symbolic-ref refs/remotes/origin/HEAD
git rev-parse main origin/main
find . -name AGENTS.md -o -name AGENTS.override.md
node scripts/seo-inventory.js
npm run seo:audit
node /tmp/silverstone-repository-scan.mjs
node /tmp/silverstone-live-crawl.mjs
```

Build comparison was performed in a temporary Git archive with the repository's dependency directory linked read-only for resolution. The temporary directory was removed after hashes and counts were recorded. Production was accessed read-only.
