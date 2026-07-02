/**
 * industries-v2 entry point. Renders the dark cinematic industry body for a
 * canonical industry route via its fully bespoke composition.
 *
 * Mirrors services-v2: each composition is dynamically imported so its code
 * (signature diagrams, Motion choreography) code-splits into its own chunk.
 * React Router's static prerendering resolves the Suspense boundary before
 * writing each route's HTML, so prerendered output always contains the full
 * public copy, never a loading fallback.
 *
 * The shared route template continues to own the CoreSpin loader, Aether
 * intro, Particles background, expandable-hero transition, reverse-return
 * control and JSON-LD.
 */
import "~/styles/services-v2/services-v2.css";
import "~/styles/industries-v2/industries-v2.css";

import { lazy, Suspense, type ComponentType, type ReactNode } from "react";

import { industryArt, type IndustryArt } from "./content/route-art";
import { getIndustryCopy, type IndustryCopy, type IndustryRoute } from "./content";

type CompositionProps = { copy: IndustryCopy; art: IndustryArt };
type Composition = ComponentType<CompositionProps>;

const compositionByRoute: Record<
  IndustryRoute,
  () => Promise<{ default: Composition }>
> = {
  "/industry/estate-agents": () =>
    import("./compositions/estate-agents").then((m) => ({
      default: m.EstateAgentsComposition,
    })),
  "/industry/salons-barbers": () =>
    import("./compositions/salons-barbers").then((m) => ({
      default: m.SalonsBarbersComposition,
    })),
  "/industry/ecommerce": () =>
    import("./compositions/ecommerce").then((m) => ({
      default: m.EcommerceComposition,
    })),
  "/industry/dentists": () =>
    import("./compositions/dentists").then((m) => ({
      default: m.DentistsComposition,
    })),
  "/industry/fitness-coaches": () =>
    import("./compositions/fitness-coaches").then((m) => ({
      default: m.FitnessCoachesComposition,
    })),
  "/industry/hospitality": () =>
    import("./compositions/hospitality").then((m) => ({
      default: m.HospitalityComposition,
    })),
  "/industry/trades": () =>
    import("./compositions/trades").then((m) => ({
      default: m.TradesComposition,
    })),
  "/industry/physios-chiropractors": () =>
    import("./compositions/physios-chiropractors").then((m) => ({
      default: m.PhysiosChiropractorsComposition,
    })),
  "/industry/gyms-fitness-studios": () =>
    import("./compositions/gyms-fitness-studios").then((m) => ({
      default: m.GymsFitnessStudiosComposition,
    })),
};

const lazyCompositionByRoute = Object.fromEntries(
  Object.entries(compositionByRoute).map(([route, importer]) => [
    route,
    lazy(importer),
  ]),
) as Record<IndustryRoute, ReturnType<typeof lazy<Composition>>>;

function IndustryLoadingFallback({ copy }: { copy: IndustryCopy }) {
  return (
    <div className="ss-srv2-loading">
      <div className="ss-srv2__container">
        <h1 className="ss-srv2-hero__title">{copy.h1}</h1>
      </div>
    </div>
  );
}

export function IndustryExperienceV2({ route }: { route: string }): ReactNode {
  const copy = getIndustryCopy(route);
  if (!copy) {
    return null;
  }
  const art = industryArt[copy.route];
  const LazyComposition = lazyCompositionByRoute[copy.route];

  return (
    <Suspense fallback={<IndustryLoadingFallback copy={copy} />}>
      <LazyComposition copy={copy} art={art} />
    </Suspense>
  );
}
