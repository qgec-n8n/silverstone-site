import { ParticleField } from "~/components/vendor/silverstone/particle-field";

/*
  Ambient body particle layer. Sparser, slower and non-interactive — a calm
  luminous dust behind the whole page. Default export for `createLazyVisual`.
*/

const BODY_COLORS = ["#5ec5d0", "#7aa2ff", "#a97bd6", "#e06cc4"];

export default function BodyParticleLayer() {
  return (
    <ParticleField
      className="ss-hv2-backdrop__particles"
      colors={BODY_COLORS}
      density={46}
      maxParticles={64}
      speed={0.65}
      linkDistance={0}
      glow={16}
      opacity={0.5}
    />
  );
}
