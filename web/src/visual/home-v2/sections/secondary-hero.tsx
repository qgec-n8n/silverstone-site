import type { CSSProperties } from "react";
import * as m from "motion/react-m";
import { Link } from "react-router";

import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { Button } from "~/components/ui/button";
import type { BenchmarkMetric } from "~/data/home-v2";
import { cn } from "~/lib/utils";
import {
  BENCHMARK_DISCLAIMER,
  HEADLINE_BENCHMARKS,
  SECONDARY_BENCHMARKS,
} from "~/data/home-v2";

import { Icon } from "../components/icon";
import { Reveal } from "../components/reveal";

type Capability = {
  icon: string;
  label: string;
  detail: string;
};

const CAPABILITIES: Capability[] = [
  {
    icon: "Unlock",
    label: "No lock-in pilots",
    detail: "Prove the value on real work first, then commit when it earns it.",
  },
  {
    icon: "Zap",
    label: "Live in weeks",
    detail: "From audit to a working system in weeks, not quarters.",
  },
  {
    icon: "UserCheck",
    label: "Human-in-the-loop",
    detail: "Your team keeps oversight of every decision the system makes.",
  },
];

function staticBenchmark(metric: BenchmarkMetric): string {
  if (metric.display !== undefined) {
    return metric.display;
  }
  return `${metric.prefix ?? ""}${String(metric.value)}${metric.suffix ?? ""}`;
}

function SystemScrollCue({ className }: { className?: string }) {
  return (
    <div className={cn("ss-hv2-body-scrollcue", className)} aria-hidden="true">
      <span className="ss-eyebrow font-mono text-[10px]">Scroll</span>
      <span className="ss-hv2-scrollcue__rail" />
    </div>
  );
}

/**
 * Compact "Live Signal Benchmarks" board rendered only on mobile
 * (`.ss-hv2-secondary__mobile-signal` is `display:none` at >=64rem, so desktop
 * is untouched). Desktop shows the full console in the showcase column, but on
 * mobile that console stacks below the fold — this brings the flagship signal
 * above the fold, directly under the CTAs and above the scroll cue.
 */
function MobileSignalBoard({ metrics }: { metrics: readonly BenchmarkMetric[] }) {
  return (
    <Reveal delayMs={600} kind="card" className="ss-hv2-secondary__mobile-signal">
      <aside className="ss-hv2-mobile-signal" aria-label="Live signal benchmarks">
        <div className="ss-hv2-mobile-signal__header">
          <span className="ss-eyebrow font-mono ss-hv2-mobile-signal__title">
            Live Signal Benchmarks
          </span>
          <span className="ss-hv2-mobile-signal__status">
            <span className="ss-hv2-kicker__dot" aria-hidden="true" />
            Live
          </span>
        </div>
        <ul className="ss-hv2-mobile-signal__grid">
          {metrics.map((metric) => (
            <li key={metric.id} className="ss-hv2-mobile-signal__cell">
              <span className="ss-hv2-mobile-signal__value ss-signal-text">
                {staticBenchmark(metric)}
              </span>
              <span className="ss-hv2-mobile-signal__label">{metric.label}</span>
            </li>
          ))}
        </ul>
        <p className="ss-hv2-mobile-signal__note">
          <span aria-hidden="true">Benchmark outcomes, not guarantees.</span>
          <span className="sr-only">{BENCHMARK_DISCLAIMER}</span>
        </p>
      </aside>
    </Reveal>
  );
}

/** A single capability that reveals on its own, top-to-bottom down the list. */
function CapabilityItem({ cap, index }: { cap: Capability; index: number }) {
  return (
    <m.li
      initial={{ opacity: 0, x: -18, y: 10 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ amount: 0.45, margin: "0px 0px -12% 0px", once: true }}
      transition={{
        delay: (220 + index * 70) / 1000,
        duration: 0.62,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="ss-hv2-secondary__cap"
    >
      <span className="ss-hv2-secondary__cap-icon" aria-hidden="true">
        <Icon name={cap.icon} className="size-4" />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="font-semibold ss-hv2-copy-strong">{cap.label}</span>
        <span className="text-sm ss-hv2-copy">{cap.detail}</span>
      </span>
    </m.li>
  );
}

/**
 * Body opener directly beneath the hero. It carries the positioning,
 * capability proof and a major live-signal module in the former image slot. It
 * is the scroll/transition target for the hero's "Explore the system" action.
 */
export function SecondaryHero() {
  const consoleMetrics = HEADLINE_BENCHMARKS;
  const signalRows = SECONDARY_BENCHMARKS.filter(
    (metric) => metric.id !== "processing-cost-secondary",
  );

  return (
    <PageSection id="system" tabIndex={-1} className="ss-hv2-secondary relative">
      <Container size="wide" className="ss-hv2-secondary__container">
        <div className="ss-hv2-secondary__grid">
          <div className="ss-hv2-secondary__intro flex flex-col gap-6">
            <Reveal>
              <span className="ss-eyebrow ss-hv2-kicker self-start font-mono">
                <span className="ss-hv2-kicker__dot" aria-hidden="true" />
                Operating layer
              </span>
            </Reveal>
            <Reveal delayMs={80}>
              <h2 className="ss-hv2-display ss-hv2-secondary__title text-4xl sm:text-5xl">
                The Silverstone <span className="ss-signal-text">System</span>
              </h2>
            </Reveal>
            <Reveal delayMs={160}>
              <p className="ss-lead ss-hv2-secondary__lead ss-hv2-copy">
                <span className="ss-hv2-secondary__lead-full">
                  Calls, messages, bookings and follow-ups converge into a single
                  operating layer. Silverstone AI answers in seconds, captures the
                  detail and routes the work — while your team keeps oversight of every
                  outcome.
                </span>
                <span className="ss-hv2-secondary__lead-short">
                  Calls, messages, bookings and follow-ups converge into one operating
                  layer — answered in seconds, with your team keeping oversight of every
                  outcome.
                </span>
              </p>
            </Reveal>
            <ul className="ss-hv2-secondary__caps flex flex-col gap-3">
              {CAPABILITIES.map((cap, index) => (
                <CapabilityItem key={cap.label} cap={cap} index={index} />
              ))}
            </ul>
            <div className="ss-hv2-secondary__actions flex flex-wrap items-center gap-4 pt-1">
              <Reveal delayMs={440} kind="cta">
                <Button asChild size="lg" variant="accent" className="ss-btn-signal">
                  <Link to="/book#booking-calendar">Book a free audit</Link>
                </Button>
              </Reveal>
              <Reveal delayMs={510} kind="cta">
                <Button asChild size="lg" variant="ghost">
                  <Link to="/services/ai-receptionists#demo-ai-receptionists">
                    Try the live demo
                  </Link>
                </Button>
              </Reveal>
            </div>
            <MobileSignalBoard metrics={consoleMetrics} />
            <SystemScrollCue className="ss-hv2-secondary__cue--intro" />
          </div>

          <div className="ss-hv2-secondary__showcase">
            <Reveal delayMs={160} kind="card" className="ss-hv2-secondary__console">
              <aside className="ss-hv2-hero__panel ss-hv2-system-signal">
                <div className="ss-hv2-hero__scan" aria-hidden="true" />
                <div className="relative flex flex-col gap-5">
                  <div className="ss-hv2-console-item ss-hv2-system-signal__header">
                    <span className="ss-eyebrow font-mono ss-hv2-copy">
                      Live Signal Benchmarks
                    </span>
                    <span className="ss-hv2-system-signal__status">
                      <span className="ss-hv2-kicker__dot" aria-hidden="true" />
                      Benchmark mode
                    </span>
                  </div>
                  <ul className="ss-hv2-system-signal__metrics">
                    {consoleMetrics.map((metric, index) => (
                      <li
                        key={metric.id}
                        className="ss-hv2-console-item ss-hv2-system-signal__metric"
                        style={
                          {
                            "--ss-hv2-reveal-delay": `${String(70 + index * 50)}ms`,
                          } as CSSProperties
                        }
                      >
                        <span className="ss-hv2-hero__stat-value ss-signal-text">
                          {staticBenchmark(metric)}
                        </span>
                        <span className="ss-hv2-system-signal__label">
                          {metric.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <ul
                    className="ss-hv2-system-signal__rows"
                    aria-label="Supporting benchmark telemetry"
                  >
                    {signalRows.map((metric, index) => (
                      <li
                        key={metric.id}
                        className="ss-hv2-console-item ss-hv2-system-signal__row"
                        style={
                          {
                            "--ss-hv2-reveal-delay": `${String(290 + index * 55)}ms`,
                          } as CSSProperties
                        }
                      >
                        <span className="ss-hv2-system-signal__row-primary">
                          <span className="ss-hv2-system-signal__row-value">
                            {staticBenchmark(metric)}
                          </span>
                          <span className="ss-hv2-system-signal__row-label">
                            {metric.label}
                          </span>
                        </span>
                        <span className="ss-hv2-system-signal__row-context">
                          {metric.context}
                        </span>
                        <span
                          className="ss-hv2-system-signal__row-source"
                          title={metric.source}
                        >
                          Benchmark
                          <span className="sr-only"> source: {metric.source}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p
                    className="ss-hv2-console-item ss-hv2-system-signal__note"
                    style={{ "--ss-hv2-reveal-delay": "540ms" } as CSSProperties}
                  >
                    <span aria-hidden="true">Benchmark outcomes, not guarantees.</span>
                    <span className="sr-only">{BENCHMARK_DISCLAIMER}</span>
                  </p>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
        <SystemScrollCue className="ss-hv2-secondary__cue--trailing" />
      </Container>
    </PageSection>
  );
}
