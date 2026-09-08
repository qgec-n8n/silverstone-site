/**
 * industries-v2 content contracts.
 *
 * Each industry route carries concise, conversion-focused copy rewritten from
 * the approved industries copy pack (US English, written for US and UK
 * readers), plus its route-entry
 * strings (CoreSpin loader, Aether pill/title/subtitle, explore button).
 *
 * Metric values are verified Silverstone AI performance figures: exact values,
 * units, ranges, currencies and time bases are preserved verbatim and must
 * never be edited here without a new approved register.
 */
import type { MobileHeroCopy } from "~/features/services-v2/content/mobile-hero";
import type { ShowcaseSiteId } from "~/features/services-v2/demos/showcase-state";

export type IndustryRoute =
  | "/industry/estate-agents"
  | "/industry/salons-barbers"
  | "/industry/aesthetic-clinics"
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

/**
 * A named, live Silverstone build in the page's own sector, embedded on the
 * page itself through the showcase demo (`BrowserShowcase only=…`) rather than
 * linked away to the web-design portfolio. Optional because most sectors have
 * no publishable client site; where one exists it outranks any illustrative
 * panel as evidence, so it sits directly under the hero.
 */
export type IndustryCaseStudy = {
  eyebrow: string;
  heading: string;
  /** Intro line above the embedded demo. */
  lead: string;
  points: string[];
  /** `showcase-sites.json` id of the build this section embeds. */
  showcaseSiteId: ShowcaseSiteId;
  note: string;
};

/**
 * A time-boxed, fixed-price productised offer promoted at the top of a sector
 * page and expanded into its own section further down.
 *
 * Deliberately optional and per-sector: this is a live commercial offer, not a
 * page pattern, so only the sector currently being sold carries one. Every
 * figure, payment term and guarantee sentence lives here rather than in the
 * components, so the offer can be repriced, retimed or withdrawn from one file.
 *
 * Honesty contract — the banner's countdown measures a *recurring weekly
 * capacity window*, not an expiring price. `capacity` states the scarcity
 * claim ("one clinic this week") and `windowNote` states in plain words what
 * the clock is counting to, so nothing on the page implies the price or the
 * offer disappears when it reaches zero. The seven days in `dayTrack` are the
 * delivery window, and `guarantee` is the exact sentence that backs it.
 */
export type SprintOffer = {
  /** Anchor id — also the banner's in-page CTA target. */
  id: string;
  eyebrow: string;
  /** Scarcity claim shown beside the countdown, e.g. "One clinic · this week". */
  capacity: string;
  name: string;
  /** Headline price, exactly as quoted, e.g. "£1,500". */
  price: string;
  /** One-line payment summary for the banner. */
  priceNote: string;
  /** Plain-words explanation of what the countdown counts to. */
  windowNote: string;
  /** Short banner pitch, rich text. */
  bannerBody: string;
  bannerCtaLabel: string;
  /** Label for the banner's link down to the full offer section. */
  bannerDetailLabel: string;
  section: {
    eyebrow: string;
    heading: string;
    lead: string;
  };
  /** What the sprint delivers, in the order it is delivered. */
  deliverables: IndustryCard[];
  /** Payment ladder — each rung is a stage and the amount due at it. */
  payments: { amount: string; when: string; note: string }[];
  /** The seven-business-day delivery track, one label per stage. */
  dayTrack: { day: string; label: string }[];
  /** The exact guarantee sentence used on calls. Rendered verbatim. */
  guarantee: string;
  guaranteeNote: string;
  ctaLabel: string;
  /** Reassurance line under the section CTA. */
  reassurance: string;
};

/**
 * One market's operating reality for the sector. The workflow problem a page
 * solves is identical in the US and the UK; the nouns, the tooling and the
 * decisions kept human differ. A lane states those specifics for one market
 * so a reader in Dallas and a reader in Manchester each see their own
 * operation named, without the page splitting into two versions.
 */
export type IndustryMarketLane = {
  market: "US" | "UK";
  label: string;
  /** Who runs this operation here, e.g. "Brokerages, teams and independent agents". */
  operators: string;
  /** Platforms the system reads from and writes to in this market. */
  tooling: string[];
  /** This market's words for the same workflow steps. */
  vocabulary: string;
  /** The decisions the page keeps with people, in this market's terms. */
  keepsHuman: string;
  /**
   * The named laws and platform rules the system is configured around in this
   * market, e.g. "Fair Housing Act, MLS and IDX rules, TCPA quiet hours".
   *
   * Optional, and only meaningful when BOTH lanes carry one: the ledger's
   * subgrid aligns row *n* of one market against row *n* of the other, so a
   * rulebook on one lane and nothing on the other would leave a hole in the
   * comparison. `MarketLanes` therefore renders the row only when both lanes
   * define it. Sectors whose rulebook is not established stay undefined
   * rather than carrying a vague line.
   */
  rulebook?: string;
};

export type IndustryMarkets = {
  eyebrow: string;
  heading: string;
  /** One sentence: same leak, same mechanism, different nouns and tools. */
  lead: string;
  lanes: [IndustryMarketLane, IndustryMarketLane];
  /** The mechanism, stated so it is true in both markets. Three items. */
  shared: string[];
};

/**
 * A sector's regulatory operating boundary, stated on the page rather than
 * buried in a FAQ: the laws and platform rules the built systems are
 * configured around, in each market's own terms. Optional and per-sector —
 * only sectors with a named rulebook (estate agents: the US Fair Housing Act
 * and MLS rules) carry one. Wording contract: the copy describes how the
 * systems are designed and configured; it never promises legal compliance.
 */
export type IndustryCompliance = {
  eyebrow: string;
  heading: string;
  lead: string;
  /**
   * One card per rulebook, e.g. "Fair Housing Act", "MLS and IDX rules".
   * `source` is an unobtrusive citation caption — plain text only, because
   * `RichText` renders no links and any markdown link syntax would leak
   * verbatim into the FAQ/schema copy that shares this vocabulary.
   */
  points: {
    market: "US" | "UK" | "Both";
    title: string;
    /**
     * A 6–10 word summary of the card, printed above the body at emphasis
     * weight. Four ~80-word legal paragraphs are three phone screens of
     * unbroken prose; the lede is what makes the panel scannable.
     */
    lede?: string;
    body: string;
    source?: string;
  }[];
  /**
   * Three short structural claims printed as chips above the cards, so a
   * reader has the boundary in three seconds before any of the detail. Keep
   * them to a phone line each, and keep them literally true of the cards
   * below — this row is a summary, never a separate promise.
   */
  glance?: string[];
  /** Plain-words honesty line rendered beneath the cards. */
  note: string;
};

export type IndustryCopy = {
  route: IndustryRoute;
  /** Sector name, e.g. "Estate agents" — used in eyebrows and hub cards. */
  sector: string;
  routeEntry: IndustryRouteEntry;
  seo: IndustrySeo;
  eyebrow: string;
  h1: string;
  /** Optional short line under the H1; see SecondaryHero's `deck` prop. */
  deck?: string;
  heroSub: string;
  heroPoints: string[];
  /** Phone-only hero copy; see `MobileHeroCopy`. */
  mobile?: MobileHeroCopy;
  /** Short trust tokens rendered under the secondary hero. */
  trustTokens: string[];
  /** The two-market operating manifest rendered under the trust tokens. */
  markets: IndustryMarkets;
  /** Named regulatory boundary for the sector; see `IndustryCompliance`. */
  compliance?: IndustryCompliance;
  caseStudy?: IndustryCaseStudy;
  /** Live productised offer promoted above the fold. See `SprintOffer`. */
  sprint?: SprintOffer;
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
