/**
 * /how-we-work — cinematic delivery and governance narrative.
 * Secondary-hero feature: DeliveryRouteSignature, a five-stage rail broken by
 * explicit diamond decision gates (built for this page only).
 */
import "~/styles/industries-v2/industries-v2.css";

import {
  CheckCircle2Icon,
  ShieldCheck,
  UserCheck,
  Workflow,
} from "~/components/icons/lucide";
import { DeliveryRouteSignature } from "~/features/core-pages/signatures";
import { coreSectionStyle, NumberedRail } from "~/features/core-pages/shared";
import { BoundaryPanel } from "~/features/industries-v2/components/industry-sections";
import { RichText, SectionHead } from "~/features/services-v2/components/primitives";
import { SecondaryHero } from "~/features/services-v2/components/secondary-hero";
import {
  BenchmarkConsole,
  FinalCta,
  ProcessTrack,
  RelatedRail,
  type RelatedLink,
} from "~/features/services-v2/components/sections";
import { TrustStrip } from "~/visual/home-v2/sections/trust-strip";

const HERO_METRICS = [
  "2–4 weeks — Time to first working automation",
  "98% — Extraction accuracy on structured documents",
];

const STAGES = [
  {
    label: "Diagnose",
    body: "Map the people, systems, handoffs, exceptions and *commercial consequence* before a solution is proposed. Nothing is scoped until the current reality is understood.",
  },
  {
    label: "Scope",
    body: "Select a *single bounded release* around value, feasibility, risk and a measurable acceptance standard. Everything else is named and deferred, not silently dropped.",
  },
  {
    label: "Design",
    body: "Plan the workflow, interface, content, data and escalation path as *one operating experience* — not a diagram that stops at the happy path.",
  },
  {
    label: "Build",
    body: "Implementation runs against the *acceptance criteria* set at scoping, so the definition of done was never in doubt during delivery.",
  },
  {
    label: "Govern",
    body: "Launch is a *controlled handover*: tested edge cases, a named owner for exceptions and a documented system nobody has to reverse-engineer later.",
  },
];

const CONTROL_RISKS = [
  {
    title: "The tool becomes the strategy",
    body: "The project is shaped around a platform instead of *the business problem* it was meant to solve.",
  },
  {
    title: "Scope expands invisibly",
    body: "Every review introduces another small requirement without a *commercial decision* behind it.",
  },
  {
    title: "The demo becomes the test",
    body: "The ideal path works while *real exceptions, permissions and fallbacks* are never exercised.",
  },
  {
    title: "Nobody owns the live system",
    body: "Prompts, accounts, automations and decisions become *undocumented dependencies* with no named owner.",
  },
];

const related: RelatedLink[] = [
  { href: "/services/ai-consulting", label: "Service", title: "AI consulting" },
  { href: "/pricing", label: "Commercial", title: "Pricing model" },
  { href: "/book#booking-calendar", label: "Next step", title: "Discovery call" },
];

export function HowWeWorkComposition() {
  return (
    <div className="ss-srv2 ss-core" data-core-route="/how-we-work">
      <SecondaryHero
        eyebrow="The Silverstone method"
        icon={Workflow}
        title="From business problem to *working system*"
        titleId="core-hww-title"
        lead="The full delivery method: five gated stages, the judgment that stays human, the failure modes we design against, and the results. The same method runs for a clinic in Austin and an agency in Leeds; only the tooling differs."
        points={[
          { icon: Workflow, text: "Five stages, from diagnosis to governed launch" },
          { icon: UserCheck, text: "Where human judgment stays in charge" },
          {
            icon: CheckCircle2Icon,
            text: "Verified results from live client systems",
          },
        ]}
        primaryCtaLabel="Book a discovery call"
        secondaryCtaLabel="See verified results"
        secondaryCtaHref="/how-we-work#hww-proof"
        showcase={
          <DeliveryRouteSignature
            label="The Silverstone method"
            metrics={HERO_METRICS}
          />
        }
      />
      <TrustStrip />

      <section
        className="ss-srv2-section"
        aria-labelledby="hww-route"
        style={coreSectionStyle(0)}
      >
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="The route"
            icon={Workflow}
            heading="Five stages, each with its own *gate*"
            headingId="hww-route"
            lead="The first decision is not which tool to use. It is *which problem deserves capital*, senior attention and operational change."
          />
          <ProcessTrack
            steps={STAGES.map((stage) => ({ label: stage.label, body: stage.body }))}
          />
        </div>
      </section>

      <section
        className="ss-srv2-section"
        aria-labelledby="hww-human"
        style={coreSectionStyle(1)}
      >
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="What remains human"
            icon={UserCheck}
            heading="Automation should make *accountability* clearer, not blur it"
            headingId="hww-human"
          />
          <BoundaryPanel
            body="Where a decision carries financial, legal, reputational or personal consequence, the workflow needs a *named owner and a working escalation path*. Silverstone AI designs that boundary up front: what can happen automatically, and what a person must decide."
            keeps={[
              "Sign-off on financial, legal or reputational exceptions",
              "A named owner for every escalation path",
              "Final review before a workflow goes live",
              "What gets logged for later improvement",
            ]}
          />
        </div>
      </section>

      <section
        className="ss-srv2-section"
        aria-labelledby="hww-risk"
        style={coreSectionStyle(2)}
      >
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="Where projects lose control"
            icon={ShieldCheck}
            heading="The same four *failure modes*, almost every time"
            headingId="hww-risk"
          />
          <NumberedRail items={CONTROL_RISKS} />
        </div>
      </section>

      <section
        className="ss-srv2-section"
        aria-labelledby="hww-proof"
        style={coreSectionStyle(3)}
      >
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Verified results"
            icon={CheckCircle2Icon}
            heading="Why the *discipline* matters"
            headingId="hww-proof"
            lead="Verified Silverstone AI performance figures show why *disciplined scope, clean data and explicit acceptance criteria* matter."
          />
          <BenchmarkConsole
            metrics={[
              "2–4 weeks — Time to first working automation",
              "98% — Extraction accuracy on structured documents",
              "65% — Document-processing cost reduction",
              "10x — Faster document turnaround",
            ]}
            caption="Measured on live client systems delivered through this framework — documented outcomes, not projections."
          />
        </div>
      </section>

      <section className="ss-srv2-section" style={coreSectionStyle(4)}>
        <div className="ss-srv2__container" data-width="narrow">
          <FinalCta
            heading="Start with *one real problem*"
            body={
              <RichText text="Bring one business process, customer journey or digital product decision. We will help decide what belongs in the first release, what should wait and where people must stay accountable." />
            }
            buttonLabel="Book a discovery call"
          />
        </div>
      </section>

      <section className="ss-srv2-section" style={coreSectionStyle(5)}>
        <div className="ss-srv2__container">
          <SectionHead eyebrow="Continue" heading="Where this *connects next*" />
          <RelatedRail links={related} />
        </div>
      </section>
    </div>
  );
}
