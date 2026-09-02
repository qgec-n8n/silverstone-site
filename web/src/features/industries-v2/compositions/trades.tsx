/**
 * Trades & Home Services — custom composition.
 * Visual concept: Job-Intake Dispatch Board — the board being worked. Proof
 * lands immediately after the journey (response speed is the pitch); the
 * office-to-field imagery splits beside quote workflows; boundary and fit
 * close before the FAQ.
 */
import type { CSSProperties } from "react";

import {
  Clock,
  FileText,
  Inbox,
  MapPin,
  PhoneCall,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Wrench,
  Zap,
  Globe,
} from "~/components/icons/lucide";
import { TrustStrip } from "~/visual/home-v2/sections/trust-strip";

import {
  BorderBeam,
  Prose,
  Reveal,
  SectionHead,
} from "~/features/services-v2/components/primitives";
import { SecondaryHero } from "~/features/services-v2/components/secondary-hero";
import {
  BenchmarkConsole,
  FaqPanel,
  FinalCta,
  ProcessTrack,
  RelatedRail,
  ServiceCards,
} from "~/features/services-v2/components/sections";

import {
  BoundaryPanel,
  FitPanel,
  ImageDuo,
  IndustryFigure,
  JourneyRail,
  LinkedProse,
  LinkedText,
  MarketLanes,
  TrustTokens,
  WorkflowCards,
} from "../components/industry-sections";
import { DispatchBoard } from "../signatures/dispatch-board";
import type { IndustryCopy } from "../content/types";
import type { IndustryArt } from "../content/route-art";
import { formatMetrics, toCards, toFaqItems } from "./shared";

const painIcons = [PhoneCall, MapPin, FileText, Inbox];
const workflowIcons = [FileText, TrendingUp, Clock, Zap];

export function TradesComposition({
  copy,
  art,
}: {
  copy: IndustryCopy;
  art: IndustryArt;
}) {
  const accentStyle = {
    "--srv2-accent": art.accentFrom,
    "--srv2-accent-2": art.accentTo,
  } as CSSProperties;
  const metrics = formatMetrics(copy.proof.metrics);

  return (
    <div className="ss-srv2 ss-ind2" data-industry="trades" style={accentStyle}>
      <SecondaryHero
        eyebrow={copy.eyebrow}
        icon={Wrench}
        title={copy.h1}
        titleId="ind2-lead"
        lead={copy.heroSub}
        points={copy.heroPoints}
        primaryCtaLabel={copy.finalCta.buttonLabel}
        secondaryCtaLabel="Hear the live demo"
        secondaryCtaHref="/services/ai-receptionists#demo-ai-receptionists"
        showcase={
          <DispatchBoard label={art.discipline} metrics={metrics.slice(0, 2)} />
        }
      />
      <TrustStrip />
      <TrustTokens tokens={copy.trustTokens} />

      <section className="ss-srv2-section" aria-labelledby="ind2-markets">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow={copy.markets.eyebrow}
            icon={Globe}
            heading={copy.markets.heading}
            headingId="ind2-markets"
            lead={copy.markets.lead}
          />
          <MarketLanes markets={copy.markets} />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-problem">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Field reality"
            icon={art.icon}
            heading={copy.problem.heading}
            headingId="ind2-problem"
          />
          <div className="ss-ind2-problem-panel ss-srv2-beam-border">
            <Reveal kind="section">
              <Prose paragraphs={[copy.problem.body]} />
            </Reveal>
            <ServiceCards
              cards={toCards(copy.problem.cards)}
              icons={painIcons}
              columns={4}
            />
            <BorderBeam />
          </div>
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-journey">
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="Missed call to job brief"
            icon={Inbox}
            heading={copy.journey.heading}
            headingId="ind2-journey"
            lead={copy.journey.lead}
          />
          <JourneyRail stages={copy.journey.stages} />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-proof">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Verified results"
            icon={TrendingUp}
            heading={copy.proof.heading}
            headingId="ind2-proof"
          />
          <BenchmarkConsole
            metrics={metrics}
            caption={copy.proof.lead}
            attribution={copy.proof.attribution}
            clarification={copy.proof.clarification}
          />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-workflows">
        <div className="ss-srv2__container">
          <div className="ss-srv2-split">
            <div>
              <SectionHead
                eyebrow="Quotes to cash"
                icon={FileText}
                heading={copy.workflows.heading}
                headingId="ind2-workflows"
                lead={copy.workflows.lead}
              />
            </div>
            <Reveal kind="image">
              <IndustryFigure image={art.primary} />
            </Reveal>
          </div>
          <WorkflowCards items={copy.workflows.items} icons={workflowIcons} />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-boundary">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Controlled commitments"
            icon={UserCheck}
            heading={copy.boundary.heading}
            headingId="ind2-boundary"
          />
          <BoundaryPanel
            body={copy.boundary.body}
            keeps={copy.boundary.keeps}
            keepsLabel="Committed by people, always"
          />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-services">
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="The system"
            icon={Sparkles}
            heading={copy.services.heading}
            headingId="ind2-services"
            lead={copy.services.lead}
          />
          <LinkedProse paragraphs={copy.services.paragraphs} />
        </div>
      </section>

      <section className="ss-srv2-section">
        <div className="ss-srv2__container" data-width="narrow">
          <FinalCta
            heading={copy.midCta.heading}
            body={<LinkedText text={copy.midCta.body} />}
            buttonLabel={copy.midCta.buttonLabel}
          />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-process">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="How it gets built"
            icon={Users}
            heading={copy.process.heading}
            headingId="ind2-process"
            lead={copy.process.lead}
          />
          <ProcessTrack steps={toCards(copy.process.steps)} />
        </div>
      </section>

      <section className="ss-srv2-section" aria-label="Illustrative job workflows">
        <div className="ss-srv2__container">
          <ImageDuo images={art.gallery} />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-fit">
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="Fit"
            icon={UserCheck}
            heading={copy.fit.heading}
            headingId="ind2-fit"
            lead={copy.fit.lead}
          />
          <FitPanel right={copy.fit.right} caution={copy.fit.caution} />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-faq">
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="Questions"
            heading={copy.faqs.heading}
            headingId="ind2-faq"
          />
          <FaqPanel items={toFaqItems(copy.faqs.items)} />
        </div>
      </section>

      <section className="ss-srv2-section">
        <div className="ss-srv2__container" data-width="narrow">
          <FinalCta
            heading={copy.finalCta.heading}
            body={<LinkedText text={copy.finalCta.body} />}
            reassurance={copy.finalCta.reassurance}
            buttonLabel={copy.finalCta.buttonLabel}
          />
        </div>
      </section>

      <section className="ss-srv2-section">
        <div className="ss-srv2__container">
          <SectionHead eyebrow="Continue" heading="Where this *connects next*" />
          <RelatedRail links={copy.related} />
        </div>
      </section>
    </div>
  );
}
