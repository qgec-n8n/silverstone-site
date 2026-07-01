/**
 * services-v2 entry point. Renders the dark cinematic service body for an
 * approved service route via its fully bespoke composition.
 *
 * Each composition is dynamically imported so its code (and its Motion-heavy
 * signature/demo components) code-splits into its own chunk rather than being
 * bundled into `page-modules.tsx`, which is shared, eagerly-loaded foundation
 * code used by every route family (home, industries, services index). Without
 * this, every visitor — regardless of which page they're on — would download
 * all seven services' code. React Router's static prerendering resolves the
 * Suspense boundary before writing each route's HTML, so prerendered output
 * still contains full content, never a loading fallback.
 *
 * This replaces the removed `ApprovedServicePageVisuals` prototype. The shared
 * route template continues to own the CoreSpin loader, Aether intro, Particles
 * background, expandable-hero transition, reverse-return control and JSON-LD.
 */
import "~/styles/services-v2/services-v2.css";

import { lazy, Suspense, type ComponentType, type ReactNode } from "react";

import type {
  ApprovedServiceContent,
  ApprovedServiceRoute,
} from "~/content/services/approved-services";

import { routeArt, type RouteArt } from "./content/route-art";

type CompositionProps = { content: ApprovedServiceContent; art: RouteArt };
type Composition = ComponentType<CompositionProps>;

const compositionByRoute: Record<
  ApprovedServiceRoute,
  () => Promise<{ default: Composition }>
> = {
  "/services/web-design-development": () =>
    import("./compositions/web-design").then((m) => ({
      default: m.WebDesignComposition,
    })),
  "/services/app-development": () =>
    import("./compositions/app-development").then((m) => ({
      default: m.AppDevelopmentComposition,
    })),
  "/services/ai-voice-agents": () =>
    import("./compositions/ai-voice-agents").then((m) => ({
      default: m.AiVoiceAgentsComposition,
    })),
  "/services/ai-receptionists": () =>
    import("./compositions/ai-receptionists").then((m) => ({
      default: m.AiReceptionistsComposition,
    })),
  "/services/content-creation": () =>
    import("./compositions/content-creation").then((m) => ({
      default: m.ContentCreationComposition,
    })),
  "/services/ai-automation": () =>
    import("./compositions/ai-automation").then((m) => ({
      default: m.AiAutomationComposition,
    })),
  "/services/ai-consulting": () =>
    import("./compositions/ai-consulting").then((m) => ({
      default: m.AiConsultingComposition,
    })),
};

// One lazy component per route, created once at module scope (not per render)
// so React doesn't remount/refetch the chunk on every re-render.
const lazyCompositionByRoute = Object.fromEntries(
  Object.entries(compositionByRoute).map(([route, importer]) => [
    route,
    lazy(importer),
  ]),
) as Record<ApprovedServiceRoute, ReturnType<typeof lazy<Composition>>>;

/**
 * Loading state for the brief window while a composition chunk downloads on
 * client-side navigation (prerendered HTML never shows this — the static
 * build resolves the Suspense boundary before writing the file). Never blank:
 * shows the route's own H1 immediately so content is never invisible.
 */
function ServiceLoadingFallback({ content }: { content: ApprovedServiceContent }) {
  return (
    <div className="ss-srv2-loading">
      <div className="ss-srv2__container">
        <h1 className="ss-srv2-hero__title">{content.metadata.h1}</h1>
      </div>
    </div>
  );
}

export function ServiceExperienceV2({
  content,
}: {
  content: ApprovedServiceContent;
}): ReactNode {
  const art = routeArt[content.route];
  const LazyComposition = lazyCompositionByRoute[content.route];

  return (
    <Suspense fallback={<ServiceLoadingFallback content={content} />}>
      <LazyComposition content={content} art={art} />
    </Suspense>
  );
}
