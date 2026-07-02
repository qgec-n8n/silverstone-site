import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const fitnessCoachesCopy: IndustryCopy = {
  route: "/industry/fitness-coaches",
  sector: "Fitness coaches",
  routeEntry: {
    loaderText: "Converting scattered interest into an owned coaching conversation.",
    pill: "Lead-to-client operating system",
    title: "Keep the service personal. Make the journey disciplined.",
    subtitle:
      "Connect social leads, consultation booking, onboarding and follow-up so the coach enters each conversation with context.",
    buttonLabel: "Explore the coaching journey",
  },
  seo: {
    title: "Automation for Online Fitness Coaches UK | Silverstone",
    description:
      "Move website and social leads into qualified consultations, onboarding and follow-up with fitness-coach automation that preserves personal coaching judgement.",
    h1: "Move more of the right leads from message to consultation",
  },
  eyebrow: "Automation for online coaches",
  h1: "More consultations. *Zero lost DMs.*",
  heroSub:
    "A story reply dies between sessions. Silverstone qualifies every enquiry **instantly** — you walk into consultations with context, not a cold open.",
  heroPoints: [
    "Every DM qualified, transparently, in seconds",
    "Consultations booked from real calendar capacity",
    "Health and programme decisions — always yours",
  ],
  trustTokens: [
    "Transparent qualification",
    "Consent-aware follow-up",
    "Coach-owned judgement",
  ],
  problem: {
    heading: "The business breaks *between conversations*",
    body: "Three questions in, the thread goes cold — and the client books with someone else. Silverstone handles the repeatable commercial work. **It never touches health, injuries or programme fit.**",
    cards: [
      {
        title: "“How much?” with zero context",
        body: "Turned into a clear, transparent next step — instantly.",
      },
      {
        title: "Consultations lost between tools",
        body: "Messages, fit questions and booking status — one record.",
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
    heading: "From DM to *booked consultation*",
    lead: "Never reconstruct a conversation again — the full context is waiting when you sit down.",
    stages: [
      {
        title: "Context captured",
        body: "Channel and fit questions — transparent, brief, never a hidden score.",
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
        body: "Booked, rescheduled or not-ready — onboarding fires the moment they say yes.",
      },
    ],
  },
  workflows: {
    heading: "Automation *behind* the personal service",
    lead: "Every client-facing step protects the relationship — never dilutes it.",
    items: [
      {
        title: "Onboarding sequences",
        body: "Welcome material and payment reminders fire without chasing.",
      },
      {
        title: "Check-in collection",
        body: "Prompted and organised — **you interpret progress, always.**",
      },
      {
        title: "Nurture & reactivation",
        body: "Not-ready prospects get a resource, not a sales blitz.",
      },
      {
        title: "Stage visibility",
        body: "Every lead, consultation and onboarding stage — in one view.",
      },
    ],
  },
  services: {
    heading: "One source of truth, *every message*",
    lead: "Nothing you send contradicts what you offer.",
    paragraphs: [
      "An [AI receptionist](/services/ai-receptionists) organises enquiries; [consultation-booking workflows](/services/ai-automation) connect calendar, forms and payments.",
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
    heading: "Health decisions stay *entirely yours*",
    body: "The system handles calendar, forms and content. **You decide health, suitability and programme fit — every time.** Sensitive disclosures never touch an automated sales decision.",
    keeps: [
      "Health assessment & injury advice",
      "Programme fit & coaching judgement",
      "Check-in interpretation",
      "Healthcare referral decisions",
      "Every outcome promise — none automated",
    ],
  },
  process: {
    heading: "Built at *your* point of friction",
    lead: "The smallest useful system first — never the longest feature list.",
    steps: [
      { title: "Map lead sources", body: "Social, web and referral — real volumes." },
      {
        title: "Define the offer",
        body: "Eligibility and no-fit routes, stated plainly.",
      },
      { title: "Choose authority", body: "The record and calendar everything obeys." },
      { title: "Write the questions", body: "Transparent, in your own voice." },
      { title: "Connect one journey", body: "DM to consultation — tested first." },
      {
        title: "Measure, then extend",
        body: "Content and retention follow the evidence.",
      },
    ],
  },
  fit: {
    heading: "Is this *your business*?",
    lead: "Best suited to coaches with a clear offer and the will to define who it's for.",
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
        a: "Depending on platform permissions, yes — we never pretend every channel supports unrestricted automation.",
      },
      {
        q: "Can it run client check-ins?",
        a: "It prompts and organises. **You interpret progress and decide what changes — always.**",
      },
      {
        q: "Will it feel less personal?",
        a: "The opposite. Better context, less admin — the system never pretends to be you.",
      },
      {
        q: "Can it reactivate old leads?",
        a: "Yes — lawful, consent-aware, with suppression and easy opt-out.",
      },
    ],
  },
  midCta: {
    heading: "Map *your* lead journey",
    body: "Bring one thread that needed too much chasing. We'll show you where it broke — live.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "From interest to consultation, *reliably*",
    body: "One call examines your real channels, questions and handoffs — then designs a disciplined journey around your personal coaching relationship. See [how we deliver](/how-we-work) and [how scope shapes pricing](/pricing).",
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
