import type { IndustryCopy, IndustryRoute } from "./types";
import { dentistsCopy } from "./copy/dentists";
import { ecommerceCopy } from "./copy/ecommerce";
import { estateAgentsCopy } from "./copy/estate-agents";
import { fitnessCoachesCopy } from "./copy/fitness-coaches";
import { gymsFitnessStudiosCopy } from "./copy/gyms-fitness-studios";
import { hospitalityCopy } from "./copy/hospitality";
import { physiosChiropractorsCopy } from "./copy/physios-chiropractors";
import { salonsBarbersCopy } from "./copy/salons-barbers";
import { tradesCopy } from "./copy/trades";

export const industryCopyByRoute: Record<IndustryRoute, IndustryCopy> = {
  "/industry/estate-agents": estateAgentsCopy,
  "/industry/salons-barbers": salonsBarbersCopy,
  "/industry/ecommerce": ecommerceCopy,
  "/industry/dentists": dentistsCopy,
  "/industry/fitness-coaches": fitnessCoachesCopy,
  "/industry/hospitality": hospitalityCopy,
  "/industry/trades": tradesCopy,
  "/industry/physios-chiropractors": physiosChiropractorsCopy,
  "/industry/gyms-fitness-studios": gymsFitnessStudiosCopy,
};

export const industryRoutes = Object.keys(industryCopyByRoute) as IndustryRoute[];

export function isIndustryRoute(route: string): route is IndustryRoute {
  return Object.hasOwn(industryCopyByRoute, route);
}

export function getIndustryCopy(route: string): IndustryCopy | undefined {
  return isIndustryRoute(route) ? industryCopyByRoute[route] : undefined;
}

export type { IndustryCopy, IndustryRoute } from "./types";
