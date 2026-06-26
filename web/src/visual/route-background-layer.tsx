import BackgroundGradientSnippet from "~/components/ui/background-gradient-snippet";
import CybercoreBackground from "~/components/ui/cybercore-section-hero";
import { BodyParticles } from "~/visual/home-v2/body-particles";
import { HeroAetherField } from "~/visual/home-v2/hero-aether-field";
import type { CapabilityTier } from "~/visual/hooks/use-capability-tier";
import { getRouteVisualBackgroundMode } from "~/visual/route-backgrounds";

export type RouteBackgroundPhase = "body" | "intro";

type RouteBackgroundLayerProps = {
  cybercoreBeamCount?: number;
  particlesEnabled?: boolean;
  pathname: string;
  phase: RouteBackgroundPhase;
  tier?: CapabilityTier;
};

export function RouteBackgroundLayer({
  cybercoreBeamCount = 70,
  particlesEnabled = false,
  pathname,
  phase,
  tier = "minimal",
}: RouteBackgroundLayerProps) {
  const mode = getRouteVisualBackgroundMode(pathname);

  if (phase === "intro") {
    return mode.intro === "cybercore" ? (
      <CybercoreBackground beamCount={cybercoreBeamCount} decorative />
    ) : (
      <HeroAetherField />
    );
  }

  return mode.body === "industry-gradient" ? (
    <BackgroundGradientSnippet />
  ) : (
    <BodyParticles enabled={particlesEnabled} tier={tier} />
  );
}
