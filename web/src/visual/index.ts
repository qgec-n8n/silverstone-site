export { HomeHero } from "~/visual/components/home-hero";
export { NavVisualStates } from "~/visual/components/nav-visual-states";
export { OperatingSystemConstellation } from "~/visual/components/operating-system-constellation";
export { PrimaryCta } from "~/visual/components/primary-cta";
export { ServicesOverview } from "~/visual/components/services-overview";
export { VisualLoadingFallback } from "~/visual/components/visual-loading-fallback";
export { LowPowerPoster } from "~/visual/components/low-power-poster";
export { SignalFieldBackground } from "~/visual/shader/signal-field-background";
export {
  MachinedSignalIcon,
  ICON_PATHS,
  type MachinedSignalIconName,
} from "~/visual/icons/machined-signal-icons";
export {
  useCapabilityTier,
  SHADER_MIN_WIDTH,
  type CapabilityTier,
  type CapabilitySnapshot,
} from "~/visual/hooks/use-capability-tier";

// ---- non-home page-feature primitives ----
export {
  useSectionReveal,
  type SectionReveal,
} from "~/visual/hooks/use-section-reveal";
export {
  usePageTransition,
  type PageTransition,
} from "~/visual/hooks/use-page-transition";
export { PageEntry } from "~/visual/components/page-entry";
export { RevealSection } from "~/visual/components/reveal-section";
