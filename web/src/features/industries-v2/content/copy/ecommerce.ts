import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const ecommerceCopy: IndustryCopy = {
  route: "/industry/ecommerce",
  sector: "eCommerce brands",
  routeEntry: {
    loaderText: "Synchronising store and service",
    pill: "Commerce operations intelligence",
    title: "Scale the experience, not the queue",
    subtitle:
      "Turn product questions, order context, returns and post-purchase communication into one governed operating system.",
    buttonLabel: "Explore the commerce system",
  },
  seo: {
    title: "Ecommerce Automation for Shopify and DTC Brands | Silverstone AI",
    description:
      "Connect product questions, order status, returns, support, post-purchase and retention workflows with bespoke ecommerce automation built around authoritative data.",
    h1: "Scale customer experience without multiplying operational friction",
  },
  eyebrow: "AI automation for eCommerce",
  h1: "Scale the experience *without scaling the chaos*",
  heroSub:
    "Every order creates another question. Silverstone answers instantly from live order data — **and hands every money decision to your team.**",
  heroPoints: [
    "Answers grounded in live order & stock data",
    "Returns triaged in seconds, not tickets",
    "Refunds and disputes stay human, always",
  ],
  trustTokens: ["State-aware", "Policy-controlled", "Exception-owned", "Measurable"],
  problem: {
    heading: "Growth is creating *operational debt*",
    body: "Every fragmented app is a gap your customer feels — even on a beautiful storefront. **The real question isn't “can AI answer this?”** It's which system holds the truth, and when a human must step in.",
    cards: [
      {
        title: "Status they already have to repeat",
        body: "Order truth in one system, conversation in another. We close the gap.",
      },
      {
        title: "Policy without an owner",
        body: "Standard routes automate cleanly; discretion always has a name attached.",
      },
      {
        title: "Retention that ignores reality",
        body: "A delayed order never gets an enthusiastic cross-sell. Ever.",
      },
      {
        title: "More apps, less visibility",
        body: "We orchestrate the stack you have — before you buy another one.",
      },
    ],
  },
  journey: {
    heading: "One question, *instantly resolved*",
    lead: "“Where's my order?” touches four systems. Silverstone reads them all — **in one motion.**",
    stages: [
      {
        title: "Identify",
        body: "Customer, order and product context confirmed before a single word is answered.",
      },
      {
        title: "Read the truth",
        body: "Storefront, order, warehouse and carrier consulted live. **Never invented from confidence.**",
      },
      {
        title: "Apply your policy",
        body: "Every response reflects your rules, consumer rights and your brand's voice.",
      },
      {
        title: "Act within limits",
        body: "Only permitted actions fire — address changes, return labels, status updates.",
      },
      {
        title: "Own the exception",
        body: "Anything outside the rules becomes an owned case with full context — nothing drops.",
      },
    ],
  },
  workflows: {
    heading: "Support that knows *exactly when to stop*",
    lead: "The fastest answer only matters if it's right — and discretion always stays with your team.",
    items: [
      {
        title: "Product & pre-purchase",
        body: "Sizing and product questions answered from your approved catalogue — **never guessed.**",
      },
      {
        title: "Order & delivery",
        body: "Live status from real carrier data, with proactive updates the moment something changes.",
      },
      {
        title: "Returns & exchanges",
        body: "Facts gathered, the standard route explained, labels issued where permitted — **exceptions owned by name.**",
      },
      {
        title: "Retention & win-back",
        body: "Status-aware journeys: reviews, replenishment and reactivation, always consent-first.",
      },
    ],
  },
  services: {
    heading: "Architecture *before* another app",
    lead: "Tool accumulation is the real ecommerce failure. We start with your operating model, not another login.",
    paragraphs: [
      "[Automation workflows](/services/ai-automation) orchestrate the system; an [AI receptionist](/services/ai-receptionists) manages routine web and messaging enquiries; [custom applications](/services/app-development) power a unified exception console where you need one.",
      "[Governed content systems](/services/content-creation) keep product and policy copy consistent, and [AI consulting](/services/ai-consulting) settles build-versus-buy — **before** you commit.",
    ],
  },
  proof: {
    heading: "Verified results, *three ways*",
    lead: "Verified Silverstone AI delivery results across perception, outreach and operating capacity.",
    metrics: [
      {
        id: "benchmark-106",
        value: "4.2 → 4.8",
        label: "Trustpilot rating lift",
      },
      {
        id: "benchmark-107",
        value: "+15%",
        label: "AI-drafted outreach response",
      },
      {
        id: "benchmark-108",
        value: "10+ hours",
        label: "Saved per person",
        basis: "per month",
      },
    ],
    attribution: INDUSTRY_ATTRIBUTION,
    clarification: INDUSTRY_CLARIFICATION,
  },
  boundary: {
    heading: "Where automation stops, *by design*",
    body: "Availability, delivery and returns come from the source of truth. **Everything discretionary stays human** — that's what separates a real operating layer from another support widget.",
    keeps: [
      "Discretionary refunds & goodwill",
      "Chargebacks and fraud calls",
      "Vulnerable-customer cases",
      "High-value order exceptions",
      "Anything the system can't verify",
    ],
  },
  process: {
    heading: "The first-release discipline",
    lead: "One journey. One source of truth. One measurable win — then we expand.",
    steps: [
      { title: "Map the journeys", body: "Where volume and value actually live." },
      { title: "Identify authority", body: "Product, order and policy — confirmed." },
      { title: "Define thresholds", body: "Actions, approvals, communication rules." },
      { title: "Design for failure", body: "Retry and human-exception paths, tested." },
      { title: "Connect and measure", body: "One workflow live, outcomes tracked." },
      { title: "Expand on evidence", body: "Scope grows only when it's proven." },
    ],
  },
  fit: {
    heading: "Is this *your brand*?",
    lead: "You don't need perfect systems — just the will to name what's authoritative.",
    right: [
      "Repeated support volume",
      "Reliable order data",
      "An accountable exception owner",
      "Automations that don't talk to each other",
    ],
    caution:
      "Not a fit if you expect uncontrolled autonomous refunds, invented delivery promises, or a guaranteed revenue number from one workflow.",
  },
  faqs: {
    heading: "Questions ecommerce leaders ask",
    items: [
      {
        q: "Will it work with our current stack?",
        a: "Usually — we confirm your APIs, webhooks and data quality first, then build on the systems that already hold reliable state.",
      },
      {
        q: "Does this replace our support team?",
        a: "No. It removes repetitive collection and routine action. **Judgement, discretion and recovery stay with your specialists.**",
      },
      {
        q: "Can it issue refunds on its own?",
        a: "Only within tightly defined limits — most brands keep approval with people, matched to policy and transaction value.",
      },
      {
        q: "How do you stop inaccurate answers?",
        a: "Every response is grounded in approved content and live systems. Missing evidence escalates — it's never guessed.",
      },
      {
        q: "Where do we start?",
        a: "The highest-volume journey with clean-enough data — usually order status, returns triage or support classification.",
      },
    ],
  },
  midCta: {
    heading: "Map *your* support journey",
    body: "Bring one recurring ticket type or return path. We'll show you exactly where it's costing you time — live, on the call.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "Pick one journey worth *fixing properly*",
    body: "One call, one measurable journey — product questions, returns or retention — and a clear plan for what a controlled first release needs. See [how we deliver](/how-we-work) or [how scope shapes pricing](/pricing).",
    reassurance:
      "One workflow first · no forced migration · no autonomous money decisions.",
    buttonLabel: "Book a discovery call",
  },
  related: [
    {
      href: "/services/ai-automation",
      label: "Related service",
      title: "AI Automation",
    },
    {
      href: "/services/app-development",
      label: "Related service",
      title: "App Development",
    },
    { href: "/industry", label: "Industries", title: "All industries" },
  ],
};
