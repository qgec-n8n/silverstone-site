/**
 * AI Receptionists — bespoke composition.
 * Visual concept: Front-Desk Convergence.
 */
import type { CSSProperties } from "react";

import type { ApprovedServiceContent } from "~/content/services/approved-services";
import {
  CalendarCheck,
  Gauge,
  Headset,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
} from "~/components/icons/lucide";

import {
  Prose,
  Reveal,
  RichText,
  SectionHead,
  WarningChecklist,
} from "../components/primitives";
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
import { ReceptionistDemo } from "../demos/receptionist-demo";
import { FrontDeskConvergence } from "../signatures/front-desk-convergence";
import { aiReceptionistsCopy } from "../content/copy";
import type { RouteArt } from "../content/route-art";

const featureIcons = [Headset, MessageSquare, CalendarCheck, ShieldCheck];
const outcomeIcons = [UserCheck, CalendarCheck, TrendingUp];

const related: RelatedLink[] = [
  {
    href: "/services/ai-voice-agents",
    label: "Related service",
    title: "AI Voice Agents",
  },
  { href: "/services/ai-automation", label: "Related service", title: "AI Automation" },
  { href: "/how-we-work", label: "Process", title: "How We Work" },
];

export function AiReceptionistsComposition({
  content,
  art,
}: {
  content: ApprovedServiceContent;
  art: RouteArt;
}) {
  const copy = aiReceptionistsCopy;
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
        icon={Headset}
        title={copy.h1}
        titleId="srv2-lead"
        lead={copy.heroSub}
        points={copy.heroPoints}
        primaryCtaLabel={micro.ctaButton}
        showcase={
          <FrontDeskConvergence
            label={art.discipline}
            metrics={micro.benchmark.metrics.slice(0, 2)}
          />
        }
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
          <WarningChecklist points={copy.problem.painPoints} />
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
            icon={Headset}
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

      <section
        className="ss-srv2-section"
        id="demo-ai-receptionists"
        aria-labelledby="srv2-showcase"
      >
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Live surfaces"
            icon={Headset}
            heading="See the two sides of a modern *front desk*"
            headingId="srv2-showcase"
            lead="This section reserves a future AI chat window and an ElevenLabs-ready call feature. They show how the same approved intake rules can be adapted across written and spoken channels while preserving booking, routing and human escalation."
          />
          <ReceptionistDemo />
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
          <SectionHead eyebrow="Continue" heading="Where this *connects next*" />
          <RelatedRail links={related} />
        </div>
      </section>
    </div>
  );
}
