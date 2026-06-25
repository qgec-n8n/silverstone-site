import type { CSSProperties } from "react";
import { Link } from "react-router";

import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { Button } from "~/components/ui/button";
import type { BenchmarkMetric } from "~/data/home-v2";
import { HEADLINE_BENCHMARKS } from "~/data/home-v2";
import { useSectionReveal } from "~/visual/hooks/use-section-reveal";

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

/** A single capability that reveals on its own, top-to-bottom down the list. */
function CapabilityItem({ cap, index }: { cap: Capability; index: number }) {
  const { ref, revealed } = useSectionReveal();
  return (
    <li
      ref={ref}
      data-revealed={revealed}
      style={
        { "--ss-hv2-reveal-delay": `${String(220 + index * 70)}ms` } as CSSProperties
      }
      className="ss-hv2-reveal ss-hv2-secondary__cap"
    >
      <span className="ss-hv2-secondary__cap-icon" aria-hidden="true">
        <Icon name={cap.icon} className="size-4" />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="font-semibold text-[color:var(--ss-v2-platinum)]">
          {cap.label}
        </span>
        <span className="text-sm text-[color:var(--ss-v2-titanium)]">{cap.detail}</span>
      </span>
    </li>
  );
}

/**
 * Body opener directly beneath the hero. It carries the positioning, the
 * capability proof and the live-signal console that previously crowded the hero
 * — laid out wide and layered alongside a single strong system image. It is the
 * scroll/transition target for the hero's "Explore the system" action.
 */
export function SecondaryHero() {
  const consoleMetrics = HEADLINE_BENCHMARKS.slice(0, 3);

  return (
    <PageSection id="system" tabIndex={-1} className="ss-hv2-secondary relative">
      <Container size="wide">
        <div className="ss-hv2-secondary__grid">
          <div className="ss-hv2-secondary__intro flex flex-col gap-6">
            <Reveal>
              <span className="ss-eyebrow ss-hv2-kicker self-start font-mono">
                <span className="ss-hv2-kicker__dot" aria-hidden="true" />
                The Silverstone system
              </span>
            </Reveal>
            <Reveal delayMs={80}>
              <h2 className="ss-hv2-display ss-hv2-secondary__title text-4xl sm:text-5xl">
                One calm surface for every{" "}
                <span className="ss-chrome-text">moment that matters</span>.
              </h2>
            </Reveal>
            <Reveal delayMs={160}>
              <p className="ss-lead ss-hv2-secondary__lead text-[color:var(--ss-v2-titanium)]">
                Calls, messages, bookings and follow-ups converge into a single
                operating layer. Silverstone answers in seconds, captures the
                detail and routes the work — while your team keeps oversight of
                every outcome.
              </p>
            </Reveal>
            <ul className="ss-hv2-secondary__caps flex flex-col gap-3">
              {CAPABILITIES.map((cap, index) => (
                <CapabilityItem key={cap.label} cap={cap} index={index} />
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Reveal delayMs={440}>
                <Button asChild size="lg" variant="accent">
                  <Link to="/book">Book a free audit</Link>
                </Button>
              </Reveal>
              <Reveal delayMs={510}>
                <Button asChild size="lg" variant="ghost">
                  <Link to="/how-we-work">See how it works</Link>
                </Button>
              </Reveal>
            </div>
          </div>

          <div className="ss-hv2-secondary__showcase">
            <Reveal delayMs={120} className="ss-hv2-secondary__media">
              <figure className="ss-hv2-story__media">
                <img
                  src="/home-v2/secondary-hero.png"
                  alt="The Silverstone operating surface bringing calls, messages and bookings into one view"
                  width={1280}
                  height={896}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </Reveal>
            <Reveal delayMs={200} className="ss-hv2-secondary__console">
              <aside className="ss-hv2-hero__panel p-6">
                <div className="ss-hv2-hero__scan" aria-hidden="true" />
                <div className="relative flex flex-col gap-5">
                  <div className="ss-hv2-console-item flex items-center justify-between">
                    <span className="ss-eyebrow font-mono text-[color:var(--ss-v2-titanium)]">
                      Live signal
                    </span>
                    <span className="ss-hv2-kicker__dot" aria-hidden="true" />
                  </div>
                  <ul className="grid grid-cols-3 gap-4">
                    {consoleMetrics.map((metric, index) => (
                      <li
                        key={metric.id}
                        className="ss-hv2-console-item flex flex-col gap-1"
                        style={
                          {
                            "--ss-hv2-reveal-delay": `${String(70 + index * 50)}ms`,
                          } as CSSProperties
                        }
                      >
                        <span className="ss-hv2-hero__stat-value ss-signal-text text-2xl sm:text-3xl">
                          {staticBenchmark(metric)}
                        </span>
                        <span className="text-xs text-[color:var(--ss-v2-titanium)]">
                          {metric.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p
                    className="ss-hv2-console-item border-t border-[color:var(--ss-v2-hairline)] pt-3 text-xs text-[color:var(--ss-v2-titanium)]"
                    style={{ "--ss-hv2-reveal-delay": "230ms" } as CSSProperties}
                  >
                    Benchmark outcomes, not guarantees.
                  </p>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </Container>
    </PageSection>
  );
}
