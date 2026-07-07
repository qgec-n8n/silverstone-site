import { describe, expect, it } from "vitest";

import { parsePublicEnvironment } from "~/lib/environment";

describe("parsePublicEnvironment", () => {
  it("accepts the staging-safe environment contract", () => {
    const environment = parsePublicEnvironment({
      VITE_STAGING_MODE: "true",
      VITE_ANALYTICS_DISABLED: "true",
      VITE_ROBOTS_META: "noindex,nofollow,noarchive",
      VITE_X_ROBOTS_TAG: "noindex,nofollow,noarchive",
      VITE_SITE_URL: "https://staging.example.invalid",
      VITE_CANONICAL_ORIGIN: "https://staging.example.invalid",
      VITE_BOOKING_MODE: "disabled",
      VITE_INDEXNOW_DISABLED: "true",
    });

    expect(environment.isStaging).toBe(true);
    expect(environment.analyticsEnabled).toBe(false);
    expect(environment.bookingMode).toBe("disabled");
  });

  it("fails closed when analytics is not explicitly disabled", () => {
    expect(() =>
      parsePublicEnvironment({
        VITE_STAGING_MODE: "true",
        VITE_ANALYTICS_DISABLED: "false",
        VITE_ROBOTS_META: "noindex,nofollow,noarchive",
        VITE_X_ROBOTS_TAG: "noindex,nofollow,noarchive",
        VITE_SITE_URL: "https://staging.example.invalid",
        VITE_CANONICAL_ORIGIN: "https://staging.example.invalid",
        VITE_BOOKING_MODE: "disabled",
        VITE_INDEXNOW_DISABLED: "true",
      }),
    ).toThrow("Analytics must remain disabled in staging");
  });

  it("accepts the production contract for silverstone-ai.com", () => {
    const environment = parsePublicEnvironment({
      VITE_STAGING_MODE: "false",
      VITE_ANALYTICS_DISABLED: "false",
      VITE_ROBOTS_META: "index,follow",
      VITE_X_ROBOTS_TAG: "all",
      VITE_SITE_URL: "https://silverstone-ai.com",
      VITE_CANONICAL_ORIGIN: "https://silverstone-ai.com",
      VITE_BOOKING_MODE: "live",
      VITE_INDEXNOW_DISABLED: "true",
    });

    expect(environment.isStaging).toBe(false);
    expect(environment.robotsMeta).toBe("index,follow");
    expect(environment.canonicalOrigin).toBe("https://silverstone-ai.com");
    expect(environment.bookingMode).toBe("live");
    expect(environment.analyticsEnabled).toBe(true);
  });

  it("rejects a production request for any other origin", () => {
    expect(() =>
      parsePublicEnvironment({
        VITE_STAGING_MODE: "false",
        VITE_ANALYTICS_DISABLED: "true",
        VITE_ROBOTS_META: "index,follow",
        VITE_X_ROBOTS_TAG: "all",
        VITE_SITE_URL: "https://evil.example.com",
        VITE_CANONICAL_ORIGIN: "https://evil.example.com",
        VITE_BOOKING_MODE: "live",
        VITE_INDEXNOW_DISABLED: "true",
      }),
    ).toThrow("VITE_SITE_URL");
  });

  it("rejects a production environment whose analytics flag is not the exact launch value", () => {
    // Launch (2026-07-07) authorised consent-gated GA4, so production now
    // requires VITE_ANALYTICS_DISABLED to be exactly "false" — anything else
    // (unset, "true", garbage) fails the contract instead of silently
    // shipping a half-configured build.
    expect(() =>
      parsePublicEnvironment({
        VITE_STAGING_MODE: "false",
        VITE_ANALYTICS_DISABLED: "true",
        VITE_ROBOTS_META: "index,follow",
        VITE_X_ROBOTS_TAG: "all",
        VITE_SITE_URL: "https://silverstone-ai.com",
        VITE_CANONICAL_ORIGIN: "https://silverstone-ai.com",
        VITE_BOOKING_MODE: "live",
        VITE_INDEXNOW_DISABLED: "true",
      }),
    ).toThrow('VITE_ANALYTICS_DISABLED must be "false"');
  });
});
