import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const dentistsCopy: IndustryCopy = {
  route: "/industry/dentists",
  sector: "Dental practices",
  routeEntry: {
    loaderText: "Preparing the practice system",
    pill: "Patient access, clinically bounded",
    title: "Protect reception capacity. Preserve clinical responsibility.",
    subtitle:
      "A governed layer for calls, booking, recall, forms and follow-up—designed to stop wherever patient safety or professional judgment begins.",
    buttonLabel: "Explore the patient-admin journey",
  },
  seo: {
    title: "Dental Practice Automation | Silverstone AI",
    description:
      "Improve missed-call recovery, new-patient booking, recalls, reminders and administrative follow-up with dental automation that keeps clinical judgment with the practice.",
    h1: "Recover patient demand without automating clinical judgment",
  },
  eyebrow: "Dental practice automation",
  h1: "Dental practice automation that *recovers every patient*",
  deck: "Automate none of the care.",
  heroSub:
    "A missed call could be a new patient or a stalled recall. Silverstone AI handles the admin **instantly**, and always knows when to stop. Built for dental practices and dental offices in the US and UK.",
  heroPoints: [
    "Every missed call recovered, same day",
    "Recall and rebooking with a named owner",
    "Clinical judgment never leaves the practice",
  ],
  trustTokens: ["Non-clinical", "Data-minimized", "Escalation-led", "Practice-owned"],
  markets: {
    eyebrow: "Built for your market",
    heading: "Same missed recall. *Your* practice system.",
    lead: "A dental office in Denver and a practice in Bristol lose the same recall the same way: no visible owner. The admin workflow is identical; the practice-management system and the plan names change.",
    lanes: [
      {
        market: "US",
        label: "United States",
        operators:
          "General and specialty dental practices, dental offices and DSO groups, from a single location to many.",
        tooling: [
          "Dentrix, Eaglesoft, Open Dental or Curve",
          "Your patient portal and digital intake forms",
          "Insurance verification and recall or recare lists",
        ],
        vocabulary:
          "New-patient exams, hygiene recall or recare, the hygienist's column, unscheduled treatment, insurance, PPO and fee-for-service.",
        keepsHuman: "Diagnosis, treatment planning, consent and anything clinical.",
      },
      {
        market: "UK",
        label: "United Kingdom",
        operators:
          "Private and mixed NHS practices, from a single surgery to a multi-site group.",
        tooling: [
          "Dentally, SOE Exact or Systems for Dentists",
          "Your online booking and intake forms",
          "Recall lists and plan memberships",
        ],
        vocabulary:
          "Check-ups, hygienist recalls, treatment plans, private and NHS patients, plan members.",
        keepsHuman: "Diagnosis, treatment planning, consent and anything clinical.",
      },
    ],
    shared: [
      "Every missed call is recovered the same day and sorted into new patient, change or recall.",
      "The practice-management system is the only source of truth for the schedule and the record.",
      "Any clinical language stops the automation and reaches a person with a concise handoff.",
    ],
  },
  problem: {
    heading: "How can dental practices *recover missed calls faster*?",
    body: "By answering the calls the desk cannot. Silverstone AI picks up what rings out at lunch, after hours and at peak, captures the caller's name, number and reason, then books, reschedules or raises a task with a named owner before the day ends. **The practice gets easier to reach, the admin gets lighter, and clinical judgment is never touched.**",
    cards: [
      {
        title: "Desk busy, demand still arriving",
        body: "Every inquiry captured with an owned next step, even at peak.",
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
    heading: "Admin handled. *Clinical judgment untouched.*",
    lead: "The first-contact layer sorts routine demand from clinical need and **never assesses it.**",
    stages: [
      {
        title: "Contact received",
        body: "Every call, web or message captured instantly; nobody waits for the desk.",
      },
      {
        title: "Intent identified",
        body: "New patient, appointment change or recall response, sorted by approved rules.",
      },
      {
        title: "Record checked",
        body: "Your practice-management system consulted as the single source of truth.",
      },
      {
        title: "Next step offered",
        body: "The right booking route or information, with no repeated details, ever.",
      },
      {
        title: "Clinical stop",
        body: "Symptoms or pain trigger your escalation route with a concise handoff.",
      },
    ],
  },
  workflows: {
    heading: "What can a dental office *safely automate*?",
    lead: "Four things, and nothing clinical: new-patient intake, hygiene recall and rebooking — recare, if that is the word on your schedule — forms and consent admin, and post-treatment follow-up. Each one runs inside written stop conditions, so a US dental office and a UK practice both automate the paperwork and keep every judgment call.",
    items: [
      {
        title: "New-patient intake",
        body: "Contact, location and consent, with full visibility on who owns the next step.",
      },
      {
        title: "Recall & rebooking",
        body: "Hygienist recall and recare cohorts read from approved data, with tasks for anything unresolved.",
      },
      {
        title: "Forms & consent admin",
        body: "Distributed and tracked. **Never mistaken for informed consent.**",
      },
      {
        title: "Treatment follow-up",
        body: "Reminders and routing, with no pressure and no outcome claims, ever.",
      },
    ],
  },
  services: {
    heading: "The system around your clinical team",
    lead: "Built only where the practice needs it, never a fixed stack.",
    paragraphs: [
      "An [AI receptionist](/services/ai-receptionists) handles routine demand, while [call handling](/services/ai-voice-agents) captures every missed call.",
      "[Recall and admin workflows](/services/ai-automation) run reminders and ownership in Dentrix, Open Dental, Dentally or whichever system holds the record; [custom applications](/services/app-development) suit multi-site groups and DSOs, with [governance consulting](/services/ai-consulting) setting the boundaries first.",
    ],
  },
  proof: {
    heading: "Verified results, *four ways*",
    lead: "Verified Silverstone AI delivery results: access, recovery and capacity, never clinical outcomes.",
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
    heading: "What happens to patient data under *HIPAA and UK GDPR*?",
    body: "In the US these are HIPAA-conscious, non-clinical workflows: the system captures, confirms and routes scheduling and administrative detail, and stops where clinical information begins. UK builds are scoped the same way against UK GDPR principles — minimum necessary data, named access, defined retention, a full audit log. **Automation captures, confirms and routes. People decide everything else.** Every clinical stop condition is written down before launch, never assumed.",
    keeps: [
      "Urgency, diagnosis, treatment",
      "Consent, always a human process",
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
      {
        title: "Map systems",
        body: "Phone, schedule, forms and messaging, confirmed.",
      },
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
    lead: "A strong fit is a dental practice or dental office taking more inbound demand than the desk can answer, with a named owner for the schedule and the practice-management system, and leadership willing to write the clinical stop conditions down. Group and DSO sites qualify on the same terms, one location at a time.",
    right: [
      "Repeated admin demand at reception",
      "A named schedule or PMS owner",
      "Escalation rules, written or ready to write",
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
        a: "It never assesses or diagnoses. It recognizes approved stop conditions and routes to your urgent-care policy, instantly.",
      },
      {
        q: "Can it book new patients directly?",
        a: "For defined appointment types where your schedule is authoritative, yes. Otherwise it creates a confirmed request for staff sign-off.",
      },
      {
        q: "Does digital intake replace consent?",
        a: "No. Forms support administration only; **consent stays a professional process, always.**",
      },
      {
        q: "How is patient data protected?",
        a: "Minimized, access-restricted, retained on your terms, with logs and named owners throughout. US builds are designed as HIPAA-conscious, non-clinical workflows; UK builds are scoped against UK GDPR principles, with the Information Commissioner's Office guidance as the reference point. Both use the same rule: the least data the workflow needs, and nothing clinical.",
      },
      {
        q: "How does this work for a US practice under HIPAA?",
        a: "We build **HIPAA-conscious, non-clinical workflows**. The system handles scheduling, recall or recare, forms distribution and follow-up, and stops where clinical information begins — no diagnosis, no triage, no clinical notes. Where a workflow would reach into the clinical record, it is scoped out or routed to your team, and the boundary is written down with the practice before anything goes live.",
      },
      {
        q: "Do reminders and recall texts follow US calling and email rules?",
        a: "That is a design property, not an afterthought. The workflow is built around what TCPA asks of automated calls and texts — consent captured and stored before contact, an opt-out honored immediately, sending held to local quiet hours in the patient's own time zone — and what CAN-SPAM asks of email: accurate headers, your practice's real physical address and a working unsubscribe.",
      },
      {
        q: "Can a London studio support a US dental office?",
        a: "Yes. Silverstone AI is based in London and builds for both markets. Call handling, reminders and recall run on your local clock, so a Pacific-time office and a UK surgery each get their own opening hours, quiet hours and same-day recovery window. Replies from us land across US and UK business hours.",
      },
      {
        q: "What does this cost in US dollars?",
        a: "Every published band on our pricing page carries both currencies at a fixed rate, reviewed quarterly, so a US dental office reads a dollar figure rather than working out a conversion. Scope for a practice is set on one call against the specific workflow you want covered — missed calls, intake, recall or forms — not from a per-seat list.",
      },
      {
        q: "Will it work with our practice-management system?",
        a: "It depends on the integration methods available. Dentrix, Eaglesoft, Open Dental, Curve, Dentally and SOE Exact each expose different read and write paths, and we verify what can be read and written before scoping anything.",
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
    body: "One call examines the boundary around care, and whether a governed workflow can improve access without ever crossing into clinical territory. See [how we deliver](/how-we-work) and [how scope is set](/pricing).",
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
