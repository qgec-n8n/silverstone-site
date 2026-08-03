/**
 * /pricing — every published figure, band and qualifier in one typed place.
 *
 * The page is the site's only route that publishes prices, so the numbers are
 * kept out of JSX entirely: one module to audit when commercial terms change,
 * and one module for tests to assert against. The FAQ is the exception — it
 * lives in `~/data/pricing-faq` because the SEO graph needs it too.
 *
 * Format rules applied throughout (see the page-level disclosure):
 *   · full figures, not "£2k", wherever a card has the room
 *   · en dashes for ranges (£10,000–£25,000), never hyphens
 *   · "From" only where the figure is genuinely a starting price
 *   · "typical" only where the range is genuinely typical, never a cap
 */
import type { CSSProperties } from "react";

/**
 * Inline style object that also carries the `--pri-*` custom properties the
 * pricing stylesheet reads for stagger indices and meter geometry.
 */
export type PricingCssVars = CSSProperties & Record<`--${string}`, string | number>;

export type PricingTier = {
  id: string;
  badge?: string;
  title: string;
  description: string;
  price: string;
  priceNote: string;
  includedLabel: string;
  included: string[];
  idealLabel: string;
  idealFor: string[];
  featured?: boolean;
};

/** Services the published implementation bands apply to. */
export const IMPLEMENTATION_SCOPE_CHIPS = [
  "AI automation",
  "AI voice agents",
  "AI receptionists",
  "Governed content systems",
] as const;

export const IMPLEMENTATION_TIERS: readonly PricingTier[] = [
  {
    id: "simple-automation",
    title: "Simple Automation",
    description: "One focused workflow, automated end to end.",
    price: "£2,000–£10,000",
    priceNote: "One-time implementation",
    includedLabel: "What’s included",
    included: [
      "Process consultation",
      "One core workflow",
      "Basic system integration",
      "User training",
      "Testing and go-live support",
    ],
    idealLabel: "Ideal for",
    idealFor: [
      "Small businesses",
      "Single-department needs",
      "Proof-of-concept projects",
    ],
  },
  {
    id: "multi-system",
    badge: "Most popular",
    featured: true,
    title: "Multi-System Solution",
    description: "Coordinated automation across workflows and touchpoints.",
    price: "£10,000–£50,000",
    priceNote: "Implementation + support",
    includedLabel: "What’s included",
    included: [
      "Full process audit",
      "Multiple workflow automations",
      "AI agent development",
      "Training programme",
      "Multi-system integration",
      "Performance monitoring",
    ],
    idealLabel: "Ideal for",
    idealFor: [
      "Growing businesses",
      "Cross-department integration",
      "Complex workflow requirements",
    ],
  },
  {
    id: "enterprise",
    title: "Enterprise Solution",
    description: "Governed, higher-risk AI for larger organisations.",
    price: "£50,000+",
    priceNote: "Custom-scoped implementation",
    includedLabel: "What’s included",
    included: [
      "Strategic AI roadmap",
      "Bespoke AI development",
      "Dedicated project management",
      "Ongoing optimisation",
      "Enterprise-grade security",
      "Custom SLA agreements",
    ],
    idealLabel: "Ideal for",
    idealFor: [
      "Large enterprises",
      "Complex regulatory requirements",
      "Multi-location operations",
    ],
  },
];

/**
 * The one place the overlapping bands are reconciled — as an ascending ladder
 * rather than a paragraph, so a reader can place themselves on it at a glance.
 * The £10,000–£25,000 stop is the marked "most SMEs land here" sweet spot.
 */
export const BAND_LADDER: readonly {
  point: string;
  label: string;
  emphasis: boolean;
}[] = [
  { point: "£2,000", label: "Narrow standalone automation", emphasis: false },
  { point: "£3,000", label: "Most structured pilots", emphasis: false },
  { point: "£10,000–£25,000", label: "Most SME implementations", emphasis: true },
  { point: "£50,000+", label: "Multi-system & enterprise", emphasis: false },
];

export const PAGE_PRICING_DISCLOSURE =
  "All prices exclude VAT unless stated. Final quotations depend on confirmed scope. Third-party software, API, telephony, hosting and usage costs are identified separately before work begins.";

/* ---- Implementation breakdown ------------------------------------------ */

export const COST_DRIVERS = [
  {
    title: "Project complexity",
    body: "Number of systems, workflow branches, custom logic and integration requirements.",
  },
  {
    title: "Development and assurance",
    body: "Time required for discovery, architecture, implementation, testing, documentation and deployment.",
  },
  {
    title: "Business value",
    body: "Expected time savings, revenue impact, risk reduction and strategic importance.",
  },
  {
    title: "Timeline requirements",
    body: "Delivery urgency, launch constraints, dependency availability and stakeholder review cycles.",
  },
] as const;

/** Shares sum to 100 — asserted in tests so the instrument can never drift. */
export const IMPLEMENTATION_PHASES = [
  { title: "Discovery & planning", share: 15 },
  { title: "Development & integration", share: 60 },
  { title: "Testing & deployment", share: 15 },
  { title: "Training & handover", share: 10 },
] as const;

/** Shares sum to 100 — asserted in tests. */
export const PAYMENT_MILESTONES = [
  { title: "Project kickoff", share: 50 },
  { title: "Development milestones", share: 30 },
  { title: "Project completion", share: 20 },
] as const;

export const BREAKDOWN_INSTRUMENTS = [
  {
    value: "£150",
    label: "Per hour",
    note: "Senior AI engineer · hourly work only",
  },
  {
    value: "12 weeks",
    label: "Average project duration",
    note: "From discovery to deployment",
  },
  {
    value: "Measured",
    label: "ROI plan",
    note: "Agreed before build starts",
  },
] as const;

export const HOURLY_RATE_NOTE =
  "Most projects are scoped and quoted as a defined project fee. The £150 per hour Senior AI engineer rate applies only where specialist work is explicitly priced hourly.";

/* ---- Support retainers -------------------------------------------------- */

export type SupportTier = {
  id: string;
  badge?: string;
  title: string;
  price: string;
  priceNote: string;
  included: string[];
  responses: { level: string; time: string }[];
  featured?: boolean;
};

export const SUPPORT_TIERS: readonly SupportTier[] = [
  {
    id: "essential",
    title: "Essential Support",
    price: "From £350",
    priceNote: "per month",
    included: [
      "Business-hours support, 9:00–17:00 GMT",
      "Monthly performance reviews",
      "Basic system monitoring",
      "Email and ticket support",
      "Quarterly optimisation recommendations",
      "Software updates and maintenance",
    ],
    responses: [
      { level: "Critical", time: "4 hours" },
      { level: "High", time: "8 hours" },
      { level: "Medium", time: "24 hours" },
    ],
  },
  {
    id: "premium",
    badge: "Recommended",
    featured: true,
    title: "Premium Support",
    price: "From £1,250",
    priceNote: "per month",
    included: [
      "24/7 priority support",
      "Weekly optimisation reviews",
      "Advanced monitoring and alerting",
      "Dedicated account manager",
      "Monthly strategy sessions",
      "Proactive enhancement recommendations",
      "Priority feature development",
    ],
    responses: [
      { level: "Critical", time: "1 hour" },
      { level: "High", time: "2 hours" },
      { level: "Medium", time: "4 hours" },
    ],
  },
  {
    id: "enterprise-support",
    title: "Enterprise Support",
    price: "£10,000+",
    priceNote: "per month",
    included: [
      "24/7 dedicated support team",
      "Real-time monitoring and auto-healing",
      "Weekly strategic consulting",
      "Custom SLA agreements",
      "Unlimited enhancement requests where agreed in scope",
      "Executive reporting and insights",
      "Priority access to new features",
    ],
    responses: [
      { level: "Critical", time: "15 minutes" },
      { level: "High", time: "30 minutes" },
      { level: "Medium", time: "1 hour" },
    ],
  },
];

export const SUPPORT_PRINCIPLES = [
  {
    title: "Continuous optimisation",
    body: "Regular performance tuning and enhancement designed to maximise ROI.",
  },
  {
    title: "Predictable costs",
    body: "A defined monthly investment with third-party usage and exclusions made visible.",
  },
  {
    title: "Strategic partnership",
    body: "An ongoing relationship that evolves with operating needs and measured results.",
  },
] as const;

/**
 * Deliberately service commitments, not performance statistics. The reference
 * design carried uptime, retention and satisfaction figures for which this
 * repository holds no evidence (see `~/data/generated/benchmark-metrics.json`),
 * so the instrument keeps the shape and states what is contractually agreed
 * instead of implying historic results.
 */
export const SUPPORT_COMMITMENTS = [
  { value: "Agreed", label: "Response times set in your SLA" },
  { value: "Monitored", label: "Alerting across every live workflow" },
  { value: "Reviewed", label: "Scheduled optimisation cadence" },
  { value: "Reported", label: "Written performance summaries" },
] as const;

/* ---- Value model -------------------------------------------------------- */

/**
 * Illustrative, and internally consistent: £15,000 + £4,200 = £19,200;
 * 75% of a £50,000 baseline = £37,500; £37,500 − £19,200 = £18,300; and
 * £19,200 ÷ (£37,500 ÷ 12) = 6.1 months, so break-even falls inside month 7.
 */
export const ROI_MODEL: readonly {
  title: string;
  figure: string;
  unit: string;
  body: string;
  emphasis: boolean;
}[] = [
  {
    emphasis: false,
    title: "Manual cost today",
    figure: "£50,000",
    unit: "per year",
    body: "5 people · ~20 hrs/week on manual work.",
  },
  {
    emphasis: false,
    title: "First-year investment",
    figure: "£19,200",
    unit: "one-off + support",
    body: "£15,000 build plus £4,200 Essential Support.",
  },
  {
    emphasis: false,
    title: "Time value recovered",
    figure: "£37,500",
    unit: "per year",
    body: "75% of the manual workload removed.",
  },
  {
    emphasis: true,
    title: "Net ROI — year one",
    figure: "£18,300",
    unit: "net · year one",
    body: "£37,500 value − £19,200 cost = £18,300 net. Break-even ~ month seven.",
  },
];

export const ROI_MODEL_NOTE =
  "Illustrative model on a sample baseline. Every quote is built on your actual figures — not a guarantee.";

export const VALUE_BEYOND_SAVINGS = [
  {
    title: "Competitive advantage",
    body: "Faster response times, better customer service and clearer market differentiation.",
  },
  {
    title: "Scalability",
    body: "Handle increased volume without proportional increases in administrative workload.",
  },
  {
    title: "Employee satisfaction",
    body: "Remove repetitive work, protect attention and focus teams on higher-value activity.",
  },
  {
    title: "Risk reduction",
    body: "Reduce avoidable errors and strengthen process consistency, oversight and data handling.",
  },
] as const;

export const VALUE_PROOF_CARDS = [
  { value: "6–18", label: "Months to break-even" },
  { value: "Tracked", label: "ROI from launch" },
  { value: "Pilot", label: "First-workflow proof" },
  { value: "QA", label: "Human review points" },
] as const;

/* ---- Website design and development ------------------------------------- */

export type WebsiteTier = {
  id: string;
  title: string;
  band: string;
  /** Lower/upper page count, used by the band meter. */
  bandRange: [number, number];
  price: string;
  priceNote: string;
  description: string;
  payment: string;
  maintenance: { name: string; price: string };
};

export const WEBSITE_TIERS: readonly WebsiteTier[] = [
  {
    id: "foundation",
    title: "Foundation",
    band: "1–10 pages",
    bandRange: [1, 10],
    price: "£1,500",
    priceNote: "One-off build",
    description:
      "A lean brochure website designed around one clear proposition and focused conversion journey.",
    payment: "£750 before MVP and £750 after MVP review, before the final build.",
    maintenance: { name: "Essential Maintenance", price: "£65/month" },
  },
  {
    id: "professional",
    title: "Professional",
    band: "11–25 pages",
    bandRange: [11, 25],
    price: "£2,750",
    priceNote: "One-off build",
    description:
      "A premium SME website with a broader sitemap, multiple service or audience pages and stronger conversion depth.",
    payment: "50% before MVP and 50% before the final build.",
    maintenance: { name: "Professional Maintenance", price: "£125/month" },
  },
  {
    id: "growth",
    title: "Growth",
    band: "26–50 pages",
    bandRange: [26, 50],
    price: "£4,750",
    priceNote: "One-off build",
    description:
      "A content-rich business website with resource pages, SEO-led structure and a larger service or content library.",
    payment: "50% before MVP and 50% before the final build.",
    maintenance: { name: "Growth Maintenance", price: "£225/month" },
  },
  {
    id: "enterprise-web",
    title: "Enterprise",
    band: "51–100+ pages",
    bandRange: [51, 100],
    price: "From £7,500",
    priceNote: "Phased build",
    description:
      "A complex corporate website with a broad page library, stakeholder review and phased delivery.",
    payment: "Custom milestones agreed in writing.",
    maintenance: { name: "Enterprise Maintenance", price: "Custom quote" },
  },
];

export const MAINTENANCE_PLANS = [
  {
    name: "Essential Maintenance",
    price: "£65/month",
    body: "Monitoring, basic content changes, link checks and minor updates.",
  },
  {
    name: "Professional Maintenance",
    price: "£125/month",
    body: "Priority support, regular updates, minor copy or page edits and monthly health checks.",
  },
  {
    name: "Growth Maintenance",
    price: "£225/month",
    body: "A higher update allowance, content support, reporting and priority issue response.",
  },
  {
    name: "Enterprise Maintenance",
    price: "Custom quote",
    body: "A tailored SLA, governance, reporting, support cadence and stakeholder requirements.",
  },
] as const;

export const HOSTING_OPTIONS = [
  {
    title: "Managed hosting — small site",
    price: "£15/month",
    body: "Fully managed on Netlify, under 15 pages. Billed from go-live.",
  },
  {
    title: "Managed hosting — larger site",
    price: "£25/month",
    body: "Fully managed on Netlify, over 15 pages. Billed from go-live.",
  },
  {
    title: "Self-hosting handover",
    price: "£350 one-off",
    body: "Handover call, DNS and deploy guidance, plus two capped support hours.",
  },
] as const;

export const HOSTING_NOTE =
  "Hosting is optional. Final project files are always supplied after full payment.";

export const WEBSITE_DISCLOSURE =
  "Build fees exclude VAT, third-party services and separately quoted functionality. Milestone payments may be made by Stripe Payment Link or the business-account details shown on the invoice.";

export const MAINTENANCE_NOTE =
  "Maintenance is optional and separate from the one-off build price. Each plan below is a recommended pairing, never an automatic charge.";

/* ---- Bespoke engagements ------------------------------------------------ */

export type BespokeEngagement = {
  id: string;
  title: string;
  price: string;
  body: string;
  supporting: string;
  scope: string[];
  ctaLabel: string;
  ctaHref: string;
};

export const BESPOKE_ENGAGEMENTS: readonly BespokeEngagement[] = [
  {
    id: "app-development",
    title: "App Development",
    price: "Price on application",
    body: "Quoted around product scope, platforms, integrations, data and release. An MVP and a production app are very different builds.",
    supporting:
      "We define the smallest valuable release before wider development begins.",
    scope: [
      "MVP or full product",
      "Web, mobile or cross-platform",
      "Integrations and data",
      "Security and release assurance",
    ],
    ctaLabel: "Discuss an app",
    ctaHref: "/services/app-development",
  },
  {
    id: "ai-consulting",
    title: "AI & Automation Consulting",
    price: "Price on application",
    body: "Scoped around engagement depth, the workflows and stakeholders involved, and whether it's a focused review or a full operating audit.",
    supporting:
      "Priced by the hour, day or fixed fee — the basis confirmed before work begins.",
    scope: [
      "Focused review",
      "Full workflow audit",
      "Roadmap and prioritisation",
      "Hourly, daily or fixed fee",
    ],
    ctaLabel: "Discuss consulting",
    ctaHref: "/services/ai-consulting",
  },
];

/* ---- Verified performance ----------------------------------------------- */

/**
 * Every figure resolves to a record in `~/data/generated/benchmark-metrics.json`
 * and each comes from a different documented engagement type — app
 * development, voice agents, receptionists and workflow automation — never one
 * combined client result.
 */
export const VERIFIED_METRICS = [
  "£16,800.00 — Annual direct cost savings",
  "3.84x — Return on investment",
  "-77% — Reduction in admin time",
  "10+ hours — Saved per person per month",
  "15 hours/week — Time saved",
] as const;

/* ---- Secondary-hero pricing model --------------------------------------- */

export const PRICING_MODEL_ROWS = [
  { title: "Focused pilot", prefix: "From", value: "£3,000", suffix: "" },
  {
    title: "Full implementation",
    prefix: "",
    value: "£10,000–£25,000",
    suffix: "typical",
  },
  { title: "Support retainer", prefix: "From", value: "£350", suffix: "per month" },
] as const;

export const PRICING_MODEL_BEST_STEP = {
  label: "Best first step",
  value: "One workflow pilot",
} as const;

export const PRICING_MODEL_PROOF = [
  "No — Hidden costs",
  "ROI — Modelled before build",
  "24/7 — Support available",
] as const;
