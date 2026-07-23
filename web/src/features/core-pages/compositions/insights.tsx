/**
 * /blog — Insights hub: a searchable, filterable knowledge index, not a
 * generic set of service cards.
 * Secondary-hero feature: EditorialIndexSignature, a ranked index of topic
 * rows with a reading-progress rail (built for this page only).
 */
import { FileText, Layers, Search, ShieldCheck } from "~/components/icons/lucide";
import { FeaturedInsights } from "~/features/core-pages/featured-insights";
import { EditorialIndexSignature } from "~/features/core-pages/signatures";
import { InsightsBoard } from "~/features/core-pages/insights-board";
import { CoreCardGrid, type CoreCard } from "~/features/core-pages/shared";
import { SectionHead } from "~/features/services-v2/components/primitives";
import { SecondaryHero } from "~/features/services-v2/components/secondary-hero";
import {
  FinalCta,
  RelatedRail,
  type RelatedLink,
} from "~/features/services-v2/components/sections";
import { TrustStrip } from "~/visual/home-v2/sections/trust-strip";

const HERO_METRICS = [
  "3x → 20x — SEO and PPC ROI",
  "17% → 46% — Lead-to-patient conversion",
];

const TOPIC_CARDS: CoreCard[] = [
  {
    href: "/services/ai-consulting",
    title: "AI strategy",
    body: "Roadmaps, provider selection and opportunity audits.",
    icon: Layers,
  },
  {
    href: "/services/ai-receptionists",
    title: "AI receptionists",
    body: "Enquiry handling, booking, escalation and operating rules.",
    icon: Layers,
  },
  {
    href: "/services/ai-voice-agents",
    title: "Voice agents",
    body: "Latency, consent, call flows and human takeover.",
    icon: Layers,
  },
  {
    href: "/services/web-design-development",
    title: "Web and conversion",
    body: "Information architecture, forms, performance and measurement.",
    icon: Layers,
  },
  {
    href: "/services/app-development",
    title: "Apps and products",
    body: "First-release strategy for maintainable internal and customer tools.",
    icon: Layers,
  },
  {
    href: "/industry",
    title: "Industry applications",
    body: "Sector-specific systems for nine UK operating realities.",
    icon: Layers,
  },
];

const related: RelatedLink[] = [
  { href: "/services", label: "Services", title: "Service architecture" },
  { href: "/how-we-work", label: "Process", title: "Delivery framework" },
  { href: "/pricing", label: "Commercial", title: "Investment model" },
];

export function InsightsComposition() {
  return (
    <div className="ss-srv2 ss-core" data-core-route="/blog">
      <SecondaryHero
        eyebrow="Silverstone Intelligence"
        icon={FileText}
        title="Intelligence for *better* technology decisions"
        titleId="core-insights-title"
        lead="A searchable library of practical guides, organised by the services and industries we build for — find the topic behind your next decision."
        points={[
          { icon: Search, text: "Search and filter every guide by service or sector" },
          {
            icon: ShieldCheck,
            text: "Featured: the three newest intelligence briefings",
          },
          {
            icon: Layers,
            text: "Jump-off points into services, pricing and discovery",
          },
        ]}
        primaryCtaLabel="Open the Insights library"
        primaryCtaHref="/blog#insights-index"
        secondaryCtaLabel="Book a discovery call"
        secondaryCtaHref="/book#booking-calendar"
        showcase={
          <EditorialIndexSignature
            label="Silverstone Intelligence"
            metrics={HERO_METRICS}
          />
        }
      />
      <TrustStrip />

      <FeaturedInsights />

      <section className="ss-srv2-section" aria-labelledby="insights-index">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Find the right topic"
            icon={FileText}
            heading="Search or filter by *service and industry*"
            headingId="insights-index"
            lead="Every planned guide is tagged against the same 16-category system used across Services and Industries, so the right topic is never more than a search away."
          />
          <InsightsBoard />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="insights-explore">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Explore by discipline"
            icon={Layers}
            heading="Jump straight to a *service or sector*"
            headingId="insights-explore"
          />
          <CoreCardGrid cards={TOPIC_CARDS} />
        </div>
      </section>

      <section className="ss-srv2-section">
        <div className="ss-srv2__container" data-width="narrow">
          <FinalCta
            heading="Turn research into *a decision*"
            body="Use the library to sharpen the decision, then move to the route that can turn it into a controlled system."
            buttonLabel="Book a discovery call"
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
