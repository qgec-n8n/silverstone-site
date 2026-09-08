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
    pill: "Physio & chiropractic AI · non-clinical access",
    title: "Physio, physical therapy and chiropractic automation",
    subtitle:
      "AI automation for physio, physical therapy and chiropractic clinics: inquiries, booking, forms and rebooking, designed to stop before clinical assessment begins.",
    buttonLabel: "Explore the clinic journey",
  },
  seo: {
    title:
      "Physical Therapy, Physio and Chiropractic Practice Automation | Silverstone AI",
    description:
      "Improve new-patient inquiries, booking, reminders, intake and rebooking with non-clinical automation for physical therapy, physio and chiropractic clinics.",
    h1: "Make the clinic easier to access without automating care",
  },
  eyebrow: "Physio, physical therapy & chiropractic automation",
  h1: "AI automation for physios that *keeps care entirely yours*",
  deck: "Easier access for patients. Physios and physical therapists, UK and US.",
  heroSub:
    "A question mixing symptoms and availability lands after hours. Silverstone AI handles access and booking **instantly**; clinicians get context, never a diagnosis. Built for physio clinics, physical therapy practices and chiropractors in the US and UK.",
  heroPoints: [
    "Access and booking handled, always",
    "Intake completed before arrival",
    "Symptoms go straight to clinicians",
  ],
  mobile: {
    tagline: "After-hours questions answered, *never diagnosed*",
    points: [
      "Access and booking handled",
      "Intake done before arrival",
      "Symptoms go to clinicians",
    ],
  },
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
        vocabulary:
          "New-patient evals, plans of care, visits, co-pays, insurance versus self-pay, PTs and DCs.",
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
      "Rebooking and reminders follow the plan the clinician set—consent captured, opt-outs honored, quiet hours respected—never a script that implies need.",
    ],
  },
  problem: {
    heading: "Why do physio and PT clinics *lose new patients*?",
    body: "Most are lost to admin, not to care. An inquiry arrives after hours, forms turn up incomplete, and rebooking depends on someone remembering. Silverstone AI organizes access, booking, intake and rebooking for physio, physical therapy and chiropractic clinics, **and never diagnoses, assesses urgency or replaces professional judgment.**",
    cards: [
      {
        title: "Practical mixed with symptoms",
        body: "Separated from clinical content, instantly.",
      },
      {
        title: "Booking without context",
        body: "Location, practitioner and payment route—insured or self-paying—identified up front.",
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
    heading: "How does an inquiry become a *prepared first visit*?",
    lead: "In five steps. The system identifies the clinic and the administrative purpose, explains the right booking route, checks the live schedule, then sends intake before arrival—for a US new-patient evaluation or a UK initial assessment alike. Anything clinical stops there and routes to a clinician. Minimum necessary information, never a symptom questionnaire.",
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
        body: "Forms and insurance or self-pay details distributed and tracked, visible before arrival.",
      },
      {
        title: "Clinical stop",
        body: "Symptoms trigger your escalation route with a concise summary, instantly.",
      },
    ],
  },
  workflows: {
    heading: "Can rebooking and reminders run *without pressure*?",
    lead: "Yes, because nothing starts until a clinician has set the plan of care or treatment plan. Reminders, rebooking and dormant-patient outreach then follow that plan, segmented by consent and status. Messages carry a working opt-out, respect quiet hours in the patient's own time zone, and never imply treatment is necessary.",
    items: [
      {
        title: "Course-of-care rebooking",
        body: "Approved reminders once the plan of care or treatment plan exists, with a task if support is needed.",
      },
      {
        title: "Dormant-patient outreach",
        body: "Segmented by status and consent, with opt-outs honored on the spot.",
      },
      {
        title: "Reminders & reschedules",
        body: "Fewer missed appointments, on your policy, inside quiet hours for US and UK numbers alike.",
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
      "An [AI receptionist](/services/ai-receptionists) handles routine contact; [clinic booking and intake automation](/services/ai-automation) connects your schedule, forms and records, in WebPT, Prompt, Jane, Cliniko or whichever practice-management system holds the truth.",
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
    heading: "Where does the system stop and a *clinician start*?",
    body: "At the first clinical word. These are HIPAA-conscious, non-clinical workflows: scheduling, intake, reminders and rebooking, built to the data-minimization principles of UK GDPR—less collection, tighter access, defined retention—and designed to stop where clinical information begins. **The system supports access, booking and reminders. Clinicians own everything else**, no exceptions.",
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
      {
        title: "Define the data",
        body: "Minimum collection, retention, consent and opt-out records.",
      },
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
    lead: "If reception is repeating itself, probably yes. This suits outpatient PT clinics, private physiotherapy practices and chiropractors, single site or multi-location, with a named owner for the schedule and records and clinicians willing to write the boundary down. Clinical needs are individual; the admin around them is repeatable.",
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
        a: "For defined routine types with an authoritative schedule, yes, whether that lives in WebPT, Prompt, Jane, Cliniko or TM3. Complex bookings are confirmed by staff.",
      },
      {
        q: "How does this work with HIPAA in a US clinic?",
        a: "We build HIPAA-conscious, non-clinical workflows. The system handles scheduling, intake distribution, reminders and rebooking, and stops where clinical information begins: anything symptom-related is routed to a clinician rather than processed. Your practice-management system stays the record of truth, and your own agreements with each vendor govern where patient data is held.",
      },
      {
        q: "Can it text and email patients under TCPA and CAN-SPAM rules?",
        a: "The workflow is designed around them. Calls and texts to US numbers go out only where consent was captured and recorded, an opt-out reply stops the sequence immediately, and sending windows respect quiet hours in the patient's own time zone. Email carries accurate sender headers, a real physical address and a working unsubscribe link.",
      },
      {
        q: "Does it treat insurance and self-pay patients differently?",
        a: "Yes, as an administrative route rather than a coverage decision. An inquiry is tagged as insured, self-pay or self-funded and sent down the booking path your clinic defined for it. The system never quotes benefits, estimates a co-pay or confirms eligibility; your staff or your billing service does that.",
      },
      {
        q: "Can it collect intake information?",
        a: "Approved forms through secure systems, with minimization and retention defined, including the insurance or self-pay details your own intake already asks for.",
      },
      {
        q: "Can it reactivate dormant patients?",
        a: "Consent-aware, administrative only. **Never implies clinical need or uses fear.**",
      },
      {
        q: "Will it work across multiple locations?",
        a: "Yes, where location, schedule and ownership rules are explicit.",
      },
      {
        q: "Can a London team support a US clinic?",
        a: "Yes. Discovery and review calls are booked in your own time zone, and the workflow itself runs around the clock, so the 9pm inquiry to a Phoenix PT clinic is handled exactly as the 9pm inquiry to a Bristol physio clinic. Pricing is published in both USD and GBP, so scope is agreed in your own currency.",
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
