import "~/styles/visual/home-v2.css";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { RotateCcw } from "~/components/icons/lucide";

import { useAppExperience } from "~/app/experience/app-experience";
import {
  getRouteExperienceByPath,
  type RouteExperience,
} from "~/data/route-experiences";
import { BodyParticles } from "~/visual/home-v2/body-particles";
import { ExploreSystemTransition } from "~/visual/home-v2/explore-system-button";
import { deriveMotionPolicy } from "~/visual/home-v2/motion-policy";
import { useCapabilityTier } from "~/visual/hooks/use-capability-tier";
import { RouteExperienceIntro } from "~/visual/components/route-experience-intro";

type RouteExperienceFrameProps = {
  children: ReactNode;
  enabled?: boolean;
  experience?: RouteExperience;
  /**
   * When true, this route never shows the Aether intro, the expandable-hero
   * "Explore" gate, or the return-to-intro control — it renders straight to
   * the particle body, permanently. For gate-free routes (Book) only; the
   * body still gets the shared particle background and layout chrome.
   */
  skipIntro?: boolean;
};

export function RouteExperienceFrame({
  children,
  enabled = true,
  experience,
  skipIntro = false,
}: RouteExperienceFrameProps) {
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
  const restoreIntroFocusRef = useRef(false);
  const resolvedExperience =
    experience ??
    (typeof window === "undefined"
      ? getRouteExperienceByPath("*")
      : getRouteExperienceByPath(window.location.pathname));

  const introVisible =
    !skipIntro &&
    enabled &&
    (routeExperienceState === "loading" ||
      routeExperienceState === "intro" ||
      routeExperienceState === "opening" ||
      routeExperienceState === "closing");
  const bodyVisible = skipIntro || !enabled || routeExperienceState === "body";
  /*
   * The body is the layer that grows out of the Explore pill and collapses
   * back into it, so its particle backdrop is mounted for both morphs — not
   * just once the state settles on `body`. Without `opening` here the route's
   * whole background was simply absent while the page expanded, which is
   * exactly the "the shader is there, then it isn't" flicker.
   */
  const bodyBackdropMounted =
    bodyVisible ||
    routeExperienceState === "opening" ||
    routeExperienceState === "closing";

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
    policy.motionEnabled && bodyBackdropMounted && routeExperienceState !== "opening";

  const focusExploreButton = useCallback(() => {
    const delays = policy.motionEnabled ? [620, 760] : [50, 140, 260];
    for (const delay of delays) {
      window.setTimeout(() => {
        const focusTarget = exploreButtonRef.current;
        if (
          focusTarget &&
          !focusTarget.disabled &&
          document.activeElement !== focusTarget
        ) {
          focusTarget.focus({ preventScroll: true });
        }
      }, delay);
    }
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
      document
        .getElementById(resolvedExperience.bodyHeadingId)
        ?.focus({ preventScroll: true });
    }, 60);
  }, [completeRouteOpening, resolvedExperience.bodyHeadingId]);

  const handleClosingReady = useCallback(() => {
    completeRouteClosing();
  }, [completeRouteClosing]);

  const handleCloseBody = useCallback(() => {
    restoreIntroFocusRef.current = true;
    closeRouteBody();
  }, [closeRouteBody]);

  useEffect(() => {
    if (
      skipIntro ||
      !enabled ||
      routeExperienceState !== "intro" ||
      !restoreIntroFocusRef.current
    ) {
      return;
    }

    restoreIntroFocusRef.current = false;
    focusExploreButton();
  }, [enabled, focusExploreButton, routeExperienceState, skipIntro]);

  useEffect(() => {
    if (skipIntro || !enabled || !bodyVisible) {
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
  }, [bodyVisible, enabled, handleCloseBody, skipIntro]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div
      className="ss-route-experience"
      data-route-experience-state={routeExperienceState}
      data-route-family={resolvedExperience.family}
      data-skip-intro={skipIntro || undefined}
    >
      {!skipIntro ? (
        <>
          {introVisible && routeExperienceState !== "loading" ? (
            <RouteExperienceIntro
              buttonDisabled={routeExperienceState !== "intro"}
              buttonRef={exploreButtonRef}
              experience={resolvedExperience}
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
        </>
      ) : null}

      {/*
        `inert` rather than `aria-hidden` — see the note in `service-page.tsx`.
        `aria-hidden="true"` in the prerendered HTML makes text extractors skip
        the whole body, which left every gated route looking thin.
      */}
      <div
        ref={bodyRef}
        className="ss-service-experience__body ss-route-experience__body"
        data-route-body-visible={bodyVisible ? "true" : "false"}
        inert={!bodyVisible}
      >
        {bodyBackdropMounted ? (
          <BodyParticles enabled={particlesLive} tier={policy.tier} />
        ) : null}
        <div className="ss-service-experience__content ss-route-experience__content">
          {children}
        </div>
        {!skipIntro ? (
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
        ) : null}
      </div>
    </div>
  );
}
