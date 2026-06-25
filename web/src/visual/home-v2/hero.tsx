import { motion, type Variants } from "framer-motion";

import { Container } from "~/components/layout/container";

import { ExploreSystemButton } from "./explore-system-button";
import { HeroAetherField } from "./hero-aether-field";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

type HeroProps = {
  motionEnabled: boolean;
};

/**
 * V2 primary hero — a single full-viewport stage built on the supplied Aether
 * Flow field. While the homepage is locked it owns the screen with only the
 * kicker, display title, lead and the lone "Explore the system" action; that
 * action morphs into the body and releases the lock. The live-signal console and
 * capability proof open the body in {@link SecondaryHero}.
 */
export function Hero({ motionEnabled }: HeroProps) {
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
          className="ss-hv2-hero__content flex flex-col gap-7"
        >
          <motion.span
            variants={item}
            className="ss-hv2-kicker ss-eyebrow self-start font-mono"
          >
            <span className="ss-hv2-kicker__dot" aria-hidden="true" />
            UK AI systems studio
          </motion.span>

          <motion.h1 variants={item} className="ss-hv2-display ss-hv2-hero__title">
            The operating system for businesses that{" "}
            <span className="ss-chrome-text">refuse to miss</span>.
          </motion.h1>

          <motion.p
            variants={item}
            className="ss-lead ss-hv2-hero__lead text-[color:var(--ss-v2-titanium)]"
          >
            Silverstone designs AI voice, reception and automation systems that answer
            every call, capture every enquiry and run the repetitive work — so small
            UK teams respond faster, deliver more and grow without adding headcount.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-4">
            <ExploreSystemButton />
          </motion.div>
        </motion.div>
      </Container>

      <div className="ss-hv2-scrollcue" aria-hidden="true">
        <span className="ss-eyebrow font-mono text-[10px]">Scroll</span>
        <span className="ss-hv2-scrollcue__rail" />
      </div>
    </section>
  );
}
