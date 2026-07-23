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
 */
export function SeoJuiceScripts() {
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
