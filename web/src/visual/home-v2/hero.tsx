import { motion, type Variants } from "framer-motion";
import { Link } from "react-router";

import { Container } from "~/components/layout/container";
import { Button } from "~/components/ui/button";

import { ExploreSystemButton } from "./explore-system-button";
import { HeroFieldBackground } from "./hero-field-background";

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
  shaderEnabled: boolean;
};

/**
 * V2 hero — a single full-viewport stage. It carries only the kicker, display
 * title, lead and the primary calls to action over the animated field; the live
 * signal console and capability proof now open the body in {@link SecondaryHero}
 * so the hero reads cleanly within one screen.
 */
export function Hero({ motionEnabled, shaderEnabled }: HeroProps) {
  return (
    <section className="ss-hv2-hero">
      <HeroFieldBackground enabled={shaderEnabled} particlesEnabled={motionEnabled} />
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
            <Button asChild size="lg" variant="accent">
              <Link to="/book">Book a free audit</Link>
            </Button>
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
