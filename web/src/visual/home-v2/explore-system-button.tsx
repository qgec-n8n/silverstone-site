import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";
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
  ServiceExperienceState,
} from "~/app/experience/app-experience";

export const EXPLORE_CARD_LAYOUT_ID = "ss-explore-card";

const SHARED_TRANSITION: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.62,
};

type ExploreSystemButtonProps = {
  disabled?: boolean;
  layoutEnabled?: boolean;
  onActivate: () => void;
};

export const ExploreSystemButton = forwardRef<
  HTMLButtonElement,
  ExploreSystemButtonProps
>(function ExploreSystemButton(
  { disabled = false, layoutEnabled = true, onActivate },
  ref,
) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    if (!disabled) {
      onActivate();
    }
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={handleClick}
      className="ss-explore-cta"
      disabled={disabled}
      initial={{ opacity: 0, scale: 0.9, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        {...(layoutEnabled ? { layoutId: EXPLORE_CARD_LAYOUT_ID } : {})}
        className="ss-explore-cta__bg"
        style={{ borderRadius: 999 }}
        transition={SHARED_TRANSITION}
        aria-hidden="true"
      />
      <span className="ss-explore-cta__label">
        Explore the system
        <ArrowRight className="size-[1.05rem]" aria-hidden="true" />
      </span>
    </motion.button>
  );
});

type ExploreSystemTransitionProps = {
  onClosingReady: () => void;
  onOpeningComplete: () => void;
  state: HomepageState | ServiceExperienceState;
};

/**
 * Shared-layout surface for the intro/body handoff. The homepage route owns the
 * state machine; this component owns only the animated bridge. Opening completes
 * from the layout animation, while closing deliberately waits a beat before the
 * overlay exits back to the restored intro button.
 */
export function ExploreSystemTransition({
  onClosingReady,
  onOpeningComplete,
  state,
}: ExploreSystemTransitionProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const completedOpenRef = useRef(false);
  const closingTimerRef = useRef<number | null>(null);
  const active = state === "opening" || state === "closing";

  useEffect(() => {
    if (state !== "opening") {
      completedOpenRef.current = false;
    }
  }, [state]);

  useEffect(() => {
    if (state === "opening" && reduceMotion) {
      onOpeningComplete();
    }
  }, [onOpeningComplete, reduceMotion, state]);

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
    completedOpenRef.current = true;
    window.setTimeout(onOpeningComplete, 180);
  }, [onOpeningComplete, reduceMotion, state]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {active ? (
        <div className="ss-explore-overlay" data-phase={state} aria-hidden="true">
          <motion.div
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
            <motion.span
              className="ss-explore-overlay__glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: state === "closing" ? 0.55 : 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.12, duration: 0.36 }}
            />
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export default ExploreSystemButton;
