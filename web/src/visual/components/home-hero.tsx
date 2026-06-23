import "~/styles/visual/visual.css";

import { OperatingSystemConstellation } from "~/visual/components/operating-system-constellation";
import { PrimaryCta } from "~/visual/components/primary-cta";
import { useCapabilityTier } from "~/visual/hooks/use-capability-tier";
import { SignalFieldBackground } from "~/visual/shader/signal-field-background";

const PROOF_POINTS = ["No lock-in pilots", "Human-reviewed automation", "Live in weeks"];

/**
 * Copy-first home hero. The headline carries the "From friction to flow"
 * concept; the stage pairs the always-on poster + constellation with the
 * deferred signal-field shader, gated by the resolved capability tier.
 */
export function HomeHero() {
  const { shaderEligible } = useCapabilityTier();

  return (
    <section className="ss-hero" id="top">
      <div className="ss-hero__copy">
        <span className="ss-pill">
          <span className="ss-pill__dot" />
          Precision Luminescence
        </span>
        <h1 className="ss-hero__title">
          From friction to <span className="ss-hero__accent">flow</span>.
        </h1>
        <p className="ss-hero__lead">
          Silverstone gives growing teams one calm operating surface for web, app, content,
          automation and voice — with a human always in control of the signal.
        </p>
        <div className="ss-hero__actions">
          <PrimaryCta href="#book">Book a discovery call</PrimaryCta>
          <PrimaryCta href="#services" variant="secondary">
            Explore services
          </PrimaryCta>
        </div>
        <ul className="ss-hero__proof">
          {PROOF_POINTS.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>

      <div className="ss-stage" data-stage="">
        <SignalFieldBackground enabled={shaderEligible} />
        <OperatingSystemConstellation />
      </div>
    </section>
  );
}
