import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const dentistsCopy: IndustryCopy = {
  route: "/industry/dentists",
  sector: "Dental practices",
  routeEntry: {
    loaderText: "Separating routine patient administration from clinical judgement.",
    pill: "Patient access, clinically bounded",
    title: "Protect reception capacity. Preserve clinical responsibility.",
    subtitle:
      "A governed layer for calls, booking, recall, forms and follow-up—designed to stop wherever patient safety or professional judgement begins.",
    buttonLabel: "Explore the patient-admin journey",
  },
  seo: {
    title: "Dental Practice Automation UK | Silverstone AI",
    description:
      "Improve missed-call recovery, new-patient booking, recalls, reminders and administrative follow-up with dental automation that keeps clinical judgement with the practice.",
    h1: "Recover patient demand without automating clinical judgement",
  },
  eyebrow: "Dental practice automation",
  h1: "Recover every patient. *Automate none of the care.*",
  heroSub:
    "A missed call could be a new patient or a stalled recall. Silverstone handles the admin **instantly** — and always knows when to stop.",
  heroPoints: [
    "Every missed call recovered, same day",
    "Recall and rebooking with a named owner",
    "Clinical judgement never leaves the practice",
  ],
  trustTokens: ["Non-clinical", "Data-minimised", "Escalation-led", "Practice-owned"],
  problem: {
    heading: "Reception pressure is *lost revenue*",
    body: "The goal is simple: **make the practice easier to reach, cut repetitive admin, and never touch clinical judgement.** Both are non-negotiable design requirements — not a trade-off.",
    cards: [
      {
        title: "Desk busy, demand still arriving",
        body: "Every enquiry captured with an owned next step — even at peak.",
      },
      {
        title: "Recall lists, no visible owner",
        body: "See who was contacted, who responded, who still needs you.",
      },
      {
        title: "Forms chased on the day",
        body: "Distributed and reminded before the appointment, not during it.",
      },
      {
        title: "Clinical language in admin",
        body: "Stopped and escalated to the practice, immediately.",
      },
    ],
  },
  journey: {
    heading: "Admin handled. *Clinical judgement untouched.*",
    lead: "The first-contact layer sorts routine demand from clinical need — **never assesses it.**",
    stages: [
      {
        title: "Contact received",
        body: "Every call, web or message captured instantly — nobody waits for the desk.",
      },
      {
        title: "Intent identified",
        body: "New patient, appointment change or recall response — sorted by approved rules.",
      },
      {
        title: "Record checked",
        body: "Your practice-management system consulted as the single source of truth.",
      },
      {
        title: "Next step offered",
        body: "The right booking route or information — no repeated details, ever.",
      },
      {
        title: "Clinical stop",
        body: "Symptoms or pain trigger your escalation route with a concise handoff.",
      },
    ],
  },
  workflows: {
    heading: "What the practice can *safely automate*",
    lead: "Defined administrative work, inside explicit clinical controls.",
    items: [
      {
        title: "New-patient intake",
        body: "Contact, location and consent — with full visibility on who owns the next step.",
      },
      {
        title: "Recall & rebooking",
        body: "Due cohorts identified from approved data, with tasks for anything unresolved.",
      },
      {
        title: "Forms & consent admin",
        body: "Distributed and tracked. **Never mistaken for informed consent.**",
      },
      {
        title: "Treatment follow-up",
        body: "Reminders and routing — no pressure, no outcome claims, ever.",
      },
    ],
  },
  services: {
    heading: "The system around your clinical team",
    lead: "Built only where the practice needs it — never a fixed stack.",
    paragraphs: [
      "An [AI receptionist](/services/ai-receptionists) handles routine demand, while [call handling](/services/ai-voice-agents) captures every missed call.",
      "[Recall and admin workflows](/services/ai-automation) run reminders and ownership; [custom applications](/services/app-development) suit multi-site groups, with [governance consulting](/services/ai-consulting) setting the boundaries first.",
    ],
  },
  proof: {
    heading: "Verified results, *four ways*",
    lead: "Verified Silverstone AI delivery results — access, recovery and capacity, never clinical outcomes.",
    metrics: [
      {
        id: "benchmark-087",
        value: "14%",
        label: "No-show rate",
        basis: "within 8 weeks",
      },
      {
        id: "benchmark-088",
        value: "£6,400",
        label: "Revenue recovered",
        basis: "per month",
      },
      {
        id: "benchmark-090",
        value: "6 hours",
        label: "Admin saved",
        basis: "per week",
      },
      { id: "benchmark-091", value: "+22%", label: "New-patient bookings" },
    ],
    attribution: INDUSTRY_ATTRIBUTION,
    clarification: INDUSTRY_CLARIFICATION,
  },
  boundary: {
    heading: "Privacy and safety, *built in*",
    body: "Health data demands more, not less. **Automation captures, confirms and routes. People decide everything else.** Every clinical stop condition is defined before launch — never assumed.",
    keeps: [
      "Urgency, diagnosis, treatment",
      "Consent — always a human process",
      "Medication & medical history",
      "Complaints and discretion",
      "Any response to clinical language",
    ],
  },
  process: {
    heading: "A controlled first release",
    lead: "One bounded journey, proven safe before anything expands.",
    steps: [
      { title: "Select the problem", body: "Missed calls, intake, recall or forms." },
      { title: "Map systems", body: "Phone, diary, forms and messaging — confirmed." },
      { title: "Define data", body: "Minimum necessary, access and retention." },
      {
        title: "Set clinical stops",
        body: "Written down with the practice, not assumed.",
      },
      {
        title: "Design the handoff",
        body: "Named queue, response time, full audit trail.",
      },
      {
        title: "Test and measure",
        body: "Edge cases proven before anything goes live.",
      },
    ],
  },
  fit: {
    heading: "Is this *your practice*?",
    lead: "A strong fit has demand worth recovering and owners ready to define the boundary.",
    right: [
      "Repeated admin demand at reception",
      "A named diary or PMS owner",
      "Escalation rules — written or ready to write",
      "Leadership open to reviewing privacy",
    ],
    caution:
      "Not a fit if automated diagnosis, autonomous urgency decisions or a guaranteed booking volume is the expectation.",
  },
  faqs: {
    heading: "Questions practice leaders ask",
    items: [
      {
        q: "Can it handle dental emergencies?",
        a: "It never assesses or diagnoses. It recognises approved stop conditions and routes to your urgent-care policy — instantly.",
      },
      {
        q: "Can it book new patients directly?",
        a: "For defined appointment types where your diary is authoritative, yes. Otherwise it creates a confirmed request for staff sign-off.",
      },
      {
        q: "Does digital intake replace consent?",
        a: "No. Forms support administration only — **consent stays a professional process, always.**",
      },
      {
        q: "How is patient data protected?",
        a: "Minimised, access-restricted, retained on your terms, with logs and named owners throughout.",
      },
      {
        q: "Will it work with our PMS?",
        a: "Depends on available integration methods — we verify what can be read and written before scoping anything.",
      },
    ],
  },
  midCta: {
    heading: "Map *your* recall journey",
    body: "Bring one admin task that keeps eating reception time. No patient data needed for this call.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "Review one patient-admin journey",
    body: "One call examines the boundary around care — whether a governed workflow can improve access without ever crossing into clinical territory. See [how we deliver](/how-we-work) and [how scope is set](/pricing).",
    reassurance: "Non-clinical scope · clear escalation · no obligation to proceed.",
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
