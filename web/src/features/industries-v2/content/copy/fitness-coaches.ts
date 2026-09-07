import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const fitnessCoachesCopy: IndustryCopy = {
  route: "/industry/fitness-coaches",
  sector: "Fitness coaches",
  routeEntry: {
    loaderText: "Preparing the coaching funnel",
    pill: "Lead-to-client operating system",
    title: "Keep the service personal. Make the journey disciplined.",
    subtitle:
      "Connect social leads, consultation booking, onboarding and follow-up so the coach enters each conversation with context.",
    buttonLabel: "Explore the coaching journey",
  },
  seo: {
    title: "Automation for Online Fitness Coaches | Silverstone AI",
    description:
      "Move website and social leads into qualified consultations, onboarding and follow-up with fitness-coach automation that preserves personal coaching judgment.",
    h1: "Move more of the right leads from message to consultation",
  },
  eyebrow: "Automation for online coaches",
  h1: "Automation for online fitness coaches with *zero lost DMs*",
  heroSub:
    "A story reply dies between sessions. Silverstone AI qualifies every inquiry **instantly**, so you walk into consultations with context, not a cold open. For online coaches and personal trainers, US and UK.",
  heroPoints: [
    "Every DM qualified, transparently, in seconds",
    "Consultations booked from real calendar capacity",
    "Health and program decisions, always yours",
  ],
  trustTokens: [
    "Transparent qualification",
    "Consent-aware follow-up",
    "Coach-owned judgment",
  ],
  markets: {
    eyebrow: "Built for your market",
    heading: "Same cold DM. *Your* coaching platform.",
    lead: "A story reply in Austin and one in Leeds go cold the same way, three questions in. The journey is identical; the coaching platform and what you call the first call change.",
    lanes: [
      {
        market: "US",
        label: "United States",
        operators:
          "Online coaches and personal trainers selling programs through Instagram, TikTok and their own site.",
        tooling: [
          "Trainerize, TrueCoach or Kajabi",
          "Calendly or Acuity for discovery calls",
          "Stripe, ManyChat and your CRM",
        ],
        vocabulary:
          "Discovery calls, high-ticket programs, DM setters, check-ins, macros.",
        keepsHuman:
          "Health screening, injury advice, program fit and every outcome promise.",
      },
      {
        market: "UK",
        label: "United Kingdom",
        operators:
          "Online coaches and PTs selling coaching through Instagram, TikTok and their own site.",
        tooling: [
          "Trainerize, TrueCoach or PT Distinction",
          "Calendly or Acuity for consultation calls",
          "Stripe, GoCardless, ManyChat and your CRM",
        ],
        vocabulary:
          "Consultation calls, coaching packages, DM setters, check-ins, PAR-Q.",
        keepsHuman:
          "Health screening, injury advice, program fit and every outcome promise.",
      },
    ],
    shared: [
      "Every DM is qualified transparently in seconds, with the minimum context and no hidden score.",
      "Consultations are offered from real calendar capacity and your booking rules, never phantom slots.",
      "Onboarding, check-ins and nurture fire on recorded consent, honor an opt-out at once and hold to sensible hours in the client's own time zone; the coach interprets progress and decides every change.",
    ],
  },
  problem: {
    heading: "Why do coaching leads *go cold in the DMs*?",
    body: "Because the reply arrives while you are coaching. A prospect asks three questions, waits, and books with someone else. Silverstone AI answers the repeatable commercial part — price framing, fit questions, consultation and discovery-call slots — the moment it lands, for online fitness coaches and personal trainers. **It never touches health, injuries or program fit.**",
    cards: [
      {
        title: "“How much?” with zero context",
        body: "Turned into a clear, transparent next step, instantly.",
      },
      {
        title: "Consultations lost between tools",
        body: "Messages, fit questions and booking status in one record.",
      },
      {
        title: "Onboarding rebuilt every time",
        body: "The agreed steps trigger themselves. You stay the coach.",
      },
      {
        title: "Content competing with delivery",
        body: "Your expertise, reused through a review-controlled system.",
      },
    ],
  },
  journey: {
    heading: "How does an Instagram DM become a *booked discovery call*?",
    lead: "In five steps. The DM or story reply is captured with its channel and a few transparent fit questions, the offer and its limits are stated plainly, a real slot is offered from your own calendar, both sides arrive prepared, and the outcome is recorded — a discovery call in the US, a consultation in the UK.",
    stages: [
      {
        title: "Context captured",
        body: "Channel and fit questions: transparent, brief, never a hidden score.",
      },
      {
        title: "Offer clarified",
        body: "Who it's for and what's not promised, stated up front.",
      },
      {
        title: "Slot offered",
        body: "Real calendar capacity, your booking rules. No phantom availability.",
      },
      {
        title: "Both sides prepared",
        body: "Approved info for the prospect, a concise brief for you.",
      },
      {
        title: "Outcome recorded",
        body: "Booked, rescheduled or not-ready; onboarding fires the moment they say yes.",
      },
    ],
  },
  workflows: {
    heading: "Can follow-up run itself *without spamming clients*?",
    lead: "Yes — if consent decides every send. Silverstone AI records where a client opted in, honors an opt-out the moment it arrives, and keeps automated SMS to US numbers inside local daytime hours, the design TCPA asks for. Automated email is shaped the same way against CAN-SPAM: accurate sender details, a real postal address, a working unsubscribe.",
    items: [
      {
        title: "Onboarding sequences",
        body: "Welcome material and payment reminders fire without chasing.",
      },
      {
        title: "Check-in collection",
        body: "Prompted and organized; **you interpret progress, always.**",
      },
      {
        title: "Nurture & reactivation",
        body: "Not-ready prospects get a resource, not a sales blitz.",
      },
      {
        title: "Stage visibility",
        body: "Every lead, consultation and onboarding stage in one view.",
      },
    ],
  },
  services: {
    heading: "One source of truth, *every message*",
    lead: "Nothing you send contradicts what you offer.",
    paragraphs: [
      "An [AI receptionist](/services/ai-receptionists) organizes inquiries; [consultation-booking workflows](/services/ai-automation) connect Calendly or Acuity, your forms, Stripe and your coaching platform.",
      "A [governed content system](/services/content-creation) turns your expertise into on-brand material; a [conversion-led website](/services/web-design-development) makes the offer clear before the first message.",
    ],
  },
  proof: {
    heading: "Campaign performance, *verified*",
    lead: "Verified Silverstone AI campaign delivery results for coaching audiences.",
    metrics: [
      { id: "benchmark-100", value: "1.84%", label: "Best CTR" },
      { id: "benchmark-101", value: "£0.49", label: "Best CPC" },
      { id: "benchmark-102", value: "1,679", label: "Reached" },
      {
        id: "benchmark-103",
        value: "6 @ £22.15",
        label: "Registrations",
        basis: "per campaign",
      },
    ],
    attribution: INDUSTRY_ATTRIBUTION,
    clarification: INDUSTRY_CLARIFICATION,
  },
  boundary: {
    heading: "Which decisions stay *with the coach*?",
    body: "Every clinical and coaching one. The system handles calendar, forms, payments and content, and stops where clinical information begins. **You decide health, suitability and program fit, every time.** A PAR-Q or health disclosure never feeds an automated sales decision, in the US or the UK.",
    keeps: [
      "Health assessment & injury advice",
      "Program fit & coaching judgment",
      "Check-in interpretation",
      "Healthcare referral decisions",
      "Every outcome promise, none automated",
    ],
  },
  process: {
    heading: "Built at *your* point of friction",
    lead: "The smallest useful system first, never the longest feature list.",
    steps: [
      { title: "Map lead sources", body: "Social, web and referral, at real volumes." },
      {
        title: "Define the offer",
        body: "Eligibility and no-fit routes, stated plainly.",
      },
      { title: "Choose authority", body: "The record and calendar everything obeys." },
      { title: "Write the questions", body: "Transparent, in your own voice." },
      { title: "Connect one journey", body: "DM to consultation, tested first." },
      {
        title: "Measure, then extend",
        body: "Content and retention follow the evidence.",
      },
    ],
  },
  fit: {
    heading: "Is this *your business*?",
    lead: "It fits online fitness coaches and personal trainers who already take more inquiries than they can answer between sessions, sell a defined program rather than bespoke one-offs, and are willing to write down who it is not for. A US coach on Trainerize and a UK PT on PT Distinction qualify the same way.",
    right: [
      "A defined offer, repeated lead volume",
      "Real consultation capacity worth protecting",
      "Willing to write down fit and no-fit",
      "Admin stealing hours from delivery",
    ],
    caution:
      "Not a fit if health and suitability decisions are expected to be automated, or every lead needs an unstructured personal reply first.",
  },
  faqs: {
    heading: "Questions coaches ask",
    items: [
      {
        q: "Will qualification put off good leads?",
        a: "Only if it's long or opaque. We use the minimum useful context and explain exactly why it's asked.",
      },
      {
        q: "Can it manage Instagram DMs?",
        a: "Depending on platform permissions, yes, through Meta's approved messaging tools such as ManyChat. We never pretend every channel supports unrestricted automation.",
      },
      {
        q: "Can it run client check-ins?",
        a: "It prompts and organizes. **You interpret progress and decide what changes, always.**",
      },
      {
        q: "Will it feel less personal?",
        a: "The opposite. Better context, less admin, and the system never pretends to be you.",
      },
      {
        q: "Can it reactivate old leads?",
        a: "Yes: consent-aware, with suppression and easy opt-out.",
      },
      {
        q: "How do you handle consent, quiet hours and opt-outs for US clients?",
        a: "Consent is captured where the conversation starts — the DM, the form, the checkout — and travels with the record, so no message goes out without a permission behind it. Automated SMS to US numbers is designed around TCPA: recorded consent, an instant stop the moment someone opts out, and sending only inside daytime hours in the recipient's own zone. Commercial email is built the same way against CAN-SPAM, with a truthful sender and subject line, a real postal address in the footer and an unsubscribe that actually works. **We design to that shape; your own legal advisor approves the live message set.**",
      },
      {
        q: "Does the system handle client health information?",
        a: "Not clinical detail. These are non-clinical workflows: inquiries, fit questions, consultation and discovery-call booking, payment admin and check-in prompts. A PAR-Q or intake form is stored for you to read, never interpreted. Injuries, medications, pregnancy, disordered-eating concerns and program suitability route to you, and the system answers none of them.",
      },
      {
        q: "Can it work with US clients while I coach from another time zone?",
        a: "Yes. Slots are offered in the prospect's local time from your real calendar, so nobody books a 3am call by accident, and your own working hours stay the limit on what can ever be offered. Follow-up is timed against the client's zone, not yours. A coach in London selling into Chicago and Austin runs one funnel rather than three.",
      },
      {
        q: "What does this cost in US dollars?",
        a: "Scope decides it. Every band on our pricing page is published in US dollars as well as pounds, so a US coach and a UK coach are quoted from the same table rather than a converted guess. Most coaching builds start as one journey — DM to booked consultation — and the discovery call scopes that journey before any number is put to it.",
      },
    ],
  },
  midCta: {
    heading: "Map *your* lead journey",
    body: "Bring one thread that needed too much chasing. We'll show you where it broke, live.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "From interest to consultation, *reliably*",
    body: "One call examines your real channels, questions and handoffs, then designs a disciplined journey around your personal coaching relationship. See [how we deliver](/how-we-work) and [how scope shapes pricing](/pricing).",
    reassurance: "No body-outcome claims · no automated health assessment · ever.",
    buttonLabel: "Book a discovery call",
  },
  related: [
    {
      href: "/services/ai-receptionists",
      label: "Related service",
      title: "AI Receptionists",
    },
    {
      href: "/services/content-creation",
      label: "Related service",
      title: "Content Creation",
    },
    { href: "/industry", label: "Industries", title: "All industries" },
  ],
};
