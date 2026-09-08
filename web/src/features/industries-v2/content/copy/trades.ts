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
    pill: "Trades & contractor AI · calls to booked jobs",
    title: "AI call answering for trades, contractors and home services",
    subtitle:
      "AI automation for trades and contractors: job context captured, location and urgency qualified, callbacks coordinated and quotes kept moving without promising what the field team has not confirmed.",
    buttonLabel: "Explore the job journey",
  },
  seo: {
    title: "AI Automation for Trades, Contractors and Home Services | Silverstone AI",
    description:
      "Capture missed calls, qualify jobs, check service areas, coordinate callbacks, follow up quotes and connect office-to-field workflows with trades automation.",
    h1: "Capture the job properly before the opportunity goes cold",
  },
  eyebrow: "Automation for trades and contractors",
  h1: "An AI receptionist for trades and *home services contractors*",
  deck: "Win the job before the callback ever happens.",
  heroSub:
    "You're mid-job when the phone rings, valuable work you can't answer. Silverstone AI captures it **instantly** into a complete, workable brief, whether you run two vans out of Leeds or fifteen trucks out of Dallas.",
  heroPoints: [
    "Missed calls recovered while demand is hot",
    "Service-area rules applied at intake, live",
    "Price and attendance — your call, always",
  ],
  mobile: {
    tagline: "Every missed call becomes a *workable job brief*",
    points: [
      "Missed calls recovered",
      "Service-area rules applied",
      "Price stays your call",
    ],
  },
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
        vocabulary: "Call-outs, quotes, job sheets, engineers, your patch by postcode.",
        keepsHuman:
          "Diagnosis, fixed quotes, attendance decisions and emergency response.",
      },
    ],
    shared: [
      "A missed call is captured and qualified within seconds, day or night, on a channel the caller agreed to.",
      "Service-area and urgency rules run before anyone spends an hour on the road.",
      "The job record, calendar and follow-up are written once, in the system you already run.",
    ],
  },
  problem: {
    heading: "Why do plumbing and HVAC contractors *lose jobs to missed calls*?",
    body: "A missed call goes to whoever answers next, and by the callback the customer has already booked someone else — or the office still doesn't have enough to price the job. Plumbing, electrical and HVAC work is won in the first few minutes. **The goal isn't answering every call. It's turning genuine demand into workable jobs.**",
    cards: [
      {
        title: "Missed call, missed job",
        body: "Recovered while the need is still current.",
      },
      {
        title: "Out of area, wasted trip",
        body: "Zip or postcode service-area rules run before anyone drives an hour.",
      },
      {
        title: "“It's not working” isn't a brief",
        body: "Category, photos and access — gathered up front.",
      },
      {
        title: "Quote sent, no owner",
        body: "Estimates followed up by status. Stopped the moment it's answered.",
      },
    ],
  },
  journey: {
    heading: "How does a missed call become *a booked job*?",
    lead: "Silverstone AI acknowledges the missed call within seconds, checks the zip code or postcode against your service area, sorts urgency by your approved rules, then gathers description, photos and access. The customer gets a clear next step and the office gets a workable brief, so no truck or van rolls out to a mystery.",
    stages: [
      {
        title: "Call captured",
        body: "Acknowledged in seconds, day or night, on a channel the caller agreed to.",
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
        body: "A callback or visit window offered. Price, estimate and attendance confirmed only by you.",
      },
    ],
  },
  workflows: {
    heading: "What happens after *the estimate goes out*?",
    lead: "Silverstone AI follows the quote or estimate by its real status, never a guess: reminders fire from your job-management system, a decline or an opt-out stops the sequence instantly, and messages hold to time-of-day rules in the customer's own time zone. On completion, invoicing and payment reminders trigger themselves.",
    items: [
      {
        title: "Quote and estimate follow-up",
        body: "Status-driven messages on the channel the customer agreed to; a decline or a STOP ends the sequence instantly.",
      },
      {
        title: "Lost-quote intelligence",
        body: "Price, timing or competitor, recorded rather than messaged harder.",
      },
      {
        title: "ETA and status",
        body: "Sent only from an approved dispatcher or field action, never an invented arrival time.",
      },
      {
        title: "Completion to cash",
        body: "Invoicing and payment reminders trigger on completion, from a real sender the customer can reply to.",
      },
    ],
  },
  services: {
    heading: "Built around *your* job-management reality",
    lead: "One journey first, never a grand software replacement.",
    paragraphs: [
      "[Call handling](/services/ai-voice-agents) captures every missed call; [inquiry qualification](/services/ai-receptionists) manages web and messaging; [quote and estimate workflows](/services/ai-automation) connect the job record to calendar and finance, in ServiceTitan, Housecall Pro, Jobber, Commusoft or whichever platform runs your board.",
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
    heading: "Will it quote a price or *make a safety call*?",
    body: "No. Silverstone AI prepares location, evidence, callbacks and reminders for trades and home services contractors; **you commit safety, price and attendance.** Emergency language always triggers your defined response, and nothing is diagnosed or priced on your behalf. This is never a substitute for a competent tradesperson, a licensed contractor or an on-site inspection.",
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
    lead: "Mapped against your real calls, quotes and estimates, with a clear reason not to automate if the evidence says so.",
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
    heading: "Is this right for *your trade or contracting business*?",
    lead: "Silverstone AI fits trades, contractors and home services businesses with repeat inquiry volume, a defined service area or patch, and one person who owns dispatch, quoting or estimating. The work itself varies job to job; the intake and follow-up around it repeat often enough to measure, write down and improve.",
    right: [
      "Repeated inquiry and service-call volume",
      "A defined service area or patch",
      "A person owning dispatch, quoting or estimating",
      "Rules you're willing to write down",
    ],
    caution:
      "Not a fit if every price is improvised, nobody owns callbacks, or automation is expected to make technical or safety calls.",
  },
  faqs: {
    heading: "Questions US and UK trade businesses ask",
    items: [
      {
        q: "Can it handle emergency call-outs and urgent service calls?",
        a: "It recognizes the job categories and emergency language you approve, then follows your escalation policy: a live line, an on-call engineer or tech, or a defined after-hours route. It **never diagnoses**, and anything it is unsure about goes to a person rather than being answered.",
      },
      {
        q: "Can it give prices or estimates?",
        a: "It explains your quoting or estimating process and can use approved fixed-price rules. Complex work stays with your estimator, and no binding number reaches a customer without a person behind it.",
      },
      {
        q: "Can it check our service area?",
        a: "Yes, by zip code or postcode, once your service area, or your patch, is written down as rules. Borderline addresses route to a person for review instead of being promised a visit.",
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
        q: "How does the text and callback follow-up handle US consent rules?",
        a: "Consent is captured at the point of contact and recorded against the number, every message carries a clear opt-out that stops the sequence on the next send, and outbound texts and callbacks hold to time-of-day rules in the customer's own time zone. The workflow is designed around TCPA requirements for US numbers and Information Commissioner's Office guidance on electronic marketing for UK ones. We design the mechanics; your own legal counsel signs off the calling policy before launch.",
      },
      {
        q: "How are the quote and invoice emails set up for US customers?",
        a: "Each automated email is built around the points CAN-SPAM sets for commercial email in the US: an accurate sender name and subject line, your real business postal address in the footer, and a working unsubscribe that is honored on the next send. Transactional job updates and marketing follow-ups sit on separate lists, so an unsubscribe never silences an appointment confirmation or an invoice.",
      },
      {
        q: "Can it cover several time zones and after-hours calls?",
        a: "Yes. Intake runs around the clock and stamps every job in the caller's own time zone, so a late call in Denver and a late call in Leeds each land with the right timestamp, the right service-area rule and the right after-hours route. Callbacks and reminders are then scheduled inside the hours you set for each region.",
      },
      {
        q: "Can it chase estimates, quotes and invoices?",
        a: "Yes, on approved timing and stop conditions. Disputes always reach a person.",
      },
      {
        q: "How is this priced for a US contractor?",
        a: "Scope sets the price, not your zip code: how many journeys are automated, which systems are involved and how much integration work sits behind them. Every published price on the site is shown in both pounds and US dollars, and work is quoted and invoiced in the currency agreed at proposal. There is no obligation to proceed after a discovery call.",
      },
    ],
  },
  midCta: {
    heading: "Map *your* quote follow-up",
    body: "Bring one inquiry or estimate that took several callbacks to pin down. We'll map the gaps, live.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "From ring *to revenue*",
    body: "One call examines a real journey, whether a missed call, an estimate or scheduling, and whether better capture creates more workable jobs. See [how we deliver](/how-we-work) and [how scope shapes pricing](/pricing).",
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
