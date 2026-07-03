/**
 * /pricing — executive investment and value page.
 * Secondary-hero feature: ScopeLedgerSignature, four proportioned bars
 * summing to one scoped total (built for this page only).
 * Verified-results display uses the bespoke PricingMetricInstrument, not the
 * generic BenchmarkConsole — the only page allowed a second results row, and
 * only in a deliberately balanced 3-over-2 shape.
 */
import { Gauge, GitBranch, InfoIcon, Layers } from "~/components/icons/lucide";
import { PricingMetricInstrument } from "~/features/core-pages/pricing-metric-instrument";
import { ScopeLedgerSignature } from "~/features/core-pages/signatures";
import { NumberedRail } from "~/features/core-pages/shared";
import { Prose, Reveal, SectionHead } from "~/features/services-v2/components/primitives";
import { SecondaryHero } from "~/features/services-v2/components/secondary-hero";
import {
  FinalCta,
  RelatedRail,
  ServiceCards,
  type RelatedLink,
} from "~/features/services-v2/components/sections";
import { TrustStrip } from "~/visual/home-v2/sections/trust-strip";

const HERO_METRICS = ["3.84x — Return on investment", "-77% — Reduction in admin time"];

const PRICING_METRICS = [
  "£16,800.00 — Annual direct cost savings",
  "3.84x — Return on investment",
  "-77% — Reduction in admin time",
  "10+ hours — Saved per person per month",
  "15 hours/week — Time saved",
];

const COVERAGE_CARDS = [
  {
    label: "Commercial definition",
    body: "Problem selection, baseline, first-release scope and the evidence needed to justify expansion.",
    icon: InfoIcon,
  },
  {
    label: "Experience and system design",
    body: "Customer journey, content, interface, workflow, data, permissions and fallbacks.",
    icon: Layers,
  },
  {
    label: "Implementation and assurance",
    body: "Engineering, configuration, testing, acceptance, security and launch control.",
    icon: Gauge,
  },
  {
    label: "Ownership and evolution",
    body: "Documentation, handover, monitoring, support, third-party usage and change.",
    icon: GitBranch,
  },
];

const ENGAGEMENT_SHAPES = [
  {
    title: "Strategic definition",
    body: "Current-state analysis, opportunity selection, roadmap, governance or solution direction.",
  },
  {
    title: "Focused first release",
    body: "A bounded workflow, website, application feature or customer journey with limited dependencies.",
  },
  {
    title: "Integrated programme",
    body: "Work spanning multiple journeys, systems, channels or disciplines.",
  },
  {
    title: "Ongoing evolution",
    body: "Monitoring, optimisation, support, new scope or continued product development.",
  },
];

const related: RelatedLink[] = [
  { href: "/services/ai-automation", label: "Service", title: "Automation" },
  { href: "/how-we-work", label: "Process", title: "Delivery framework" },
  { href: "/book", label: "Next step", title: "Discuss scope" },
];

export function PricingComposition() {
  return (
    <div className="ss-srv2 ss-core" data-core-route="/pricing">
      <SecondaryHero
        eyebrow="Investment by design"
        icon={Gauge}
        title="Bespoke investment, defined *after discovery*"
        titleId="core-pricing-title"
        lead="No generic packages, rate cards, budget bands or artificial anchors. Silverstone prices the problem, scope, risk and execution standard after discovery."
        points={[
          "No public price until the real scope is understood",
          "Third-party usage, integrations and support made visible",
          "Written proposals shaped around a defined first release",
        ]}
        primaryCtaLabel="Discuss scope and pricing"
        showcase={<ScopeLedgerSignature label="Investment by design" metrics={HERO_METRICS} />}
      />
      <TrustStrip />

      <section className="ss-srv2-section" aria-labelledby="pricing-rate-card">
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="Why there is no rate card"
            icon={InfoIcon}
            heading="A rate card works when the product is *fixed*"
            headingId="pricing-rate-card"
          />
          <Reveal kind="section">
            <Prose
              paragraphs={[
                "Silverstone's work is deliberately bespoke. The same label can describe a narrow workflow or a multi-channel operating system with integrations, data risk, escalation logic and support.",
                "One number would either conceal the real scope or shape the project around a price instead of the problem — so pricing follows discovery, not the other way round.",
              ]}
            />
          </Reveal>
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="pricing-covers">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="What the investment covers"
            icon={Layers}
            heading="Four components, *priced together*"
            headingId="pricing-covers"
          />
          <ServiceCards
            cards={COVERAGE_CARDS}
            icons={COVERAGE_CARDS.map((card) => card.icon)}
            columns={4}
          />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="pricing-proof">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Verified results"
            icon={Gauge}
            heading="What *disciplined scoping* delivers"
            headingId="pricing-proof"
            lead="Verified Silverstone AI results show why scope should be priced against commercial value and operating reality, not a generic menu."
          />
          <PricingMetricInstrument
            metrics={PRICING_METRICS}
            caption="Verified Silverstone AI results show why scope should be priced against commercial value and operating reality, not a generic menu."
            clarification="Results achieved through Silverstone AI systems. Outcomes vary by starting process, data quality, channel mix and implementation scope."
          />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="pricing-shapes">
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="Shapes an engagement can take"
            icon={GitBranch}
            heading="Four ways engagements are *structured*"
            headingId="pricing-shapes"
          />
          <NumberedRail items={ENGAGEMENT_SHAPES} />
        </div>
      </section>

      <section className="ss-srv2-section">
        <div className="ss-srv2__container" data-width="narrow">
          <FinalCta
            heading="Price the problem *properly*"
            body="A serious proposal makes deliverables, exclusions, assumptions, dependencies, client responsibilities, acceptance criteria, usage costs, support and change control visible."
            buttonLabel="Discuss scope and pricing"
            bookHref="/book"
          />
        </div>
      </section>

      <section className="ss-srv2-section">
        <div className="ss-srv2__container">
          <SectionHead eyebrow="Continue" heading="Where this connects next" />
          <RelatedRail links={related} />
        </div>
      </section>
    </div>
  );
}
