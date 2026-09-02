/**
 * /about — premium studio narrative.
 * Secondary-hero feature: StudioOrbitSignature, six disciplines on a slow
 * orbit ring around a fixed Silverstone center mark (built for this page
 * only).
 */
import {
  Bot,
  CheckCircle2Icon,
  Database,
  FileText,
  Layers,
  Sparkles,
  Target,
  Workflow,
} from "~/components/icons/lucide";
import { StudioOrbitSignature } from "~/features/core-pages/signatures";
import { coreSectionStyle, NumberedRail } from "~/features/core-pages/shared";
import {
  BorderBeam,
  PanelReveal,
  Prose,
  Reveal,
  SectionHead,
} from "~/features/services-v2/components/primitives";
import { SecondaryHero } from "~/features/services-v2/components/secondary-hero";
import {
  FinalCta,
  RelatedRail,
  ServiceCards,
  ServiceFigure,
  type RelatedLink,
} from "~/features/services-v2/components/sections";
import { TrustStrip } from "~/visual/home-v2/sections/trust-strip";

const DISCIPLINE_CARDS = [
  {
    label: "Strategy",
    body: "Define the *commercial problem*, first release and evidence required to justify expansion.",
    icon: Target,
  },
  {
    label: "Copy",
    body: "Give propositions, interfaces and journeys *language precise enough* to reduce uncertainty, in the vocabulary of the reader's own market.",
    icon: FileText,
  },
  {
    label: "Design",
    body: "Shape experiences that feel *clear, intentional* and appropriate to the standard of the business.",
    icon: Sparkles,
  },
  {
    label: "Engineering",
    body: "Build *maintainable products*, integrations and interfaces around defined acceptance criteria.",
    icon: Database,
  },
  {
    label: "AI",
    body: "Use models where interpretation, conversation or generation creates *genuine value* and clear review.",
    icon: Bot,
  },
  {
    label: "Automation",
    body: "Connect data, actions, approvals and handoffs while *keeping exceptions visible*.",
    icon: Workflow,
  },
];

const PROOF_PRINCIPLES = [
  {
    title: "Evidence before claim",
    body: "Client outcomes, benchmarks, demonstrations and methods are treated as *different classes of proof*, never blended into one.",
  },
  {
    title: "Operating reality before novelty",
    body: "A concept only matters once it fits *the people, data and systems* that must sustain it after launch.",
  },
  {
    title: "Quality before unnecessary scale",
    body: "Channels, features and agents must *earn their place* in the first release, not arrive by default.",
  },
  {
    title: "Maintainability before dependency",
    body: "Accounts, prompts, code, documentation and decisions cannot disappear into an *opaque, unowned model*.",
  },
];

const related: RelatedLink[] = [
  { href: "/services", label: "Services", title: "What we build" },
  { href: "/how-we-work", label: "Method", title: "How we work" },
  { href: "/blog", label: "Thinking", title: "Insights" },
];

export function AboutComposition() {
  return (
    <div className="ss-srv2 ss-core" data-core-route="/about">
      <SecondaryHero
        eyebrow="The Silverstone standard"
        icon={Sparkles}
        title="A premium technology partner built around *better judgment*"
        titleId="core-about-title"
        lead="Silverstone AI is an AI systems studio in London that builds AI receptionists, voice agents, automation, websites and apps for businesses in the US and the UK. Six disciplines, one line of accountability."
        points={[
          { icon: Layers, text: "Six disciplines, one line of accountability" },
          { icon: Sparkles, text: "A London studio with US and UK clients" },
          {
            icon: CheckCircle2Icon,
            text: "A team trained at Yale, Princeton and the University of Texas",
          },
        ]}
        primaryCtaLabel="Book a discovery call"
        secondaryCtaLabel="See how we deliver"
        secondaryCtaHref="/how-we-work#hww-route"
        showcase={<StudioOrbitSignature label="The Silverstone standard" />}
      />
      <TrustStrip />

      <section
        className="ss-srv2-section"
        aria-labelledby="about-disciplines"
        style={coreSectionStyle(0)}
      >
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="One accountable system"
            icon={Layers}
            heading="Six disciplines, one line of *accountability*"
            headingId="about-disciplines"
            lead="Capability across six disciplines is common. What's rare is applying the restraint to use each one only where it belongs. Silverstone AI's team trained at Yale, Princeton and the University of Texas, works from a London studio with US-based members, and serves clients on both sides of the Atlantic from one system."
          />
          <ServiceCards
            cards={DISCIPLINE_CARDS}
            icons={DISCIPLINE_CARDS.map((card) => card.icon)}
            columns={3}
          />
        </div>
      </section>

      <section
        className="ss-srv2-section"
        aria-labelledby="about-premium"
        style={coreSectionStyle(1)}
      >
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="What premium means here"
            icon={CheckCircle2Icon}
            heading="Premium is a standard of *attention*"
            headingId="about-premium"
          />
          <PanelReveal className="ss-core-split ss-core-split--framed ss-srv2-beam-border">
            <Reveal kind="section">
              <Prose
                paragraphs={[
                  "Premium does not mean adding complexity or withholding clarity. It means treating *the important details as important*.",
                  "Assumptions, dependencies, exclusions, third-party costs and human responsibilities are made visible before they can become points of dispute, the same standard of attention behind every engagement, at any scale, in Dallas or in Manchester.",
                ]}
              />
            </Reveal>
            <Reveal kind="image">
              <ServiceFigure
                image={{
                  desktop: "/approved-images/about-standard.png",
                  mobile: "/approved-images/about-standard-mobile.png",
                  alt: "Illustrative engagement-ledger panel — assumptions, dependencies and ownership made visible — in a Silverstone studio scene overlooking London at night.",
                  width: 2528,
                  height: 1696,
                }}
              />
            </Reveal>
            <BorderBeam />
          </PanelReveal>
        </div>
      </section>

      <section
        className="ss-srv2-section"
        aria-labelledby="about-proof"
        style={coreSectionStyle(2)}
      >
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="Proof without theatre"
            icon={CheckCircle2Icon}
            heading="Four principles that shape *every engagement*"
            headingId="about-proof"
          />
          <NumberedRail items={PROOF_PRINCIPLES} />
        </div>
      </section>

      <section className="ss-srv2-section" style={coreSectionStyle(3)}>
        <div className="ss-srv2__container" data-width="narrow">
          <FinalCta
            heading="See the judgment become a *working system*"
            body="The clearest way to understand Silverstone AI is to examine how the work is diagnosed, scoped, designed, tested and handed over."
            buttonLabel="Explore the delivery framework"
            bookHref="/how-we-work"
          />
        </div>
      </section>

      <section className="ss-srv2-section" style={coreSectionStyle(4)}>
        <div className="ss-srv2__container">
          <SectionHead eyebrow="Continue" heading="Where this *connects next*" />
          <RelatedRail links={related} />
        </div>
      </section>
    </div>
  );
}
