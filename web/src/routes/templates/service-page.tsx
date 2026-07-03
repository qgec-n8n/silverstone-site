import "~/styles/visual/home-v2.css";

import { LayoutGroup } from "motion/react";
import { useCallback, useEffect, useRef, type Ref } from "react";
import { RotateCcw } from "~/components/icons/lucide";

import { useAppExperience } from "~/app/experience/app-experience";
import type { MigratedContentRecord } from "~/content/migrated";
import { getRouteExperienceByPath } from "~/data/route-experiences";
import type { FutureRouteRecord } from "~/data/route-schema";
import { RoutePageFrame } from "~/routes/templates/route-page-frame";
import { ServicePageVisuals } from "~/visual/data/page-modules";
import { BodyParticles } from "~/visual/home-v2/body-particles";
import { ExploreSystemTransition } from "~/visual/home-v2/explore-system-button";
import { deriveMotionPolicy } from "~/visual/home-v2/motion-policy";
import { useCapabilityTier } from "~/visual/hooks/use-capability-tier";
import { buildRouteSchemaGraph, serializeJsonLd } from "~/seo/schema";
import { RouteExperienceIntro } from "~/visual/components/route-experience-intro";

type ServicePageProps = {
  content?: MigratedContentRecord | null;
  route: FutureRouteRecord;
};

function ServiceIntro({
  buttonDisabled,
  buttonHidden,
  buttonRef,
  experience,
  motionEnabled,
  onExplore,
}: {
  buttonDisabled: boolean;
  buttonHidden: boolean;
  buttonRef: Ref<HTMLButtonElement>;
  experience: ReturnType<typeof getRouteExperienceByPath>;
  motionEnabled: boolean;
  onExplore: () => void;
}) {
  return (
    <RouteExperienceIntro
      buttonDisabled={buttonDisabled}
      buttonHidden={buttonHidden}
      buttonRef={buttonRef}
      experience={experience}
      motionEnabled={motionEnabled}
      onExplore={onExplore}
    />
  );
}

export function ServicePage({ content = null, route }: ServicePageProps) {
  const serviceExperienceEnabled =
    route.routeGroup === "services" && route.template === "service";
  const capability = useCapabilityTier();
  const policy = deriveMotionPolicy({
    tier: capability.tier,
    reducedMotion: capability.reducedMotion,
    shaderEligible: capability.shaderEligible,
  });
  const {
    closeServiceBody,
    completeServiceClosing,
    completeServiceOpening,
    openServiceBody,
    serviceExperienceState,
  } = useAppExperience();
  const exploreButtonRef = useRef<HTMLButtonElement>(null);
  const experience = getRouteExperienceByPath(route.path);

  const introVisible =
    serviceExperienceEnabled &&
    (serviceExperienceState === "intro" ||
      serviceExperienceState === "opening" ||
      serviceExperienceState === "closing");
  const bodyVisible = !serviceExperienceEnabled || serviceExperienceState === "body";

  const focusExploreButton = useCallback(() => {
    window.setTimeout(
      () => {
        exploreButtonRef.current?.focus({ preventScroll: true });
      },
      policy.motionEnabled ? 620 : 0,
    );
  }, [policy.motionEnabled]);

  const handleExplore = useCallback(() => {
    if (serviceExperienceState !== "intro") {
      return;
    }
    window.scrollTo({ left: 0, top: 0, behavior: "auto" });
    openServiceBody();
  }, [openServiceBody, serviceExperienceState]);

  const handleOpeningComplete = useCallback(() => {
    completeServiceOpening();
    window.setTimeout(() => {
      document.getElementById("main-content")?.focus({ preventScroll: true });
    }, 60);
  }, [completeServiceOpening]);

  const handleClosingReady = useCallback(() => {
    completeServiceClosing();
    focusExploreButton();
  }, [completeServiceClosing, focusExploreButton]);

  const handleCloseBody = useCallback(() => {
    closeServiceBody();
  }, [closeServiceBody]);

  useEffect(() => {
    if (!serviceExperienceEnabled || !bodyVisible) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleCloseBody();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [bodyVisible, handleCloseBody, serviceExperienceEnabled]);

  if (!serviceExperienceEnabled) {
    return (
      <RoutePageFrame
        content={content}
        eyebrow="Services"
        route={route}
        showRelated={false}
      >
        <ServicePageVisuals route={route} />
      </RoutePageFrame>
    );
  }

  return (
    <div
      className="ss-service-experience"
      data-content-id={route.contentId}
      data-service-state={serviceExperienceState}
      data-source-file={route.sourceFile}
      data-tier={policy.tier}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildRouteSchemaGraph(route)),
        }}
        type="application/ld+json"
      />
      <LayoutGroup id={`ss-service-explore-${route.id}`}>
        {introVisible ? (
          <ServiceIntro
            buttonDisabled={serviceExperienceState !== "intro"}
            buttonHidden={serviceExperienceState === "opening"}
            buttonRef={exploreButtonRef}
            experience={experience}
            motionEnabled={policy.motionEnabled}
            onExplore={handleExplore}
          />
        ) : null}
        <ExploreSystemTransition
          state={serviceExperienceState}
          onOpeningComplete={handleOpeningComplete}
          onClosingReady={handleClosingReady}
        />
      </LayoutGroup>

      <div
        className="ss-service-experience__body"
        aria-hidden={bodyVisible ? undefined : true}
        data-service-body-visible={bodyVisible ? "true" : "false"}
      >
        {bodyVisible ? (
          <BodyParticles enabled={policy.motionEnabled} tier={policy.tier} />
        ) : null}
        <div className="ss-service-experience__content">
          <RoutePageFrame
            content={content}
            emitSchema={false}
            eyebrow="Services"
            entryExperience={false}
            route={route}
            showRelated={false}
            showHeader={false}
            showBreadcrumbs={false}
          >
            <ServicePageVisuals
              key={serviceExperienceState === "body" ? "svc-body" : "svc-hidden"}
              route={route}
            />
          </RoutePageFrame>
        </div>
        <button
          type="button"
          className="ss-hv2-return ss-service-experience__return"
          onClick={handleCloseBody}
          aria-label="Return to route intro"
          title="Return to route intro"
          hidden={!bodyVisible}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
