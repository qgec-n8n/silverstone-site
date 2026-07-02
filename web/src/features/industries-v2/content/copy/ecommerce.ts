import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const ecommerceCopy: IndustryCopy = {
  route: "/industry/ecommerce",
  sector: "eCommerce brands",
  routeEntry: {
    loaderText: "Synchronising catalogue, order and customer-service states.",
    pill: "Commerce operations intelligence",
    title: "Scale the experience, not the queue",
    subtitle:
      "Turn product questions, order context, returns and post-purchase communication into one governed operating system.",
    buttonLabel: "Explore the commerce system",
  },
  seo: {
    title: "eCommerce Automation Agency UK | Silverstone AI",
    description:
      "Connect product questions, order status, returns, support, post-purchase and retention workflows with bespoke ecommerce automation built around authoritative data.",
    h1: "Scale customer experience without multiplying operational friction",
  },
  eyebrow: "AI automation for ecommerce",
  h1: "Scale customer experience without multiplying operational friction",
  heroSub:
    "More orders create more questions, returns and exceptions. Silverstone designs ecommerce automation around state and authority: which system holds the truth, what action is permitted, and when a person must decide.",
  heroPoints: [
    "Answers grounded in live order and stock state",
    "Returns triage with policy control and owned exceptions",
    "Refunds and disputes stay with your team",
  ],
  trustTokens: ["State-aware", "Policy-controlled", "Exception-owned", "Measurable"],
  problem: {
    heading: "Growth creates operational debt",
    body: "When each activity lives in a separate app, the customer experiences the gaps between systems — even if the storefront looks polished. The question is not “Can AI answer this?” It is “Which system holds the truth, what action is permitted at this state, and when must a person decide?”",
    cards: [
      {
        title: "Order truth in one system, conversation in another",
        body: "Bring status into the interaction before asking the customer to repeat the story.",
      },
      {
        title: "Policy answers without exception control",
        body: "Standard routes can be automated; discretion needs a named owner.",
      },
      {
        title: "Retention messages detached from experience",
        body: "A delayed order should never receive an enthusiastic cross-sell.",
      },
      {
        title: "More apps, less visibility",
        body: "Orchestrate the stack you have before adding another surface.",
      },
    ],
  },
  journey: {
    heading: "One customer question, several systems",
    lead: "“Where is my order?” touches order status, fulfilment, carrier data and promised service level. A controlled commerce layer brings those states together.",
    stages: [
      {
        title: "Identify",
        body: "The customer, order or product context is established before anything is answered.",
      },
      {
        title: "Read authoritative state",
        body: "Storefront, order system, warehouse, carrier and helpdesk are consulted — answers are never invented from language-model confidence.",
      },
      {
        title: "Apply approved policy",
        body: "Communication and action rules reflect your policies, consumer rights and brand tone.",
      },
      {
        title: "Act within permissions",
        body: "Only the actions permitted for that state are taken — address changes before cut-off, standard return instructions, status explanations.",
      },
      {
        title: "Own the exception",
        body: "Cases outside the rules become owned exceptions with context, and every outcome is recorded for reporting and improvement.",
      },
    ],
  },
  workflows: {
    heading: "Support automation that knows when to stop",
    lead: "The fastest answer is only useful when it is accurate — and a person remains responsible for discretion.",
    items: [
      {
        title: "Product and pre-purchase",
        body: "Sizing and product questions grounded in approved catalogue content, with escalation when evidence is missing.",
      },
      {
        title: "Order and delivery",
        body: "Status explanations from live order and carrier data; proactive communication when a known state changes.",
      },
      {
        title: "Returns and exchanges",
        body: "A triage journey that gathers facts, explains the standard route, creates labels where permitted and routes exceptions to an owner.",
      },
      {
        title: "Retention and reactivation",
        body: "Status-aware post-purchase journeys: education, review requests, replenishment and win-back with consent and suppression controls.",
      },
    ],
  },
  services: {
    heading: "Architecture before another app",
    lead: "Tool accumulation is the common ecommerce failure. Silverstone starts with the operating model, not another interface.",
    paragraphs: [
      "[eCommerce automation workflows](/services/ai-automation) provide the orchestration. An [AI receptionist for customer questions](/services/ai-receptionists) manages routine web and messaging enquiries, while [custom customer and staff applications](/services/app-development) suit brands that need a unified exception console.",
      "[Governed content systems](/services/content-creation) keep product, policy and education material consistent, and [AI and automation consulting](/services/ai-consulting) settles build-versus-buy questions before implementation.",
    ],
  },
  proof: {
    heading: "Service and efficiency, measured",
    lead: "Silverstone AI delivery results across customer perception, outreach performance and operating capacity — three distinct forms of value.",
    metrics: [
      {
        id: "benchmark-106",
        value: "4.2 → 4.8",
        label: "Trustpilot rating improvement",
      },
      {
        id: "benchmark-107",
        value: "15%",
        label: "Higher response rates on AI-drafted outreach",
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
    heading: "Where automation stops, by design",
    body: "Product availability, delivery estimates and return eligibility come from the source of truth and reflect the current state. Everything discretionary stays human — that control is what separates a serious operating layer from another support widget.",
    keeps: [
      "Discretionary refunds and goodwill decisions",
      "Chargeback and fraud concerns",
      "Vulnerable-customer cases and complaints",
      "High-value order exceptions",
      "Any promise the connected systems cannot verify",
    ],
  },
  process: {
    heading: "The first-release discipline",
    lead: "One journey, one source of truth, one measurable operating problem — then expand.",
    steps: [
      {
        title: "Map the journeys",
        body: "The customer and staff journeys creating the most volume or value.",
      },
      {
        title: "Identify authority",
        body: "Authoritative product, order, customer and policy data.",
      },
      {
        title: "Define thresholds",
        body: "Actions, approval thresholds and communication rules.",
      },
      {
        title: "Design for failure",
        body: "Retry, fallback and human-exception handling before launch.",
      },
      {
        title: "Connect and instrument",
        body: "The smallest useful workflow ships with outcome and data-quality measurement.",
      },
      {
        title: "Expand on evidence",
        body: "Scope grows only when the first journey is stable.",
      },
    ],
  },
  fit: {
    heading: "Where Silverstone fits",
    lead: "The business does not need perfect systems — it must be willing to decide which system is authoritative.",
    right: [
      "Repeated support or operational volume",
      "Reliable order data and documented policies",
      "An accountable owner for exceptions",
      "Existing automations that don't share state or policy",
    ],
    caution:
      "Silverstone may not be the right partner where the expectation is uncontrolled autonomous refunds, invented delivery promises, bulk content without review or a guaranteed revenue figure from one workflow.",
  },
  faqs: {
    heading: "Questions ecommerce leaders ask",
    items: [
      {
        q: "Can this work with our current ecommerce stack?",
        a: "Often — after confirming the available APIs, webhooks, data quality and ownership. The first release uses the systems that already hold reliable product, order and customer state.",
      },
      {
        q: "Will automation replace our support team?",
        a: "The objective is to remove repetitive collection and routine action, not judgement. Specialists remain responsible for exceptions, discretion, recovery and relationship-sensitive cases.",
      },
      {
        q: "Can it issue refunds automatically?",
        a: "Only tightly defined actions should be considered, and many brands keep refund approval with people. The design reflects policy, consumer rights, fraud controls and transaction value.",
      },
      {
        q: "How do you prevent inaccurate answers?",
        a: "Responses are grounded in approved content and authoritative systems, actions are restricted by state, uncertainty is exposed and missing evidence escalates to a person.",
      },
      {
        q: "Where should we start?",
        a: "A high-volume journey with clean enough data, clear policy and measurable failure — usually order status, returns triage or support classification.",
      },
    ],
  },
  midCta: {
    heading: "Map the support journey",
    body: "Bring one ticket type, return path or post-purchase journey that creates repeated work. The call tests whether the issue is data, policy, integration or experience design.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "Choose one journey worth fixing properly",
    body: "The discovery call focuses on one measurable journey — product questions, order status, returns, post-purchase or internal operations — and what a controlled first release would need. See [how Silverstone works](/how-we-work) or [how scope shapes pricing](/pricing).",
    reassurance:
      "One workflow first. No mandatory platform migration. No autonomous financial decisions by default.",
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
