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
export { useSectionReveal, type SectionReveal } from "~/visual/hooks/use-section-reveal";
export { usePageTransition, type PageTransition } from "~/visual/hooks/use-page-transition";
export {
  DemoShell,
  type DemoScenario,
  type DemoStep,
} from "~/visual/components/demo-shell";
export {
  ToolsCarousel,
  type ToolEntry,
  type ToolsCarouselProps,
} from "~/visual/components/tools-carousel";
export { ConversionPathLens } from "~/visual/components/signatures/conversion-path-lens";
export { ProductStateStack } from "~/visual/components/signatures/product-state-stack";
export { CallFlowOscilloscope } from "~/visual/components/signatures/call-flow-oscilloscope";
export { FrontDeskConvergence } from "~/visual/components/signatures/front-desk-convergence";
export { EditorialLoom } from "~/visual/components/signatures/editorial-loom";
export { ProcessLattice } from "~/visual/components/signatures/process-lattice";
export {
  IndustryInstrument,
  type InstrumentStep,
  type IndustryInstrumentProps,
} from "~/visual/components/industry-instrument";
export { ServicesDecisionMatrix } from "~/visual/components/services-decision-matrix";
export { IndustriesAtlas } from "~/visual/components/industries-atlas";

export { default as VisualSmoke } from "~/visual/fixtures/visual-smoke";
