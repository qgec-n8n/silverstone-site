import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const hospitalityCopy: IndustryCopy = {
  route: "/industry/hospitality",
  sector: "Hospitality",
  routeEntry: {
    loaderText: "Coordinating reservations, guest context and staff handoffs.",
    pill: "Guest-journey orchestration",
    title: "Be available at peak demand without making service feel automatic",
    subtitle:
      "Connect availability, reservations, group enquiries and pre-arrival communication while preserving the judgement of the team on duty.",
    buttonLabel: "Explore the guest journey",
  },
  seo: {
    title: "Hospitality Automation UK for Reservations and Guests",
    description:
      "Coordinate reservations, guest enquiries, confirmations, groups, pre-arrival communication and staff handoffs with hospitality automation designed around service and safety.",
    h1: "Coordinate guest demand without flattening the service",
  },
  eyebrow: "Hospitality automation",
  h1: "Coordinate guest demand without flattening the service",
  heroSub:
    "The phone rings during service. An event enquiry lands overnight. The team isn't unresponsive — it's serving the guests already present. Silverstone builds a disciplined guest-journey layer that handles defined requests accurately and brings people in where hospitality becomes judgement.",
  heroPoints: [
    "Reservation truth before conversational fluency",
    "Group and event enquiries arrive as complete briefs",
    "Allergens, complaints and emergencies reach people",
  ],
  trustTokens: ["Reservation-aware", "Multichannel", "Safety-bounded", "Staff-visible"],
  problem: {
    heading: "The busiest moment is when demand arrives",
    body: "A guest asks about parking, check-in, accessibility and allergens across three separate channels while the venue is at capacity. The aim is not a digital concierge that improvises — it is a layer that connects conversation to authoritative availability, approved venue information and named staff handoffs.",
    cards: [
      {
        title: "The phone rings during service",
        body: "Capture routine intent; send safety or complaint matters straight to the team.",
      },
      {
        title: "Availability discussed in three channels",
        body: "Keep the reservation system authoritative — never invent a table or a room.",
      },
      {
        title: "A valuable group enquiry arrives incomplete",
        body: "Gather the full brief before it reaches the events owner.",
      },
      {
        title: "Pre-arrival messages ignore guest state",
        body: "Coordinate communication around the actual reservation, not a broadcast list.",
      },
    ],
  },
  journey: {
    heading: "Reservation truth before conversational fluency",
    lead: "A polished response is harmful if the availability is wrong. Every journey reads from the system that actually owns tables, rooms and event capacity.",
    stages: [
      {
        title: "Enquiry received",
        body: "Venue, date, party size, room type or service interest identified across web, phone and messaging.",
      },
      {
        title: "Context found",
        body: "Approved availability checked, or the guest directed to the authoritative booking path — never a guess.",
      },
      {
        title: "Approved answer or action",
        body: "Deposits, arrival times, cancellation terms and practical policies explained from approved content; reservations created or amended only where rules permit.",
      },
      {
        title: "Commercial opportunity routed",
        body: "Group, event and upsell openings routed to the right owner with a task, never an unauthorised commitment.",
      },
      {
        title: "Safety stop, staff handoff",
        body: "Allergens, complaints and emergencies stop the automated path — the handoff carries conversation, reservation reference, language and reason, so the guest never starts again.",
      },
    ],
  },
  workflows: {
    heading: "From routine questions to complete event briefs",
    lead: "The system responds only from approved, current information — and exposes when something cannot be verified.",
    items: [
      {
        title: "Routine guest questions",
        body: "Directions, parking, check-in, menus, pet policy and cancellation terms answered consistently — with a human route always offered.",
      },
      {
        title: "Groups and events",
        body: "Date flexibility, guest count, format, budget context and decision timing collected into an owned brief for the events team.",
      },
      {
        title: "Pre-arrival and upsell",
        body: "Parking, early check-in or dining offered from a real reservation. A delayed or dissatisfied guest never receives a generic promotion.",
      },
      {
        title: "Reviews and recovery",
        body: "Review requests follow completed service; complaint and recovery signals divert to staff first.",
      },
    ],
  },
  services: {
    heading: "The architecture behind the front desk",
    lead: "Selected for the venue's live service pattern — hotels, restaurants, pubs, venues and multi-site operators.",
    paragraphs: [
      "[AI reception for hospitality](/services/ai-receptionists) supports web and messaging enquiries, while [voice handling for guest calls](/services/ai-voice-agents) manages defined call flows and captures group details. [Reservation and guest workflows](/services/ai-automation) connect reservations, messaging, payments and staff tasks.",
      "A [conversion-led venue website](/services/web-design-development) clarifies the booking architecture, [governed guest content](/services/content-creation) keeps venue information consistent, and [automation consulting](/services/ai-consulting) defines the roadmap for complex estates.",
    ],
  },
  proof: {
    heading: "Demand and availability, measured",
    lead: "Silverstone AI delivery results across commercial demand and peak-hour availability — acquisition and availability measured separately, as they should be.",
    metrics: [
      {
        id: "benchmark-104",
        value: "3,000+",
        label: "Bookings from SEO & PPC",
        basis: "in 12 months",
      },
      { id: "benchmark-105", value: "3x → 20x", label: "SEO and PPC ROI" },
      { id: "benchmark-018", value: "+66%", label: "Increase in phone availability" },
    ],
    attribution: INDUSTRY_ATTRIBUTION,
    clarification: INDUSTRY_CLARIFICATION,
  },
  boundary: {
    heading: "Allergens, accessibility and service recovery",
    body: "This is not a limitation added to weaken the proposition — it is what allows routine automation to operate confidently without placing the guest or venue at risk. The system detects these conditions, stops promotional activity and alerts the duty manager.",
    keeps: [
      "Allergen decisions — approved published information only, never inferred suitability",
      "Accessibility details where judgement matters",
      "Complaints, refunds and discretionary recovery",
      "Emergencies and safeguarding — escalated immediately",
      "Pricing, exclusive-space and contract commitments",
    ],
  },
  process: {
    heading: "Designed for peaks, exceptions and multilingual demand",
    lead: "Silverstone begins with the live service pattern, not a generic bot script.",
    steps: [
      {
        title: "Map the pattern",
        body: "Channels, peak periods and the questions staff answer on repeat.",
      },
      {
        title: "Identify truth",
        body: "Reservation and policy sources of truth confirmed before design.",
      },
      {
        title: "Classify intents",
        body: "Routine, commercial, safety and complaint — each with its own route.",
      },
      {
        title: "Design one journey",
        body: "After-hours reservation enquiry or group qualification first.",
      },
      {
        title: "Test the edges",
        body: "Unavailable inventory, system latency, language, allergens and escalation.",
      },
      {
        title: "Launch with override",
        body: "Staff visibility and manual override from day one, reviewed against completion and guest-response data.",
      },
    ],
  },
  fit: {
    heading: "Is the venue ready?",
    lead: "A strong fit can name its reservation source of truth and its exception owners.",
    right: [
      "An authoritative reservation system",
      "Documented venue information worth answering from",
      "Named owners for exceptions and escalation",
      "Peak periods where demand outruns the team",
    ],
    caution:
      "Silverstone may not be suitable where live availability is unreliable, safety information is not controlled, or the expectation is that automation should replace personal service in every interaction.",
  },
  faqs: {
    heading: "Questions hospitality operators ask",
    items: [
      {
        q: "Can the system access live availability?",
        a: "Only when it is connected to and permitted to use the authoritative reservation system. Otherwise it directs the guest to the booking path or requests staff confirmation.",
      },
      {
        q: "Can it answer allergen questions?",
        a: "It may present approved controlled information, but it never infers safety or replaces the venue's allergen process. Uncertainty goes to staff.",
      },
      {
        q: "Will automated communication feel impersonal?",
        a: "It will if it is generic or badly timed. Silverstone designs concise messages around real reservation and service state, with easy human escalation.",
      },
      {
        q: "Can it handle group and event enquiries?",
        a: "It collects structured requirements and creates an owned brief. Pricing, availability commitments and contract terms remain subject to staff approval.",
      },
      {
        q: "Can it support multiple languages?",
        a: "Potentially, with tested language coverage, controlled content and escalation for critical or ambiguous requests.",
      },
    ],
  },
  midCta: {
    heading: "Map group and event qualification",
    body: "Bring one busy-period enquiry pattern staff repeatedly handle. We'll examine where context, availability and ownership break down.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "Review one guest journey under real operating pressure",
    body: "A discovery call examines the route that creates the most friction: calls during service, after-hours enquiries, groups, pre-arrival or repeated FAQs. See [how Silverstone works](/how-we-work) and [how scope shapes pricing](/pricing).",
    reassurance:
      "No replacement of hospitality staff, no uncontrolled allergen advice and no assumption that every channel should be automated.",
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
