import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const estateAgentsCopy: IndustryCopy = {
  route: "/industry/estate-agents",
  sector: "Estate agents",
  routeEntry: {
    loaderText: "Preparing the agency system",
    pill: "Property enquiry operating system",
    title: "Respond while the opportunity is still live",
    subtitle:
      "A connected layer for portal leads, calls, viewing requests, valuation enquiries and branch follow-up—built around the way UK agencies actually work.",
    buttonLabel: "Explore the enquiry journey",
  },
  seo: {
    title: "AI Automation for Estate Agents UK | Silverstone AI",
    description:
      "Connect portal, phone and website enquiries to qualification, viewing requests, CRM updates and human branch follow-up with estate agent automation built for UK workflows.",
    h1: "Turn property enquiries into owned branch conversations",
  },
  eyebrow: "AI automation for estate agents",
  h1: "Turn property enquiries into *owned branch conversations*",
  heroSub:
    "Every unanswered portal lead is a fee for a rival agency. Silverstone answers in **seconds** — negotiators get a live conversation, not a queue.",
  heroPoints: [
    "Portal, phone and web — one intelligent intake",
    "Viewings offered from your live diary",
    "Valuations and negotiation stay with your people",
  ],
  trustTokens: ["Portal-aware", "Diary-controlled", "CRM-owned", "Human-led judgement"],
  problem: {
    heading: "Where instructions *leak*",
    body: "A vendor requests a valuation. A buyer opens three listings. A landlord calls mid-viewing. By the time the inbox gets read, **the instruction belongs to another agency.** Speed alone doesn't fix it — speed without ownership is just a faster dead end.",
    cards: [
      {
        title: "Fast reply, no owner",
        body: "An acknowledgement is worthless until a negotiator owns the next step.",
      },
      {
        title: "Three inboxes, one buyer",
        body: "Phone, portal and web collapse into a single record.",
      },
      {
        title: "Diary promises, diary truth",
        body: "Only real availability is ever offered. No ghost slots.",
      },
      {
        title: "Valuations buried in noise",
        body: "High-intent vendor leads get their own priority route.",
      },
    ],
  },
  journey: {
    heading: "One enquiry journey, *zero leaks*",
    lead: "Every enquiry answers three questions in seconds: what do they want, which system holds the truth, who owns the next move.",
    stages: [
      {
        title: "Capture & identify",
        body: "Channel, property and intent captured instantly — viewing, valuation, lettings or management.",
      },
      {
        title: "Route & record",
        body: "Written to your CRM once, duplicate-checked, with a named owner from the first second.",
      },
      {
        title: "Offer the next step",
        body: "Real viewing slots from your live diary — never an invented promise.",
      },
      {
        title: "Follow through",
        body: "Confirmations, reminders and feedback fire from real status changes.",
      },
      {
        title: "Escalate judgement",
        body: "Valuations, negotiation and complaints reach your people immediately — with full context attached.",
      },
    ],
  },
  workflows: {
    heading: "Built for *every desk* in the agency",
    lead: "Sales, lettings and management don't share a script — so they don't share a workflow.",
    items: [
      {
        title: "Sales",
        body: "Buyer position, viewing preferences and valuation requests routed to the right negotiator, **while interest is hot**.",
      },
      {
        title: "Lettings",
        body: "Applicant, tenant and landlord instantly distinguished — qualified without suitability or financial calls.",
      },
      {
        title: "Property management",
        body: "Routine traffic sorted with tenancy context; urgent matters jump the queue to a person.",
      },
      {
        title: "Multi-branch",
        body: "Postcode and ownership rules applied consistently, with stalled enquiries visible **before they become lost fees**.",
      },
    ],
  },
  services: {
    heading: "The architecture behind the switchboard",
    lead: "Assembled around your CRM and diary — never a pre-packaged stack.",
    paragraphs: [
      "[AI reception for property enquiries](/services/ai-receptionists), [voice handling for missed calls](/services/ai-voice-agents) and [connected automation workflows](/services/ai-automation) work as one system around your CRM.",
      "Where your website leaks demand, a [conversion-led agency web build](/services/web-design-development) closes the gap — with [AI consulting](/services/ai-consulting) shaping the architecture first.",
    ],
  },
  proof: {
    heading: "Measured where *fees are won*",
    lead: "Verified Silverstone AI delivery results for estate agency enquiry systems.",
    metrics: [
      {
        id: "benchmark-098",
        value: "<10 seconds",
        label: "Response time",
        basis: "after implementation",
      },
      { id: "benchmark-099", value: "2.4x", label: "Viewings increase" },
      { id: "benchmark-097", value: "-77%", label: "Admin time" },
    ],
    attribution: INDUSTRY_ATTRIBUTION,
    clarification: INDUSTRY_CLARIFICATION,
  },
  boundary: {
    heading: "Your local judgement, *amplified*",
    body: "Local knowledge is your edge — we never automate it. The system assembles the context; **your people make the calls that win instructions.** Less time reconstructing conversations, more time closing them.",
    keeps: [
      "Valuations and pricing",
      "Negotiation and offers",
      "Complaints and redress",
      "Material information",
      "Every judgement call",
    ],
  },
  process: {
    heading: "Live in *weeks*, not quarters",
    lead: "We start with your live operating model — not a preferred tool.",
    steps: [
      { title: "Map demand", body: "Channels, volumes, peaks, failure points." },
      { title: "Define authority", body: "CRM, diary and branch ownership rules." },
      { title: "Build journey one", body: "Portal lead → booked viewing." },
      { title: "Test the edges", body: "Duplicates, dead slots, out-of-hours." },
      { title: "Launch measured", body: "Every exception tracked from day one." },
      { title: "Optimise on evidence", body: "Improvements follow data, not hunches." },
    ],
  },
  fit: {
    heading: "Is this *your agency*?",
    lead: "The strongest results come from agencies ready to own the outcome.",
    right: [
      "Multi-channel enquiry volume",
      "A named CRM or diary owner",
      "Leadership that sets branch rules",
      "Staff re-keying the same data",
    ],
    caution:
      "Not a fit if there's no source of truth, no exception owner, or an expectation that automation should value property or negotiate.",
  },
  faqs: {
    heading: "Questions agency leaders ask",
    items: [
      {
        q: "Does it work with our CRM and portals?",
        a: "Usually, yes. Discovery confirms exactly what can be read, written and triggered — **before** any promise is made.",
      },
      {
        q: "Will leads know it's automated?",
        a: "It's transparent and written in your agency's voice. It never impersonates a negotiator.",
      },
      {
        q: "Can it book viewings directly?",
        a: "Yes, where your diary and rules allow it. Otherwise it prepares a confirmed slot for branch sign-off.",
      },
      {
        q: "How do you keep CRM data clean?",
        a: "Validation, duplicate checks and an owned exception queue — proven against real branch scenarios before launch.",
      },
      {
        q: "What about complaints and valuations?",
        a: "They bypass automation instantly and land with a named person, context attached.",
      },
    ],
  },
  midCta: {
    heading: "See the switchboard on *your* enquiries",
    body: "Bring one enquiry that went cold. In 30 minutes we'll show you exactly where it leaked — and what the fix looks like.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "Your next instruction is *already enquiring*",
    body: "One call maps your portal, phone, diary and CRM handoffs — and tells you honestly what automation will and won't win you. See [how we deliver](/how-we-work) and [how scope shapes pricing](/pricing).",
    reassurance:
      "30 minutes · no technical prep · a clear fit or no-fit answer, never a forced proposal.",
    buttonLabel: "Book a discovery call",
  },
  related: [
    {
      href: "/services/ai-receptionists",
      label: "Related service",
      title: "AI Receptionists",
    },
    {
      href: "/services/ai-voice-agents",
      label: "Related service",
      title: "AI Voice Agents",
    },
    { href: "/industry", label: "Industries", title: "All industries" },
  ],
};
