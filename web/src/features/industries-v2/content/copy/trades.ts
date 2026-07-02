import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const tradesCopy: IndustryCopy = {
  route: "/industry/trades",
  sector: "Trades & home services",
  routeEntry: {
    loaderText: "Structuring the route from incoming call to an owned job.",
    pill: "Field-service intake and follow-through",
    title: "Answer the opportunity before the van is back at the office",
    subtitle:
      "Capture job context, qualify location and urgency, coordinate callbacks and keep quotes moving without promising what the field team has not confirmed.",
    buttonLabel: "Explore the job journey",
  },
  seo: {
    title: "AI Automation for Trades and Home Services UK",
    description:
      "Capture missed calls, qualify jobs, check service areas, coordinate callbacks, follow up quotes and connect office-to-field workflows with trades automation.",
    h1: "Capture the job properly before the opportunity goes cold",
  },
  eyebrow: "Automation for trades",
  h1: "Capture the job properly before the opportunity goes cold",
  heroSub:
    "A plumber is under a sink. An electrician is testing a board. The phone rings because the work is valuable — but answering may be impossible or unsafe. Silverstone turns more genuine demand into complete, workable job briefs, without inventing price, attendance or technical advice.",
  heroPoints: [
    "Missed calls recovered while the need is current",
    "Service-area and job-type rules applied at intake",
    "Price and attendance committed only by your people",
  ],
  trustTokens: [
    "Service-area aware",
    "Evidence-led",
    "Dispatcher-visible",
    "Safety-bounded",
  ],
  problem: {
    heading: "The phone is busiest when the team cannot answer",
    body: "When the callback finally happens, the customer has often spoken to somebody else — or the office still lacks the details needed to price or schedule the job. The goal is not answering every call at any cost. It is complete job briefs and less administrative drag around quotes, scheduling, updates and invoices.",
    cards: [
      {
        title: "Missed call, missing opportunity",
        body: "Recover context while the need is current — not after the competitor's van arrives.",
      },
      {
        title: "Wrong postcode, wasted callback",
        body: "Apply service-area rules before anyone spends scheduling effort.",
      },
      {
        title: "“It's not working” is not a job brief",
        body: "Gather category, evidence, photos and access details up front.",
      },
      {
        title: "Quote sent, no owner",
        body: "Follow up according to status — and stop when the answer is clear.",
      },
    ],
  },
  journey: {
    heading: "From missed call to complete job brief",
    lead: "The customer gets a clear next step. The office gets enough context to act. The engineer never arrives to “something leaking” with no further information.",
    stages: [
      {
        title: "Call or form captured",
        body: "The missed contact is acknowledged promptly through an approved channel — day or night.",
      },
      {
        title: "Postcode checked",
        body: "Service-area and scope rules run first; out-of-area work is closed politely, borderline cases route for review.",
      },
      {
        title: "Job type and urgency identified",
        body: "Routine quote, urgent-but-not-emergency, or safety-critical language that triggers the firm's approved response.",
      },
      {
        title: "Evidence gathered",
        body: "The minimum useful description, photographs and access constraints — the difference between a callback and a wasted visit.",
      },
      {
        title: "Human commits",
        body: "A callback or visit-request window is offered; the job record is created with a named owner. Price and attendance are confirmed only by your people.",
      },
    ],
  },
  workflows: {
    heading: "Quotes, scheduling and the office-to-field handoff",
    lead: "Automation sends approved updates from real job status — it never invents an arrival time because a calendar says “morning”.",
    items: [
      {
        title: "Quote follow-up without awkward chasing",
        body: "Quote date, value band and decision timing drive approved messages. Positive intent creates a task; a decline stops the sequence; complex work returns to the estimator.",
      },
      {
        title: "Lost-quote intelligence",
        body: "Price, timing, trust, scope clarity or competitor — the system records why quotes die, which beats simply sending more messages.",
      },
      {
        title: "ETA and status updates",
        body: "Customers notified when a job is accepted or rescheduled; ETAs sent only from an approved dispatcher or field action.",
      },
      {
        title: "Completion to cash",
        body: "Completion notes trigger invoice preparation and payment reminders on agreed terms; disputes divert to a person before any review request.",
      },
    ],
  },
  services: {
    heading: "Built around the job-management reality",
    lead: "One operating journey first — not a grand software replacement.",
    paragraphs: [
      "[AI call handling for trades](/services/ai-voice-agents) captures defined call flows, [trades enquiry qualification](/services/ai-receptionists) coordinates web and messaging demand, and [quote follow-up workflows](/services/ai-automation) connect the job record, calendar, quotes and finance tasks.",
      "Where the website attracts incomplete enquiries, a [conversion-led home-services web build](/services/web-design-development) improves evidence capture; [custom job applications](/services/app-development) suit proven dispatch or subcontractor workflows, with [consulting](/services/ai-consulting) defining the architecture for multi-system estates.",
    ],
  },
  proof: {
    heading: "Response and capacity, measured",
    lead: "Silverstone AI delivery results across response speed, reachability, office capacity and continuous processing — with people retaining technical, pricing and attendance authority throughout.",
    metrics: [
      {
        id: "benchmark-081",
        value: "<10 seconds",
        label: "Response time",
        basis: "after implementation",
      },
      { id: "benchmark-058", value: "+66%", label: "Increase in phone availability" },
      {
        id: "benchmark-080",
        value: "15 hours",
        label: "Time saved",
        basis: "per week",
      },
      {
        id: "benchmark-059",
        value: "£16,800",
        label: "Direct cost savings",
        basis: "annual",
      },
    ],
    attribution: INDUSTRY_ATTRIBUTION,
    clarification: INDUSTRY_CLARIFICATION,
  },
  boundary: {
    heading: "Safety, price and attendance remain controlled",
    body: "Automation prepares location, job type, evidence, the record, the callback and the reminders. People commit safety, diagnosis, scope, price and attendance. Emergency language triggers the company's defined response — the workflow is never a substitute for a competent tradesperson.",
    keeps: [
      "Technical diagnosis and safety advice",
      "Binding prices and fixed quotes",
      "Attendance commitments and dispatch decisions",
      "Complaints and disputed work",
      "Emergency response — routed by the firm's approved policy",
    ],
  },
  process: {
    heading: "How the system gets built",
    lead: "Mapped against your real calls, quotes and job history — with a clear reason not to automate if the evidence says so.",
    steps: [
      {
        title: "Map the sources",
        body: "Calls, forms, messages and referrals with their true volumes.",
      },
      {
        title: "Define the rules",
        body: "Service area, job types and emergency boundaries made explicit.",
      },
      {
        title: "Identify truth",
        body: "The source of truth for leads, jobs, calendars and quotes.",
      },
      {
        title: "Choose one journey",
        body: "Missed call to callback, or quote to decision — one first, proven.",
      },
      {
        title: "Test the hard cases",
        body: "Incomplete details, out-of-area work, urgent language and schedule changes.",
      },
      {
        title: "Launch with override",
        body: "Office visibility and manual override, reviewed against response and conversion.",
      },
    ],
  },
  fit: {
    heading: "Is this the right fit?",
    lead: "The technical work may vary; the intake, ownership and follow-up are repeatable enough to improve.",
    right: [
      "Repeated enquiry volume worth capturing",
      "A defined service area and clear job categories",
      "A person accountable for dispatch or quoting",
      "Willingness to make existing rules explicit",
    ],
    caution:
      "Silverstone may not be suitable where every price is improvised without a process, nobody owns callbacks or quotes, or automation is expected to make technical and safety decisions.",
  },
  faqs: {
    heading: "Questions trade businesses ask",
    items: [
      {
        q: "Can an AI receptionist understand urgent jobs?",
        a: "It recognises approved categories and emergency language, but it never diagnoses the problem. Urgent or uncertain cases follow the firm's human escalation policy.",
      },
      {
        q: "Can it give prices?",
        a: "It can explain the quoting process or use explicitly approved fixed-price rules. Complex, site-dependent or safety-related work remains with an estimator or tradesperson.",
      },
      {
        q: "Can it check whether we cover the postcode?",
        a: "Yes, when the service-area rules are defined and maintained. Borderline or commercial cases route for review.",
      },
      {
        q: "Will it book engineers directly?",
        a: "Only where the job type, calendar and authority support it. Many firms offer a callback or visit request until the office confirms attendance.",
      },
      {
        q: "Can it follow up quotes and invoices?",
        a: "Yes, using approved timing, status and stop conditions. Disputes, complaints and negotiated terms go to people.",
      },
    ],
  },
  midCta: {
    heading: "Map quote follow-up",
    body: "Bring one recent enquiry that required several callbacks before the office understood the job. We'll map the information and commitments around it.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "Review the route from ring to revenue",
    body: "A discovery call examines one real journey: missed call, quote request, scheduling update or quote follow-up — and whether better capture and ownership can create more workable jobs. See [how Silverstone works](/how-we-work) and [how scope shapes pricing](/pricing).",
    reassurance:
      "No automatic technical diagnosis, no unconfirmed attendance and no generic software-replacement assumption.",
    buttonLabel: "Book a discovery call",
  },
  related: [
    {
      href: "/services/ai-voice-agents",
      label: "Related service",
      title: "AI Voice Agents",
    },
    {
      href: "/services/ai-automation",
      label: "Related service",
      title: "AI Automation",
    },
    { href: "/industry", label: "Industries", title: "All industries" },
  ],
};
