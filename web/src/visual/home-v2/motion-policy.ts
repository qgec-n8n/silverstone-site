import type { CapabilityTier } from "~/visual/hooks/use-capability-tier";

/**
 * Render-time motion gates for the V2 homepage. Every value is derived
 * synchronously from the capability snapshot so components never flip motion
 * state inside an effect. The `minimal` tier (reduced motion / low power)
 * resolves every gate to `false`, leaving the page calm and static.
 */
export type MotionPolicy = {
  tier: CapabilityTier;
  /** Master gate — any decorative motion at all. */
  motionEnabled: boolean;
  /** Deferred WebGL hero field (full tier + WebGL eligible only). */
  shaderEnabled: boolean;
  /** CSS marquee animation for the integration carousel. */
  marqueeEnabled: boolean;
  /** Smooth scroll + ScrollTrigger choreography. */
  scrollChoreography: boolean;
  /** Animated count-up for benchmark figures. */
  countersEnabled: boolean;
};

type MotionPolicyInput = {
  tier: CapabilityTier;
  reducedMotion: boolean;
  shaderEligible: boolean;
};

export function deriveMotionPolicy({
  tier,
  reducedMotion,
  shaderEligible,
}: MotionPolicyInput): MotionPolicy {
  const motionEnabled = tier !== "minimal" && !reducedMotion;

  return {
    tier,
    motionEnabled,
    shaderEnabled: motionEnabled && shaderEligible && tier === "full",
    marqueeEnabled: motionEnabled,
    scrollChoreography: motionEnabled,
    countersEnabled: motionEnabled,
  };
}
