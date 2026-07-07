import { getPublicEnvironment } from "~/lib/environment";

/**
 * GA4 bootstrap (carried over from the legacy site at the 2026-07-07 launch,
 * same G-7GT6DQKTT5 property), rendered into <head> so the prerendered
 * production HTML ships it directly.
 *
 * Consent: Google Consent Mode v2 defaults every storage signal to "denied"
 * before gtag.js loads; the Silktide banner (see CookieConsentManager, whose
 * consent types already map to `analytics_storage` / `ad_storage` /
 * `ad_user_data` / `ad_personalization`) issues the `consent update` when the
 * visitor accepts, and replays saved preferences on later visits.
 *
 * The `import.meta.env` guard below is a static string in every build, so on
 * staging (VITE_ANALYTICS_DISABLED="true") the whole tail of this component —
 * including the measurement id literal — is dead code the minifier removes.
 * That keeps staging bundles clean for `assert-staging-safety.mjs`, which
 * scans them for analytics fingerprints. The runtime contract check is the
 * second belt: a malformed environment fails closed to "no analytics".
 */
export function AnalyticsScripts() {
  if (import.meta.env.VITE_ANALYTICS_DISABLED === "true") {
    return null;
  }

  let analyticsEnabled = false;
  try {
    analyticsEnabled = getPublicEnvironment().analyticsEnabled;
  } catch {
    return null;
  }
  if (!analyticsEnabled) {
    return null;
  }

  const measurementId = "G-7GT6DQKTT5";
  const bootstrap = [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    "window.gtag=gtag;",
    'gtag("consent","default",{analytics_storage:"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"});',
    'gtag("js",new Date());',
    `gtag("config","${measurementId}",{anonymize_ip:true});`,
  ].join("");

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
    </>
  );
}
