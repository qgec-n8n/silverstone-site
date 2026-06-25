import { ParticleField } from "~/components/vendor/silverstone/particle-field";

/*
  Hero interactive particle layer. Default export so it can be code-split via
  `createLazyVisual` and mounted only on idle over the hero shader field.
*/

const HERO_COLORS = ["#5ec5d0", "#7aa2ff", "#a97bd6", "#e06cc4", "#f06aa6"];

export default function HeroParticleLayer() {
  return (
    <ParticleField
      className="ss-hv2-hero__particles"
      colors={HERO_COLORS}
      density={92}
      maxParticles={84}
      speed={1}
      linkDistance={128}
      interactive
      pointerRadius={150}
      glow={14}
      opacity={0.78}
    />
  );
}
