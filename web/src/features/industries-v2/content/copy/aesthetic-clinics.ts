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
  h1: "Turn interest into *booked, deposit-backed consultations*",
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
    heading: "Same DM. *Your* consultation pathway.",
    lead: "A DM to a med spa in Scottsdale and one to a clinic in Manchester are answered by the same system. The consultation workflow is identical; the booking platform, the deposit rules and who signs off change.",
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
          "Consults, injectors, treatment series, memberships, your medical director.",
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
        body: "Every new website inquiry gets an answer in seconds rather than the next morning — written to UK advertising rules, naming no prescription-only medicine.",
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
    heading: "Speed, deposits and follow-through — *the three that decide it*",
    lead: "Aesthetic inquiries are comparison-shopped within the hour. These are the journeys that decide who gets the consultation.",
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
        body: "Most inquiries do not convert on the first exchange. A sequenced, value-adding follow-up runs to your cadence and stops the moment someone books or opts out.",
      },
      {
        title: "Treatment-cycle recall",
        body: "Anti-wrinkle intervals, filler review points and skin-course sessions each carry their own timing — prompted from real treatment history, with consent, never as a blast.",
      },
    ],
  },
  journey: {
    heading: "The rules that make an aesthetic booking *safe to automate*",
    lead: "A skin consultation and an injectable review are not the same appointment and must never share one script. We write your real rules down first.",
    stages: [
      {
        title: "Treatment category",
        body: "Inquiries resolved by category and outcome — never by naming a prescription-only product.",
      },
      {
        title: "Consultation type",
        body: "Free consultation, paid assessment or review — each with its own duration, room and clinician.",
      },
      {
        title: "Commercial terms",
        body: "Deposit value, notice period and rescheduling rules applied exactly as you have written them.",
      },
      {
        title: "Screening handoff",
        body: "Medical history, contraindications and suitability are collected for a clinician — and decided by one.",
      },
      {
        title: "Prescriber gate",
        body: "Anything requiring a prescriber's assessment pauses automation and reaches your clinician with full context.",
      },
    ],
  },
  services: {
    heading: "Built around the clinic software you already run",
    lead: "We do not open by replacing your diary, records or payment provider — we open by testing them.",
    paragraphs: [
      "An [AI receptionist for clinic inquiries](/services/ai-receptionists) answers routine questions and books consultations, while [voice handling](/services/ai-voice-agents) captures the calls that ring out during treatment.",
      "[Deposit, follow-up and recall workflows](/services/ai-automation) coordinate your diary, payments and patient records; a [clinic website](/services/web-design-development) and a governed [content system](/services/content-creation) keep treatment pages and campaigns inside UK advertising rules.",
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
    body: "Botulinum toxin and many dermal fillers are prescription-only medicines: UK rules do not permit advertising them to the public, and a prescriber must assess the patient themselves. **So the system arranges appointments — it does not assess, advise, recommend or name a POM.** Public-facing replies, captions and pages are written to that boundary by default, not policed afterwards.",
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
    heading: "Is this *your clinic*?",
    lead: "The strongest results come from clinics with real inquiry volume and a willingness to write their rules down.",
    right: [
      "Inquiries arriving faster than you can answer them",
      "Consultations you would like secured by deposit",
      "Defined treatment menu and consultation types",
      "A named clinician or prescriber owning clinical decisions",
    ],
    caution:
      "Not a fit where clinical screening is expected to be automated, where prescription-only medicines would be named in public marketing, or where past clients would be messaged without consent.",
  },
  faqs: {
    heading: "Common questions",
    items: [
      {
        q: "Can the system mention Botox or filler brands to inquirers?",
        a: "No, and that is deliberate. Botulinum toxin and many dermal fillers are prescription-only medicines, which UK rules do not permit advertising to the public. Public-facing replies use approved treatment-category language, and **brand naming is blocked at source** rather than corrected later.",
      },
      {
        q: "Will it give clinical or suitability advice?",
        a: "Never. It collects what a clinician needs and arranges the appointment. Screening, contraindications, suitability and any prescribing decision stay with your prescriber, who assesses the patient themselves.",
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
