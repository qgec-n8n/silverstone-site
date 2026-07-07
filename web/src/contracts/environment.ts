export type BookingMode = "disabled" | "mock" | "live";

/**
 * Two valid shapes exist: the staging contract (noindex everywhere, mocks
 * only, analytics off) and the production contract (silverstone-ai.com,
 * indexable, live booking, consent-gated GA4 — authorised for launch
 * 2026-07-07). `parsePublicEnvironment` fails closed to staging rules for
 * anything else.
 */
export type PublicEnvironment = {
  analyticsEnabled: boolean;
  bookingMode: BookingMode;
  canonicalOrigin: string;
  indexNowEnabled: false;
  isStaging: boolean;
  robotsMeta: string;
  siteUrl: string;
  xRobotsTag: string;
};

export type PublicEnvironmentSource = Record<string, string | boolean | undefined>;
