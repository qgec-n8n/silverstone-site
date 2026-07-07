export type BookingMode = "disabled" | "mock" | "live";

/**
 * Two valid shapes exist: the staging contract (noindex everywhere, mocks
 * only) and the production contract (silverstone-ai.com, indexable, live
 * booking). `parsePublicEnvironment` fails closed to staging rules for
 * anything else — analytics stays disabled in both until explicitly
 * authorised.
 */
export type PublicEnvironment = {
  analyticsEnabled: false;
  bookingMode: BookingMode;
  canonicalOrigin: string;
  indexNowEnabled: false;
  isStaging: boolean;
  robotsMeta: string;
  siteUrl: string;
  xRobotsTag: string;
};

export type PublicEnvironmentSource = Record<string, string | boolean | undefined>;
