import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { SILVERSTONE_STANDARD } from "~/data/home-v2";

import { Icon } from "../components/icon";
import { Reveal } from "../components/reveal";

/** The Silverstone Standard — four commitments beside a chrome emblem still. */
export function Standard() {
  return (
    <PageSection className="relative">
      <Container size="wide">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="flex flex-col gap-6">
            <span className="ss-hv2-kicker ss-eyebrow self-start font-mono">
              <span className="ss-hv2-kicker__dot" aria-hidden="true" />
              The Silverstone Standard
            </span>
            <h2 className="ss-hv2-display text-4xl sm:text-5xl">
              Held to a <span className="ss-signal-text">higher standard</span>.
            </h2>
            <p className="ss-lead text-[color:var(--ss-v2-titanium)]">
              Four commitments behind every system we ship.
            </p>
            <figure className="ss-hv2-story__media mt-2 hidden lg:block">
              <img
                src="/home-v2/standard-chrome.png"
                alt="Polished chrome Silverstone emblem catching cyan and violet light in darkness."
                loading="lazy"
                decoding="async"
              />
            </figure>
          </Reveal>

          <div className="flex flex-col gap-4">
            {SILVERSTONE_STANDARD.map((pillar, index) => (
              <Reveal key={pillar.id} delayMs={index * 70} kind="card">
                <article className="ss-hv2-pillar">
                  <span className="ss-hv2-pillar__icon">
                    <Icon name={pillar.icon} className="size-5" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="ss-hv2-card__title text-xl">{pillar.title}</h3>
                    <p className="text-sm text-[color:var(--ss-v2-titanium)]">
                      {pillar.description}
                    </p>
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
