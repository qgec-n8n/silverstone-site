/**
 * The services-v2 reveal family: `Reveal`, `RevealGroup` and `PanelReveal`,
 * with the variants and timing the three share.
 *
 * Split out of `./primitives` so a caller that needs only a reveal does not
 * pull that module’s animation tail with it — `AnimatedMetricValue`’s
 * imperative `animate()` drags Motion’s whole animation engine into the
 * importing chunk, which on the home page meant every route paid for it.
 * `./primitives` re-exports everything public here, so existing imports are
 * unchanged.
 *
 * Motion is owned by the `motion` package (`motion/react-m`). Reveals replay
 * whenever the service body remounts (route intro ↔ body), and reduced-motion
 * visitors receive immediate, fully readable content.
 */
import {
  useReducedMotion,
  useInView,
  type MotionStyle,
  type Transition,
  type Variants,
} from "motion/react";

import * as m from "motion/react-m";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";

import { cn } from "~/lib/utils";
import { useRevealStart } from "~/motion/use-reveal-start";
import { useCapabilityTier } from "~/visual/hooks/use-capability-tier";

export const entranceEase = [0.22, 1, 0.36, 1] as const;

/**
 * When a `Reveal`/`PanelReveal` sits inside a `RevealGroup`, this carries the
 * group's "has the group scrolled into view yet" flag. `null` means there is no
 * surrounding group, so the child falls back to observing its own element — the
 * original per-element behavior.
 */
const RevealGroupContext = createContext<boolean | null>(null);

export type RevealKind = "section" | "card" | "metric" | "image" | "cta" | "pill";

const revealVariants: Record<RevealKind, Variants> = {
  pill: {
    hidden: { opacity: 0, y: 14, scale: 0.88 },
    show: { opacity: 1, y: 0, scale: 1 },
  },
  section: { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0 } },
  card: {
    hidden: { opacity: 0, y: 32, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1 },
  },
  metric: {
    hidden: { opacity: 0, y: 20, scale: 0.93 },
    show: { opacity: 1, y: 0, scale: 1 },
  },
  image: {
    hidden: { opacity: 0, scale: 1.06, clipPath: "inset(10% 8% round 20px)" },
    show: { opacity: 1, scale: 1, clipPath: "inset(0% 0% round 20px)" },
  },
  cta: {
    hidden: { opacity: 0, y: 34, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1 },
  },
};

/**
 * Below the `full` capability tier, the image reveal drops its animated
 * `clipPath` — a paint-triggering property the browser has to re-rasterize
 * on every frame, unlike the opacity/scale every other kind already used.
 * Same reasoning and pattern as home-v2's reveal.tsx (see its
 * liteRevealVariants); motion shape (the scale travel) is unchanged.
 */
const liteImageVariants: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  show: { opacity: 1, scale: 1 },
};

/**
 * Cinematic, unhurried timing: entrances are meant to be watched, not merely
 * noticed, so durations run 0.85–1.5s rather than the 150–300ms scale used
 * for hover/press feedback elsewhere. See the matching viewport threshold on
 * Reveal itself, which holds off firing until well into view for the same
 * reason.
 */
function transitionFor(
  kind: RevealKind,
  delayMs: number,
  instant = false,
  durationScale = 1,
): Transition {
  if (instant) {
    // Deep-link landing bypass: the shown state applies in a single frame.
    return { delay: 0, duration: 0 };
  }
  const delay = delayMs / 1000;
  if (kind === "pill") {
    return durationScale < 1
      ? { delay, type: "spring", stiffness: 260, damping: 25, mass: 0.7 }
      : { delay, type: "spring", stiffness: 150, damping: 19, mass: 0.85 };
  }
  if (kind === "metric") {
    return { delay, duration: 0.85 * durationScale, ease: entranceEase };
  }
  if (kind === "image") {
    return { delay, duration: 1.4 * durationScale, ease: entranceEase };
  }
  if (kind === "cta") {
    return { delay, duration: 1.05 * durationScale, ease: entranceEase };
  }
  return { delay, duration: 1.0 * durationScale, ease: entranceEase };
}

export function Reveal({
  children,
  className,
  delayMs = 0,
  kind = "section",
  trigger = "viewport",
  amount = 0.4,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  kind?: RevealKind;
  /**
   * Viewport threshold. The 0.4 default suits normal-height content; pass
   * "some" for blocks that can grow taller than the viewport (long tables,
   * legal prose), where a fractional threshold could never be reached and the
   * block would stay hidden forever.
   */
  amount?: number | "some" | "all";
  /**
   * "viewport" (default): fires via whileInView, for content the user
   * scrolls down to. "mount": fires via animate as soon as the component
   * mounts, for content that's guaranteed to already be on screen (the
   * secondary hero, which is sized to fill exactly one viewport) — for that
   * content, whileInView's own viewport margin (shrunk 18% from the bottom,
   * so scroll-triggered reveals don't fire the instant their top pixel
   * appears) can end up excluding an element sitting near the hero's bottom
   * edge, so it silently never fires without the user scrolling — exactly
   * backwards for content that's already fully visible on load.
   */
  trigger?: "viewport" | "mount";
}) {
  const reducedMotion = useReducedMotion() ?? false;

  if (reducedMotion) {
    return (
      <div
        className={className}
        data-motion-reveal="true"
        data-motion-reveal-kind={kind}
      >
        {children}
      </div>
    );
  }

  if (trigger === "mount") {
    /*
     * CSS-driven, deliberately not Motion-driven.
     *
     * A mount reveal wraps content that is already on screen when the page
     * loads — the secondary hero, a blog article's header — which makes it the
     * Largest Contentful Paint element on almost every route. Motion renders
     * `initial="hidden"` into the prerendered HTML as an inline `opacity:0`,
     * and Chrome refuses to treat a zero-opacity element as an LCP candidate,
     * so the entrance could not even begin (nor the metric be satisfied) until
     * the route JS had downloaded, React had hydrated and LazyMotion's
     * `dom-max` chunk had resolved: 7.1s on a throttled phone for a blog
     * article whose FCP was 1.5s.
     *
     * The keyframes in `~/styles/motion-reveal.css` reproduce
     * `revealVariants[kind]` and `transitionFor(kind, …)` exactly, so the
     * entrance looks the same — it simply starts at first paint instead of at
     * hydration. Scroll-triggered reveals below the fold stay with Motion,
     * which is where its viewport/scheduler machinery actually earns its keep.
     */
    return (
      <div
        className={cn("ss-mount-reveal", className)}
        data-motion-reveal="true"
        data-motion-reveal-kind={kind}
        style={{ "--ss-mount-reveal-delay": `${String(delayMs)}ms` } as CSSProperties}
      >
        {children}
      </div>
    );
  }

  if (kind === "image") {
    return (
      <ImageReveal className={className} delayMs={delayMs}>
        {children}
      </ImageReveal>
    );
  }

  return (
    <ViewportReveal amount={amount} className={className} delayMs={delayMs} kind={kind}>
      {children}
    </ViewportReveal>
  );
}

/**
 * Coordinates a set of child `Reveal`/`PanelReveal`s so the whole group ignites
 * the moment it scrolls into view, rather than each card waiting to reach its
 * own viewport threshold. Children keep their individual stagger delays and the
 * global top-to-bottom scheduler, so the group still lands as a choreographed
 * wave — the reader just sees the entire mosaic arrive from the first card
 * instead of discovering more cards only by scrolling further.
 *
 * Renders AS `as` (a grid/list container, default div) so it never inserts an
 * extra layout box: point it at the element that already wraps the cards.
 * Reduced motion resolves the group as started immediately, so nothing is held.
 */
export function RevealGroup({
  children,
  className,
  as: Tag = "div",
  amount = 0.15,
  role,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
  amount?: number;
  role?: string;
  "aria-label"?: string;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount, margin: "0px 0px -12% 0px", once: true });
  const started = reducedMotion || inView;

  const inner = (
    <RevealGroupContext.Provider value={started}>
      {children}
    </RevealGroupContext.Provider>
  );
  const shared = { className, role, "aria-label": ariaLabel };

  if (Tag === "ol") {
    return (
      <ol ref={ref as RefObject<HTMLOListElement>} {...shared}>
        {inner}
      </ol>
    );
  }
  if (Tag === "ul") {
    return (
      <ul ref={ref as RefObject<HTMLUListElement>} {...shared}>
        {inner}
      </ul>
    );
  }
  return (
    <div ref={ref as RefObject<HTMLDivElement>} {...shared}>
      {inner}
    </div>
  );
}

/**
 * Scroll-triggered branch of Reveal. The start moment goes through the global
 * reveal scheduler (see `~/motion/reveal-scheduler`) so that when several
 * reveals fire near-simultaneously — fast scroll, anchor jump, a section
 * entering whole — the entrances still play strictly top-to-bottom, then
 * left-to-right, regardless of each element's own stagger delay.
 */
function ViewportReveal({
  amount,
  children,
  className,
  delayMs,
  kind,
}: {
  amount: number | "some" | "all";
  children: ReactNode;
  className?: string | undefined;
  delayMs: number;
  kind: RevealKind;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ownInView = useInView(ref, {
    amount,
    margin: "0px 0px -18% 0px",
    once: true,
  });
  // Inside a RevealGroup, readiness is the group's — so every card in the group
  // begins the instant the group is in view, keeping its own stagger delay.
  const groupStarted = useContext(RevealGroupContext);
  const inView = groupStarted ?? ownInView;
  const start = useRevealStart(ref, inView, delayMs);

  return (
    <m.div
      ref={ref}
      className={className}
      data-motion-reveal="true"
      data-motion-reveal-kind={kind}
      initial="hidden"
      animate={start !== null ? "show" : "hidden"}
      variants={revealVariants[kind]}
      transition={transitionFor(
        kind,
        start?.delayMs ?? 0,
        start?.instant ?? false,
        start?.durationScale ?? 1,
      )}
    >
      {children}
    </m.div>
  );
}

/**
 * Premium entrance for the framed feature panels (proof consoles, CTA cards,
 * boundary panels, verified-results instruments). The frame itself
 * materialises — an unhurried rise-and-settle from the component, plus a
 * one-shot edge-light ignition and a single diagonal sheen carried by the
 * panel's own ::before/::after (see the `[data-motion-reveal-kind="panel"]`
 * styles) — while the copy inside plays its usual scheduled reveals, so card
 * and copy land as one choreographed entrance rather than copy arriving in a
 * frame that was always just sitting there.
 *
 * Renders AS the panel's root element (same className, same child order), so
 * `:nth-child` layouts inside framed panels are untouched. The light work is
 * timed against the same scheduler delay the entrance uses (`--panel-delay`),
 * and both respect the deep-link bypass and reduced motion.
 */
export function PanelReveal({
  children,
  className,
  delayMs = 0,
  amount = 0.25,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  /**
   * Viewport threshold. 0.25 suits a panel shorter than the viewport; pass
   * "some" for a panel that can be taller than it (the phone ledger, the
   * compliance rulebook at ~2,800px on a 390 phone), where a quarter of the
   * frame can never be in view at once and the entrance would never fire.
   */
  amount?: number | "some" | "all";
}) {
  const reducedMotion = useReducedMotion() ?? false;

  if (reducedMotion) {
    return (
      <div
        className={className}
        data-motion-reveal="true"
        data-motion-reveal-kind="panel"
      >
        {children}
      </div>
    );
  }

  return (
    <PanelRevealMotion amount={amount} className={className} delayMs={delayMs}>
      {children}
    </PanelRevealMotion>
  );
}

function PanelRevealMotion({
  amount,
  children,
  className,
  delayMs,
}: {
  amount: number | "some" | "all";
  children: ReactNode;
  className?: string | undefined;
  delayMs: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // A fractional threshold a tall panel could never reach would hold the
  // entrance forever; 0.25 fires once a meaningful band of the frame is in,
  // and callers whose frame can outgrow the viewport pass "some".
  const ownInView = useInView(ref, {
    amount,
    margin: "0px 0px -18% 0px",
    once: true,
  });
  const groupStarted = useContext(RevealGroupContext);
  const inView = groupStarted ?? ownInView;
  const start = useRevealStart(ref, inView, delayMs);
  const instant = start?.instant ?? false;
  const durationScale = start?.durationScale ?? 1;

  return (
    <m.div
      ref={ref}
      className={className}
      data-motion-reveal="true"
      data-motion-reveal-kind="panel"
      data-panel-shown={start !== null ? "true" : undefined}
      data-panel-instant={instant || undefined}
      style={
        {
          "--panel-delay": `${String(start?.delayMs ?? 0)}ms`,
          "--panel-scale": durationScale,
        } as MotionStyle
      }
      initial="hidden"
      animate={start !== null ? "show" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 34, scale: 0.965 },
        show: { opacity: 1, y: 0, scale: 1 },
      }}
      transition={
        instant
          ? { delay: 0, duration: 0 }
          : {
              delay: (start?.delayMs ?? 0) / 1000,
              duration: 1.15 * durationScale,
              ease: entranceEase,
            }
      }
    >
      {children}
    </m.div>
  );
}

/**
 * Waits for every real `<img>` inside a container to finish loading (or
 * fail) before reporting true. Already-cached images resolve synchronously
 * via `img.complete`, so a repeat view never waits. Non-image children (SVG
 * diagrams etc.) resolve immediately since there is nothing to wait for.
 */
function useImagesLoaded(containerRef: RefObject<HTMLElement | null>): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const images = containerRef.current?.querySelectorAll("img") ?? [];
    if (images.length === 0) {
      setLoaded(true);
      return;
    }
    let remaining = images.length;
    const settle = () => {
      remaining -= 1;
      if (remaining <= 0) {
        setLoaded(true);
      }
    };
    images.forEach((img) => {
      if (img.complete) {
        settle();
        return;
      }
      img.addEventListener("load", settle, { once: true });
      img.addEventListener("error", settle, { once: true });
    });
    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", settle);
        img.removeEventListener("error", settle);
      });
    };
  }, [containerRef]);

  return loaded;
}

/**
 * Image variant of Reveal: holds the cinematic clip/scale/opacity entrance
 * until the wrapped `<img>` has actually finished loading, so the reveal
 * never lands on an empty frame that then pops the image in unanimated a
 * beat later.
 */
function ImageReveal({
  children,
  className,
  delayMs,
}: {
  children: ReactNode;
  className?: string | undefined;
  delayMs: number;
}) {
  const { tier } = useCapabilityTier();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, {
    amount: 0.4,
    margin: "0px 0px -18% 0px",
    once: true,
  });
  const imagesLoaded = useImagesLoaded(containerRef);
  const start = useRevealStart(containerRef, inView && imagesLoaded, delayMs);

  return (
    <m.div
      ref={containerRef}
      className={className}
      data-motion-reveal="true"
      data-motion-reveal-kind="image"
      initial="hidden"
      animate={start !== null ? "show" : "hidden"}
      variants={tier === "full" ? revealVariants.image : liteImageVariants}
      transition={transitionFor(
        "image",
        start?.delayMs ?? 0,
        start?.instant ?? false,
        start?.durationScale ?? 1,
      )}
    >
      {children}
    </m.div>
  );
}
