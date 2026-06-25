---
name: Staging-safety analytics blocklist vs. brand logos
description: Why decorative integration brand logos that are analytics products trip the /web staging-safety guard, and how to add carousel brands safely.
---

`web/scripts/assert-staging-safety.mjs` (run via `npm run staging:safety`) scans every
prerendered HTML file in `build/client` + `public` for analytics tokens and fails the
build if any match. The blocklist is by **bare brand token / domain**, e.g. `\bposthog\b`,
`\bmixpanel\b`, `\bsentry\b`, `plausible.io`, `segment.com`, `hotjar`, `clarity.ms`,
`fullstory`, plus `gtag(`, `gtm-`, `G-[A-Z0-9]+`, `googletagmanager.com`,
`google-analytics.com`.

**Trap:** the integration marquee renders each brand as `/integrations/<id>.svg` AND
surfaces the brand name in a visually-hidden accessible-name list. So adding an analytics
product as a *decorative brand logo* (PostHog, Mixpanel, Sentry, Plausible, Hotjar,
Clarity, FullStory, Segment) injects its token into the HTML twice and fails
staging-safety — even though it is brand art, not tracking code. The guard cannot tell
the difference.

**Safe vs. unsafe brand names:** a brand only trips the guard if its id/name matches a
pattern. "Google Analytics" (`googleanalytics.svg` / "Google Analytics") is SAFE because
the patterns require `google-analytics.com` / `G-[A-Z0-9]+` / `gtag(`, none of which the
brand label produces. "Segment" the word is SAFE (pattern is `segment.com`). But any name
containing a bare blocklisted token (posthog, mixpanel, sentry, hotjar, fullstory) is NOT.

**How to apply:** before adding any brand to `src/data/home-v2/integrations.ts`, check its
id and display name against the blocklist patterns. If it collides, pick a different
data-stack brand (e.g. Databricks `#FF3621`) generated through the same `simple-icons`
pipeline, and keep each row balanced. Always run `npm run build && npm run staging:safety`
after touching the carousel — `npm run build` alone will not catch it.

**Why this matters:** staging-safety is a hard boundary in `replit.md` (no analytics in
staging); a single brand-logo token failing it blocks the whole validation suite.
