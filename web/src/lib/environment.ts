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
    throw new Error(`${key} must be "${expected}" in staging`);
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

export function parsePublicEnvironment(
  source: PublicEnvironmentSource,
): PublicEnvironment {
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
