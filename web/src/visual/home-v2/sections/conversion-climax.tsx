import { Link } from "react-router";

import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { Button } from "~/components/ui/button";

import { Icon } from "../components/icon";
import { Reveal } from "../components/reveal";

/** Final conversion moment — decisive headline and the primary CTAs. */
export function ConversionClimax() {
  return (
    <PageSection spacing="hero" className="relative">
      <Container size="content" className="relative z-10">
        <Reveal kind="cta">
          <div className="ss-hv2-cta">
            <span
              className="ss-hv2-cta__light ss-hv2-cta__light--cyan"
              aria-hidden="true"
            />
            <span
              className="ss-hv2-cta__light ss-hv2-cta__light--violet"
              aria-hidden="true"
            />
            <span className="ss-hv2-cta__grid" aria-hidden="true" />
            <div className="flex flex-col items-center gap-8 text-center">
              <Reveal>
                <span className="ss-hv2-cta__signal ss-eyebrow font-mono">
                  <span className="ss-hv2-kicker__dot" aria-hidden="true" />
                  Automation audit
                </span>
              </Reveal>
              <Reveal delayMs={80}>
                <h2 className="ss-hv2-display text-4xl sm:text-5xl lg:text-6xl">
                  Stop missing what your business{" "}
                  <span className="ss-chrome-text">already earned</span>.
                </h2>
              </Reveal>
              <Reveal delayMs={160}>
                <p className="ss-lead max-w-(--ss-type-measure-lead) text-[color:var(--ss-v2-titanium)]">
                  Book a free automation audit. We&rsquo;ll map where time and revenue
                  leak, and show you the smallest system that closes the gap — no
                  obligation, no jargon.
                </p>
              </Reveal>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Reveal delayMs={240}>
                  <Button asChild size="lg" variant="accent" className="ss-btn-signal">
                    <Link to="/book#booking-calendar">
                      Book a discovery call
                      <Icon name="ArrowRight" className="size-4" />
                    </Link>
                  </Button>
                </Reveal>
                <Reveal delayMs={310}>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/contact#contact-form">Talk to us</Link>
                  </Button>
                </Reveal>
              </div>
              <Reveal delayMs={390}>
                <p className="text-sm text-[color:var(--ss-v2-titanium)]">
                  London-based · Working with UK businesses nationwide
                </p>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </Container>
    </PageSection>
  );
}
