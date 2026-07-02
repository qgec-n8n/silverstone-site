import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const salonsBarbersCopy: IndustryCopy = {
  route: "/industry/salons-barbers",
  sector: "Salons & barbers",
  routeEntry: {
    loaderText: "Aligning services, practitioners and available chair time.",
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
  h1: "Protect sellable chair time without adding front-desk pressure",
  heroSub:
    "A salon can look busy and still lose sellable time. Silverstone designs salon automation around the economics of the diary — service, duration, practitioner, deposit rules and the suitability checks that stay human.",
  heroPoints: [
    "Missed calls captured while hands are occupied",
    "Cancellations refilled while the slot still has value",
    "Suitability and patch tests stay with practitioners",
  ],
  trustTokens: [
    "Diary-controlled",
    "Deposit-aware",
    "Consent-led",
    "Practitioner-owned",
  ],
  problem: {
    heading: "A full diary can still leak revenue",
    body: "Calls arrive while hands are occupied. Direct messages sit unanswered. A late cancellation creates a gap the waitlist never sees. A client leaves happy but no rebooking conversation happens until the relationship has cooled. None of this is a demand problem — it is a diary-operations problem.",
    cards: [
      {
        title: "The phone rings during the service",
        body: "Capture the reason and preferred next step without pulling a practitioner away.",
      },
      {
        title: "A cancellation becomes dead time",
        body: "Match the released slot to an eligible waitlist while it still has value.",
      },
      {
        title: "Rebooking lives in memory",
        body: "Trigger the right prompt from completed service and approved cadence.",
      },
      {
        title: "One diary, unwritten rules",
        body: "Make service, practitioner, room, deposit and suitability logic explicit.",
      },
    ],
  },
  journey: {
    heading: "The rules behind a booking that actually works",
    lead: "A diary should not be automated until the rules are explicit. Silverstone turns them into a controlled booking architecture.",
    stages: [
      {
        title: "Service fit",
        body: "Name, duration, price context, practitioner skill and required resource — a colour appointment and a skin fade never share one script.",
      },
      {
        title: "Commercial terms",
        body: "Deposit rules, notice periods and reschedule terms are applied exactly as your policy defines them, with failures reaching a person.",
      },
      {
        title: "Client status",
        body: "New, returning, waitlisted or lapsed — each status changes what may be offered, and consent rules decide who may be messaged at all.",
      },
      {
        title: "Valid next step",
        body: "The right slot is offered from the authoritative diary; the booking source of truth is updated once, with conflict states tested before launch.",
      },
      {
        title: "Human gate",
        body: "Patch tests, contraindications, health disclosures, complaints and discretionary refunds pause automation and reach a practitioner with context.",
      },
    ],
  },
  workflows: {
    heading: "Recover cancellations while the slot is still usable",
    lead: "Cancellation recovery is a time-sensitive allocation problem — a slot released at 10:00 for 15:00 has a shrinking commercial value.",
    items: [
      {
        title: "Cancellation refill",
        body: "The released slot is matched to a suitable waitlist segment in an agreed order. The first valid acceptance updates the diary; everyone else gets a clear closure.",
      },
      {
        title: "Rescheduling without the phone tennis",
        body: "Clients move routine appointments in one exchange, while the flow respects deposit terms, notice windows and practitioner-only decisions.",
      },
      {
        title: "Rebooking that feels considered",
        body: "A six-week colour cycle, a regular barbering cadence and a one-off bridal service never trigger the same message — timing follows service and relationship.",
      },
      {
        title: "Consent-aware reactivation",
        body: "Dormant clients are segmented by service and consent, with suppression and easy opt-out — never a bulk blast to every historic contact.",
      },
    ],
  },
  services: {
    heading: "Built around the system you already use",
    lead: "Silverstone does not begin by replacing the diary — it tests whether your current platform can support reliable automation.",
    paragraphs: [
      "An [AI receptionist for salon enquiries](/services/ai-receptionists) answers routine questions and directs each client to the right path, while [voice handling for missed calls](/services/ai-voice-agents) captures the demand that arrives mid-service.",
      "[Cancellation and rebooking workflows](/services/ai-automation) coordinate the booking system, messaging, payments and client record, and a governed [content workflow](/services/content-creation) turns approved expertise into aftercare and seasonal communication without inventing treatment claims.",
    ],
  },
  proof: {
    heading: "Diary performance, measured",
    lead: "Silverstone AI delivery results across attendance, reachability and repetitive diary administration — three separate opportunities, measured separately.",
    metrics: [
      { id: "benchmark-012", value: "-75%", label: "Reduction in no-shows" },
      { id: "benchmark-013", value: "+66%", label: "Increase in phone availability" },
      {
        id: "benchmark-025",
        value: "6 hours",
        label: "Admin time saved",
        basis: "per week",
      },
    ],
    attribution: INDUSTRY_ATTRIBUTION,
    clarification: INDUSTRY_CLARIFICATION,
  },
  boundary: {
    heading: "Suitability and trust stay with practitioners",
    body: "Automation coordinates the slot; it does not decide whether a treatment is appropriate. A client who raises a suitability issue is never forced through a booking funnel — the system pauses, explains the next step and hands the practitioner the relevant context.",
    keeps: [
      "Patch tests and contraindications",
      "Health disclosures and sensitive requests",
      "Complaints and discretionary refunds",
      "Treatment advice of any kind",
      "Consent decisions for promotional messaging",
    ],
  },
  process: {
    heading: "Implementation around your diary",
    lead: "Replacement is considered only when the current system cannot support authoritative availability.",
    steps: [
      {
        title: "Diary review",
        body: "Services, durations, practitioners, resources and locations.",
      },
      {
        title: "Rule definition",
        body: "Deposits, cancellations, waitlists, patch tests and escalation.",
      },
      {
        title: "Journey choice",
        body: "One valuable path first — missed-call capture or cancellation refill.",
      },
      {
        title: "Integration test",
        body: "How availability, client status and payments are read and updated.",
      },
      {
        title: "Controlled launch",
        body: "Errors, double-book risk, client response and staff intervention monitored.",
      },
      {
        title: "Optimisation",
        body: "Timing and segmentation refined from observed behaviour.",
      },
    ],
  },
  fit: {
    heading: "Is this the right operating problem to solve?",
    lead: "The strongest fit is a business ready to write down the rules currently held in people's heads.",
    right: [
      "Repeated enquiry volume across phone and messages",
      "Defined services with a stable booking system",
      "Leadership willing to document diary rules",
      "No-shows, cancellations or rebooking gaps you can name",
    ],
    caution:
      "Silverstone may not be the right fit where the diary is routinely overridden without a source of truth, where treatment suitability is expected to be automated, or where dormant-client messaging would proceed without consent controls.",
  },
  faqs: {
    heading: "Common questions",
    items: [
      {
        q: "Will automation double-book our diary?",
        a: "The design uses one authoritative booking source, tests update behaviour and defines what happens when a slot changes mid-transaction. Nothing launches until conflict and failure states are proven.",
      },
      {
        q: "Can it understand different service lengths and practitioners?",
        a: "Yes, when those rules are documented and available from the booking system. Complex or suitability-dependent services route to staff instead of being forced into direct booking.",
      },
      {
        q: "How are deposits handled?",
        a: "The flow follows your approved payment and cancellation terms. Failed, disputed or discretionary cases reach a person.",
      },
      {
        q: "Will clients dislike automated messages?",
        a: "Poorly timed bulk messages damage trust. Silverstone designs concise communication around real booking status, service cadence and consent.",
      },
      {
        q: "Can it reactivate dormant clients?",
        a: "It can support a consent-aware reactivation programme with segmentation, suppression and easy opt-out. It never assumes every historic client may be contacted.",
      },
    ],
  },
  midCta: {
    heading: "Map cancellation recovery",
    body: "Bring one week of diary friction — not a technical specification. The call determines whether the problem is process, platform, communication or capacity.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "Review the diary before buying another tool",
    body: "A discovery call reviews the booking journey that creates the most friction: missed calls, cancellations, waitlists, rebooking or multi-location coordination. See [how Silverstone delivers](/how-we-work) and how [scope shapes pricing](/pricing).",
    reassurance:
      "No obligation, no platform-migration assumption and no automated treatment advice. Bring the name of your booking platform and one recent example.",
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
