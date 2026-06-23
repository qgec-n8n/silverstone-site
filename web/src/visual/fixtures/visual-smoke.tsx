import "~/styles/visual/visual.css";

import { HomeHero } from "~/visual/components/home-hero";
import { NavVisualStates } from "~/visual/components/nav-visual-states";
import { PrimaryCta } from "~/visual/components/primary-cta";
import { ServicesOverview } from "~/visual/components/services-overview";
import { VisualLoadingFallback } from "~/visual/components/visual-loading-fallback";
import { DemoShell, type DemoScenario } from "~/visual/components/demo-shell";
import { ToolsCarousel, type ToolEntry } from "~/visual/components/tools-carousel";
import { IndustryInstrument } from "~/visual/components/industry-instrument";
import { ServicesDecisionMatrix } from "~/visual/components/services-decision-matrix";
import { IndustriesAtlas } from "~/visual/components/industries-atlas";
import { ConversionPathLens } from "~/visual/components/signatures/conversion-path-lens";
import { ProductStateStack } from "~/visual/components/signatures/product-state-stack";
import { CallFlowOscilloscope } from "~/visual/components/signatures/call-flow-oscilloscope";
import { FrontDeskConvergence } from "~/visual/components/signatures/front-desk-convergence";
import { EditorialLoom } from "~/visual/components/signatures/editorial-loom";
import { ProcessLattice } from "~/visual/components/signatures/process-lattice";

const EXAMPLE_SCENARIO: DemoScenario = {
  id: "smoke-conversion-path",
  title: "Conversion-path mapper",
  summary: "A synthetic walk from a cold visit to one booked discovery call.",
  safeguard: "Demonstrates the path concept with synthetic data — it does not predict results.",
  idle: () => <p>Press Start to walk a synthetic visitor path.</p>,
  build: () => [
    {
      id: "land",
      log: "Visitor lands on the home signal.",
      status: "Step 1 — visitor enters the path.",
      render: () => <p>Visitor enters from a synthetic search.</p>,
    },
    {
      id: "focus",
      log: "Path narrows toward the primary action.",
      status: "Step 2 — intent focuses.",
      render: () => <p>Secondary distractions fall away.</p>,
    },
    {
      id: "book",
      log: "Synthetic visitor books a discovery call.",
      status: "Step 3 — outcome reached.",
      render: () => <p>One booked outcome — synthetic, not a forecast.</p>,
    },
  ],
};

const EXAMPLE_TOOLS: ToolEntry[] = [
  { name: "Calendar", category: "Scheduling", note: "Holds discovery-call slots." },
  { name: "CRM", category: "Records", note: "Keeps enquiry state in one place." },
  { name: "Inbox", category: "Messaging", note: "Routes inbound conversations." },
  { name: "Forms", category: "Capture", note: "Captures structured intent." },
];

/**
 * Single mountable surface that composes the full home experience plus the
 * non-home page-feature primitives. Used as a typecheck/lint/build smoke target
 * and as a reference for the production team lifting these components into
 * routed pages. Not route-rendered itself.
 */
export default function VisualSmoke() {
  return (
    <div className="ss-visual-root">
      <NavVisualStates />
      <main>
        <HomeHero />
        <ServicesOverview />

        <section>
          <h2>Page signatures</h2>
          <ConversionPathLens />
          <ProductStateStack />
          <CallFlowOscilloscope />
          <FrontDeskConvergence />
          <EditorialLoom />
          <ProcessLattice />
        </section>

        <section>
          <h2>Services decision matrix</h2>
          <ServicesDecisionMatrix />
        </section>

        <section>
          <h2>Industries atlas</h2>
          <IndustriesAtlas />
        </section>

        <section>
          <h2>Industry instrument</h2>
          <IndustryInstrument
            sector="Estate agents"
            instrument="Property-enquiry switchboard"
            caption="A synthetic walk from a new listing enquiry to a routed human conversation."
            steps={[
              { label: "Intake", detail: "An enquiry arrives against a specific listing." },
              { label: "Triage", detail: "Intent and urgency are sorted, never decided." },
              { label: "Hand-off", detail: "A person picks up with full context." },
            ]}
            boundary="A person stays in control of every client-facing decision."
          />
        </section>

        <section>
          <h2>Demo shell</h2>
          <DemoShell scenario={EXAMPLE_SCENARIO} />
        </section>

        <section>
          <ToolsCarousel label="Connector constellation" tools={EXAMPLE_TOOLS} />
        </section>

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
