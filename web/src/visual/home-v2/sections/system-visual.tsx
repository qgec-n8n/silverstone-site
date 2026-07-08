import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";

import { Reveal } from "../components/reveal";

/** Premium generated bitmap visual for the Silverstone System narrative. */
export function SystemVisual() {
  return (
    <PageSection className="ss-hv2-system-visual-section relative">
      <Container size="wide">
        <div className="ss-hv2-system-visual">
          <Reveal className="ss-hv2-system-visual__copy" kind="section">
            <span className="ss-eyebrow ss-hv2-kicker self-start font-mono">
              <span className="ss-hv2-kicker__dot" aria-hidden="true" />
              System architecture
            </span>
            <h2 className="ss-hv2-display text-4xl sm:text-5xl">
              One calm operating layer for{" "}
              <span className="ss-signal-text">moving parts</span>.
            </h2>
            <p className="ss-lead text-[color:var(--ss-v2-titanium)]">
              The Silverstone System is designed around the real business process first:
              signal capture, triage, handoff, review and optimisation. Technology is
              selected only after the operating model is clear.
            </p>
          </Reveal>
          <Reveal className="ss-hv2-system-visual__media" delayMs={140} kind="image">
            <figure>
              <img
                src="/home-v2/silverstone-system-visual.png"
                alt="Abstract chrome AI operating layer with cyan signal paths resolving into a central Silverstone system core."
                width={1672}
                height={941}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </Reveal>
        </div>
      </Container>
    </PageSection>
  );
}
