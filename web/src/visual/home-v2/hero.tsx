import type { Variants } from "motion/react";
import * as m from "motion/react-m";
import type { Ref } from "react";
import { Link } from "react-router";

import { Container } from "~/components/layout/container";
import { Button } from "~/components/ui/button";
import CybercoreBackground from "~/components/ui/cybercore-section-hero";

import { ExploreSystemButton } from "./explore-system-button";
import { HeroAetherField } from "./hero-aether-field";

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + index * 0.08, duration: 0.58, ease: "easeOut" },
  }),
};

const interactiveItem: Variants = {
  hidden: {
    opacity: 1,
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.32, duration: 0.5, ease: "easeOut" },
  },
};

type HeroProps = {
  exploreButtonDisabled?: boolean;
  exploreButtonLayoutEnabled?: boolean;
  exploreButtonRef?: Ref<HTMLButtonElement>;
  hideExploreButton?: boolean;
  motionEnabled: boolean;
  onExplore: () => void;
};

/**
 * V2 primary hero — a single full-viewport stage built on the supplied Aether
 * Flow field. While the homepage is locked it owns the screen with only the
 * kicker, display title, lead and the lone "Explore the system" action; that
 * action morphs into the body and releases the lock. The live-signal console and
 * capability proof open the body in {@link SecondaryHero}.
 */
export function Hero({
  exploreButtonDisabled = false,
  exploreButtonLayoutEnabled = true,
  exploreButtonRef,
  hideExploreButton = false,
  motionEnabled,
  onExplore,
}: HeroProps) {
  return (
    <section className="ss-hv2-hero">
      <HeroAetherField enabled={motionEnabled} />
      <CybercoreBackground beamCount={70} className="ss-hv2-hero__cybercore" />
      <div className="ss-hv2-hero__grid" aria-hidden="true" />
      <div className="ss-hv2-hero__veil" aria-hidden="true" />

      <Container size="wide" className="relative z-10">
        <m.div
          initial={motionEnabled ? "hidden" : false}
          animate="show"
          className="ss-hv2-hero__content flex flex-col items-center gap-7 text-center"
        >
          <m.span
            variants={item}
            custom={0}
            className="ss-hv2-aether-reveal ss-hv2-kicker ss-eyebrow font-mono"
          >
            <span className="ss-hv2-kicker__dot" aria-hidden="true" />
            Premium AI systems studio
          </m.span>

          <m.h1
            variants={item}
            custom={1}
            className="ss-hv2-aether-reveal ss-hv2-display ss-hv2-hero__title"
          >
            Premium AI systems for{" "}
            <span className="ss-chrome-text">serious businesses</span>.
          </m.h1>

          <m.p
            variants={item}
            custom={2}
            className="ss-lead ss-hv2-hero__lead text-[color:var(--ss-v2-titanium)]"
          >
            Silverstone designs and builds automation systems, AI agents, voice and
            receptionist solutions, websites, applications and content engines for
            companies that need faster response, cleaner operations and better customer
            journeys.
          </m.p>

          {hideExploreButton ? null : (
            <m.div
              variants={interactiveItem}
              className="ss-hv2-hero__actions flex flex-wrap items-center justify-center gap-4"
            >
              <Button asChild size="lg" variant="accent">
                <Link to="/book">Book a discovery call</Link>
              </Button>
              <ExploreSystemButton
                ref={exploreButtonRef}
                disabled={exploreButtonDisabled}
                layoutEnabled={exploreButtonLayoutEnabled}
                onActivate={onExplore}
              />
            </m.div>
          )}

          <m.ul
            variants={item}
            custom={4}
            className="ss-hv2-hero__scope"
            aria-label="Silverstone AI homepage capabilities"
          >
            <li>AI agents</li>
            <li>Voice and reception</li>
            <li>Automation</li>
            <li>Websites and apps</li>
            <li>Content systems</li>
          </m.ul>
        </m.div>
      </Container>
    </section>
  );
}
