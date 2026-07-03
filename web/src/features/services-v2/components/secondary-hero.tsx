/**
 * services-v2 secondary hero — the substantial body-opener beneath the Aether
 * intro, mirroring the homepage's secondary-hero language: kicker, large display
 * title, lead, capability points, dual CTAs and a showcase panel, followed by
 * the animated scroll cue. The reusable homepage TrustStrip renders beneath it
 * (composed in each page), so the reassurance band matches the homepage exactly.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";

import type { LucideIcon } from "~/components/icons/lucide";

import { Eyebrow, Reveal, RichText, ServiceButton } from "./primitives";

/**
 * The route intro overlay (see `route-experience-frame.tsx`) fades out over
 * 500ms starting the instant the body becomes visible — the same instant this
 * hero's `whileInView` reveals fire, since the body goes from `display: none`
 * to laid-out in that same moment. Without an offsetting base delay, every
 * reveal below would start (and mostly finish) while still hidden behind that
 * fading overlay, so the user never sees the motion, only the settled result.
 * 560ms clears the overlay with a small safety margin before the first reveal
 * (the eyebrow) begins, so the full sequence plays in the open.
 */
const HERO_REVEAL_BASE_DELAY = 560;

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
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: (HERO_REVEAL_BASE_DELAY + 420 + index * 100) / 1000,
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {content}
    </m.li>
  );
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
  return (
    <section className="ss-srv2-section ss-srv2-hero" aria-labelledby={titleId}>
      <div className="ss-srv2__container">
        <div className="ss-srv2-hero__grid">
          <div className="ss-srv2-hero__intro">
            <Reveal kind="pill" delayMs={HERO_REVEAL_BASE_DELAY} trigger="mount">
              <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
            </Reveal>
            <Reveal
              kind="section"
              delayMs={HERO_REVEAL_BASE_DELAY + 140}
              trigger="mount"
            >
              <h1 className="ss-srv2-hero__title" id={titleId}>
                <RichText text={title} />
              </h1>
            </Reveal>
            <Reveal
              kind="section"
              delayMs={HERO_REVEAL_BASE_DELAY + 280}
              trigger="mount"
            >
              <p className="ss-srv2-hero__lead">
                <RichText text={lead} />
              </p>
            </Reveal>
            <ul className="ss-srv2-hero__caps">
              {points.map((point, index) => (
                <CapabilityPoint key={point} text={point} index={index} />
              ))}
            </ul>
            <Reveal kind="cta" delayMs={HERO_REVEAL_BASE_DELAY + 750} trigger="mount">
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

          <div className="ss-srv2-hero__showcase">
            <Reveal kind="image" delayMs={HERO_REVEAL_BASE_DELAY + 220} trigger="mount">
              {showcase}
            </Reveal>
          </div>
        </div>
        <ScrollCue />
      </div>
    </section>
  );
}
