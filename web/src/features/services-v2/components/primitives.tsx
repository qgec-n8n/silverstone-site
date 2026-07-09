/**
 * Shared services-v2 primitives: motion reveal, inline rich text, buttons,
 * links, eyebrow, section heading and measured prose.
 *
 * Motion is owned by the `motion` package (`motion/react-m`). Reveals replay
 * whenever the service body remounts (route intro ↔ body), and reduced-motion
 * visitors receive immediate, fully readable content.
 */
import {
  useReducedMotion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  type Transition,
  type Variants,
} from "motion/react";
import * as m from "motion/react-m";
import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type RefObject,
} from "react";
import { Link } from "react-router";

import {
  ArrowRight,
  TriangleAlertIcon,
  type LucideIcon,
} from "~/components/icons/lucide";
import { useRevealStart } from "~/motion/use-reveal-start";
import { useCapabilityTier } from "~/visual/hooks/use-capability-tier";

const entranceEase = [0.22, 1, 0.36, 1] as const;

/** Parses a benchmark value like "£16,800.00", "+66%", "1,324%" into count-up parts. */
const NUMERIC_METRIC = /^([£$]?)([+-]?)([\d,]+(?:\.\d+)?)(.*)$/;

function formatNumeric(raw: string, current: number): string {
  const hasDecimal = raw.includes(".");
  const decimals = hasDecimal ? (raw.split(".")[1]?.length ?? 0) : 0;
  return current.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Splits a benchmark string like "850% — Conversion increase" into its value and label. */
export function splitMetric(metric: string): { value: string; label: string } {
  const [head, ...tail] = metric.split(/\s+—\s+/);
  if (tail.length > 0) {
    return { value: (head ?? metric).trim(), label: tail.join(" — ").trim() };
  }
  return { value: metric.trim(), label: "" };
}

/**
 * Animated count-up for a benchmark value. Only animates when the value has a
 * single clean leading numeric token (currency/sign/commas/decimals); anything
 * else (ranges, "<10 seconds", "3x → 20x") renders statically, unchanged, so
 * verified figures are never altered or misrepresented.
 */
export function AnimatedMetricValue({ value }: { value: string }) {
  const reducedMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const match = NUMERIC_METRIC.exec(value);
  const currency = match?.[1] ?? "";
  const sign = match?.[2] ?? "";
  const numericText = match?.[3] ?? "";
  const suffix = match?.[4] ?? "";

  // Starts at the true target so prerendered HTML always contains the exact
  // verified figure (never "0"); the client resets to 0 and counts up only
  // once the metric scrolls into view.
  const numericTarget = match ? Number(numericText.replace(/,/g, "")) : 0;
  const motionValue = useMotionValue(numericTarget);
  const rendered = useTransform(motionValue, (latest) =>
    match ? `${currency}${sign}${formatNumeric(numericText, latest)}${suffix}` : value,
  );

  useEffect(() => {
    if (!match || reducedMotion || !inView) {
      return;
    }
    motionValue.set(0);
    const controls = animate(motionValue, numericTarget, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, match, motionValue, numericTarget, reducedMotion]);

  if (!match) {
    return <span>{value}</span>;
  }
  if (reducedMotion) {
    return <span>{value}</span>;
  }

  return <m.span ref={ref}>{rendered}</m.span>;
}

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
function transitionFor(kind: RevealKind, delayMs: number, instant = false): Transition {
  if (instant) {
    // Deep-link landing bypass: the shown state applies in a single frame.
    return { delay: 0, duration: 0 };
  }
  const delay = delayMs / 1000;
  if (kind === "pill") {
    return { delay, type: "spring", stiffness: 150, damping: 19, mass: 0.85 };
  }
  if (kind === "metric") {
    return { delay, duration: 0.85, ease: entranceEase };
  }
  if (kind === "image") {
    return { delay, duration: 1.4, ease: entranceEase };
  }
  if (kind === "cta") {
    return { delay, duration: 1.05, ease: entranceEase };
  }
  return { delay, duration: 1.0, ease: entranceEase };
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
    return <div className={className}>{children}</div>;
  }

  if (trigger === "mount") {
    return (
      <m.div
        className={className}
        initial="hidden"
        animate="show"
        variants={revealVariants[kind]}
        transition={transitionFor(kind, delayMs)}
      >
        {children}
      </m.div>
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
  const inView = useInView(ref, {
    amount,
    margin: "0px 0px -18% 0px",
    once: true,
  });
  const start = useRevealStart(ref, inView, delayMs);

  return (
    <m.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={start !== null ? "show" : "hidden"}
      variants={revealVariants[kind]}
      transition={transitionFor(kind, start?.delayMs ?? 0, start?.instant ?? false)}
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
      initial="hidden"
      animate={start !== null ? "show" : "hidden"}
      variants={tier === "full" ? revealVariants.image : liteImageVariants}
      transition={transitionFor("image", start?.delayMs ?? 0, start?.instant ?? false)}
    >
      {children}
    </m.div>
  );
}

/**
 * Render approved inline copy with the small markdown subset used in the source
 * (`**bold**`, `*italic*`, `` `code` ``). No block-level markdown, no raw HTML.
 * `*italic*` doubles as the site's established gradient-emphasis marker: CSS
 * scoped to hero titles, section headings and CTA titles (see
 * `.ss-srv2-hero__title em` and siblings) renders it as a colour sweep, while
 * the same token in body prose renders as a plain accent tint — one markdown
 * token, context-appropriate colour, no separate syntax to remember.
 */
export function RichText({ text }: { text: string }): ReactNode {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|(?<!\*)\*[^*]+\*(?!\*)|`[^`]+`)/g;
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      nodes.push(<code key={key++}>{token.slice(1, -1)}</code>);
    } else {
      nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

/** Measured prose block: renders each paragraph with inline rich text. */
export function Prose({
  paragraphs,
  className,
}: {
  paragraphs: string[];
  className?: string;
}) {
  return (
    <div className={`ss-srv2-prose${className ? ` ${className}` : ""}`}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>
          <RichText text={paragraph} />
        </p>
      ))}
    </div>
  );
}

export function Eyebrow({
  icon: Icon,
  children,
}: {
  icon?: LucideIcon | undefined;
  children: ReactNode;
}) {
  return (
    <span className="ss-srv2-eyebrow">
      {Icon ? <Icon aria-hidden="true" /> : <span className="ss-srv2-eyebrow__dot" />}
      {children}
    </span>
  );
}

export function SectionHead({
  eyebrow,
  icon,
  heading,
  headingId,
  lead,
}: {
  eyebrow: string;
  icon?: LucideIcon | undefined;
  heading: string;
  headingId?: string | undefined;
  lead?: string | undefined;
}) {
  return (
    <div className="ss-srv2-section__head">
      <Reveal kind="pill">
        <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal kind="section" delayMs={120}>
        <h2 className="ss-srv2-heading" id={headingId}>
          <RichText text={heading} />
        </h2>
      </Reveal>
      {lead ? (
        <Reveal kind="section" delayMs={240}>
          <p className="ss-srv2-lead">
            <RichText text={lead} />
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/**
 * The "problem" section's warning bullets, revealing one at a time top to
 * bottom rather than as a single fade-in block — each line is its own claim
 * about a cost the reader is paying right now, so it should land as its own
 * beat. A y-offset (not x-offset) reveal, deliberately: it reads as "line
 * dropping into place" rather than "sliding in from off-screen".
 */
export function WarningChecklist({ points }: { points: string[] }) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <ul className="ss-srv2-checklist" data-tone="warn">
      {points.map((point, index) =>
        reducedMotion ? (
          <li key={point}>
            <TriangleAlertIcon aria-hidden="true" />
            <span>{point}</span>
          </li>
        ) : (
          <WarningChecklistItem key={point} point={point} index={index} />
        ),
      )}
    </ul>
  );
}

function WarningChecklistItem({ point, index }: { point: string; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, {
    amount: 0.6,
    margin: "0px 0px -10% 0px",
    once: true,
  });
  const start = useRevealStart(ref, inView, index * 220);

  return (
    <m.li
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={start !== null ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{
        delay: (start?.delayMs ?? 0) / 1000,
        duration: start?.instant ? 0 : 0.75,
        ease: entranceEase,
      }}
    >
      <TriangleAlertIcon aria-hidden="true" />
      <span>{point}</span>
    </m.li>
  );
}

type ServiceButtonProps = ComponentPropsWithoutRef<"a"> & {
  variant?: "primary" | "ghost";
  withArrow?: boolean;
};

export function ServiceButton({
  variant = "primary",
  withArrow = true,
  children,
  className,
  href,
  ...rest
}: ServiceButtonProps) {
  const buttonClassName = `ss-srv2-btn ss-srv2-btn--${variant}${className ? ` ${className}` : ""}`;
  const content = (
    <>
      {children}
      {withArrow ? <ArrowRight aria-hidden="true" /> : null}
    </>
  );

  // Internal routes navigate client-side so conversion deep links (e.g.
  // /book#booking-calendar, /contact#contact-form) resolve through the shared
  // deep-link scroll instead of a full document reload.
  if (href?.startsWith("/")) {
    return (
      <Link className={buttonClassName} to={href} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <a className={buttonClassName} href={href} {...rest}>
      {content}
    </a>
  );
}

/**
 * Editorial marker-stroke emphasis: a soft colour wash reveals behind the
 * phrase on scroll-in, like a highlighter mark — not a typewriter or
 * character-scramble effect. Used sparingly, on Content Creation only.
 */
export function Highlight({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion() ?? false;

  if (reducedMotion) {
    return (
      <span className="ss-srv2-highlight" data-revealed="true">
        {children}
      </span>
    );
  }

  return (
    <m.span
      className="ss-srv2-highlight"
      initial={{ backgroundSize: "0% 100%" }}
      whileInView={{ backgroundSize: "100% 100%" }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.span>
  );
}

export function TextLink({
  children,
  icon: Icon,
  ...rest
}: ComponentPropsWithoutRef<"a"> & { icon?: LucideIcon | undefined }) {
  return (
    <a className="ss-srv2-textlink" {...rest}>
      {children}
      {Icon ? <Icon aria-hidden="true" /> : null}
    </a>
  );
}
