import {
  INDUSTRY_ATTRIBUTION,
  INDUSTRY_CLARIFICATION,
  type IndustryCopy,
} from "../types";

export const estateAgentsCopy: IndustryCopy = {
  route: "/industry/estate-agents",
  sector: "Estate agents",
  routeEntry: {
    loaderText:
      "Mapping the route from first property enquiry to the right branch conversation.",
    pill: "Property enquiry operating system",
    title: "Respond while the opportunity is still live",
    subtitle:
      "A connected layer for portal leads, calls, viewing requests, valuation enquiries and branch follow-up—built around the way UK agencies actually work.",
    buttonLabel: "Explore the enquiry journey",
  },
  seo: {
    title: "AI Automation for Estate Agents UK | Silverstone AI",
    description:
      "Connect portal, phone and website enquiries to qualification, viewing requests, CRM updates and human branch follow-up with estate agent automation built for UK workflows.",
    h1: "Turn property enquiries into owned branch conversations",
  },
  eyebrow: "AI automation for estate agents",
  h1: "Turn property enquiries into owned branch conversations",
  heroSub:
    "Property demand does not wait for the branch to become quiet. Silverstone builds a controlled enquiry layer that captures portal, phone and web demand, assigns ownership and advances the next valid step — while interest is still current.",
  heroPoints: [
    "One intake across portals, phone and web",
    "Viewing and valuation routes with named owners",
    "Valuation and negotiation stay with your people",
  ],
  trustTokens: ["Portal-aware", "Diary-controlled", "CRM-owned", "Human-led judgement"],
  problem: {
    heading: "Where instructions leak before a negotiator responds",
    body: "A buyer opens three portal listings. A vendor requests two valuations. A landlord calls while the lettings team is in a property. By the time an unstructured inbox is reviewed, the most valuable conversation may already belong to another agency. Speed alone doesn't fix it — a fast acknowledgement with no owner is just a quicker dead end.",
    cards: [
      {
        title: "Portal speed without branch ownership",
        body: "A fast acknowledgement is wasted when no negotiator owns the next step.",
      },
      {
        title: "Three inboxes, one customer",
        body: "Phone, portal and website activity should converge on one record — not three.",
      },
      {
        title: "Diary promises without diary truth",
        body: "Only authoritative availability should ever be offered to a buyer.",
      },
      {
        title: "Valuation demand buried in routine traffic",
        body: "High-intent vendor enquiries need distinct routing and follow-up.",
      },
    ],
  },
  journey: {
    heading: "One enquiry journey across portals, phone and web",
    lead: "Every enquiry answers three questions: what is this person trying to do, which source of truth should the system consult, and who is accountable for the next decision?",
    stages: [
      {
        title: "Capture and identify",
        body: "Channel, property reference, contact details and declared intent are recorded — only the approved questions needed to tell a viewing request from a valuation, lettings or management enquiry.",
      },
      {
        title: "Route and record",
        body: "Branch, department and owner rules apply. The enquiry is written to your CRM once, with duplicate checks and a visible status — no reconstructing conversations from three inboxes.",
      },
      {
        title: "Offer the next valid step",
        body: "Where the diary is authoritative, permitted viewing options are presented or a valuation callback is arranged. The system never invents a slot.",
      },
      {
        title: "Follow through",
        body: "Confirmations, reminders, reschedules and feedback requests trigger from real status changes. A failed handoff gets an owner instead of disappearing.",
      },
      {
        title: "Escalate judgement",
        body: "Negotiation, complaints, disputed facts, material information and valuation decisions move immediately to people — with context attached.",
      },
    ],
  },
  workflows: {
    heading: "Different workflows for different parts of the agency",
    lead: "Sales, lettings and property management do not share one script — so they don't share one workflow.",
    items: [
      {
        title: "Sales",
        body: "Capture property interest, buyer position and preferred viewing times; route valuation requests; keep confirmations and feedback on the correct record.",
      },
      {
        title: "Lettings",
        body: "Distinguish applicant, tenant and landlord needs; collect approved qualification details; coordinate viewings without making suitability or financial decisions.",
      },
      {
        title: "Property management",
        body: "Categorise routine messages, attach property and tenancy context, and direct urgent or sensitive matters to the correct human queue.",
      },
      {
        title: "Multi-branch operations",
        body: "Apply postcode, department and ownership logic consistently, while managers see unassigned or stalled enquiries before they become lost fees.",
      },
    ],
  },
  services: {
    heading: "The architecture behind the switchboard",
    lead: "The combination is selected after your current process is understood — it is not a pre-packaged stack.",
    paragraphs: [
      "A typical build combines [AI reception for property enquiries](/services/ai-receptionists), [voice handling for missed calls](/services/ai-voice-agents) and [connected automation workflows](/services/ai-automation) around your CRM and diary.",
      "Where the website itself leaks demand, a [conversion-led estate agency web journey](/services/web-design-development) closes the gap; [AI and automation consulting](/services/ai-consulting) shapes the architecture before anything is built.",
    ],
  },
  proof: {
    heading: "Measured where it matters",
    lead: "Silverstone AI delivery results for estate agency enquiry systems — acknowledgement speed, viewing progression and the admin load your branch carries.",
    metrics: [
      {
        id: "benchmark-098",
        value: "<10 seconds",
        label: "Response time",
        basis: "after implementation",
      },
      { id: "benchmark-099", value: "2.4x", label: "Viewings increase" },
      { id: "benchmark-097", value: "-77%", label: "Reduction in admin time" },
    ],
    attribution: INDUSTRY_ATTRIBUTION,
    clarification: INDUSTRY_CLARIFICATION,
  },
  boundary: {
    heading: "What remains with your people",
    body: "Local knowledge is not a defect to automate away. The system surfaces the right record and prepares the next action; the agency remains accountable for what is said and decided. Staff spend less time assembling context and more time using it.",
    keeps: [
      "Property valuation and pricing recommendations",
      "Negotiation and offer handling",
      "Complaints, redress and legal decisions",
      "Material information and imagery accuracy",
      "Any conversation requiring professional judgement",
    ],
  },
  process: {
    heading: "How Silverstone designs the system",
    lead: "We begin with your live operating model, not a preferred tool.",
    steps: [
      {
        title: "Map demand",
        body: "Channels, enquiry types, volume, peaks and current failure points.",
      },
      {
        title: "Define authority",
        body: "CRM, diary, property data, branch ownership and escalation rules.",
      },
      {
        title: "Design the first journey",
        body: "One high-value route — portal enquiry to viewing, or valuation lead to branch callback.",
      },
      {
        title: "Test edge cases",
        body: "Duplicates, unavailable slots, out-of-hours demand, reschedules and failed integrations.",
      },
      {
        title: "Launch with measurement",
        body: "Completion, exception and staff-intervention rates monitored from day one.",
      },
      {
        title: "Optimise deliberately",
        body: "Questions, routing and follow-up improve only when evidence supports the change.",
      },
    ],
  },
  fit: {
    heading: "Is Silverstone the right fit?",
    lead: "The strongest results come from agencies ready to define ownership.",
    right: [
      "Repeated enquiry volume across several channels",
      "A named owner for the CRM or diary",
      "Leadership prepared to define branch rules",
      "Staff re-keying, chasing or coordinating the same information",
    ],
    caution:
      "It may not be the right fit where there is no agreed source of truth, no owner for exceptions, or an expectation that automation should value property, negotiate or make compliance decisions on its own.",
  },
  faqs: {
    heading: "Questions agency leaders ask",
    items: [
      {
        q: "Can this work with our current CRM and portals?",
        a: "Usually, provided the relevant systems expose reliable data or integration methods. Discovery confirms what can be read, written or triggered safely before any promise is made.",
      },
      {
        q: "Will callers or portal leads know they are dealing with automation?",
        a: "The experience is transparent and written in your agency's tone. It never impersonates a named negotiator or conceals when a person will take over.",
      },
      {
        q: "Can it book viewings automatically?",
        a: "It can offer or request slots only where the diary and branch rules are authoritative. Some agencies allow direct booking; others keep confirmation with the branch.",
      },
      {
        q: "How do you prevent bad CRM data?",
        a: "Minimum-data rules, validation, duplicate checks, controlled fields and an owned exception queue — write-back is tested against real branch scenarios before launch.",
      },
      {
        q: "What happens to complaints or valuation questions?",
        a: "They stop the automated path and move to a named human owner with the available context attached.",
      },
    ],
  },
  midCta: {
    heading: "Review the enquiry architecture",
    body: "Bring one recent enquiry that became slow, duplicated or difficult to own. We'll use it to examine the operating system around the conversation — not to sell a generic bot.",
    buttonLabel: "Book a discovery call",
  },
  finalCta: {
    heading: "Review your enquiry operation",
    body: "A discovery call examines one real journey: where enquiries arrive, how ownership is assigned, what can be offered immediately, what must reach a negotiator and how success should be measured. See [how Silverstone works](/how-we-work) or [how scope shapes pricing](/pricing).",
    reassurance:
      "30 minutes. No technical preparation required. A useful first conversation ends with a clear fit, no-fit or next investigation — not a forced proposal.",
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
