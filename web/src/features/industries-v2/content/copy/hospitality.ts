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
  h1: "Hospitality automation that *never feels automated*",
  deck: "Hotels, restaurants and venues. Never miss a guest.",
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
    lead: "A full Friday service in Chicago and one in Edinburgh miss the same call. Silverstone AI reads live availability from US reservation platforms such as OpenTable, Resy, Tock or SevenRooms and UK systems such as ResDiary or Collins, plus hotel property systems including Mews, Cloudbeds and Guestline. The reservation-truth workflow is identical; the platform and the vocabulary change.",
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
          "Covers, reservations, the waitlist, private dining, walk-ins, the host stand, the check.",
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
          "Covers, bookings, the waiting list, private hire, walk-ins, the front desk, the bill.",
        keepsHuman:
          "Allergen decisions, accessibility, complaints, contracts and pricing.",
      },
    ],
    shared: [
      "Every answer comes from your reservation system or approved information, and says so when it cannot verify.",
      "Group, private-dining and private-hire inquiries arrive with the guest count, date, budget and timing already collected.",
      "Allergens, emergencies and complaints bypass automation and reach the duty manager with context.",
    ],
  },
  problem: {
    heading: "Where does a full service *lose reservations*?",
    body: "A guest asks about allergens, parking and check-in across three channels while the venue is full. The phone goes to voicemail, the message waits, and the group inquiry cools. **This is not a digital concierge that improvises.** It answers only from your live reservation system and approved venue information, and hands anything it cannot verify to the team on duty.",
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
    heading: "How does it know *a table or room is really free*?",
    lead: "Every journey reads your live reservation system before it says a word. If availability can be checked, it is checked; if it cannot, the guest is routed to your booking path or to a person. A polished reply built on a guessed table or a guessed room is worse than no reply at all.",
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
    heading: "Which guest messages *can it handle end to end*?",
    lead: "Routine questions, group and private-event inquiries, pre-arrival messages and review requests. Each one answers from approved, current information and says so when something cannot be verified. Reservations, deposits and policies come from your system; pricing, contracts and anything touching safety stop and go to the named person who owns them.",
    items: [
      {
        title: "Routine questions",
        body: "Directions, menus, policies: answered the same way, every time.",
      },
      {
        title: "Groups & events",
        body: "Private dining or private hire: guest count, budget and timing in one owned brief.",
      },
      {
        title: "Pre-arrival & upsell",
        body: "Only from a real reservation, with consent on file and quiet hours kept; a delayed guest never gets a promotion.",
      },
      {
        title: "Reviews & recovery",
        body: "Requested after completed service, with real sender details and a working unsubscribe; complaints divert to staff first.",
      },
    ],
  },
  services: {
    heading: "The system behind the host stand and the front desk",
    lead: "Shaped for your live service pattern: hotels, restaurants, bars, venues, multi-site groups.",
    paragraphs: [
      "[AI reception](/services/ai-receptionists) supports web and messaging; [voice handling](/services/ai-voice-agents) manages calls on US and UK numbers and captures group details; [connected workflows](/services/ai-automation) tie OpenTable, Resy, Tock, SevenRooms or ResDiary reservations, messaging and staff tasks together.",
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
    heading: "What will it *never do on its own*?",
    body: "It never decides anything touching guest safety, money or a signed agreement. Allergens, accessibility needs, complaints, emergencies, contracts and pricing are detected, stopped and passed to the duty manager with the full conversation attached. **This isn't a limitation; it's what lets everything else run with total confidence.**",
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
      {
        title: "Test the edges",
        body: "Latency, language, allergens, quiet hours, escalation.",
      },
      { title: "Launch with override", body: "Staff visibility from day one." },
    ],
  },
  fit: {
    heading: "Is this *your venue*?",
    lead: "Yes, if your hotel, restaurant or venue can point to one authoritative reservation system, keep its published venue and allergen information current, and name who owns groups, complaints and safety. The trigger is demand that already outruns the team at peak: the system absorbs the overflow, it does not replace the service.",
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
      {
        q: "How does it handle SMS consent for US guests?",
        a: "Consent first. A number is texted only where opt-in was captured and recorded, every message carries a plain opt-out that suppresses the number immediately, and sending is held to quiet hours in the guest's local time zone. Those are the consent, opt-out and timing questions the TCPA raises for automated SMS to US numbers. **Your own counsel approves the program before launch.**",
      },
      {
        q: "What about pre-arrival and review emails under CAN-SPAM?",
        a: "Confirmations and pre-arrival details are transactional and follow the reservation. Marketing and review requests go only to guests who opted in, and commercial email is built with accurate sender and subject headers, a real postal address for the venue, and an unsubscribe that works first time and is honored in the workflow.",
      },
      {
        q: "Can one system cover US and UK venues in different time zones?",
        a: "Yes. Each site runs on its own clock: availability, service hours, quiet hours and follow-up timing are set per venue, so a Chicago restaurant and an Edinburgh hotel in the same group each answer in local time. Silverstone AI works from London, with US-based team members covering US business hours.",
      },
      {
        q: "Do you work with US venues, and can you quote in dollars?",
        a: "Yes. We work with hospitality operators in the United States and the United Kingdom from the London studio, and proposals are quoted and invoiced in GBP or USD, whichever is agreed at proposal. Published bands on the pricing page carry both currencies; scope, channels and connected systems set the figure.",
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
