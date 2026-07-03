/**
 * Industry detail template — mirrors the ServicePage experience shell exactly:
 * CoreSpin loader gate → full-screen Aether intro (Industries palette) →
 * expandable shared-layout hero button → body with Particles background,
 * secondary hero, bespoke composition and reverse-return control. The shared
 * app-experience state machine drives the same open/close/replay behaviour
 * used by Home and Services.
 */
import "~/styles/visual/home-v2.css";

import { LayoutGroup } from "motion/react";
import { useCallback, useEffect, useRef, type Ref } from "react";
import { RotateCcw } from "~/components/icons/lucide";

import { useAppExperience } from "~/app/experience/app-experience";
import type { MigratedContentRecord } from "~/content/migrated";
import { getRouteExperienceByPath } from "~/data/route-experiences";
import type { FutureRouteRecord } from "~/data/route-schema";
import { IndustryExperienceV2 } from "~/features/industries-v2/industry-experience";
import { RoutePageFrame } from "~/routes/templates/route-page-frame";
import { BodyParticles } from "~/visual/home-v2/body-particles";
import { ExploreSystemTransition } from "~/visual/home-v2/explore-system-button";
import { deriveMotionPolicy } from "~/visual/home-v2/motion-policy";
import { useCapabilityTier } from "~/visual/hooks/use-capability-tier";
import { buildRouteSchemaGraph, serializeJsonLd } from "~/seo/schema";
import { RouteExperienceIntro } from "~/visual/components/route-experience-intro";

type IndustryPageProps = {
  content?: MigratedContentRecord | null;
  route: FutureRouteRecord;
};

function IndustryIntro({
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

export function IndustryPage({ route }: IndustryPageProps) {
  const capability = useCapabilityTier();
  const policy = deriveMotionPolicy({
    tier: capability.tier,
    reducedMotion: capability.reducedMotion,
    shaderEligible: capability.shaderEligible,
  });
  const {
    closeRouteBody,
    completeRouteClosing,
    completeRouteOpening,
    openRouteBody,
    routeExperienceState,
  } = useAppExperience();
  const exploreButtonRef = useRef<HTMLButtonElement>(null);
  const experience = getRouteExperienceByPath(route.path);

  const introVisible =
    routeExperienceState === "intro" ||
    routeExperienceState === "opening" ||
    routeExperienceState === "closing";
  const bodyVisible = routeExperienceState === "body";

  const focusExploreButton = useCallback(() => {
    window.setTimeout(
      () => {
        exploreButtonRef.current?.focus({ preventScroll: true });
      },
      policy.motionEnabled ? 620 : 0,
    );
  }, [policy.motionEnabled]);

  const handleExplore = useCallback(() => {
    if (routeExperienceState !== "intro") {
      return;
    }
    window.scrollTo({ left: 0, top: 0, behavior: "auto" });
    openRouteBody();
  }, [openRouteBody, routeExperienceState]);

  const handleOpeningComplete = useCallback(() => {
    completeRouteOpening();
    window.setTimeout(() => {
      document.getElementById("main-content")?.focus({ preventScroll: true });
    }, 60);
  }, [completeRouteOpening]);

  const handleClosingReady = useCallback(() => {
    completeRouteClosing();
    focusExploreButton();
  }, [completeRouteClosing, focusExploreButton]);

  const handleCloseBody = useCallback(() => {
    closeRouteBody();
  }, [closeRouteBody]);

  useEffect(() => {
    if (!bodyVisible) {
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
  }, [bodyVisible, handleCloseBody]);

  return (
    <div
      className="ss-service-experience ss-industry-experience"
      data-content-id={route.contentId}
      data-service-state={routeExperienceState}
      data-source-file={route.sourceFile}
      data-tier={policy.tier}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildRouteSchemaGraph(route)),
        }}
        type="application/ld+json"
      />
      <LayoutGroup id={`ss-industry-explore-${route.id}`}>
        {introVisible ? (
          <IndustryIntro
            buttonDisabled={routeExperienceState !== "intro"}
            buttonHidden={routeExperienceState === "opening"}
            buttonRef={exploreButtonRef}
            experience={experience}
            motionEnabled={policy.motionEnabled}
            onExplore={handleExplore}
          />
        ) : null}
        <ExploreSystemTransition
          state={routeExperienceState}
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
            content={null}
            emitSchema={false}
            eyebrow="Industries"
            entryExperience={false}
            route={route}
            showRelated={false}
            showHeader={false}
            showBreadcrumbs={false}
          >
            <IndustryExperienceV2
              key={routeExperienceState === "body" ? "ind-body" : "ind-hidden"}
              route={route.path}
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
