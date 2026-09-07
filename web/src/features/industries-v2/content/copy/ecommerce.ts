import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const ecommerceCopy: IndustryCopy = {
  route: "/industry/ecommerce",
  sector: "Ecommerce brands",
  routeEntry: {
    loaderText: "Synchronizing store and service",
    pill: "Commerce operations intelligence",
    title: "Scale the experience, not the queue",
    subtitle:
      "Turn product questions, order context, returns and post-purchase communication into one governed operating system.",
    buttonLabel: "Explore the commerce system",
  },
  seo: {
    title: "Ecommerce Automation for Shopify and DTC Brands | Silverstone AI",
    description:
      "Connect product questions, order status, returns, support, post-purchase and retention workflows with custom ecommerce automation built around authoritative data.",
    h1: "Scale customer experience without multiplying operational friction",
  },
  eyebrow: "AI automation for ecommerce",
  h1: "Ecommerce automation that *scales without the chaos*",
  heroSub:
    "Every order creates another question. Silverstone AI answers instantly from live order data, **and hands every money decision to your team.** Built for Shopify and DTC brands in the US and UK.",
  heroPoints: [
    "Answers grounded in live order & stock data",
    "Returns triaged in seconds, not tickets",
    "Refunds and disputes stay human, always",
  ],
  trustTokens: ["State-aware", "Policy-controlled", "Exception-owned", "Measurable"],
  markets: {
    eyebrow: "Built for your market",
    heading: "Same where-is-my-order ticket. *Your* stack.",
    lead: "A where-is-my-order ticket in Los Angeles and one in Leeds touch the same four systems: the store, the order record, the warehouse and the carrier. The workflow is identical whether you call it a store or a shop, shipping or delivery; the help desk, the returns app and the carrier change.",
    lanes: [
      {
        market: "US",
        label: "United States",
        operators:
          "Shopify and DTC brands, Amazon sellers and omnichannel retailers, from a founder-run store to a scaling team.",
        tooling: [
          "Shopify, BigCommerce or WooCommerce",
          "Gorgias, Zendesk or Kustomer",
          "Klaviyo, Loop Returns, ShipStation and your 3PL",
        ],
        vocabulary:
          "WISMO tickets, RMAs, chargebacks, shipping, 3PLs, carrier scans, subscriptions.",
        keepsHuman:
          "Discretionary refunds, chargebacks, fraud calls and high-value exceptions.",
      },
      {
        market: "UK",
        label: "United Kingdom",
        operators:
          "Shopify and DTC brands, marketplace sellers and multichannel retailers, from a founder-run store to a scaling team.",
        tooling: [
          "Shopify, BigCommerce or WooCommerce",
          "Gorgias, Zendesk or Freshdesk",
          "Klaviyo, ZigZag, Royal Mail and your fulfillment partner",
        ],
        vocabulary:
          "Where-is-my-order queries, returns, chargebacks, delivery, fulfillment, carrier scans, subscriptions.",
        keepsHuman:
          "Discretionary refunds, chargebacks, fraud calls and high-value exceptions.",
      },
    ],
    shared: [
      "Every answer is read live from the storefront, order, warehouse and carrier, never invented from confidence.",
      "Standard returns and address changes act within your policy; discretion becomes an owned case with a name on it.",
      "Retention journeys read order state first, so a late shipment or a delayed parcel never gets a cross-sell.",
    ],
  },
  problem: {
    heading: "Why does support volume *grow faster than orders*?",
    body: "Because each new app adds a gap the customer feels. In a growing store the order truth sits in Shopify or WooCommerce, the conversation sits in the help desk, and shipping status sits with the carrier, so the same question gets answered by hand three times. **The real question is which system holds the truth, and when a human steps in.**",
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
        body: "We orchestrate the stack you have, before you buy another one.",
      },
    ],
  },
  journey: {
    heading: "How does it know *where an order actually is*?",
    lead: "Silverstone AI reads it live. A where-is-my-order question touches four systems: the store, the order record, the warehouse and the carrier. The workflow consults all four before it replies, so the shipping status a customer receives is the status your systems actually hold. **If it cannot be verified, it is not sent.**",
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
        body: "Every response reflects your rules, your customers' rights in their market and your brand's voice.",
      },
      {
        title: "Act within limits",
        body: "Only permitted actions fire: address changes, return labels, status updates.",
      },
      {
        title: "Own the exception",
        body: "Anything outside the rules becomes an owned case with full context; nothing drops.",
      },
    ],
  },
  workflows: {
    heading: "What can it resolve *without a human touching it*?",
    lead: "Product and sizing questions, order and shipping status, standard returns and exchanges, and consent-led retention. Each one answers from your approved catalog and your live order data, and each stops at the same line: a discretionary refund, a chargeback or a high-value exception becomes an owned case with a name on it, never an automated decision.",
    items: [
      {
        title: "Product & pre-purchase",
        body: "Sizing, materials and stock questions answered from your approved catalog in Shopify or WooCommerce, **never guessed.**",
      },
      {
        title: "Order, shipping & delivery",
        body: "Live shipping and delivery status read from real carrier scans, with proactive updates the moment something changes.",
      },
      {
        title: "Returns & exchanges",
        body: "Facts gathered, the standard route explained, return shipping labels issued where permitted, **exceptions owned by name.**",
      },
      {
        title: "Retention & win-back",
        body: "Status-aware journeys for reviews, replenishment and reactivation. Commercial email is built the way CAN-SPAM asks: accurate sender and subject headers, your real physical address, **an unsubscribe that works first time** and suppresses across every sequence at once.",
      },
    ],
  },
  services: {
    heading: "Does this work with Shopify, WooCommerce or BigCommerce?",
    lead: "Yes, and with Gorgias, Zendesk, Kustomer, Freshdesk, Klaviyo, Loop Returns, ZigZag and ShipStation. Your store platform stays the source of truth for products, orders and shipping while the automation reads and writes through it. Tool accumulation is the real ecommerce failure, so we start with your operating model, not another login.",
    paragraphs: [
      "[Automation workflows](/services/ai-automation) orchestrate Shopify or WooCommerce, Gorgias, Klaviyo and your carrier data; an [AI receptionist](/services/ai-receptionists) manages routine web and messaging inquiries; [custom applications](/services/app-development) power a unified exception console where you need one.",
      "[Governed content systems](/services/content-creation) keep product and policy copy consistent, and [AI consulting](/services/ai-consulting) settles build-versus-buy **before** you commit.",
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
    body: "Availability, delivery and returns come from the source of truth. **Everything discretionary stays human**; that's what separates a real operating layer from another support widget.",
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
    lead: "One journey. One source of truth. One measurable win, then we expand.",
    steps: [
      { title: "Map the journeys", body: "Where volume and value actually live." },
      { title: "Identify authority", body: "Product, order and policy, confirmed." },
      { title: "Define thresholds", body: "Actions, approvals, communication rules." },
      { title: "Design for failure", body: "Retry and human-exception paths, tested." },
      { title: "Connect and measure", body: "One workflow live, outcomes tracked." },
      { title: "Expand on evidence", body: "Scope grows only when it's proven." },
    ],
  },
  fit: {
    heading: "Is this *your brand*?",
    lead: "You don't need perfect systems, just the will to name what's authoritative.",
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
        a: "Usually. Shopify, WooCommerce, BigCommerce, Gorgias, Zendesk, Klaviyo and most returns and shipping apps expose what we need; we confirm your APIs, webhooks and data quality first, then build on the systems that already hold reliable state.",
      },
      {
        q: "Does this replace our support team?",
        a: "No. It removes repetitive collection and routine action. **Judgment, discretion and recovery stay with your specialists.**",
      },
      {
        q: "Can it issue refunds on its own?",
        a: "Only within tightly defined limits. Most brands keep approval with people, matched to policy and transaction value.",
      },
      {
        q: "How do you stop inaccurate answers?",
        a: "Every response is grounded in approved content and live systems. Missing evidence escalates; it's never guessed.",
      },
      {
        q: "Where do we start?",
        a: "The highest-volume journey with clean-enough data, usually order status, returns triage or support classification.",
      },
      {
        q: "How are your email sequences designed around CAN-SPAM?",
        a: "Order confirmations and shipping notifications are transactional and follow the order itself. Marketing, review and win-back sequences go only to customers who opted in, and they are built around what CAN-SPAM asks of commercial email: accurate sender and subject headers, your brand's real physical address, and an unsubscribe that works first time and suppresses across every sequence at once. **Your own counsel approves the program before launch.**",
      },
      {
        q: "Can it text US customers about their orders?",
        a: "Only against consent already on the record. Opt-in is captured at checkout or in the help desk and stored on the customer, so every send traces back to a permission. Sends are held to quiet hours in the customer's own time zone, and a STOP or opt-out is honored immediately and written back to Klaviyo and your store. That is how the workflow is built against the consent, opt-out and time-of-day rules the TCPA applies to automated texts to US numbers.",
      },
      {
        q: "Do you work with US brands as well as UK ones?",
        a: "Yes. Silverstone AI works from London with ecommerce and DTC brands in both markets, and every workflow runs on the customer's clock rather than ours: order updates, quiet hours and follow-up timing are set per market, so a 9pm question to a Denver store is handled exactly like a 9pm question to a Manchester shop. Discovery calls are booked in your own time zone.",
      },
      {
        q: "Can you quote in dollars?",
        a: "Yes. Proposals are quoted and invoiced in USD or GBP, whichever is agreed at proposal, and the published bands on the pricing page carry both currencies. Scope sets the figure: how many journeys go live, which channels they cover, and how many systems have to be connected and kept in sync, from the store and the help desk to the returns app, the carrier and your marketing platform.",
      },
    ],
  },
  midCta: {
    heading: "Map *your* support journey",
    body: "Bring one recurring ticket type or return path. We'll show you exactly where it's costing you time, live, on the call.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "Pick one journey worth *fixing properly*",
    body: "One call, one measurable journey, whether product questions, returns or retention, and a clear plan for what a controlled first release needs. See [how we deliver](/how-we-work) or [how scope shapes pricing](/pricing).",
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
