import { futureRouteManifest } from "~/data/future-routes";
import type { FutureRouteRecord } from "~/data/route-schema";
import { getApprovedServiceRouteEntry } from "~/content/services/approved-service-route-entries";
import { getIndustryCopy } from "~/features/industries-v2/content";

export type RouteExperienceFamily =
  | "home"
  | "service"
  | "industry"
  | "article"
  | "directory"
  | "company"
  | "conversion"
  | "legal"
  | "utility";

export type RouteExperience = {
  path: string;
  loaderText: string;
  pill: string;
  /**
   * The pill's phone copy. The intro pill is one line of 12px mono at 0.18em
   * tracking inside the 20px page gutters, which is ~25 characters at 320px
   * and ~31 at 375px, so every route carries a form short enough to sit on
   * one line on any phone; the full `pill` stays for wider viewports. See
   * `MOBILE_PILLS`.
   */
  pillShort: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  bodyHeadingId: string;
  family: RouteExperienceFamily;
  preloadAssets?: string[];
};

const BODY_FOCUS_TARGET = "main-content";

const routeAssets: Record<string, string[]> = {
  "/": [
    "/home-v2/hero-poster.png",
    "/home-v2/hero-poster-portrait.png",
    "/home-v2/silverstone-system-visual.png",
  ],
  "/services": ["/approved-images/services_workflow_automation.jpg"],
  // Every other route warms its desktop hero; this one warmed the mobile crop,
  // so wide viewports downloaded an image they never displayed.
  "/services/web-design-development": ["/approved-images/general-services-1.webp"],
  "/services/app-development": ["/approved-images/services_data_integration.jpg"],
  "/services/ai-voice-agents": ["/approved-images/services_lead_followup.jpg"],
  "/services/ai-receptionists": ["/approved-images/receptionists-hero.webp"],
  "/services/content-creation": ["/approved-images/general-services-2a.webp"],
  "/services/ai-automation": ["/approved-images/services_workflow_automation.jpg"],
  "/services/ai-consulting": ["/approved-images/services_consulting.jpg"],
  "/industry": ["/approved-images/general-services-3.png"],
  "/industry/estate-agents": ["/approved-images/Real_Estate_1_Mobile.jpeg"],
  "/industry/salons-barbers": ["/approved-images/Salon_1.jpeg"],
  "/industry/aesthetic-clinics": ["/approved-images/aesthetic-1.webp"],
  "/industry/ecommerce": ["/approved-images/ecommerce-1.webp"],
  "/industry/dentists": ["/approved-images/dentist-1.webp"],
  "/industry/fitness-coaches": ["/approved-images/onlinecoach-1.webp"],
  "/industry/hospitality": ["/approved-images/Hospitality_1.jpeg"],
  "/industry/trades": ["/approved-images/Trades_1.jpeg"],
  "/industry/physios-chiropractors": ["/approved-images/physio-1.webp"],
  "/industry/gyms-fitness-studios": ["/approved-images/gyms-1.webp"],
  "/about": ["/approved-images/about-standard.webp"],
  "/blog": ["/home-v2/story-operating-surface.png"],
  "/pricing": ["/home-v2/consulting-strategy.png"],
};

/*
 * The Aether intro splash is the first copy a visitor — and a crawler that
 * hydrates — reads on each route, so every title states the page's subject in
 * plain terms (the service or sector, and where useful "London" / "UK and US")
 * before the body hero adds the argument. Kept to the same lengths as the
 * lines they replaced, so the splash's type budget is unchanged.
 */
const coreRouteEntries: Record<
  string,
  Pick<RouteExperience, "loaderText" | "pill" | "title" | "subtitle" | "buttonLabel">
> = {
  "/services": {
    loaderText: "Preparing the service architecture",
    pill: "AI agency services · London, UK & US",
    title: "AI automation, development and consulting services",
    subtitle:
      "Silverstone AI's seven services for UK and US businesses: AI agents, voice agents and receptionists, workflow automation, web and app development, content systems and AI consulting.",
    buttonLabel: "Explore our services",
  },
  "/industry": {
    loaderText: "Mapping sector operating patterns",
    pill: "Industry AI automation · UK & US",
    title: "AI automation built for your industry",
    subtitle:
      "Sector-specific AI reception, booking, follow-up and back-office systems for ten industries across the UK and US, with the judgment calls kept human.",
    buttonLabel: "Explore industry systems",
  },
  "/how-we-work": {
    loaderText: "Calibrating the delivery route",
    pill: "The Silverstone method",
    title: "How a London AI agency delivers automation",
    subtitle:
      "How Silverstone AI takes AI automation from commercial diagnosis to tested, measurable systems, designed around your people, data and operating reality.",
    buttonLabel: "Enter the delivery framework",
  },
  "/blog": {
    loaderText: "Indexing the insight library",
    pill: "Silverstone Intelligence",
    title: "AI guides from a London automation agency",
    subtitle:
      "Practical analysis from Silverstone AI for leaders deciding what to automate, what to design, what to measure and where human judgment still matters.",
    buttonLabel: "Open the Insights library",
  },
  "/about": {
    loaderText: "Resolving the Silverstone standard",
    pill: "The Silverstone standard",
    title: "A London AI automation agency and consultancy",
    subtitle:
      "Silverstone AI joins AI consulting, commercial strategy, digital craft, engineering, AI agents and automation, then applies the restraint to use each only where it belongs.",
    buttonLabel: "Discover the standard",
  },
  "/pricing": {
    loaderText: "Shaping the investment model",
    pill: "Pricing, scope and return",
    title: "Transparent AI automation pricing in GBP and USD",
    subtitle:
      "Clear starting prices for AI agents, automation, consulting and websites, defined implementation bands and written proposals shaped around scope, risk and measurable value.",
    buttonLabel: "See the pricing model",
  },
  "/contact": {
    loaderText: "Opening a direct channel",
    pill: "Direct correspondence",
    title: "Contact a London AI automation agency",
    subtitle:
      "Send the context that matters so Silverstone AI can decide whether a written answer, a discovery call or a different route makes sense, across UK and US hours.",
    buttonLabel: "Open the inquiry form",
  },
  "/book": {
    loaderText: "Preparing your discovery call",
    pill: "30-minute discovery",
    title: "Book an AI automation discovery call",
    subtitle:
      "Bring the process, journey or digital decision that matters most. Silverstone AI uses the 30-minute call to understand fit and define the most sensible next step.",
    buttonLabel: "Continue to booking",
  },
};

function conciseTitle(route: FutureRouteRecord): string {
  return route.h1.replace(/\s+/g, " ").trim();
}

function familyForRoute(route: FutureRouteRecord): RouteExperienceFamily {
  if (route.path === "/") return "home";
  if (route.template === "service") return "service";
  if (route.template === "industry") return "industry";
  if (route.template === "article") return "article";
  if (route.routeGroup === "services") {
    return "directory";
  }
  if (route.routeGroup === "industries") {
    return "directory";
  }
  if (route.routeGroup === "conversion") return "conversion";
  if (route.routeGroup === "legal") return "legal";
  if (route.routeGroup === "company") return "company";
  return "utility";
}

function loaderTextFor(
  route: FutureRouteRecord,
  family: RouteExperienceFamily,
): string {
  if (route.path === "/") {
    return "Engineering the next advantage";
  }
  if (route.path === "/services") {
    return "Preparing the service architecture";
  }
  if (route.path === "/industry") {
    return "Mapping sector operating patterns";
  }
  if (route.path === "/book") {
    return "Preparing your discovery call";
  }
  if (route.path === "/contact") {
    return "Opening a direct channel";
  }
  if (route.path === "/privacy-policy") {
    return "Presenting the privacy framework";
  }
  if (route.path === "/pricing") {
    return "Shaping the investment model";
  }
  if (route.path === "/about") {
    return "Resolving the Silverstone standard";
  }
  if (route.path === "/how-we-work") {
    return "Calibrating the delivery route";
  }
  if (route.path === "/blog") {
    return "Indexing the insight library";
  }

  switch (family) {
    case "service":
      return "Preparing this service system";
    case "industry":
      return "Mapping your sector system";
    case "article":
      return "Opening the article";
    default:
      return "Preparing the route";
  }
}

/**
 * Phone copy for the intro pill, by path — at most 25 characters (see
 * `RouteExperience.pillShort`). A route without an entry falls back to the
 * head of its full pill, cut at the first " · " or " / " separator, which is
 * how the article and legal families get "Silverstone insight" and
 * "Governance framework". `tests/unit/route-experiences.test.ts` enforces the
 * budget on every manifest route.
 */
const MOBILE_PILLS: Record<string, string> = {
  "/": "AI automation · UK & US",
  "/services": "AI agency services",
  "/industry": "Industry AI automation",
  "/how-we-work": "The Silverstone method",
  "/blog": "Silverstone Intelligence",
  "/about": "The Silverstone standard",
  "/pricing": "Pricing, scope & return",
  "/contact": "Direct correspondence",
  "/book": "30-minute discovery",
  "/privacy-policy": "Governance framework",
  "/services/web-design-development": "Web design & development",
  "/services/app-development": "Custom app development",
  "/services/ai-voice-agents": "AI voice agents",
  "/services/ai-receptionists": "AI receptionists",
  "/services/content-creation": "AI content creation",
  "/services/ai-automation": "Workflow automation",
  "/services/ai-consulting": "AI consulting",
  "/industry/dentists": "Dental practice AI",
  "/industry/physios-chiropractors": "Physio & chiropractic AI",
  "/industry/salons-barbers": "Salon & barbershop AI",
  "/industry/gyms-fitness-studios": "Gym & fitness studio AI",
  "/industry/hospitality": "Hospitality AI",
  "/industry/ecommerce": "Ecommerce AI",
  "/industry/fitness-coaches": "Online fitness coach AI",
  "/industry/estate-agents": "Estate agent & broker AI",
  "/industry/trades": "Trades & contractor AI",
  "/industry/aesthetic-clinics": "Seven-day booking sprint",
};

export const MOBILE_PILL_MAX_LENGTH = 25;

function mobilePillFor(path: string, pill: string): string {
  return MOBILE_PILLS[path] ?? (pill.split(/\s[·/]\s/)[0] ?? pill).trim();
}

function pillFor(route: FutureRouteRecord, family: RouteExperienceFamily): string {
  if (route.path === "/") return "Silverstone operating system";
  if (route.path === "/services") return "Services command map";
  if (route.path === "/industry") return "Industry operating patterns";
  if (route.path === "/blog") return "Practical insight library";

  switch (family) {
    case "service":
      return `Service system / ${(route.title.split("|")[0] ?? route.title).trim()}`;
    case "industry":
      return `Industry system / ${route.breadcrumbs.at(-1)?.name ?? route.routeGroup}`;
    case "article":
      return "Silverstone insight / Practical guide";
    case "conversion":
      return route.path === "/book"
        ? "Discovery call pathway"
        : "Direct contact pathway";
    case "legal":
      return "Governance framework";
    case "company":
      return "Studio intelligence";
    default:
      return "Silverstone route system";
  }
}

function buttonLabelFor(
  route: FutureRouteRecord,
  family: RouteExperienceFamily,
): string {
  if (route.path === "/") return "Explore the system";
  if (route.path === "/services") return "Explore our services";
  if (route.path === "/industry") return "Explore industry systems";
  if (route.path === "/blog") return "Explore the insights";
  if (route.path === "/book") return "Open the booking experience";
  if (route.path === "/contact") return "Open the contact route";
  if (route.path === "/privacy-policy") return "Review our privacy approach";
  if (route.path === "/pricing") return "See the pricing model";
  if (route.path === "/about") return "Meet the studio";
  if (route.path === "/how-we-work") return "Explore the delivery route";

  switch (family) {
    case "service":
      if (route.path.includes("web-design")) return "Explore website systems";
      if (route.path.includes("app-development")) return "Explore app development";
      if (route.path.includes("voice")) return "Explore intelligent conversations";
      if (route.path.includes("reception")) return "Meet your AI front desk";
      if (route.path.includes("content")) return "Explore content systems";
      if (route.path.includes("automation")) return "Explore automation systems";
      if (route.path.includes("consulting")) return "Explore advisory systems";
      return "Explore this service";
    case "industry":
      return `Explore solutions for ${route.breadcrumbs.at(-1)?.name ?? "this sector"}`;
    case "article":
      return "Read the insight";
    default:
      return "Open the page";
  }
}

function buildExperience(route: FutureRouteRecord): RouteExperience {
  const family = familyForRoute(route);
  const approvedRouteEntry =
    getApprovedServiceRouteEntry(route.path) ??
    getIndustryCopy(route.path)?.routeEntry ??
    coreRouteEntries[route.path];

  const experience: RouteExperience = {
    path: route.path,
    loaderText: approvedRouteEntry?.loaderText ?? loaderTextFor(route, family),
    pill: approvedRouteEntry?.pill ?? pillFor(route, family),
    pillShort: mobilePillFor(
      route.path,
      approvedRouteEntry?.pill ?? pillFor(route, family),
    ),
    title: approvedRouteEntry?.title ?? conciseTitle(route),
    subtitle: approvedRouteEntry?.subtitle ?? route.description,
    buttonLabel: approvedRouteEntry?.buttonLabel ?? buttonLabelFor(route, family),
    bodyHeadingId: BODY_FOCUS_TARGET,
    family,
  };
  const preloadAssets = routeAssets[route.path];
  if (preloadAssets) {
    experience.preloadAssets = preloadAssets;
  }
  return experience;
}

function canonicalExperiencePath(pathname: string): string {
  return normalizeExperiencePath(pathname);
}

export const routeExperiences = futureRouteManifest.map(buildExperience);

export const notFoundRouteExperience: RouteExperience = {
  path: "*",
  loaderText: "Recovering a safe route",
  pill: "Route recovery",
  pillShort: "Route recovery",
  title: "This address doesn't resolve",
  subtitle:
    "The page may have moved while the Silverstone system was being rebuilt. Every live route is one step away.",
  buttonLabel: "Open the recovery route",
  bodyHeadingId: BODY_FOCUS_TARGET,
  family: "utility",
};

const routeExperienceByPath = new Map(
  routeExperiences.map((experience) => [experience.path, experience]),
);

export function normalizeExperiencePath(pathname: string): string {
  const [pathOnly = "/"] = pathname.split(/[?#]/);
  const normalized = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
  return normalized !== "/" && normalized.endsWith("/")
    ? normalized.replace(/\/+$/, "")
    : normalized;
}

export function getRouteExperienceByPath(pathname: string): RouteExperience {
  return (
    routeExperienceByPath.get(canonicalExperiencePath(pathname)) ??
    notFoundRouteExperience
  );
}

export function getCanonicalRouteExperienceByPath(
  pathname: string,
): RouteExperience | undefined {
  return routeExperienceByPath.get(canonicalExperiencePath(pathname));
}
