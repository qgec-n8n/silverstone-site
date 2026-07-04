/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANALYTICS_DISABLED: string;
  readonly VITE_BOOKING_MODE: string;
  readonly VITE_CANONICAL_ORIGIN: string;
  readonly VITE_GOOGLE_MAPS_EMBED_KEY: string;
  readonly VITE_INDEXNOW_DISABLED: string;
  readonly VITE_ROBOTS_META: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_STAGING_MODE: string;
  readonly VITE_X_ROBOTS_TAG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
