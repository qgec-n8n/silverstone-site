/**
 * Shared services-v2 primitives: animated metrics, buttons, links, eyebrow,
 * section heading and measured prose. The reveal family and `RichText` live in
 * `./reveal` and `./rich-text`, and are re-exported here so every existing
 * import of this module keeps working unchanged.
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
} from "motion/react";

import * as m from "motion/react-m";
import {
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { Link } from "react-router";

import {
  ArrowRight,
  TriangleAlertIcon,
  type LucideIcon,
} from "~/components/icons/lucide";
import { isRevealBypassActive } from "~/motion/reveal-bypass";
import { useRevealStart } from "~/motion/use-reveal-start";

import { entranceEase, Reveal } from "./reveal";
import { RichText } from "./rich-text";

export { PanelReveal, RevealGroup, type RevealKind } from "./reveal";
export { Reveal, RichText };

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

/* The gradient twin is client-only: the prerendered document carries each
   verified figure exactly once, so a crawler that stores the HTML as the
   page's facts never reads "850%850%". Server snapshot false, client true —
   the twin mounts on the first post-hydration render, before anything has
   scrolled it into view. */
const subscribeNever = () => () => undefined;
const useHydrated = () =>
  useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

/**
 * Animated count-up for a benchmark value. Only animates when the value has a
 * single clean leading numeric token (currency/sign/commas/decimals); anything
 * else (ranges, "<10 seconds", "3x → 20x") renders statically, unchanged, so
 * verified figures are never altered or mismatched.
 *
 * `sheen` renders the figure twice: a solid one that carries the text, and an
 * aria-hidden twin laid exactly over it that carries the accent gradient
 * (`.ss-srv2-metric__sheen`). `background-clip: text` is the only way to paint
 * a gradient through live text, and WebKit can stop painting it after the
 * layer tree above changes — a fixed lightbox scrim coming and going — which
 * left the proof console's numbers blank while their labels stayed. With the
 * gradient on a twin, that failure shows the solid figure beneath instead of
 * nothing; when it paints, the twin covers the same glyphs and nothing moves.
 */
export function AnimatedMetricValue({
  sheen = false,
  value,
}: {
  /** Overlay the accent-gradient twin (see above). */
  sheen?: boolean;
  value: string;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const twin = useHydrated() && sheen;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  // Memoised on purpose: `exec` returns a fresh array every call, and as an
  // effect dependency that re-ran the count-up — back to 0 — on every
  // re-render of the console, not just the once when it scrolled into view.
  const match = useMemo(() => NUMERIC_METRIC.exec(value), [value]);
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
    // Deep-link landings show the verified figure immediately: a count-up is
    // still an entrance animation, and linked-to sections must arrive settled.
    if (isRevealBypassActive() || ref.current?.closest("[data-reveal-bypass]")) {
      return;
    }
    motionValue.set(0);
    const controls = animate(motionValue, numericTarget, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, match, motionValue, numericTarget, reducedMotion]);

  if (!match || reducedMotion) {
    return sheen ? (
      <span className="ss-srv2-metric__figure">
        <span>{value}</span>
        {twin ? (
          <span aria-hidden="true" className="ss-srv2-metric__sheen">
            {value}
          </span>
        ) : null}
      </span>
    ) : (
      <span>{value}</span>
    );
  }

  const figure = <m.span ref={ref}>{rendered}</m.span>;
  if (!sheen) {
    return figure;
  }
  return (
    <span className="ss-srv2-metric__figure">
      {figure}
      {twin ? (
        <m.span aria-hidden="true" className="ss-srv2-metric__sheen">
          {rendered}
        </m.span>
      ) : null}
    </span>
  );
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
  reveal = true,
}: {
  eyebrow: string;
  icon?: LucideIcon | undefined;
  heading: string;
  headingId?: string | undefined;
  lead?: string | undefined;
  /** Demo landing sections opt out so anchor arrivals are immediately readable. */
  reveal?: boolean | undefined;
}) {
  const eyebrowNode = <Eyebrow icon={icon}>{eyebrow}</Eyebrow>;
  const headingNode = (
    <h2 className="ss-srv2-heading" id={headingId}>
      <RichText text={heading} />
    </h2>
  );
  const leadNode = lead ? (
    <p className="ss-srv2-lead">
      <RichText text={lead} />
    </p>
  ) : null;

  return (
    <div className="ss-srv2-section__head">
      {reveal ? <Reveal kind="pill">{eyebrowNode}</Reveal> : eyebrowNode}
      {reveal ? (
        <Reveal kind="section" delayMs={120}>
          {headingNode}
        </Reveal>
      ) : (
        headingNode
      )}
      {leadNode ? (
        reveal ? (
          <Reveal kind="section" delayMs={240}>
            {leadNode}
          </Reveal>
        ) : (
          leadNode
        )
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
      data-motion-reveal="true"
      data-motion-reveal-kind="section"
      initial={{ opacity: 0, y: 22 }}
      animate={start !== null ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{
        delay: (start?.delayMs ?? 0) / 1000,
        duration: start?.instant ? 0 : 0.75 * (start?.durationScale ?? 1),
        ease: entranceEase,
      }}
    >
      <TriangleAlertIcon aria-hidden="true" />
      <span>{point}</span>
    </m.li>
  );
}

/**
 * Traveling border light for `.ss-srv2-beam-border` frames.
 *
 * The effect used to live entirely in CSS as a registered `@property` angle
 * animated inside the frame pseudo-element's conic-gradient. Interpolating a
 * custom property runs style recalc on the main thread and repaints the whole
 * card every frame, so on phones the beam visibly stepped and a page of cards
 * kept the CPU pinned (and the device hot). This span keeps a static XOR ring
 * mask while its own ::before — an oversized conic-gradient square — spins
 * with a plain transform, so the whole effect stays on the compositor. A
 * shared IntersectionObserver parks the rotation while the card is
 * off-screen, so a long article only ever animates the beams in view.
 *
 * Must be rendered as the LAST child of its `.ss-srv2-beam-border` frame:
 * some frames (e.g. the pricing metric instrument) place direct children with
 * `:nth-child`, which a leading span would shift.
 */
let beamObserver: IntersectionObserver | null = null;

function observeBeam(element: Element): () => void {
  if (typeof IntersectionObserver === "undefined") {
    element.setAttribute("data-active", "true");
    return () => {
      // No observer was created, so there is nothing to disconnect.
    };
  }
  beamObserver ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      entry.target.setAttribute("data-active", entry.isIntersecting ? "true" : "false");
    }
  });
  beamObserver.observe(element);
  return () => beamObserver?.unobserve(element);
}

export function BorderBeam() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    return observeBeam(element);
  }, []);

  return <span ref={ref} className="ss-srv2-beam" aria-hidden="true" />;
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
 * Editorial marker-stroke emphasis: a soft color wash reveals behind the
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
  href,
  ...rest
}: ComponentPropsWithoutRef<"a"> & { icon?: LucideIcon | undefined }) {
  const content = (
    <>
      {children}
      {Icon ? <Icon aria-hidden="true" /> : null}
    </>
  );

  // Same contract as `ServiceButton` above: a site-absolute path navigates
  // client-side, so the destination lands on its body instead of replaying the
  // loader and intro gate. External, mailto:, tel: and bare #hash stay anchors.
  if (href?.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link className="ss-srv2-textlink" prefetch="intent" to={href} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <a className="ss-srv2-textlink" href={href} {...rest}>
      {content}
    </a>
  );
}
