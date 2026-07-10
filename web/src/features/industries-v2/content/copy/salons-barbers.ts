import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const salonsBarbersCopy: IndustryCopy = {
  route: "/industry/salons-barbers",
  sector: "Salons & barbers",
  routeEntry: {
    loaderText: "Aligning diary and chair time",
    pill: "Diary intelligence for client-service businesses",
    title: "Make every available hour easier to sell",
    subtitle:
      "Connect enquiries, deposits, cancellations, waitlists and rebooking without interrupting the experience in the chair.",
    buttonLabel: "Open the diary system",
  },
  seo: {
    title: "Salon Automation UK for Bookings and Rebooking | Silverstone",
    description:
      "Connect calls, messages, booking rules, deposits, waitlists and rebooking with salon automation designed around your existing diary and human suitability decisions.",
    h1: "Protect sellable chair time without adding front-desk pressure",
  },
  eyebrow: "Salon & barber automation",
  h1: "Protect *sellable chair time* without adding front-desk pressure",
  heroSub:
    "An empty chair earns nothing. Silverstone answers every call, refills cancellations **while the slot still has value**, and rebooks before clients drift.",
  heroPoints: [
    "Missed calls captured while hands are busy",
    "Cancellations refilled from your waitlist — fast",
    "Patch tests and suitability stay with practitioners",
  ],
  trustTokens: [
    "Diary-controlled",
    "Deposit-aware",
    "Consent-led",
    "Practitioner-owned",
  ],
  problem: {
    heading: "A full diary can *still leak revenue*",
    body: "Calls ring out mid-service. DMs sit unread. A 3pm cancellation dies in the group chat. **Every gap is money the chair never earns back** — and none of it is a demand problem.",
    cards: [
      {
        title: "The phone rings mid-service",
        body: "Captured, qualified and booked — without pulling anyone off a client.",
      },
      {
        title: "Cancellation becomes dead time",
        body: "The slot is offered to your waitlist within minutes.",
      },
      {
        title: "Rebooking lives in memory",
        body: "The right prompt fires at the right service cadence.",
      },
      {
        title: "Unwritten diary rules",
        body: "Service, stylist, deposit and suitability logic — made explicit.",
      },
    ],
  },
  journey: {
    heading: "The rules behind a booking that *actually works*",
    lead: "A colour appointment and a skin fade never share one script. We encode your real rules first — then automate.",
    stages: [
      {
        title: "Service fit",
        body: "Duration, practitioner skill and required resource matched instantly.",
      },
      {
        title: "Commercial terms",
        body: "Your deposit and notice rules applied exactly — failures reach a person.",
      },
      {
        title: "Client status",
        body: "New, returning, waitlisted or lapsed — each gets the right offer, with consent.",
      },
      {
        title: "Valid next step",
        body: "The right slot from your authoritative diary. Double-booking is engineered out.",
      },
      {
        title: "Human gate",
        body: "Patch tests, disclosures and complaints pause automation and reach your practitioner with context.",
      },
    ],
  },
  workflows: {
    heading: "Recover revenue *while it's recoverable*",
    lead: "A slot released at 10:00 for 15:00 loses value by the minute. The system moves faster.",
    items: [
      {
        title: "Cancellation refill",
        body: "Released time offered to eligible waitlist clients in your order — **first valid acceptance wins**, everyone else gets closure.",
      },
      {
        title: "One-message reschedules",
        body: "Clients move routine appointments in a single exchange, inside your notice and deposit rules.",
      },
      {
        title: "Rebooking that feels personal",
        body: "Six-week colour cycles and four-week fades each get their own cadence — never a blast.",
      },
      {
        title: "Consent-led reactivation",
        body: "Lapsed clients re-engaged by service history and consent, with suppression and easy opt-out built in.",
      },
    ],
  },
  services: {
    heading: "Built around the diary you already use",
    lead: "We don't start by replacing your booking platform — we start by testing it.",
    paragraphs: [
      "An [AI receptionist for salon enquiries](/services/ai-receptionists) answers routine questions while [voice handling](/services/ai-voice-agents) captures the calls that ring out mid-service.",
      "[Cancellation and rebooking workflows](/services/ai-automation) coordinate diary, payments and client records; a governed [content system](/services/content-creation) keeps aftercare and seasonal messaging on-brand.",
    ],
  },
  proof: {
    heading: "Diary performance, *measured*",
    lead: "Verified Silverstone AI delivery results across attendance, reachability and admin.",
    metrics: [
      { id: "benchmark-012", value: "-75%", label: "No-shows" },
      { id: "benchmark-013", value: "+66%", label: "Phone availability" },
      {
        id: "benchmark-025",
        value: "6 hours",
        label: "Admin saved",
        basis: "per week",
      },
    ],
    attribution: INDUSTRY_ATTRIBUTION,
    clarification: INDUSTRY_CLARIFICATION,
  },
  boundary: {
    heading: "Suitability stays *in the chair*",
    body: "Automation arranges the slot — **your practitioner makes the call.** A client raising a suitability issue is never pushed through a funnel; the system pauses and hands over with context.",
    keeps: [
      "Patch tests and contraindications",
      "Health disclosures",
      "Complaints and refunds",
      "All treatment advice",
      "Marketing consent decisions",
    ],
  },
  process: {
    heading: "From rule map to live diary, *fast*",
    lead: "Replacement is a last resort — configuration comes first.",
    steps: [
      { title: "Diary review", body: "Services, durations, practitioners, locations." },
      {
        title: "Rule definition",
        body: "Deposits, cancellations, waitlists, escalation.",
      },
      {
        title: "One journey first",
        body: "Missed-call capture or cancellation refill.",
      },
      {
        title: "Integration test",
        body: "Availability, payments, client status — proven.",
      },
      { title: "Controlled launch", body: "Double-book risk monitored live." },
      {
        title: "Refine on behaviour",
        body: "Timing and segments tuned from real data.",
      },
    ],
  },
  fit: {
    heading: "Is this *your salon*?",
    lead: "The best results come from owners ready to write the rules down.",
    right: [
      "Steady enquiry volume",
      "Defined services and stable diary",
      "No-shows or gaps you can name",
      "Rules currently held in heads",
    ],
    caution:
      "Not a fit where the diary is routinely overridden, suitability is expected to be automated, or lapsed clients would be messaged without consent.",
  },
  faqs: {
    heading: "Common questions",
    items: [
      {
        q: "Will it double-book our diary?",
        a: "No. One authoritative booking source, with conflict states proven before launch — **nothing ships until it's safe.**",
      },
      {
        q: "Does it understand service lengths and stylists?",
        a: "Yes — documented rules drive it. Suitability-dependent services route to staff automatically.",
      },
      {
        q: "How are deposits handled?",
        a: "Exactly to your payment and cancellation terms. Disputes reach a person.",
      },
      {
        q: "Will clients find it impersonal?",
        a: "Messages fire from real booking status and service cadence — timely and personal, never bulk.",
      },
      {
        q: "Can it win back lapsed clients?",
        a: "Yes — segmented by service and consent, with suppression and one-tap opt-out.",
      },
    ],
  },
  midCta: {
    heading: "Map *your* cancellation recovery",
    body: "Bring one week of diary friction. We'll show you which gaps were recoverable — and what that's worth per chair.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "Review the diary *before* buying another tool",
    body: "One call examines your booking journey end to end: missed calls, cancellations, waitlists, rebooking. See [how we deliver](/how-we-work) and [how scope shapes pricing](/pricing).",
    reassurance:
      "No obligation · no platform migration assumed · no automated treatment advice, ever.",
    buttonLabel: "Book a discovery call",
  },
  related: [
    {
      href: "/services/ai-receptionists",
      label: "Related service",
      title: "AI Receptionists",
    },
    {
      href: "/services/ai-automation",
      label: "Related service",
      title: "AI Automation",
    },
    { href: "/industry", label: "Industries", title: "All industries" },
  ],
};
