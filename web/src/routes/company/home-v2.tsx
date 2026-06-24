import "~/styles/visual/home-v2.css";

import { deriveMotionPolicy } from "~/visual/home-v2/motion-policy";
import { Hero } from "~/visual/home-v2/hero";
import {
  AiConsulting,
  BenchmarkMetrics,
  ConversionClimax,
  ImageStorytelling,
  IntegrationCarousel,
  ProcessStory,
  ServicesUniverse,
  Standard,
  TrustStrip,
} from "~/visual/home-v2/sections";
import { ScrollProvider } from "~/visual/home-v2/scroll-provider";
import { useCapabilityTier } from "~/visual/hooks/use-capability-tier";

/**
 * V2 homepage presentation. The capability tier and motion policy are resolved
 * once here and threaded down so individual sections never re-derive motion
 * state. Reduced motion / low power collapses the whole page to a calm static
 * surface via the `minimal` tier.
 */
export function HomeV2() {
  const capability = useCapabilityTier();
  const policy = deriveMotionPolicy({
    tier: capability.tier,
    reducedMotion: capability.reducedMotion,
    shaderEligible: capability.shaderEligible,
  });

  return (
    <div className="ss-hv2" data-tier={policy.tier}>
      <div className="ss-hv2__aura" aria-hidden="true" />
      <ScrollProvider enabled={policy.scrollChoreography}>
        <Hero
          motionEnabled={policy.motionEnabled}
          shaderEnabled={policy.shaderEnabled}
        />
        <TrustStrip />
        <ServicesUniverse />
        <AiConsulting />
        <BenchmarkMetrics countersEnabled={policy.countersEnabled} />
        <IntegrationCarousel marqueeEnabled={policy.marqueeEnabled} />
        <ProcessStory />
        <ImageStorytelling />
        <Standard />
        <ConversionClimax />
      </ScrollProvider>
    </div>
  );
}
