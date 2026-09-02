/**
 * /pricing — published investment bands, scope drivers and return.
 *
 * The page used to argue that no price could be published until after
 * discovery. It now publishes starting prices and typical bands for every
 * service family, and keeps the qualification where it belongs: a final
 * proposal still follows confirmed scope, integrations, risk, assurance and
 * support. Every figure lives in `../pricing/pricing-content` (and the FAQ in
 * `~/data/pricing-faq`, which the route's JSON-LD graph also reads) so there is
 * exactly one place to audit when commercial terms change.
 *
 * Secondary-hero feature: PricingModelOverviewSignature — a DOM instrument, not
 * an SVG diagram, so the headline prices are real selectable text.
 * Verified-results display keeps the custom PricingMetricInstrument: the only
 * page allowed a second results row, and only in its balanced 3-over-2 shape.
 */
import {
  Building2,
  Diamond,
  Gauge,
  Globe,
  Headset,
  InfoIcon,
  Layers,
  ShieldCheck,
  TrendingUp,
} from "~/components/icons/lucide";
import { PricingMetricInstrument } from "~/features/core-pages/pricing-metric-instrument";
import { BespokeEngagementCards } from "~/features/core-pages/pricing/bespoke-engagement-cards";
import { ImplementationBreakdown } from "~/features/core-pages/pricing/implementation-breakdown";
import { ImplementationPackages } from "~/features/core-pages/pricing/implementation-packages";
import { PricingFaq } from "~/features/core-pages/pricing/pricing-faq";
import { PricingModelOverviewSignature } from "~/features/core-pages/pricing/pricing-model-signature";
import { PricingValueModel } from "~/features/core-pages/pricing/pricing-value-model";
import { SupportRetainerGrid } from "~/features/core-pages/pricing/support-retainer-grid";
import { WebsitePricingBento } from "~/features/core-pages/pricing/website-pricing-bento";
import { VERIFIED_METRICS } from "~/features/core-pages/pricing/pricing-content";
import { CurrencyToggle } from "~/components/ui/currency-toggle";
import { money } from "~/data/currency";
import { SectionHead } from "~/features/services-v2/components/primitives";
import { SecondaryHero } from "~/features/services-v2/components/secondary-hero";
import {
  FinalCta,
  RelatedRail,
  type RelatedLink,
} from "~/features/services-v2/components/sections";
import { TrustStrip } from "~/visual/home-v2/sections/trust-strip";

const related: RelatedLink[] = [
  { href: "/services/ai-automation", label: "Service", title: "AI automation" },
  {
    href: "/services/web-design-development",
    label: "Service",
    title: "Web design & development",
  },
  {
    href: "/services/ai-consulting",
    label: "Service",
    title: "AI & automation consulting",
  },
  { href: "/services/app-development", label: "Service", title: "App development" },
  { href: "/how-we-work", label: "Process", title: "Delivery framework" },
  {
    href: "/book#booking-calendar",
    label: "Next step",
    title: "Book a discovery call",
  },
];

export function PricingComposition() {
  return (
    <div className="ss-srv2 ss-core ss-pri" data-core-route="/pricing">
      <SecondaryHero
        eyebrow="Transparent pricing"
        icon={Diamond}
        title="AI automation pricing for *small and mid-sized businesses*"
        titleId="core-pricing-title"
        lead={`Published bands for US and UK businesses, in the currency you choose: focused pilots from ${money("£3,000")}, most full implementations between ${money("£10,000")} and ${money("£25,000")}, and ongoing support from ${money("£350")} per month. Start with one workflow, prove the value, then scale.`}
        points={[
          "No hidden implementation costs",
          "ROI modeled before build",
          "24/7 support on Premium and Enterprise retainers",
        ]}
        primaryCtaLabel="Get a custom quote"
        primaryCtaHref="/contact#contact-form"
        secondaryCtaLabel="Book a consultation"
        secondaryCtaHref="/book#booking-calendar"
        showcase={<PricingModelOverviewSignature />}
      />
      <TrustStrip />

      <section className="ss-srv2-section" aria-labelledby="pricing-packages">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="AI systems implementation"
            icon={Layers}
            heading="Choose the right *first level* of implementation"
            headingId="pricing-packages"
            lead="Flexible pricing based on workflow scope, integrations, assurance and complexity. Begin with one valuable use case, prove it in operation, then expand with evidence."
          />
          {/* The hero instrument that carries the desktop toggle sits in the
              showcase panel, which phones do not render — so the packages
              section opens with its own control below that breakpoint. */}
          <div className="ss-pri-currency-inline">
            <CurrencyToggle context="pricing-inline" labeled tone="dark" />
            <p className="ss-pri-currency-inline__note">
              USD at fixed pairs, reviewed quarterly.
            </p>
          </div>
          <ImplementationPackages />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="pricing-breakdown">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="What shapes the investment"
            icon={Gauge}
            heading="Implementation pricing, *made understandable*"
            headingId="pricing-breakdown"
            lead="One-time implementation fees reflect project complexity, delivery scope, assurance requirements and the value the system is designed to create."
          />
          <ImplementationBreakdown />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="pricing-support">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Ongoing performance"
            icon={Headset}
            heading="Support that *protects the value* after launch"
            headingId="pricing-support"
            lead="Monthly retainers keep AI systems monitored, maintained and improving through structured support, optimization and enhancement."
          />
          <SupportRetainerGrid />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="pricing-value">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Commercial value"
            icon={TrendingUp}
            heading="Understanding the *value proposition*"
            headingId="pricing-value"
            lead="Pricing is scoped around the workflows, systems, risk controls and support needed to make automation commercially worthwhile. We model expected value before build, then track whether the workflow is delivering."
          />
          <PricingValueModel />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="pricing-proof">
        <div className="ss-srv2__container">
          <SectionHead
            /* The instrument below carries the full "Verified Silverstone AI
               performance" attribution on its own tag, so the eyebrow stays
               short rather than printing the same sentence twice. */
            eyebrow="Verified results"
            icon={ShieldCheck}
            heading="What *disciplined scoping* delivers"
            headingId="pricing-proof"
            lead="Different projects create value in different ways. The same discipline applies to each: establish the baseline, define the operating problem, measure the result and scale only when the evidence supports it."
          />
          <PricingMetricInstrument
            metrics={[...VERIFIED_METRICS]}
            caption="Documented figures from separate Silverstone AI engagements — app development, voice agents, receptionists and workflow automation — each measured against its own baseline rather than combined into a single client result."
            clarification="Results achieved through Silverstone AI systems. Outcomes vary by starting process, data quality, channel mix and implementation scope."
          />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="pricing-web">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Website investment"
            icon={Globe}
            heading="Website pricing shaped around *depth, not decoration*"
            headingId="pricing-web"
            lead="Clear build tiers based on page count, content depth, technical requirements and the number of journeys the website must support."
          />
          <WebsitePricingBento />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="pricing-bespoke">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Custom engagements"
            icon={Building2}
            heading="When scope matters more than a *published band*"
            headingId="pricing-bespoke"
          />
          <BespokeEngagementCards />
        </div>
      </section>

      <section
        className="ss-srv2-section ss-pri-faq-section"
        aria-labelledby="pricing-faq"
      >
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="Pricing questions"
            icon={InfoIcon}
            heading="Pricing *FAQ*"
            headingId="pricing-faq"
            lead="Common questions about pricing, contracts and what is included in your investment."
          />
          <PricingFaq />
        </div>
      </section>

      <section className="ss-srv2-section">
        <div className="ss-srv2__container" data-width="narrow">
          <FinalCta
            heading="Price the problem *properly*"
            body="A serious proposal makes scope, deliverables, exclusions, assumptions, dependencies, acceptance criteria, third-party costs, support and change control visible before work begins."
            buttonLabel="Discuss scope and pricing"
            bookHref="/book#booking-calendar"
          />
        </div>
      </section>

      <section className="ss-srv2-section">
        <div className="ss-srv2__container">
          <SectionHead eyebrow="Continue" heading="Where this *connects next*" />
          <RelatedRail links={related} />
        </div>
      </section>
    </div>
  );
}
