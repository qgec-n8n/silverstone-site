import { Link } from "react-router";

import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { Button } from "~/components/ui/button";

import { Icon } from "../components/icon";
import { Reveal } from "../components/reveal";

/** Final conversion moment — emblem, decisive headline and the primary CTAs. */
export function ConversionClimax() {
  return (
    <PageSection spacing="hero" className="relative">
      <Container size="content" className="relative z-10">
        <Reveal>
          <div className="ss-hv2-cta">
            <div className="flex flex-col items-center gap-8 text-center">
              <span aria-hidden className="ss-hv2-cta__emblem-wrap">
                <img
                  src="/brand/silverstone-ai-emblem-dark.png"
                  alt=""
                  width={860}
                  height={929}
                  className="ss-hv2-cta__emblem"
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <h2 className="ss-hv2-display text-4xl sm:text-5xl lg:text-6xl">
                Stop missing what your business{" "}
                <span className="ss-chrome-text">already earned</span>.
              </h2>
              <p className="ss-lead max-w-(--ss-type-measure-lead) text-[color:var(--ss-v2-titanium)]">
                Book a free automation audit. We&rsquo;ll map where time and revenue
                leak, and show you the smallest system that closes the gap — no
                obligation, no jargon.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg" variant="accent">
                  <Link to="/book">
                    Book a free audit
                    <Icon name="ArrowRight" className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/contact">Talk to us</Link>
                </Button>
              </div>
              <p className="text-sm text-[color:var(--ss-v2-titanium)]">
                London-based · Working with UK businesses nationwide
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </PageSection>
  );
}
