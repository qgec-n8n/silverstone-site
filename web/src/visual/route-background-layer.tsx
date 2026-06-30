import { BodyParticles } from "~/visual/home-v2/body-particles";
import { HeroAetherField } from "~/visual/home-v2/hero-aether-field";
import type { CapabilityTier } from "~/visual/hooks/use-capability-tier";

export type RouteBackgroundPhase = "body" | "intro";

type RouteBackgroundLayerProps = {
  particlesEnabled?: boolean;
  pathname: string;
  phase: RouteBackgroundPhase;
  tier?: CapabilityTier;
};

export function RouteBackgroundLayer({
  particlesEnabled = false,
  phase,
  tier = "minimal",
}: RouteBackgroundLayerProps) {
  if (phase === "intro") {
    return <HeroAetherField />;
  }

  return <BodyParticles enabled={particlesEnabled} tier={tier} />;
}
