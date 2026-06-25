/**
 * Integration carousel data. Marks are LOCAL coloured brand SVGs in
 * `web/public/integrations/`, generated from the `simple-icons` package with
 * each brand's authentic hex (near-black brands use a light variant so they
 * stay legible on the dark surface). No remote logo dependencies.
 *
 * Rendered icon-only as three counter-scrolling marquee rows. `accent` drives
 * the per-cell coloured glow. The brand names are never shown as visible text;
 * they are surfaced once through a visually-hidden list for assistive tech.
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

/** Row A — social and everyday acquisition surfaces, plus CRM/commerce. */
export const INTEGRATIONS_ROW_A: readonly IntegrationMark[] = [
  mark("x", "X", "#FFFFFF"),
  mark("instagram", "Instagram", "#E4405F"),
  mark("facebook", "Facebook", "#0866FF"),
  mark("tiktok", "TikTok", "#FFFFFF"),
  mark("linkedin", "LinkedIn", "#0A66C2"),
  mark("youtube", "YouTube", "#FF0000"),
  mark("pinterest", "Pinterest", "#BD081C"),
  mark("snapchat", "Snapchat", "#FFFC00"),
  mark("threads", "Threads", "#FFFFFF"),
  mark("whatsapp", "WhatsApp", "#25D366"),
  mark("hubspot", "HubSpot", "#FF7A59"),
  mark("stripe", "Stripe", "#635BFF"),
  mark("shopify", "Shopify", "#7AB55C"),
  mark("woocommerce", "WooCommerce", "#96588A"),
  mark("telegram", "Telegram", "#26A5E4"),
  mark("discord", "Discord", "#5865F2"),
] as const;

/** Row B — Microsoft productivity, AI/model providers, automation and data. */
export const INTEGRATIONS_ROW_B: readonly IntegrationMark[] = [
  mark("microsoft-word", "Microsoft Word", "#2B579A"),
  mark("microsoft-excel", "Microsoft Excel", "#217346"),
  mark("microsoft-powerpoint", "Microsoft PowerPoint", "#D24726"),
  mark("microsoft-outlook", "Microsoft Outlook", "#0078D4"),
  mark("microsoft-teams", "Microsoft Teams", "#6264A7"),
  mark("onedrive", "OneDrive", "#0078D4"),
  mark("sharepoint", "SharePoint", "#038387"),
  mark("microsoft-365", "Microsoft 365", "#00A4EF"),
  mark("azure", "Azure", "#0078D4"),
  mark("copilot", "Microsoft Copilot", "#B146C2"),
  mark("anthropic", "Anthropic", "#9DB0E6"),
  mark("gemini", "Google Gemini", "#8E75B2"),
  mark("perplexity", "Perplexity", "#1FB8CD"),
  mark("zapier", "Zapier", "#FF4F00"),
  mark("make", "Make", "#6D00CC"),
  mark("n8n", "n8n", "#EA4B71"),
  mark("supabase", "Supabase", "#3FCF8E"),
  mark("mistralai", "Mistral AI", "#FA520F"),
  mark("postgresql", "PostgreSQL", "#4169E1"),
  mark("cloudflare", "Cloudflare", "#F38020"),
  mark("mongodb", "MongoDB", "#47A248"),
  mark("snowflake", "Snowflake", "#29B5E8"),
  mark("bigquery", "Google BigQuery", "#669DF6"),
  mark("databricks", "Databricks", "#FF3621"),
] as const;

/** Row C — Google Workspace/Cloud plus build, support, design and field tools. */
export const INTEGRATIONS_ROW_C: readonly IntegrationMark[] = [
  mark("google-drive", "Google Drive", "#4285F4"),
  mark("google-sheets", "Google Sheets", "#34A853"),
  mark("google-docs", "Google Docs", "#4285F4"),
  mark("google-slides", "Google Slides", "#F9AB00"),
  mark("gmail", "Gmail", "#EA4335"),
  mark("google-calendar", "Google Calendar", "#4285F4"),
  mark("google-meet", "Google Meet", "#00897B"),
  mark("google-forms", "Google Forms", "#7248B9"),
  mark("googleanalytics", "Google Analytics", "#E37400"),
  mark("googlecloud", "Google Cloud", "#4285F4"),
  mark("webflow", "Webflow", "#146EF5"),
  mark("paypal", "PayPal", "#2D9CDB"),
  mark("trello", "Trello", "#2684FF"),
  mark("wordpress", "WordPress", "#21759B"),
  mark("intercom", "Intercom", "#6AFDEF"),
  mark("airtable", "Airtable", "#18BFFF"),
  mark("calendly", "Calendly", "#006BFF"),
  mark("zoho", "Zoho", "#E42527"),
  mark("asana", "Asana", "#F06A6A"),
  mark("xero", "Xero", "#13B5EA"),
  mark("framer", "Framer", "#0055FF"),
  mark("figma", "Figma", "#F24E1E"),
  mark("linear", "Linear", "#5E6AD2"),
  mark("langchain", "LangChain", "#7FC8FF"),
  mark("huggingface", "Hugging Face", "#FFD21E"),
  mark("vercel", "Vercel", "#EAF0FF"),
  mark("zendesk", "Zendesk", "#9DB0E6"),
  mark("dropbox", "Dropbox", "#0061FF"),
  mark("elevenlabs", "ElevenLabs", "#9DB0E6"),
  mark("sketch", "Sketch", "#F7B500"),
  mark("strava", "Strava", "#FC4C02"),
  mark("airbnb", "Airbnb", "#FF5A5F"),
] as const;

export const ALL_INTEGRATIONS: readonly IntegrationMark[] = [
  ...INTEGRATIONS_ROW_A,
  ...INTEGRATIONS_ROW_B,
  ...INTEGRATIONS_ROW_C,
];
