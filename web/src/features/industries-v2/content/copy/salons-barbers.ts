import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const salonsBarbersCopy: IndustryCopy = {
  route: "/industry/salons-barbers",
  sector: "Salons & barbershops",
  routeEntry: {
    loaderText: "Aligning the calendar and chair time",
    pill: "Calendar intelligence for client-service businesses",
    title: "Make every available hour easier to sell",
    subtitle:
      "Connect inquiries, deposits, cancellations, waitlists and rebooking without interrupting the experience in the chair.",
    buttonLabel: "Open the booking system",
  },
  seo: {
    title: "Salon & Barbershop Automation for Bookings and Rebooking | Silverstone AI",
    description:
      "Connect calls, messages, booking rules, deposits, waitlists and rebooking with salon automation designed around your existing diary and human suitability decisions.",
    h1: "Protect sellable chair time without adding front-desk pressure",
  },
  eyebrow: "Salon & barbershop automation",
  h1: "Salon and barbershop automation that *protects chair time*",
  deck: "Without adding front-desk pressure.",
  heroSub:
    "An empty chair earns nothing. Silverstone AI answers every call, refills cancellations **while the slot still has value**, and rebooks before clients drift, for salons and barbershops in the US and UK.",
  heroPoints: [
    "Missed calls captured while hands are busy",
    "Cancellations refilled from your waitlist, fast",
    "Patch tests and suitability stay with practitioners",
  ],
  mobile: {
    tagline: "Every call answered while *your hands are busy*",
    points: [
      "Missed calls captured",
      "Cancellations refilled",
      "Patch tests stay with you",
    ],
  },
  trustTokens: [
    "Calendar-controlled",
    "Deposit-aware",
    "Consent-led",
    "Practitioner-owned",
  ],
  markets: {
    eyebrow: "Built for your market",
    heading: "Same empty chair. *Your* booking platform.",
    lead: "A 3pm cancellation in Brooklyn and one in Birmingham die the same way, in a group chat. The refill workflow is identical; the booking platform and the words for the schedule change.",
    lanes: [
      {
        market: "US",
        label: "United States",
        operators:
          "Hair salons, barbershops, nail studios and lash and brow bars, from a single chair to multiple locations.",
        tooling: [
          "Vagaro, Booksy, GlossGenius or Square Appointments",
          "Instagram and Google Business Profile bookings",
          "Your waitlist and deposit rules",
        ],
        vocabulary:
          "Appointments, no-show fees, stylists and barbers, walk-ins, text reminders, rebooking.",
        keepsHuman:
          "Consultations, patch tests, contraindications, refunds, and who may be texted, and when.",
      },
      {
        market: "UK",
        label: "United Kingdom",
        operators:
          "Hair and beauty salons and barbers, from a single chair to a multi-site group.",
        tooling: [
          "Fresha, Phorest, Timely or Booksy",
          "Instagram, Treatwell and your own booking page",
          "Your waitlist and deposit rules",
        ],
        vocabulary:
          "The diary, cancellations, patch tests, stylists and barbers, walk-ins, rebooking.",
        keepsHuman:
          "Consultations, patch tests, contraindications, refunds, and who may be messaged, and when.",
      },
    ],
    shared: [
      "A call that rings out mid-service is answered and booked without pulling anyone off a client.",
      "A cancellation is offered to the waitlist within minutes, in your order; the first valid acceptance wins.",
      "The booking platform you already run is the only source of truth for the chair.",
    ],
  },
  problem: {
    heading: "Why does a *full calendar* still lose money?",
    body: "Because the leak is in the gaps, not the demand. In salons and barbershops, calls ring out mid-service, DMs sit unread, and a 3pm cancellation dies in the group chat. **Every gap is chair time that can never be sold again**: a stylist paid, a walk-in turned away, and revenue your calendar or diary never records.",
    cards: [
      {
        title: "The phone rings mid-service",
        body: "Captured, qualified and booked, without pulling a stylist or barber off a client.",
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
        title: "Unwritten booking rules",
        body: "Service, stylist, deposit and suitability logic, made explicit.",
      },
    ],
  },
  journey: {
    heading: "What rules does a booking system *need first*?",
    lead: "Yours, written down. A color correction and a skin fade never share one script, so before anything is automated we encode your real rules: service durations, which stylist or barber may take which service, deposit and notice terms, waitlist order, and the point where a person takes over. Automation only executes rules you approved.",
    stages: [
      {
        title: "Service fit",
        body: "Duration, stylist or barber skill and the resource it needs, matched instantly.",
      },
      {
        title: "Commercial terms",
        body: "Your deposit and notice rules applied exactly; failures reach a person.",
      },
      {
        title: "Client status",
        body: "New, returning, waitlisted or lapsed: each gets the right offer, with consent.",
      },
      {
        title: "Valid next step",
        body: "The right slot from your authoritative calendar. Double-booking is engineered out.",
      },
      {
        title: "Contact rules",
        body: "Consent, quiet hours and opt-out are checked before any text or email leaves, in the client's own time zone.",
      },
      {
        title: "Human gate",
        body: "Patch tests, disclosures and complaints pause automation and reach your practitioner with context.",
      },
    ],
  },
  workflows: {
    heading: "How quickly can a cancellation *be refilled*?",
    lead: "Within minutes, while the slot still has value. A 3pm chair released at 10am is offered straight to eligible waitlist clients in the order you set, on the channel each of them agreed to; the first valid acceptance takes the slot and everyone else is told at once. Nobody has to notice the gap first.",
    items: [
      {
        title: "Cancellation refill",
        body: "Released time offered to eligible waitlist clients in your order; **first valid acceptance wins**, everyone else gets closure.",
      },
      {
        title: "One-message reschedules",
        body: "Clients move routine appointments in a single exchange, inside your notice and deposit rules.",
      },
      {
        title: "Rebooking that feels personal",
        body: "Six-week color cycles and four-week fades each get their own cadence, never a blast.",
      },
      {
        title: "Consent-led reactivation",
        body: "Lapsed clients re-engaged by service history and recorded consent, with suppression, **quiet hours and one-tap opt-out** built in on both text and email.",
      },
    ],
  },
  services: {
    heading: "Does this work with Vagaro, Fresha or Booksy?",
    lead: "Yes, and with GlossGenius, Square Appointments, Phorest and Timely. We don't start by replacing the booking platform your salon or barbershop already runs; we start by testing it. It stays the only source of truth for the chair, while the automation reads and writes availability, deposits and client records through it.",
    paragraphs: [
      "An [AI receptionist for salon and barbershop inquiries](/services/ai-receptionists) answers routine questions, including hours, pricing and walk-in availability, while [voice handling](/services/ai-voice-agents) captures the calls that ring out mid-service.",
      "[Cancellation and rebooking workflows](/services/ai-automation) coordinate the calendar or diary, payments and client records in Vagaro, Fresha, Booksy, GlossGenius or Phorest; a governed [content system](/services/content-creation) keeps aftercare and seasonal messaging on-brand.",
    ],
  },
  proof: {
    heading: "Calendar performance, *measured*",
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
    body: "Automation arranges the slot; **your practitioner makes the call.** A client raising a suitability issue is never pushed through a funnel; the system pauses and hands over with context.",
    keeps: [
      "Patch tests and contraindications",
      "Health disclosures",
      "Complaints and refunds",
      "All treatment advice",
      "Marketing consent and contact hours",
    ],
  },
  process: {
    heading: "From rule map to live calendar, *fast*",
    lead: "Replacement is a last resort; configuration comes first.",
    steps: [
      {
        title: "Calendar review",
        body: "Services, durations, stylists and barbers, locations.",
      },
      {
        title: "Rule definition",
        body: "Deposits, cancellations, waitlists, consent, escalation.",
      },
      {
        title: "One journey first",
        body: "Missed-call capture or cancellation refill.",
      },
      {
        title: "Integration test",
        body: "Availability, payments, client status, proven.",
      },
      { title: "Controlled launch", body: "Double-book risk monitored live." },
      {
        title: "Refine on behavior",
        body: "Timing and segments tuned from real data.",
      },
    ],
  },
  fit: {
    heading: "Is this *your salon or barbershop*?",
    lead: "The best results come from owners ready to write the rules down.",
    right: [
      "Steady inquiry volume",
      "Defined services and a stable calendar",
      "No-shows or gaps you can name",
      "Rules currently held in heads",
    ],
    caution:
      "Not a fit where the calendar is routinely overridden, suitability is expected to be automated, or lapsed clients would be texted or emailed without recorded consent.",
  },
  faqs: {
    heading: "Questions salon and barbershop owners ask",
    items: [
      {
        q: "Will it double-book our calendar?",
        a: "No. One authoritative booking source, whether Vagaro, Fresha, Booksy, GlossGenius or Phorest, with conflict states proven before launch; **nothing ships until it's safe.**",
      },
      {
        q: "Does it understand service lengths and stylists?",
        a: "Yes, documented rules drive it. Suitability-dependent services route to staff automatically.",
      },
      {
        q: "How are deposits handled?",
        a: "Exactly to your payment and cancellation terms. Disputes reach a person.",
      },
      {
        q: "Will clients find it impersonal?",
        a: "Messages fire from real booking status and service cadence: timely and personal, never bulk.",
      },
      {
        q: "Can it win back lapsed clients?",
        a: "Yes, segmented by service and consent, with suppression and one-tap opt-out.",
      },
      {
        q: "Do the text reminders follow US texting rules?",
        a: "They are built around them. TCPA governs automated texts to US numbers, so consent is captured at the point of booking and stored against the client record, sends are held inside quiet hours in the client's own time zone, and a STOP or opt-out is honored immediately and written back to your booking platform. **Your policy sets the final wording.**",
      },
      {
        q: "How are marketing emails and unsubscribes handled?",
        a: "As design constraints, not afterthoughts. CAN-SPAM governs commercial email in the US, so campaigns send with an accurate sender and subject line, carry your real business address, and unsubscribe in one click. Opt-outs suppress across every list and sequence at once, so a client who leaves a campaign is never re-added by a rebooking workflow.",
      },
      {
        q: "Can it run across several locations and time zones?",
        a: "Yes. Each salon or barbershop keeps its own opening hours, services, stylists, deposit rules and waitlist order, so a multi-site group is never forced onto one blunt rule. Reminders, refill offers and rebooking prompts are timed in the client's local time zone, and escalations reach the shop that owns the chair rather than a central inbox.",
      },
      {
        q: "Do you quote in dollars or pounds?",
        a: "Both. Scope sets the price: how many journeys, how many locations, and how deep the booking-platform integration goes. Work is quoted and invoiced in the currency agreed at proposal, dollars for US salons and barbershops, sterling for UK ones, and our pricing page publishes every band in both currencies.",
      },
    ],
  },
  midCta: {
    heading: "Map *your* cancellation recovery",
    body: "Bring one week of calendar or diary friction. We'll show you which gaps were recoverable, and what that's worth per chair.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "Review the calendar *before* buying another tool",
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
