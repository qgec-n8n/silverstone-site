export type BookingMode = "disabled" | "mock";

export type PublicEnvironment = {
  analyticsEnabled: false;
  bookingMode: BookingMode;
  canonicalOrigin: string;
  indexNowEnabled: false;
  isStaging: true;
  robotsMeta: "noindex,nofollow,noarchive";
  siteUrl: string;
  xRobotsTag: "noindex,nofollow,noarchive";
};

export type PublicEnvironmentSource = Record<string, string | boolean | undefined>;
