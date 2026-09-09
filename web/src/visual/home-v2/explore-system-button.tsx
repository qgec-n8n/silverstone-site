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

import {
  DEFAULT_AETHER_PALETTE,
  type AetherPalette,
} from "~/visual/home-v2/hero-aether-field";
import type {
  HomepageState,
  RouteExperienceState,
} from "~/app/experience/app-experience";

/**
 * How long the pill takes to become the page, and the page to become the pill
 * again. One number for both directions, so open and close read as the same
 * movement played forwards and backwards.
 *
 * It is also published to CSS as `--ss-explore-morph-duration` (below) so the
 * site header's arrival and departure ride the exact same clock without the
 * duration being written down twice.
 */
const MORPH_DURATION_MS = 900;

/** CSS custom property carrying {@link MORPH_DURATION_MS} to the stylesheets. */
const MORPH_DURATION_PROPERTY = "--ss-explore-morph-duration";

/**
 * Stamped on the route body wrapper for the duration of a morph (value:
 * "opening" | "closing"). The stylesheet pins the wrapper over the viewport on
 * that attribute; the controller below animates it.
 */
export const EXPLORE_STAGE_ATTRIBUTE = "data-explore-stage";

/**
 * How far the pinned body is scrolled, in CSS pixels, published so the fixed
 * particle backdrop inside it can hold still against the viewport while the
 * page it belongs to is scrolled and scaled around it.
 */
const STAGE_SCROLL_PROPERTY = "--ss-explore-stage-scroll";

/**
 * `AppExperience` records where the body was scrolled the moment a close is
 * requested (it then resets the window to the top for the intro). The closing
 * morph scrolls the pinned body back to that offset, so what collapses into
 * the pill is exactly what the visitor was looking at.
 */
export const EXPLORE_CLOSE_SCROLL_ATTRIBUTE = "data-explore-close-scroll";

const PILL_BACKGROUND_SELECTOR = ".ss-explore-cta__bg";

/**
 * Reveals inside the morphing layer resolve instantly while this is set (see
 * `~/motion/use-reveal-start`). The first screen of the body is what grows out
 * of the button, so its copy has to be *there* — a scroll entrance playing
 * inside a layer that is itself scaling is the two animations fighting, which
 * is exactly what read as jitter. Everything below the fold is clipped out of
 * view during the morph, so it never resolves here and keeps its normal
 * scroll-triggered entrance afterwards.
 */
const REVEAL_BYPASS_ATTRIBUTE = "data-reveal-bypass";

/**
 * Safety net for both directions: if the animation never reports completion
 * (a backgrounded tab suspends it) the state machine still advances.
 */
const MORPH_FALLBACK_MS = MORPH_DURATION_MS + 1500;

/** Keyframes sampled across the morph. ~15ms apart, finer than a frame at 60Hz. */
const MORPH_SAMPLES = 60;

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
        The pill's material. ExploreSystemTransition animates this span in step
        with the body while the two trade places, so the pill's own gradient is
        what visibly stretches into (and shrinks out of) the page. The label
        above it is folded away by CSS while the button is disabled.
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
 * The crossfade Motion applies to a shared-layout handover: the element taking
 * over fades in across the first half of the journey while the one it replaces
 * fades out, so by the midpoint only the new surface remains and the second
 * half is pure movement.
 */
const crossfadeIn = (t: number) => (t >= 0.5 ? 1 : circOut(t / 0.5));
const crossfadeOut = (t: number) => (t >= 0.5 ? 1 : circIn(t / 0.5));

/**
 * The curve Motion resolves `{ type: "spring", bounce: 0, duration }` to — a
 * critically damped spring — in closed form,
 *
 *     x(t) = 1 − (1 + ωt) · e^(−ωt)
 *
 * with ω sized so the spring has settled to within 0.1% at `duration`, which is
 * how Motion sizes a duration-based spring. Written out rather than imported
 * because pulling `animate` in from Motion drags its whole value-animation
 * runtime (~11 KB gzip) into the bundle every visitor downloads.
 */
const SPRING_SETTLE = 9.233;

function springProgress(fraction: number): number {
  const k = SPRING_SETTLE * fraction;
  return 1 - (1 + k) * Math.exp(-k);
}

/**
 * Project a box laid out at `layout` onto `box` — a translate + scale from its
 * own top-left corner.
 */
function transformBetween(layout: Box, box: Box): string {
  const scaleX = box.w / layout.w;
  const scaleY = box.h / layout.h;
  return `translate3d(${(box.x - layout.x).toFixed(2)}px, ${(box.y - layout.y).toFixed(
    2,
  )}px, 0) scale(${scaleX.toFixed(5)}, ${scaleY.toFixed(5)})`;
}

/**
 * The on-screen corner radius `radius` expressed in the element's own
 * pre-transform units — counter-scaled per axis, so the corners stay round
 * while the two axes scale by different amounts. (The same correction Motion's
 * layout projection makes.)
 */
function radiusBetween(layout: Box, box: Box, radius: number): string {
  const scaleX = box.w / layout.w;
  const scaleY = box.h / layout.h;
  return `${(radius / scaleX).toFixed(2)}px / ${(radius / scaleY).toFixed(2)}px`;
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
  element.style.removeProperty(STAGE_SCROLL_PROPERTY);
}

function readCloseScroll(): number {
  const raw = document.documentElement.getAttribute(EXPLORE_CLOSE_SCROLL_ATTRIBUTE);
  const value = raw === null ? 0 : Number(raw);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

type MorphKeyframes = {
  pillMotion: Keyframe[];
  pillRadius: Keyframe[];
  stageMotion: Keyframe[];
  stageRadius: Keyframe[];
};

/**
 * Sample the whole morph up front.
 *
 * Transform and opacity are handed to the compositor as one animation per
 * element; the corner radius rides a second one, because a keyframe list
 * mixing a composited property with a painted one drops the whole animation
 * back onto the main thread. Sampling also means the spring, the crossfade and
 * the radius correction — three different curves — stay exactly in step
 * without three separate clocks.
 */
function buildMorphKeyframes(from: Box, to: Box, opening: boolean): MorphKeyframes {
  const stageMotion: Keyframe[] = [];
  const stageRadius: Keyframe[] = [];
  const pillMotion: Keyframe[] = [];
  const pillRadius: Keyframe[] = [];

  for (let sample = 0; sample <= MORPH_SAMPLES; sample += 1) {
    const offset = sample / MORPH_SAMPLES;
    const travelled = springProgress(offset);
    // Closing is the same spring read from the far end.
    const progress = opening ? travelled : 1 - travelled;
    const box = {
      x: mix(from.x, to.x, progress),
      y: mix(from.y, to.y, progress),
      w: mix(from.w, to.w, progress),
      h: mix(from.h, to.h, progress),
    };
    // Fully round at the pill, square-cornered once it fills the viewport.
    const radius = mix(from.h / 2, 0, progress);
    // Opening, the body leads and the pill follows; closing, the reverse.
    const lead = opening ? progress : 1 - progress;
    const leadOpacity = crossfadeIn(lead);
    const followOpacity = 1 - crossfadeOut(lead);

    stageMotion.push({
      offset,
      opacity: String(opening ? leadOpacity : followOpacity),
      transform: transformBetween(to, box),
    });
    stageRadius.push({ offset, borderRadius: radiusBetween(to, box, radius) });
    pillMotion.push({
      offset,
      opacity: String(opening ? followOpacity : leadOpacity),
      transform: transformBetween(from, box),
    });
    pillRadius.push({ offset, borderRadius: radiusBetween(from, box, radius) });
  }

  return { pillMotion, pillRadius, stageMotion, stageRadius };
}

type ExploreSystemTransitionProps = {
  onClosingReady: () => void;
  onOpeningComplete: () => void;
  /** The intro's Explore button — the pill the body grows out of and back into. */
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
 * out of the button, content and all, forming a layer on top of the intro.
 * Closing runs the same spring backwards from wherever the visitor had
 * scrolled to, so the page they were reading shrinks back into the pill, which
 * crossfades in underneath and is left at rest when the body lands.
 *
 * Both directions are driven from sampled keyframes rather than a Motion
 * shared-layout (`layoutId`) handover: the body is a large, permanently
 * mounted document (it is every route's indexable copy), so it cannot be
 * remounted inside a card element on every open and close, and a layoutId
 * handover between two elements that mount in the same commit animates in
 * whichever direction their mount order happens to dictate.
 */
export function ExploreSystemTransition({
  onClosingReady,
  onOpeningComplete,
  pillRef,
  stageRef,
  state,
}: ExploreSystemTransitionProps) {
  const reduceMotion = useReducedMotion() ?? false;
  // Read through refs by the morph effect so a change of callback identity
  // mid-animation never restarts it. Synced in a layout effect declared ahead
  // of that effect, so they are current by the time it runs in the same commit.
  const onClosingReadyRef = useRef(onClosingReady);
  const onOpeningCompleteRef = useRef(onOpeningComplete);
  useLayoutEffect(() => {
    onClosingReadyRef.current = onClosingReady;
    onOpeningCompleteRef.current = onOpeningComplete;
  });

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

  /*
   * A layout effect so the very first painted frame of `opening` already shows
   * the body scaled down onto the pill (and of `closing`, the body still
   * full-size where it was): an ordinary effect would let the pinned,
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
    const root = document.documentElement;
    root.style.setProperty(MORPH_DURATION_PROPERTY, `${String(MORPH_DURATION_MS)}ms`);

    const finish = () => {
      if (opening) {
        onOpeningCompleteRef.current();
      } else {
        onClosingReadyRef.current();
      }
    };

    if (!stage || !pill) {
      // No pill on screen to morph from (or to): advance the state machine
      // rather than leave the route stuck between intro and body.
      finish();
      return undefined;
    }

    clearMorphStyles(stage);
    clearMorphStyles(pill);
    // The pill first: its box is the origin of the whole movement, and it must
    // be read before anything else on the page moves.
    const from = boxOf(pill);
    stage.setAttribute(EXPLORE_STAGE_ATTRIBUTE, state);
    stage.setAttribute(REVEAL_BYPASS_ATTRIBUTE, "");
    stage.scrollTop = opening ? 0 : readCloseScroll();
    stage.style.setProperty(STAGE_SCROLL_PROPERTY, `${String(stage.scrollTop)}px`);
    const to = boxOf(stage);

    const teardown = () => {
      clearMorphStyles(stage);
      clearMorphStyles(pill);
      stage.scrollTop = 0;
      stage.removeAttribute(EXPLORE_STAGE_ATTRIBUTE);
      stage.removeAttribute(REVEAL_BYPASS_ATTRIBUTE);
    };

    if (from.w <= 0 || from.h <= 0 || to.w <= 0 || to.h <= 0) {
      teardown();
      finish();
      return undefined;
    }

    for (const element of [stage, pill]) {
      element.style.transformOrigin = "0 0";
      element.style.willChange = "transform, opacity";
    }

    const frames = buildMorphKeyframes(from, to, opening);
    const timing: KeyframeAnimationOptions = {
      duration: MORPH_DURATION_MS,
      // The curve lives in the sampled keyframes, so the clock between them
      // must not add one of its own.
      easing: "linear",
      fill: "forwards",
    };
    const animations = [
      stage.animate(frames.stageMotion, timing),
      stage.animate(frames.stageRadius, timing),
      pill.animate(frames.pillMotion, timing),
      pill.animate(frames.pillRadius, timing),
    ];

    let settled = false;
    const settle = () => {
      if (settled) {
        return;
      }
      settled = true;
      if (!opening) {
        // The intro is underneath and ready; drop the layer before handing back.
        for (const animation of animations) {
          animation.cancel();
        }
        teardown();
      }
      finish();
    };

    // Opening leaves the body pinned at full size (the animation holds it via
    // `fill: forwards`) until the route flips to `body`; that same commit puts
    // it back into normal flow at the position it is already showing.
    animations[0]?.addEventListener("finish", settle);
    const fallback = window.setTimeout(settle, MORPH_FALLBACK_MS);

    return () => {
      window.clearTimeout(fallback);
      for (const animation of animations) {
        animation.cancel();
      }
      teardown();
      root.style.removeProperty(MORPH_DURATION_PROPERTY);
    };
  }, [pillRef, reduceMotion, stageRef, state]);

  return null;
}

export default ExploreSystemButton;
