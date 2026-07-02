import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const physiosChiropractorsCopy: IndustryCopy = {
  route: "/industry/physios-chiropractors",
  sector: "Physios & chiropractors",
  routeEntry: {
    loaderText:
      "Preparing a non-clinical route from enquiry to clinician-ready context.",
    pill: "Clinic access with clinical boundaries",
    title: "Reduce reception friction. Keep care human.",
    subtitle:
      "A governed operating layer for enquiries, booking, forms and rebooking—designed to stop before clinical assessment begins.",
    buttonLabel: "Explore the clinic journey",
  },
  seo: {
    title: "Physio and Chiropractic Practice Automation UK",
    description:
      "Improve new-patient enquiries, booking, reminders, intake and rebooking with non-clinical automation designed for physio and chiropractic practices.",
    h1: "Make the clinic easier to access without automating care",
  },
  eyebrow: "Physio & chiropractic automation",
  h1: "Make the clinic easier to access without automating care",
  heroSub:
    "A prospective patient finds the clinic after work, asks a question that mixes availability with symptoms, and leaves a message. Silverstone organises the non-clinical journey — access, booking, forms, rebooking — so clinicians receive the right person with the right context.",
  heroPoints: [
    "Routine access and booking handled consistently",
    "Administrative intake completed before arrival",
    "Symptoms and urgency go straight to clinicians",
  ],
  trustTokens: ["Non-clinical", "Privacy-led", "Clinician-owned", "System-accountable"],
  problem: {
    heading: "Patient access breaks outside the treatment room",
    body: "Forms arrive incomplete. Rebooking depends on memory. Reception follows up the next morning while the enquiry cools. The system organises practical enquiries, booking, reminders, intake and rebooking — and must never diagnose, assess urgency or replace professional judgement.",
    cards: [
      {
        title: "Practical question mixed with symptoms",
        body: "Separate administration from clinical content immediately.",
      },
      {
        title: "Booking request without clinic context",
        body: "Identify location, practitioner preference and the valid appointment route.",
      },
      {
        title: "Forms incomplete at arrival",
        body: "Distribute and remind through an approved secure process.",
      },
      {
        title: "Rebooking depends on memory",
        body: "Support the administrative next step after the clinician has defined the plan.",
      },
    ],
  },
  journey: {
    heading: "From first enquiry to prepared appointment",
    lead: "Continuity without collecting unnecessary health data in an open channel — minimum necessary information, with a clear purpose and an accountable owner.",
    stages: [
      {
        title: "Practical intent identified",
        body: "Clinic, contact details and broad administrative intent — never a symptom questionnaire because the system can ask one.",
      },
      {
        title: "Approved route explained",
        body: "The correct booking or consultation path for that clinic and appointment category.",
      },
      {
        title: "Diary consulted",
        body: "Permitted appointment options offered from the authoritative diary, with staff confirmation where the category requires it.",
      },
      {
        title: "Intake prepared",
        body: "Administrative forms distributed and completion tracked; what remains outstanding is visible before arrival.",
      },
      {
        title: "Clinical stop, clinic owner",
        body: "Symptoms, red flags or urgency stop the flow and follow the clinic's approved escalation — reception or the clinician receives a concise, appropriate summary.",
      },
    ],
  },
  workflows: {
    heading: "Rebooking and follow-up, administratively supported",
    lead: "Automation supports the administrative process after the clinician or clinic has established the plan.",
    items: [
      {
        title: "Course-of-care rebooking",
        body: "Approved reminders and a booking route once the plan is set, with a task created when the patient needs human support.",
      },
      {
        title: "Dormant-patient communication",
        body: "Segmented by administrative status and consent — never implying treatment is necessary, never trading on clinical anxiety.",
      },
      {
        title: "Reminders and reschedules",
        body: "Confirmation, rescheduling and cancellation routes that respect clinic policy and reduce missed appointments.",
      },
      {
        title: "Escalation with context",
        body: "Where a patient raises symptoms, dissatisfaction or uncertainty, the sequence stops and a person takes over — with the thread attached.",
      },
    ],
  },
  services: {
    heading: "Web, forms and clinic systems working together",
    lead: "One system remains authoritative for appointments and patient administration — everything else coordinates around it.",
    paragraphs: [
      "An [AI receptionist for clinics](/services/ai-receptionists) handles routine contact, while [clinic booking and intake automation](/services/ai-automation) connects the diary, forms, messages and patient-admin record.",
      "A [conversion-led clinic website](/services/web-design-development) improves the quality of the first enquiry, [custom patient-admin applications](/services/app-development) support portals or multi-location administration, and [AI governance consulting](/services/ai-consulting) defines the boundaries where several systems and professional stakeholders meet.",
    ],
  },
  proof: {
    heading: "Access and conversion, measured",
    lead: "Silverstone AI delivery results across acquisition, website performance and enquiry conversion — access evidence, never clinical outcomes.",
    metrics: [
      {
        id: "benchmark-116",
        value: "167%",
        label: "Growth in patient leads",
        basis: "3 months",
      },
      {
        id: "benchmark-117",
        value: "11s → 2.5s",
        label: "Website load time",
        basis: "after speed optimisation",
      },
      {
        id: "benchmark-124",
        value: "61%",
        label: "Increase in total leads and bookings",
        basis: "month on month",
      },
      {
        id: "benchmark-127",
        value: "17% → 46%",
        label: "Lead-to-patient conversion",
        basis: "after new web form",
      },
    ],
    attribution: INDUSTRY_ATTRIBUTION,
    clarification: INDUSTRY_CLARIFICATION,
  },
  boundary: {
    heading: "Privacy, escalation and professional judgement",
    body: "Clinic systems may process special-category health data, so collection is minimised, access restricted, retention defined and sensitive information kept within approved systems. Automation supports access, booking, forms, reminders, rebooking and routing. Clinicians own everything else.",
    keeps: [
      "Urgency, diagnosis and triage decisions",
      "Treatment and exercise recommendations",
      "Interpretation of symptoms or medical history",
      "Suitability claims for any modality",
      "Recovery promises — none are made, ever",
    ],
  },
  process: {
    heading: "A measured first clinic workflow",
    lead: "One bounded administrative problem, with clinical and data-protection stakeholders approving the boundaries first.",
    steps: [
      {
        title: "Choose the journey",
        body: "Enquiry, booking, forms, reminders or rebooking.",
      },
      {
        title: "Identify authority",
        body: "The authoritative diary and patient-admin record.",
      },
      {
        title: "Define the data",
        body: "Minimum collection, privacy controls and retention.",
      },
      {
        title: "Set clinical stops",
        body: "Stop conditions and urgent-care language, written with the clinic.",
      },
      {
        title: "Connect one workflow",
        body: "Clear staff ownership, tested against sensitive content and system failure.",
      },
      {
        title: "Measure and refine",
        body: "Administrative outcomes only — access, completion, escalation, handling time.",
      },
    ],
  },
  fit: {
    heading: "Is this the right fit?",
    lead: "Clinical needs are individual; the administrative steps around them are repeatable.",
    right: [
      "Repeated administrative demand at reception",
      "Written booking and escalation rules, or willingness to write them",
      "A named owner for the diary and records system",
      "Clinicians willing to define what automation must not answer",
    ],
    caution:
      "Silverstone may not be suitable where automation is expected to assess patients, generate clinical content without professional review or guarantee a volume of new patients.",
  },
  faqs: {
    heading: "Questions clinic leaders ask",
    items: [
      {
        q: "Can an AI receptionist answer symptom questions?",
        a: "It should not provide clinical advice or assess urgency. It recognises clinical content and routes the patient according to the clinic's approved policy.",
      },
      {
        q: "Can it book appointments directly?",
        a: "Potentially, for defined routine appointment types where the diary is authoritative. Complex or clinically dependent bookings are confirmed by staff.",
      },
      {
        q: "Can it collect intake information?",
        a: "It can distribute and collect approved administrative forms through secure systems, with data minimisation, access and retention defined.",
      },
      {
        q: "Can it reactivate dormant patients?",
        a: "It can support consent-aware administrative communication, but never implies clinical need or uses fear-based messaging.",
      },
      {
        q: "Will it work across several clinic locations?",
        a: "Yes, if location, practitioner, diary and ownership rules are explicit and the connected systems support them.",
      },
    ],
  },
  midCta: {
    heading: "Map non-clinical intake",
    body: "Bring one administrative journey that repeatedly creates reception work. No patient-identifiable information is required.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "Review one non-clinical patient journey",
    body: "A discovery call focuses on the administrative route around care — whether a governed clinic workflow can improve access and preparation while preserving professional responsibility. See [how Silverstone works](/how-we-work) and [how project scope is established](/pricing).",
    reassurance:
      "No clinical automation, no treatment claims and no obligation to proceed. Patient data is not required for the first conversation.",
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
