import type { ReactNode } from "react";

import {
  benchmarkDisclaimer,
  selectMetrics,
  type BenchmarkMetric,
} from "~/data/benchmark-metrics";
import type { FutureRouteRecord } from "~/data/route-schema";
import { getApprovedServiceContent } from "~/content/services/approved-services";
import {
  DemoShell,
  type DemoScenario,
  type DemoStep,
} from "~/visual/components/demo-shell";
import { ApprovedServicePageVisuals } from "~/visual/components/approved-service-page";
import {
  IndustryInstrument,
  type InstrumentStep,
} from "~/visual/components/industry-instrument";
import { IndustriesAtlas } from "~/visual/components/industries-atlas";
import { ServicesDecisionMatrix } from "~/visual/components/services-decision-matrix";
import { CallFlowOscilloscope } from "~/visual/components/signatures/call-flow-oscilloscope";
import { ConversionPathLens } from "~/visual/components/signatures/conversion-path-lens";
import { EditorialLoom } from "~/visual/components/signatures/editorial-loom";
import { FrontDeskConvergence } from "~/visual/components/signatures/front-desk-convergence";
import { ProcessLattice } from "~/visual/components/signatures/process-lattice";
import { ProductStateStack } from "~/visual/components/signatures/product-state-stack";
import { ToolsCarousel, type ToolEntry } from "~/visual/components/tools-carousel";

/* -------------------------------------------------------------------------- */
/* Shared render helpers                                                       */
/* -------------------------------------------------------------------------- */

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

type TileRow = { label: string; value: string; active?: boolean };

function StageTiles({
  synthetic,
  rows,
  summary,
}: {
  synthetic: string;
  rows: TileRow[];
  summary?: string;
}): ReactNode {
  return (
    <>
      <p className="ss-demo__synthetic">{synthetic}</p>
      <ul className="ss-demo__tiles">
        {rows.map((row, index) => (
          <li
            className="ss-tile"
            data-active={row.active ? "true" : "false"}
            key={`${String(index)}-${row.label}`}
          >
            <span className="ss-tile__label">{row.label}</span>
            <span className="ss-tile__value">{row.value}</span>
          </li>
        ))}
      </ul>
      {summary ? <p className="ss-note ss-note--info">{summary}</p> : null}
    </>
  );
}

/* A reveal-one-row-at-a-time scenario (outline / flow / plan style demos). */
type SeqRow = { label: string; detail: string; log: string };

type SequentialConfig = {
  synthetic: string;
  rows: SeqRow[];
  status: (index: number, total: number) => string;
  finalLog: string;
  finalStatus: string;
  summary: string;
  idleNote: string;
  extra?: ReactNode;
};

function numberedRows(rows: SeqRow[], activeIndex: number): TileRow[] {
  return rows.map((row, index) => ({
    label: `${pad(index + 1)} · ${row.label}`,
    value: row.detail,
    active: index === activeIndex,
  }));
}

function buildSequential(config: SequentialConfig): () => DemoStep[] {
  return () => {
    const total = config.rows.length;
    const steps: DemoStep[] = config.rows.map((row, index) => ({
      id: `step-${String(index)}`,
      log: row.log,
      status: config.status(index, total),
      render: () => (
        <StageTiles
          rows={numberedRows(config.rows.slice(0, index + 1), index)}
          synthetic={config.synthetic}
        />
      ),
    }));
    steps.push({
      id: "summary",
      log: config.finalLog,
      status: config.finalStatus,
      render: () => (
        <>
          <StageTiles
            rows={numberedRows(config.rows, -1)}
            summary={config.summary}
            synthetic={config.synthetic}
          />
          {config.extra}
        </>
      ),
    });
    return steps;
  };
}

function sequentialIdle(config: SequentialConfig): () => ReactNode {
  return () => (
    <StageTiles
      rows={numberedRows(config.rows, -1)}
      summary={config.idleNote}
      synthetic={config.synthetic}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Service scenarios (one fixed, faithful option set per prototype)           */
/* -------------------------------------------------------------------------- */

const webConversion: SequentialConfig = {
  synthetic: "Synthetic page outline",
  rows: [
    {
      label: "Clarity banner",
      detail: "Lead with a plain-English promise and one obvious next step.",
      log: "Placed: Clarity banner — Lead with a plain-English promise and one obvious next step.",
    },
    {
      label: "Primary path",
      detail: "Make “Book a discovery call” the single dominant call to action.",
      log: "Placed: Primary path — Make “Book a discovery call” the single dominant call to action.",
    },
    {
      label: "Proof block",
      detail:
        "Place recognisable client logos beside the action so it is read in context.",
      log: "Placed: Proof block — Place recognisable client logos beside the action so it is read in context.",
    },
    {
      label: "Wayfinding",
      detail: "Trim navigation and search to the few paths this audience needs.",
      log: "Placed: Wayfinding — Trim navigation and search to the few paths this audience needs.",
    },
    {
      label: "Reassurance",
      detail: "Answer the top objection before it is asked.",
      log: "Placed: Reassurance — Answer the top objection before it is asked.",
    },
    {
      label: "Repeat the path",
      detail: "Restate “Book a discovery call” at the natural decision point.",
      log: "Placed: Repeat the path — Restate “Book a discovery call” at the natural decision point.",
    },
  ],
  status: (index, total) =>
    `Assembling path… step ${String(index + 1)} of ${String(total + 1)}.`,
  finalLog: "Journey summary produced (structure only).",
  finalStatus: "Path assembled. Reset to try another combination.",
  summary:
    "Synthetic journey: a first-time visitor lands, reads the promise, sees recognisable client logos, and reaches “Book a discovery call”. This maps structure only — it does not predict conversion rate, ranking or revenue.",
  idleNote: "Idle — press Start to assemble the path.",
};

const appState: SequentialConfig = {
  synthetic: "Synthetic first-release flow",
  rows: [
    {
      label: "Capture · User (customer)",
      detail: "User (customer) starts the core flow: request a slot.",
      log: "Capture — User (customer): User (customer) starts the core flow: request a slot.",
    },
    {
      label: "Prototype · User (customer)",
      detail:
        "A clickable model of “request a slot” is reviewed before any production code.",
      log: "Prototype — User (customer): A clickable model of “request a slot” is reviewed before any production code.",
    },
    {
      label: "Validate · Staff",
      detail:
        "Staff checks the request against approved rules — the decision stays with a person.",
      log: "Validate — Staff: Staff checks the request against approved rules — the decision stays with a person.",
    },
    {
      label: "Record · System",
      detail: "One Booking record becomes the source of truth, with history.",
      log: "Record — System: One Booking record becomes the source of truth, with history.",
    },
    {
      label: "Release · Staff",
      detail:
        "Staff releases the smallest useful version; everything else moves to the roadmap.",
      log: "Release — Staff: Staff releases the smallest useful version; everything else moves to the roadmap.",
    },
  ],
  status: (index, total) =>
    `Mapping first release… state ${String(index + 1)} of ${String(total + 1)}.`,
  finalLog:
    "Roadmap recorded: Loyalty points, Multi-location rules, Waitlist automation.",
  finalStatus: "First release mapped. Reset to try another combination.",
  summary:
    "Synthetic map for “take bookings online”: the core flow ships first across user, staff and system states, with 3 features deferred to a roadmap. This maps structure only — it does not estimate cost, effort or delivery time.",
  idleNote: "Idle — press Start to map the first release.",
  extra: (
    <>
      <p className="ss-demo__synthetic">Deferred to roadmap</p>
      <ul className="ss-demo__tiles">
        {["Loyalty points", "Multi-location rules", "Waitlist automation"].map(
          (item) => (
            <li className="ss-tile" data-active="false" key={item}>
              <span className="ss-tile__value">{item}</span>
            </li>
          ),
        )}
      </ul>
    </>
  ),
};

const receptionConsole: SequentialConfig = {
  synthetic: "Synthetic routing decision",
  rows: [
    {
      label: "Receive",
      detail: "Enquiry arrives via web chat and joins one intake queue.",
      log: "Receive: Enquiry arrives via web chat and joins one intake queue.",
    },
    {
      label: "Identify",
      detail: "Type recognised: general question.",
      log: "Identify: Type recognised: general question.",
    },
    {
      label: "Approved-answer check",
      detail: "Matched against content you have signed off.",
      log: "Approved-answer check: Matched against content you have signed off.",
    },
    {
      label: "Route → Answer",
      detail: "Replied from approved content — opening hours, location, simple FAQs.",
      log: "Route → Answer: Replied from approved content — opening hours, location, simple FAQs.",
    },
  ],
  status: (index, total) =>
    `Routing enquiry… step ${String(index + 1)} of ${String(total + 1)}.`,
  finalLog: "Destination: Answer (synthetic).",
  finalStatus: "Enquiry routed. Reset to try another combination.",
  summary:
    "A general question from web chat resolved to “Answer” using approved content. This is synthetic — no real enquiry, no live integration, and sensitive matters are never automated.",
  idleNote: "Idle — press Start to route the enquiry.",
};

const contentLoom: SequentialConfig = {
  synthetic: "Synthetic content plan",
  rows: [
    {
      label: "Source",
      detail:
        "Customer case study — outcomes described qualitatively, with the customer’s permission.",
      log: "Source: Customer case study — outcomes described qualitatively, with the customer’s permission.",
    },
    {
      label: "Audience",
      detail: "Shaped for prospective customers.",
      log: "Audience: Shaped for prospective customers.",
    },
    {
      label: "Plan → Website",
      detail: "Page copy shaped to one clear action.",
      log: "Plan → Website: Page copy shaped to one clear action.",
    },
    {
      label: "Plan → Article",
      detail: "Longer-form piece linking back to the source.",
      log: "Plan → Article: Longer-form piece linking back to the source.",
    },
    {
      label: "Plan → Email",
      detail: "Concise version with a single next step.",
      log: "Plan → Email: Concise version with a single next step.",
    },
    {
      label: "Plan → Social",
      detail: "Short, per-platform posts tracing to the same facts.",
      log: "Plan → Social: Short, per-platform posts tracing to the same facts.",
    },
    {
      label: "Claim check",
      detail:
        "Unsupported stats, testimonials and regulated advice flagged and blocked.",
      log: "Claim check: Unsupported stats, testimonials and regulated advice flagged and blocked.",
    },
    {
      label: "Review gate",
      detail: "A person approves each output before anything can publish.",
      log: "Review gate: A person approves each output before anything can publish.",
    },
  ],
  status: (index, total) =>
    `Planning content… step ${String(index + 1)} of ${String(total + 1)}.`,
  finalLog: "Plan ready (synthetic). Nothing written or published.",
  finalStatus: "Plan complete. Reset to try another combination.",
  summary:
    "Synthetic plan from one customer case study: 4 channel outputs, each behind a review gate, with unsupported claims blocked. This plans structure only — it does not write copy, invent facts or publish.",
  idleNote: "Idle — press Start to plan the content.",
};

const voiceAdapterStates: SeqRow[] = [
  {
    label: "Idle",
    detail: "Demo mode is ready. No microphone or live telephony is connected.",
    log: "Adapter idle: deterministic demo mode, no credentials configured.",
  },
  {
    label: "Permission",
    detail:
      "A microphone permission step is represented before any live capture would begin.",
    log: "Permission checkpoint: microphone access must be explicit before listening.",
  },
  {
    label: "Connecting",
    detail: "The adapter prepares the voice session and confirms fallback routing.",
    log: "Connecting: session and escalation path prepared.",
  },
  {
    label: "Listening",
    detail: "The caller asks a routine booking question in a scripted transcript.",
    log: "Listening: scripted caller asks for a callback slot.",
  },
  {
    label: "Speaking",
    detail:
      "The assistant replies from approved wording and offers the next approved step.",
    log: "Speaking: response selected from approved business rules.",
  },
  {
    label: "Paused",
    detail:
      "The flow pauses while the caller chooses whether to book or speak to a person.",
    log: "Paused: waiting state, no autonomous action.",
  },
  {
    label: "Booking completion",
    detail:
      "A mock booking summary is prepared for a person or connected calendar rule.",
    log: "Booking completion: deterministic mock slot prepared.",
  },
  {
    label: "Error path",
    detail:
      "If the caller is unclear, the session falls back to a human handoff summary.",
    log: "Error path: unclear intent routes to a person with transcript context.",
  },
  {
    label: "Complete",
    detail: "Transcript, outcome and escalation status are visible for review.",
    log: "Complete: review record ready, no live data stored.",
  },
];

const voiceAdapterConfig: SequentialConfig = {
  synthetic: "Synthetic voice adapter state machine",
  rows: voiceAdapterStates,
  status: (index, total) =>
    `Voice adapter state ${String(index + 1)} of ${String(total + 1)}.`,
  finalLog: "Adapter flow complete (demo mode).",
  finalStatus: "Adapter state walk complete. Reset to replay.",
  summary:
    "Synthetic result: the voice surface moves through permission, connection, conversation, pause, booking, fallback and completion states. It is ready to connect to a real voice provider only when credentials, consent and approved scripts exist.",
  idleNote: "Idle — press Start to walk the voice adapter states.",
};

const voiceAgentAdapter: DemoScenario = {
  id: "voice-agent-adapter",
  title: "ElevenLabs-ready voice adapter",
  summary:
    "A deterministic adapter surface with idle, permission, connecting, listening, speaking, paused, error and complete states.",
  safeguard:
    "Demo mode only — no live microphone, no ElevenLabs credentials, no real caller and no autonomous booking.",
  interval: 620,
  idle: sequentialIdle(voiceAdapterConfig),
  build: buildSequential(voiceAdapterConfig),
};

/* Automation lattice — a fixed batch where one item is held for a human. */
type BatchItem = { ref: string; summary: string };

const batchItems: BatchItem[] = [
  { ref: "ENQ-118", summary: "Quote request, full details" },
  { ref: "ENQ-119", summary: "Refund demand, frustrated wording" },
  { ref: "ENQ-120", summary: "Bulk order above approval limit" },
  { ref: "ENQ-121", summary: "Callback request, no phone number" },
  { ref: "ENQ-122", summary: "General question, full details" },
];

const heldIndex = 2;

function batchRows(processed: number, activeIndex: number): TileRow[] {
  return batchItems.map((item, index) => {
    let state: string;
    if (index >= processed) {
      state = "Queued";
    } else if (index === heldIndex) {
      state = "Held for approval";
    } else {
      state = "Auto-handled";
    }
    return {
      label: `${item.ref} · ${state}`,
      value: item.summary,
      active: index === activeIndex,
    };
  });
}

const automationLattice: DemoScenario = {
  id: "automation-lattice",
  title: "Exception-aware workflow run",
  summary:
    "A fixed batch of inbound enquiries auto-handled along one path, with exceptions held for a person.",
  safeguard:
    "Synthetic & deterministic — no autonomous or irreversible action is taken; exceptions wait for a person.",
  interval: 620,
  idle: () => (
    <StageTiles
      rows={batchRows(0, -1)}
      summary="Idle — press Start to run the batch."
      synthetic="Synthetic batch — Inbound enquiries"
    />
  ),
  build: () => {
    const steps: DemoStep[] = [
      {
        id: "intake",
        log: "Batch received: 5 items in Inbound enquiries.",
        status: "Intake complete — 5 enquiries queued.",
        render: () => (
          <StageTiles
            rows={batchRows(0, -1)}
            synthetic="Synthetic batch — Inbound enquiries"
          />
        ),
      },
    ];
    batchItems.forEach((item, index) => {
      const held = index === heldIndex;
      steps.push({
        id: `item-${String(index)}`,
        log: held
          ? `${item.ref} held: Above approval limit — routed to human approval.`
          : `${item.ref} auto-handled: ${item.summary}.`,
        status: held
          ? "Exception found — waiting on a person to approve."
          : `Processing… ${String(index + 1)} of 5.`,
        render: () => (
          <StageTiles
            rows={batchRows(index + 1, index)}
            synthetic="Synthetic batch — Inbound enquiries"
          />
        ),
      });
    });
    steps.push({
      id: "summary",
      log: "Run complete — exception waiting for a named approver.",
      status: "Done. Reset to try another queue or rule.",
      render: () => (
        <StageTiles
          rows={batchRows(batchItems.length, -1)}
          summary="Synthetic run: 4 routine enquiries auto-handled along one path; 1 (ENQ-120) held for human approval because a value threshold is crossed. No autonomous or irreversible action is taken."
          synthetic="Synthetic batch — Inbound enquiries"
        />
      ),
    });
    return steps;
  },
};

const consultingRoadmap: SequentialConfig = {
  synthetic: "Synthetic advisory roadmap",
  rows: [
    {
      label: "Opportunity audit",
      detail:
        "Capture the workflows, handoffs and decisions that actually slow the team down.",
      log: "Audited: workflows, handoffs and decision points.",
    },
    {
      label: "Data readiness",
      detail:
        "Check where records live, who owns them and what should not be automated.",
      log: "Checked: systems, data ownership and automation boundaries.",
    },
    {
      label: "Build versus buy",
      detail:
        "Separate platform configuration, custom build and process change before tools are chosen.",
      log: "Compared: configure, buy, build and leave alone.",
    },
    {
      label: "Governance route",
      detail:
        "Define approval, testing, monitoring and human escalation before implementation.",
      log: "Defined: review gates, escalation and monitoring.",
    },
    {
      label: "Prioritised roadmap",
      detail:
        "Sequence the first three decisions so the organisation can start small and expand deliberately.",
      log: "Roadmap: first three decisions sequenced.",
    },
  ],
  status: (index, total) =>
    `Building roadmap… decision ${String(index + 1)} of ${String(total + 1)}.`,
  finalLog: "Roadmap prepared (synthetic).",
  finalStatus: "Roadmap ready. Reset to replay the advisory sequence.",
  summary:
    "Synthetic advisory output: one prioritised roadmap, with build-versus-buy reasoning and governance checkpoints. This is not procurement advice, a vendor endorsement or a guaranteed business case.",
  idleNote: "Idle — press Start to build the advisory roadmap.",
};

function sequentialScenario(
  id: string,
  title: string,
  summary: string,
  safeguard: string,
  config: SequentialConfig,
  interval = 560,
): DemoScenario {
  return {
    id,
    title,
    summary,
    safeguard,
    interval,
    idle: sequentialIdle(config),
    build: buildSequential(config),
  };
}

/* -------------------------------------------------------------------------- */
/* Tools rails (faithful to each prototype)                                   */
/* -------------------------------------------------------------------------- */

const SERVICE_TOOLS_LABEL = "Connector constellation";
const INDUSTRY_TOOLS_LABEL = "Tools this sector commonly uses";

type ServiceImageAsset = {
  alt: string;
  catalogueId: string;
  caption: string;
  desktop: {
    height: number;
    jpg: string;
    width: number;
  };
  mobile: {
    height: number;
    jpg: string;
    width: number;
  };
  loading: "eager" | "lazy";
  placement: string;
  sizes: string;
};

type ServiceStory = {
  architecture: { label: string; detail: string }[];
  challenge: string;
  faq: { question: string; answer: string }[];
  heading: string;
  image: ServiceImageAsset;
  imageSecondary?: ServiceImageAsset;
  lead: string;
  metrics: BenchmarkMetric[];
  outcomes: string[];
  process: { label: string; detail: string }[];
  related: { href: string; label: string }[];
  safeguard: string;
  variant: string;
};

const IMAGE_SIZES =
  "(max-width: 767px) min(100vw - 2rem, 768px), (max-width: 1200px) 48vw, 560px";

const SERVICE_IMAGES = {
  consulting: {
    catalogueId: "csv-01-desktop/csv-01-mobile",
    desktop: {
      jpg: "/approved-images/services_consulting.jpg",
      width: 2528,
      height: 1696,
    },
    mobile: {
      jpg: "/approved-images/services_consulting_mobile.jpg",
      width: 2048,
      height: 2048,
    },
    loading: "eager",
    sizes: IMAGE_SIZES,
    placement: "Discovery audit and roadmap panel",
    alt: "Illustrative AI consulting and readiness audit panel.",
    caption:
      "Illustrative audit interface. The boardroom panel is mock content, not a client dashboard or measured result.",
  },
  dataIntegration: {
    catalogueId: "csv-04-desktop/csv-04-mobile",
    desktop: {
      jpg: "/approved-images/services_data_integration.jpg",
      width: 2528,
      height: 1696,
    },
    mobile: {
      jpg: "/approved-images/services_data_integration_mobile.jpg",
      width: 2048,
      height: 2048,
    },
    loading: "eager",
    sizes: IMAGE_SIZES,
    placement: "Systems and data architecture panel",
    alt: "Illustrative systems and data integration panel.",
    caption:
      "Illustrative integration panel. It explains architecture, not a live product screen.",
  },
  followUp: {
    catalogueId: "csv-02-desktop/csv-02-mobile",
    desktop: {
      jpg: "/approved-images/services_lead_followup.jpg",
      width: 2528,
      height: 1696,
    },
    mobile: {
      jpg: "/approved-images/services_lead_followup_mobile.jpg",
      width: 2048,
      height: 2048,
    },
    loading: "eager",
    sizes: IMAGE_SIZES,
    placement: "Lead follow-up and booking panel",
    alt: "Illustrative automated lead follow-up panel.",
    caption:
      "Illustrative lead-follow-up workflow. Names, bookings and interface states are mock content.",
  },
  generalOne: {
    catalogueId: "csv-07-desktop/csv-07-mobile",
    desktop: {
      jpg: "/approved-images/general-services-1.png",
      width: 2528,
      height: 1696,
    },
    mobile: {
      jpg: "/approved-images/general-services-1-mobile.png",
      width: 1696,
      height: 2528,
    },
    loading: "eager",
    sizes: IMAGE_SIZES,
    placement: "Conversion and reception capture panel",
    alt: "Illustrative reception and enquiry capture panel.",
    caption:
      "Illustrative enquiry-capture panel. It is not a real patient system or client result.",
  },
  generalTwoA: {
    catalogueId: "csv-08-desktop/csv-08-mobile",
    desktop: {
      jpg: "/approved-images/general-services-2a.png",
      width: 2528,
      height: 1696,
    },
    mobile: {
      jpg: "/approved-images/general-services-2a-mobile.png",
      width: 1696,
      height: 2528,
    },
    loading: "eager",
    sizes: IMAGE_SIZES,
    placement: "Modular delivery and content package panel",
    alt: "Illustrative modular service package panel.",
    caption:
      "Illustrative modular package panel. The checklist is a concept, not a fixed deliverable promise.",
  },
  generalTwoB: {
    catalogueId: "csv-09-desktop/csv-09-mobile",
    desktop: {
      jpg: "/approved-images/general-services-2b.png",
      width: 2528,
      height: 1696,
    },
    mobile: {
      jpg: "/approved-images/general-services-2b-mobile.png",
      width: 1696,
      height: 2528,
    },
    loading: "lazy",
    sizes: IMAGE_SIZES,
    placement: "Connected platform ecosystem panel",
    alt: "Illustrative integrated business workflow panel.",
    caption:
      "Illustrative integration ecosystem. The interface is conceptual and not customer data.",
  },
  generalThree: {
    catalogueId: "csv-10-desktop/csv-10-mobile",
    desktop: {
      jpg: "/approved-images/general-services-3.png",
      width: 2528,
      height: 1696,
    },
    mobile: {
      jpg: "/approved-images/general-services-3-mobile.png",
      width: 1696,
      height: 2528,
    },
    loading: "lazy",
    sizes: IMAGE_SIZES,
    placement: "Booking and diary administration panel",
    alt: "Illustrative booking and diary administration panel.",
    caption:
      "Illustrative scheduling panel. It is not a live booking system or guaranteed admin outcome.",
  },
  workflow: {
    catalogueId: "csv-03-desktop/csv-03-mobile",
    desktop: {
      jpg: "/approved-images/services_workflow_automation.jpg",
      width: 2528,
      height: 1696,
    },
    mobile: {
      jpg: "/approved-images/services_workflow_automation_mobile.jpg",
      width: 2048,
      height: 2048,
    },
    loading: "eager",
    sizes: IMAGE_SIZES,
    placement: "Workflow automation and reporting panel",
    alt: "Illustrative workflow automation and reporting interface.",
    caption:
      "Illustrative operations panel. Process labels and dashboard states are conceptual.",
  },
} satisfies Record<string, ServiceImageAsset>;

function ServicePicture({ image }: { image: ServiceImageAsset }): ReactNode {
  return (
    <figure className="ss-service-image" data-catalogue-id={image.catalogueId}>
      <picture>
        <source
          media="(max-width: 767px)"
          sizes={image.sizes}
          srcSet={`${image.mobile.jpg} ${String(image.mobile.width)}w`}
        />
        <img
          alt={image.alt}
          decoding="async"
          fetchPriority={image.loading === "eager" ? "high" : "auto"}
          height={image.desktop.height}
          loading={image.loading}
          sizes={image.sizes}
          src={image.desktop.jpg}
          srcSet={`${image.desktop.jpg} ${String(image.desktop.width)}w`}
          width={image.desktop.width}
        />
      </picture>
      <figcaption>
        <span>{image.placement}</span>
        {image.caption}
      </figcaption>
    </figure>
  );
}

function ServiceStoryBlock({
  route,
  story,
}: {
  route: FutureRouteRecord;
  story: ServiceStory;
}): ReactNode {
  return (
    <section className="ss-service-story" data-variant={story.variant}>
      <div className="ss-service-story__copy">
        <span className="ss-service-story__kicker">Service architecture</span>
        <h2>{story.heading}</h2>
        <p>{story.lead}</p>
        <div className="ss-service-story__challenge">
          <strong>Strategic challenge</strong>
          <span>{story.challenge}</span>
        </div>
      </div>
      <ServicePicture image={story.image} />
      <ul className="ss-service-outcomes" aria-label={`${route.h1} outcomes`}>
        {story.outcomes.map((outcome) => (
          <li key={outcome}>{outcome}</li>
        ))}
      </ul>
    </section>
  );
}

function ServiceArchitecture({ story }: { story: ServiceStory }): ReactNode {
  return (
    <section className="ss-service-band">
      <div className="ss-service-band__head">
        <span>Capability architecture</span>
        <h2>What has to be designed, not assumed</h2>
      </div>
      <div className="ss-service-architecture">
        {story.architecture.map((item, index) => (
          <article className="ss-service-architecture__item" key={item.label}>
            <span>{pad(index + 1)}</span>
            <h3>{item.label}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServiceProcess({ story }: { story: ServiceStory }): ReactNode {
  return (
    <section className="ss-service-process">
      <div>
        <span className="ss-service-story__kicker">Implementation path</span>
        <h2>From first decision to working system</h2>
      </div>
      <ol>
        {story.process.map((step) => (
          <li key={step.label}>
            <strong>{step.label}</strong>
            <span>{step.detail}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ServiceMetrics({ story }: { story: ServiceStory }): ReactNode {
  return (
    <section className="ss-service-metrics" aria-label="Approved benchmark metrics">
      {story.metrics.map((metric) => (
        <article key={metric.id}>
          <strong>{metric.metricValueRaw}</strong>
          <span>{metric.metricName}</span>
          <small>{metric.impactArea}</small>
        </article>
      ))}
      <p className="ss-service-metrics__disclaimer">{benchmarkDisclaimer}</p>
    </section>
  );
}

function ServiceGovernance({ story }: { story: ServiceStory }): ReactNode {
  return (
    <section className="ss-service-governance">
      <div className="ss-service-governance__safeguard">
        <span>Human oversight</span>
        <p>{story.safeguard}</p>
      </div>
      <div className="ss-service-faq">
        <h2>Questions to resolve before build</h2>
        {story.faq.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
      <nav className="ss-service-related" aria-label="Related service links">
        <span>Related routes</span>
        {story.related.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </section>
  );
}

type ReservedDemo = {
  title: string;
  label: string;
  detail: string;
  configSlot: string;
};

function ReservedDemoSurface({ demo }: { demo: ReservedDemo }): ReactNode {
  return (
    <article className="ss-reserved-demo" data-config-slot={demo.configSlot}>
      <span>{demo.label}</span>
      <h3>{demo.title}</h3>
      <p>{demo.detail}</p>
      <small>Reserved forthcoming integration. Not live, not connected.</small>
    </article>
  );
}

const REQUIRED_DEMO_PLACEHOLDERS: Record<string, ReservedDemo[]> = {
  "/services/web-design-development": [
    {
      title: "Website preview slot one",
      label: "Reserved browser-window placeholder",
      detail:
        "Prepared for a future live website URL or embed once the approved integration is supplied.",
      configSlot: "futureWebsitePreviewPrimaryUrl",
    },
    {
      title: "Website preview slot two",
      label: "Reserved browser-window placeholder",
      detail:
        "Prepared for a second distinct live website URL or embed; no mock client site is presented as live.",
      configSlot: "futureWebsitePreviewSecondaryUrl",
    },
  ],
  "/services/ai-receptionists": [
    {
      title: "AI chat window",
      label: "Reserved AI receptionist chat placeholder",
      detail:
        "Prepared for a future approved chat integration. This surface does not simulate a successful real conversation.",
      configSlot: "futureReceptionistChatEmbedUrl",
    },
    {
      title: "ElevenLabs-ready receptionist call feature",
      label: "Reserved ElevenLabs call placeholder",
      detail:
        "Prepared for a future ElevenLabs call configuration after credentials, consent and scripts are approved.",
      configSlot: "futureReceptionistElevenLabsAgent",
    },
  ],
  "/services/ai-voice-agents": [
    {
      title: "ElevenLabs-ready voice call feature",
      label: "Reserved ElevenLabs call placeholder",
      detail:
        "Prepared for a future voice-agent integration. No microphone, phone number or live agent is connected.",
      configSlot: "futureVoiceElevenLabsAgent",
    },
    {
      title: "Illustrative transcript window",
      label: "Reserved transcript placeholder",
      detail:
        "Transcript layout only. Any sample transcript content is illustrative and awaits approved scripts.",
      configSlot: "futureVoiceTranscriptSource",
    },
  ],
};

function RequiredDemoPlaceholders({ route }: { route: FutureRouteRecord }): ReactNode {
  const placeholders = REQUIRED_DEMO_PLACEHOLDERS[route.path];
  if (!placeholders) {
    return null;
  }

  return (
    <section
      className="ss-reserved-demo-grid"
      aria-label={`${route.h1} reserved demo placeholders`}
    >
      {placeholders.map((demo) => (
        <ReservedDemoSurface demo={demo} key={demo.configSlot} />
      ))}
    </section>
  );
}

const SERVICE_STORIES: Record<string, ServiceStory> = {
  "/services": {
    variant: "directory",
    heading: "Choose the service by the workflow you want to improve",
    lead: "The directory is structured around business friction: missed demand, fragile systems, manual follow-up, content bottlenecks and decisions that need a practical roadmap before a build.",
    challenge:
      "Service pages become useful when they help a buyer choose the right first project, not when every capability sounds interchangeable.",
    image: SERVICE_IMAGES.workflow,
    outcomes: [
      "A clearer route from problem to service fit.",
      "Seven service routes, including consulting, connected to the same operating model.",
      "Internal links that guide buyers toward adjacent systems and relevant industry examples.",
    ],
    architecture: [
      {
        label: "Service fit",
        detail:
          "Each page starts with the business situation that makes the service useful.",
      },
      {
        label: "System context",
        detail:
          "Every service explains the surrounding data, tools, owners and handoffs.",
      },
      {
        label: "Human boundary",
        detail:
          "Automation, content and AI routes all show where review and escalation sit.",
      },
      {
        label: "Next decision",
        detail:
          "The directory points toward booking, consulting or a related capability.",
      },
    ],
    process: [
      {
        label: "Identify friction",
        detail: "Name the repeated problem before choosing technology.",
      },
      {
        label: "Pick the first surface",
        detail:
          "Choose the page, app, agent, receptionist, content system or advisory route.",
      },
      {
        label: "Map dependencies",
        detail: "Locate the systems and people the service must work with.",
      },
      {
        label: "Scope the next step",
        detail: "Move into discovery with a narrow first decision.",
      },
    ],
    metrics: selectMetrics("AI Agents & Automation Workflows", [
      "Time to first automation",
      "Extraction accuracy",
      "Document turnaround speed",
    ]),
    safeguard:
      "The directory does not promise outcomes. It helps a buyer pick a sensible starting point and keeps proofs, metrics and examples clearly illustrative until approved evidence exists.",
    faq: [
      {
        question: "Where should a buyer start?",
        answer:
          "Start with the route closest to the repeated operational friction, then use Consulting when the right first project is unclear.",
      },
      {
        question: "Can services combine?",
        answer:
          "Yes. The related routes show common pairings such as web plus content, app plus automation, or reception plus voice.",
      },
      {
        question: "Are the images product screenshots?",
        answer:
          "No. They are local illustrative panels used to explain service ideas and system boundaries.",
      },
    ],
    related: [
      { href: "/services/ai-consulting", label: "AI & Automation Consulting" },
      { href: "/industries", label: "Industries" },
      { href: "/how-we-work", label: "How we work" },
    ],
  },
  "/services/web-design-development": {
    variant: "conversion",
    heading: "A website system that turns attention into a clear next action",
    lead: "The page architecture, copy, visual language, CMS structure and technical base are treated as one conversion system instead of separate production tasks.",
    challenge:
      "Most rebuilds start with the surface. The useful work starts with the decision path a buyer needs to understand before they contact you.",
    image: SERVICE_IMAGES.generalOne,
    imageSecondary: SERVICE_IMAGES.generalTwoB,
    outcomes: [
      "A sharper information architecture for services, sectors and conversion routes.",
      "Responsive pages that stay readable across small phones and large desktop screens.",
      "Technical SEO, analytics and handoff points designed into the build from the start.",
    ],
    architecture: [
      {
        label: "Strategy",
        detail:
          "Audience, offer, positioning and conversion intent are defined before interface production.",
      },
      {
        label: "UX and IA",
        detail:
          "Navigation, service hierarchy, page sections and calls to action are mapped around buyer decisions.",
      },
      {
        label: "Visual system",
        detail:
          "A premium interface language is built from reusable patterns, not page-by-page decoration.",
      },
      {
        label: "Engineering",
        detail:
          "Responsive implementation, accessibility, performance, CMS and analytics are shipped as part of the site.",
      },
    ],
    process: [
      {
        label: "Clarify the offer",
        detail: "Reduce the page to the promise, proof, audience and next step.",
      },
      {
        label: "Map the journey",
        detail:
          "Design routes from discovery to enquiry without hiding important objections.",
      },
      {
        label: "Build the system",
        detail:
          "Implement reusable sections, technical SEO foundations and integration handoffs.",
      },
      {
        label: "Review and optimise",
        detail: "Use analytics and qualitative feedback to decide what changes next.",
      },
    ],
    metrics: selectMetrics("Web Development", [
      "Conversion increase",
      "Lead increase",
      "Online sales increase",
    ]),
    safeguard:
      "No ranking, conversion-rate or revenue guarantee is claimed. Portfolio-style visuals remain conceptual unless evidence and client permission are present.",
    faq: [
      {
        question: "Is this only a design service?",
        answer:
          "No. Strategy, copy structure, responsive build, technical SEO, accessibility and integration handoffs are part of the service.",
      },
      {
        question: "Can the site connect to existing systems?",
        answer:
          "Yes, where appropriate. Forms, booking calendars, CRMs, CMS workflows and analytics are scoped explicitly.",
      },
      {
        question: "What makes a first release sensible?",
        answer:
          "A first release should make the core offer clear, route enquiries reliably and leave future sections easy to extend.",
      },
    ],
    related: [
      { href: "/services/content-creation", label: "Content Creation & Repurposing" },
      { href: "/services/ai-automation", label: "AI Automation" },
      { href: "/services/ai-consulting", label: "AI & Automation Consulting" },
    ],
  },
  "/services/app-development": {
    variant: "product",
    heading: "A focused application surface for a real operational task",
    lead: "Discovery, prototype, data model, permissions, API boundaries, release readiness and optimisation are shaped around the smallest product that proves useful.",
    challenge:
      "Custom apps fail when they become a wish list. The first version needs one user group, one priority workflow and acceptance criteria people can test.",
    image: SERVICE_IMAGES.dataIntegration,
    imageSecondary: SERVICE_IMAGES.generalTwoB,
    outcomes: [
      "A prototype that explains the user, staff and system states before production code expands.",
      "Authentication, records and API integration designed around the data that matters.",
      "A release path for portals, internal tools and mobile-ready web experiences.",
    ],
    architecture: [
      {
        label: "Product discovery",
        detail:
          "Users, jobs, constraints and success evidence are narrowed before build.",
      },
      {
        label: "UX architecture",
        detail:
          "Flows, screens, roles and edge states are prototyped before implementation.",
      },
      {
        label: "Data and APIs",
        detail:
          "Records, integrations and source-of-truth decisions are documented explicitly.",
      },
      {
        label: "Readiness",
        detail:
          "Testing, monitoring, deployment handoff and iteration planning are included.",
      },
    ],
    process: [
      {
        label: "Define the first workflow",
        detail: "Choose the single flow that must work before everything else.",
      },
      {
        label: "Prototype the states",
        detail: "Validate user, staff and system states in a clickable model.",
      },
      {
        label: "Build the release",
        detail: "Implement the app surface, integrations, permissions and logs.",
      },
      {
        label: "Measure real use",
        detail: "Review errors, adoption and support signals before expanding scope.",
      },
    ],
    metrics: selectMetrics("App Development", [
      "No-show reduction",
      "Direct annual cost savings",
      "Administrative-time reduction",
    ]),
    safeguard:
      "The service does not imply unsupported native app delivery, platform certification or real client deployment evidence. Delivery scope is set by discovery and proposal.",
    faq: [
      {
        question: "Can this be mobile-ready without a native app?",
        answer:
          "Often yes. Many first releases work best as responsive web applications before a native route is justified.",
      },
      {
        question: "How are integrations handled?",
        answer:
          "Each API, webhook or data import is assessed for reliability, ownership, rate limits and fallback paths.",
      },
      {
        question: "What happens after first release?",
        answer:
          "The roadmap is reviewed against real use, support issues and the business value of the next feature.",
      },
    ],
    related: [
      { href: "/services/ai-automation", label: "AI Automation" },
      { href: "/services/web-design-development", label: "Web Design & Development" },
      { href: "/services/ai-consulting", label: "AI & Automation Consulting" },
    ],
  },
  "/services/ai-voice-agents": {
    variant: "voice",
    heading: "Voice workflows with a clear script, state model and human fallback",
    lead: "Inbound and outbound voice agents need call flows, approved responses, booking rules, CRM updates, summaries, monitoring and escalation before they touch live callers.",
    challenge:
      "A voice agent is not a talking FAQ. It is a stateful workflow that must disclose itself, understand boundaries and hand off safely.",
    image: SERVICE_IMAGES.followUp,
    imageSecondary: SERVICE_IMAGES.workflow,
    outcomes: [
      "A deterministic call-flow model for qualification, FAQs, booking and routing.",
      "An ElevenLabs-ready adapter surface that shows permission, listening, speaking, paused, error and complete states.",
      "CRM and follow-up handoffs that are visible to the team.",
    ],
    architecture: [
      {
        label: "Conversation design",
        detail:
          "Disclosure, prompts, retry limits and approved answer sources are defined.",
      },
      {
        label: "Action model",
        detail:
          "Booking, qualification, CRM update and summary actions are scoped by permission.",
      },
      {
        label: "Evaluation",
        detail:
          "Test calls, transcripts, failure paths and escalation quality are reviewed.",
      },
      {
        label: "Governance",
        detail:
          "Sensitive or unusual calls move to a person with context instead of improvisation.",
      },
    ],
    process: [
      {
        label: "Choose call types",
        detail: "Start with routine calls and explicit exclusion rules.",
      },
      {
        label: "Write approved paths",
        detail: "Script intents, answers, fallbacks and handoff summaries.",
      },
      {
        label: "Connect carefully",
        detail: "Integrate voice, calendar or CRM actions only after testing.",
      },
      {
        label: "Review transcripts",
        detail: "Use deterministic evaluation before expanding to more call types.",
      },
    ],
    metrics: selectMetrics("AI Voice Agents", [
      "Response time",
      "Weekly time saved",
      "New-patient booking increase",
    ]),
    safeguard:
      "The demo uses deterministic mock data. Live voice credentials, microphone access, call recording, consent and retention controls must be configured before production use.",
    faq: [
      {
        question: "Does the demo use a real voice provider?",
        answer:
          "No. It is provider-ready but intentionally deterministic unless credentials and approved scripts are configured.",
      },
      {
        question: "Can calls book appointments?",
        answer:
          "Only when the calendar rule, confirmation language and fallback owner are explicitly approved.",
      },
      {
        question: "What happens on uncertainty?",
        answer:
          "The flow pauses, retries within limits, or escalates to a person with a summary.",
      },
    ],
    related: [
      { href: "/services/ai-receptionists", label: "AI Receptionists" },
      { href: "/services/ai-automation", label: "AI Automation" },
      { href: "/services/ai-consulting", label: "AI & Automation Consulting" },
    ],
  },
  "/services/ai-receptionists": {
    variant: "reception",
    heading: "A front desk layer for calls, web enquiries, intake and routing",
    lead: "A useful AI receptionist is a controlled reception workflow: capture, qualify, schedule, remind, route, synchronise and leave an audit trail.",
    challenge:
      "The hard part is not answering everything. It is deciding what can be answered safely, what needs structured capture and what must reach a person.",
    image: SERVICE_IMAGES.generalOne,
    imageSecondary: SERVICE_IMAGES.generalThree,
    outcomes: [
      "Phone and digital reception routes that share the same operating rules.",
      "Structured intake, scheduling and CRM synchronisation for routine enquiries.",
      "Escalation paths for sensitive, complex or unusual requests.",
    ],
    architecture: [
      {
        label: "Intake rules",
        detail:
          "Minimum details, channel handling and qualification questions are designed.",
      },
      {
        label: "Scheduling",
        detail:
          "Booking requests, reminders and diary updates are scoped around existing systems.",
      },
      {
        label: "Routing",
        detail: "Messages, exceptions and high-risk requests have named owners.",
      },
      {
        label: "Audit trail",
        detail: "Every capture, handoff and failed path is visible for review.",
      },
    ],
    process: [
      {
        label: "Map the desk",
        detail: "List the repeated questions, channels and routing decisions.",
      },
      {
        label: "Approve answers",
        detail: "Create the safe response library and blocked topics.",
      },
      {
        label: "Connect handoffs",
        detail: "Wire booking, CRM, inbox or helpdesk destinations.",
      },
      {
        label: "Review live friction",
        detail: "Adjust rules based on handoffs, failed intents and staff feedback.",
      },
    ],
    metrics: selectMetrics("AI Receptionists", [
      "Phone availability increase",
      "Response time",
      "Direct annual cost savings",
    ]),
    safeguard:
      "Clinical, legal, financial, complaint or safety-related questions stay with authorised people. Reception automation supports first response, not professional judgement.",
    faq: [
      {
        question: "Can this work across phone and web chat?",
        answer:
          "Yes, if the same intake model and escalation rules are designed across the channels.",
      },
      {
        question: "How do reminders fit?",
        answer:
          "Reminders are scoped around consent, timing, channel preference and existing booking systems.",
      },
      {
        question: "What should not be automated?",
        answer:
          "Anything requiring professional judgement, sensitive interpretation or irreversible action.",
      },
    ],
    related: [
      { href: "/services/ai-voice-agents", label: "AI Voice Agents" },
      { href: "/services/ai-automation", label: "AI Automation" },
      { href: "/services/app-development", label: "App Development" },
    ],
  },
  "/services/content-creation": {
    variant: "editorial",
    heading: "A source-led content system with review built into every channel",
    lead: "Long-form articles, short-form social posts, email, service copy and publishing workflows work best when they trace back to approved expertise and a human review gate.",
    challenge:
      "Content volume is easy to generate. Credible content requires source material, brand control, claim checks, channel adaptation and feedback from performance signals.",
    image: SERVICE_IMAGES.generalTwoA,
    imageSecondary: SERVICE_IMAGES.workflow,
    outcomes: [
      "A transformation storyboard from interview, article or source document into channel-ready drafts.",
      "Editorial review, claim control and brand guidance before anything publishes.",
      "Analytics feedback that informs the next useful content decision.",
    ],
    architecture: [
      {
        label: "Knowledge extraction",
        detail: "Source documents, interviews and SME notes become the approved base.",
      },
      {
        label: "Editorial system",
        detail: "Topics, formats, channels and approvals are planned before drafting.",
      },
      {
        label: "Repurposing",
        detail:
          "Long-form material is adapted into email, social and sales enablement without inventing proof.",
      },
      {
        label: "Feedback loop",
        detail:
          "Content analytics inform future topics without chasing vanity metrics.",
      },
    ],
    process: [
      {
        label: "Collect sources",
        detail: "Gather expertise, claims, permissions and constraints.",
      },
      {
        label: "Plan formats",
        detail: "Choose blog, service copy, email and social uses for each source.",
      },
      {
        label: "Draft and review",
        detail: "Produce drafts that stay behind human approval.",
      },
      {
        label: "Publish and learn",
        detail: "Review performance and audience questions before the next cycle.",
      },
    ],
    metrics: selectMetrics("Content Creation", [
      "Campaigns running",
      "Bookings generated",
      "SEO and PPC ROI increase",
    ]),
    safeguard:
      "The system does not fabricate case studies, testimonials, expertise, regulated advice or results. Unsupported claims are blocked or marked for review.",
    faq: [
      {
        question: "Can AI draft content?",
        answer:
          "Yes, but only from approved source material, with brand and claim review before publication.",
      },
      {
        question: "How does repurposing stay coherent?",
        answer:
          "Each output traces to the same source and has a single intended audience and next step.",
      },
      {
        question: "Can this include SEO?",
        answer:
          "Yes. Search intent, internal links and page structure are part of the planning where relevant.",
      },
    ],
    related: [
      { href: "/services/web-design-development", label: "Web Design & Development" },
      { href: "/services/ai-automation", label: "AI Automation" },
      { href: "/services/ai-consulting", label: "AI & Automation Consulting" },
    ],
  },
  "/services/ai-automation": {
    variant: "automation",
    heading: "Agent and workflow systems with approvals, exceptions and monitoring",
    lead: "Automation covers triggers, APIs, tools, retrieval, memory, orchestration, conditional logic, approvals, exceptions, evaluation, security and deployment readiness.",
    challenge:
      "The risk is not using automation. The risk is hiding decisions inside an unchecked workflow with no owner when something unusual happens.",
    image: SERVICE_IMAGES.workflow,
    imageSecondary: SERVICE_IMAGES.dataIntegration,
    outcomes: [
      "A clear distinction between agents, chatbots, scripts and workflow automation.",
      "Human approval queues for exceptions and irreversible actions.",
      "Monitoring and review surfaces that keep owners close to the system.",
    ],
    architecture: [
      {
        label: "Triggers and tools",
        detail:
          "Events, APIs, documents and actions are mapped with permission boundaries.",
      },
      {
        label: "Logic and memory",
        detail:
          "Conditional routes, retrieval context and state are designed deliberately.",
      },
      {
        label: "Approvals",
        detail: "High-impact actions wait for named human review.",
      },
      {
        label: "Monitoring",
        detail: "Runs, errors, exceptions and drift are visible.",
      },
    ],
    process: [
      {
        label: "Find the handoff",
        detail: "Choose a repeated task where ownership is already clear.",
      },
      {
        label: "Map the system",
        detail: "Document data sources, destinations, triggers and stop conditions.",
      },
      {
        label: "Build with checkpoints",
        detail: "Ship the first workflow with logs and approval gates.",
      },
      {
        label: "Evaluate and expand",
        detail: "Use run history and exception rates to choose the next workflow.",
      },
    ],
    metrics: selectMetrics("AI Agents & Automation Workflows", [
      "Document-processing cost reduction",
      "Extraction accuracy",
      "Time to first automation",
    ]),
    safeguard:
      "No autonomous, irreversible or high-impact action should run without explicit approval design, monitoring and fallback ownership.",
    faq: [
      {
        question: "How are agents different from chatbots?",
        answer:
          "Agents can use tools and state to complete tasks, while chatbots usually answer or collect information. Both still need boundaries.",
      },
      {
        question: "What should be automated first?",
        answer:
          "A repeated, rules-led handoff with clear data ownership and low consequence if held for review.",
      },
      {
        question: "How is security handled?",
        answer:
          "Access, retention, credentials, logs and permissions are treated as design requirements, not afterthoughts.",
      },
    ],
    related: [
      { href: "/services/ai-consulting", label: "AI & Automation Consulting" },
      { href: "/services/app-development", label: "App Development" },
      { href: "/services/ai-receptionists", label: "AI Receptionists" },
    ],
  },
  "/services/ai-consulting": {
    variant: "consulting",
    heading: "Advisory for leaders deciding what to automate, buy or build",
    lead: "Consulting covers opportunity audits, prioritisation, roadmaps, build-versus-buy, vendor and model selection, architecture review, data readiness, responsible AI, security, procurement and enablement.",
    challenge:
      "The expensive mistake is choosing a tool before the organisation understands which workflow, risk and operating owner the tool is meant to support.",
    image: SERVICE_IMAGES.consulting,
    outcomes: [
      "A prioritised automation roadmap that separates quick wins from expensive detours.",
      "Architecture and data-readiness review before procurement or implementation.",
      "Governance, responsible AI and evaluation checkpoints the business can understand.",
    ],
    architecture: [
      {
        label: "Leadership advisory",
        detail:
          "Translate ambition into decisions, constraints and accountable owners.",
      },
      {
        label: "Opportunity audit",
        detail:
          "Find repeatable workflows, bottlenecks, data gaps and human review points.",
      },
      {
        label: "Model and vendor route",
        detail: "Compare configure, buy, build and leave-alone options.",
      },
      {
        label: "Implementation oversight",
        detail:
          "Support procurement, security, enablement, evaluation and rollout governance.",
      },
    ],
    process: [
      {
        label: "Audit the operating model",
        detail: "Document workflows, systems, decision rights and measurable friction.",
      },
      {
        label: "Prioritise the roadmap",
        detail:
          "Sequence initiatives by value, risk, data readiness and delivery path.",
      },
      {
        label: "Review architecture",
        detail:
          "Assess vendors, models, integrations, privacy and security implications.",
      },
      {
        label: "Enable the team",
        detail: "Create decision notes, operating guidance and review checkpoints.",
      },
    ],
    metrics: selectMetrics("AI Agents & Automation Workflows", [
      "Monthly time saved per person",
      "Manual operations overhead reduction",
      "Hours saved",
    ]),
    safeguard:
      "Consulting does not endorse a vendor, promise a return or replace legal, procurement, security or data-protection advice. It gives leaders a clearer technical and commercial decision route.",
    faq: [
      {
        question: "When is consulting better than build work?",
        answer:
          "When the business can feel the opportunity but has not chosen the right workflow, vendor route or governance model.",
      },
      {
        question: "Can this support internal teams?",
        answer:
          "Yes. The route is suitable for SMEs, scale-ups, corporate functions and technical teams that need an external architecture and prioritisation lens.",
      },
      {
        question: "What is the output?",
        answer:
          "A practical audit, prioritised roadmap, build-versus-buy reasoning and next-step implementation guidance.",
      },
    ],
    related: [
      { href: "/services/ai-automation", label: "AI Automation" },
      { href: "/services/app-development", label: "App Development" },
      { href: "/how-we-work", label: "How we work" },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/* Service detail registry                                                     */
/* -------------------------------------------------------------------------- */

type ServiceModule = {
  signature: ReactNode;
  scenario: DemoScenario;
  tools: ToolEntry[];
};

const SERVICE_MODULES: Record<string, ServiceModule> = {
  "/services/web-design-development": {
    signature: <ConversionPathLens />,
    scenario: sequentialScenario(
      "web-conversion",
      "Conversion path mapper",
      "A synthetic walk that arranges a page outline into one clear path. Structure only.",
      "Synthetic & deterministic — no live data, and it does not predict conversion rate, ranking or revenue.",
      webConversion,
    ),
    tools: [
      {
        name: "Booking calendars",
        category: "Scheduling",
        note: "Embed a calendar so the primary action can be “book”, not “contact us”.",
      },
      {
        name: "CRM handoff",
        category: "CRM",
        note: "Form submissions can be routed into a CRM so enquiries are never lost.",
      },
      {
        name: "Email & newsletter",
        category: "Email",
        note: "Opt-in capture with double-opt-in patterns and clear consent.",
      },
      {
        name: "Payments & checkout",
        category: "Payments",
        note: "Where selling online is in scope, a checkout path is designed into the route.",
      },
      {
        name: "Analytics",
        category: "Analytics",
        note: "Privacy-respecting analytics so you can see which paths get used.",
      },
      {
        name: "Helpdesk",
        category: "CRM",
        note: "Support enquiries can be routed to a shared inbox or helpdesk tool.",
      },
    ],
  },
  "/services/app-development": {
    signature: <ProductStateStack />,
    scenario: sequentialScenario(
      "app-state",
      "First-release state map",
      "A synthetic map of the smallest useful release across user, staff and system states.",
      "Synthetic & deterministic — it maps structure only and never estimates cost, effort or delivery time.",
      appState,
    ),
    tools: [
      {
        name: "Identity & sign-in",
        category: "Authentication",
        note: "Role-based sign-in so each person sees only what they should.",
      },
      {
        name: "Payments",
        category: "Payments",
        note: "Where charging is in scope, a payment path is designed into the flow.",
      },
      {
        name: "CRM & records",
        category: "CRM",
        note: "Sync key records with an existing CRM so the team has one view.",
      },
      {
        name: "Product analytics",
        category: "Analytics",
        note: "Privacy-respecting analytics to see which flows people actually use.",
      },
      {
        name: "Notifications",
        category: "Messaging",
        note: "Email, SMS or push notifications at the right point in the flow.",
      },
      {
        name: "Error monitoring",
        category: "Analytics",
        note: "Capture and triage errors so issues are found before users report them.",
      },
    ],
  },
  "/services/ai-voice-agents": {
    signature: <CallFlowOscilloscope />,
    scenario: voiceAgentAdapter,
    tools: [
      {
        name: "Telephony",
        category: "Telephony",
        note: "Connect to a phone number and call-routing provider so calls reach the flow.",
      },
      {
        name: "Booking calendars",
        category: "Scheduling",
        note: "Offer a slot during a call where an appointment is the right action.",
      },
      {
        name: "CRM handoff",
        category: "CRM",
        note: "Captured details can be written to a CRM so the team has context.",
      },
      {
        name: "SMS follow-up",
        category: "Messaging",
        note: "Send a confirmation or link by message after a call, with consent.",
      },
      {
        name: "Call analytics",
        category: "Analytics",
        note: "See call volumes and outcomes by type, with transcripts to audit.",
      },
      {
        name: "Helpdesk",
        category: "CRM",
        note: "Escalations can open a ticket with a named owner and a clear queue.",
      },
    ],
  },
  "/services/ai-receptionists": {
    signature: <FrontDeskConvergence />,
    scenario: sequentialScenario(
      "reception-console",
      "Front-desk routing",
      "A synthetic walk that sorts one enquiry into the right lane using approved content.",
      "Synthetic & deterministic — no real enquiry, no live integration. Sensitive matters are never automated.",
      receptionConsole,
    ),
    tools: [
      {
        name: "Booking calendars",
        category: "Scheduling",
        note: "Offer and hold slots so a booking can be the destination.",
      },
      {
        name: "CRM handoff",
        category: "CRM",
        note: "Captured messages and contacts can be written to a CRM.",
      },
      {
        name: "Web chat & messaging",
        category: "Messaging",
        note: "Bring web chat and messaging channels into the one intake queue.",
      },
      {
        name: "Shared inbox",
        category: "Email",
        note: "Route captured messages to the right shared inbox with an owner.",
      },
      {
        name: "Telephony",
        category: "Telephony",
        note: "Bring phone calls into the same desk as web and messaging.",
      },
      {
        name: "Helpdesk",
        category: "CRM",
        note: "Open a ticket for any enquiry that needs a person to follow up.",
      },
    ],
  },
  "/services/content-creation": {
    signature: <EditorialLoom />,
    scenario: sequentialScenario(
      "content-loom",
      "Governed repurposing plan",
      "A synthetic plan that shapes one source into channel outputs behind a review gate.",
      "Synthetic & deterministic — it plans structure only and never writes copy, invents facts or publishes.",
      contentLoom,
    ),
    tools: [
      {
        name: "Website CMS",
        category: "CMS",
        note: "Draft into your CMS so website outputs land where you edit them.",
      },
      {
        name: "Email & newsletter",
        category: "Email",
        note: "Prepare a newsletter version for your email platform, ready to review.",
      },
      {
        name: "Social scheduling",
        category: "Social",
        note: "Queue per-platform posts for a person to approve before they go live.",
      },
      {
        name: "Content analytics",
        category: "Analytics",
        note: "See which pieces resonated, without chasing vanity metrics.",
      },
      {
        name: "Source documents",
        category: "Documents",
        note: "Pull from approved source documents so facts trace to an owner.",
      },
      {
        name: "Media library",
        category: "CMS",
        note: "Use approved imagery and assets, with captions added on publish.",
      },
    ],
  },
  "/services/ai-automation": {
    signature: <ProcessLattice />,
    scenario: automationLattice,
    tools: [
      {
        name: "Workflow runners",
        category: "Workflow",
        note: "Orchestrate steps, branches and retries with an event log for every run.",
      },
      {
        name: "CRM records",
        category: "CRM",
        note: "Read and update customer records as a step, never as an unchecked deletion.",
      },
      {
        name: "Email & messaging",
        category: "Email",
        note: "Send templated, reviewed messages — with a human checkpoint where it matters.",
      },
      {
        name: "Files & storage",
        category: "Storage",
        note: "File and fetch documents so a record is never re-keyed by hand.",
      },
      {
        name: "Reporting",
        category: "Analytics",
        note: "Summarise runs, exceptions and approvals so owners can see the whole picture.",
      },
      {
        name: "Approval queues",
        category: "Workflow",
        note: "Hold flagged items for a named person, with a clear accept or decline.",
      },
    ],
  },
  "/services/ai-consulting": {
    signature: <ProcessLattice />,
    scenario: sequentialScenario(
      "consulting-roadmap",
      "Automation roadmap builder",
      "A synthetic advisory sequence that turns operating friction into a prioritised roadmap.",
      "Synthetic & deterministic — no vendor endorsement, procurement advice or guaranteed business case.",
      consultingRoadmap,
    ),
    tools: [
      {
        name: "Process inventory",
        category: "Discovery",
        note: "List repeatable workflows, owners and current failure points before choosing tools.",
      },
      {
        name: "Data readiness map",
        category: "Architecture",
        note: "Clarify record ownership, quality, permissions and retention constraints.",
      },
      {
        name: "Vendor shortlist",
        category: "Procurement",
        note: "Compare configure, buy and build options without defaulting to a preferred platform.",
      },
      {
        name: "Governance register",
        category: "Governance",
        note: "Track approval points, review owners, risk notes and escalation paths.",
      },
      {
        name: "Implementation roadmap",
        category: "Delivery",
        note: "Sequence first decisions, dependencies and proof points for a controlled rollout.",
      },
      {
        name: "Enablement notes",
        category: "Adoption",
        note: "Give internal teams plain-language operating guidance and review checkpoints.",
      },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/* Industry detail registry                                                    */
/* -------------------------------------------------------------------------- */

type IndustryData = {
  id: string;
  sector: string;
  instrument: string;
  caption: string;
  object: string;
  human: string;
  autoStages: string[];
  autoSummary: string;
  boundary: string;
  tools: ToolEntry[];
};

const INDUSTRY_DATA: Record<string, IndustryData> = {
  "/services/estate-agents": {
    id: "industry-estate-agents",
    sector: "Estate agents",
    instrument: "Property-enquiry switchboard",
    caption:
      "A synthetic walk: an incoming request is sorted into a lane and a summary is prepared for the branch — or a vendor or landlord update is routed straight to a person.",
    object: "viewing request",
    human: "the branch team",
    autoStages: [
      "Captured",
      "Sorted to lane",
      "Viewing slot offered",
      "Summary ready for branch",
    ],
    autoSummary:
      "Synthetic run: the request is captured, sorted and a viewing slot is offered, then a summary is handed to the branch to confirm. Nothing is booked automatically.",
    boundary:
      "Automation captures and prepares — it never values a property, negotiates, or replies to an owner on the branch's behalf. The sensitive relationship always reaches a person.",
    tools: [
      {
        name: "Booking calendars",
        category: "Scheduling",
        note: "Offer a viewing slot at the moment of interest instead of a callback promise.",
      },
      {
        name: "CRM handoff",
        category: "CRM",
        note: "Route enquiries into your CRM so a lead is never lost between portals.",
      },
      {
        name: "Portal capture",
        category: "Portals",
        note: "Bring portal leads into one place alongside web and phone enquiries.",
      },
      {
        name: "Email & nurture",
        category: "Email",
        note: "Keep buyers warm with consent-based, clearly-owned follow-ups.",
      },
      {
        name: "Analytics",
        category: "Analytics",
        note: "See which enquiry routes actually get used.",
      },
    ],
  },
  "/services/hospitality": {
    id: "industry-hospitality",
    sector: "Hospitality",
    instrument: "Guest-journey service bell",
    caption:
      "A synthetic walk: a guest message is matched to the reservation and a reply is prepared — or it rings through to staff for anything safety-related.",
    object: "reservation",
    human: "the duty manager",
    autoStages: [
      "Captured",
      "Matched to reservation",
      "Option offered",
      "Summary ready for staff",
    ],
    autoSummary:
      "Synthetic run: the message is matched to a reservation, an option is offered and a summary is prepared for staff to confirm. Nothing is committed automatically.",
    boundary:
      "Allergy, accessibility, complaint and emergency matters turn straight to your team. Automation handles availability and admin around the reservation — never a safety-critical answer.",
    tools: [
      {
        name: "Booking calendars",
        category: "Scheduling",
        note: "Offer and change tables around one reservation record.",
      },
      {
        name: "Reservation system",
        category: "Bookings",
        note: "Keep one source of truth for every table and change.",
      },
      {
        name: "Messaging",
        category: "Messaging",
        note: "Bring guest messages into the same place as the booking.",
      },
      {
        name: "Email confirmations",
        category: "Email",
        note: "Send clear, consent-based confirmations and reminders.",
      },
      {
        name: "Payments & deposits",
        category: "Payments",
        note: "Take deposits for large bookings where that is your policy.",
      },
    ],
  },
  "/services/salons-barbers": {
    id: "industry-salons-barbers",
    sector: "Salons & barbers",
    instrument: "Chair-and-calendar availability weave",
    caption:
      "A synthetic walk: service, stylist and deposit are matched into one slot — or a suitability question is stopped at the practitioner.",
    object: "booking",
    human: "the stylist",
    autoStages: [
      "Captured",
      "Matched to stylist",
      "Slot & deposit offered",
      "Summary ready for desk",
    ],
    autoSummary:
      "Synthetic run: service, stylist and deposit are woven into one slot and a summary is prepared for the desk to confirm. Nothing is booked automatically.",
    boundary:
      "Patch tests, suitability and sensitive requests are decided by the stylist, never by a form. Automation arranges the slot; the practitioner makes the call.",
    tools: [
      {
        name: "Booking calendars",
        category: "Scheduling",
        note: "Match service length to the right stylist's availability.",
      },
      {
        name: "Deposits & payments",
        category: "Payments",
        note: "Take a deposit to protect the chair where that is your policy.",
      },
      {
        name: "CRM & client history",
        category: "CRM",
        note: "Recognise returning clients and their usual service.",
      },
      {
        name: "Reminders",
        category: "Messaging",
        note: "Reduce no-shows with clear, consent-based reminders.",
      },
      {
        name: "Email",
        category: "Email",
        note: "Send confirmations and rebooking nudges with consent.",
      },
    ],
  },
  "/services/trades": {
    id: "industry-trades",
    sector: "Trades",
    instrument: "Job-intake dispatch board",
    caption:
      "A synthetic walk: the basics are captured and a callback is prepared — or an emergency is flagged for a person right away.",
    object: "callback request",
    human: "the office",
    autoStages: [
      "Captured",
      "Triaged by job type",
      "Callback slot offered",
      "Summary ready for office",
    ],
    autoSummary:
      "Synthetic run: location, job type and photos are captured, the enquiry is triaged and a callback is offered, then a summary is prepared for the office. Price and attendance stay unconfirmed.",
    boundary:
      "Attendance time, price and anything safety-related are never confirmed automatically. The board prepares the job; your team commits to it.",
    tools: [
      {
        name: "Booking calendars",
        category: "Scheduling",
        note: "Offer a callback or visit window instead of a vague promise.",
      },
      {
        name: "CRM & job records",
        category: "CRM",
        note: "Keep each enquiry, photo and note against one job.",
      },
      {
        name: "Messaging & photos",
        category: "Messaging",
        note: "Collect a photo and address up front so quotes move faster.",
      },
      {
        name: "Location & maps",
        category: "Maps",
        note: "Capture and check the job location at intake.",
      },
      {
        name: "Email",
        category: "Email",
        note: "Send confirmations and follow-ups with consent.",
      },
    ],
  },
  "/services/ecommerce": {
    id: "industry-ecommerce",
    sector: "E-commerce",
    instrument: "Order-state conveyor",
    caption:
      "A synthetic walk: a customer message is matched to an order state and a reply is drafted — or a refund or return is held for a person.",
    object: "order message",
    human: "a support agent",
    autoStages: [
      "Captured",
      "Matched to order",
      "Reply drafted",
      "Summary ready for support",
    ],
    autoSummary:
      "Synthetic run: the message is matched to an order state and a reply is drafted for support to send. Nothing is sent or changed automatically.",
    boundary:
      "Refunds, goodwill and disputes are always a human decision. The conveyor drafts and routes; it never issues money or resolves a dispute on its own.",
    tools: [
      {
        name: "Helpdesk",
        category: "Helpdesk",
        note: "Bring every message into one queue, tagged by order state.",
      },
      {
        name: "Store & orders",
        category: "Store",
        note: "Read order status to answer the repetitive questions accurately.",
      },
      {
        name: "Payments & refunds",
        category: "Payments",
        note: "Prepare a refund for a person to approve — never auto-issue.",
      },
      {
        name: "Email",
        category: "Email",
        note: "Send drafted, reviewed replies and post-purchase messages.",
      },
      {
        name: "Analytics",
        category: "Analytics",
        note: "See which message types dominate the queue.",
      },
    ],
  },
  "/services/physios-chiropractors": {
    id: "industry-physios-chiropractors",
    sector: "Physios & chiropractors",
    instrument: "Non-clinical intake boundary",
    caption:
      "A synthetic walk: routine booking is routed to preparation — and anything clinical or urgent is sent straight to the clinic team.",
    object: "appointment",
    human: "the clinic team",
    autoStages: ["Captured", "Matched to clinic", "Slot offered", "Prep summary ready"],
    autoSummary:
      "Synthetic run: contact, clinic preference and a high-level reason are captured, a slot is offered and a preparation summary is readied. No clinical content is handled.",
    boundary:
      "Symptoms, urgency and out-of-scope questions go straight to a clinician or urgent-care guidance. Automation handles booking and preparation only — never triage, advice or diagnosis.",
    tools: [
      {
        name: "Booking calendars",
        category: "Scheduling",
        note: "Offer routine appointments without clinical questions.",
      },
      {
        name: "CRM & records",
        category: "CRM",
        note: "Keep non-clinical contact and preference details together.",
      },
      {
        name: "Intake forms",
        category: "Forms",
        note: "Collect high-level, non-clinical details before a visit.",
      },
      {
        name: "Reminders",
        category: "Messaging",
        note: "Reduce missed appointments with consent-based reminders.",
      },
      {
        name: "Email",
        category: "Email",
        note: "Send confirmations and preparation notes with consent.",
      },
    ],
  },
  "/services/dentists": {
    id: "industry-dentists",
    sector: "Dentists",
    instrument: "Patient-admin recall orbit",
    caption:
      "A synthetic walk: recalls, forms and diary changes are handled — and anything clinical is routed to the practice team.",
    object: "patient request",
    human: "the practice team",
    autoStages: [
      "Captured",
      "Matched to record",
      "Slot or recall offered",
      "Summary ready for practice",
    ],
    autoSummary:
      "Synthetic run: the request is matched to a record and a recall or slot is offered, then a summary is prepared for the practice. No clinical decision is made.",
    boundary:
      "Treatment decisions, clinical questions and urgent symptoms never enter automation. The orbit handles admin; the clinician owns care.",
    tools: [
      {
        name: "Booking & recalls",
        category: "Scheduling",
        note: "Offer recalls and appointments without manual chasing.",
      },
      {
        name: "Patient records (admin)",
        category: "CRM",
        note: "Keep non-clinical admin details against the right record.",
      },
      {
        name: "Forms",
        category: "Forms",
        note: "Collect new-patient admin details ahead of a visit.",
      },
      {
        name: "Reminders",
        category: "Messaging",
        note: "Nudge recalls and forms with consent-based reminders.",
      },
      {
        name: "Email",
        category: "Email",
        note: "Send confirmations and recall notices with consent.",
      },
    ],
  },
  "/services/gyms-fitness-studios": {
    id: "industry-gyms-fitness-studios",
    sector: "Gyms & fitness studios",
    instrument: "Trial-to-membership roster",
    caption:
      "A synthetic walk: a class is booked and the follow-up prepared — and injuries or disputes are diverted to staff.",
    object: "trial booking",
    human: "the front desk",
    autoStages: [
      "Captured",
      "Matched to class",
      "Slot & consent offered",
      "Follow-up summary ready",
    ],
    autoSummary:
      "Synthetic run: the enquiry is matched to a class, a slot and consent are offered and a follow-up is prepared. Nothing is charged or committed automatically.",
    boundary:
      "Injuries, refunds and sensitive member issues divert to your team. The roster handles bookings and follow-ups, not duty-of-care or money decisions.",
    tools: [
      {
        name: "Class booking",
        category: "Scheduling",
        note: "Offer trials and classes with consent captured up front.",
      },
      {
        name: "Payments & memberships",
        category: "Payments",
        note: "Prepare membership sign-up for a person to confirm.",
      },
      {
        name: "CRM",
        category: "CRM",
        note: "Track trials through to membership in one place.",
      },
      {
        name: "Follow-up messaging",
        category: "Messaging",
        note: "Keep trials warm with a clear, consent-based next step.",
      },
      {
        name: "Email",
        category: "Email",
        note: "Send confirmations and follow-ups with consent.",
      },
    ],
  },
  "/services/fitness-coaches": {
    id: "industry-fitness-coaches",
    sector: "Fitness coaches",
    instrument: "DM-to-consultation pathway",
    caption:
      "A synthetic walk: fit questions are asked and a consultation offered — and any health disclosure is held for the coach.",
    object: "consultation request",
    human: "the coach",
    autoStages: [
      "Captured",
      "Fit questions asked",
      "Consultation offered",
      "Handoff summary ready",
    ],
    autoSummary:
      "Synthetic run: the message is captured, a few fit questions are asked and a consultation is offered, then a concise handoff summary is prepared. Nothing is assessed automatically.",
    boundary:
      "Health disclosures, injuries and suitability are assessed by the coach, never by automation. The pathway summarises; the coach decides.",
    tools: [
      {
        name: "Booking calendars",
        category: "Scheduling",
        note: "Offer a consultation slot the moment fit is clear.",
      },
      {
        name: "Messaging",
        category: "Messaging",
        note: "Organise DMs into one place with a clear next step.",
      },
      {
        name: "CRM",
        category: "CRM",
        note: "Track enquiries from first message to consultation.",
      },
      {
        name: "Payments",
        category: "Payments",
        note: "Prepare programme sign-up for you to confirm.",
      },
      {
        name: "Email",
        category: "Email",
        note: "Send resources and follow-ups with consent.",
      },
    ],
  },
};

function industryScenario(data: IndustryData): DemoScenario {
  const stages = data.autoStages;
  function flowRows(activeCount: number, activeIndex: number): TileRow[] {
    return stages.map((label, index) => {
      let state: string;
      if (index >= activeCount) {
        state = "Waiting";
      } else if (index === activeIndex) {
        state = "Active";
      } else {
        state = "Cleared";
      }
      return {
        label: `${pad(index + 1)} · ${label}`,
        value: state,
        active: index === activeIndex,
      };
    });
  }
  return {
    id: data.id,
    title: data.instrument,
    summary: data.caption,
    safeguard:
      "Synthetic & deterministic — no real data; nothing is confirmed, booked or decided automatically.",
    interval: 560,
    idle: () => (
      <StageTiles
        rows={flowRows(0, -1)}
        summary="Idle — press Start to route the request."
        synthetic="Synthetic workflow"
      />
    ),
    build: () => {
      const steps: DemoStep[] = stages.map((label, index) => ({
        id: `stage-${String(index)}`,
        log: `Stage ${String(index + 1)}: ${label}.`,
        status: `Routing… step ${String(index + 1)} of ${String(stages.length)}.`,
        render: () => (
          <StageTiles
            rows={flowRows(index + 1, index)}
            synthetic="Synthetic workflow"
          />
        ),
      }));
      steps.push({
        id: "summary",
        log: "Summary ready for a person to confirm.",
        status: "Done. Reset to try another request.",
        render: () => (
          <StageTiles
            rows={flowRows(stages.length, -1)}
            summary={data.autoSummary}
            synthetic="Synthetic workflow"
          />
        ),
      });
      return steps;
    },
  };
}

function industrySteps(data: IndustryData): InstrumentStep[] {
  return [
    {
      label: "Intake",
      detail: `A ${data.object} arrives and is captured against one record.`,
    },
    {
      label: "Triage",
      detail:
        "Routine requests are sorted into a lane and prepared — never decided automatically.",
    },
    {
      label: "Hand-off",
      detail: `Anything sensitive is routed straight to ${data.human}.`,
    },
  ];
}

/* -------------------------------------------------------------------------- */
/* Public mount helpers                                                        */
/* -------------------------------------------------------------------------- */

function VisualRoot({ children }: { children: ReactNode }): ReactNode {
  return <div className="ss-visual-root">{children}</div>;
}

/**
 * Visuals for `/services` and each `/services/<service-slug>` detail page.
 * The index renders the decision matrix; each service renders its signature
 * lens, a synthetic demo, and the connector rail.
 */
export function ServicePageVisuals({ route }: { route: FutureRouteRecord }): ReactNode {
  if (route.path === "/services") {
    const story = SERVICE_STORIES[route.path];
    return (
      <VisualRoot>
        {story ? (
          <>
            <ServiceStoryBlock route={route} story={story} />
            <ServiceArchitecture story={story} />
            <ServiceMetrics story={story} />
          </>
        ) : null}
        <ServicesDecisionMatrix />
        {story ? (
          <>
            <ServiceProcess story={story} />
            <ServiceGovernance story={story} />
          </>
        ) : null}
      </VisualRoot>
    );
  }

  const approvedService = getApprovedServiceContent(route.path);
  if (approvedService) {
    return <ApprovedServicePageVisuals service={approvedService} />;
  }

  const module = SERVICE_MODULES[route.path];
  if (!module) {
    return null;
  }

  const story = SERVICE_STORIES[route.path];

  return (
    <VisualRoot>
      {story ? <ServiceStoryBlock route={route} story={story} /> : null}
      {module.signature}
      {story ? (
        <>
          <ServiceArchitecture story={story} />
          <ServiceProcess story={story} />
          <ServiceMetrics story={story} />
          {story.imageSecondary ? (
            <ServicePicture image={story.imageSecondary} />
          ) : null}
        </>
      ) : null}
      <RequiredDemoPlaceholders route={route} />
      <DemoShell scenario={module.scenario} />
      {story ? <ServiceGovernance story={story} /> : null}
      <ToolsCarousel label={SERVICE_TOOLS_LABEL} tools={module.tools} />
    </VisualRoot>
  );
}

/**
 * Visuals for each `/services/<industry-slug>` page (template === "industry"):
 * the operating instrument, a synthetic switchboard demo, and the sector rail.
 */
export function IndustryPageVisuals({
  route,
}: {
  route: FutureRouteRecord;
}): ReactNode {
  const data = INDUSTRY_DATA[route.path];
  if (!data) {
    return null;
  }

  return (
    <VisualRoot>
      <IndustryInstrument
        boundary={data.boundary}
        caption={data.caption}
        instrument={data.instrument}
        sector={data.sector}
        steps={industrySteps(data)}
      />
      <DemoShell scenario={industryScenario(data)} />
      <ToolsCarousel label={INDUSTRY_TOOLS_LABEL} tools={data.tools} />
    </VisualRoot>
  );
}

/** Visuals for the `/industries` index — the sector atlas. */
export function IndustriesIndexVisuals(): ReactNode {
  return (
    <VisualRoot>
      <IndustriesAtlas basePath="/services" />
    </VisualRoot>
  );
}
