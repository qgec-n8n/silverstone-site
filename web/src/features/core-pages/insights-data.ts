/**
 * Insights hub data: the 16-category taxonomy (7 services + 9 industries)
 * and the article-card records that back the searchable/filterable grid.
 *
 * Every article is `status: "planned"` — a real editorial topic Silverstone
 * intends to publish, not a fabricated case study. The shape already carries
 * `publishedDate` and `href`, so flipping a record to `status: "published"`
 * with those two fields filled in is the only change needed once an article
 * is actually written and reviewed; the card UI already knows how to render
 * both states.
 */

export type InsightCategoryGroup = "service" | "industry";

export type InsightCategory = {
  group: InsightCategoryGroup;
  href: string;
  id: string;
  label: string;
};

export const INSIGHT_CATEGORIES: InsightCategory[] = [
  {
    id: "web-design-development",
    label: "Web Design & Development",
    group: "service",
    href: "/services/web-design-development",
  },
  {
    id: "app-development",
    label: "App Development",
    group: "service",
    href: "/services/app-development",
  },
  {
    id: "ai-voice-agents",
    label: "AI Voice Agents",
    group: "service",
    href: "/services/ai-voice-agents",
  },
  {
    id: "ai-receptionists",
    label: "AI Receptionists",
    group: "service",
    href: "/services/ai-receptionists",
  },
  {
    id: "ai-automation",
    label: "AI Automation",
    group: "service",
    href: "/services/ai-automation",
  },
  {
    id: "ai-consulting",
    label: "AI & Automation Consulting",
    group: "service",
    href: "/services/ai-consulting",
  },
  {
    id: "content-creation",
    label: "Content Creation",
    group: "service",
    href: "/services/content-creation",
  },
  {
    id: "estate-agents",
    label: "Estate Agents",
    group: "industry",
    href: "/industry/estate-agents",
  },
  {
    id: "hospitality",
    label: "Hospitality",
    group: "industry",
    href: "/industry/hospitality",
  },
  {
    id: "salons-barbers",
    label: "Salons & Barbers",
    group: "industry",
    href: "/industry/salons-barbers",
  },
  {
    id: "trades",
    label: "Trades & Home Services",
    group: "industry",
    href: "/industry/trades",
  },
  {
    id: "ecommerce",
    label: "eCommerce Brands",
    group: "industry",
    href: "/industry/ecommerce",
  },
  {
    id: "physios-chiropractors",
    label: "Physio & Chiropractic",
    group: "industry",
    href: "/industry/physios-chiropractors",
  },
  {
    id: "dentists",
    label: "Dental Practices",
    group: "industry",
    href: "/industry/dentists",
  },
  {
    id: "gyms-fitness-studios",
    label: "Gyms & Fitness Studios",
    group: "industry",
    href: "/industry/gyms-fitness-studios",
  },
  {
    id: "fitness-coaches",
    label: "Fitness Coaches",
    group: "industry",
    href: "/industry/fitness-coaches",
  },
];

export type InsightArticle = {
  categoryId: string;
  href?: string;
  id: string;
  imageAlt: string;
  imageSrc: string;
  publishedDate?: string;
  status: "planned" | "published";
  summary: string[];
  title: string;
};

const categoryLabel = (id: string): string =>
  INSIGHT_CATEGORIES.find((category) => category.id === id)?.label ?? id;

export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    id: "web-first-release-scope",
    categoryId: "web-design-development",
    title: "Choosing the right first release for a conversion-focused website",
    summary: [
      "Which pages and journeys actually earn a place in v1",
      "Separating measurement infrastructure from launch-day scope",
      "What to defer without losing momentum",
    ],
    status: "planned",
    imageSrc: "/approved-images/general-services-1-mobile.png",
    imageAlt: "Conversion-focused website interface on a mobile device.",
  },
  {
    id: "app-v1-scoping",
    categoryId: "app-development",
    title: "What belongs in v1: scoping a maintainable internal or customer app",
    summary: [
      "Separating the workflow that must ship from the one that can wait",
      "Data ownership and integration risk before the build starts",
      "Why a smaller first release is usually the safer one",
    ],
    status: "planned",
    imageSrc: "/approved-images/services_data_integration.jpg",
    imageAlt: "Data integration pipeline diagram for a custom application.",
  },
  {
    id: "voice-agent-handover",
    categoryId: "ai-voice-agents",
    title: "Designing call flows that know when to hand over to a person",
    summary: [
      "Setting escalation triggers before launch, not after a complaint",
      "Latency, consent and the moments that need a human tone",
      "What good call logging looks like for later review",
    ],
    status: "planned",
    imageSrc: "/approved-images/services_lead_followup.jpg",
    imageAlt: "Call workflow and lead follow-up sequence illustration.",
  },
  {
    id: "receptionist-routing-rules",
    categoryId: "ai-receptionists",
    title: "Enquiry routing rules that protect response time without adding headcount",
    summary: [
      "Qualifying enquiries before they reach a person",
      "Setting fallback rules for out-of-hours and edge cases",
      "Measuring response time as a commercial metric, not a vanity one",
    ],
    status: "planned",
    imageSrc: "/approved-images/receptionists-hero.png",
    imageAlt: "AI receptionist enquiry-handling interface.",
  },
  {
    id: "map-before-automate",
    categoryId: "ai-automation",
    title: "Mapping a workflow before you automate it: data, exceptions, ownership",
    summary: [
      "Why the exception path matters more than the happy path",
      "Naming a human owner before anything goes live",
      "What to log so the system improves after launch",
    ],
    status: "planned",
    imageSrc: "/approved-images/services_workflow_automation.jpg",
    imageAlt: "Workflow automation diagram connecting systems and approvals.",
  },
  {
    id: "choosing-ai-partner",
    categoryId: "ai-consulting",
    title: "Choosing the right AI partner: what a credible proposal should contain",
    summary: [
      "Questions a proposal should answer before you sign",
      "How agency, consultancy, platform and freelancer models differ",
      "Spotting a project shaped around a tool instead of a problem",
    ],
    status: "planned",
    imageSrc: "/approved-images/services_consulting.jpg",
    imageAlt: "Advisory consulting session reviewing a technology roadmap.",
  },
  {
    id: "governed-content-systems",
    categoryId: "content-creation",
    title: "Governed content systems: authority assets without losing control of tone",
    summary: [
      "Setting review gates that don't slow publishing to a crawl",
      "Keeping brand voice consistent across repurposed formats",
      "What still needs a human sign-off before it goes out",
    ],
    status: "planned",
    imageSrc: "/approved-images/general-services-2a.png",
    imageAlt: "Content production workflow across multiple formats.",
  },
  {
    id: "estate-agent-enquiry-qualification",
    categoryId: "estate-agents",
    title: "Qualifying property enquiries before they reach a viewing",
    summary: [
      "Filtering serious buyers and tenants from early browsing",
      "Automating the follow-up that usually gets missed",
      "Keeping a negotiator's calendar realistic",
    ],
    status: "planned",
    imageSrc: "/approved-images/Real_Estate_1.jpeg",
    imageAlt: "Estate agency storefront with property listings displayed.",
  },
  {
    id: "hospitality-irregular-demand",
    categoryId: "hospitality",
    title: "Booking and enquiry flows for venues with irregular demand",
    summary: [
      "Handling peaks without over-staffing the phone line",
      "Where automation helps and where it should stay hands-off",
      "Turning missed calls into a measurable recovery rate",
    ],
    status: "planned",
    imageSrc: "/approved-images/Hospitality_1.jpeg",
    imageAlt: "Hospitality venue interior prepared for service.",
  },
  {
    id: "salon-no-shows",
    categoryId: "salons-barbers",
    title: "Reducing no-shows without discounting your calendar",
    summary: [
      "Reminder timing that actually changes behaviour",
      "Deposit and policy design that clients accept",
      "What to automate versus what still needs a phone call",
    ],
    status: "planned",
    imageSrc: "/approved-images/Salon_1.jpeg",
    imageAlt: "Salon interior with booking chairs and styling stations.",
  },
  {
    id: "trades-quoting-scheduling",
    categoryId: "trades",
    title: "Quoting and scheduling for jobs booked days in advance",
    summary: [
      "Turning a call-out into a quote without back-and-forth",
      "Keeping a working calendar realistic for one-person teams",
      "Where automated reminders reduce wasted call-outs",
    ],
    status: "planned",
    imageSrc: "/approved-images/Trades_1.jpeg",
    imageAlt: "Tradesperson on site preparing a job estimate.",
  },
  {
    id: "ecommerce-support-load",
    categoryId: "ecommerce",
    title: "Order and returns automation that protects the support team's time",
    summary: [
      "Which order-status questions never need a human reply",
      "Designing a returns flow that reduces repeat contacts",
      "Where escalation still needs to reach a real person fast",
    ],
    status: "planned",
    imageSrc: "/approved-images/ecommerce-1.png",
    imageAlt: "eCommerce storefront and order management dashboard.",
  },
  {
    id: "physio-intake-rebooking",
    categoryId: "physios-chiropractors",
    title: "Intake and rebooking systems for care-led practices",
    summary: [
      "Collecting the right intake detail before the first session",
      "Rebooking prompts that respect a clinical relationship",
      "Keeping records clean without adding admin time",
    ],
    status: "planned",
    imageSrc: "/approved-images/physio-1.png",
    imageAlt: "Physiotherapy treatment room prepared for a patient session.",
  },
  {
    id: "dental-recall-reminders",
    categoryId: "dentists",
    title: "Recall and reminder systems that reduce missed appointments",
    summary: [
      "Recall timing that fits a clinical, not retail, relationship",
      "Where SMS beats a phone call, and where it doesn't",
      "Measuring the real cost of a missed chair-time slot",
    ],
    status: "planned",
    imageSrc: "/approved-images/dentist-1.png",
    imageAlt: "Dental practice reception and treatment area.",
  },
  {
    id: "gym-out-of-hours-enquiries",
    categoryId: "gyms-fitness-studios",
    title: "Membership enquiry handling outside staffed hours",
    summary: [
      "Answering pricing and trial questions the moment they're asked",
      "Routing serious sign-ups to a person without delay",
      "What to automate at the front desk versus on the floor",
    ],
    status: "planned",
    imageSrc: "/approved-images/gyms-1.png",
    imageAlt: "Gym floor with fitness equipment and studio space.",
  },
  {
    id: "coach-dm-to-client",
    categoryId: "fitness-coaches",
    title: "Turning direct-message enquiries into booked sessions",
    summary: [
      "Qualifying DMs before they eat into coaching time",
      "Automating the follow-up that usually gets forgotten",
      "Keeping replies personal even when the first step is automated",
    ],
    status: "planned",
    imageSrc: "/approved-images/onlinecoach-1.png",
    imageAlt: "Online fitness coach reviewing client programming.",
  },
];

export function insightArticleCategoryLabel(article: InsightArticle): string {
  return categoryLabel(article.categoryId);
}
