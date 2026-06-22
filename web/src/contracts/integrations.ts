export type DisabledResult = {
  status: "disabled";
};

export type AnalyticsAdapter = {
  track(
    eventName: string,
    properties?: Readonly<Record<string, unknown>>,
  ): Promise<DisabledResult>;
};

export type ContactRequest = {
  email: string;
  message: string;
  name: string;
};

export type ContactResult = {
  reference: "staging-contact-mock";
  status: "mocked";
};

export type ContactAdapter = {
  submit(request: ContactRequest): Promise<ContactResult>;
};

export type BookingAdapter = {
  getAvailability(): DisabledResult;
};

export type IndexNowAdapter = {
  submit(paths: readonly string[]): Promise<DisabledResult>;
};

export type IntegrationRegistry = {
  analytics: AnalyticsAdapter;
  booking: BookingAdapter;
  contact: ContactAdapter;
  indexNow: IndexNowAdapter;
};
