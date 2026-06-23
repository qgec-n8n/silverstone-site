# Silverstone staging environment contract v1

## 1. Purpose

This contract defines the safe staging baseline for the new `/web` workspace and the Replit preview surface that will later host it.

The baseline exists to prevent three classes of accidental exposure:

- production analytics contamination;
- production email delivery;
- indexable staging URLs or pages.

This document is staging-only. It does not authorise any production deployment, Netlify mutation, DNS change, or change to the legacy root application.

## 2. Boundary

- Primary implementation area: `/web/`
- Replit run config: `/.replit`
- Legacy root application: untouched
- `replit.nix`: only add if a later review proves the Replit workspace needs extra system packages

The temporary Replit URL is treated as a public, internet-reachable surface. It must not be assumed private, obscured, or search-engine invisible.

## 3. Required environment contract

The staging baseline uses explicit environment values instead of secrets:

- `VITE_STAGING_MODE=true`
- `VITE_ANALYTICS_DISABLED=true`
- `VITE_ROBOTS_META=noindex,nofollow,noarchive`
- `VITE_X_ROBOTS_TAG=noindex,nofollow,noarchive`
- `RESEND_MODE=mock`

Recommended placeholders for later wiring:

- `VITE_SITE_URL=https://staging.example.invalid`
- `VITE_CANONICAL_ORIGIN=https://staging.example.invalid`

Blank placeholders must remain blank in committed example files:

- `RESEND_API_KEY`
- `RESEND_FROM`
- `RESEND_TO`
- `CONTACT_EMAIL`
- `GA_MEASUREMENT_ID`
- `GTM_ID`
- `SENTRY_DSN`
- `POSTHOG_KEY`
- `PLAUSIBLE_DOMAIN`
- `MIXPANEL_TOKEN`
- `HOTJAR_ID`
- `CLARITY_ID`

## 4. Indexation strategy

Staging must be blocked at three layers.

### 4.1 HTTP header layer

Every staging response must emit:

- `X-Robots-Tag: noindex, nofollow, noarchive`

### 4.2 HTML layer

Every rendered HTML document must include:

- `<meta name="robots" content="noindex, nofollow, noarchive">`

If the document exposes a canonical URL, that canonical must not point at a Replit preview host. It may point at the production canonical only when parity testing requires it and the page remains blocked from indexing.

### 4.3 robots.txt layer

The staging `robots.txt` must disallow all crawling:

- `User-agent: *`
- `Disallow: /`

No staging sitemap should be exposed to crawlers unless a later owner-approved release plan explicitly requires it.

## 5. Security and integration rules

- Do not enable live analytics in staging.
- Do not send email through Resend in staging.
- Do not create live bookings from staging.
- Do not commit secrets, production recipients, or production API keys.
- Do not rely on Replit Preview obscurity as a security control.

If any staging build attempts to use a production-looking analytics ID, email recipient, canonical host, or public preview URL, it fails the safety check.

## 6. Verification baseline

The staging safety script at `/web/scripts/assert-staging-safety.mjs` is the machine-checkable guardrail for this contract.

It must fail when:

- staging mode is off;
- analytics is not disabled;
- Resend is not mocked;
- a production secret or recipient appears in the environment;
- a Replit preview/public URL appears where a canonical or public origin is expected;
- an HTML output omits the robots noindex contract;
- `robots.txt` does not block all crawling;
- analytics scripts or identifiers appear in scanned staged output.

## 7. Ownership

- `/web/` baseline files: Codex foundation
- `/.replit`: Codex foundation
- `/docs/silverstone-transformation/architecture/`: documentation owner

This contract is intentionally narrow. It establishes the safe starting point for later app work without creating the full application yet.

