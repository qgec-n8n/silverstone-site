import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const tradesCopy: IndustryCopy = {
  route: "/industry/trades",
  sector: "Trades, contractors & home services",
  routeEntry: {
    loaderText: "Routing calls into booked jobs",
    pill: "Field-service intake and follow-through",
    title: "Answer the opportunity before the van is back at the office",
    subtitle:
      "Capture job context, qualify location and urgency, coordinate callbacks and keep quotes moving without promising what the field team has not confirmed.",
    buttonLabel: "Explore the job journey",
  },
  seo: {
    title: "AI Automation for Trades, Contractors and Home Services | Silverstone AI",
    description:
      "Capture missed calls, qualify jobs, check service areas, coordinate callbacks, follow up quotes and connect office-to-field workflows with trades automation.",
    h1: "Capture the job properly before the opportunity goes cold",
  },
  eyebrow: "Automation for trades and contractors",
  h1: "Win the job *before the callback ever happens*",
  heroSub:
    "You're mid-job when the phone rings, valuable work you can't answer. Silverstone AI captures it **instantly** into a complete, workable brief, whether you run two vans out of Leeds or fifteen trucks out of Dallas.",
  heroPoints: [
    "Missed calls recovered while demand is hot",
    "Service-area rules applied at intake, live",
    "Price and attendance — your call, always",
  ],
  trustTokens: [
    "Service-area aware",
    "Evidence-led",
    "Dispatcher-visible",
    "Safety-bounded",
  ],
  markets: {
    eyebrow: "Built for your market",
    heading: "Same missed call. *Your* dispatch board.",
    lead: "A missed call in Dallas and a missed call in Leeds leak the same way. The system is identical; only the platform it writes to and the words on the job sheet change.",
    lanes: [
      {
        market: "US",
        label: "United States",
        operators:
          "HVAC, plumbing, electrical and home-service contractors, from owner-operators to multi-truck companies.",
        tooling: [
          "ServiceTitan, Housecall Pro or Jobber",
          "Google Local Services and Angi leads",
          "Your dispatch board and technician schedules",
        ],
        vocabulary:
          "Service calls, estimates, dispatch, techs, zip-code service areas.",
        keepsHuman:
          "Diagnosis, binding estimates, dispatch decisions and emergency response.",
      },
      {
        market: "UK",
        label: "United Kingdom",
        operators:
          "Plumbing, heating, electrical and building trades, from sole traders to multi-van firms.",
        tooling: [
          "Commusoft, simPRO, Tradify or BigChange",
          "Checkatrade, Rated People and referral leads",
          "Your job diary and engineer schedules",
        ],
        vocabulary: "Call-outs, quotes, job sheets, engineers, postcode service areas.",
        keepsHuman:
          "Diagnosis, fixed quotes, attendance decisions and emergency response.",
      },
    ],
    shared: [
      "A missed call is captured and qualified within seconds, day or night.",
      "Service-area and urgency rules run before anyone spends an hour on the road.",
      "The job record, calendar and follow-up are written once, in the system you already run.",
    ],
  },
  problem: {
    heading: "The phone rings *when you can't answer*",
    body: "By the callback, they've booked someone else, or the office still doesn't have enough to price the job. **The goal isn't answering every call. It's turning genuine demand into workable jobs.**",
    cards: [
      {
        title: "Missed call, missed job",
        body: "Recovered while the need is still current.",
      },
      {
        title: "Out of area, wasted trip",
        body: "Service-area rules checked before anyone spends an hour.",
      },
      {
        title: "“It's not working” isn't a brief",
        body: "Category, photos and access — gathered up front.",
      },
      {
        title: "Quote sent, no owner",
        body: "Followed up by status. Stopped the moment it's answered.",
      },
    ],
  },
  journey: {
    heading: "Missed call to *complete brief*",
    lead: "The customer gets a clear next step. The office gets everything it needs. No van shows up to a mystery.",
    stages: [
      {
        title: "Call captured",
        body: "Acknowledged instantly, day or night, through an approved channel.",
      },
      {
        title: "Service area checked",
        body: "Zip or postcode rules run first; out-of-area work closes politely.",
      },
      {
        title: "Urgency identified",
        body: "Routine, urgent or safety-critical, sorted by your approved rules.",
      },
      {
        title: "Evidence gathered",
        body: "Description, photos and access: the difference between a visit and a wasted trip.",
      },
      {
        title: "You commit",
        body: "A callback or visit window offered. Price and attendance confirmed only by you.",
      },
    ],
  },
  workflows: {
    heading: "From quote to *cash, without the chasing*",
    lead: "Updates fire from real job status, never an invented arrival time.",
    items: [
      {
        title: "Quote follow-up",
        body: "Status-driven messages; a decline stops the sequence instantly.",
      },
      {
        title: "Lost-quote intelligence",
        body: "Price, timing or competitor, recorded rather than messaged harder.",
      },
      {
        title: "ETA and status",
        body: "Sent only from an approved dispatcher or field action.",
      },
      {
        title: "Completion to cash",
        body: "Invoicing and payment reminders trigger automatically on completion.",
      },
    ],
  },
  services: {
    heading: "Built around *your* job-management reality",
    lead: "One journey first, never a grand software replacement.",
    paragraphs: [
      "[Call handling](/services/ai-voice-agents) captures every missed call; [inquiry qualification](/services/ai-receptionists) manages web and messaging; [quote and estimate workflows](/services/ai-automation) connect the job record to calendar and finance, in ServiceTitan, Jobber, Commusoft or whichever platform runs your board.",
      "A [conversion-led home-services build](/services/web-design-development) improves evidence capture at the source; [custom job applications](/services/app-development) suit proven dispatch workflows, with [consulting](/services/ai-consulting) for multi-system estates.",
    ],
  },
  proof: {
    heading: "Response and capacity, *verified*",
    lead: "Verified Silverstone AI delivery results, with technical, pricing and attendance authority always yours.",
    metrics: [
      {
        id: "benchmark-081",
        value: "<10 seconds",
        label: "Response time",
        basis: "after implementation",
      },
      { id: "benchmark-058", value: "+66%", label: "Phone availability" },
      { id: "benchmark-080", value: "15 hours", label: "Saved", basis: "per week" },
      { id: "benchmark-059", value: "£16,800", label: "Cost savings", basis: "annual" },
    ],
    attribution: INDUSTRY_ATTRIBUTION,
    clarification: INDUSTRY_CLARIFICATION,
  },
  boundary: {
    heading: "Safety and price *stay yours*",
    body: "The system prepares location, evidence and reminders. **You commit safety, price and attendance.** Emergency language always triggers your defined response; this is never a substitute for a competent tradesperson or licensed contractor.",
    keeps: [
      "Technical diagnosis & safety advice",
      "Binding prices, estimates & fixed quotes",
      "Attendance & dispatch decisions",
      "Complaints & disputed work",
      "Emergency response, your policy, always",
    ],
  },
  process: {
    heading: "How it gets *built around you*",
    lead: "Mapped against your real calls and quotes, with a clear reason not to automate if the evidence says so.",
    steps: [
      {
        title: "Map the sources",
        body: "Calls, forms and referrals, at real volumes.",
      },
      {
        title: "Define the rules",
        body: "Service area, job types, boundaries, made explicit.",
      },
      {
        title: "Identify truth",
        body: "Leads, jobs, calendar and quotes, from one source.",
      },
      { title: "Choose one journey", body: "Missed call to callback, proven first." },
      {
        title: "Test the hard cases",
        body: "Incomplete details, urgency, schedule changes.",
      },
      {
        title: "Launch with override",
        body: "Office visibility, reviewed against results.",
      },
    ],
  },
  fit: {
    heading: "Is this *your business*?",
    lead: "The work varies; the intake and follow-up are repeatable enough to improve.",
    right: [
      "Repeated inquiry volume",
      "A defined service area",
      "A person owning dispatch or quoting",
      "Rules you're willing to write down",
    ],
    caution:
      "Not a fit if every price is improvised, nobody owns callbacks, or automation is expected to make technical or safety calls.",
  },
  faqs: {
    heading: "Questions trade businesses ask",
    items: [
      {
        q: "Can it understand urgent jobs?",
        a: "It recognizes approved categories and emergency language and **never diagnoses.** Uncertain cases follow your escalation policy.",
      },
      {
        q: "Can it give prices?",
        a: "It explains the quoting process or uses approved fixed-price rules. Complex work stays with your estimator.",
      },
      {
        q: "Can it check our service area?",
        a: "Yes, by zip code or postcode, when your rules are defined. Borderline cases route for review.",
      },
      {
        q: "Will it book technicians or engineers directly?",
        a: "Only where your calendar and authority support it. Most firms confirm attendance first.",
      },
      {
        q: "Does it work with ServiceTitan, Housecall Pro, Jobber or Commusoft?",
        a: "Yes, wherever the platform offers an API or an approved integration. Jobs, customer records and callbacks are written to the field-service system you already run, and access is confirmed during discovery before anything is promised.",
      },
      {
        q: "Can it chase quotes and invoices?",
        a: "Yes, on approved timing and stop conditions. Disputes always reach a person.",
      },
    ],
  },
  midCta: {
    heading: "Map *your* quote follow-up",
    body: "Bring one inquiry that took several callbacks to understand. We'll map the gaps, live.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "From ring *to revenue*",
    body: "One call examines a real journey, whether a missed call, a quote or scheduling, and whether better capture creates more workable jobs. See [how we deliver](/how-we-work) and [how scope shapes pricing](/pricing).",
    reassurance:
      "No automatic diagnosis · no unconfirmed attendance · no generic replacement assumption.",
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
