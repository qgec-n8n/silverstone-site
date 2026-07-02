/**
 * industries-v2 content contracts.
 *
 * Each industry route carries concise, conversion-focused copy rewritten from
 * the approved industries copy pack (British English), plus its route-entry
 * strings (CoreSpin loader, Aether pill/title/subtitle, explore button).
 *
 * Metric values are verified Silverstone AI performance figures: exact values,
 * units, ranges, currencies and time bases are preserved verbatim and must
 * never be edited here without a new approved register.
 */

export type IndustryRoute =
  | "/industry/estate-agents"
  | "/industry/salons-barbers"
  | "/industry/ecommerce"
  | "/industry/dentists"
  | "/industry/fitness-coaches"
  | "/industry/hospitality"
  | "/industry/trades"
  | "/industry/physios-chiropractors"
  | "/industry/gyms-fitness-studios";

export type IndustryMetric = {
  /** Repository benchmark id (provenance record, not rendered publicly). */
  id: string;
  /** Exact approved value — never reformatted, converted or merged. */
  value: string;
  label: string;
  /** Exact time basis where the register supplies one. */
  basis?: string;
};

export type IndustryCard = { title: string; body: string };
export type IndustryStage = { title: string; body: string };
export type IndustryFaq = { q: string; a: string };
export type IndustryRelatedLink = { href: string; label: string; title: string };

export type IndustryRouteEntry = {
  loaderText: string;
  pill: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
};

export type IndustrySeo = {
  title: string;
  description: string;
  h1: string;
};

export type IndustryCopy = {
  route: IndustryRoute;
  /** Sector name, e.g. "Estate agents" — used in eyebrows and hub cards. */
  sector: string;
  routeEntry: IndustryRouteEntry;
  seo: IndustrySeo;
  eyebrow: string;
  h1: string;
  heroSub: string;
  heroPoints: string[];
  /** Short trust tokens rendered under the secondary hero. */
  trustTokens: string[];
  problem: { heading: string; body: string; cards: IndustryCard[] };
  journey: { heading: string; lead: string; stages: IndustryStage[] };
  workflows: { heading: string; lead: string; items: IndustryCard[] };
  /** Paragraphs with inline markdown links into the service architecture. */
  services: { heading: string; lead: string; paragraphs: string[] };
  proof: {
    heading: string;
    lead: string;
    metrics: IndustryMetric[];
    attribution: string;
    clarification: string;
  };
  boundary: { heading: string; body: string; keeps: string[] };
  process: { heading: string; lead: string; steps: IndustryStage[] };
  fit: { heading: string; lead: string; right: string[]; caution: string };
  faqs: { heading: string; items: IndustryFaq[] };
  midCta: { heading: string; body: string; buttonLabel: string };
  finalCta: {
    heading: string;
    body: string;
    reassurance: string;
    buttonLabel: string;
  };
  related: IndustryRelatedLink[];
};

export const INDUSTRY_ATTRIBUTION = "Verified Silverstone AI performance";
export const INDUSTRY_CLARIFICATION =
  "Results achieved through Silverstone AI systems. Outcomes vary by starting process, data quality, channel mix and implementation scope.";
