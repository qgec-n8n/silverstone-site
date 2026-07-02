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
  h1: "Recover patient demand without automating clinical judgement",
  heroSub:
    "A missed dental call may be a new patient, a stalled recall or a question that must reach a clinician. Silverstone separates those situations safely: administration is automated within defined controls, and the system knows exactly when to stop.",
  heroPoints: [
    "Missed calls captured with an owned next step",
    "Recall and rebooking with visible responsibility",
    "Clinical stop conditions built into every flow",
  ],
  trustTokens: ["Non-clinical", "Data-minimised", "Escalation-led", "Practice-owned"],
  problem: {
    heading: "Reception pressure is a patient-access problem",
    body: "The commercial objective is clear: make the practice easier to reach, reduce repetitive administration and create consistent ownership of patient journeys. The safety objective is equally clear: automation must know when to stop. Both are design requirements, not afterthoughts.",
    cards: [
      {
        title: "Reception occupied, demand still arriving",
        body: "Capture routine intent and create an owned next step while the desk is busy.",
      },
      {
        title: "Recall lists without visible ownership",
        body: "Know who was contacted, who responded and who still needs a person.",
      },
      {
        title: "Forms chased on the day",
        body: "Distribute, remind and flag completion before the appointment, not during it.",
      },
      {
        title: "Clinical language in an admin channel",
        body: "Stop the workflow and follow the practice escalation policy — immediately.",
      },
    ],
  },
  journey: {
    heading: "Separate administrative demand from clinical need",
    lead: "The first-contact layer identifies the reason for contact without ever assessing the patient clinically. The distinction is operational, not diagnostic.",
    stages: [
      {
        title: "Contact received",
        body: "Call, web or message demand is captured with channel and context — nothing waits for the desk to become free.",
      },
      {
        title: "Administrative intent identified",
        body: "New-patient enquiry, routine appointment change, recall response or practical question — distinguished by approved rules.",
      },
      {
        title: "Record or diary checked",
        body: "The practice-management system and diary are consulted as the single source of truth before anything is offered.",
      },
      {
        title: "Permitted next step",
        body: "An appropriate booking route, approved information or a structured callback — the patient never repeats details systems already hold.",
      },
      {
        title: "Clinical stop, practice owner",
        body: "Symptoms, pain, trauma or medication concerns trigger the approved escalation route with a concise handoff. The dental team owns the response.",
      },
    ],
  },
  workflows: {
    heading: "The journeys a practice can safely automate",
    lead: "Defined administrative work — capture, routing, booking requests, reminders, recalls, forms and follow-up — inside explicit controls.",
    items: [
      {
        title: "New-patient intake",
        body: "Contact details, preferred location, enquiry category and consent, with a visible handoff: who owns it, when it was created, what must not be answered automatically.",
      },
      {
        title: "Recall and rebooking",
        body: "Due and overdue cohorts identified from approved data, consent-aware messaging, and tasks for unresolved or priority cases — with the journey recorded.",
      },
      {
        title: "Forms and consent administration",
        body: "Documents distributed, completion checked, owners notified. Form completion is never treated as informed consent — that remains a professional process.",
      },
      {
        title: "Treatment-plan follow-up",
        body: "Reminders that information or an appointment is available, practical questions routed, coordinator tasks created — no pressure, no outcome claims.",
      },
    ],
  },
  services: {
    heading: "The system around the clinical team",
    lead: "Components are selected because the practice needs them — never a fixed stack.",
    paragraphs: [
      "An [AI receptionist for dental enquiries](/services/ai-receptionists) supports routine web and messaging demand, while [dental call handling](/services/ai-voice-agents) captures and routes defined call types.",
      "[Recall and patient-admin workflows](/services/ai-automation) coordinate reminders, ownership and task creation; [custom patient or staff applications](/services/app-development) suit groups needing a controlled interface, with [AI governance consulting](/services/ai-consulting) shaping the boundaries first.",
    ],
  },
  proof: {
    heading: "Attendance and capacity, measured",
    lead: "Silverstone AI delivery results across attendance, recoverable capacity, reception time and new-patient access — operational measures only, never clinical outcomes.",
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
        label: "Estimated revenue recovery",
        basis: "per month",
      },
      {
        id: "benchmark-090",
        value: "6 hours",
        label: "Admin time saved",
        basis: "per week",
      },
      { id: "benchmark-091", value: "22%", label: "New-patient bookings increase" },
    ],
    attribution: INDUSTRY_ATTRIBUTION,
    clarification: INDUSTRY_CLARIFICATION,
  },
  boundary: {
    heading: "Privacy and patient-safety boundaries",
    body: "Dental workflows may involve special-category health data. Data minimisation, access control, retention, secure transfer and accountable review are part of the design — not a later compliance note. Automation can capture, confirm, remind, distribute, record and route. People decide everything else.",
    keeps: [
      "Urgency, diagnosis and treatment decisions",
      "Consent — forms support administration, never substitute the professional process",
      "Medication and medical-history interpretation",
      "Complaints and discretionary patient-care decisions",
      "Any response to clinical language or urgent symptoms",
    ],
  },
  process: {
    heading: "A controlled first release for the practice",
    lead: "One bounded administrative journey, proven safe before anything expands.",
    steps: [
      {
        title: "Select the problem",
        body: "Missed calls, new-patient intake, recall, forms or follow-up.",
      },
      {
        title: "Map systems",
        body: "Phone, website, practice-management system, diary, forms and messaging.",
      },
      {
        title: "Define data",
        body: "Minimum information, access, retention and authoritative records.",
      },
      {
        title: "Set clinical stops",
        body: "Words, intents and conditions that require people — written down, not assumed.",
      },
      {
        title: "Design the handoff",
        body: "Named queue, response expectation and audit trail.",
      },
      {
        title: "Test and measure",
        body: "Routine cases, duplicates, unavailable appointments and escalation — then operational review.",
      },
    ],
  },
  fit: {
    heading: "Is the practice ready?",
    lead: "A strong fit has demand worth recovering and owners willing to define the boundaries.",
    right: [
      "Repeated administrative demand at reception",
      "An identifiable diary or practice-management owner",
      "Written call-handling boundaries, or willingness to write them",
      "Leadership prepared to review privacy and escalation",
    ],
    caution:
      "Silverstone may not be suitable where the expectation is automated diagnosis, autonomous urgency decisions, consent substitution or a guaranteed booking and revenue outcome.",
  },
  faqs: {
    heading: "Questions practice leaders ask",
    items: [
      {
        q: "Can an AI receptionist handle dental emergencies?",
        a: "It should not assess or diagnose an emergency. It recognises approved stop conditions and routes the contact according to the practice's urgent-care and human escalation policy.",
      },
      {
        q: "Can it book new patients directly?",
        a: "Potentially, where the practice has defined appropriate appointment types and the diary is authoritative. Otherwise it creates a structured request for human confirmation.",
      },
      {
        q: "Does digital intake replace consent?",
        a: "No. Forms support administration and preparation, but valid consent requires the appropriate professional process.",
      },
      {
        q: "How is patient data protected?",
        a: "The design minimises data, restricts access, uses approved systems, defines retention and maintains logs with accountable owners.",
      },
      {
        q: "Can it work with our practice-management software?",
        a: "That depends on available integration methods and data quality. Silverstone verifies what can be read or written before defining the scope.",
      },
    ],
  },
  midCta: {
    heading: "Map the recall journey",
    body: "Bring one administrative journey that repeatedly consumes reception time. No patient-identifiable information is needed for the first conversation.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "Review one patient-admin journey",
    body: "A discovery call examines one real process and the boundary around it — whether a governed administrative workflow can improve access and capacity without crossing into care. See the [Silverstone delivery process](/how-we-work) and [project scoping principles](/pricing).",
    reassurance:
      "Non-clinical scope, clear human escalation and no obligation to proceed. Sensitive patient data is not required.",
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
