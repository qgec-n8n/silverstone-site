/**
 * Skin & Aesthetic Clinics — custom composition.
 *
 * Visual concept: Consultation Ladder — an inquiry climbing from any channel
 * to a deposit-secured consultation, through a compliance filter and under a
 * prescriber gate.
 *
 * Ordering differs from its siblings on purpose. This page is the sector's
 * landing page, so evidence and conversion come first: the live Aesthetics by
 * Clouds build is EMBEDDED near the top — a visitor can browse a real clinic
 * site we built without leaving the page — then the
 * revenue-critical workflows and verified results precede the architectural
 * detail. The booking architecture, boundary and process sections then carry
 * the depth a clinician needs before a call.
 *
 * It also carries the live Seven-Day Booking Conversion Sprint, so the CTA
 * ladder descends by commitment rather than repeating one ask: the offer
 * banner follows the trust strip and operating-principle pills, immediately
 * before the live build; the full sprint section follows the verified figures,
 * the softer "bring one week of inquiries" ask sits *after* the implementation
 * detail for readers not ready to commit today, and the final CTA closes on
 * the sprint again. See `copy.sprint` for every figure.
 */
import type { CSSProperties } from "react";

import {
  CalendarCheck,
  Clock,
  Diamond,
  Inbox,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Globe,
} from "~/components/icons/lucide";
import { TrustStrip } from "~/visual/home-v2/sections/trust-strip";

import {
  BorderBeam,
  PanelReveal,
  Prose,
  Reveal,
  SectionHead,
} from "~/features/services-v2/components/primitives";
import { BrowserShowcase } from "~/features/services-v2/demos/browser-showcase";
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
import { SprintBanner, SprintPanel } from "../components/sprint-offer";
import { ConsultLadder } from "../signatures/consult-ladder";
import type { IndustryCopy } from "../content/types";
import type { IndustryArt } from "../content/route-art";
import { formatMetrics, toCards, toFaqItems } from "./shared";

const painIcons = [Clock, CalendarCheck, MessageSquare, Inbox];
const workflowIcons = [PhoneCall, CalendarCheck, MessageSquare, Clock];

export function AestheticClinicsComposition({
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
      data-industry="aesthetic-clinics"
      style={accentStyle}
    >
      <SecondaryHero
        eyebrow={copy.eyebrow}
        icon={Diamond}
        title={copy.h1}
        deck={copy.deck}
        titleId="ind2-lead"
        lead={copy.heroSub}
        points={copy.heroPoints}
        mobile={copy.mobile}
        // The page's own sprint CTA ("Claim this week's sprint") is 24
        // characters — too long to hold one line inside half of the compact
        // phone action row without dropping a type step the other routes do
        // not take. The hero says the same thing in 19; the sprint banner and
        // the closing CTA, which have a full-width button, keep the original.
        primaryCtaLabel="Claim a sprint slot"
        secondaryCtaLabel="See a live build"
        secondaryCtaHref="/industry/aesthetic-clinics#ind2-demo"
        showcase={
          <ConsultLadder label={art.discipline} metrics={metrics.slice(0, 2)} />
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

      {/* Keep the offer next to the proof it leads into, after the shared trust
          strip and this sector's four operating-principle pills. */}
      {copy.sprint ? <SprintBanner sprint={copy.sprint} route={copy.route} /> : null}

      {/* Live client build, embedded rather than linked. The showcase is
          restricted to this sector's own site, so the section is proof for an
          aesthetic clinic rather than a portfolio rail. Full-bleed below the
          contained intro, matching the web-design portfolio's treatment.
          The embed only comes alive on the production domain — both demo
          origins serve `frame-ancestors` limited to silverstone-ai.com, and
          the route-scoped `frame-src` allow-list lives in the root
          netlify.toml. Everywhere else the poster and the open-in-new-tab
          link still work. */}
      {copy.caseStudy ? (
        <section
          className="ss-srv2-section ss-srv2-section--folio"
          id="ind2-demo"
          aria-labelledby="ind2-case"
        >
          <div className="ss-srv2__container">
            <SectionHead
              eyebrow={copy.caseStudy.eyebrow}
              icon={Sparkles}
              heading={copy.caseStudy.heading}
              headingId="ind2-case"
            />
          </div>
          <BrowserShowcase only={copy.caseStudy.showcaseSiteId} />
        </section>
      ) : null}

      <section className="ss-srv2-section" aria-labelledby="ind2-problem">
        <div className="ss-srv2__container">
          <div className="ss-srv2-split">
            <div>
              <SectionHead
                eyebrow="Where clinics lose the booking"
                icon={art.icon}
                heading={copy.problem.heading}
                headingId="ind2-problem"
              />
              <div className="ss-ind2-problem-panel">
                <Reveal kind="section">
                  <Prose paragraphs={[copy.problem.body]} />
                </Reveal>
              </div>
            </div>
            <Reveal kind="image">
              <IndustryFigure image={art.primary} />
            </Reveal>
          </div>
          <PanelReveal className="ss-ind2-problem-panel ss-srv2-beam-border">
            <ServiceCards
              cards={toCards(copy.problem.cards)}
              icons={painIcons}
              columns={4}
            />
            <BorderBeam />
          </PanelReveal>
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="ind2-workflows">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="The journeys that convert"
            icon={Clock}
            heading={copy.workflows.heading}
            headingId="ind2-workflows"
            lead={copy.workflows.lead}
          />
          <WorkflowCards items={copy.workflows.items} icons={workflowIcons} />
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

      {/* Straight off the verified figures: the reader has just seen what the
          system does, so this is where the fixed-price way in belongs. */}
      {copy.sprint ? <SprintPanel sprint={copy.sprint} /> : null}

      <section className="ss-srv2-section" aria-labelledby="ind2-journey">
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="The booking architecture"
            icon={CalendarCheck}
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
            eyebrow="Prescriber-owned"
            icon={ShieldCheck}
            heading={copy.boundary.heading}
            headingId="ind2-boundary"
          />
          <BoundaryPanel
            body={copy.boundary.body}
            keeps={copy.boundary.keeps}
            keepsLabel="Decided by clinicians, always"
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

      <section className="ss-srv2-section" aria-labelledby="ind2-process">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Implementation"
            icon={Users}
            heading={copy.process.heading}
            headingId="ind2-process"
            lead={copy.process.lead}
          />
          <ProcessTrack steps={toCards(copy.process.steps)} />
        </div>
      </section>

      {/* The ladder's lower rung, deliberately *after* the implementation
          detail: a clinician who has read this far and is not ready to commit
          to the sprint today still has something to say yes to. */}
      <section className="ss-srv2-section">
        <div className="ss-srv2__container" data-width="narrow">
          <FinalCta
            heading={copy.midCta.heading}
            body={<LinkedText text={copy.midCta.body} />}
            buttonLabel={copy.midCta.buttonLabel}
          />
        </div>
      </section>

      <section
        className="ss-srv2-section"
        aria-label="Illustrative aesthetic clinic workflows"
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
