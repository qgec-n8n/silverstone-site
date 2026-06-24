import { Link } from "react-router";

import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { Button } from "~/components/ui/button";

import { Icon } from "../components/icon";
import { Reveal } from "../components/reveal";

const CONSULTING_POINTS: readonly string[] = [
  "A free automation audit that maps your highest-leverage wins",
  "Senior strategy — not a reseller flipping someone else's tool",
  "A clear roadmap with human checkpoints at every step",
];

/** Advisory-led split section: cinematic strategy image + consulting narrative. */
export function AiConsulting() {
  return (
    <PageSection className="relative">
      <Container size="wide">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="ss-hv2-story__media">
            <img
              src="/home-v2/consulting-strategy.png"
              alt="Silverstone strategist mapping an automation blueprint on a dark studio wall."
              loading="lazy"
              decoding="async"
            />
          </Reveal>

          <Reveal className="flex flex-col gap-6">
            <span className="ss-hv2-kicker ss-eyebrow self-start font-mono">
              <span className="ss-hv2-kicker__dot" aria-hidden="true" />
              AI consulting
            </span>
            <h2 className="ss-hv2-display text-4xl sm:text-5xl">
              Strategy first. <span className="ss-chrome-text">Technology second.</span>
            </h2>
            <p className="ss-lead text-[color:var(--ss-v2-titanium)]">
              Most automation fails because it starts with a tool. We start with your
              numbers — where time leaks and where revenue slips — then design the
              smallest system that fixes it.
            </p>
            <ul className="flex flex-col gap-3">
              {CONSULTING_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-[color:var(--ss-v2-platinum)]"
                >
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-[color:var(--ss-v2-hairline-strong)] text-[color:var(--ss-v2-signal-cyan-soft)]">
                    <Icon name="Check" className="size-3.5" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <div>
              <Button asChild size="lg" variant="accent">
                <Link to="/how-we-work">See how we work</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </PageSection>
  );
}
