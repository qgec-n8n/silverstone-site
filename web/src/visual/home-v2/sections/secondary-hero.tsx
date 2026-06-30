import type { CSSProperties } from "react";
import { Link } from "react-router";

import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { Button } from "~/components/ui/button";
import { SYSTEM_LAYERS } from "~/data/home-v2";
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
    label: "Scoped first",
    detail: "Audit, map and prioritise before committing to a larger system.",
  },
  {
    icon: "Zap",
    label: "Staged build",
    detail: "Launch in controlled phases, with review gates around the risky parts.",
  },
  {
    icon: "UserCheck",
    label: "Human review",
    detail: "Your team keeps oversight of every decision the system makes.",
  },
];

function SystemScrollCue() {
  return (
    <div className="ss-hv2-body-scrollcue" aria-hidden="true">
      <span className="ss-eyebrow font-mono text-[10px]">Scroll</span>
      <span className="ss-hv2-scrollcue__rail" />
    </div>
  );
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
 * Body opener directly beneath the hero. It carries the positioning,
 * capability proof and a major live-signal module in the former image slot. It
 * is the scroll/transition target for the hero's "Explore the system" action.
 */
export function SecondaryHero() {
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
                The Silverstone System
              </h2>
            </Reveal>
            <Reveal delayMs={160}>
              <p className="ss-lead ss-hv2-secondary__lead text-[color:var(--ss-v2-titanium)]">
                Strategy, design, automation, AI agents, software, integrations and
                optimisation converge into one operating layer. Silverstone maps the
                work, builds the system and keeps the human checkpoints visible.
              </p>
            </Reveal>
            <ul className="ss-hv2-secondary__caps flex flex-col gap-3">
              {CAPABILITIES.map((cap, index) => (
                <CapabilityItem key={cap.label} cap={cap} index={index} />
              ))}
            </ul>
            <div className="ss-hv2-secondary__actions flex flex-wrap items-center gap-4 pt-1">
              <Reveal delayMs={440}>
                <Button asChild size="lg" variant="accent">
                  <Link to="/book">Book a discovery call</Link>
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
            <Reveal delayMs={160} className="ss-hv2-secondary__console">
              <aside className="ss-hv2-hero__panel ss-hv2-system-signal">
                <div className="ss-hv2-hero__scan" aria-hidden="true" />
                <div className="relative flex flex-col gap-5">
                  <div className="ss-hv2-console-item ss-hv2-system-signal__header">
                    <span className="ss-eyebrow font-mono text-[color:var(--ss-v2-titanium)]">
                      System architecture
                    </span>
                    <span className="ss-hv2-system-signal__status">
                      <span className="ss-hv2-kicker__dot" aria-hidden="true" />
                      Strategy-led build
                    </span>
                  </div>
                  <div className="ss-hv2-system-map" aria-hidden="true">
                    <span className="ss-hv2-system-map__core">
                      Silverstone
                      <span>System</span>
                    </span>
                    <span className="ss-hv2-system-map__orbit ss-hv2-system-map__orbit--a" />
                    <span className="ss-hv2-system-map__orbit ss-hv2-system-map__orbit--b" />
                    <span className="ss-hv2-system-map__beam ss-hv2-system-map__beam--a" />
                    <span className="ss-hv2-system-map__beam ss-hv2-system-map__beam--b" />
                  </div>
                  <ul
                    className="ss-hv2-system-signal__rows ss-hv2-system-signal__rows--layers"
                    aria-label="Silverstone System layers"
                  >
                    {SYSTEM_LAYERS.map((layer, index) => (
                      <li
                        key={layer.id}
                        className="ss-hv2-console-item ss-hv2-system-signal__row"
                        data-accent={layer.accent}
                        style={
                          {
                            "--ss-hv2-reveal-delay": `${String(90 + index * 55)}ms`,
                          } as CSSProperties
                        }
                      >
                        <span className="ss-hv2-system-signal__row-primary">
                          <span className="ss-hv2-system-signal__row-icon">
                            <Icon name={layer.icon} className="size-4" />
                          </span>
                          <span className="ss-hv2-system-signal__row-label">
                            {layer.title}
                          </span>
                        </span>
                        <span className="ss-hv2-system-signal__row-context">
                          {layer.summary}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p
                    className="ss-hv2-console-item ss-hv2-system-signal__note"
                    style={{ "--ss-hv2-reveal-delay": "540ms" } as CSSProperties}
                  >
                    Built around the business process first; tools and models come after
                    the operating design is clear.
                  </p>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
        <SystemScrollCue />
      </Container>
    </PageSection>
  );
}
