/**
 * Integration carousel data. Marks are LOCAL coloured brand SVGs in
 * `web/public/integrations/`, generated from the `simple-icons` package with
 * each brand's authentic hex (near-black brands use a light variant so they
 * stay legible on the dark surface). No remote logo dependencies.
 *
 * Rendered icon-only as two counter-scrolling marquee rows. `accent` drives the
 * per-cell coloured glow.
 */

export type IntegrationMark = {
  id: string;
  /** Brand name — used for the accessible label, never shown as visible text. */
  name: string;
  /** Public path to the local coloured SVG mark. */
  file: string;
  /** Authentic brand colour used for the cell's coloured glow. */
  accent: string;
};

const mark = (id: string, name: string, accent: string): IntegrationMark => ({
  id,
  name,
  file: `/integrations/${id}.svg`,
  accent,
});

/** Row A — the everyday surface: messaging, scheduling, CRM, commerce. */
export const INTEGRATIONS_ROW_A: readonly IntegrationMark[] = [
  mark("whatsapp", "WhatsApp", "#25D366"),
  mark("gmail", "Gmail", "#EA4335"),
  mark("google-calendar", "Google Calendar", "#4285F4"),
  mark("calendly", "Calendly", "#006BFF"),
  mark("hubspot", "HubSpot", "#FF7A59"),
  mark("stripe", "Stripe", "#635BFF"),
  mark("shopify", "Shopify", "#7AB55C"),
  mark("woocommerce", "WooCommerce", "#96588A"),
  mark("wordpress", "WordPress", "#21759B"),
  mark("notion", "Notion", "#9DB0E6"),
  mark("airtable", "Airtable", "#18BFFF"),
  mark("framer", "Framer", "#0055FF"),
] as const;

/** Row B — the wider engine: AI, automation, build tools and data platforms. */
export const INTEGRATIONS_ROW_B: readonly IntegrationMark[] = [
  mark("anthropic", "Anthropic", "#9DB0E6"),
  mark("gemini", "Google Gemini", "#8E75B2"),
  mark("elevenlabs", "ElevenLabs", "#9DB0E6"),
  mark("n8n", "n8n", "#EA4B71"),
  mark("zapier", "Zapier", "#FF4F00"),
  mark("make", "Make", "#6D00CC"),
  mark("figma", "Figma", "#F24E1E"),
  mark("webflow", "Webflow", "#146EF5"),
  mark("supabase", "Supabase", "#3FCF8E"),
  mark("postgresql", "PostgreSQL", "#4169E1"),
  mark("mongodb", "MongoDB", "#47A248"),
  mark("snowflake", "Snowflake", "#29B5E8"),
  mark("bigquery", "Google BigQuery", "#669DF6"),
] as const;

export const ALL_INTEGRATIONS: readonly IntegrationMark[] = [
  ...INTEGRATIONS_ROW_A,
  ...INTEGRATIONS_ROW_B,
];
