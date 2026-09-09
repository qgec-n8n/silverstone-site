import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { ArrowRight } from "~/components/icons/lucide";
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  type MouseEventHandler,
  type RefObject,
} from "react";

import type {
  HomepageState,
  RouteExperienceState,
} from "~/app/experience/app-experience";
import {
  DEFAULT_AETHER_PALETTE,
  type AetherPalette,
} from "~/visual/home-v2/hero-aether-field";

/**
 * One spring for both directions of the morph — the pill growing into the
 * body and the body collapsing back into the pill — so open and close read as
 * the same movement played forwards and backwards.
 *
 * It is the curve Motion resolves `{ type: "spring", bounce: 0, duration }`
 * to — a critically damped spring — written in closed form,
 *
 *     x(t) = 1 − (1 + ωt) · e^(−ωt)
 *
 * with ω sized so the spring has settled to within 0.1% at `duration`, which
 * is exactly how Motion sizes a duration-based spring. Stepping that formula
 * from requestAnimationFrame costs nothing; importing Motion's `animate()`
 * for it pulled the whole value-animation runtime (~11 KB gzip) into the
 * foundation bundle every visitor downloads, and over its hard ceiling.
 */
const MORPH_DURATION_MS = 620;
/** k solving (1 + k)·e^(−k) = 0.001: the settled point of the spring above. */
const MORPH_SETTLE = 9.233;

function springProgress(elapsedMs: number): number {
  const k = (MORPH_SETTLE * elapsedMs) / MORPH_DURATION_MS;
  return 1 - (1 + k) * Math.exp(-k);
}

/**
 * Drive `onFrame` with the spring's progress (0 → 1) once per animation frame
 * until it settles, then `onDone`. The clock starts on the first frame the
 * browser actually gives us, not when this is called: the commit that starts
 * a morph can be heavy (a route intro remounting its Aether canvas, the body
 * sections mounting), and keying the clock to the call would have the first
 * painted frame already several frames along — a visible jump at the start.
 * Returns a stop function.
 */
function runSpring(onFrame: (progress: number) => void, onDone: () => void) {
  let start: number | null = null;
  let frame = 0;
  const tick = (now: number) => {
    start ??= now;
    const elapsed = now - start;
    if (elapsed >= MORPH_DURATION_MS) {
      onFrame(1);
      onDone();
      return;
    }
    onFrame(springProgress(elapsed));
    frame = window.requestAnimationFrame(tick);
  };
  frame = window.requestAnimationFrame(tick);
  return () => {
    window.cancelAnimationFrame(frame);
  };
}

/**
 * Stamped on the route body wrapper for the duration of a morph (value:
 * "opening" | "closing"). The stylesheet pins the wrapper to the viewport on
 * that attribute; the controller below drives its transform.
 */
export const EXPLORE_STAGE_ATTRIBUTE = "data-explore-stage";

/**
 * `AppExperience` records where the body was scrolled the moment a close is
 * requested (it then resets the window to the top for the intro). The closing
 * morph scrolls the pinned body back to that offset, so what collapses into
 * the pill is exactly what the visitor was looking at.
 */
export const EXPLORE_CLOSE_SCROLL_ATTRIBUTE = "data-explore-close-scroll";

const PILL_BACKGROUND_SELECTOR = ".ss-explore-cta__bg";

/**
 * Safety net for both directions: if the spring never reports completion
 * (background tab, throttled frame loop) the state machine still advances.
 */
const MORPH_FALLBACK_MS = 2400;

type ExploreSystemButtonProps = {
  disabled?: boolean;
  /**
   * Play the pill's own entrance (fade / scale / rise). Off when the intro is
   * being put back behind a collapsing body: the pill has to be exactly where
   * the body lands, at rest, from its first frame.
   */
  entrance?: boolean;
  label?: string;
  onActivate: () => void;
  /**
   * The Aether field this button is sitting on. The pill takes its gradient,
   * glow and focus ring from the very colors drawn behind it — resting base
   * for the dots and lines, proximity flare for the second stop — so every
   * route's CTA wears that route's signal rather than the homepage cyan.
   */
  palette?: AetherPalette | undefined;
};

export const ExploreSystemButton = forwardRef<
  HTMLButtonElement,
  ExploreSystemButtonProps
>(function ExploreSystemButton(
  {
    disabled = false,
    entrance = true,
    label = "Explore the system",
    onActivate,
    palette,
  },
  ref,
) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    if (!disabled) {
      onActivate();
    }
  };

  // Resolved here rather than left to CSS `var()` fallbacks: an unregistered
  // route's field draws DEFAULT_AETHER_PALETTE, so that — not the cinematic
  // cyan/violet tokens — is what the button has to fall back to.
  const field = palette ?? DEFAULT_AETHER_PALETTE;
  // Left unannotated on purpose: `CSSProperties` widens motion's own style
  // props to `| undefined` under exactOptionalPropertyTypes and stops being
  // assignable to `MotionStyle`.
  const accentStyle = {
    "--ss-explore-accent": field.network,
    "--ss-explore-accent-2": field.proximity,
  };

  return (
    <m.button
      ref={ref}
      type="button"
      onClick={handleClick}
      className="ss-explore-cta"
      style={accentStyle}
      disabled={disabled}
      initial={entrance ? { opacity: 0, scale: 0.9, y: 18 } : false}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
    >
      {/*
        The pill's material. ExploreSystemTransition transforms this span in
        step with the body while the two trade places, so the pill's own
        gradient is what visibly stretches into (and shrinks out of) the page.
        The label above it is folded away by CSS while the button is disabled.
      */}
      <span className="ss-explore-cta__bg" aria-hidden="true" />
      <span className="ss-explore-cta__label">
        <span className="ss-explore-cta__dot" aria-hidden="true" />
        {label}
        <ArrowRight
          className="ss-explore-cta__icon size-[1.05rem]"
          aria-hidden="true"
        />
      </span>
    </m.button>
  );
});

type Box = { x: number; y: number; w: number; h: number };

function boxOf(element: Element): Box {
  const rect = element.getBoundingClientRect();
  return { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
}

const mix = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;
const circIn = (t: number) => 1 - Math.sqrt(1 - t * t);
const circOut = (t: number) => Math.sqrt(1 - (t - 1) ** 2);
/*
 * The crossfade Motion applies to a shared-layout handover: the element that
 * takes over fades in across the first half of the journey while the one it
 * replaces fades out, so at the midpoint only the new surface remains and the
 * second half is pure movement.
 */
const crossfadeIn = (t: number) => (t >= 0.5 ? 1 : circOut(t / 0.5));
const crossfadeOut = (t: number) => (t >= 0.5 ? 1 : circIn(t / 0.5));

/**
 * Project `element`, laid out at `layout`, onto `box` — a translate + scale
 * from its own top-left corner. The corner radius is the on-screen radius,
 * counter-scaled per axis so the corners stay round while the two axes scale
 * by different amounts (the same correction Motion's layout projection makes).
 */
function place(element: HTMLElement, layout: Box, box: Box, radius: number) {
  const scaleX = box.w / layout.w;
  const scaleY = box.h / layout.h;
  element.style.transform = `translate3d(${(box.x - layout.x).toFixed(2)}px, ${(
    box.y - layout.y
  ).toFixed(2)}px, 0) scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`;
  element.style.borderRadius = `${(radius / scaleX).toFixed(2)}px / ${(
    radius / scaleY
  ).toFixed(2)}px`;
}

function clearMorphStyles(element: HTMLElement | null) {
  if (!element) {
    return;
  }
  element.style.transform = "";
  element.style.transformOrigin = "";
  element.style.borderRadius = "";
  element.style.opacity = "";
  element.style.willChange = "";
}

function readCloseScroll(): number {
  const raw = document.documentElement.getAttribute(EXPLORE_CLOSE_SCROLL_ATTRIBUTE);
  const value = raw === null ? 0 : Number(raw);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

type ExploreSystemTransitionProps = {
  bodyBackdropReady?: boolean;
  onClosingReady: () => void;
  onOpeningComplete: () => void;
  /** The intro's Explore button — the pill the body grows out of and collapses back into. */
  pillRef: RefObject<HTMLButtonElement | null>;
  /** The route body wrapper: the layer that morphs. Stays mounted throughout. */
  stageRef: RefObject<HTMLElement | null>;
  state: HomepageState | RouteExperienceState;
};

/**
 * The expandable-hero morph. The route owns the state machine; this component
 * owns only the animated bridge between its `intro` and `body` states.
 *
 * Opening, the body wrapper is pinned over the viewport and scaled down onto
 * the Explore pill, then springs out to full size while the pill's own
 * background stretches with it and crossfades away — the body visibly grows
 * out of the button, content and all, forming a layer above the intro.
 * Closing runs the same spring backwards from wherever the visitor had
 * scrolled to, so the page they were reading shrinks back into the pill,
 * which crossfades in underneath and is left at rest when the body lands.
 *
 * Both directions are driven from one progress value rather than a Motion
 * shared-layout (`layoutId`) handover: the body is a large, permanently
 * mounted document (it is every route's indexable copy), so it cannot be
 * remounted inside a card element on every open and close, and a layoutId
 * handover between two elements that mount in the same commit animates in
 * whichever direction their mount order happens to dictate.
 */
export function ExploreSystemTransition({
  bodyBackdropReady = true,
  onClosingReady,
  onOpeningComplete,
  pillRef,
  stageRef,
  state,
}: ExploreSystemTransitionProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const completedOpenRef = useRef(false);
  const openingFallbackTimerRef = useRef<number | null>(null);
  const openingReadyPendingRef = useRef(false);
  // Read through refs by the morph effect so a change of callback identity or
  // backdrop readiness mid-spring never restarts the animation. Synced in a
  // layout effect declared ahead of the morph effect, so they are current by
  // the time it runs in the same commit.
  const bodyBackdropReadyRef = useRef(bodyBackdropReady);
  const onClosingReadyRef = useRef(onClosingReady);
  const onOpeningCompleteRef = useRef(onOpeningComplete);
  useLayoutEffect(() => {
    bodyBackdropReadyRef.current = bodyBackdropReady;
    onClosingReadyRef.current = onClosingReady;
    onOpeningCompleteRef.current = onOpeningComplete;
  });

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
    if (state === "closing" && reduceMotion) {
      onClosingReady();
    }
  }, [onClosingReady, reduceMotion, state]);

  useEffect(() => {
    if (state !== "opening" || reduceMotion) {
      return undefined;
    }

    openingFallbackTimerRef.current = window.setTimeout(() => {
      if (!completedOpenRef.current) {
        completedOpenRef.current = true;
        onOpeningComplete();
      }
    }, MORPH_FALLBACK_MS);

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

  /*
   * A layout effect so the very first painted frame of `opening` already
   * shows the body scaled down onto the pill (and of `closing`, the body
   * still full-size where it was): an ordinary effect would let the pinned,
   * untransformed body flash over the intro for a frame.
   */
  useLayoutEffect(() => {
    if (reduceMotion || (state !== "opening" && state !== "closing")) {
      return undefined;
    }
    const opening = state === "opening";
    const stage = stageRef.current;
    const pill =
      pillRef.current?.querySelector<HTMLElement>(PILL_BACKGROUND_SELECTOR) ?? null;

    const finishOpening = () => {
      if (completedOpenRef.current) {
        return;
      }
      if (!bodyBackdropReadyRef.current) {
        openingReadyPendingRef.current = true;
        return;
      }
      completedOpenRef.current = true;
      window.setTimeout(() => onOpeningCompleteRef.current(), 180);
    };
    const finishClosing = () => {
      onClosingReadyRef.current();
    };

    if (!stage || !pill) {
      // No pill on screen to morph from (or to): advance the state machine
      // rather than leave the route stuck between intro and body.
      if (opening) {
        finishOpening();
      } else {
        finishClosing();
      }
      return undefined;
    }

    clearMorphStyles(stage);
    clearMorphStyles(pill);
    // The pill first: its box is the origin of the whole movement, and it must
    // be read before anything else on the page moves.
    const from = boxOf(pill);
    stage.setAttribute(EXPLORE_STAGE_ATTRIBUTE, state);
    stage.scrollTop = opening ? 0 : readCloseScroll();
    const to = boxOf(stage);

    if (from.w <= 0 || from.h <= 0 || to.w <= 0 || to.h <= 0) {
      stage.removeAttribute(EXPLORE_STAGE_ATTRIBUTE);
      if (opening) {
        finishOpening();
      } else {
        finishClosing();
      }
      return undefined;
    }

    for (const element of [stage, pill]) {
      element.style.transformOrigin = "0 0";
      element.style.willChange = "transform, opacity";
    }

    const paint = (progress: number) => {
      const box = {
        x: mix(from.x, to.x, progress),
        y: mix(from.y, to.y, progress),
        w: mix(from.w, to.w, progress),
        h: mix(from.h, to.h, progress),
      };
      // Fully round at the pill, square-cornered once it fills the viewport.
      const radius = mix(from.h / 2, 0, progress);
      place(stage, to, box, radius);
      place(pill, from, box, radius);
      // Opening, the body leads and the pill follows; closing, the reverse.
      const leadProgress = opening ? progress : 1 - progress;
      const leadOpacity = crossfadeIn(leadProgress);
      const followOpacity = 1 - crossfadeOut(leadProgress);
      stage.style.opacity = String(opening ? leadOpacity : followOpacity);
      pill.style.opacity = String(opening ? followOpacity : leadOpacity);
    };

    let settled = false;
    const settle = () => {
      if (settled) {
        return;
      }
      settled = true;
      if (opening) {
        // Leave the body pinned at full size until the route flips to `body`;
        // that same commit puts it back into normal flow at the top of the
        // page, which is the position it is already showing.
        finishOpening();
        return;
      }
      clearMorphStyles(stage);
      clearMorphStyles(pill);
      stage.removeAttribute(EXPLORE_STAGE_ATTRIBUTE);
      finishClosing();
    };

    paint(opening ? 0 : 1);
    // The spring always runs 0 → 1; closing simply reads it backwards.
    const stopSpring = runSpring(
      (progress) => paint(opening ? progress : 1 - progress),
      settle,
    );
    const fallback = window.setTimeout(() => {
      stopSpring();
      settle();
    }, MORPH_FALLBACK_MS);

    return () => {
      stopSpring();
      window.clearTimeout(fallback);
      clearMorphStyles(stage);
      clearMorphStyles(pill);
      stage.removeAttribute(EXPLORE_STAGE_ATTRIBUTE);
    };
  }, [pillRef, reduceMotion, stageRef, state]);

  return null;
}

export default ExploreSystemButton;
