/**
 * One registry for every code-split route body on the site.
 *
 * Each route's composition is its own chunk (see the notes in the per-family
 * `-experience.tsx` entry points). The map used to live in four separate
 * feature modules, but the navigation preloader needs to reach every chunk
 * from the eagerly-loaded shell — and it cannot import those feature modules
 * to do it, because they pull in the services/industries stylesheets and copy
 * data. This file holds nothing but `import()` thunks, so the shell can
 * depend on it for the cost of a few closures while every composition stays
 * behind its own split point.
 *
 * Keeping all four maps here also makes the preloader impossible to drift
 * from: a route that gains a composition gains its preload in the same edit.
 */
import type { ComponentType } from "react";

import type {
  ApprovedServiceContent,
  ApprovedServiceRoute,
} from "~/content/services/approved-services";
import type { IndustryArt } from "~/features/industries-v2/content/route-art";
import type {
  IndustryCopy,
  IndustryRoute,
} from "~/features/industries-v2/content/types";
import type { RouteArt } from "~/features/services-v2/content/route-art";
import { preloadableComponent } from "~/lib/preloadable-component";

export type CorePath =
  | "/how-we-work"
  | "/blog"
  | "/about"
  | "/pricing"
  | "/contact"
  | "/book";

type ServiceCompositionProps = { content: ApprovedServiceContent; art: RouteArt };
type IndustryCompositionProps = { copy: IndustryCopy; art: IndustryArt };

export const coreCompositionByPath: Record<
  CorePath,
  ReturnType<typeof preloadableComponent<Record<string, never>>>
> = {
  "/how-we-work": preloadableComponent(() =>
    import("~/features/core-pages/compositions/how-we-work").then((m) => ({
      default: m.HowWeWorkComposition as ComponentType<Record<string, never>>,
    })),
  ),
  "/blog": preloadableComponent(() =>
    import("~/features/core-pages/compositions/insights").then((m) => ({
      default: m.InsightsComposition as ComponentType<Record<string, never>>,
    })),
  ),
  "/about": preloadableComponent(() =>
    import("~/features/core-pages/compositions/about").then((m) => ({
      default: m.AboutComposition as ComponentType<Record<string, never>>,
    })),
  ),
  "/pricing": preloadableComponent(() =>
    import("~/features/core-pages/compositions/pricing").then((m) => ({
      default: m.PricingComposition as ComponentType<Record<string, never>>,
    })),
  ),
  "/contact": preloadableComponent(() =>
    import("~/features/core-pages/compositions/contact").then((m) => ({
      default: m.ContactComposition as ComponentType<Record<string, never>>,
    })),
  ),
  "/book": preloadableComponent(() =>
    import("~/features/core-pages/compositions/book").then((m) => ({
      default: m.BookComposition as ComponentType<Record<string, never>>,
    })),
  ),
};

export const serviceCompositionByRoute: Record<
  ApprovedServiceRoute,
  ReturnType<typeof preloadableComponent<ServiceCompositionProps>>
> = {
  "/services/web-design-development": preloadableComponent(() =>
    import("~/features/services-v2/compositions/web-design").then((m) => ({
      default: m.WebDesignComposition,
    })),
  ),
  "/services/app-development": preloadableComponent(() =>
    import("~/features/services-v2/compositions/app-development").then((m) => ({
      default: m.AppDevelopmentComposition,
    })),
  ),
  "/services/ai-voice-agents": preloadableComponent(() =>
    import("~/features/services-v2/compositions/ai-voice-agents").then((m) => ({
      default: m.AiVoiceAgentsComposition,
    })),
  ),
  "/services/ai-receptionists": preloadableComponent(() =>
    import("~/features/services-v2/compositions/ai-receptionists").then((m) => ({
      default: m.AiReceptionistsComposition,
    })),
  ),
  "/services/content-creation": preloadableComponent(() =>
    import("~/features/services-v2/compositions/content-creation").then((m) => ({
      default: m.ContentCreationComposition,
    })),
  ),
  "/services/ai-automation": preloadableComponent(() =>
    import("~/features/services-v2/compositions/ai-automation").then((m) => ({
      default: m.AiAutomationComposition,
    })),
  ),
  "/services/ai-consulting": preloadableComponent(() =>
    import("~/features/services-v2/compositions/ai-consulting").then((m) => ({
      default: m.AiConsultingComposition,
    })),
  ),
};

export const industryCompositionByRoute: Record<
  IndustryRoute,
  ReturnType<typeof preloadableComponent<IndustryCompositionProps>>
> = {
  "/industry/estate-agents": preloadableComponent(() =>
    import("~/features/industries-v2/compositions/estate-agents").then((m) => ({
      default: m.EstateAgentsComposition,
    })),
  ),
  "/industry/salons-barbers": preloadableComponent(() =>
    import("~/features/industries-v2/compositions/salons-barbers").then((m) => ({
      default: m.SalonsBarbersComposition,
    })),
  ),
  "/industry/ecommerce": preloadableComponent(() =>
    import("~/features/industries-v2/compositions/ecommerce").then((m) => ({
      default: m.EcommerceComposition,
    })),
  ),
  "/industry/dentists": preloadableComponent(() =>
    import("~/features/industries-v2/compositions/dentists").then((m) => ({
      default: m.DentistsComposition,
    })),
  ),
  "/industry/fitness-coaches": preloadableComponent(() =>
    import("~/features/industries-v2/compositions/fitness-coaches").then((m) => ({
      default: m.FitnessCoachesComposition,
    })),
  ),
  "/industry/hospitality": preloadableComponent(() =>
    import("~/features/industries-v2/compositions/hospitality").then((m) => ({
      default: m.HospitalityComposition,
    })),
  ),
  "/industry/trades": preloadableComponent(() =>
    import("~/features/industries-v2/compositions/trades").then((m) => ({
      default: m.TradesComposition,
    })),
  ),
  "/industry/physios-chiropractors": preloadableComponent(() =>
    import("~/features/industries-v2/compositions/physios-chiropractors").then((m) => ({
      default: m.PhysiosChiropractorsComposition,
    })),
  ),
  "/industry/gyms-fitness-studios": preloadableComponent(() =>
    import("~/features/industries-v2/compositions/gyms-fitness-studios").then((m) => ({
      default: m.GymsFitnessStudiosComposition,
    })),
  ),
};

/** The two hub bodies code-split exactly like the per-route compositions. */
export const hubCompositionByPath: Record<
  "/services" | "/industry",
  ReturnType<typeof preloadableComponent<Record<string, never>>>
> = {
  "/services": preloadableComponent(() =>
    import("~/features/hubs-v2/services-hub").then((m) => ({
      default: m.ServicesHubExperience as ComponentType<Record<string, never>>,
    })),
  ),
  "/industry": preloadableComponent(() =>
    import("~/features/hubs-v2/industries-hub").then((m) => ({
      default: m.IndustriesHubExperience as ComponentType<Record<string, never>>,
    })),
  ),
};

/** Every composition in one flat path lookup, for the preloader below. */
const preloadByPath: Record<string, { preload: () => void }> = {
  ...coreCompositionByPath,
  ...serviceCompositionByRoute,
  ...industryCompositionByRoute,
  ...hubCompositionByPath,
};

/**
 * Start downloading the composition chunk for `path`, if it has one.
 *
 * Called from navigation intent (hover / focus / pointer-down) so the chunk is
 * already resolved by the time the route commits. Safe to call repeatedly and
 * for paths that own no composition — both are no-ops.
 */
export function preloadRouteComposition(path: string): void {
  const normalized =
    path !== "/" && path.endsWith("/") ? path.replace(/\/+$/, "") : path;

  preloadByPath[normalized]?.preload();
}
