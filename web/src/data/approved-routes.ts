import type { FutureRouteRecord } from "~/data/route-schema";

type RouteOverride = Partial<FutureRouteRecord> & Pick<FutureRouteRecord, "id">;

function breadcrumb(name: string, path: string) {
  return { name, path };
}

const servicePages = [
  {
    id: "route-service-web-design-development",
    path: "/services/web-design-development",
    label: "Web Design & Development",
    title: "Custom Web Design & Development | Silverstone AI",
    description:
      "Custom web design and development for US and UK businesses: positioning, conversion copy, responsive engineering, technical SEO, CMS and integrations in one system.",
    h1: "Web design and development engineered to move buyers forward",
    primaryIntent:
      "web design and development agency for US and UK small businesses; conversion-led websites",
    contentId: "content-service-web-design-development",
    sourceFile: "docs/approved-copy/services/01_WEB_DESIGN_AND_DEVELOPMENT.md",
    relatedRouteIds: [
      "route-services",
      "route-service-ai-consulting",
      "route-services-estate-agents",
      "route-services-hospitality",
      "route-services-salons-barbers",
      "route-services-trades",
      "route-services-ecommerce",
      "route-services-physios-chiropractors",
    ],
  },
  {
    id: "route-service-app-development",
    path: "/services/app-development",
    label: "App Development",
    title: "Custom App Development | Silverstone AI",
    description:
      "Custom app development for US and UK businesses: product discovery, UX architecture, data, integrations, AI features and release planning around one core workflow.",
    h1: "Custom app development that starts small and proves value",
    primaryIntent:
      "custom app development for US and UK small and mid-sized businesses; mobile and web apps",
    contentId: "content-service-app-development",
    sourceFile: "docs/approved-copy/services/02_APP_DEVELOPMENT.md",
    relatedRouteIds: [
      "route-services",
      "route-service-ai-consulting",
      "route-services-estate-agents",
      "route-services-hospitality",
      "route-services-ecommerce",
      "route-services-physios-chiropractors",
      "route-services-dentists",
      "route-services-gyms-fitness-studios",
    ],
  },
  {
    id: "route-service-ai-voice-agents",
    path: "/services/ai-voice-agents",
    label: "AI Voice Agents",
    title: "AI Voice Agent Development | Silverstone AI",
    description:
      "AI voice agent development for US and UK businesses: conversation design, telephony, approved actions, transcripts, monitoring and human escalation for real calls.",
    h1: "AI voice agents for real conversations and real consequences",
    primaryIntent:
      "AI voice agents for US and UK small businesses; AI phone agent that answers, qualifies and books",
    contentId: "content-service-ai-voice-agents",
    sourceFile: "docs/approved-copy/services/03_AI_VOICE_AGENTS.md",
    relatedRouteIds: [
      "route-services",
      "route-service-ai-consulting",
      "route-services-estate-agents",
      "route-services-hospitality",
      "route-services-trades",
      "route-services-physios-chiropractors",
      "route-services-dentists",
      "route-services-gyms-fitness-studios",
    ],
  },
  {
    id: "route-service-ai-receptionists",
    path: "/services/ai-receptionists",
    label: "AI Receptionists",
    title: "AI Receptionist Services for Small Business | Silverstone AI",
    description:
      "AI receptionist services for US and UK businesses: calls, web chat, booking, reminders, CRM routing and human handoff designed around approved operating rules.",
    h1: "An AI receptionist that knows when to hand over",
    primaryIntent:
      "AI receptionist for US and UK small businesses; 24/7 AI answering and booking",
    contentId: "content-service-ai-receptionists",
    sourceFile: "docs/approved-copy/services/04_AI_RECEPTIONISTS.md",
    relatedRouteIds: [
      "route-services",
      "route-service-ai-consulting",
      "route-services-estate-agents",
      "route-services-hospitality",
      "route-services-salons-barbers",
      "route-services-trades",
      "route-services-ecommerce",
      "route-services-physios-chiropractors",
    ],
  },
  {
    id: "route-service-content-creation",
    path: "/services/content-creation",
    label: "Content Creation",
    title: "AI Content Systems & Repurposing | Silverstone AI",
    description:
      "AI-assisted content creation and repurposing for US and UK businesses: source capture, search intent, channel adaptation, approval gates and performance feedback.",
    h1: "AI content creation that turns your expertise into a system",
    primaryIntent:
      "AI content creation and repurposing for US and UK businesses; SEO content systems",
    contentId: "content-service-content-creation",
    sourceFile: "docs/approved-copy/services/05_CONTENT_CREATION.md",
    relatedRouteIds: [
      "route-services",
      "route-service-ai-consulting",
      "route-services-estate-agents",
      "route-services-hospitality",
      "route-services-salons-barbers",
      "route-services-trades",
      "route-services-ecommerce",
      "route-services-physios-chiropractors",
    ],
  },
  {
    id: "route-service-ai-automation",
    path: "/services/ai-automation",
    label: "AI Automation",
    title: "Workflow & AI Automation Agency | Silverstone AI",
    description:
      "AI automation and workflow systems for US and UK businesses: triggers, data movement, AI-assisted decisions, approvals, exceptions, observability and secure actions.",
    h1: "AI automation for the work between your systems",
    primaryIntent:
      "AI automation agency for US and UK businesses; AI agent workflows and back-office automation",
    contentId: "content-service-ai-automation",
    sourceFile: "docs/approved-copy/services/06_AI_AUTOMATION.md",
    relatedRouteIds: [
      "route-services",
      "route-service-ai-consulting",
      "route-services-estate-agents",
      "route-services-hospitality",
      "route-services-salons-barbers",
      "route-services-trades",
      "route-services-ecommerce",
      "route-services-physios-chiropractors",
    ],
  },
  {
    id: "route-service-ai-consulting",
    path: "/services/ai-consulting",
    label: "AI & Automation Consulting",
    title: "AI Consulting Services for UK & US Businesses | Silverstone AI",
    description:
      "AI consulting for UK and US businesses from a London AI automation agency: opportunity audits, workflow prioritization, data readiness, governance and build-versus-buy roadmaps.",
    h1: "AI consulting that settles what to automate before you buy",
    primaryIntent:
      "AI automation consulting for US and UK businesses; AI strategy and automation audit",
    contentId: "content-service-ai-consulting",
    sourceFile: "docs/approved-copy/services/07_AI_AND_AUTOMATION_CONSULTING.md",
    relatedRouteIds: [
      "route-services",
      "route-service-ai-automation",
      "route-service-app-development",
      "route-service-web-design-development",
      "route-how-we-work",
      "route-pricing",
      "route-book",
    ],
  },
];

export const approvedAdditionalRoutes: FutureRouteRecord[] = [
  {
    id: "route-industries",
    legacyRouteKey: "approved:/industry",
    path: "/industry",
    canonical: "https://silverstone-ai.com/industry",
    routeGroup: "industries",
    template: "core-marketing",
    lifecycle: "retained",
    legacyDisposition: "new",
    implementationDisposition: "create",
    contentDisposition: "create",
    title: "Industries We Support | Silverstone AI",
    description:
      "Sector-specific AI reception, booking, follow-up and back-office systems for ten industries across the US and UK, with the judgment calls kept human.",
    h1: "AI automation built for how your industry actually works",
    headingPlan: {
      h1: "AI automation built for how your industry actually works",
      h1Source: "H-01 approved metadata map",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    productionIndexable: true,
    sitemap: true,
    breadcrumbs: [breadcrumb("Home", "/"), breadcrumb("Industries", "/industry")],
    schemaTypes: ["CollectionPage", "ItemList", "BreadcrumbList"],
    contentId: "content-industries",
    sourceFile:
      "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/sitewide-copy-v1.md",
    sourcePath:
      "/docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/sitewide-copy-v1.md",
    migrationOwner: "Codex content implementation",
    contentOwner: "Silverstone editorial review",
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent: "AI automation by industry for US and UK businesses",
    ctaIntent: "industry discovery",
    parentRouteId: null,
    relatedRouteIds: [
      "route-services-estate-agents",
      "route-services-hospitality",
      "route-services-salons-barbers",
      "route-industry-aesthetic-clinics",
      "route-services-trades",
      "route-services-ecommerce",
      "route-services-physios-chiropractors",
      "route-services-dentists",
      "route-services-gyms-fitness-studios",
      "route-services-fitness-coaches",
    ],
    migrationEvidence:
      "H-01 content pack + provenance reconciliation + H-03/H-04 safety rules",
    acceptanceIds: ["AC-003", "AC-004", "AC-006", "AC-007"],
    unresolvedNotes: [],
  },
  {
    id: "route-how-we-work",
    legacyRouteKey: "approved:/how-we-work",
    path: "/how-we-work",
    canonical: "https://silverstone-ai.com/how-we-work",
    routeGroup: "company",
    template: "core-marketing",
    lifecycle: "retained",
    legacyDisposition: "new",
    implementationDisposition: "create",
    contentDisposition: "create",
    title: "How Silverstone AI Works | Discovery to Delivery",
    description:
      "How Silverstone AI diagnoses, scopes, designs, builds and governs AI voice, reception, automation, website and app systems for US and UK businesses.",
    h1: "How we take AI automation from problem to working system",
    headingPlan: {
      h1: "How we take AI automation from problem to working system",
      h1Source: "H-01 approved metadata map",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    productionIndexable: true,
    sitemap: true,
    breadcrumbs: [breadcrumb("Home", "/"), breadcrumb("How we work", "/how-we-work")],
    schemaTypes: ["WebPage", "BreadcrumbList"],
    contentId: "content-how-we-work",
    sourceFile:
      "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/sitewide-copy-v1.md",
    sourcePath:
      "/docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/sitewide-copy-v1.md",
    migrationOwner: "Codex content implementation",
    contentOwner: "Silverstone editorial review",
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent:
      "how Silverstone AI delivers AI automation projects for US and UK businesses",
    ctaIntent: "booking",
    parentRouteId: null,
    relatedRouteIds: ["route-services", "route-pricing", "route-book", "route-contact"],
    migrationEvidence:
      "H-01 content pack + provenance reconciliation + H-04 assurance rules",
    acceptanceIds: ["AC-003", "AC-004", "AC-006", "AC-007"],
    unresolvedNotes: [
      "Public assurance wording is draft-safe only. Contractual terms remain legal review items before production release.",
    ],
  },
  ...servicePages.map<FutureRouteRecord>((service) => ({
    id: service.id,
    legacyRouteKey: `approved:${service.path}`,
    path: service.path,
    canonical: `https://silverstone-ai.com${service.path}`,
    routeGroup: "services",
    template: "service",
    lifecycle: "retained",
    legacyDisposition: "new",
    implementationDisposition: "create",
    contentDisposition: "create",
    title: service.title,
    description: service.description,
    h1: service.h1,
    headingPlan: {
      h1: service.h1,
      h1Source: "H-01 approved metadata map",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    productionIndexable: true,
    sitemap: true,
    breadcrumbs: [
      breadcrumb("Home", "/"),
      breadcrumb("Services", "/services"),
      breadcrumb(service.label, service.path),
    ],
    schemaTypes: ["Service", "WebPage", "BreadcrumbList"],
    contentId: service.contentId,
    sourceFile: service.sourceFile,
    sourcePath: `/${service.sourceFile}`,
    migrationOwner: "Codex content implementation",
    contentOwner: "Silverstone editorial review",
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent: service.primaryIntent,
    ctaIntent: "booking",
    parentRouteId: "route-services",
    relatedRouteIds: service.relatedRouteIds,
    migrationEvidence:
      "H-01 content pack + provenance reconciliation + H-03/H-04 safety rules",
    acceptanceIds: ["AC-003", "AC-004", "AC-006", "AC-007"],
    unresolvedNotes: [],
  })),
  /*
   * Skin & Aesthetic Clinics (added 2026-08-05). The tenth industry and the
   * first with no legacy `/services/<industry>` predecessor, so it is a full
   * record here rather than an override on the generated baseline manifest —
   * there is nothing in the baseline to override. No 301 is needed for the
   * same reason: the path has never existed publicly.
   */
  {
    id: "route-industry-aesthetic-clinics",
    legacyRouteKey: "approved:/industry/aesthetic-clinics",
    path: "/industry/aesthetic-clinics",
    canonical: "https://silverstone-ai.com/industry/aesthetic-clinics",
    routeGroup: "industries",
    template: "industry",
    lifecycle: "retained",
    legacyDisposition: "new",
    implementationDisposition: "create",
    contentDisposition: "create",
    title: "Aesthetic Clinic & Med Spa Automation | Silverstone AI",
    description:
      "Seven-Day Booking Conversion Sprint for aesthetic clinics and med spas: £1,500 ($1,950), half to begin. Turn inquiries into deposit-secured consultations, with clinical judgment kept with your prescriber or provider.",
    h1: "Aesthetic clinic automation that books deposit-backed consults",
    headingPlan: {
      h1: "Aesthetic clinic automation that books deposit-backed consults",
      h1Source: "industries-v2 hero copy (2026-08-05); reconciled with Service schema",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    productionIndexable: true,
    sitemap: true,
    breadcrumbs: [
      breadcrumb("Home", "/"),
      breadcrumb("Industries", "/industry"),
      breadcrumb("Skin & Aesthetic Clinics", "/industry/aesthetic-clinics"),
    ],
    schemaTypes: ["WebPage", "Service", "BreadcrumbList"],
    contentId: "content-industry-aesthetic-clinics",
    sourceFile: "web/src/features/industries-v2/content/copy/aesthetic-clinics.ts",
    sourcePath: "/web/src/features/industries-v2/content/copy/aesthetic-clinics.ts",
    migrationOwner: "Silverstone route implementation",
    contentOwner: "Silverstone editorial review",
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent:
      "aesthetic clinic and med spa automation for US and UK clinics; AI receptionist for med spas and aesthetic clinics; HIPAA-conscious, non-clinical workflows",
    ctaIntent: "booking",
    parentRouteId: "route-industries",
    relatedRouteIds: [
      "route-service-ai-receptionists",
      "route-service-web-design-development",
      "route-service-ai-automation",
      "route-service-content-creation",
    ],
    migrationEvidence:
      "New sector page; copy authored against UK POM advertising rules and the live Aesthetics by Clouds client build",
    acceptanceIds: ["AC-003", "AC-004", "AC-006", "AC-007"],
    unresolvedNotes: [
      "Carries a live commercial offer (Seven-Day Booking Conversion Sprint, £1,500 / £750 + £750). Price, payment split, delivery window and guarantee sentence are authored in copy/aesthetic-clinics.ts `sprint` and must be re-checked against the current sales script whenever either changes.",
    ],
  },
];

export const approvedRouteOverrides: RouteOverride[] = [
  {
    // Launch indexing policy (2026-07-07): every production route is
    // indexable except the privacy policy, which stays reachable but out of
    // the index and the sitemap.
    id: "route-privacy-policy",
    productionIndexable: false,
    sitemap: false,
  },
  {
    id: "route-home",
    // 2026-07-15 SEO pass: descriptive title replacing the generic
    // "Home | Silverstone AI"; phrasing mirrors the approved description and
    // the social-card alt ("websites, apps and AI workflows for UK
    // businesses"). Metadata only — the visible H1 is unchanged.
    title: "Silverstone AI | London AI Automation Agency for UK & US Businesses",
    description:
      "Silverstone AI is a London-based AI automation agency specializing in AI agents, voice agents, workflow automation, web and app development and AI consulting for UK and US businesses.",
    h1: "The London AI automation agency for businesses that refuse to miss",
    headingPlan: {
      h1: "The London AI automation agency for businesses that refuse to miss",
      h1Source: "H-01 approved metadata map",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    schemaTypes: ["Organization", "WebSite", "WebPage", "BreadcrumbList"],
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent:
      "AI automation agency for US and UK small businesses; AI receptionists, voice agents, automation, websites and apps",
    ctaIntent: "service discovery",
    relatedRouteIds: [
      "route-services",
      "route-industries",
      "route-how-we-work",
      "route-blog",
      "route-about",
      "route-book",
    ],
  },
  {
    id: "route-about",
    title: "About Silverstone AI | London Studio, US and UK Clients",
    description:
      "Silverstone AI is a London-based AI automation agency and AI consultancy with US-based team members, serving UK and US businesses with clear scope, human oversight and evidence-led delivery.",
    h1: "A London AI automation agency working across the UK and US",
    headingPlan: {
      h1: "A London AI automation agency working across the UK and US",
      h1Source: "H-01 approved metadata map",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    schemaTypes: ["AboutPage", "Organization", "BreadcrumbList"],
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent:
      "about Silverstone AI, a London AI automation agency serving US and UK businesses",
    ctaIntent: "service discovery",
    relatedRouteIds: [
      "route-services",
      "route-how-we-work",
      "route-contact",
      "route-book",
    ],
  },
  {
    id: "route-services",
    title: "AI Automation, AI Consulting, Web & App Services | Silverstone AI",
    description:
      "Silverstone AI’s seven services for US and UK businesses: AI receptionists, voice agents, automation, consulting, web design, app development and content systems.",
    h1: "AI automation, AI consulting and development services",
    headingPlan: {
      h1: "AI automation, AI consulting and development services",
      h1Source: "H-01 approved metadata map",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    schemaTypes: ["CollectionPage", "ItemList", "BreadcrumbList"],
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent: "AI automation and digital services for US and UK small businesses",
    ctaIntent: "service discovery",
    relatedRouteIds: servicePages.map((service) => service.id),
  },
  {
    id: "route-pricing",
    title: "AI Automation & Website Pricing (GBP and USD) | Silverstone AI",
    description:
      "Transparent pricing in GBP and USD for AI automation, voice agents, AI receptionists and websites. Pilots from £3,000 ($3,900), websites from £1,500 ($1,950).",
    h1: "AI automation pricing for US and UK small businesses",
    headingPlan: {
      h1: "AI automation pricing for US and UK small businesses",
      h1Source: "2026-07-23 transparent-pricing rebuild",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    // FAQPage is emitted from the visible accordion's own copy — see
    // `~/data/pricing-faq` and the /pricing branch in `~/seo/schema.ts`.
    schemaTypes: ["WebPage", "FAQPage", "BreadcrumbList"],
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent: "AI automation pricing in USD and GBP for US and UK businesses",
    ctaIntent: "booking",
    relatedRouteIds: [
      "route-how-we-work",
      "route-services",
      "route-book",
      "route-contact",
    ],
  },
  {
    id: "route-blog",
    title: "Practical AI and Digital Guides | Silverstone AI",
    description:
      "Practical guides on AI reception, voice agents, automation, websites, content and workflow design for US and UK business owners.",
    h1: "AI automation guides for better digital decisions",
    headingPlan: {
      h1: "AI automation guides for better digital decisions",
      h1Source: "H-01 approved metadata map",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    schemaTypes: ["CollectionPage", "ItemList", "BreadcrumbList"],
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent: "AI automation guides for US and UK small business owners",
    ctaIntent: "related guidance and consultation",
    relatedRouteIds: [
      "route-service-ai-receptionists",
      "route-service-ai-voice-agents",
      "route-service-ai-automation",
    ],
  },
  {
    id: "route-book",
    title: "Book a Discovery Call | Silverstone AI",
    description:
      "Book a 30-minute discovery call with Silverstone AI, a London AI automation agency, about AI agents, automation, a website, an app or AI consulting. UK and US time zones covered.",
    h1: "Book a 30-minute discovery call",
    headingPlan: {
      h1: "Book a 30-minute discovery call",
      h1Source: "H-01 approved metadata map",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    schemaTypes: ["WebPage", "BreadcrumbList"],
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent:
      "book an AI automation discovery call with Silverstone AI (US and UK)",
    ctaIntent: "booking",
    relatedRouteIds: ["route-services", "route-contact", "route-how-we-work"],
  },
  {
    id: "route-contact",
    title: "Contact Silverstone AI | London Studio, US and UK Hours",
    description:
      "Contact Silverstone AI, a London AI automation agency, about AI agents, voice agents, workflow automation, web design, app development or AI consulting. Replies across UK and US hours.",
    h1: "Start with the question that matters",
    headingPlan: {
      h1: "Start with the question that matters",
      h1Source: "H-01 approved metadata map",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    schemaTypes: ["ContactPage", "Organization", "BreadcrumbList"],
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent:
      "contact Silverstone AI, London AI automation agency for US and UK businesses",
    ctaIntent: "contact or booking",
    relatedRouteIds: ["route-book", "route-services", "route-about"],
  },
  {
    id: "route-services-estate-agents",
    path: "/industry/estate-agents",
    canonical: "https://silverstone-ai.com/industry/estate-agents",
    title: "AI Automation for Estate Agents and Real Estate Teams | Silverstone AI",
    description:
      "Connect portal, phone and website inquiries to qualification, showing requests, CRM updates and human follow-up. Built for UK estate agents and US real estate brokerages.",
    h1: "AI automation for estate agents and real estate brokerages",
    headingPlan: {
      h1: "AI automation for estate agents and real estate brokerages",
      h1Source:
        "Live industries-v2 hero copy (2026-07-02); reconciled with Service schema 2026-07-15",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    breadcrumbs: [
      breadcrumb("Home", "/"),
      breadcrumb("Industries", "/industry"),
      breadcrumb("Estate Agents", "/industry/estate-agents"),
    ],
    schemaTypes: ["WebPage", "Service", "BreadcrumbList"],
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent:
      "AI automation for UK estate agents and US real estate agents and brokerages; lead follow-up and viewing booking automation",
    ctaIntent: "booking",
    relatedRouteIds: [
      "route-service-ai-receptionists",
      "route-service-ai-voice-agents",
      "route-service-ai-automation",
      "route-service-web-design-development",
    ],
  },
  {
    id: "route-services-hospitality",
    path: "/industry/hospitality",
    canonical: "https://silverstone-ai.com/industry/hospitality",
    title: "Hospitality Automation for Reservations and Guests | Silverstone AI",
    description:
      "Coordinate reservations, guest inquiries, confirmations, groups and staff handoffs with hospitality automation designed around service and safety, for US and UK venues.",
    h1: "Hospitality automation that never feels automated",
    headingPlan: {
      h1: "Hospitality automation that never feels automated",
      h1Source:
        "Live industries-v2 hero copy (2026-07-02); reconciled with Service schema 2026-07-15",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    breadcrumbs: [
      breadcrumb("Home", "/"),
      breadcrumb("Industries", "/industry"),
      breadcrumb("Hospitality", "/industry/hospitality"),
    ],
    schemaTypes: ["WebPage", "Service", "BreadcrumbList"],
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent:
      "hospitality automation for US and UK hotels, restaurants and venues; hospitality AI agency",
    ctaIntent: "booking",
    relatedRouteIds: [
      "route-service-ai-receptionists",
      "route-service-ai-voice-agents",
      "route-service-web-design-development",
      "route-service-content-creation",
    ],
  },
  {
    id: "route-services-salons-barbers",
    path: "/industry/salons-barbers",
    canonical: "https://silverstone-ai.com/industry/salons-barbers",
    title: "Salon & Barbershop Automation for Bookings and Rebooking | Silverstone AI",
    description:
      "Connect calls, messages, booking rules, deposits, waitlists and rebooking with salon and barbershop automation built around your calendar and human suitability calls.",
    h1: "Salon and barbershop automation that protects chair time",
    headingPlan: {
      h1: "Salon and barbershop automation that protects chair time",
      h1Source:
        "Live industries-v2 hero copy (2026-07-02); reconciled with Service schema 2026-07-15",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    breadcrumbs: [
      breadcrumb("Home", "/"),
      breadcrumb("Industries", "/industry"),
      breadcrumb("Salons & Barbers", "/industry/salons-barbers"),
    ],
    schemaTypes: ["WebPage", "Service", "BreadcrumbList"],
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent:
      "salon and barbershop automation for US and UK salons; AI booking and reminders for salons and barbers",
    ctaIntent: "booking",
    relatedRouteIds: [
      "route-service-ai-receptionists",
      "route-service-ai-automation",
      "route-service-web-design-development",
      "route-service-content-creation",
    ],
  },
  {
    id: "route-services-trades",
    path: "/industry/trades",
    canonical: "https://silverstone-ai.com/industry/trades",
    title: "AI Automation for Trades, Contractors and Home Services | Silverstone AI",
    description:
      "Capture missed calls, qualify jobs, check service areas, coordinate callbacks, follow up quotes and connect office-to-field workflows for trades and contractors in the US and UK.",
    h1: "An AI receptionist for trades and home services contractors",
    headingPlan: {
      h1: "An AI receptionist for trades and home services contractors",
      h1Source:
        "Live industries-v2 hero copy (2026-07-02); reconciled with Service schema 2026-07-15",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    breadcrumbs: [
      breadcrumb("Home", "/"),
      breadcrumb("Industries", "/industry"),
      breadcrumb("Trades & Home Services", "/industry/trades"),
    ],
    schemaTypes: ["WebPage", "Service", "BreadcrumbList"],
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent:
      "AI receptionist and automation for UK trades and US home services contractors (plumbing, electrical, HVAC); missed-call recovery",
    ctaIntent: "booking",
    relatedRouteIds: [
      "route-service-ai-voice-agents",
      "route-service-ai-receptionists",
      "route-service-ai-automation",
      "route-service-web-design-development",
    ],
  },
  {
    id: "route-services-ecommerce",
    path: "/industry/ecommerce",
    canonical: "https://silverstone-ai.com/industry/ecommerce",
    title: "Ecommerce Automation for Shopify and DTC Brands | Silverstone AI",
    description:
      "Connect product questions, order status, returns, support and retention workflows with custom ecommerce automation built around authoritative order data.",
    h1: "Ecommerce automation that scales without the chaos",
    headingPlan: {
      h1: "Ecommerce automation that scales without the chaos",
      h1Source:
        "Live industries-v2 hero copy (2026-07-02); reconciled with Service schema 2026-07-15",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    breadcrumbs: [
      breadcrumb("Home", "/"),
      breadcrumb("Industries", "/industry"),
      breadcrumb("eCommerce Brands", "/industry/ecommerce"),
    ],
    schemaTypes: ["WebPage", "Service", "BreadcrumbList"],
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent:
      "ecommerce automation agency for US and UK brands; AI automation for Shopify and WooCommerce stores",
    ctaIntent: "booking",
    relatedRouteIds: [
      "route-service-ai-automation",
      "route-service-ai-receptionists",
      "route-service-app-development",
      "route-service-content-creation",
    ],
  },
  {
    id: "route-services-physios-chiropractors",
    path: "/industry/physios-chiropractors",
    canonical: "https://silverstone-ai.com/industry/physios-chiropractors",
    title:
      "Physical Therapy, Physio and Chiropractic Practice Automation | Silverstone AI",
    description:
      "Improve new-patient inquiries, booking, reminders, intake and rebooking with non-clinical automation designed for physical therapy, physio and chiropractic practices.",
    h1: "AI automation for physios that keeps care entirely yours",
    headingPlan: {
      h1: "AI automation for physios that keeps care entirely yours",
      h1Source:
        "Live industries-v2 hero copy (2026-07-02); reconciled with Service schema 2026-07-15",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    breadcrumbs: [
      breadcrumb("Home", "/"),
      breadcrumb("Industries", "/industry"),
      breadcrumb("Physio & Chiropractic Clinics", "/industry/physios-chiropractors"),
    ],
    schemaTypes: ["WebPage", "Service", "BreadcrumbList"],
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent:
      "physio, physical therapy and chiropractic practice automation for US and UK clinics; AI receptionist for physical therapists and physios; HIPAA-conscious, non-clinical workflows",
    ctaIntent: "booking",
    relatedRouteIds: [
      "route-service-ai-receptionists",
      "route-service-ai-automation",
      "route-service-app-development",
      "route-service-web-design-development",
    ],
  },
  {
    id: "route-services-dentists",
    path: "/industry/dentists",
    canonical: "https://silverstone-ai.com/industry/dentists",
    title: "Dental Practice Automation | Silverstone AI",
    description:
      "Improve missed-call recovery, new-patient booking, recalls and reminders with dental automation that keeps clinical judgment with the practice, in the US and UK.",
    h1: "Dental practice automation that recovers every patient",
    headingPlan: {
      h1: "Dental practice automation that recovers every patient",
      h1Source:
        "Live industries-v2 hero copy (2026-07-02); reconciled with Service schema 2026-07-15",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    breadcrumbs: [
      breadcrumb("Home", "/"),
      breadcrumb("Industries", "/industry"),
      breadcrumb("Dental Practices", "/industry/dentists"),
    ],
    schemaTypes: ["WebPage", "Service", "BreadcrumbList"],
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent:
      "dental practice automation for US and UK dentists; AI receptionist for dental practices; HIPAA-conscious, non-clinical patient-admin workflows",
    ctaIntent: "booking",
    relatedRouteIds: [
      "route-service-ai-receptionists",
      "route-service-ai-voice-agents",
      "route-service-ai-automation",
      "route-service-app-development",
    ],
  },
  {
    id: "route-services-gyms-fitness-studios",
    path: "/industry/gyms-fitness-studios",
    canonical: "https://silverstone-ai.com/industry/gyms-fitness-studios",
    title:
      "Gym & Fitness Studio Automation for Leads, Trials and Retention | Silverstone AI",
    description:
      "Connect membership inquiries, trial bookings, class questions, onboarding, follow-up and reactivation with gym automation built around your staff and member systems.",
    h1: "Gym automation that tracks every inquiry to membership",
    headingPlan: {
      h1: "Gym automation that tracks every inquiry to membership",
      h1Source:
        "Live industries-v2 hero copy (2026-07-02); reconciled with Service schema 2026-07-15",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    breadcrumbs: [
      breadcrumb("Home", "/"),
      breadcrumb("Industries", "/industry"),
      breadcrumb("Gyms & Fitness Studios", "/industry/gyms-fitness-studios"),
    ],
    schemaTypes: ["WebPage", "Service", "BreadcrumbList"],
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent:
      "gym and fitness studio automation for US and UK operators; AI receptionist for gyms and membership inquiries",
    ctaIntent: "booking",
    relatedRouteIds: [
      "route-service-ai-receptionists",
      "route-service-ai-automation",
      "route-service-content-creation",
      "route-service-app-development",
    ],
  },
  {
    id: "route-services-fitness-coaches",
    path: "/industry/fitness-coaches",
    canonical: "https://silverstone-ai.com/industry/fitness-coaches",
    title: "Automation for Online Fitness Coaches | Silverstone AI",
    description:
      "Move website and social leads into qualified consultations, onboarding and follow-up with fitness-coach automation that preserves personal coaching judgment.",
    h1: "Automation for online fitness coaches with zero lost DMs",
    headingPlan: {
      h1: "Automation for online fitness coaches with zero lost DMs",
      h1Source:
        "Live industries-v2 hero copy (2026-07-02); reconciled with Service schema 2026-07-15",
      supportingHeadingsStatus: "approved editorial overlay",
    },
    breadcrumbs: [
      breadcrumb("Home", "/"),
      breadcrumb("Industries", "/industry"),
      breadcrumb("Fitness Coaches", "/industry/fitness-coaches"),
    ],
    schemaTypes: ["WebPage", "Service", "BreadcrumbList"],
    contentStatus: "approved-editorial-overlay",
    claimsStatus: "safe-copy-human-review-pending",
    primaryIntent:
      "automation for online fitness coaches in the US and UK; AI lead follow-up for coaching businesses",
    ctaIntent: "booking",
    relatedRouteIds: [
      "route-service-ai-receptionists",
      "route-service-ai-automation",
      "route-service-content-creation",
      "route-service-web-design-development",
    ],
  },
];
