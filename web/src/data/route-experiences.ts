import { futureRouteManifest, routePathAliases } from "~/data/future-routes";
import type { FutureRouteRecord } from "~/data/route-schema";
import { getApprovedServiceContent } from "~/content/services/approved-services";
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
  "/services/web-design-development": [
    "/approved-images/general-services-1-mobile.png",
  ],
  "/services/app-development": ["/approved-images/services_data_integration.jpg"],
  "/services/ai-voice-agents": ["/approved-images/services_lead_followup.jpg"],
  "/services/ai-receptionists": ["/approved-images/receptionists-hero.png"],
  "/services/content-creation": ["/approved-images/general-services-2a.png"],
  "/services/ai-automation": ["/approved-images/services_workflow_automation.jpg"],
  "/services/ai-consulting": ["/approved-images/services_consulting.jpg"],
  "/industry": ["/approved-images/general-services-3.png"],
  "/industry/estate-agents": ["/approved-images/Real_Estate_1.jpeg"],
  "/industry/salons-barbers": ["/approved-images/Salon_1.jpeg"],
  "/industry/ecommerce": ["/approved-images/ecommerce-1.png"],
  "/industry/dentists": ["/approved-images/dentist-1.png"],
  "/industry/fitness-coaches": ["/approved-images/onlinecoach-1.png"],
  "/industry/hospitality": ["/approved-images/Hospitality_1.jpeg"],
  "/industry/trades": ["/approved-images/Trades_1.jpeg"],
  "/industry/physios-chiropractors": ["/approved-images/physio-1.png"],
  "/industry/gyms-fitness-studios": ["/approved-images/gyms-1.png"],
  "/about": ["/approved-images/about-standard.png"],
  "/blog": ["/home-v2/story-operating-surface.png"],
  "/pricing": ["/home-v2/consulting-strategy.png"],
};

const coreRouteEntries: Record<
  string,
  Pick<RouteExperience, "loaderText" | "pill" | "title" | "subtitle" | "buttonLabel">
> = {
  "/how-we-work": {
    loaderText: "Calibrating the delivery route",
    pill: "The Silverstone method",
    title: "Complex technology. Controlled delivery.",
    subtitle:
      "A disciplined route from commercial diagnosis to tested, measurable systems, designed around your people, data and operating reality.",
    buttonLabel: "Enter the delivery framework",
  },
  "/blog": {
    loaderText: "Indexing the insight library",
    pill: "Silverstone Intelligence",
    title: "Read before you build.",
    subtitle:
      "Practical analysis for leaders deciding what to automate, what to design, what to measure and where human judgement still matters.",
    buttonLabel: "Open the Insights library",
  },
  "/about": {
    loaderText: "Resolving the Silverstone standard",
    pill: "The Silverstone standard",
    title: "Capability is common. Judgement is rare.",
    subtitle:
      "Silverstone joins commercial strategy, digital craft, engineering, AI and automation, then applies the restraint to use each only where it belongs.",
    buttonLabel: "Discover the standard",
  },
  "/pricing": {
    loaderText: "Shaping the investment model",
    pill: "Investment by design",
    title: "No generic packages. No arbitrary numbers.",
    subtitle:
      "Silverstone prices the problem, the scope and the standard of execution after the systems, risks and commercial objective are understood.",
    buttonLabel: "Review how investment is shaped",
  },
  "/contact": {
    loaderText: "Opening a direct channel",
    pill: "Direct correspondence",
    title: "Put the problem in writing.",
    subtitle:
      "Send the context that matters so Silverstone can decide whether a written answer, discovery call or different route makes sense.",
    buttonLabel: "Open the enquiry form",
  },
  "/book": {
    loaderText: "Preparing your discovery call",
    pill: "30-minute discovery",
    title: "One problem. One focused conversation.",
    subtitle:
      "Bring the process, journey or digital decision that matters most. Silverstone will use the call to understand fit and define the most sensible next step.",
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
  if (route.path === "/pricing") return "Review the scoping model";
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
    getApprovedServiceContent(route.path)?.routeEntry ??
    getIndustryCopy(route.path)?.routeEntry ??
    coreRouteEntries[route.path];

  const experience: RouteExperience = {
    path: route.path,
    loaderText: approvedRouteEntry?.loaderText ?? loaderTextFor(route, family),
    pill: approvedRouteEntry?.pill ?? pillFor(route, family),
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
  const normalized = normalizeExperiencePath(pathname);
  return routePathAliases[normalized] ?? normalized;
}

export const routeExperiences = futureRouteManifest.map(buildExperience);

export const notFoundRouteExperience: RouteExperience = {
  path: "*",
  loaderText: "Recovering a safe route",
  pill: "Route recovery",
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
