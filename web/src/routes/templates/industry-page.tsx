/**
 * Industry detail template — mirrors the ServicePage experience shell exactly:
 * CoreSpin loader gate → full-screen Aether intro (Industries palette) →
 * expandable hero button (the body grows out of the pill) → body with
 * Particles background, secondary hero, custom composition and reverse-return
 * control. The shared app-experience state machine drives the same
 * open/close/replay behavior used by Home and Services.
 */
import "~/styles/visual/home-v2.css";

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
  buttonRef,
  experience,
  motionEnabled,
  onExplore,
  settled,
}: {
  buttonDisabled: boolean;
  buttonRef: Ref<HTMLButtonElement>;
  experience: ReturnType<typeof getRouteExperienceByPath>;
  motionEnabled: boolean;
  onExplore: () => void;
  settled: boolean;
}) {
  return (
    <RouteExperienceIntro
      buttonDisabled={buttonDisabled}
      buttonRef={buttonRef}
      experience={experience}
      motionEnabled={motionEnabled}
      onExplore={onExplore}
      settled={settled}
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
  const bodyRef = useRef<HTMLDivElement>(null);
  const experience = getRouteExperienceByPath(route.path);

  const introVisible =
    routeExperienceState === "intro" ||
    routeExperienceState === "opening" ||
    routeExperienceState === "closing";
  const bodyVisible = routeExperienceState === "body";
  // The body is the layer that grows out of the Explore pill and collapses back
  // into it, so its content and particle backdrop are live for both morphs,
  // not only once the state settles on `body`.
  const bodyMounted =
    bodyVisible ||
    routeExperienceState === "opening" ||
    routeExperienceState === "closing";

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
      if (event.key === "Escape" && !event.defaultPrevented) {
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
      {introVisible ? (
        <IndustryIntro
          buttonDisabled={routeExperienceState !== "intro"}
          buttonRef={exploreButtonRef}
          experience={experience}
          motionEnabled={policy.motionEnabled}
          onExplore={handleExplore}
          settled={routeExperienceState === "closing"}
        />
      ) : null}
      <ExploreSystemTransition
        pillRef={exploreButtonRef}
        stageRef={bodyRef}
        state={routeExperienceState}
        onOpeningComplete={handleOpeningComplete}
        onClosingReady={handleClosingReady}
      />

      {/*
        `inert` rather than `aria-hidden` — see the note in `service-page.tsx`.
        `aria-hidden="true"` in the prerendered HTML makes text extractors skip
        the whole body, which left every gated route looking thin.
      */}
      <div
        ref={bodyRef}
        className="ss-service-experience__body"
        data-service-body-visible={bodyVisible ? "true" : "false"}
        inert={!bodyVisible}
      >
        {bodyMounted ? (
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
            {/*
              No remount `key`. Rekeying the composition when the body opened
              replayed its scroll entrances, but it also put a full remount on
              the main thread on the exact frame the Explore morph started —
              the stutter in the first third of the expansion. The morph is the
              entrance now: `data-reveal-bypass` on the staged layer resolves
              the first screen's reveals instantly while it grows, and anything
              below the fold keeps its normal scroll-triggered entrance.
            */}
            <IndustryExperienceV2 route={route.path} />
          </RoutePageFrame>
        </div>
        <button
          type="button"
          className="ss-hv2-return ss-service-experience__return"
          onClick={handleCloseBody}
          aria-label="Return to intro"
          title="Return to intro"
          hidden={!bodyVisible}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
