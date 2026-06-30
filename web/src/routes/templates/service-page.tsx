import "~/styles/visual/home-v2.css";

import { LayoutGroup, type Variants } from "motion/react";
import * as m from "motion/react-m";
import { useCallback, useEffect, useRef, type Ref } from "react";
import { RotateCcw } from "~/components/icons/lucide";

import { useAppExperience } from "~/app/experience/app-experience";
import { Container } from "~/components/layout/container";
import type { MigratedContentRecord } from "~/content/migrated";
import type { FutureRouteRecord } from "~/data/route-schema";
import { RoutePageFrame } from "~/routes/templates/route-page-frame";
import { ServicePageVisuals } from "~/visual/data/page-modules";
import { BodyParticles } from "~/visual/home-v2/body-particles";
import {
  ExploreSystemButton,
  ExploreSystemTransition,
} from "~/visual/home-v2/explore-system-button";
import { HeroAetherField } from "~/visual/home-v2/hero-aether-field";
import { deriveMotionPolicy } from "~/visual/home-v2/motion-policy";
import { useCapabilityTier } from "~/visual/hooks/use-capability-tier";
import { buildRouteSchemaGraph, serializeJsonLd } from "~/seo/schema";

type ServicePageProps = {
  content?: MigratedContentRecord | null;
  route: FutureRouteRecord;
};

const introItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.52 + index * 0.2, duration: 0.95, ease: "easeInOut" },
  }),
};

function ServiceIntro({
  buttonDisabled,
  buttonHidden,
  buttonRef,
  motionEnabled,
  onExplore,
  route,
}: {
  buttonDisabled: boolean;
  buttonHidden: boolean;
  buttonRef: Ref<HTMLButtonElement>;
  motionEnabled: boolean;
  onExplore: () => void;
  route: FutureRouteRecord;
}) {
  return (
    <section className="ss-service-intro" aria-label={`${route.h1} intro`}>
      <HeroAetherField />
      <div className="ss-hv2-hero__grid" aria-hidden="true" />
      <div className="ss-hv2-hero__veil" aria-hidden="true" />

      <Container size="wide" className="relative z-10">
        <m.div
          animate="show"
          className="ss-service-intro__content flex flex-col items-center gap-7 text-center"
          initial={motionEnabled ? "hidden" : false}
        >
          <m.span
            className="ss-hv2-aether-reveal ss-hv2-kicker ss-eyebrow font-mono"
            custom={0}
            variants={introItem}
          >
            <span className="ss-hv2-kicker__dot" aria-hidden="true" />
            Silverstone service system
          </m.span>

          <m.h1
            className="ss-hv2-aether-reveal ss-hv2-display ss-service-intro__title"
            custom={1}
            variants={introItem}
          >
            {route.h1}
          </m.h1>

          <m.p
            className="ss-lead ss-service-intro__lead text-[color:var(--ss-v2-titanium)]"
            custom={2}
            variants={introItem}
          >
            {route.description}
          </m.p>

          {buttonHidden ? null : (
            <m.div
              className="flex flex-wrap items-center justify-center gap-4"
              custom={3}
              variants={introItem}
            >
              <ExploreSystemButton
                ref={buttonRef}
                disabled={buttonDisabled}
                onActivate={onExplore}
              />
            </m.div>
          )}
        </m.div>
      </Container>
    </section>
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
      <RoutePageFrame content={content} eyebrow="Services" route={route}>
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
            motionEnabled={policy.motionEnabled}
            onExplore={handleExplore}
            route={route}
          />
        ) : null}
        <ExploreSystemTransition
          state={serviceExperienceState}
          onOpeningComplete={handleOpeningComplete}
          onClosingReady={handleClosingReady}
        />
      </LayoutGroup>

      {bodyVisible ? (
        <div className="ss-service-experience__body">
          <BodyParticles enabled={policy.motionEnabled} tier={policy.tier} />
          <div className="ss-service-experience__content">
            <RoutePageFrame
              content={content}
              emitSchema={false}
              eyebrow="Services"
              route={route}
            >
              <ServicePageVisuals route={route} />
            </RoutePageFrame>
          </div>
          <button
            type="button"
            className="ss-hv2-return ss-service-experience__return"
            onClick={handleCloseBody}
            aria-label="Return to service intro"
            title="Return to service intro"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
