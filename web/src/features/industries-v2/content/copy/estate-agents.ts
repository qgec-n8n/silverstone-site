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
  mobile: {
    tagline: "Portal leads answered *before your rivals*",
    points: [
      "Portal, phone and web",
      "Viewings and showings",
      "Valuations stay with you",
    ],
  },
  trustTokens: [
    "Portal-aware",
    "Fair Housing-aware",
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
        rulebook: "Fair Housing Act, MLS and IDX rules, TCPA quiet hours.",
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
        rulebook: "Equality Act, material information, PECR consent rules.",
      },
    ],
    shared: [
      "A portal lead is answered in under ten seconds, day or night, in your agency's voice.",
      "Every inquiry is written to your CRM once, duplicate-checked, with a named owner.",
      "Only real calendar availability is ever offered, for a viewing or a showing.",
    ],
  },
  /*
   * The named rulebook for this sector, stated on the page rather than buried
   * in a FAQ, because "does your AI break fair housing law?" is the first
   * question a US broker asks and the one that kills the deal if it is only
   * answered on a call.
   *
   * WORDING CONTRACT — every sentence below is a *structural* claim (how the
   * system is built and configured), never a legal status. No "complies with",
   * "guarantees", "certified" or "approved": compliance depends on the
   * brokerage's own configuration, staff and jurisdiction, and liability does
   * not transfer to a vendor. The FTC's Operation AI Comply sweep (25 Sept
   * 2024) makes an absolute claim a deception risk in its own right.
   *
   * Anchored on primary law, deliberately not on agency guidance, because two
   * of the obvious anchors are gone:
   *   - HUD's 2024 guidance on AI in housing advertising was WITHDRAWN
   *     effective 17 September 2025, so "built to HUD's AI guidance" would be
   *     false. Cite 42 U.S.C. § 3604 and 24 C.F.R. §§ 100.70 / 100.75 instead.
   *   - NTSELAT's Material Information Parts A/B/C were WITHDRAWN in May 2025
   *     when the DMCC Act 2024 repealed the CPRs. The duty survives, the
   *     branded framework does not, so the copy says "material information"
   *     and attributes it to the DMCC Act — never "NTSELAT Parts A/B/C".
   * Also avoided: naming the seven federal classes "including sexual
   * orientation and gender identity" (HUD's EO 13988 memo was withdrawn
   * 17 September 2025) — the copy adds "whatever your state, city or board
   * protects" instead, which is true everywhere and survives the churn.
   *
   * Full sourcing: scratchpad/research/fair-housing-mls.md.
   */
  compliance: {
    eyebrow: "Fair housing and MLS rules",
    heading: "Built inside *the rules of your market*",
    lead: "Fair housing and MLS rules are not a disclaimer at the bottom of this page. They are the constraints the intake, the follow-up and the scheduling are designed around, in each market's own terms.",
    points: [
      {
        market: "US",
        title: "Fair Housing Act",
        lede: "Protected classes are never asked, stored or ranked on.",
        body: "The intake is configured so it never asks about race, color, religion, sex, national origin, familial status or disability, and never stores, routes or ranks on them, or on stand-ins like ZIP code. Qualification runs on budget, timing, location, property type and financing readiness: **criteria you set, see and can change.** Neighborhood-character and school questions are handed to a licensed agent rather than answered, accommodation requests reach a person immediately, and whatever additional classes your state, city or board protects are added to the same list.",
        source: "42 U.S.C. § 3604 · 24 C.F.R. §§ 100.70, 100.75 · NAR SoP 10-3",
      },
      {
        market: "US",
        title: "MLS and IDX rules",
        lede: "Listing data moves only under your own participant agreement.",
        body: "Listing data is read and displayed only under your brokerage's own MLS participant agreement and IDX rules: listing-broker attribution carried, the feed refreshed on the MLS's cadence, seller opt-out and delayed-marketing flags honored, and nothing repurposed into a separate index, valuation or training set. Listing copy is drafted from the facts in your own feed and approved by a licensed agent before it goes out. **Buyer-broker compensation is never quoted or estimated from MLS data**, and a tour is booked only once the written buyer agreement is in place, or handed to the agent to complete first.",
        source: "NAR IDX Policy 7.58 · NAR practice changes, 17 August 2024",
      },
      {
        market: "UK",
        title: "Equality Act, material information and marketing rules",
        lede: "The same never-ask rule, plus the disclosures UK law requires.",
        body: "The same never-ask, never-route rule runs on the nine protected characteristics, and in England on whether an applicant has children or receives benefits, with lettings follow-up configured never to invite or encourage an offer above the advertised rent. The system prompts for the material information the agent has to disclose and records that it was captured. Marketing runs on consent or the soft opt-in, with TPS and CTPS screening, an opt-out in every message, and automated voice calls held to the higher consent bar they require.",
        source:
          "Equality Act 2010, Part 4 · Renters' Rights Act 2025 (England) · DMCC Act 2024 · PECR reg. 19–22",
      },
      {
        market: "Both",
        title: "What stays with a licensed person",
        lede: "The system captures and routes; a licensed person decides.",
        body: "Valuations, pricing opinions, negotiation, offers and disclosures stay with a licensed agent or negotiator: the system captures and routes, it does not advise. Offers and inquiries are passed on promptly, in writing and in full, **never filtered, ranked or delayed.** Every conversation opens by saying it is an AI assistant, calls and messages stay inside the strictest contact window that applies where the recipient is, and an opt-out is honored the first time it arrives.",
        source:
          "Estate Agents (Undesirable Practices) (No. 2) Order 1991, Sch. 3 · 47 C.F.R. § 64.1200",
      },
    ],
    glance: [
      "Never asks about protected classes",
      "Listing data only under your MLS agreement",
      "Offers and pricing stay with a licensed agent",
    ],
    note: "These systems are designed and configured to operate inside these rules. That is not legal advice and it does not replace your brokerage's or agency's own compliance obligations: **you set the criteria and stay responsible for the decisions; we build the system so those criteria are the only thing it acts on, and so you can audit what it did.**",
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
      "Fair-housing and accommodation questions",
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
        // Feeds the FAQPage graph verbatim, so this answer stays a structural
        // claim: designed and configured, never "compliant" or "guaranteed".
        q: "Do the systems respect fair-housing law and MLS rules?",
        a: "They're designed to. The intake is configured so it never asks about, stores or routes on the federally protected classes or their UK equivalents, neighborhood-character questions go to a licensed agent instead of an answer, and listing data is read and displayed only under your brokerage's own MLS participant agreement and IDX rules. That is a design constraint, not a legal guarantee: you set the criteria and stay responsible for the decisions, and your counsel or compliance lead signs off the rules before anything goes live.",
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
