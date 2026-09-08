import {
  useInView,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

import { cn } from "~/lib/utils";
import { useRevealStart } from "~/motion/use-reveal-start";
import { useCapabilityTier } from "~/visual/hooks/use-capability-tier";

export type HomeRevealKind =
  | "card"
  | "cta"
  | "footer"
  | "image"
  | "item"
  | "metric"
  | "section";

type RevealProps = {
  children: ReactNode;
  className?: string;
  dataAlign?: "center" | "start";
  dataWidth?: "full" | "wide";
  /** Stagger offset applied to the Motion transition. */
  delayMs?: number;
  kind?: HomeRevealKind;
  onReveal?: () => void;
};

const entranceEase = [0.22, 1, 0.36, 1] as const;
const metricEase = [0.16, 1, 0.3, 1] as const;

/**
 * `useInView`'s percentage margin resolves against the live viewport height,
 * which shifts as Safari/Chrome's toolbar collapses mid-scroll — the same
 * trigger re-fires at a different scroll position and reads as a glitch.
 * Below the desktop tier, use a fixed px margin instead so it's immune to
 * toolbar-driven viewport churn; desktop keeps the original percentage.
 */
function viewportRevealMargin(
  tier: ReturnType<typeof useCapabilityTier>["tier"],
): "0px 0px -18% 0px" | "0px 0px -120px 0px" {
  return tier === "full" ? "0px 0px -18% 0px" : "0px 0px -120px 0px";
}

const revealVariants: Record<HomeRevealKind, Variants> = {
  section: {
    hidden: { filter: "blur(10px)", opacity: 0, y: 34 },
    show: { filter: "blur(0px)", opacity: 1, y: 0 },
  },
  card: {
    hidden: { opacity: 0, rotateX: 8, scale: 0.965, y: 28 },
    show: { opacity: 1, rotateX: 0, scale: 1, y: 0 },
  },
  metric: {
    hidden: { opacity: 0, scale: 0.92, y: 18 },
    show: { opacity: 1, scale: 1, y: 0 },
  },
  image: {
    hidden: { clipPath: "inset(12% 10% round 24px)", opacity: 0, scale: 1.04 },
    show: { clipPath: "inset(0% 0% round 24px)", opacity: 1, scale: 1 },
  },
  item: {
    hidden: { opacity: 0, x: -18, y: 10 },
    show: { opacity: 1, x: 0, y: 0 },
  },
  cta: {
    hidden: { filter: "blur(14px)", opacity: 0, scale: 0.96, y: 24 },
    show: { filter: "blur(0px)", opacity: 1, scale: 1, y: 0 },
  },
  footer: {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0 },
  },
};

/**
 * Below the `full` capability tier (every mobile/tablet viewport, plus any
 * desktop the low-power/reduced-data heuristics flag — see
 * useCapabilityTier), `section`/`cta` drop their animated `filter: blur()`
 * and `image` drops its animated `clipPath`. Both are paint-triggering
 * properties: the browser has to re-rasterize the element on every frame of
 * the transition, unlike the opacity/transform properties every other kind
 * already used, which the compositor can animate without repainting at all.
 * `section` is the default kind and covers most headings/paragraphs on this
 * page, so this was the main cost behind sluggish scroll-triggered reveals
 * on mobile. Motion shape (the y/scale travel) is kept identical — only the
 * expensive property is dropped — so mobile keeps the same entrance, just
 * without the part its GPU can't afford.
 */
const liteRevealVariants: Record<HomeRevealKind, Variants> = {
  ...revealVariants,
  section: {
    hidden: { opacity: 0, y: 34 },
    show: { opacity: 1, y: 0 },
  },
  image: {
    hidden: { opacity: 0, scale: 1.04 },
    show: { opacity: 1, scale: 1 },
  },
  cta: {
    hidden: { opacity: 0, scale: 0.96, y: 24 },
    show: { opacity: 1, scale: 1, y: 0 },
  },
};

/**
 * Cinematic, unhurried timing: entrances are meant to be watched, not merely
 * noticed, so durations run 0.9–1.5s rather than the 150–300ms scale used for
 * hover/press feedback elsewhere. See the matching viewport threshold on
 * Reveal itself, which holds off firing until well into view for the same
 * reason.
 */
function transitionFor(
  kind: HomeRevealKind,
  delayMs: number,
  reducedMotion: boolean,
  instant = false,
  durationScale = 1,
): Transition {
  if (reducedMotion || instant) {
    return { delay: 0, duration: 0.01 };
  }

  const delay = delayMs / 1000;
  if (kind === "metric") {
    return { delay, duration: 0.95 * durationScale, ease: metricEase };
  }
  if (kind === "card" || kind === "image") {
    return { delay, duration: 1.15 * durationScale, ease: entranceEase };
  }
  if (kind === "cta") {
    return { delay, duration: 1.3 * durationScale, ease: entranceEase };
  }
  return { delay, duration: 1.05 * durationScale, ease: entranceEase };
}

/**
 * Motion-owned homepage reveal primitive. Entrances replay whenever the homepage
 * body remounts, while reduced-motion users receive immediate readable content.
 */
export function Reveal({
  children,
  className,
  dataAlign,
  dataWidth,
  delayMs = 0,
  kind = "section",
  onReveal,
}: RevealProps) {
  const reducedMotion = useReducedMotion() ?? false;

  if (!reducedMotion && kind === "image") {
    return (
      <ImageReveal
        className={className}
        dataAlign={dataAlign}
        dataWidth={dataWidth}
        delayMs={delayMs}
      >
        {children}
      </ImageReveal>
    );
  }

  return (
    <ViewportReveal
      className={className}
      dataAlign={dataAlign}
      dataWidth={dataWidth}
      delayMs={delayMs}
      kind={kind}
      onReveal={onReveal}
      reducedMotion={reducedMotion}
    >
      {children}
    </ViewportReveal>
  );
}

/**
 * Scroll-triggered branch of Reveal. Start moments go through the global
 * reveal scheduler (`~/motion/reveal-scheduler`) so near-simultaneous
 * triggers still play strictly top-to-bottom, then left-to-right.
 */
function ViewportReveal({
  children,
  className,
  dataAlign,
  dataWidth,
  delayMs,
  kind,
  onReveal,
  reducedMotion,
}: {
  children: ReactNode;
  className?: string | undefined;
  dataAlign?: "center" | "start" | undefined;
  dataWidth?: "full" | "wide" | undefined;
  delayMs: number;
  kind: HomeRevealKind;
  onReveal?: (() => void) | undefined;
  reducedMotion: boolean;
}) {
  const { tier } = useCapabilityTier();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    amount: 0.4,
    margin: viewportRevealMargin(tier),
    once: true,
  });
  const start = useRevealStart(ref, inView, delayMs);

  useEffect(() => {
    if (inView) {
      onReveal?.();
    }
  }, [inView, onReveal]);

  return (
    <m.div
      ref={ref}
      className={cn("ss-hv2-reveal", className)}
      data-align={dataAlign}
      data-motion-reveal="true"
      data-motion-reveal-kind={kind}
      data-revealed="true"
      data-width={dataWidth}
      initial={reducedMotion ? false : "hidden"}
      animate={reducedMotion || start !== null ? "show" : "hidden"}
      variants={tier === "full" ? revealVariants[kind] : liteRevealVariants[kind]}
      transition={transitionFor(
        kind,
        start?.delayMs ?? 0,
        reducedMotion,
        start?.instant ?? false,
        start?.durationScale ?? 1,
      )}
    >
      {children}
    </m.div>
  );
}

/**
 * Waits for every real `<img>` inside a container to finish loading (or
 * fail) before reporting true. Already-cached images resolve synchronously
 * via `img.complete`, so a repeat view never waits.
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
  dataAlign,
  dataWidth,
  delayMs,
}: {
  children: ReactNode;
  className?: string | undefined;
  dataAlign?: "center" | "start" | undefined;
  dataWidth?: "full" | "wide" | undefined;
  delayMs: number;
}) {
  const { tier } = useCapabilityTier();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, {
    amount: 0.4,
    margin: viewportRevealMargin(tier),
    once: true,
  });
  const imagesLoaded = useImagesLoaded(containerRef);
  const start = useRevealStart(containerRef, inView, delayMs, imagesLoaded);

  return (
    <m.div
      ref={containerRef}
      className={cn("ss-hv2-reveal", className)}
      data-align={dataAlign}
      data-motion-reveal="true"
      data-motion-reveal-kind="image"
      data-revealed="true"
      data-width={dataWidth}
      initial="hidden"
      animate={start !== null ? "show" : "hidden"}
      variants={tier === "full" ? revealVariants.image : liteRevealVariants.image}
      transition={transitionFor(
        "image",
        start?.delayMs ?? 0,
        false,
        start?.instant ?? false,
        start?.durationScale ?? 1,
      )}
    >
      {children}
    </m.div>
  );
}
