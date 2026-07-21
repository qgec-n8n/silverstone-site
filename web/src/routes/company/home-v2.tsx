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
import { HomeSiteIndex } from "~/visual/home-v2/home-site-index";
import {
  AiConsulting,
  BenchmarkMetrics,
  ConversionClimax,
  ImageStorytelling,
  IndustryRelevance,
  IntegrationCarousel,
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

      {bodyVisible ? (
        <div className="ss-hv2__body">
          <ScrollProvider enabled={policy.scrollChoreography}>
            <SecondaryHero />
            <TrustStrip />
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
          </ScrollProvider>
          <HomepageReturnButton onClick={handleCloseBody} />
        </div>
      ) : null}

      {/* Always rendered (never gated): the crawlable site index must exist in
          the prerendered document regardless of the experience state. */}
      <HomeSiteIndex />
    </div>
  );
}
