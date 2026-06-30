import { AnimatePresence, useReducedMotion, type Transition } from "motion/react";
import * as m from "motion/react-m";
import { ArrowRight } from "~/components/icons/lucide";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type MouseEventHandler,
} from "react";
import { createPortal } from "react-dom";

import type {
  HomepageState,
  RouteExperienceState,
} from "~/app/experience/app-experience";

export const EXPLORE_CARD_LAYOUT_ID = "ss-explore-card";

const SHARED_TRANSITION: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.62,
};

type ExploreSystemButtonProps = {
  disabled?: boolean;
  label?: string;
  layoutEnabled?: boolean;
  onActivate: () => void;
};

export const ExploreSystemButton = forwardRef<
  HTMLButtonElement,
  ExploreSystemButtonProps
>(function ExploreSystemButton(
  { disabled = false, label = "Explore the system", layoutEnabled = true, onActivate },
  ref,
) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    if (!disabled) {
      onActivate();
    }
  };

  return (
    <m.button
      ref={ref}
      type="button"
      onClick={handleClick}
      className="ss-explore-cta"
      disabled={disabled}
      initial={{ opacity: 0, scale: 0.9, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
    >
      <m.span
        {...(layoutEnabled ? { layoutId: EXPLORE_CARD_LAYOUT_ID } : {})}
        className="ss-explore-cta__bg"
        style={{ borderRadius: 999 }}
        transition={SHARED_TRANSITION}
        aria-hidden="true"
      />
      <span className="ss-explore-cta__label">
        {label}
        <ArrowRight className="size-[1.05rem]" aria-hidden="true" />
      </span>
    </m.button>
  );
});

type ExploreSystemTransitionProps = {
  bodyBackdropReady?: boolean;
  onClosingReady: () => void;
  onOpeningComplete: () => void;
  state: HomepageState | RouteExperienceState;
};

/**
 * Shared-layout surface for the intro/body handoff. The homepage route owns the
 * state machine; this component owns only the animated bridge. Opening completes
 * from the layout animation, while closing deliberately waits a beat before the
 * overlay exits back to the restored intro button.
 */
export function ExploreSystemTransition({
  bodyBackdropReady = true,
  onClosingReady,
  onOpeningComplete,
  state,
}: ExploreSystemTransitionProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const completedOpenRef = useRef(false);
  const closingTimerRef = useRef<number | null>(null);
  const openingFallbackTimerRef = useRef<number | null>(null);
  const openingReadyPendingRef = useRef(false);
  const active = state === "opening" || state === "closing";

  useEffect(() => {
    if (state !== "opening") {
      completedOpenRef.current = false;
      openingReadyPendingRef.current = false;
      if (openingFallbackTimerRef.current !== null) {
        window.clearTimeout(openingFallbackTimerRef.current);
        openingFallbackTimerRef.current = null;
      }
    }
  }, [state]);

  useEffect(() => {
    if (state === "opening" && reduceMotion) {
      onOpeningComplete();
    }
  }, [onOpeningComplete, reduceMotion, state]);

  useEffect(() => {
    if (state !== "opening" || reduceMotion) {
      return undefined;
    }

    openingFallbackTimerRef.current = window.setTimeout(() => {
      if (!completedOpenRef.current) {
        completedOpenRef.current = true;
        onOpeningComplete();
      }
    }, 2400);

    return () => {
      if (openingFallbackTimerRef.current !== null) {
        window.clearTimeout(openingFallbackTimerRef.current);
        openingFallbackTimerRef.current = null;
      }
    };
  }, [onOpeningComplete, reduceMotion, state]);

  useEffect(() => {
    if (
      state !== "opening" ||
      !bodyBackdropReady ||
      !openingReadyPendingRef.current ||
      completedOpenRef.current ||
      reduceMotion
    ) {
      return;
    }
    completedOpenRef.current = true;
    openingReadyPendingRef.current = false;
    window.setTimeout(onOpeningComplete, 120);
  }, [bodyBackdropReady, onOpeningComplete, reduceMotion, state]);

  useEffect(() => {
    if (state !== "closing") {
      if (closingTimerRef.current !== null) {
        window.clearTimeout(closingTimerRef.current);
        closingTimerRef.current = null;
      }
      return undefined;
    }

    closingTimerRef.current = window.setTimeout(onClosingReady, reduceMotion ? 0 : 520);
    return () => {
      if (closingTimerRef.current !== null) {
        window.clearTimeout(closingTimerRef.current);
        closingTimerRef.current = null;
      }
    };
  }, [onClosingReady, reduceMotion, state]);

  const handleLayoutComplete = useCallback(() => {
    if (state !== "opening" || completedOpenRef.current || reduceMotion) {
      return;
    }
    if (!bodyBackdropReady) {
      openingReadyPendingRef.current = true;
      return;
    }
    completedOpenRef.current = true;
    window.setTimeout(onOpeningComplete, 180);
  }, [bodyBackdropReady, onOpeningComplete, reduceMotion, state]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {active ? (
        <div className="ss-explore-overlay" data-phase={state} aria-hidden="true">
          <m.div
            layoutId={EXPLORE_CARD_LAYOUT_ID}
            className="ss-explore-overlay__card"
            style={{ borderRadius: state === "opening" ? 28 : 0 }}
            transition={SHARED_TRANSITION}
            exit={{
              opacity: 0,
              transition: { duration: reduceMotion ? 0 : 0.5, ease: "easeInOut" },
            }}
            onLayoutAnimationComplete={handleLayoutComplete}
          >
            <m.span
              className="ss-explore-overlay__glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: state === "closing" ? 0.55 : 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.12, duration: 0.36 }}
            />
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export default ExploreSystemButton;
