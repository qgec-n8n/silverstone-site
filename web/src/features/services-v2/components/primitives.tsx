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
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

import { ArrowRight, type LucideIcon } from "~/components/icons/lucide";

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

  const numericTarget = match ? Number(numericText.replace(/,/g, "")) : 0;
  const motionValue = useMotionValue(0);
  const rendered = useTransform(motionValue, (latest) =>
    match ? `${currency}${sign}${formatNumeric(numericText, latest)}${suffix}` : value,
  );

  useEffect(() => {
    if (!match || reducedMotion || !inView) {
      return;
    }
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
 * Cinematic, unhurried timing: entrances are meant to be watched, not merely
 * noticed, so durations run 0.85–1.5s rather than the 150–300ms scale used
 * for hover/press feedback elsewhere. See the matching viewport threshold on
 * Reveal itself, which holds off firing until well into view for the same
 * reason.
 */
function transitionFor(kind: RevealKind, delayMs: number): Transition {
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
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  kind?: RevealKind;
}) {
  const reducedMotion = useReducedMotion() ?? false;

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ amount: 0.4, margin: "0px 0px -18% 0px", once: true }}
      variants={revealVariants[kind]}
      transition={transitionFor(kind, delayMs)}
    >
      {children}
    </m.div>
  );
}

/**
 * Render approved inline copy with the small markdown subset used in the source
 * (`**bold**`, `*italic*`, `` `code` ``). No block-level markdown, no raw HTML.
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
          {heading}
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

type ServiceButtonProps = ComponentPropsWithoutRef<"a"> & {
  variant?: "primary" | "ghost";
  withArrow?: boolean;
};

export function ServiceButton({
  variant = "primary",
  withArrow = true,
  children,
  className,
  ...rest
}: ServiceButtonProps) {
  return (
    <a
      className={`ss-srv2-btn ss-srv2-btn--${variant}${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {children}
      {withArrow ? <ArrowRight aria-hidden="true" /> : null}
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
