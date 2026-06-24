/**
 * Integration carousel data. Marks are LOCAL monochrome SVGs in
 * `web/public/integrations/` (currentColor) — no remote logo dependencies.
 * Rendered as two counter-scrolling marquee rows.
 */

export type IntegrationMark = {
  id: string;
  name: string;
  /** Public path to the local SVG mark. */
  file: string;
};

const mark = (id: string, name: string): IntegrationMark => ({
  id,
  name,
  file: `/integrations/${id}.svg`,
});

export const INTEGRATIONS_ROW_A: readonly IntegrationMark[] = [
  mark("whatsapp", "WhatsApp"),
  mark("gmail", "Gmail"),
  mark("google-calendar", "Google Calendar"),
  mark("slack", "Slack"),
  mark("hubspot", "HubSpot"),
  mark("stripe", "Stripe"),
  mark("calendly", "Calendly"),
] as const;

export const INTEGRATIONS_ROW_B: readonly IntegrationMark[] = [
  mark("microsoft-teams", "Microsoft Teams"),
  mark("outlook", "Outlook"),
  mark("zapier", "Zapier"),
  mark("make", "Make"),
  mark("notion", "Notion"),
  mark("twilio", "Twilio"),
  mark("shopify", "Shopify"),
] as const;

export const ALL_INTEGRATIONS: readonly IntegrationMark[] = [
  ...INTEGRATIONS_ROW_A,
  ...INTEGRATIONS_ROW_B,
];
