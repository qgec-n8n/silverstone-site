import { describe, expect, it } from "vitest";

import { createStagingIntegrations } from "~/lib/integrations/staging";

describe("staging integration adapters", () => {
  it("disable analytics and external indexing", async () => {
    const integrations = createStagingIntegrations();

    await expect(integrations.analytics.track("foundation_view")).resolves.toEqual({
      status: "disabled",
    });
    await expect(integrations.indexNow.submit(["/"])).resolves.toEqual({
      status: "disabled",
    });
  });

  it("uses a deterministic contact mock and disabled booking adapter", async () => {
    const integrations = createStagingIntegrations();

    await expect(
      integrations.contact.submit({
        email: "test@example.invalid",
        message: "Foundation test",
        name: "Foundation",
      }),
    ).resolves.toMatchObject({
      status: "mocked",
      reference: "staging-contact-mock",
    });
    expect(integrations.booking.getAvailability()).toEqual({
      status: "disabled",
    });
  });
});
