import { money } from "~/data/currency";

import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

/**
 * Skin & Aesthetic Clinics.
 *
 * Two things make this sector's copy different from every other industry page
 * here, and both are load-bearing:
 *
 *  1. UK advertising law. Botulinum toxin and most lidocaine-containing
 *     dermal fillers are prescription-only medicines, and POMs cannot be
 *     advertised to the public — so no public-facing message the system sends
 *     may name a brand or imply one. A generic assistant will happily type the
 *     brand name into an Instagram reply. That constraint is the page's
 *     central differentiator, not a footnote.
 *  2. The prescriber gate. A POM requires a prescriber's own assessment of the
 *     patient. Automation may arrange the appointment; it may never screen,
 *     advise, recommend or approve a treatment.
 *
 * The US parallel is NOT advertising law — prescription-drug marketing is a
 * different regime there, so nothing on this page may imply the UK POM rule
 * applies to a med spa. What carries across is the clinical boundary
 * (provider/medical director assesses; the workflow stays non-clinical) and
 * the outreach design: consent, opt-out and local calling hours on SMS and
 * calls, accurate headers, a real address and a working unsubscribe on email.
 * Those are described as workflow design throughout. No sentence here may
 * assert a compliance status, certification or accreditation in either market.
 *
 * The page is also deliberately more conversion-led than its siblings: the
 * live-client proof block (`caseStudy`) sits high, and there are three CTA
 * moments before the FAQ rather than two.
 */
export const aestheticClinicsCopy: IndustryCopy = {
  route: "/industry/aesthetic-clinics",
  sector: "Aesthetic clinics & med spas",
  routeEntry: {
    loaderText: "Preparing the consultation pathway",
    pill: "Seven-day booking conversion sprint · one clinic a week",
    title: "Turn interest into booked, deposit-backed consultations",
    subtitle:
      "Answer every inquiry in seconds, hold the deposit up front, and keep every clinical judgment — and every prescription-only medicine — with your prescriber.",
    buttonLabel: "Open the clinic system",
  },
  seo: {
    title: "Aesthetic Clinic & Med Spa Automation | Silverstone AI",
    description:
      "Seven-Day Booking Conversion Sprint for aesthetic clinics and med spas: £1,500 ($1,950), half to begin. Turn inquiries into deposit-secured consultations, with clinical judgment kept with your prescriber or provider.",
    h1: "Turn interest into booked, deposit-backed consultations",
  },
  eyebrow: "Skin & aesthetic clinic automation",
  h1: "Aesthetic clinic automation that books *deposit-backed consults*",
  deck: "For aesthetic clinics and med spas.",
  heroSub:
    "Aesthetic inquiries do not wait. They arrive by DM, form and phone while your hands are gloved, and **the clinic that answers first usually takes the booking.** Silverstone AI answers, qualifies and books, inside your rules.",
  heroPoints: [
    "Every DM, form and missed call answered in seconds",
    "Consultations confirmed with your deposit already held",
    "No prescription-only medicine ever named in a public reply",
  ],
  trustTokens: [
    "Prescriber-gated",
    "Deposit-secured",
    "Advertising-rule aware",
    "Consent-led",
  ],
  markets: {
    eyebrow: "Built for your market",
    heading: "Do you work with *US med spas* as well as UK clinics?",
    lead: "Yes. A DM to a med spa in Scottsdale and one to an aesthetic clinic in Manchester are answered by the same system, in seconds, and turned into a deposit-backed consultation. What changes is the booking platform, the deposit rules, the words your market uses, and whether a medical director or a prescriber signs off.",
    lanes: [
      {
        market: "US",
        label: "United States",
        operators:
          "Med spas and aesthetic practices, from a single-injector studio to a multi-location group.",
        tooling: [
          "Aesthetic Record, Boulevard or Zenoti",
          "Instagram DMs, website forms and Google Business Profile",
          "Your deposit rules and consultation calendar",
        ],
        vocabulary:
          "Consults, injectors, med spa or medspa, treatment series, memberships, your medical director.",
        keepsHuman:
          "Consultations, suitability, treatment decisions and anything your provider must assess.",
      },
      {
        market: "UK",
        label: "United Kingdom",
        operators:
          "Skin and aesthetic clinics, from a single-prescriber clinic to a multi-site group.",
        tooling: [
          "Pabau, Aesthetic Nurse Software or Fresha",
          "Instagram DMs, website forms and Google Business Profile",
          "Your deposit rules and consultation diary",
        ],
        vocabulary:
          "Consultations, prescribers, treatment courses, plan members, the prescriber's own assessment.",
        keepsHuman:
          "Assessment, suitability, prescribing decisions and anything your prescriber must decide.",
      },
    ],
    shared: [
      "Every DM, form and missed call is answered in seconds and turned into a deposit-backed consultation.",
      "Public replies use only the treatment-category language your clinic approves, in your market's own terms.",
      "Anything a prescriber or provider must assess pauses automation and reaches them with context.",
    ],
  },
  /*
   * The live commercial offer this page is currently selling, and the same
   * one used verbatim on calls. Everything numeric here is the quoted figure:
   * £1,500 total, £750 to begin, £750 on launch, seven business days.
   *
   * The scarcity claim is capacity, not price: one clinic is taken on each
   * week, so the banner's clock counts to the end of *this week's* intake and
   * resets. `windowNote` says that in plain words on the page so the
   * countdown can never be read as an expiring price.
   */
  sprint: {
    id: "ind2-sprint",
    eyebrow: "Seven-day sprint",
    capacity: "One clinic · this week",
    name: "Seven-Day Booking Conversion Sprint",
    price: money("£1,500"),
    priceNote: `${money("£750")} to begin · ${money("£750")} when it launches`,
    windowNote:
      "This week's intake closes Friday at 23:59. One clinic is taken on per week — the price and the scope do not change when the clock resets.",
    bannerBody:
      "One clinic, one week. We rebuild the part of your site that decides whether an inquiry becomes a consultation — then answer every new inquiry the moment it lands. **Live in seven business days, or the final [[£750|$975]] is not due until it is.**",
    bannerCtaLabel: "Claim this week's sprint",
    bannerDetailLabel: "See what's included",
    section: {
      eyebrow: "This week's sprint",
      heading: "Seven business days, *one clinic, one fixed price*",
      lead: "A tightly scoped sprint on the inquiries your clinic already receives. Fixed scope, fixed price, fixed delivery window — six deliverables, nothing padded around them.",
    },
    deliverables: [
      {
        title: "Website conversion redesign",
        body: "The pages that decide a booking — treatment, consultation and inquiry pages — rebuilt around one clear path to a consultation instead of a brochure.",
      },
      {
        title: "Mobile booking journey",
        body: "Most aesthetic inquiries arrive on a phone. The booking route is rebuilt for a thumb: fewer steps, no pinch-zoom, no dead ends.",
      },
      {
        title: "Immediate inquiry response",
        body: "Every new website inquiry gets an answer in seconds rather than the next morning — written to your approved treatment language and, in the UK, to advertising rules that permit no prescription-only medicine to be named.",
      },
      {
        title: "Three-message follow-up",
        body: "A structured three-message sequence for inquiries that do not book first time. It stops the moment someone books or opts out.",
      },
      {
        title: "Booking and conversion tracking",
        body: "Inquiries, bookings and the conversion rate between them measured properly, so the next decision is made on your numbers rather than a hunch.",
      },
      {
        title: "Seven business-day delivery",
        body: "The clock starts when the content and access are in our hands — and if it slips, the final [[£750|$975]] waits until the system is live.",
      },
    ],
    payments: [
      {
        amount: money("£750"),
        when: "To begin",
        note: "Books your week and starts the clinic review.",
      },
      {
        amount: money("£750"),
        when: "When it launches",
        note: "Due once the agreed system is live, not before.",
      },
      {
        amount: "Optional",
        when: "After launch",
        note: "Maintenance, or the wider automation on this page. Never assumed.",
      },
    ],
    dayTrack: [
      { day: "Day 1", label: "Content and access received — clock starts" },
      { day: "Day 2", label: "Conversion map agreed" },
      { day: "Day 3", label: "Booking pages rebuilt" },
      { day: "Day 4", label: "Mobile journey rebuilt" },
      { day: "Day 5", label: "Instant inquiry reply live" },
      { day: "Day 6", label: "Follow-up and tracking wired" },
      { day: "Day 7", label: "Launch" },
    ],
    guarantee:
      "The agreed system will be live within seven business days of receiving the required content and access, or the final payment will not be due until it is live.",
    guaranteeNote:
      "Required content and access means your treatment and pricing copy, imagery, and logins for the site, diary and domain. We list exactly what is needed on the call, before anything is paid.",
    ctaLabel: "Claim this week's sprint",
    reassurance:
      "Fixed price · no retainer required · no platform migration assumed · clinical judgment and prescribing stay with your prescriber.",
  },
  caseStudy: {
    eyebrow: "Live client build",
    heading: "We already built this for *an aesthetic clinic*",
    lead: "**Aesthetics by Clouds** is a premium clinic in Abingdon, and the site below is theirs — running live, right here on this page. Browse it on desktop or phone: thirty-eight treatments across four categories, a free-consultation route, and a booking portal nested inside the page rather than bolted onto it.",
    points: [
      "38-treatment catalog, structured for search and for choosing",
      "Free-consultation funnel as the primary conversion path",
      "Deposit taken at the point of booking, inside the site",
      "Treatment language written to UK advertising rules",
    ],
    showcaseSiteId: "aesthetics-by-clouds",
    note: "The real production site in an interactive window — not a screenshot. Click into it.",
  },
  problem: {
    heading: "The inquiry is rarely the problem. *The gap after it is.*",
    body: "A DM lands at 21:40. A form arrives mid-treatment. A call rings out while you are in a sterile field. By the time the clinic replies the next morning, **the inquirer has already booked a consultation somewhere else** — and nothing about that was a marketing failure.",
    cards: [
      {
        title: "Replies arrive hours late",
        body: "Answered in seconds across DM, WhatsApp, form and phone — while you treat.",
      },
      {
        title: "Consultations that no-show",
        body: "Your deposit and cancellation terms applied at the point of booking.",
      },
      {
        title: "Follow-up stops at one message",
        body: "A structured sequence continues, on your terms, until there is an answer.",
      },
      {
        title: "Treatment cycles drift",
        body: "Each course and interval gets its own recall cadence, with consent.",
      },
    ],
  },
  workflows: {
    heading: "How do med spas and clinics turn a DM into a *booked consultation*?",
    lead: "Aesthetic inquiries are comparison-shopped within the hour, so three journeys decide it. The first reply lands in seconds on whichever channel it arrived — Instagram DM, WhatsApp, web form or missed call. The consultation is confirmed only once your deposit is taken. Follow-up then runs on the consent captured at the inquiry, until the person books or opts out.",
    items: [
      {
        title: "Seconds-fast first reply",
        body: "Instagram DM, WhatsApp, web form, missed call — one system answers the routine question and offers a real appointment, **without naming a prescription-only medicine.**",
      },
      {
        title: "Deposit-secured booking",
        body: "The consultation is only confirmed once your deposit and cancellation terms are met. Payment failures and disputes reach a person, never a bot.",
      },
      {
        title: "Follow-up that keeps going",
        body: "Most inquiries do not convert on the first exchange. A sequenced, value-adding follow-up runs to your cadence on the consent captured at the inquiry — held inside the recipient's local calling hours, carrying a plain opt-out, and stopping the moment someone books or says stop.",
      },
      {
        title: "Treatment-cycle recall",
        body: "Anti-wrinkle intervals, filler review points and skin-course or treatment-series sessions each carry their own timing — prompted from real treatment history, with consent, never as a blast.",
      },
    ],
  },
  journey: {
    heading: "What makes an aesthetic booking *safe to automate*?",
    lead: "Written rules, applied before anything is sent. The system books by treatment category rather than by naming a product, applies your deposit and notice terms exactly as published, collects history for a clinician to read, and pauses the moment a decision belongs to your prescriber or medical director. A skin consultation and an injectable review never share one script.",
    stages: [
      {
        title: "Treatment category",
        body: "Inquiries resolved by category and outcome — never by naming a prescription-only product.",
      },
      {
        title: "Consultation type",
        body: "Free consult, paid assessment or review — each with its own duration, room and treating clinician or injector.",
      },
      {
        title: "Commercial terms",
        body: "Deposit value, notice period and rescheduling rules applied exactly as you have written them.",
      },
      {
        title: "Screening handoff",
        body: "Medical history, contraindications and suitability are collected for a clinician — and decided by one. Clinical detail is handed to your records, not held in a marketing tool.",
      },
      {
        title: "Prescriber gate",
        body: "Anything requiring a prescriber's or medical director's own assessment pauses automation and reaches your clinician with full context.",
      },
    ],
  },
  services: {
    heading: "Will this work with the *clinic software we already run*?",
    lead: "Yes — we open by testing your stack, not replacing it. Pabau, Aesthetic Nurse Software or Fresha in the UK; Aesthetic Record, Boulevard or Zenoti for a US med spa; whatever takes your deposits; whichever inbox and DM account the inquiries land in. Replacing your diary, records or payment provider is a last resort, never an opening move.",
    paragraphs: [
      "An [AI receptionist for clinic inquiries](/services/ai-receptionists) answers routine questions and books consultations, while [voice handling](/services/ai-voice-agents) captures the calls that ring out during treatment.",
      "[Deposit, follow-up and recall workflows](/services/ai-automation) coordinate your diary, payments and patient records; a [clinic website](/services/web-design-development) and a governed [content system](/services/content-creation) keep treatment pages and campaigns inside UK advertising rules and, in every other market, inside the treatment language your clinic has approved.",
    ],
  },
  proof: {
    heading: "Access and attendance, *measured*",
    lead: "Verified Silverstone AI delivery results across response speed, inquiry conversion, attendance and admin.",
    metrics: [
      { id: "benchmark-044", value: "<10 seconds", label: "Response time" },
      {
        id: "benchmark-127",
        value: "17% → 46%",
        label: "Lead-to-patient conversion",
      },
      { id: "benchmark-033", value: "-75%", label: "No-shows" },
      {
        id: "benchmark-041",
        value: "6 hours",
        label: "Admin saved",
        basis: "per week",
      },
    ],
    attribution: INDUSTRY_ATTRIBUTION,
    clarification: INDUSTRY_CLARIFICATION,
  },
  boundary: {
    heading: "Your prescriber decides. *The system never does.*",
    body: "Botulinum toxin and many dermal fillers are prescription-only medicines: UK rules do not permit advertising them to the public, and a prescriber must assess the patient themselves. **So the system arranges appointments — it does not assess, advise, recommend or name a POM.** Public-facing replies, captions and pages are written to that boundary by default, not policed afterwards. **US med spas get the same boundary drawn around their provider or medical director**, in HIPAA-conscious, non-clinical workflows: the system handles scheduling, deposits, reminders and admin, and stops where clinical information begins — anything clinical goes to your own records and your own people to decide.",
    keeps: [
      "All treatment suitability and clinical judgment",
      "Prescriber assessment before any prescription-only medicine",
      "Medical history and contraindication decisions",
      "Complications, complaints and refunds",
      "Before-and-after imagery and testimonial approval",
      "Marketing consent decisions",
    ],
  },
  process: {
    heading: "Live in weeks, *starting with one journey*",
    lead: "Replacement is a last resort. Configuration, then one proven journey, then the next.",
    steps: [
      {
        title: "Clinic review",
        body: "Treatments, consultation types, clinicians, rooms and current inquiry routes.",
      },
      {
        title: "Rule definition",
        body: "Deposits, notice periods, screening handoff and prescriber escalation.",
      },
      {
        title: "Language guardrails",
        body: "Approved treatment wording; prescription-only naming blocked at source.",
      },
      {
        title: "One journey first",
        body: "Usually first-reply speed or deposit-secured consultation booking.",
      },
      {
        title: "Integration test",
        body: "Diary, payments and patient records proven before anything goes live.",
      },
      {
        title: "Refine on behavior",
        body: "Follow-up timing and recall cadence tuned from real clinic data.",
      },
    ],
  },
  fit: {
    heading: "Is this *your clinic or med spa*?",
    lead: "The strongest results come from clinics and med spas with real inquiry volume and a willingness to write their rules down.",
    right: [
      "Inquiries arriving faster than you can answer them",
      "Consultations you would like secured by deposit",
      "Defined treatment menu and consultation types",
      "A named prescriber, provider or medical director owning clinical decisions",
    ],
    caution:
      "Not a fit where clinical screening is expected to be automated, where prescription-only medicines would be named in public marketing, or where past clients would be messaged without consent.",
  },
  faqs: {
    heading: "Common questions",
    items: [
      {
        q: "Can the system mention Botox or filler brands to inquirers?",
        a: "No, and that is deliberate. Botulinum toxin and many dermal fillers are prescription-only medicines, which UK rules do not permit advertising to the public. Public-facing replies use approved treatment-category language, and **brand naming is blocked at source** rather than corrected later. The same default is applied for US med spas: replies name the treatment category your clinic has approved, not a product.",
      },
      {
        q: "Will it give clinical or suitability advice?",
        a: "Never. It collects what a clinician needs and arranges the appointment. Screening, contraindications, suitability and any prescribing decision stay with your prescriber, provider or medical director, who assesses the patient themselves.",
      },
      {
        q: "How are consultation deposits handled?",
        a: "Exactly to your published terms. The consultation is confirmed once the deposit is taken; failed payments, refunds and disputes route to a person with the full context.",
      },
      {
        q: "Can it answer Instagram DMs as well as calls and forms?",
        a: "Yes — DM, WhatsApp, web form and phone are handled by one system against one diary, so the same rules and the same availability apply on every channel.",
      },
      {
        q: "Will follow-up feel like spam to our clients?",
        a: "It fires from real appointment and treatment status, not a mailing list. Sequences stop on a booking or an opt-out, and recall respects each treatment's own interval.",
      },
      {
        q: "How quickly can a clinic go live?",
        a: "One journey at a time, typically within weeks. We prove the diary, payment and records integrations before anything reaches a client. The **Seven-Day Booking Conversion Sprint** above is the fastest route in: a fixed scope delivered inside seven business days.",
      },
      {
        q: "What does the [[£1,500|$1,950]] seven-day sprint actually include?",
        a: "Six things: a website conversion redesign, a rebuilt mobile booking journey, immediate response to new website inquiries, a three-message inquiry follow-up sequence, booking and conversion tracking, and delivery inside seven business days. **[[£750|$975]] to begin and [[£750|$975]] when it launches**, with maintenance or wider automation optional afterwards.",
      },
      {
        q: "What happens if it is not live in seven days?",
        a: "The agreed system will be live within seven business days of receiving the required content and access, or the final payment will not be due until it is live. The clock starts when your content and logins are with us, not when the call ends — and we list exactly what is needed before anything is paid.",
      },
      {
        q: "Do you work with US med spas as well as UK clinics?",
        a: "Yes. Med spas and aesthetic practices across the US run the same system as our UK clinics — what changes is the booking platform, the deposit rules and who signs off. US builds are designed as **HIPAA-conscious, non-clinical workflows**: scheduling, deposits, reminders and admin, stopping where clinical information begins, with assessment left to your provider or medical director.",
      },
      {
        q: "How is texting and calling US clients handled?",
        a: "As a design property, not an afterthought. Texts and calls to US numbers go only to people who gave consent at the point of inquiry; every message carries a plain opt-out; a stop request is honored immediately and across every channel; and sending is held inside the recipient's local calling hours. Those TCPA-shaped rules are written into the workflow, and your clinic sets the cadence on top of them.",
      },
      {
        q: "How is marketing email to US clients set up?",
        a: "Commercial email is built to CAN-SPAM-shaped rules: a sender name and subject line that describe the message accurately, your clinic's real physical address in the footer, and an unsubscribe link that works on the first click and stops the sequence immediately rather than at the next send. Transactional confirmations and reminders stay separate from marketing, so opting out of one never breaks the other.",
      },
      {
        q: "Can a US med spa pay in dollars, and how do time zones work?",
        a: "Prices are published in both currencies — the sprint is [[£1,500|$1,950]], [[£750|$975]] to begin and [[£750|$975]] on launch — and the invoicing currency is agreed at proposal. Coverage does not depend on office hours: the first reply is automated, so an inquiry at 11pm in Phoenix is answered in seconds, and calls are offered in your own local time.",
      },
      {
        q: "Why only one clinic a week?",
        a: "Because a seven-day delivery window only holds if one clinic has the whole week. We take a single sprint on at a time; when this week's is filled the next one opens. **The price and the scope do not change** — only the start date does.",
      },
    ],
  },
  /*
   * Deliberately the *lower* rung of the ladder, and deliberately placed after
   * the implementation detail rather than before it. The seven-day sprint is
   * the page's headline ask; this is what a clinician who has read the whole
   * page and is not ready to commit £1,500 today can say yes to instead.
   */
  midCta: {
    heading: "Not ready for the sprint? *Bring one week of inquiries*",
    body: "We will map where they arrived, how long they waited and which ones were still winnable — then show you what a deposit-secured consultation path would have caught. No sprint, no commitment.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "One clinic a week. *This week's is still open.*",
    body: "One call covers both: the seven-day sprint on your booking journey, and the wider consultation path behind it — first reply, screening handoff, deposit, follow-up and recall. See [how we deliver](/how-we-work) and [how scope shapes pricing](/pricing).",
    reassurance:
      "No obligation · [[£750|$975]] to begin, [[£750|$975]] on launch · no platform migration assumed · no clinical advice or prescription-only naming, ever.",
    buttonLabel: "Claim this week's sprint",
  },
  related: [
    {
      href: "/services/ai-receptionists",
      label: "Related service",
      title: "AI Receptionists",
    },
    {
      href: "/services/web-design-development",
      label: "Related service",
      title: "Web Design & Development",
    },
    { href: "/industry", label: "Industries", title: "All industries" },
  ],
};
