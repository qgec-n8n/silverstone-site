import type {
  AnalyticsAdapter,
  BookingAdapter,
  ContactAdapter,
  IndexNowAdapter,
  IntegrationRegistry,
} from "~/contracts/integrations";

const disabledResult = Object.freeze({ status: "disabled" } as const);

class DisabledAnalyticsAdapter implements AnalyticsAdapter {
  track(): Promise<typeof disabledResult> {
    return Promise.resolve(disabledResult);
  }
}

class MockContactAdapter implements ContactAdapter {
  submit(): Promise<{
    reference: "staging-contact-mock";
    status: "mocked";
  }> {
    return Promise.resolve({
      reference: "staging-contact-mock",
      status: "mocked",
    });
  }
}

class DisabledBookingAdapter implements BookingAdapter {
  getAvailability(): typeof disabledResult {
    return disabledResult;
  }
}

class DisabledIndexNowAdapter implements IndexNowAdapter {
  submit(): Promise<typeof disabledResult> {
    return Promise.resolve(disabledResult);
  }
}

export function createStagingIntegrations(): IntegrationRegistry {
  return {
    analytics: new DisabledAnalyticsAdapter(),
    booking: new DisabledBookingAdapter(),
    contact: new MockContactAdapter(),
    indexNow: new DisabledIndexNowAdapter(),
  };
}
