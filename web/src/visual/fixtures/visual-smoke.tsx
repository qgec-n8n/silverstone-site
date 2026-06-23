import "~/styles/visual/visual.css";

import { HomeHero } from "~/visual/components/home-hero";
import { NavVisualStates } from "~/visual/components/nav-visual-states";
import { PrimaryCta } from "~/visual/components/primary-cta";
import { ServicesOverview } from "~/visual/components/services-overview";
import { VisualLoadingFallback } from "~/visual/components/visual-loading-fallback";

/**
 * Single mountable surface that composes the full home experience. Used as a
 * typecheck/lint/build smoke target and as a reference for the production team
 * lifting these components into routed pages. Not route-rendered itself.
 */
export default function VisualSmoke() {
  return (
    <div className="ss-visual-root">
      <NavVisualStates />
      <main>
        <HomeHero />
        <ServicesOverview />
        <section className="ss-cta-chamber ss-on-graphite" id="book">
          <h2>Put a human back in control of the signal</h2>
          <p>
            One discovery call maps where friction lives today and what your operating surface looks
            like in flow.
          </p>
          <PrimaryCta href="#book" onGraphite>
            Book a discovery call
          </PrimaryCta>
        </section>
        <noscript>
          <VisualLoadingFallback />
        </noscript>
      </main>
    </div>
  );
}
