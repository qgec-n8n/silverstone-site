import type { ReactNode } from "react";

import type { FutureRouteRecord } from "~/data/route-schema";
import {
  DemoShell,
  type DemoScenario,
  type DemoStep,
} from "~/visual/components/demo-shell";
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
      detail: "Place recognisable client logos beside the action so it is read in context.",
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
  status: (index, total) => `Assembling path… step ${String(index + 1)} of ${String(total + 1)}.`,
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
      detail: "A clickable model of “request a slot” is reviewed before any production code.",
      log: "Prototype — User (customer): A clickable model of “request a slot” is reviewed before any production code.",
    },
    {
      label: "Validate · Staff",
      detail: "Staff checks the request against approved rules — the decision stays with a person.",
      log: "Validate — Staff: Staff checks the request against approved rules — the decision stays with a person.",
    },
    {
      label: "Record · System",
      detail: "One Booking record becomes the source of truth, with history.",
      log: "Record — System: One Booking record becomes the source of truth, with history.",
    },
    {
      label: "Release · Staff",
      detail: "Staff releases the smallest useful version; everything else moves to the roadmap.",
      log: "Release — Staff: Staff releases the smallest useful version; everything else moves to the roadmap.",
    },
  ],
  status: (index, total) => `Mapping first release… state ${String(index + 1)} of ${String(total + 1)}.`,
  finalLog: "Roadmap recorded: Loyalty points, Multi-location rules, Waitlist automation.",
  finalStatus: "First release mapped. Reset to try another combination.",
  summary:
    "Synthetic map for “take bookings online”: the core flow ships first across user, staff and system states, with 3 features deferred to a roadmap. This maps structure only — it does not estimate cost, effort or delivery time.",
  idleNote: "Idle — press Start to map the first release.",
  extra: (
    <>
      <p className="ss-demo__synthetic">Deferred to roadmap</p>
      <ul className="ss-demo__tiles">
        {["Loyalty points", "Multi-location rules", "Waitlist automation"].map((item) => (
          <li className="ss-tile" data-active="false" key={item}>
            <span className="ss-tile__value">{item}</span>
          </li>
        ))}
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
  status: (index, total) => `Routing enquiry… step ${String(index + 1)} of ${String(total + 1)}.`,
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
      detail: "Unsupported stats, testimonials and regulated advice flagged and blocked.",
      log: "Claim check: Unsupported stats, testimonials and regulated advice flagged and blocked.",
    },
    {
      label: "Review gate",
      detail: "A person approves each output before anything can publish.",
      log: "Review gate: A person approves each output before anything can publish.",
    },
  ],
  status: (index, total) => `Planning content… step ${String(index + 1)} of ${String(total + 1)}.`,
  finalLog: "Plan ready (synthetic). Nothing written or published.",
  finalStatus: "Plan complete. Reset to try another combination.",
  summary:
    "Synthetic plan from one customer case study: 4 channel outputs, each behind a review gate, with unsupported claims blocked. This plans structure only — it does not write copy, invent facts or publish.",
  idleNote: "Idle — press Start to plan the content.",
};

/* Voice call flow — a time-based synthetic transcript. */
const voiceLines: { who: string; text: string }[] = [
  { who: "Assistant", text: "Hi — you’re speaking to an automated assistant. How can I help?" },
  { who: "Caller", text: "What time do you open on Saturday?" },
  { who: "System", text: "Intent: opening-hours enquiry." },
  { who: "System", text: "Approved-rules check: answer from approved opening hours only." },
  { who: "Assistant", text: "We’re open 9am to 1pm on Saturdays. Anything else?" },
];

const voiceSummary =
  "Routine call answered from approved content. No personal data captured. This is a synthetic, deterministic flow — not a real call, and not a person.";

function voiceTranscript(count: number): TileRow[] {
  return voiceLines.slice(0, count).map((line) => ({ label: line.who, value: line.text }));
}

const voiceCallflow: DemoScenario = {
  id: "voice-callflow",
  title: "Defined call flow",
  summary: "A scripted, time-based walk through one routine call answered from approved content.",
  safeguard:
    "Synthetic & deterministic — not a real call, no real audio, and no claim of human equivalence.",
  temporal: true,
  interval: 900,
  idle: () => (
    <StageTiles
      rows={[]}
      summary="Idle — press Start to run the synthetic flow."
      synthetic="Synthetic call transcript"
    />
  ),
  build: () => {
    const steps: DemoStep[] = voiceLines.map((line, index) => ({
      id: `line-${String(index)}`,
      log: `${line.who}: ${line.text}`,
      status: `Call in progress… line ${String(index + 1)} of ${String(voiceLines.length + 1)}.`,
      render: () => (
        <StageTiles rows={voiceTranscript(index + 1)} synthetic="Synthetic call transcript" />
      ),
    }));
    steps.push({
      id: "summary",
      log: "Call ended (synthetic).",
      status: "Call complete. Reset to try another call type.",
      render: () => (
        <StageTiles
          rows={voiceTranscript(voiceLines.length)}
          summary={voiceSummary}
          synthetic="Synthetic call transcript"
        />
      ),
    });
    return steps;
  },
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
      { name: "Booking calendars", category: "Scheduling", note: "Embed a calendar so the primary action can be “book”, not “contact us”." },
      { name: "CRM handoff", category: "CRM", note: "Form submissions can be routed into a CRM so enquiries are never lost." },
      { name: "Email & newsletter", category: "Email", note: "Opt-in capture with double-opt-in patterns and clear consent." },
      { name: "Payments & checkout", category: "Payments", note: "Where selling online is in scope, a checkout path is designed into the route." },
      { name: "Analytics", category: "Analytics", note: "Privacy-respecting analytics so you can see which paths get used." },
      { name: "Helpdesk", category: "CRM", note: "Support enquiries can be routed to a shared inbox or helpdesk tool." },
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
      { name: "Identity & sign-in", category: "Authentication", note: "Role-based sign-in so each person sees only what they should." },
      { name: "Payments", category: "Payments", note: "Where charging is in scope, a payment path is designed into the flow." },
      { name: "CRM & records", category: "CRM", note: "Sync key records with an existing CRM so the team has one view." },
      { name: "Product analytics", category: "Analytics", note: "Privacy-respecting analytics to see which flows people actually use." },
      { name: "Notifications", category: "Messaging", note: "Email, SMS or push notifications at the right point in the flow." },
      { name: "Error monitoring", category: "Analytics", note: "Capture and triage errors so issues are found before users report them." },
    ],
  },
  "/services/ai-voice-agents": {
    signature: <CallFlowOscilloscope />,
    scenario: voiceCallflow,
    tools: [
      { name: "Telephony", category: "Telephony", note: "Connect to a phone number and call-routing provider so calls reach the flow." },
      { name: "Booking calendars", category: "Scheduling", note: "Offer a slot during a call where an appointment is the right action." },
      { name: "CRM handoff", category: "CRM", note: "Captured details can be written to a CRM so the team has context." },
      { name: "SMS follow-up", category: "Messaging", note: "Send a confirmation or link by message after a call, with consent." },
      { name: "Call analytics", category: "Analytics", note: "See call volumes and outcomes by type, with transcripts to audit." },
      { name: "Helpdesk", category: "CRM", note: "Escalations can open a ticket with a named owner and a clear queue." },
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
      { name: "Booking calendars", category: "Scheduling", note: "Offer and hold slots so a booking can be the destination." },
      { name: "CRM handoff", category: "CRM", note: "Captured messages and contacts can be written to a CRM." },
      { name: "Web chat & messaging", category: "Messaging", note: "Bring web chat and messaging channels into the one intake queue." },
      { name: "Shared inbox", category: "Email", note: "Route captured messages to the right shared inbox with an owner." },
      { name: "Telephony", category: "Telephony", note: "Bring phone calls into the same desk as web and messaging." },
      { name: "Helpdesk", category: "CRM", note: "Open a ticket for any enquiry that needs a person to follow up." },
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
      { name: "Website CMS", category: "CMS", note: "Draft into your CMS so website outputs land where you edit them." },
      { name: "Email & newsletter", category: "Email", note: "Prepare a newsletter version for your email platform, ready to review." },
      { name: "Social scheduling", category: "Social", note: "Queue per-platform posts for a person to approve before they go live." },
      { name: "Content analytics", category: "Analytics", note: "See which pieces resonated, without chasing vanity metrics." },
      { name: "Source documents", category: "Documents", note: "Pull from approved source documents so facts trace to an owner." },
      { name: "Media library", category: "CMS", note: "Use approved imagery and assets, with captions added on publish." },
    ],
  },
  "/services/ai-automation": {
    signature: <ProcessLattice />,
    scenario: automationLattice,
    tools: [
      { name: "Workflow runners", category: "Workflow", note: "Orchestrate steps, branches and retries with an event log for every run." },
      { name: "CRM records", category: "CRM", note: "Read and update customer records as a step, never as an unchecked deletion." },
      { name: "Email & messaging", category: "Email", note: "Send templated, reviewed messages — with a human checkpoint where it matters." },
      { name: "Files & storage", category: "Storage", note: "File and fetch documents so a record is never re-keyed by hand." },
      { name: "Reporting", category: "Analytics", note: "Summarise runs, exceptions and approvals so owners can see the whole picture." },
      { name: "Approval queues", category: "Workflow", note: "Hold flagged items for a named person, with a clear accept or decline." },
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
    autoStages: ["Captured", "Sorted to lane", "Viewing slot offered", "Summary ready for branch"],
    autoSummary:
      "Synthetic run: the request is captured, sorted and a viewing slot is offered, then a summary is handed to the branch to confirm. Nothing is booked automatically.",
    boundary:
      "Automation captures and prepares — it never values a property, negotiates, or replies to an owner on the branch's behalf. The sensitive relationship always reaches a person.",
    tools: [
      { name: "Booking calendars", category: "Scheduling", note: "Offer a viewing slot at the moment of interest instead of a callback promise." },
      { name: "CRM handoff", category: "CRM", note: "Route enquiries into your CRM so a lead is never lost between portals." },
      { name: "Portal capture", category: "Portals", note: "Bring portal leads into one place alongside web and phone enquiries." },
      { name: "Email & nurture", category: "Email", note: "Keep buyers warm with consent-based, clearly-owned follow-ups." },
      { name: "Analytics", category: "Analytics", note: "See which enquiry routes actually get used." },
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
    autoStages: ["Captured", "Matched to reservation", "Option offered", "Summary ready for staff"],
    autoSummary:
      "Synthetic run: the message is matched to a reservation, an option is offered and a summary is prepared for staff to confirm. Nothing is committed automatically.",
    boundary:
      "Allergy, accessibility, complaint and emergency matters turn straight to your team. Automation handles availability and admin around the reservation — never a safety-critical answer.",
    tools: [
      { name: "Booking calendars", category: "Scheduling", note: "Offer and change tables around one reservation record." },
      { name: "Reservation system", category: "Bookings", note: "Keep one source of truth for every table and change." },
      { name: "Messaging", category: "Messaging", note: "Bring guest messages into the same place as the booking." },
      { name: "Email confirmations", category: "Email", note: "Send clear, consent-based confirmations and reminders." },
      { name: "Payments & deposits", category: "Payments", note: "Take deposits for large bookings where that is your policy." },
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
    autoStages: ["Captured", "Matched to stylist", "Slot & deposit offered", "Summary ready for desk"],
    autoSummary:
      "Synthetic run: service, stylist and deposit are woven into one slot and a summary is prepared for the desk to confirm. Nothing is booked automatically.",
    boundary:
      "Patch tests, suitability and sensitive requests are decided by the stylist, never by a form. Automation arranges the slot; the practitioner makes the call.",
    tools: [
      { name: "Booking calendars", category: "Scheduling", note: "Match service length to the right stylist's availability." },
      { name: "Deposits & payments", category: "Payments", note: "Take a deposit to protect the chair where that is your policy." },
      { name: "CRM & client history", category: "CRM", note: "Recognise returning clients and their usual service." },
      { name: "Reminders", category: "Messaging", note: "Reduce no-shows with clear, consent-based reminders." },
      { name: "Email", category: "Email", note: "Send confirmations and rebooking nudges with consent." },
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
    autoStages: ["Captured", "Triaged by job type", "Callback slot offered", "Summary ready for office"],
    autoSummary:
      "Synthetic run: location, job type and photos are captured, the enquiry is triaged and a callback is offered, then a summary is prepared for the office. Price and attendance stay unconfirmed.",
    boundary:
      "Attendance time, price and anything safety-related are never confirmed automatically. The board prepares the job; your team commits to it.",
    tools: [
      { name: "Booking calendars", category: "Scheduling", note: "Offer a callback or visit window instead of a vague promise." },
      { name: "CRM & job records", category: "CRM", note: "Keep each enquiry, photo and note against one job." },
      { name: "Messaging & photos", category: "Messaging", note: "Collect a photo and address up front so quotes move faster." },
      { name: "Location & maps", category: "Maps", note: "Capture and check the job location at intake." },
      { name: "Email", category: "Email", note: "Send confirmations and follow-ups with consent." },
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
    autoStages: ["Captured", "Matched to order", "Reply drafted", "Summary ready for support"],
    autoSummary:
      "Synthetic run: the message is matched to an order state and a reply is drafted for support to send. Nothing is sent or changed automatically.",
    boundary:
      "Refunds, goodwill and disputes are always a human decision. The conveyor drafts and routes; it never issues money or resolves a dispute on its own.",
    tools: [
      { name: "Helpdesk", category: "Helpdesk", note: "Bring every message into one queue, tagged by order state." },
      { name: "Store & orders", category: "Store", note: "Read order status to answer the repetitive questions accurately." },
      { name: "Payments & refunds", category: "Payments", note: "Prepare a refund for a person to approve — never auto-issue." },
      { name: "Email", category: "Email", note: "Send drafted, reviewed replies and post-purchase messages." },
      { name: "Analytics", category: "Analytics", note: "See which message types dominate the queue." },
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
      { name: "Booking calendars", category: "Scheduling", note: "Offer routine appointments without clinical questions." },
      { name: "CRM & records", category: "CRM", note: "Keep non-clinical contact and preference details together." },
      { name: "Intake forms", category: "Forms", note: "Collect high-level, non-clinical details before a visit." },
      { name: "Reminders", category: "Messaging", note: "Reduce missed appointments with consent-based reminders." },
      { name: "Email", category: "Email", note: "Send confirmations and preparation notes with consent." },
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
    autoStages: ["Captured", "Matched to record", "Slot or recall offered", "Summary ready for practice"],
    autoSummary:
      "Synthetic run: the request is matched to a record and a recall or slot is offered, then a summary is prepared for the practice. No clinical decision is made.",
    boundary:
      "Treatment decisions, clinical questions and urgent symptoms never enter automation. The orbit handles admin; the clinician owns care.",
    tools: [
      { name: "Booking & recalls", category: "Scheduling", note: "Offer recalls and appointments without manual chasing." },
      { name: "Patient records (admin)", category: "CRM", note: "Keep non-clinical admin details against the right record." },
      { name: "Forms", category: "Forms", note: "Collect new-patient admin details ahead of a visit." },
      { name: "Reminders", category: "Messaging", note: "Nudge recalls and forms with consent-based reminders." },
      { name: "Email", category: "Email", note: "Send confirmations and recall notices with consent." },
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
    autoStages: ["Captured", "Matched to class", "Slot & consent offered", "Follow-up summary ready"],
    autoSummary:
      "Synthetic run: the enquiry is matched to a class, a slot and consent are offered and a follow-up is prepared. Nothing is charged or committed automatically.",
    boundary:
      "Injuries, refunds and sensitive member issues divert to your team. The roster handles bookings and follow-ups, not duty-of-care or money decisions.",
    tools: [
      { name: "Class booking", category: "Scheduling", note: "Offer trials and classes with consent captured up front." },
      { name: "Payments & memberships", category: "Payments", note: "Prepare membership sign-up for a person to confirm." },
      { name: "CRM", category: "CRM", note: "Track trials through to membership in one place." },
      { name: "Follow-up messaging", category: "Messaging", note: "Keep trials warm with a clear, consent-based next step." },
      { name: "Email", category: "Email", note: "Send confirmations and follow-ups with consent." },
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
    autoStages: ["Captured", "Fit questions asked", "Consultation offered", "Handoff summary ready"],
    autoSummary:
      "Synthetic run: the message is captured, a few fit questions are asked and a consultation is offered, then a concise handoff summary is prepared. Nothing is assessed automatically.",
    boundary:
      "Health disclosures, injuries and suitability are assessed by the coach, never by automation. The pathway summarises; the coach decides.",
    tools: [
      { name: "Booking calendars", category: "Scheduling", note: "Offer a consultation slot the moment fit is clear." },
      { name: "Messaging", category: "Messaging", note: "Organise DMs into one place with a clear next step." },
      { name: "CRM", category: "CRM", note: "Track enquiries from first message to consultation." },
      { name: "Payments", category: "Payments", note: "Prepare programme sign-up for you to confirm." },
      { name: "Email", category: "Email", note: "Send resources and follow-ups with consent." },
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
        render: () => <StageTiles rows={flowRows(index + 1, index)} synthetic="Synthetic workflow" />,
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
    { label: "Intake", detail: `A ${data.object} arrives and is captured against one record.` },
    {
      label: "Triage",
      detail: "Routine requests are sorted into a lane and prepared — never decided automatically.",
    },
    { label: "Hand-off", detail: `Anything sensitive is routed straight to ${data.human}.` },
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
    return (
      <VisualRoot>
        <ServicesDecisionMatrix />
      </VisualRoot>
    );
  }

  const module = SERVICE_MODULES[route.path];
  if (!module) {
    return null;
  }

  return (
    <VisualRoot>
      {module.signature}
      <DemoShell scenario={module.scenario} />
      <ToolsCarousel label={SERVICE_TOOLS_LABEL} tools={module.tools} />
    </VisualRoot>
  );
}

/**
 * Visuals for each `/services/<industry-slug>` page (template === "industry"):
 * the operating instrument, a synthetic switchboard demo, and the sector rail.
 */
export function IndustryPageVisuals({ route }: { route: FutureRouteRecord }): ReactNode {
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
