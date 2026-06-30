import { futureRouteManifest, routePathAliases } from "~/data/future-routes";
import type { FutureRouteRecord } from "~/data/route-schema";

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
  "/services/web-design-development": ["/approved-images/general-services-1.png"],
  "/services/app-development": ["/approved-images/services_data_integration.jpg"],
  "/services/ai-voice-agents": ["/approved-images/services_lead_followup.jpg"],
  "/services/ai-receptionists": ["/approved-images/general-services-1.png"],
  "/services/content-creation": ["/approved-images/general-services-2a.png"],
  "/services/ai-automation": ["/approved-images/services_workflow_automation.jpg"],
  "/services/ai-consulting": ["/approved-images/services_consulting.jpg"],
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
  const title = conciseTitle(route);

  if (route.path === "/") {
    return "Engineering the next advantage";
  }
  if (route.path === "/services") {
    return "Preparing the service architecture for your next operating system.";
  }
  if (route.path === "/industries") {
    return "Mapping sector-specific operating patterns into the Silverstone system.";
  }
  if (route.path === "/book") {
    return "Preparing the discovery-call experience and next-step pathway.";
  }
  if (route.path === "/contact") {
    return "Opening a direct line to the Silverstone team.";
  }
  if (route.path === "/privacy-policy") {
    return "Presenting the privacy framework and data-handling commitments.";
  }
  if (route.path === "/pricing") {
    return "Preparing the scoping model behind a responsible investment decision.";
  }
  if (route.path === "/about") {
    return "Assembling the studio context, standards and operating principles.";
  }
  if (route.path === "/how-we-work") {
    return "Sequencing the route from business problem to working system.";
  }
  if (route.path === "/blog") {
    return "Curating the practical insights library for better digital decisions.";
  }

  switch (family) {
    case "service":
      return `Preparing ${title.toLowerCase()} as a focused growth system.`;
    case "industry":
      return `Mapping this sector journey: ${title}`;
    case "article":
      return `Loading the evidence and practical guidance for: ${title}`;
    default:
      return `Preparing ${title.toLowerCase()} for a focused Silverstone experience.`;
  }
}

function pillFor(route: FutureRouteRecord, family: RouteExperienceFamily): string {
  if (route.path === "/") return "Silverstone operating system";
  if (route.path === "/services") return "Services command map";
  if (route.path === "/industries") return "Industry operating patterns";
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
  if (route.path === "/industries") return "Explore industry systems";
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

  const experience: RouteExperience = {
    path: route.path,
    loaderText: loaderTextFor(route, family),
    pill: pillFor(route, family),
    title: conciseTitle(route),
    subtitle: route.description,
    buttonLabel: buttonLabelFor(route, family),
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
  loaderText: "Checking the requested route before returning a safe way forward.",
  pill: "Route recovery",
  title: "Page not found",
  subtitle:
    "The requested staging route is not part of the approved Silverstone route map.",
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
