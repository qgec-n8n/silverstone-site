import { motion, type Variants } from "framer-motion";
import { Link } from "react-router";

import { Container } from "~/components/layout/container";
import { Button } from "~/components/ui/button";
import type { BenchmarkMetric } from "~/data/home-v2";
import { HEADLINE_BENCHMARKS } from "~/data/home-v2";

import { Icon } from "./components/icon";
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

function staticBenchmark(metric: BenchmarkMetric): string {
  if (metric.display !== undefined) {
    return metric.display;
  }
  return `${metric.prefix ?? ""}${String(metric.value)}${metric.suffix ?? ""}`;
}

export function Hero({ motionEnabled, shaderEnabled }: HeroProps) {
  const consoleMetrics = HEADLINE_BENCHMARKS.slice(0, 3);

  return (
    <section className="ss-hv2-hero">
      <HeroFieldBackground enabled={shaderEnabled} />
      <div className="ss-hv2-hero__grid" aria-hidden="true" />
      <div className="ss-hv2-hero__veil" aria-hidden="true" />

      <Container size="wide" className="relative z-10">
        <motion.div
          variants={container}
          initial={motionEnabled ? "hidden" : false}
          animate="show"
          className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div className="flex flex-col gap-7">
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
              className="ss-lead max-w-(--ss-type-measure-lead) text-[color:var(--ss-v2-titanium)]"
            >
              Silverstone designs AI voice, reception and automation systems that answer
              every call, capture every enquiry and run the repetitive work — so small
              UK teams respond faster, deliver more and grow without adding headcount.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" variant="accent">
                <Link to="/book">Book a free audit</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/services">Explore the system</Link>
              </Button>
            </motion.div>

            <motion.ul
              variants={item}
              className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[color:var(--ss-v2-titanium)]"
            >
              <li className="inline-flex items-center gap-2">
                <Icon name="Unlock" className="size-4" />
                No lock-in pilots
              </li>
              <li className="inline-flex items-center gap-2">
                <Icon name="Zap" className="size-4" />
                Live in weeks
              </li>
              <li className="inline-flex items-center gap-2">
                <Icon name="UserCheck" className="size-4" />
                Human-in-the-loop
              </li>
            </motion.ul>
          </div>

          <motion.aside variants={item} className="ss-hv2-hero__panel p-6 sm:p-8">
            <div className="ss-hv2-hero__scan" aria-hidden="true" />
            <div className="relative flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="ss-eyebrow font-mono text-[color:var(--ss-v2-titanium)]">
                  Live signal
                </span>
                <span className="ss-hv2-kicker__dot" aria-hidden="true" />
              </div>
              <ul className="flex flex-col gap-5">
                {consoleMetrics.map((metric) => (
                  <li key={metric.id} className="flex flex-col gap-1">
                    <span className="ss-hv2-hero__stat-value ss-signal-text text-3xl sm:text-4xl">
                      {staticBenchmark(metric)}
                    </span>
                    <span className="text-sm text-[color:var(--ss-v2-titanium)]">
                      {metric.label}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="border-t border-[color:var(--ss-v2-hairline)] pt-4 text-xs text-[color:var(--ss-v2-titanium)]">
                Benchmark outcomes, not guarantees.
              </p>
            </div>
          </motion.aside>
        </motion.div>
      </Container>

      <div className="ss-hv2-scrollcue" aria-hidden="true">
        <span className="ss-eyebrow font-mono text-[10px]">Scroll</span>
        <span className="ss-hv2-scrollcue__rail" />
      </div>
    </section>
  );
}
