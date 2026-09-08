import "~/styles/visual/home-v2.css";

import { LayoutGroup } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "~/components/icons/lucide";

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
      <X className="size-4" aria-hidden="true" />
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
  const [bodyBackdropReady, setBodyBackdropReady] = useState(false);
  const policy = deriveMotionPolicy({
    tier: capability.tier,
    reducedMotion: capability.reducedMotion,
    shaderEligible: capability.shaderEligible,
  });
  const introVisible =
    homepageState === "intro" ||
    homepageState === "opening" ||
    homepageState === "closing";
  const bodyVisible = homepageState === "body";
  const bodyParticlesPrepared = homepageState === "opening" || homepageState === "body";

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
    setBodyBackdropReady(!policy.motionEnabled);
    window.scrollTo({ left: 0, top: 0, behavior: "auto" });
    openHomepageBody();
  }, [homepageState, openHomepageBody, policy.motionEnabled]);

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
      <LayoutGroup id="ss-home-explore">
        {/*
         * Always mounted — never conditionally rendered. The homepage
         * prerenders in the "loading" state, so anything gated on
         * `introVisible`/`bodyVisible` is simply absent from the static
         * document; that is why the homepage used to ship no H1 and no
         * crawlable copy at all. The hero now renders into the HTML and is
         * gated visually instead: `revealed` drives its entrance animation,
         * and CSS drops it once the body owns the screen.
         */}
        <Hero
          exploreButtonDisabled={homepageState !== "intro"}
          exploreButtonRef={exploreButtonRef}
          hideExploreButton={homepageState === "opening"}
          motionEnabled={policy.motionEnabled}
          onExplore={handleExplore}
          revealed={introVisible}
        />
        <ExploreSystemTransition
          bodyBackdropReady={bodyBackdropReady}
          state={homepageState}
          onOpeningComplete={handleOpeningComplete}
          onClosingReady={handleClosingReady}
        />
      </LayoutGroup>

      {bodyParticlesPrepared ? (
        <BodyParticles
          enabled={policy.motionEnabled}
          onReady={() => setBodyBackdropReady(true)}
          tier={policy.tier}
        />
      ) : null}

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
       * body opens. The `key` remounts the sections on open so their scroll
       * entrances play from the top, matching the service routes.
       */}
      <div
        className="ss-hv2__body"
        data-home-body-visible={bodyVisible ? "true" : "false"}
        inert={!bodyVisible}
      >
        <ScrollProvider enabled={policy.scrollChoreography}>
          <div key={bodyVisible ? "home-body" : "home-idle"}>
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
