/**
 * services-v2 secondary hero — the substantial body-opener beneath the Aether
 * intro, mirroring the homepage's secondary-hero language: kicker, large display
 * title, lead, capability points, dual CTAs and a showcase panel, followed by
 * the animated scroll cue. The reusable homepage TrustStrip renders beneath it
 * (composed in each page), so the reassurance band matches the homepage exactly.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";

import type { LucideIcon } from "~/components/icons/lucide";

import { Eyebrow, Reveal, RichText, ServiceButton } from "./primitives";

/** Animated scroll cue, identical to the homepage body cue. */
export function ScrollCue() {
  return (
    <div className="ss-srv2-hero__scrollcue">
      <div className="ss-hv2-body-scrollcue" aria-hidden="true">
        <span className="ss-eyebrow font-mono text-[10px]">Scroll</span>
        <span className="ss-hv2-scrollcue__rail" />
      </div>
    </div>
  );
}

function CapabilityPoint({ text, index }: { text: string; index: number }) {
  const reducedMotion = useReducedMotion() ?? false;
  const content = (
    <>
      <span className="ss-srv2-hero__cap-dot" aria-hidden="true" />
      <span>{text}</span>
    </>
  );
  if (reducedMotion) {
    return <li className="ss-srv2-hero__cap">{content}</li>;
  }
  return (
    <m.li
      className="ss-srv2-hero__cap"
      initial={{ opacity: 0, x: -18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        delay: (420 + index * 100) / 1000,
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {content}
    </m.li>
  );
}

/**
 * Measures the space consumed above the hero (fixed header + breadcrumb row +
 * route-frame padding — there is no single fixed constant for this, since it
 * comes from a shared frame the hero doesn't control) and exposes it as
 * `--srv2-hero-offset`, so the hero's height can resolve to exactly one
 * viewport regardless of what a future frame change does to that space.
 */
function useHeroViewportOffset(): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }

    let frame = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const offset = node.getBoundingClientRect().top + window.scrollY;
        node.style.setProperty("--srv2-hero-offset", `${String(offset)}px`);
      });
    };

    // The route intro -> body transition (and its own entrance reveals) can
    // still be settling on first mount, so a single measurement can catch a
    // transient position. Re-measure a couple of times shortly after as those
    // settle, rather than trusting only the first frame.
    measure();
    timeouts.push(setTimeout(measure, 200), setTimeout(measure, 700));
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      timeouts.forEach(clearTimeout);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return ref;
}

/**
 * Measures the intro (copy) column's rendered height and exposes it to the
 * showcase column as `--srv2-showcase-height`, so the showcase always matches
 * the copy's height exactly — never the taller of the two. Signature diagrams
 * are free to grow rich and tall to fill that box (see the SVG's own
 * width/height: 100% + preserveAspectRatio "contain" scaling in CSS), without
 * ever pushing the hero past one viewport by dictating a taller row than the
 * copy needs. A ResizeObserver (not a one-shot measurement) because the
 * intro's height settles gradually as its own Reveal animations play out.
 */
function useMatchIntroHeight(): {
  introRef: RefObject<HTMLDivElement | null>;
  showcaseRef: RefObject<HTMLDivElement | null>;
} {
  const introRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const introNode = introRef.current;
    const showcaseNode = showcaseRef.current;
    if (!introNode || !showcaseNode) {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      const height = entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height;
      showcaseNode.style.setProperty("--srv2-showcase-height", `${String(height)}px`);
    });
    observer.observe(introNode);
    return () => {
      observer.disconnect();
    };
  }, []);

  return { introRef, showcaseRef };
}

export function SecondaryHero({
  eyebrow,
  icon,
  title,
  titleId,
  lead,
  points,
  primaryCtaLabel,
  showcase,
}: {
  eyebrow: string;
  icon?: LucideIcon | undefined;
  title: string;
  titleId?: string | undefined;
  lead: string;
  points: string[];
  primaryCtaLabel: string;
  showcase: ReactNode;
}) {
  const heroRef = useHeroViewportOffset();
  const { introRef, showcaseRef } = useMatchIntroHeight();

  return (
    <section
      className="ss-srv2-section ss-srv2-hero"
      aria-labelledby={titleId}
      ref={heroRef}
    >
      <div className="ss-srv2__container">
        <div className="ss-srv2-hero__grid">
          <div className="ss-srv2-hero__intro" ref={introRef}>
            <Reveal kind="pill">
              <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
            </Reveal>
            <Reveal kind="section" delayMs={140}>
              <h1 className="ss-srv2-hero__title" id={titleId}>
                {title}
              </h1>
            </Reveal>
            <Reveal kind="section" delayMs={280}>
              <p className="ss-srv2-hero__lead">
                <RichText text={lead} />
              </p>
            </Reveal>
            <ul className="ss-srv2-hero__caps">
              {points.map((point, index) => (
                <CapabilityPoint key={point} text={point} index={index} />
              ))}
            </ul>
            <Reveal kind="cta" delayMs={750}>
              <div className="ss-srv2-hero__actions">
                <ServiceButton href="/book" variant="primary">
                  {primaryCtaLabel}
                </ServiceButton>
                <ServiceButton href="/how-we-work" variant="ghost" withArrow={false}>
                  See how it works
                </ServiceButton>
              </div>
            </Reveal>
          </div>

          <div className="ss-srv2-hero__showcase" ref={showcaseRef}>
            <Reveal kind="image" delayMs={220}>
              {showcase}
            </Reveal>
          </div>
        </div>
        <ScrollCue />
      </div>
    </section>
  );
}
