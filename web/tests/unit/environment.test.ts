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
});
