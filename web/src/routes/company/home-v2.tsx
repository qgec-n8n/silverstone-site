import "~/styles/visual/home-v2.css";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { RotateCcw } from "~/components/icons/lucide";

import { useAppExperience } from "~/app/experience/app-experience";
import { deriveMotionPolicy } from "~/visual/home-v2/motion-policy";
import { BodyParticles } from "~/visual/home-v2/body-particles";
import { ExploreSystemTransition } from "~/visual/home-v2/explore-system-button";
import { Hero } from "~/visual/home-v2/hero";
import {
  AiConsulting,
  BenchmarkMetrics,
  ConversionClimax,
  ImageStorytelling,
  IndustryRelevance,
  IntegrationCarousel,
  OperatingLayer,
  ProcessStory,
  SecondaryHero,
  ServicesUniverse,
  Standard,
  SystemVisual,
  TrustStrip,
} from "~/visual/home-v2/sections";
import { ScrollProvider } from "~/visual/home-v2/scroll-provider";
import { useCapabilityTier } from "~/visual/hooks/use-capability-tier";

function HomepageReturnButton({ onClick }: { onClick: () => void }) {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <button
      type="button"
      className="ss-hv2-return"
      onClick={onClick}
      aria-label="Return to intro"
      title="Return to intro"
    >
      <RotateCcw className="size-4" aria-hidden="true" />
    </button>,
    document.body,
  );
}

/**
 * V2 homepage presentation. The capability tier and motion policy are resolved
 * once here and threaded down so individual sections never re-derive motion
 * state. Reduced motion / low power collapses the whole page to a calm static
 * surface via the `minimal` tier.
 */
export function HomeV2({ contentId }: { contentId?: string }) {
  const capability = useCapabilityTier();
  const {
    closeHomepageBody,
    completeHomepageClosing,
    completeHomepageOpening,
    homepageState,
    openHomepageBody,
  } = useAppExperience();
  const exploreButtonRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const policy = deriveMotionPolicy({
    tier: capability.tier,
    reducedMotion: capability.reducedMotion,
    shaderEligible: capability.shaderEligible,
  });
  const bodyVisible = homepageState === "body";
  /*
   * The body is on screen for the whole of both morphs — it is the layer that
   * grows out of the Explore pill and later collapses back into it — so its
   * sections and particle backdrop are live from `opening` through `closing`,
   * not only once the state settles on `body`.
   */
  const bodyMounted =
    homepageState === "opening" ||
    homepageState === "body" ||
    homepageState === "closing";

  const focusExploreButton = useCallback(() => {
    window.setTimeout(
      () => {
        exploreButtonRef.current?.focus({ preventScroll: true });
      },
      policy.motionEnabled ? 620 : 0,
    );
  }, [policy.motionEnabled]);

  const handleExplore = useCallback(() => {
    if (homepageState !== "intro") {
      return;
    }
    window.scrollTo({ left: 0, top: 0, behavior: "auto" });
    openHomepageBody();
  }, [homepageState, openHomepageBody]);

  const handleOpeningComplete = useCallback(() => {
    completeHomepageOpening();
    window.setTimeout(() => {
      document.getElementById("system")?.focus({ preventScroll: true });
    }, 60);
  }, [completeHomepageOpening]);

  const handleClosingReady = useCallback(() => {
    completeHomepageClosing();
    focusExploreButton();
  }, [completeHomepageClosing, focusExploreButton]);

  const handleCloseBody = useCallback(() => {
    closeHomepageBody();
  }, [closeHomepageBody]);

  useEffect(() => {
    if (!bodyVisible) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      // A dialog on the page (an expanded image) handles its own Escape and
      // marks the event, so closing it must not also close the homepage body.
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
      className="ss-hv2"
      data-tier={policy.tier}
      data-homepage-state={homepageState}
      data-content-id={contentId}
    >
      {/*
       * Always mounted — never conditionally rendered. The homepage
       * prerenders in the "loading" state, so anything gated on
       * `bodyVisible` is simply absent from the static document; that is why
       * the homepage used to ship no H1 and no crawlable copy at all. The
       * hero now renders into the HTML and is gated visually instead:
       * `revealed` drives its one entrance (loader → intro) and CSS drops it
       * once the body owns the screen. It stays at rest from then on — never
       * back to hidden — so that when the body collapses into the Explore
       * pill, the pill is already exactly where the body lands.
       */}
      <Hero
        exploreButtonDisabled={homepageState !== "intro"}
        exploreButtonRef={exploreButtonRef}
        motionEnabled={policy.motionEnabled}
        onExplore={handleExplore}
        revealed={homepageState !== "loading"}
      />
      <ExploreSystemTransition
        pillRef={exploreButtonRef}
        stageRef={bodyRef}
        state={homepageState}
        onOpeningComplete={handleOpeningComplete}
        onClosingReady={handleClosingReady}
      />

      {/*
       * Always mounted, for the same reason the hero above is: anything gated
       * on `bodyVisible` is simply absent from the prerendered document, and
       * this is the homepage's entire body — every section of copy plus the
       * footer link graph. Mounting it only after the explore click left the
       * homepage shipping ~500 crawlable characters and zero visible links.
       *
       * It is gated visually instead: `.ss-hv2__body` collapses to zero
       * height while the intro owns the screen (see home-v2.css), and `inert`
       * keeps it out of the tab order and the accessibility tree until the
       * body opens. During the Explore morph this wrapper is the layer that
       * grows out of the pill (ExploreSystemTransition pins and transforms
       * it), which is why the particle backdrop lives inside it: it scales
       * with the page it sits behind.
       *
       * The sections deliberately carry no remount `key`. They used to be
       * rekeyed when the body opened, to replay their scroll entrances — but
       * that put a full remount of the entire homepage on the main thread on
       * the exact frame the morph started, which is what made the first third
       * of the expansion stutter. The morph itself is now the entrance: the
       * controller marks the layer `data-reveal-bypass` while it runs, so the
       * first screen is simply present as it grows, and everything below the
       * fold keeps its normal scroll-triggered entrance.
       */}
      <div
        ref={bodyRef}
        className="ss-hv2__body"
        data-home-body-visible={bodyVisible ? "true" : "false"}
        inert={!bodyVisible}
      >
        {bodyMounted ? (
          <BodyParticles enabled={policy.motionEnabled} tier={policy.tier} />
        ) : null}
        <ScrollProvider enabled={policy.scrollChoreography}>
          <div>
            <SecondaryHero />
            <TrustStrip />
            <OperatingLayer />
            <ServicesUniverse />
            <AiConsulting />
            <BenchmarkMetrics countersEnabled={policy.countersEnabled} />
            <SystemVisual />
            <IndustryRelevance />
            <IntegrationCarousel marqueeEnabled={policy.marqueeEnabled} />
            <ProcessStory />
            <ImageStorytelling />
            <Standard />
            <ConversionClimax />
          </div>
        </ScrollProvider>
      </div>
      {bodyVisible ? <HomepageReturnButton onClick={handleCloseBody} /> : null}
    </div>
  );
}
