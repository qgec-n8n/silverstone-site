/**
 * AI Automation — bespoke composition.
 * Visual concept: Operational Orchestration Lattice.
 */
import type { CSSProperties } from "react";

import type { ApprovedServiceContent } from "~/content/services/approved-services";
import {
  Bot,
  Database,
  Gauge,
  GitBranch,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  TriangleAlertIcon,
  UserCheck,
} from "~/components/icons/lucide";

import { Prose, Reveal, RichText, SectionHead } from "../components/primitives";
import { SecondaryHero } from "../components/secondary-hero";
import {
  BenchmarkConsole,
  FaqPanel,
  FinalCta,
  ProcessTrack,
  RelatedRail,
  ServiceCards,
  ServiceFigure,
  type RelatedLink,
} from "../components/sections";
import { TrustStrip } from "~/visual/home-v2/sections/trust-strip";
import { OrchestrationLattice } from "../signatures/orchestration-lattice";
import { aiAutomationCopy } from "../content/copy";
import type { RouteArt } from "../content/route-art";

const featureIcons = [GitBranch, Bot, Database, ShieldCheck];
const outcomeIcons = [UserCheck, Gauge, TrendingUp];

const related: RelatedLink[] = [
  {
    href: "/services/ai-consulting",
    label: "Related service",
    title: "AI & Automation Consulting",
  },
  {
    href: "/services/app-development",
    label: "Related service",
    title: "App Development",
  },
  { href: "/how-we-work", label: "Process", title: "How We Work" },
];

export function AiAutomationComposition({
  content,
  art,
}: {
  content: ApprovedServiceContent;
  art: RouteArt;
}) {
  const copy = aiAutomationCopy;
  const micro = content.componentMicrocopy;
  const accentStyle = {
    "--srv2-accent": art.accentFrom,
    "--srv2-accent-2": art.accentTo,
  } as CSSProperties;

  const faqItems = copy.faqs.items.map((item) => ({
    label: item.q,
    question: item.q,
    answer: [item.a],
  }));

  return (
    <div className="ss-srv2" data-variant={art.variant} style={accentStyle}>
      <SecondaryHero
        eyebrow={copy.eyebrow}
        icon={GitBranch}
        title={copy.h1}
        titleId="srv2-lead"
        lead={copy.heroSub}
        points={copy.heroPoints}
        primaryCtaLabel={micro.ctaButton}
        showcase={<OrchestrationLattice />}
      />
      <TrustStrip />

      <section className="ss-srv2-section" aria-labelledby="srv2-problem">
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="The problem"
            icon={art.icon}
            heading={copy.problem.heading}
            headingId="srv2-problem"
          />
          <Reveal kind="section">
            <Prose paragraphs={[copy.problem.body]} />
          </Reveal>
          <Reveal kind="section" delayMs={90}>
            <ul className="ss-srv2-checklist" data-tone="warn">
              {copy.problem.painPoints.map((point) => (
                <li key={point}>
                  <TriangleAlertIcon aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="srv2-outcome">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="The outcome"
            icon={Sparkles}
            heading={copy.outcome.heading}
            headingId="srv2-outcome"
            lead={copy.outcome.body}
          />
          <ServiceCards cards={micro.outcomeCards} icons={outcomeIcons} columns={3} />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="srv2-capabilities">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="What you receive"
            icon={GitBranch}
            heading={copy.capabilities.heading}
            headingId="srv2-capabilities"
            lead={copy.capabilities.lead}
          />
          <ServiceCards cards={micro.featureCards} icons={featureIcons} columns={4} />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="srv2-different">
        <div className="ss-srv2__container">
          <div className="ss-srv2-split">
            <SectionHead
              eyebrow="Why Silverstone"
              icon={Sparkles}
              heading={copy.differentiator.heading}
              headingId="srv2-different"
              lead={copy.differentiator.body}
            />
            <Reveal kind="image">
              <ServiceFigure image={art.image} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="srv2-proof">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Proof"
            icon={TrendingUp}
            heading={copy.proof.heading}
            headingId="srv2-proof"
          />
          <BenchmarkConsole
            metrics={micro.benchmark.metrics}
            caption={copy.proof.lead}
            attribution={copy.proof.attribution}
            clarification={copy.proof.clarification}
          />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="srv2-process">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Delivery"
            icon={Gauge}
            heading={copy.process.heading}
            headingId="srv2-process"
            lead={copy.process.lead}
          />
          <ProcessTrack steps={micro.processSteps} />
        </div>
      </section>

      <section className="ss-srv2-section">
        <div className="ss-srv2__container" data-width="narrow">
          <FinalCta
            heading={copy.midCta.heading}
            body={<RichText text={copy.midCta.body} />}
            buttonLabel={micro.ctaButton}
          />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="srv2-faq">
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="Questions"
            heading={copy.faqs.heading}
            headingId="srv2-faq"
          />
          <FaqPanel items={faqItems} />
        </div>
      </section>

      <section className="ss-srv2-section">
        <div className="ss-srv2__container" data-width="narrow">
          <FinalCta
            heading={copy.finalCta.heading}
            body={<RichText text={copy.finalCta.body} />}
            reassurance={copy.finalCta.urgency}
            buttonLabel={micro.ctaButton}
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
