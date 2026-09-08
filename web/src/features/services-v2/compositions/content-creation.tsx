/**
 * Content Creation — custom composition.
 * Visual concept: Editorial Intelligence System.
 *
 * No reserved external demo surface for this route — the fan-out signature is
 * the demonstration. Uses a marker-stroke Highlight (not a typewriter/scramble
 * effect) for two moments of editorial emphasis, per the design brief.
 */
import type { CSSProperties } from "react";

import type { ApprovedServiceContent } from "~/content/services/approved-services";
import {
  FileText,
  Gauge,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
} from "~/components/icons/lucide";

import {
  Highlight,
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
import { EditorialIntelligence } from "../signatures/editorial-intelligence";
import { contentCreationCopy } from "../content/copy";
import type { RouteArt } from "../content/route-art";

const featureIcons = [FileText, Share2, ShieldCheck, Sparkles];
const outcomeIcons = [UserCheck, Gauge, TrendingUp];

const related: RelatedLink[] = [
  {
    href: "/services/web-design-development",
    label: "Related service",
    title: "Web Design & Development",
  },
  { href: "/services/ai-automation", label: "Related service", title: "AI Automation" },
  { href: "/how-we-work", label: "Process", title: "How We Work" },
];

export function ContentCreationComposition({
  content,
  art,
}: {
  content: ApprovedServiceContent;
  art: RouteArt;
}) {
  const copy = contentCreationCopy;
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
        icon={FileText}
        title={copy.h1}
        deck={copy.deck}
        titleId="srv2-lead"
        lead={copy.heroSub}
        points={copy.heroPoints}
        mobile={copy.mobile}
        primaryCtaLabel={micro.ctaButton}
        secondaryCtaLabel="See verified results"
        secondaryCtaHref="/services/content-creation#srv2-proof"
        showcase={
          <EditorialIntelligence
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
            <p className="ss-srv2-lead">
              <Highlight>
                More content isn&rsquo;t the same as more authority.
              </Highlight>{" "}
              <RichText text={copy.problem.body} />
            </p>
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
            icon={FileText}
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
            <div>
              <SectionHead
                eyebrow="Why Silverstone AI"
                icon={Sparkles}
                heading={copy.differentiator.heading}
                headingId="srv2-different"
              />
              <Reveal kind="section">
                <p className="ss-srv2-lead" style={{ marginTop: "0.5rem" }}>
                  AI accelerates extraction, structuring and drafting. It doesn&rsquo;t
                  replace{" "}
                  <Highlight>the point of view, the accountable source</Highlight>, or
                  the human sign-off that keeps every asset distinct instead of generic.
                </p>
              </Reveal>
              {copy.comparison ? (
                <Reveal kind="section" delayMs={90}>
                  <div className="ss-srv2-compare" style={{ marginTop: "1.5rem" }}>
                    <div className="ss-srv2-compare__col">
                      <p className="ss-srv2-compare__label">
                        {copy.comparison.before.title}
                      </p>
                      <p className="ss-srv2-compare__text">
                        {copy.comparison.before.body}
                      </p>
                    </div>
                    <div className="ss-srv2-compare__col" data-tone="accent">
                      <p className="ss-srv2-compare__label">
                        {copy.comparison.after.title}
                      </p>
                      <p className="ss-srv2-compare__text">
                        {copy.comparison.after.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ) : null}
            </div>
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
          <SectionHead eyebrow="Continue" heading="Where this *connects next*" />
          <RelatedRail links={related} />
        </div>
      </section>
    </div>
  );
}
