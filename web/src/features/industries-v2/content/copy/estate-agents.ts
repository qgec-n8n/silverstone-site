import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const estateAgentsCopy: IndustryCopy = {
  route: "/industry/estate-agents",
  sector: "Estate agents & real estate teams",
  routeEntry: {
    loaderText: "Preparing the agency system",
    pill: "Property inquiry operating system",
    title: "Respond while the opportunity is still live",
    subtitle:
      "A connected layer for portal leads, calls, showing and viewing requests, valuation and listing inquiries and agent follow-up, built around the way agencies and brokerages actually work.",
    buttonLabel: "Explore the inquiry journey",
  },
  seo: {
    title: "AI Automation for Estate Agents and Real Estate Teams | Silverstone AI",
    description:
      "Connect portal, phone and website inquiries to qualification, showing requests, CRM updates and human follow-up. Built for UK estate agents and US real estate brokerages.",
    h1: "Turn property inquiries into conversations your agents own",
  },
  eyebrow: "AI automation for estate agents and real estate teams",
  h1: "Turn property inquiries into *conversations your agents own*",
  heroSub:
    "Every unanswered portal lead is a fee or a commission for a rival agency. Silverstone AI answers in **seconds**, so your negotiators and agents get a live conversation, not a queue.",
  heroPoints: [
    "Portal, phone and web, one intelligent intake",
    "Viewings and showings offered from your live calendar",
    "Valuations, pricing and negotiation stay with your people",
  ],
  trustTokens: [
    "Portal-aware",
    "Calendar-controlled",
    "CRM-owned",
    "Human-led judgment",
  ],
  markets: {
    eyebrow: "Built for your market",
    heading: "Same leak. *Your* portal, your CRM.",
    lead: "A Zillow lead in Austin and a Rightmove lead in Manchester leak the same way: speed without ownership. The workflow is identical; only the portal, the CRM and the nouns change.",
    lanes: [
      {
        market: "US",
        label: "United States",
        operators:
          "Brokerages, teams and independent agents, across residential sales and property management.",
        tooling: [
          "Zillow, Realtor.com and Homes.com leads",
          "Follow Up Boss, kvCORE, Lofty or BoomTown",
          "ShowingTime and your MLS showing calendar",
        ],
        vocabulary: "Listings, showings, buyer and seller leads, ISAs, closings.",
        keepsHuman: "Pricing, offers, negotiation and seller disclosures.",
      },
      {
        market: "UK",
        label: "United Kingdom",
        operators:
          "Estate agencies and lettings agents, from a single branch to a multi-branch network.",
        tooling: [
          "Rightmove, Zoopla and OnTheMarket leads",
          "Reapit, Alto, Street or Jupix",
          "Your branch calendar and viewing calendar",
        ],
        vocabulary:
          "Instructions, viewings, valuations, applicants, vendors, completions.",
        keepsHuman: "Valuations, offers, negotiation and material information.",
      },
    ],
    shared: [
      "A portal lead is answered in under ten seconds, day or night, in your agency's voice.",
      "Every inquiry is written to your CRM once, duplicate-checked, with a named owner.",
      "Only real calendar availability is ever offered, for a viewing or a showing.",
    ],
  },
  problem: {
    heading: "Where instructions and listings *leak*",
    body: "A seller requests a valuation. A buyer opens three listings. A landlord calls mid-viewing. By the time the inbox gets read, **the instruction, or the listing, belongs to another agency.** Speed alone doesn't fix it; speed without ownership is just a faster dead end.",
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
        title: "Calendar promises, calendar truth",
        body: "Only real availability is ever offered. No ghost slots.",
      },
      {
        title: "Valuation and listing requests buried in noise",
        body: "High-intent seller leads get their own priority route.",
      },
    ],
  },
  journey: {
    heading: "One inquiry journey, *zero leaks*",
    lead: "Every inquiry answers three questions in seconds: what do they want, which system holds the truth, who owns the next move.",
    stages: [
      {
        title: "Capture & identify",
        body: "Channel, property and intent captured instantly: viewing or showing, valuation or listing appointment, lettings, rentals or management.",
      },
      {
        title: "Route & record",
        body: "Written to your CRM once, duplicate-checked, with a named owner from the first second.",
      },
      {
        title: "Offer the next step",
        body: "Real viewing and showing slots from your live calendar, never an invented promise.",
      },
      {
        title: "Follow through",
        body: "Confirmations, reminders and feedback fire from real status changes.",
      },
      {
        title: "Escalate judgment",
        body: "Valuations, pricing, negotiation and complaints reach your people immediately, with full context attached.",
      },
    ],
  },
  workflows: {
    heading: "Built for *every desk* in the agency",
    lead: "Sales, lettings and management don't share a script — so they don't share a workflow.",
    items: [
      {
        title: "Sales",
        body: "Buyer position, viewing preferences and valuation or listing requests routed to the right negotiator or agent, **while interest is hot**.",
      },
      {
        title: "Lettings and rentals",
        body: "Applicant, tenant and landlord instantly distinguished, qualified without suitability, screening or financial calls.",
      },
      {
        title: "Property management",
        body: "Routine traffic sorted with tenancy context; urgent matters jump the queue to a person.",
      },
      {
        title: "Multi-office",
        body: "Postcode, zip and ownership rules applied consistently, with stalled inquiries visible **before they become lost fees or commissions**.",
      },
    ],
  },
  services: {
    heading: "The architecture behind the switchboard",
    lead: "Assembled around your CRM and calendar, never a pre-packaged stack.",
    paragraphs: [
      "[AI reception for property inquiries](/services/ai-receptionists), [voice handling for missed calls](/services/ai-voice-agents) and [connected automation workflows](/services/ai-automation) work as one system around your CRM, whether that is Reapit, Alto, Follow Up Boss or kvCORE.",
      "Where your website leaks demand, a [conversion-led agency web build](/services/web-design-development) closes the gap, with [AI consulting](/services/ai-consulting) shaping the architecture first.",
    ],
  },
  proof: {
    heading: "Measured where *fees are won*",
    lead: "Verified Silverstone AI delivery results for estate agency inquiry systems.",
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
    heading: "Your local judgment, *amplified*",
    body: "Local knowledge is your edge; we never automate it. The system assembles the context; **your people make the calls that win instructions and listings.** Less time reconstructing conversations, more time closing them.",
    keeps: [
      "Valuations and pricing",
      "Negotiation and offers",
      "Complaints and disputes",
      "Material information and disclosures",
      "Every judgment call",
    ],
  },
  process: {
    heading: "Live in *weeks*, not quarters",
    lead: "We start with your live operating model, not a preferred tool.",
    steps: [
      { title: "Map demand", body: "Channels, volumes, peaks, failure points." },
      { title: "Define authority", body: "CRM, calendar and office ownership rules." },
      { title: "Build journey one", body: "Portal lead → booked viewing or showing." },
      { title: "Test the edges", body: "Duplicates, dead slots, out-of-hours." },
      { title: "Launch measured", body: "Every exception tracked from day one." },
      { title: "Optimize on evidence", body: "Improvements follow data, not hunches." },
    ],
  },
  fit: {
    heading: "Is this *your agency*?",
    lead: "The strongest results come from agencies and brokerages ready to own the outcome.",
    right: [
      "Multi-channel inquiry volume",
      "A named CRM or calendar owner",
      "Leadership that sets office rules",
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
        a: "Usually, yes: Rightmove, Zoopla and OnTheMarket leads or Zillow, Realtor.com and Homes.com leads, into Reapit, Alto and Street or Follow Up Boss, kvCORE and Lofty. Discovery confirms exactly what can be read, written and triggered **before** any promise is made.",
      },
      {
        q: "Will leads know it's automated?",
        a: "It's transparent and written in your agency's voice. It never impersonates a negotiator or an agent.",
      },
      {
        q: "Can it book viewings or showings directly?",
        a: "Yes, where your calendar and rules allow it, including showing calendars. Otherwise it prepares a confirmed slot for office sign-off.",
      },
      {
        q: "How do you keep CRM data clean?",
        a: "Validation, duplicate checks and an owned exception queue, proven against real branch and office scenarios before launch.",
      },
      {
        q: "What about complaints and valuations?",
        a: "They bypass automation instantly and land with a named person, context attached.",
      },
    ],
  },
  midCta: {
    heading: "See the switchboard on *your* inquiries",
    body: "Bring one inquiry that went cold. In 30 minutes we'll show you exactly where it leaked, and what the fix looks like.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "Your next instruction is *already inquiring*",
    body: "One call maps your portal, phone, calendar and CRM handoffs, and tells you honestly what automation will and won't win you. See [how we deliver](/how-we-work) and [how scope shapes pricing](/pricing).",
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
