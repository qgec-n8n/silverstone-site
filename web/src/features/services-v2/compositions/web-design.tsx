/**
 * Web Design & Development — bespoke composition.
 * Visual concept: Conversion Architecture / Living Interface.
 *
 * Concise, conversion-led structure (British English): opening → costly problem
 * → outcome → what you receive → why Silverstone → verified performance →
 * delivery → reserved live-website showcases → objections → decisive CTA.
 * Prose comes from the rewritten copy module; exact benchmark values and the
 * approved capability/outcome/process microcopy come from the verified content.
 */
import type { CSSProperties } from "react";

import type { ApprovedServiceContent } from "~/content/services/approved-services";
import {
  CalendarCheck,
  Gauge,
  PencilRuler,
  Plug,
  Smartphone,
  Sparkles,
  TrendingUp,
  UserCheck,
  Workflow,
} from "~/components/icons/lucide";

import { TrustStrip } from "~/visual/home-v2/sections/trust-strip";

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
import { BrowserShowcase } from "../demos/browser-showcase";
import { ConversionArchitecture } from "../signatures/conversion-architecture";
import { webDesignCopy } from "../content/copy";
import type { RouteArt } from "../content/route-art";

const featureIcons = [PencilRuler, Workflow, Smartphone, Plug];
const outcomeIcons = [UserCheck, CalendarCheck, TrendingUp];

const related: RelatedLink[] = [
  {
    href: "/services/content-creation",
    label: "Related service",
    title: "Content Creation",
  },
  { href: "/services/ai-automation", label: "Related service", title: "AI Automation" },
  { href: "/how-we-work", label: "Process", title: "How We Work" },
];

export function WebDesignComposition({
  content,
  art,
}: {
  content: ApprovedServiceContent;
  art: RouteArt;
}) {
  const copy = webDesignCopy;
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
      {/* 1 — Secondary hero + scroll cue, then the homepage trust strip */}
      <SecondaryHero
        eyebrow={copy.eyebrow}
        icon={PencilRuler}
        title={copy.h1}
        titleId="srv2-lead"
        lead={copy.heroSub}
        points={copy.heroPoints}
        primaryCtaLabel={micro.ctaButton}
        showcase={
          <ConversionArchitecture
            label={art.discipline}
            metrics={micro.benchmark.metrics.slice(0, 2)}
          />
        }
      />
      <TrustStrip />

      {/* 2 — Costly problem */}
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

      {/* 3 — Outcome */}
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

      {/* 4 — What you receive */}
      <section className="ss-srv2-section" aria-labelledby="srv2-capabilities">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="What you receive"
            icon={Workflow}
            heading={copy.capabilities.heading}
            headingId="srv2-capabilities"
            lead={copy.capabilities.lead}
          />
          <ServiceCards cards={micro.featureCards} icons={featureIcons} columns={4} />
        </div>
      </section>

      {/* 5 — Why Silverstone is different (with the approved system image) */}
      <section className="ss-srv2-section" aria-labelledby="srv2-different">
        <div className="ss-srv2__container">
          <div className="ss-srv2-split ss-srv2-split--wide-copy">
            <div>
              <SectionHead
                eyebrow="Why Silverstone"
                icon={Sparkles}
                heading={copy.differentiator.heading}
                headingId="srv2-different"
                lead={copy.differentiator.body}
              />
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

      {/* 6 — Verified performance */}
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

      {/* 7 — Delivery */}
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

      {/* 8 — Mid CTA */}
      <section className="ss-srv2-section">
        <div className="ss-srv2__container" data-width="narrow">
          <FinalCta
            heading={copy.midCta.heading}
            body={<RichText text={copy.midCta.body} />}
            buttonLabel={micro.ctaButton}
          />
        </div>
      </section>

      {/* 9 — Reserved live-website showcases */}
      <section
        className="ss-srv2-section"
        id="demo-web-design"
        aria-labelledby="srv2-showcase"
      >
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Live showcases"
            icon={PencilRuler}
            heading="Two live website showcases are reserved for this page"
            headingId="srv2-showcase"
            lead="Beyond static portfolio imagery, this space is prepared to explore two production websites in a controlled browser-frame presentation — added only once the live URL, permission and descriptive copy are approved."
          />
          <BrowserShowcase />
        </div>
      </section>

      {/* 10 — Objections */}
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

      {/* 11 — Final CTA */}
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

      {/* 12 — Related */}
      <section className="ss-srv2-section">
        <div className="ss-srv2__container">
          <SectionHead eyebrow="Continue" heading="Where this connects next" />
          <RelatedRail links={related} />
        </div>
      </section>
    </div>
  );
}
