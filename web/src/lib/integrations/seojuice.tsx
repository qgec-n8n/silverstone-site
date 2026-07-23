import { getPublicEnvironment } from "~/lib/environment";

/**
 * SEOJuice on-page optimiser, per the official React/Vite integration
 * (https://docs.seojuice.com/getting-started/integrations/vibe-coding/): one
 * deferred CDN script plus the no-JavaScript pixel, both at the end of
 * <body>. There is no site key — the account is matched by domain in the
 * SEOJuice dashboard — so this component carries no configuration.
 *
 * Placement: this project has no `index.html`. The document shell is
 * `app/root.tsx`, and `{children}` + `<Scripts />` are the React Router
 * equivalents of the `<div id="root">` + `/src/main.tsx` pair the docs point
 * at, so the tags render immediately after `<Scripts />`. Every canonical
 * route is prerendered (`ssr: false` + `prerender` in react-router.config.ts),
 * so the tags ship inside the static HTML of each document and the browser
 * runs the script during parse — the declarative `<script src>` that fails
 * for client-side injection (see CookieConsentManager) is not a concern here.
 * SEOJuice reapplies itself across SPA navigations by watching
 * `history.pushState` itself, so no per-route wiring is needed.
 *
 * The `<noscript>` pixel is written with `dangerouslySetInnerHTML` because a
 * JavaScript-enabled browser parses `<noscript>` content as inert text rather
 * than elements; rendering the `<img>` as a JSX child would tear on
 * hydration.
 *
 * Environment: production only, matching the staging contract in
 * AGENTS.override.md ("safely disabled in staging, and free of production
 * side effects during local or staging work"). Staging and deploy previews
 * are `noindex`, so an SEO optimiser has nothing to act on there and its
 * pixel must not report traffic that is not real. The `import.meta.env`
 * guard is a static string in every build, so on staging the whole tail —
 * including both seojuice.io literals — is dead code the minifier drops. The
 * runtime contract check is the second belt: a malformed environment fails
 * closed to "no SEOJuice".
 *
 * DISABLED BY DEFAULT (2026-07-23). `suggestions.v1.js` is not a passive
 * reporter: it rewrites SEO-critical head and body elements at runtime.
 * Measured on live production at this commit, with the script loaded from
 * the deployed build:
 *
 *   route                       prerendered <title>              rewritten to
 *   /                           Silverstone AI | Websites, ...   "AI Voice Systems for UK Teams |
 *                                                                 Automation | Silverstone.ai"
 *   /services/ai-receptionists  AI Receptionist Services UK|...  "Live Transcription Front Desk
 *                                                                 Automation Demo Now"
 *   /about                      About Silverstone AI | ...       "Discipline Framework: Strategy
 *                                                                 Definition & AI/Automation"
 *
 * It also replaced og:image with an asset on `seojuiced.b-cdn.net`. The
 * rewritten titles are keyword-stuffed, drift from the page's actual subject,
 * and use inconsistent brand casing ("Silverstone.ai"), so the report then
 * bills the resulting title/content mismatch back as an issue to fix — the
 * optimiser manufactures work for itself while overwriting deliberate,
 * reviewed metadata that the build already gates for uniqueness.
 *
 * (The second <h1> visible in the hydrated DOM on gated non-home routes is
 * NOT from this script: it is the route intro splash title in
 * visual/components/route-experience-intro.tsx, which renders client-side
 * only. That is tracked separately; disabling SEOJuice does not fix it.)
 *
 * Separately, `smart.seojuice.io/views` fires on every page view carrying
 * URL, referrer and full user agent with no consent gate, while this site's
 * own analytics is held behind Consent Mode v2 defaults (see
 * AnalyticsScripts). That is outside the consent contract the rest of the
 * site keeps.
 *
 * Re-enabling is one environment variable — set VITE_SEOJUICE_ENABLED="true"
 * — but do it only with the on-page rewriting turned off in the SEOJuice
 * dashboard, and re-check titles and h1 counts in the hydrated DOM
 * afterwards. `tests/unit/seojuice.test.tsx` locks the default-off contract.
 */
export function SeoJuiceScripts() {
  if (import.meta.env.VITE_SEOJUICE_ENABLED !== "true") {
    return null;
  }

  if (import.meta.env.VITE_STAGING_MODE !== "false") {
    return null;
  }

  let isStaging = true;
  try {
    isStaging = getPublicEnvironment().isStaging;
  } catch {
    return null;
  }
  if (isStaging) {
    return null;
  }

  return (
    <>
      <script
        defer
        src="https://cdn.seojuice.io/suggestions.v1.js"
        type="text/javascript"
      />
      <noscript
        dangerouslySetInnerHTML={{
          __html:
            '<img src="https://smart.seojuice.io/pixel" width="1" height="1" alt="" style="display:none">',
        }}
      />
    </>
  );
}
