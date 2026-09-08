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

import { MobileHeroStack } from "~/features/services-v2/components/mobile-hero-stack";
import { HOME_MOBILE_HERO } from "~/data/home-v2/mobile-hero";

import { Icon } from "../components/icon";
import { Reveal } from "../components/reveal";

type Capability = {
  icon: string;
  label: string;
  detail: string;
};

/**
 * What Silverstone AI builds, in three literal lines: every one of the seven
 * services sits under one of these, so a reader (or an answer engine) leaves
 * the fold knowing the category, the location and the full offer. How the
 * studio operates (pilots, weeks, human oversight) lives in `OperatingLayer`,
 * below the trust strip.
 */
const CAPABILITIES: Capability[] = [
  {
    icon: "PhoneCall",
    label: "AI agents & AI voice agents",
    detail:
      "AI receptionists, voice agents and chat agents that answer, qualify and book around the clock.",
  },
  {
    icon: "Workflow",
    label: "Workflow automation & AI business systems",
    detail:
      "Agentic workflows across your CRM, calendar and back office, with human approval where it matters.",
  },
  {
    icon: "Globe",
    label: "Web, app development & AI consulting",
    detail:
      "Conversion-focused websites, custom apps and an AI roadmap that decides what to automate first.",
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
 * Compact "Live Signal Benchmarks" board for the stacked (tablet) layout:
 * `.ss-hv2-secondary__mobile-signal` is `display:none` at >=64rem, where the
 * full console in the showcase column carries the same figures.
 *
 * On phones (<=40rem) it is the hero's proof beat: it renders in the slot the
 * shared hero gives its three-row manifest — under the tagline, above the
 * pills — and the manifest is display:none there, because one phone screen
 * holds one of them. It sits in the DOM at that slot; the tablet layout
 * (40–64rem) puts it back under the pills with `order`, so nothing above 40rem
 * changed. Both beats stay mounted on every viewport, so the figures and the
 * benchmark disclaimer remain in the prerendered HTML.
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
 * Body opener directly beneath the hero. It states what Silverstone AI is — a
 * London-based AI automation agency, the seven services, the two markets — in
 * the most literal terms on the site, beside the live-signal console. It is
 * the scroll/transition target for the hero's "Explore the system" action.
 * The "Silverstone System" operating narrative that used to open here now
 * follows the trust strip (`OperatingLayer`).
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
                London-based AI automation agency
              </span>
            </Reveal>
            <Reveal delayMs={80}>
              <h2 className="ss-hv2-display ss-hv2-secondary__title text-4xl sm:text-5xl">
                The London <span className="ss-signal-text">AI agency</span>.
              </h2>
            </Reveal>
            {/*
              Phone-only, and the same component the other 25 heroes render, so
              the homepage's phone composition is the site's phone composition:
              title -> tagline -> glass manifest -> pills -> cue. Both beats are
              `display:none` above 40rem, so the desktop column below (lead,
              two-line capability items, signal board) is untouched.

              The delays are this hero's own ladder, not the shared hero's: its
              beats reveal at 0/80/160/440/510ms, so the tagline follows the
              title at 240 and the manifest lands at 300 (rows 380/480/580).
            */}
            <MobileHeroStack
              copy={HOME_MOBILE_HERO}
              taglineDelayMs={240}
              manifestDelayMs={300}
            />
            {/* On a phone the board stands where the shared hero's manifest
                stands (title → tagline → board → pills → cue): the homepage's
                three headline figures are its proof, and one screen cannot
                hold both. The manifest stays mounted for the crawler and is
                display:none there; on the tablet layout the board is moved
                back under the pills by `order`. See MobileSignalBoard. */}
            <MobileSignalBoard metrics={consoleMetrics} />
            <Reveal delayMs={160}>
              <p className="ss-lead ss-hv2-secondary__lead ss-hv2-copy">
                <span className="ss-hv2-secondary__lead-full">
                  Silverstone AI is a London-based AI automation agency specializing in
                  AI agents, AI voice agents and receptionists, workflow automation, web
                  and app development, AI business systems and AI consulting for
                  businesses across the UK and US.
                </span>
                <span className="ss-hv2-secondary__lead-short">
                  Silverstone AI is a London-based AI automation agency: AI agents,
                  voice agents, workflow automation, web and app development and AI
                  consulting for UK and US businesses.
                </span>
              </p>
            </Reveal>
            <ul className="ss-hv2-secondary__caps flex flex-col gap-3">
              {CAPABILITIES.map((cap, index) => (
                <CapabilityItem key={cap.label} cap={cap} index={index} />
              ))}
            </ul>
            <div className="ss-hv2-secondary__actions ss-mhero__actions flex flex-wrap items-center gap-4 pt-1">
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
