import type {
  BookingMode,
  PublicEnvironment,
  PublicEnvironmentSource,
} from "~/contracts/environment";

const stagingRobots = "noindex,nofollow,noarchive" as const;
const forbiddenPreviewHosts = ["replit.dev", "replit.app", "repl.co"];

function readString(source: PublicEnvironmentSource, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function requireValue(
  source: PublicEnvironmentSource,
  key: string,
  expected: string,
): void {
  const actual = readString(source, key);
  if (actual !== expected) {
    throw new Error(`${key} must be "${expected}"`);
  }
}

function requireSafeUrl(value: string, key: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${key} must be an absolute URL`);
  }

  if (forbiddenPreviewHosts.some((host) => url.hostname.endsWith(host))) {
    throw new Error(`${key} must not use a public preview host`);
  }

  return url.origin;
}

const PRODUCTION_ORIGIN = "https://silverstone-ai.com";
const productionRobots = "index,follow";

/**
 * The production contract: only valid for the real silverstone-ai.com
 * origin, indexable, live booking. Analytics stays disabled until
 * explicitly authorised — flipping VITE_ANALYTICS_DISABLED is not enough on
 * purpose.
 */
function parseProductionEnvironment(
  source: PublicEnvironmentSource,
): PublicEnvironment {
  requireValue(source, "VITE_ROBOTS_META", productionRobots);
  requireValue(source, "VITE_SITE_URL", PRODUCTION_ORIGIN);
  requireValue(source, "VITE_CANONICAL_ORIGIN", PRODUCTION_ORIGIN);
  requireValue(source, "VITE_BOOKING_MODE", "live");

  if (readString(source, "VITE_ANALYTICS_DISABLED") !== "true") {
    throw new Error("Analytics must remain disabled until explicitly authorised");
  }

  return {
    analyticsEnabled: false,
    bookingMode: "live",
    canonicalOrigin: PRODUCTION_ORIGIN,
    indexNowEnabled: false,
    isStaging: false,
    robotsMeta: productionRobots,
    siteUrl: PRODUCTION_ORIGIN,
    xRobotsTag: readString(source, "VITE_X_ROBOTS_TAG") || "all",
  };
}

export function parsePublicEnvironment(
  source: PublicEnvironmentSource,
): PublicEnvironment {
  // Production must be requested explicitly; every other value of
  // VITE_STAGING_MODE falls through to the strict staging contract, which
  // fails closed (noindex, mocks) on anything unexpected.
  if (readString(source, "VITE_STAGING_MODE") === "false") {
    return parseProductionEnvironment(source);
  }

  requireValue(source, "VITE_STAGING_MODE", "true");
  requireValue(source, "VITE_ROBOTS_META", stagingRobots);
  requireValue(source, "VITE_X_ROBOTS_TAG", stagingRobots);
  requireValue(source, "VITE_INDEXNOW_DISABLED", "true");

  if (readString(source, "VITE_ANALYTICS_DISABLED") !== "true") {
    throw new Error("Analytics must remain disabled in staging");
  }

  const bookingModeValue = readString(source, "VITE_BOOKING_MODE");
  if (bookingModeValue !== "disabled" && bookingModeValue !== "mock") {
    throw new Error("VITE_BOOKING_MODE must be disabled or mock in staging");
  }
  const bookingMode: BookingMode = bookingModeValue;

  const siteUrl = requireSafeUrl(readString(source, "VITE_SITE_URL"), "VITE_SITE_URL");
  const canonicalOrigin = requireSafeUrl(
    readString(source, "VITE_CANONICAL_ORIGIN"),
    "VITE_CANONICAL_ORIGIN",
  );

  return {
    analyticsEnabled: false,
    bookingMode,
    canonicalOrigin,
    indexNowEnabled: false,
    isStaging: true,
    robotsMeta: stagingRobots,
    siteUrl,
    xRobotsTag: stagingRobots,
  };
}

export function getPublicEnvironment(): PublicEnvironment {
  return parsePublicEnvironment(import.meta.env);
}
