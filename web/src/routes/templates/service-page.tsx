import "~/styles/visual/home-v2.css";

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
  const bodyRef = useRef<HTMLDivElement>(null);
  const experience = getRouteExperienceByPath(route.path);

  const introVisible =
    serviceExperienceEnabled &&
    (serviceExperienceState === "intro" ||
      serviceExperienceState === "opening" ||
      serviceExperienceState === "closing");
  const bodyVisible = !serviceExperienceEnabled || serviceExperienceState === "body";
  // The body is the layer that grows out of the Explore pill and collapses back
  // into it, so its content and particle backdrop are live for both morphs,
  // not only once the state settles on `body`.
  const bodyMounted =
    bodyVisible ||
    serviceExperienceState === "opening" ||
    serviceExperienceState === "closing";

  /*
   * The particle engine starts once the body has landed, never while it is
   * expanding. Initialising particles.js is a chunky synchronous job (canvas
   * allocation plus the whole particle set) and running it on the frames the
   * morph starts was the single biggest main-thread block in the expansion.
   * The backdrop's gradient layers are mounted throughout, so the field behind
   * the copy is there from the first frame either way; only the drifting dots
   * arrive a beat later, fading in (see `.ss-hv2-backdrop__particles`).
   *
   * It deliberately stays live through `closing`, so the field shrinks into
   * the pill with the page rather than blinking out as the close begins.
   */
  const particlesLive =
    policy.motionEnabled && bodyMounted && serviceExperienceState !== "opening";

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
      // An inner surface (e.g. the web-design live showcase putting its demo
      // on standby) consumes Escape via preventDefault; only an unclaimed
      // Escape closes the body back to the intro.
      if (event.key === "Escape" && !event.defaultPrevented) {
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
        /* ServicePageVisuals owns the visible H1 (SecondaryHero), exactly as in
           the gated branch below. Leaving the frame's default header on would
           render a second one the moment a service route stopped qualifying for
           the experience — latent today, silent when it fires. */
        showHeader={false}
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
      {introVisible ? (
        <ServiceIntro
          buttonDisabled={serviceExperienceState !== "intro"}
          buttonRef={exploreButtonRef}
          experience={experience}
          motionEnabled={policy.motionEnabled}
          onExplore={handleExplore}
          settled={serviceExperienceState === "closing"}
        />
      ) : null}
      <ExploreSystemTransition
        pillRef={exploreButtonRef}
        stageRef={bodyRef}
        state={serviceExperienceState}
        onOpeningComplete={handleOpeningComplete}
        onClosingReady={handleClosingReady}
      />

      {/*
        `inert`, not `aria-hidden`. Both keep the closed body out of the tab
        order and the accessibility tree, but `aria-hidden="true"` is baked
        into the prerendered HTML, where text extractors read it as "this
        content is not for the user" and skip the entire subtree — which is
        why this route reported a few hundred characters of content while
        shipping several thousand. `inert` carries the same interaction
        semantics without suppressing the copy.
      */}
      <div
        ref={bodyRef}
        className="ss-service-experience__body"
        data-service-body-visible={bodyVisible ? "true" : "false"}
        inert={!bodyVisible}
      >
        {bodyMounted ? (
          <BodyParticles enabled={particlesLive} tier={policy.tier} />
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
            {/*
              No remount `key`. Rekeying the composition when the body opened
              replayed its scroll entrances, but it also put a full remount on
              the main thread on the exact frame the Explore morph started —
              the stutter in the first third of the expansion. The morph is the
              entrance now: `data-reveal-bypass` on the staged layer resolves
              the first screen's reveals instantly while it grows, and anything
              below the fold keeps its normal scroll-triggered entrance.
            */}
            <ServicePageVisuals route={route} />
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
