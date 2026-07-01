import type { ReactNode } from "react";

import type { FutureRouteRecord } from "~/data/route-schema";
import { getApprovedServiceContent } from "~/content/services/approved-services";
import {
  DemoShell,
  type DemoScenario,
  type DemoStep,
} from "~/visual/components/demo-shell";
import { ServiceExperienceV2 } from "~/features/services-v2/service-experience";
import {
  IndustryInstrument,
  type InstrumentStep,
} from "~/visual/components/industry-instrument";
import { IndustriesAtlas } from "~/visual/components/industries-atlas";
import { ServicesDecisionMatrix } from "~/visual/components/services-decision-matrix";
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

const INDUSTRY_TOOLS_LABEL = "Tools this sector commonly uses";

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

/** Visuals for `/services` and each approved canonical service route. */
export function ServicePageVisuals({ route }: { route: FutureRouteRecord }): ReactNode {
  if (route.path === "/services") {
    return (
      <VisualRoot>
        <ServicesDecisionMatrix />
      </VisualRoot>
    );
  }

  const approvedService = getApprovedServiceContent(route.path);
  return approvedService ? <ServiceExperienceV2 content={approvedService} /> : null;
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
