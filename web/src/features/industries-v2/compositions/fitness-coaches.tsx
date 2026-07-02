/**
 * Fitness Coaches — bespoke composition.
 * Visual concept: DM-to-Consultation Funnel — the personal service protected
 * by a disciplined journey. The coach imagery leads beside the problem; the
 * mid-page CTA arrives early (coaches decide fast); proof sits near the close
 * as campaign evidence.
 */
import type { CSSProperties } from "react";

import {
  CalendarClock,
  ClipboardCheck,
  Inbox,
  MessageSquare,
  Send,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  Users,
} from "~/components/icons/lucide";
import { TrustStrip } from "~/visual/home-v2/sections/trust-strip";

import {
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
  TrustTokens,
  WorkflowCards,
} from "../components/industry-sections";
import { DmFunnel } from "../signatures/dm-funnel";
import type { IndustryCopy } from "../content/types";
import type { IndustryArt } from "../content/route-art";
import { formatMetrics, toCards, toFaqItems } from "./shared";

const painIcons = [MessageSquare, CalendarClock, ClipboardCheck, Star];
const workflowIcons = [ClipboardCheck, Inbox, Send, TrendingUp];

export function FitnessCoachesComposition({
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
    <div
      className="ss-srv2 ss-ind2"
      data-industry="fitness-coaches"
      style={accentStyle}
    >
      <SecondaryHero
        eyebrow={copy.eyebrow}
        icon={Send}
        title={copy.h1}
        titleId="ind2-lead"
        lead={copy.heroSub}
        points={copy.heroPoints}
        primaryCtaLabel={copy.finalCta.buttonLabel}
        showcase={<DmFunnel label={art.discipline} metrics={metrics.slice(0, 2)} />}
      />
      <TrustStrip />
      <TrustTokens tokens={copy.trustTokens} />

      <section className="ss-srv2-section" aria-labelledby="ind2-problem">
        <div className="ss-srv2__container">
          <div className="ss-srv2-split">
            <div>
              <SectionHead
                eyebrow="Between conversations"
                icon={art.icon}
                heading={copy.problem.heading}
                headingId="ind2-problem"
              />
              <Reveal kind="section">
                <Prose paragraphs={[copy.problem.body]} />
              </Reveal>
            </div>
            <Reveal kind="image">
              <IndustryFigure image={art.primary} />
            </Reveal>
          </div>
          <ServiceCards
            cards={toCards(copy.problem.cards)}
            icons={painIcons}
            columns={4}
          />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-journey">
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="The lead journey"
            icon={Send}
            heading={copy.journey.heading}
            headingId="ind2-journey"
            lead={copy.journey.lead}
          />
          <JourneyRail stages={copy.journey.stages} />
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

      <section className="ss-srv2-section" aria-labelledby="ind2-workflows">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Behind the service"
            icon={ClipboardCheck}
            heading={copy.workflows.heading}
            headingId="ind2-workflows"
            lead={copy.workflows.lead}
          />
          <WorkflowCards items={copy.workflows.items} icons={workflowIcons} />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-boundary">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="The coach decides"
            icon={UserCheck}
            heading={copy.boundary.heading}
            headingId="ind2-boundary"
          />
          <BoundaryPanel
            body={copy.boundary.body}
            keeps={copy.boundary.keeps}
            keepsLabel="With the coach, always"
          />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-services">
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="One source of truth"
            icon={Sparkles}
            heading={copy.services.heading}
            headingId="ind2-services"
            lead={copy.services.lead}
          />
          <LinkedProse paragraphs={copy.services.paragraphs} />
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

      <section className="ss-srv2-section" aria-labelledby="ind2-process">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Smallest useful system"
            icon={Users}
            heading={copy.process.heading}
            headingId="ind2-process"
            lead={copy.process.lead}
          />
          <ProcessTrack steps={toCards(copy.process.steps)} />
        </div>
      </section>

      <section className="ss-srv2-section" aria-label="Illustrative coaching workflows">
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
          <SectionHead eyebrow="Continue" heading="Where this connects next" />
          <RelatedRail links={copy.related} />
        </div>
      </section>
    </div>
  );
}
