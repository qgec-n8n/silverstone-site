import "~/styles/visual/home-v2.css";

import { LayoutGroup } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
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
  IntegrationCarousel,
  ProcessStory,
  SecondaryHero,
  ServicesUniverse,
  Standard,
  TrustStrip,
} from "~/visual/home-v2/sections";
import { ScrollProvider } from "~/visual/home-v2/scroll-provider";
import { useCapabilityTier } from "~/visual/hooks/use-capability-tier";

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
      className="ss-hv2"
      data-tier={policy.tier}
      data-homepage-state={homepageState}
      data-content-id={contentId}
    >
      <LayoutGroup id="ss-home-explore">
        {introVisible ? (
          <Hero
            exploreButtonDisabled={homepageState !== "intro"}
            exploreButtonRef={exploreButtonRef}
            hideExploreButton={homepageState === "opening"}
            motionEnabled={policy.motionEnabled}
            onExplore={handleExplore}
          />
        ) : null}
        <ExploreSystemTransition
          state={homepageState}
          onOpeningComplete={handleOpeningComplete}
          onClosingReady={handleClosingReady}
        />
      </LayoutGroup>

      {bodyVisible ? (
        <div className="ss-hv2__body">
          <BodyParticles enabled={policy.motionEnabled} tier={policy.tier} />
          <ScrollProvider enabled={policy.scrollChoreography}>
            <SecondaryHero />
            <TrustStrip />
            <ServicesUniverse />
            <AiConsulting />
            <BenchmarkMetrics countersEnabled={policy.countersEnabled} />
            <IntegrationCarousel marqueeEnabled={policy.marqueeEnabled} />
            <ProcessStory />
            <ImageStorytelling />
            <Standard />
            <ConversionClimax />
          </ScrollProvider>
          <button
            type="button"
            className="ss-hv2-return"
            onClick={handleCloseBody}
            aria-label="Return to intro"
            title="Return to intro"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
