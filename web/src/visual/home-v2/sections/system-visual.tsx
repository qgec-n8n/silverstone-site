import type { CSSProperties } from "react";

import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { ExpandableImage } from "~/components/media/expandable-image";
import { RasterPicture } from "~/components/ui/raster-picture";

import { Reveal } from "../components/reveal";

/** Premium generated bitmap visual for the Silverstone System narrative. */
export function SystemVisual() {
  return (
    <PageSection
      className="ss-hv2-system-visual-section relative"
      style={{ "--ss-hv2-accent": "var(--ss-v2-indigo)" } as CSSProperties}
    >
      <Container size="wide">
        <div className="ss-hv2-system-visual">
          <Reveal className="ss-hv2-system-visual__copy" kind="section">
            <span className="ss-eyebrow ss-hv2-kicker self-start font-mono">
              <span className="ss-hv2-kicker__dot" aria-hidden="true" />
              System architecture
            </span>
            <h2 className="ss-hv2-display text-4xl sm:text-5xl">
              One calm operating layer for{" "}
              <span className="ss-signal-text" data-sig="indigo">
                moving parts
              </span>
              .
            </h2>
            <p className="ss-lead ss-hv2-copy">
              The Silverstone System is designed around the real business process first:
              signal capture, triage, handoff, review and optimization. Technology is
              selected only after the operating model is clear.
            </p>
          </Reveal>
          <Reveal className="ss-hv2-system-visual__media" delayMs={140} kind="image">
            <figure>
              <ExpandableImage
                alt="Abstract chrome AI operating layer with cyan signal paths resolving into a central Silverstone system core."
                height={941}
                src="/home-v2/silverstone-system-visual.png"
                width={1672}
              >
                <RasterPicture
                  src="/home-v2/silverstone-system-visual.png"
                  alt="Abstract chrome AI operating layer with cyan signal paths resolving into a central Silverstone system core."
                  width={1672}
                  height={941}
                  loading="lazy"
                  decoding="async"
                />
              </ExpandableImage>
            </figure>
          </Reveal>
        </div>
      </Container>
    </PageSection>
  );
}
