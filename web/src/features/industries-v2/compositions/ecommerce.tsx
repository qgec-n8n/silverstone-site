/**
 * eCommerce Brands — custom composition.
 * Visual concept: Order-State Conveyor — state and authority made visible.
 * The state journey leads; support/returns/retention workflows follow as a
 * four-up grid; the boundary console lands before proof (policy control IS
 * the proposition); all three generated commerce images feature in a
 * full-width gallery run.
 */
import type { CSSProperties } from "react";

import {
  Bot,
  ClipboardCheck,
  Database,
  Inbox,
  Layers,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
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
import { OrderConveyor } from "../signatures/order-conveyor";
import type { IndustryCopy } from "../content/types";
import type { IndustryArt } from "../content/route-art";
import { formatMetrics, toCards, toFaqItems } from "./shared";

const painIcons = [Database, ShieldCheck, Star, Layers];
const workflowIcons = [Bot, Inbox, ClipboardCheck, Star];

export function EcommerceComposition({
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
    <div className="ss-srv2 ss-ind2" data-industry="ecommerce" style={accentStyle}>
      <SecondaryHero
        eyebrow={copy.eyebrow}
        icon={ShoppingBag}
        title={copy.h1}
        titleId="ind2-lead"
        lead={copy.heroSub}
        points={copy.heroPoints}
        primaryCtaLabel={copy.finalCta.buttonLabel}
        secondaryCtaLabel="See verified results"
        secondaryCtaHref="/industry/ecommerce#ind2-proof"
        showcase={
          <OrderConveyor label={art.discipline} metrics={metrics.slice(0, 2)} />
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
            eyebrow="Operational debt"
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
            eyebrow="State before answers"
            icon={Database}
            heading={copy.journey.heading}
            headingId="ind2-journey"
            lead={copy.journey.lead}
          />
          <JourneyRail stages={copy.journey.stages} />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-boundary">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Exception control"
            icon={UserCheck}
            heading={copy.boundary.heading}
            headingId="ind2-boundary"
          />
          <BoundaryPanel
            body={copy.boundary.body}
            keeps={copy.boundary.keeps}
            keepsLabel="Owned by your team, always"
          />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-workflows">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="The journeys"
            icon={Bot}
            heading={copy.workflows.heading}
            headingId="ind2-workflows"
            lead={copy.workflows.lead}
          />
          <WorkflowCards items={copy.workflows.items} icons={workflowIcons} />
        </div>
      </section>

      <section
        className="ss-srv2-section"
        aria-label="Illustrative commerce operations"
      >
        <div className="ss-srv2__container">
          <Reveal kind="image">
            <IndustryFigure image={art.primary} />
          </Reveal>
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

      <section className="ss-srv2-section" aria-labelledby="ind2-services">
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="Architecture first"
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
            eyebrow="First release"
            icon={Layers}
            heading={copy.process.heading}
            headingId="ind2-process"
            lead={copy.process.lead}
          />
          <ProcessTrack steps={toCards(copy.process.steps)} />
        </div>
      </section>

      <section
        className="ss-srv2-section"
        aria-label="Illustrative returns and retention flows"
      >
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
