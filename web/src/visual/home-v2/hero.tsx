import { motion, type Variants } from "framer-motion";
import type { Ref } from "react";

import { Container } from "~/components/layout/container";
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
    transition: { delay: 0.62 + index * 0.24, duration: 1.05, ease: "easeInOut" },
  }),
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
      <HeroAetherField />
      <CybercoreBackground beamCount={70} className="ss-hv2-hero__cybercore" />
      <div className="ss-hv2-hero__grid" aria-hidden="true" />
      <div className="ss-hv2-hero__veil" aria-hidden="true" />

      <Container size="wide" className="relative z-10">
        <motion.div
          initial={motionEnabled ? "hidden" : false}
          animate="show"
          className="ss-hv2-hero__content flex flex-col items-center gap-7 text-center"
        >
          <motion.span
            variants={item}
            custom={0}
            className="ss-hv2-aether-reveal ss-hv2-kicker ss-eyebrow font-mono"
          >
            <span className="ss-hv2-kicker__dot" aria-hidden="true" />
            UK AI systems studio
          </motion.span>

          <motion.h1
            variants={item}
            custom={1}
            className="ss-hv2-aether-reveal ss-hv2-display ss-hv2-hero__title"
          >
            The operating system for businesses that{" "}
            <span className="ss-chrome-text">refuse to miss</span>.
          </motion.h1>

          <motion.p
            variants={item}
            custom={2}
            className="ss-lead ss-hv2-hero__lead text-[color:var(--ss-v2-titanium)]"
          >
            Silverstone designs AI voice, reception and automation systems that answer
            every call, capture every enquiry and run the repetitive work — so small UK
            teams respond faster, deliver more and grow without adding headcount.
          </motion.p>

          {hideExploreButton ? null : (
            <motion.div
              variants={item}
              custom={3}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <ExploreSystemButton
                ref={exploreButtonRef}
                disabled={exploreButtonDisabled}
                layoutEnabled={exploreButtonLayoutEnabled}
                onActivate={onExplore}
              />
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
