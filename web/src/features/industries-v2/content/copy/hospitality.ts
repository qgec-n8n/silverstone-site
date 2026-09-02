import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const hospitalityCopy: IndustryCopy = {
  route: "/industry/hospitality",
  sector: "Hospitality",
  routeEntry: {
    loaderText: "Coordinating the guest journey",
    pill: "Guest-journey orchestration",
    title: "Be available at peak demand without making service feel automatic",
    subtitle:
      "Connect availability, reservations, group inquiries and pre-arrival communication while preserving the judgment of the team on duty.",
    buttonLabel: "Explore the guest journey",
  },
  seo: {
    title: "Hospitality Automation for Reservations and Guests | Silverstone AI",
    description:
      "Coordinate reservations, guest inquiries, confirmations, groups, pre-arrival communication and staff handoffs with hospitality automation designed around service and safety.",
    h1: "Coordinate guest demand without flattening the service",
  },
  eyebrow: "Hospitality automation",
  h1: "Never miss a guest. *Never feel automated.*",
  heroSub:
    "The phone rings mid-service. Silverstone AI answers **instantly** from real availability, and brings your team in exactly where service becomes judgment. For restaurants, hotels and venues in the US and UK.",
  heroPoints: [
    "Reservation truth, never a guess",
    "Group inquiries arrive as complete briefs",
    "Allergens and emergencies reach people, always",
  ],
  trustTokens: ["Reservation-aware", "Multichannel", "Safety-bounded", "Staff-visible"],
  markets: {
    eyebrow: "Built for your market",
    heading: "Same full service. *Your* reservation system.",
    lead: "A full Friday service in Chicago and one in Edinburgh miss the same call. The reservation-truth workflow is identical; the booking platform and what you call the front desk change.",
    lanes: [
      {
        market: "US",
        label: "United States",
        operators:
          "Restaurants, bars, hotels and event venues, from a single site to a multi-location group.",
        tooling: [
          "OpenTable, Resy, Tock or SevenRooms",
          "Toast, Square, Cloudbeds or Mews",
          "Tripleseat and your private-events inbox",
        ],
        vocabulary:
          "Covers, reservations, the waitlist, private dining, walk-ins, the host stand.",
        keepsHuman:
          "Allergen decisions, accessibility, complaints, contracts and pricing.",
      },
      {
        market: "UK",
        label: "United Kingdom",
        operators:
          "Restaurants, pubs, hotels and venues, from a single site to a multi-site group.",
        tooling: [
          "OpenTable, ResDiary, SevenRooms or Collins",
          "Mews, Guestline or your EPOS",
          "Your events inbox and function-room diary",
        ],
        vocabulary:
          "Covers, bookings, the waiting list, private hire, walk-ins, the front desk.",
        keepsHuman:
          "Allergen decisions, accessibility, complaints, contracts and pricing.",
      },
    ],
    shared: [
      "Every answer comes from your reservation system or approved information, and says so when it cannot verify.",
      "Group and event inquiries arrive with the guest count, date, budget and timing already collected.",
      "Allergens, emergencies and complaints bypass automation and reach the duty manager with context.",
    ],
  },
  problem: {
    heading: "Peak demand hits *while you're at capacity*",
    body: "A guest asks about allergens, parking and check-in across three channels while the venue is full. **This is not a digital concierge that improvises.** It's a layer that only answers from your authoritative systems.",
    cards: [
      {
        title: "Phone rings mid-service",
        body: "Captured instantly. Safety and complaints go straight to your team.",
      },
      {
        title: "Availability in three channels",
        body: "One source of truth. Never an invented table or room.",
      },
      {
        title: "Group inquiries, incomplete",
        body: "A full brief before it reaches your events lead.",
      },
      {
        title: "Pre-arrival, ignored",
        body: "Messages that match the actual reservation, never a broadcast.",
      },
    ],
  },
  journey: {
    heading: "Reservation truth *before* fluency",
    lead: "A polished reply is worthless if the availability is wrong. Every journey reads your real system first.",
    stages: [
      {
        title: "Inquiry received",
        body: "Venue, date and party size, captured across web, phone and message.",
      },
      {
        title: "Truth confirmed",
        body: "Availability checked live, or the guest routed to your booking path.",
      },
      {
        title: "Answer or action",
        body: "Deposits and policies from approved content; reservations created only where rules allow.",
      },
      {
        title: "Opportunity routed",
        body: "Groups and upsell go to the right owner, with a task, never an unauthorized promise.",
      },
      {
        title: "Safety stop",
        body: "Allergens and emergencies bypass automation with full context, instantly.",
      },
    ],
  },
  workflows: {
    heading: "Routine to *complete event briefs*",
    lead: "Every answer comes from approved, current information, and says so when it can't be verified.",
    items: [
      {
        title: "Routine questions",
        body: "Directions, menus, policies: answered the same way, every time.",
      },
      {
        title: "Groups & events",
        body: "Guest count, budget and timing collected into one owned brief.",
      },
      {
        title: "Pre-arrival & upsell",
        body: "Only from a real reservation; a delayed guest never gets a promotion.",
      },
      {
        title: "Reviews & recovery",
        body: "Requested after completed service; complaints divert to staff first.",
      },
    ],
  },
  services: {
    heading: "The system behind the front desk",
    lead: "Shaped for your live service pattern: hotels, restaurants, venues, multi-site groups.",
    paragraphs: [
      "[AI reception](/services/ai-receptionists) supports web and messaging; [voice handling](/services/ai-voice-agents) manages calls and captures group details; [connected workflows](/services/ai-automation) tie OpenTable, Resy, SevenRooms or ResDiary reservations, messaging and staff tasks together.",
      "A [conversion-led venue website](/services/web-design-development) clarifies the booking journey, [governed content](/services/content-creation) keeps information consistent, and [consulting](/services/ai-consulting) plans complex estates.",
    ],
  },
  proof: {
    heading: "Demand and availability, *verified*",
    lead: "Verified Silverstone AI delivery results across commercial demand and peak-hour reachability.",
    metrics: [
      {
        id: "benchmark-104",
        value: "3,000+",
        label: "Bookings",
        basis: "12 months",
      },
      { id: "benchmark-105", value: "3x → 20x", label: "SEO & PPC ROI" },
      { id: "benchmark-018", value: "+66%", label: "Phone availability" },
    ],
    attribution: INDUSTRY_ATTRIBUTION,
    clarification: INDUSTRY_CLARIFICATION,
  },
  boundary: {
    heading: "Safety, *never automated*",
    body: "This isn't a limitation; **it's what lets automation operate with total confidence.** The system detects these conditions and alerts the duty manager instantly.",
    keeps: [
      "Allergen decisions, approved info only",
      "Accessibility, where judgment matters",
      "Complaints & discretionary recovery",
      "Emergencies, escalated immediately",
      "Contracts, pricing & exclusive space",
    ],
  },
  process: {
    heading: "Built for *your* peak, not a script",
    lead: "Silverstone AI starts with your live service pattern, never a generic bot.",
    steps: [
      { title: "Map the pattern", body: "Channels, peaks and repeat questions." },
      { title: "Identify truth", body: "Reservation and policy sources, confirmed." },
      { title: "Classify intents", body: "Routine, commercial, safety, each routed." },
      {
        title: "Design one journey",
        body: "After-hours inquiries or group qualification first.",
      },
      { title: "Test the edges", body: "Latency, language, allergens, escalation." },
      { title: "Launch with override", body: "Staff visibility from day one." },
    ],
  },
  fit: {
    heading: "Is this *your venue*?",
    lead: "A strong fit can name its reservation truth and its exception owners.",
    right: [
      "An authoritative reservation system",
      "Documented venue information",
      "Named owners for exceptions",
      "Peaks that outrun the team",
    ],
    caution:
      "Not a fit where live availability is unreliable, safety information isn't controlled, or automation is expected to replace personal service.",
  },
  faqs: {
    heading: "Questions hospitality operators ask",
    items: [
      {
        q: "Can it access live availability?",
        a: "Only when connected to your authoritative system, whether OpenTable, Resy, SevenRooms, ResDiary or your PMS. Otherwise it routes to your booking path or requests confirmation.",
      },
      {
        q: "Can it answer allergen questions?",
        a: "Approved published info only. **It never infers safety.** Uncertainty always goes to staff.",
      },
      {
        q: "Will messages feel impersonal?",
        a: "Only if generic. We write concise messages from real reservation status, with easy human escalation.",
      },
      {
        q: "Can it handle group inquiries?",
        a: "It builds the complete brief. Pricing and commitments stay with staff.",
      },
      {
        q: "Does it support multiple languages?",
        a: "With tested coverage and controlled content, escalating anything critical or ambiguous.",
      },
    ],
  },
  midCta: {
    heading: "Map *your* group and event flow",
    body: "Bring one busy-period pattern staff repeatedly handle. We'll show you where ownership and context break down.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "One guest journey, *under real pressure*",
    body: "A discovery call examines your highest-friction route: calls during service, after-hours, groups or pre-arrival. See [how we deliver](/how-we-work) and [how scope shapes pricing](/pricing).",
    reassurance:
      "No replacement of hospitality staff · no uncontrolled allergen advice · ever.",
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
