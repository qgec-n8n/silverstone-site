import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const physiosChiropractorsCopy: IndustryCopy = {
  route: "/industry/physios-chiropractors",
  sector: "Physios, physical therapists & chiropractors",
  routeEntry: {
    loaderText: "Preparing the clinic system",
    pill: "Clinic access with clinical boundaries",
    title: "Reduce reception friction. Keep care human.",
    subtitle:
      "A governed operating layer for inquiries, booking, forms and rebooking—designed to stop before clinical assessment begins.",
    buttonLabel: "Explore the clinic journey",
  },
  seo: {
    title:
      "Physical Therapy, Physio and Chiropractic Practice Automation | Silverstone AI",
    description:
      "Improve new-patient inquiries, booking, reminders, intake and rebooking with non-clinical automation designed for physio and chiropractic practices.",
    h1: "Make the clinic easier to access without automating care",
  },
  eyebrow: "Physio, physical therapy & chiropractic automation",
  h1: "Easier access. *Care stays entirely yours.*",
  heroSub:
    "A question mixing symptoms and availability lands after hours. Silverstone AI handles access and booking **instantly**; clinicians get context, never a diagnosis. Built for physio clinics, physical therapy practices and chiropractors in the US and UK.",
  heroPoints: [
    "Access and booking handled, always",
    "Intake completed before arrival",
    "Symptoms go straight to clinicians",
  ],
  trustTokens: ["Non-clinical", "Privacy-led", "Clinician-owned", "System-accountable"],
  markets: {
    eyebrow: "Built for your market",
    heading: "Same after-hours inquiry. *Your* clinic system.",
    lead: "A PT clinic in Phoenix and a physio clinic in Bristol lose the same after-hours inquiry. The access workflow is identical; the practice-management system and the words for a first visit are what change.",
    lanes: [
      {
        market: "US",
        label: "United States",
        operators:
          "Outpatient physical therapy clinics and chiropractic practices, from a single site to a multi-location group.",
        tooling: [
          "WebPT, Prompt, Jane or Clinicient",
          "Your patient portal and intake forms",
          "Google Business Profile and referral inbound",
        ],
        vocabulary: "New-patient evals, plans of care, visits, co-pays, PTs and DCs.",
        keepsHuman:
          "Evaluation, diagnosis, the plan of care and any advice about symptoms.",
      },
      {
        market: "UK",
        label: "United Kingdom",
        operators:
          "Private physiotherapy and chiropractic clinics, from a sole practitioner to a multi-site group.",
        tooling: [
          "Cliniko, Jane, WriteUpp or TM3",
          "Your online booking page and intake forms",
          "GP, insurer and self-referral routes",
        ],
        vocabulary:
          "Initial assessments, treatment plans, sessions, self-funded and insured patients.",
        keepsHuman:
          "Assessment, diagnosis, the treatment plan and any advice about symptoms.",
      },
    ],
    shared: [
      "Access and booking are handled instantly; anything clinical stops and routes to a clinician with a summary.",
      "Only the minimum administrative information is collected, on the clinic's own systems.",
      "Rebooking and reminders follow the plan the clinician set, never a script that implies need.",
    ],
  },
  problem: {
    heading: "Access breaks *outside the treatment room*",
    body: "Forms arrive incomplete. Rebooking depends on memory. Silverstone AI organizes access, booking, forms and rebooking, **and never diagnoses, assesses urgency or replaces professional judgment.**",
    cards: [
      {
        title: "Practical mixed with symptoms",
        body: "Separated from clinical content, instantly.",
      },
      {
        title: "Booking without context",
        body: "Location and practitioner preference, identified up front.",
      },
      {
        title: "Forms incomplete on arrival",
        body: "Distributed and tracked through a secure process.",
      },
      {
        title: "Rebooking relies on memory",
        body: "The next step, supported after the clinician defines the plan.",
      },
    ],
  },
  journey: {
    heading: "First inquiry to *prepared appointment*",
    lead: "Minimum necessary information, never a symptom questionnaire because the system can ask one.",
    stages: [
      {
        title: "Intent identified",
        body: "Clinic and broad administrative purpose, nothing more.",
      },
      {
        title: "Route explained",
        body: "The correct booking path for that clinic and appointment type.",
      },
      {
        title: "Schedule consulted",
        body: "Real appointment options, confirmed by staff where the category requires it.",
      },
      {
        title: "Intake prepared",
        body: "Forms distributed and tracked, visible before arrival.",
      },
      {
        title: "Clinical stop",
        body: "Symptoms trigger your escalation route with a concise summary, instantly.",
      },
    ],
  },
  workflows: {
    heading: "Support, *after* the plan is set",
    lead: "Never implies treatment is necessary. Never trades on anxiety.",
    items: [
      {
        title: "Course-of-care rebooking",
        body: "Approved reminders once the plan exists, with a task if support is needed.",
      },
      {
        title: "Dormant-patient outreach",
        body: "Segmented by status and consent, always.",
      },
      {
        title: "Reminders & reschedules",
        body: "Fewer missed appointments, on your policy.",
      },
      {
        title: "Escalation with context",
        body: "Symptoms or uncertainty: a person takes over, thread attached.",
      },
    ],
  },
  services: {
    heading: "One system holds the truth",
    lead: "Everything else coordinates around it; nothing else is authoritative.",
    paragraphs: [
      "An [AI receptionist](/services/ai-receptionists) handles routine contact; [clinic booking and intake automation](/services/ai-automation) connects your schedule, forms and records, in WebPT, Jane, Cliniko or whichever practice-management system holds the truth.",
      "A [conversion-led clinic website](/services/web-design-development) improves first-inquiry quality; [custom patient-admin applications](/services/app-development) power multi-location portals, with [governance consulting](/services/ai-consulting) setting the rules first.",
    ],
  },
  proof: {
    heading: "Access and conversion, *verified*",
    lead: "Verified Silverstone AI delivery results: access evidence, never clinical outcomes.",
    metrics: [
      {
        id: "benchmark-116",
        value: "+167%",
        label: "Patient leads",
        basis: "3 months",
      },
      {
        id: "benchmark-117",
        value: "11s → 2.5s",
        label: "Load time",
      },
      {
        id: "benchmark-124",
        value: "+61%",
        label: "Leads & bookings",
        basis: "month on month",
      },
      {
        id: "benchmark-127",
        value: "17% → 46%",
        label: "Lead conversion",
      },
    ],
    attribution: INDUSTRY_ATTRIBUTION,
    clarification: INDUSTRY_CLARIFICATION,
  },
  boundary: {
    heading: "Clinicians own *everything clinical*",
    body: "Health data means less collection, tighter access, defined retention. **The system supports access, booking and reminders. Clinicians own everything else**, no exceptions.",
    keeps: [
      "Urgency, diagnosis, triage",
      "Treatment & exercise advice",
      "Symptom & history interpretation",
      "Modality suitability claims",
      "Every recovery promise, of which none are made",
    ],
  },
  process: {
    heading: "A measured first workflow",
    lead: "Clinical and privacy stakeholders approve every boundary before launch.",
    steps: [
      { title: "Choose the journey", body: "Inquiry, booking, forms or rebooking." },
      { title: "Identify authority", body: "The authoritative schedule and record." },
      { title: "Define the data", body: "Minimum collection, retention, controls." },
      { title: "Set clinical stops", body: "Written with the clinic, not assumed." },
      {
        title: "Connect and test",
        body: "Sensitive content and failure paths proven.",
      },
      { title: "Measure and refine", body: "Access, completion and escalation only." },
    ],
  },
  fit: {
    heading: "Is this *your clinic*?",
    lead: "Clinical needs are individual; the admin around them is repeatable.",
    right: [
      "Repeated admin demand at reception",
      "Booking and escalation rules, or the will to write them",
      "A named schedule or records owner",
      "Clinicians ready to define the boundary",
    ],
    caution:
      "Not a fit if automation is expected to assess patients, generate unreviewed clinical content, or guarantee new-patient volume.",
  },
  faqs: {
    heading: "Questions clinic leaders ask",
    items: [
      {
        q: "Can it answer symptom questions?",
        a: "No clinical advice, ever. It recognizes clinical content and routes by your approved policy.",
      },
      {
        q: "Can it book appointments directly?",
        a: "For defined routine types with an authoritative schedule, yes, whether that lives in WebPT, Jane, Cliniko or TM3. Complex bookings are confirmed by staff.",
      },
      {
        q: "Can it collect intake information?",
        a: "Approved forms through secure systems, with minimization and retention defined.",
      },
      {
        q: "Can it reactivate dormant patients?",
        a: "Consent-aware, administrative only. **Never implies clinical need or uses fear.**",
      },
      {
        q: "Will it work across multiple locations?",
        a: "Yes, where location, schedule and ownership rules are explicit.",
      },
    ],
  },
  midCta: {
    heading: "Map *your* non-clinical intake",
    body: "Bring one recurring admin task. No patient data needed, just the pattern.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "One non-clinical journey, *reviewed*",
    body: "One call examines the administrative route around care, and whether a governed workflow improves access while preserving professional responsibility. See [how we deliver](/how-we-work) and [how scope is set](/pricing).",
    reassurance:
      "No clinical automation · no treatment claims · no obligation to proceed.",
    buttonLabel: "Book a discovery call",
  },
  related: [
    {
      href: "/services/ai-receptionists",
      label: "Related service",
      title: "AI Receptionists",
    },
    {
      href: "/services/app-development",
      label: "Related service",
      title: "App Development",
    },
    { href: "/industry", label: "Industries", title: "All industries" },
  ],
};
