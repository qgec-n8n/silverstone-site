import { motion, type Variants } from "framer-motion";
import type { Ref } from "react";

import { Container } from "~/components/layout/container";

import { ExploreSystemButton } from "./explore-system-button";
import { HeroAetherField } from "./hero-aether-field";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.21, delayChildren: 0.08 } },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(14px)",
    scale: 0.78,
    transformPerspective: 900,
    y: 46,
    z: -150,
  },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transformPerspective: 900,
    y: 0,
    z: 0,
    transition: { duration: 0.88, ease: [0.22, 1, 0.36, 1] },
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
      <HeroAetherField />
      <div className="ss-hv2-hero__grid" aria-hidden="true" />
      <div className="ss-hv2-hero__veil" aria-hidden="true" />

      <Container size="wide" className="relative z-10">
        <motion.div
          variants={container}
          initial={motionEnabled ? "hidden" : false}
          animate="show"
          className="ss-hv2-hero__content flex flex-col items-center gap-7 text-center"
        >
          <motion.span
            variants={item}
            className="ss-hv2-aether-reveal ss-hv2-kicker ss-eyebrow font-mono"
            data-aether-index="0"
            data-aether-reveal="true"
            data-aether-strength="0.58"
          >
            <span className="ss-hv2-kicker__dot" aria-hidden="true" />
            UK AI systems studio
          </motion.span>

          <motion.h1
            variants={item}
            className="ss-hv2-aether-reveal ss-hv2-display ss-hv2-hero__title"
            data-aether-index="1"
            data-aether-reveal="true"
            data-aether-strength="1"
          >
            The operating system for businesses that{" "}
            <span className="ss-chrome-text">refuse to miss</span>.
          </motion.h1>

          <motion.p
            variants={item}
            className="ss-lead ss-hv2-hero__lead text-[color:var(--ss-v2-titanium)]"
            data-aether-index="2"
            data-aether-reveal="true"
            data-aether-strength="0.78"
          >
            Silverstone designs AI voice, reception and automation systems that answer
            every call, capture every enquiry and run the repetitive work — so small UK
            teams respond faster, deliver more and grow without adding headcount.
          </motion.p>

          {hideExploreButton ? null : (
            <motion.div
              variants={item}
              className="flex flex-wrap items-center justify-center gap-4"
              data-aether-index="3"
              data-aether-reveal="true"
              data-aether-strength="0.72"
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
