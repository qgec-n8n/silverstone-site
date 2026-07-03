/**
 * /how-we-work — cinematic delivery and governance narrative.
 * Secondary-hero feature: DeliveryRouteSignature, a five-stage rail broken by
 * explicit diamond decision gates (built for this page only).
 */
import { CheckCircle2Icon, ShieldCheck, UserCheck, Workflow } from "~/components/icons/lucide";
import { DeliveryRouteSignature } from "~/features/core-pages/signatures";
import { NumberedRail } from "~/features/core-pages/shared";
import {
  Prose,
  Reveal,
  RichText,
  SectionHead,
} from "~/features/services-v2/components/primitives";
import { SecondaryHero } from "~/features/services-v2/components/secondary-hero";
import {
  BenchmarkConsole,
  FinalCta,
  ProcessTrack,
  RelatedRail,
  ServiceFigure,
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
    body: "Map the people, systems, handoffs, exceptions and commercial consequence before a solution is proposed. Nothing is scoped until the current reality is understood.",
  },
  {
    label: "Scope",
    body: "Select a single bounded release around value, feasibility, risk and a measurable acceptance standard. Everything else is named and deferred, not silently dropped.",
  },
  {
    label: "Design",
    body: "Plan the workflow, interface, content, data and escalation path as one operating experience — not a diagram that stops at the happy path.",
  },
  {
    label: "Build",
    body: "Implementation runs against the acceptance criteria set at scoping, so the definition of done was never in doubt during delivery.",
  },
  {
    label: "Govern",
    body: "Launch is a controlled handover: tested edge cases, a named owner for exceptions and a documented system nobody has to reverse-engineer later.",
  },
];

const CONTROL_RISKS = [
  {
    title: "The tool becomes the strategy",
    body: "The project is shaped around a platform instead of the business problem it was meant to solve.",
  },
  {
    title: "Scope expands invisibly",
    body: "Every review introduces another small requirement without a commercial decision behind it.",
  },
  {
    title: "The demo becomes the test",
    body: "The ideal path works while real exceptions, permissions and fallbacks are never exercised.",
  },
  {
    title: "Nobody owns the live system",
    body: "Prompts, accounts, automations and decisions become undocumented dependencies with no named owner.",
  },
];

const related: RelatedLink[] = [
  { href: "/services/ai-consulting", label: "Service", title: "AI consulting" },
  { href: "/pricing", label: "Commercial", title: "Pricing model" },
  { href: "/book", label: "Next step", title: "Discovery call" },
];

export function HowWeWorkComposition() {
  return (
    <div className="ss-srv2 ss-core" data-core-route="/how-we-work">
      <SecondaryHero
        eyebrow="The Silverstone method"
        icon={Workflow}
        title="From business problem to *working system*"
        titleId="core-hww-title"
        lead="A disciplined delivery route for AI, automation, web and app work: diagnosis first, bounded scope, explicit decision gates, tested implementation and human oversight after launch."
        points={[
          "Problem, data and people mapped before architecture",
          "Acceptance criteria and decision gates made visible",
          "Launch treated as a controlled handover, not a reveal",
        ]}
        primaryCtaLabel="Book a discovery call"
        showcase={
          <DeliveryRouteSignature label="The Silverstone method" metrics={HERO_METRICS} />
        }
      />
      <TrustStrip />

      <section className="ss-srv2-section" aria-labelledby="hww-route">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="The route"
            icon={Workflow}
            heading="Five stages, each with its own *gate*"
            headingId="hww-route"
            lead="The first decision is not which tool to use. It is which problem deserves capital, senior attention and operational change."
          />
          <ProcessTrack steps={STAGES.map((stage) => ({ label: stage.label, body: stage.body }))} />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="hww-human">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="What remains human"
            icon={UserCheck}
            heading="Automation should make *accountability* clearer, not blur it"
            headingId="hww-human"
          />
          <div className="ss-core-split">
            <Reveal kind="section">
              <Prose
                paragraphs={[
                  "Where a decision carries financial, legal, reputational or personal consequence, the workflow needs a named owner and a working escalation path.",
                  "Silverstone designs the boundary: what can happen automatically, what needs review, who owns exceptions and what gets logged for later improvement.",
                ]}
              />
            </Reveal>
            <Reveal kind="image">
              <ServiceFigure
                image={{
                  desktop: "/home-v2/silverstone-system-visual.png",
                  mobile: "/home-v2/silverstone-system-visual.png",
                  alt: "Silverstone operating system visual showing connected workflow layers.",
                  width: 1400,
                  height: 980,
                }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="hww-risk">
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

      <section className="ss-srv2-section" aria-labelledby="hww-proof">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Verified results"
            icon={CheckCircle2Icon}
            heading="Why the *discipline* matters"
            headingId="hww-proof"
            lead="Verified Silverstone AI performance figures show why disciplined scope, clean data and explicit acceptance criteria matter."
          />
          <BenchmarkConsole
            metrics={[
              "2–4 weeks — Time to first working automation",
              "98% — Extraction accuracy on structured documents",
              "65% — Document-processing cost reduction",
              "10x — Faster document turnaround",
            ]}
            caption="Verified Silverstone AI performance figures show why disciplined scope, clean data and explicit acceptance criteria matter."
          />
        </div>
      </section>

      <section className="ss-srv2-section">
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

      <section className="ss-srv2-section">
        <div className="ss-srv2__container">
          <SectionHead eyebrow="Continue" heading="Where this connects next" />
          <RelatedRail links={related} />
        </div>
      </section>
    </div>
  );
}
