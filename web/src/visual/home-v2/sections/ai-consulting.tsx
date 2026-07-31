import type { CSSProperties } from "react";
import { Link } from "react-router";

import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { Button } from "~/components/ui/button";
import { useSectionReveal } from "~/visual/hooks/use-section-reveal";
import { RasterPicture } from "~/components/ui/raster-picture";

import { Icon } from "../components/icon";
import { Reveal } from "../components/reveal";

const CONSULTING_POINTS: readonly string[] = [
  "A free automation audit that maps your highest-leverage wins",
  "Senior strategy — not a reseller flipping someone else's tool",
  "A clear roadmap with human checkpoints at every step",
];

/** A single consulting point that reveals on its own, top-to-bottom. */
function ConsultingPoint({ point, index }: { point: string; index: number }) {
  const { ref, revealed } = useSectionReveal();
  return (
    <li
      ref={ref}
      data-revealed={revealed}
      style={
        { "--ss-hv2-reveal-delay": `${String(240 + index * 70)}ms` } as CSSProperties
      }
      className="ss-hv2-reveal flex items-start gap-3 ss-hv2-copy-strong"
    >
      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-[color:var(--ss-v2-hairline-strong)] text-[color:var(--ss-v2-signal-cyan-soft)]">
        <Icon name="Check" className="size-3.5" />
      </span>
      {point}
    </li>
  );
}

/** Advisory-led split section: cinematic strategy image + consulting narrative. */
export function AiConsulting() {
  return (
    <PageSection
      className="relative"
      style={{ "--ss-hv2-accent": "var(--ss-v2-azure)" } as CSSProperties}
    >
      <Container size="wide">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="ss-hv2-story__media" kind="image">
            <RasterPicture
              src="/home-v2/consulting-strategy.png"
              alt="Silverstone strategist mapping an automation blueprint on a dark studio wall."
              className="ss-hv2-img-mask"
              loading="lazy"
              decoding="async"
            />
          </Reveal>

          <div className="flex flex-col gap-6">
            <Reveal>
              <span className="ss-hv2-kicker ss-eyebrow self-start font-mono">
                <span className="ss-hv2-kicker__dot" aria-hidden="true" />
                AI consulting
              </span>
            </Reveal>
            <Reveal delayMs={80}>
              <h2 className="ss-hv2-display text-4xl sm:text-5xl">
                Strategy first.{" "}
                <span className="ss-signal-text" data-sig="azure">
                  Technology second.
                </span>
              </h2>
            </Reveal>
            <Reveal delayMs={160}>
              <p className="ss-lead ss-hv2-copy">
                Most automation fails because it starts with a tool. We start with your
                numbers — where time leaks and where revenue slips — then design the
                smallest system that fixes it.
              </p>
            </Reveal>
            <ul className="flex flex-col gap-3">
              {CONSULTING_POINTS.map((point, index) => (
                <ConsultingPoint key={point} point={point} index={index} />
              ))}
            </ul>
            <Reveal delayMs={460} kind="cta">
              <div>
                <Button asChild size="lg" variant="accent">
                  <Link to="/services/ai-consulting">Explore consulting</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </PageSection>
  );
}
