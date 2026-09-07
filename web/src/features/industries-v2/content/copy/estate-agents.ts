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
  h1: "AI automation for estate agents and *real estate brokerages*",
  deck: "Turn property inquiries into conversations your agents own.",
  heroSub:
    "Every unanswered portal lead is a fee or a commission for a rival agency or brokerage. Silverstone AI answers in **seconds**, so your negotiators and agents get a live conversation, not a queue.",
  heroPoints: [
    "Portal, phone and web, one intelligent intake",
    "Viewings and showings offered from your live calendar",
    "Valuations, pricing and negotiation stay with your people",
  ],
  trustTokens: [
    "Portal-aware",
    "Calendar-controlled",
    "CRM-owned",
    "Consent-aware",
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
          "Brokerages, teams, Realtors and independent agents, across residential sales and property management.",
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
    heading: "Why do agencies and brokerages *lose* listings and instructions?",
    body: "Estate agents and real estate brokerages lose listings and instructions to response time. A seller requests a valuation, a buyer opens three listings, a landlord calls mid-viewing — and by the time the inbox is read, **the instruction, or the listing, belongs to a rival brokerage.** Speed alone doesn't fix it: speed without ownership is a faster dead end.",
    cards: [
      {
        title: "Fast reply, no owner",
        body: "An acknowledgment is worthless until a negotiator or agent owns the next step.",
      },
      {
        title: "Three inboxes, one buyer",
        body: "Phone, portal and web collapse into a single record.",
      },
      {
        title: "Calendar promises, calendar truth",
        body: "Only real viewing and showing availability is ever offered. No ghost slots.",
      },
      {
        title: "Valuation and listing requests buried in noise",
        body: "High-intent seller leads — valuations in the UK, listing appointments in the US — get their own priority route.",
      },
    ],
  },
  journey: {
    heading: "What happens when a *Zillow or Rightmove* lead arrives?",
    lead: "Within seconds, Silverstone AI reads the inquiry, identifies the property and the intent — viewing, showing, valuation or listing appointment — writes one duplicate-checked record to your CRM with a named owner, and offers only real calendar availability. Every lead answers three questions: what they want, which system holds the truth, who owns the next move.",
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
        body: "Confirmations, reminders and feedback fire from real status changes — inside captured consent, with opt-outs honored the moment they arrive and quiet-hours rules applied to US calls and texts.",
      },
      {
        title: "Escalate judgment",
        body: "Valuations, pricing, negotiation and complaints reach your people immediately, with full context attached.",
      },
    ],
  },
  workflows: {
    heading: "How does it fit sales, lettings and *property management*?",
    lead: "Sales, lettings and property management don't share a script, so they don't share a workflow. A buyer inquiry, an applicant or renter request, and a landlord maintenance call each get their own qualification path, their own routing rules and their own escalation point — inside one system and one CRM record.",
    items: [
      {
        title: "Sales",
        body: "Buyer position, viewing and showing preferences and valuation or listing requests routed to the right negotiator or agent, **while interest is hot**.",
      },
      {
        title: "Lettings and rentals",
        body: "Applicant, renter, tenant and landlord instantly distinguished, qualified without suitability, screening or financial calls.",
      },
      {
        title: "Property management",
        body: "Routine traffic sorted with tenancy and lease context; urgent matters jump the queue to your letting agent or property manager.",
      },
      {
        title: "Multi-office",
        body: "Postcode, ZIP code and territory rules applied consistently across branches and offices, with stalled inquiries visible **before they become lost fees or commissions**.",
      },
    ],
  },
  services: {
    heading: "The architecture behind the switchboard",
    lead: "Assembled around your CRM and calendar, never a pre-packaged stack.",
    paragraphs: [
      "[AI reception for property inquiries](/services/ai-receptionists), [voice handling for missed calls](/services/ai-voice-agents) and [connected automation workflows](/services/ai-automation) work as one system around your CRM, whether that is Reapit, Alto, Follow Up Boss or kvCORE.",
      "Outbound follow-up is built around permission, not volume: consent is captured and time-stamped at the point of inquiry, opt-out and STOP requests are honored the moment they arrive, automated calls and texts to US numbers are held inside TCPA quiet-hours windows, and automated email carries an accurate sender header, a real postal address and an unsubscribe that works first click. **Your counsel sets the rules; we build the workflow to them.**",
      "Where your website leaks demand, a [conversion-led agency web build](/services/web-design-development) closes the gap, with [AI consulting](/services/ai-consulting) shaping the architecture first.",
    ],
  },
  proof: {
    heading: "Measured where *fees and commissions* are won",
    lead: "Verified Silverstone AI delivery results for estate agency and brokerage inquiry systems.",
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
      "Valuations, pricing and CMAs",
      "Negotiation and offers",
      "Complaints and disputes",
      "Material information and disclosures",
      "Every judgment call",
    ],
  },
  process: {
    heading: "How fast can an agency or brokerage go *live*?",
    lead: "Agencies and brokerages go live in weeks, not quarters. We map your demand and channels, agree who owns the CRM, calendar and each branch or office, build one journey end to end — portal lead to booked viewing or showing — then test the edges before launch and improve on measured evidence.",
    steps: [
      { title: "Map demand", body: "Channels, volumes, peaks, failure points." },
      {
        title: "Define authority",
        body: "CRM, calendar, branch and office ownership rules.",
      },
      { title: "Build journey one", body: "Portal lead → booked viewing or showing." },
      {
        title: "Test the edges",
        body: "Duplicates, dead slots, out-of-hours, opt-outs.",
      },
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
      "Leadership that sets office and contact rules",
      "Staff re-keying the same data",
    ],
    caution:
      "Not a fit if there's no source of truth, no exception owner, or an expectation that automation should value property or negotiate.",
  },
  faqs: {
    heading: "Questions agency and brokerage leaders ask",
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
        a: "Yes, where your calendar and rules allow it, including ShowingTime and MLS showing calendars. Otherwise it prepares a confirmed slot for office sign-off.",
      },
      {
        q: "How is calling and texting US leads designed?",
        a: "Around consent and timing, not volume. Consent is captured and time-stamped at the point of inquiry, opt-out and STOP requests are honored the moment they arrive and written back to your CRM, and automated calls and texts to US numbers are held inside TCPA quiet-hours windows. Automated email is designed the same way, around what CAN-SPAM turns on: an accurate sender header, a real postal address and an unsubscribe that works first click. **Your counsel sets the rules; we build the workflow to them.**",
      },
      {
        q: "Can you support a US brokerage from London?",
        a: "Yes. Delivery is remote and the systems are cloud-hosted, so the build is the same whether your offices are in Austin, Denver or Manchester. Discovery and launch checkpoints are scheduled in your time zone, and the automations run on your local business hours and your states' contact windows, not ours.",
      },
      {
        q: "Is pricing quoted in dollars or pounds?",
        a: "Both. US brokerages and teams are quoted in US dollars, UK agencies in pounds sterling, against the same published bands. Scope sets the number: how many channels feed the system, how many CRMs and calendars it writes to, and how many branches or offices share the rules. The pricing page sets out the bands before you speak to anyone.",
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
    heading: "Your next instruction or listing is *already inquiring*",
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
