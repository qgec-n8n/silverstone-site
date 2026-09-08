import type { CSSProperties } from "react";

import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { SILVERSTONE_STANDARD } from "~/data/home-v2";
import { ExpandableImage } from "~/components/media/expandable-image";
import { RasterPicture } from "~/components/ui/raster-picture";

import { Icon } from "../components/icon";
import { Reveal } from "../components/reveal";

/** One brand hue per commitment, so the four pillars skim as a spectrum. */
const PILLAR_ACCENTS: readonly string[] = [
  "var(--ss-v2-aqua)",
  "var(--ss-v2-azure)",
  "var(--ss-v2-ultraviolet)",
  "var(--ss-v2-orchid)",
];

/** The Silverstone Standard — four commitments beside a chrome emblem still. */
export function Standard() {
  return (
    <PageSection
      className="relative"
      style={{ "--ss-hv2-accent": "var(--ss-v2-aqua)" } as CSSProperties}
    >
      <Container size="wide">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="flex flex-col gap-6">
            <span className="ss-hv2-kicker ss-eyebrow self-start font-mono">
              <span className="ss-hv2-kicker__dot" aria-hidden="true" />
              The Silverstone Standard
            </span>
            <h2 className="ss-hv2-display text-4xl sm:text-5xl">
              Held to a{" "}
              <span className="ss-signal-text" data-sig="aqua">
                higher standard
              </span>
              .
            </h2>
            <p className="ss-lead ss-hv2-copy">
              Four commitments behind every system we ship.
            </p>
            <figure className="ss-hv2-story__media mt-2 hidden lg:block">
              <ExpandableImage
                alt="Polished chrome Silverstone emblem catching cyan and violet light in darkness."
                src="/home-v2/standard-chrome.png"
              >
                <RasterPicture
                  src="/home-v2/standard-chrome.png"
                  alt="Polished chrome Silverstone emblem catching cyan and violet light in darkness."
                  loading="lazy"
                  decoding="async"
                />
              </ExpandableImage>
            </figure>
          </Reveal>

          <div className="flex flex-col gap-4">
            {SILVERSTONE_STANDARD.map((pillar, index) => (
              <Reveal key={pillar.id} delayMs={index * 70} kind="card">
                <article
                  className="ss-hv2-pillar"
                  style={
                    {
                      "--ss-hv2-accent":
                        PILLAR_ACCENTS[index % PILLAR_ACCENTS.length] ??
                        "var(--ss-v2-aqua)",
                    } as CSSProperties
                  }
                >
                  <span className="ss-hv2-pillar__icon">
                    <Icon name={pillar.icon} className="size-5" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="ss-hv2-card__title text-xl">{pillar.title}</h3>
                    <p className="ss-hv2-pillar__text text-sm">{pillar.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </PageSection>
  );
}
