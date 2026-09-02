/**
 * Gyms & Fitness Studios — custom composition.
 * Visual concept: Member Pulse Grid — attendance as a living heat-map. The
 * workflows grid lands before the journey (operators think in systems), the
 * club imagery splits beside the front-desk story, and audience proof closes
 * with its honest interpretation.
 */
import type { CSSProperties } from "react";

import {
  BellRing,
  CalendarClock,
  Dumbbell,
  Inbox,
  MapPin,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  Users,
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
import { MemberPulse } from "../signatures/member-pulse";
import type { IndustryCopy } from "../content/types";
import type { IndustryArt } from "../content/route-art";
import { formatMetrics, toCards, toFaqItems } from "./shared";

const painIcons = [Inbox, CalendarClock, Users, BellRing];
const workflowIcons = [MapPin, Users, CalendarClock, Star];

export function GymsFitnessStudiosComposition({
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
      data-industry="gyms-fitness-studios"
      style={accentStyle}
    >
      <SecondaryHero
        eyebrow={copy.eyebrow}
        icon={Dumbbell}
        title={copy.h1}
        titleId="ind2-lead"
        lead={copy.heroSub}
        points={copy.heroPoints}
        primaryCtaLabel={copy.finalCta.buttonLabel}
        secondaryCtaLabel="Hear the live demo"
        secondaryCtaHref="/services/ai-receptionists#demo-ai-receptionists"
        showcase={<MemberPulse label={art.discipline} metrics={metrics.slice(0, 2)} />}
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
            eyebrow="Demand between systems"
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

      <section className="ss-srv2-section" aria-labelledby="ind2-workflows">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Member-context systems"
            icon={Users}
            heading={copy.workflows.heading}
            headingId="ind2-workflows"
            lead={copy.workflows.lead}
          />
          <WorkflowCards items={copy.workflows.items} icons={workflowIcons} />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-journey">
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="The trial journey"
            icon={CalendarClock}
            heading={copy.journey.heading}
            headingId="ind2-journey"
            lead={copy.journey.lead}
          />
          <JourneyRail stages={copy.journey.stages} />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-services">
        <div className="ss-srv2__container">
          <div className="ss-srv2-split">
            <div>
              <SectionHead
                eyebrow="Operable by the front desk"
                icon={Sparkles}
                heading={copy.services.heading}
                headingId="ind2-services"
                lead={copy.services.lead}
              />
              <LinkedProse paragraphs={copy.services.paragraphs} />
            </div>
            <Reveal kind="image">
              <IndustryFigure image={art.primary} />
            </Reveal>
          </div>
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

      <section className="ss-srv2-section" aria-labelledby="ind2-boundary">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Duty of care"
            icon={UserCheck}
            heading={copy.boundary.heading}
            headingId="ind2-boundary"
          />
          <BoundaryPanel
            body={copy.boundary.body}
            keeps={copy.boundary.keeps}
            keepsLabel="With your staff, always"
          />
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
            eyebrow="One journey first"
            icon={Users}
            heading={copy.process.heading}
            headingId="ind2-process"
            lead={copy.process.lead}
          />
          <ProcessTrack steps={toCards(copy.process.steps)} />
        </div>
      </section>

      <section className="ss-srv2-section" aria-label="Illustrative member journeys">
        <div className="ss-srv2__container">
          <ImageDuo images={art.gallery} />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-fit">
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="Readiness"
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
