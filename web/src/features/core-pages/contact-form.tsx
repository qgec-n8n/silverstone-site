/**
 * Contact enquiry console — two purpose-built shells sharing one state.
 *
 * Desktop (≥48rem) is a dossier console: a fixed intelligence rail on the
 * left (step list, live brief manifest that assembles as answers land, and
 * the studio's reply promise) beside a content-sized stage that runs three
 * dense boards — Focus → Operation → Send. Mobile (<48rem) is a guided
 * four-step flow (Focus → Scope → Operation → Send) in a normal flowing
 * card: every panel is content-height, the page scrolls, nothing scrolls
 * internally. Optional qualifier steps advance with an honest "Skip" when
 * nothing is chosen.
 *
 * All qualifiers are one-tap chips (the sliders are gone — a stepped range
 * whose "not sure" default sat at 100% fill read as a maxed answer).
 * Qualifying stays fully optional; identity and the written message come
 * last, once momentum exists. Field names stay aligned with the send-email
 * Netlify function's whitelist (name, email, phone, company, interest,
 * companySize, budget, timeline, enquiryVolume, adminHours, channels,
 * systems, automationExperience, decisionRole, message).
 *
 * Submits to the repository's real configured endpoint
 * (`/.netlify/functions/send-email`) and falls back to a direct mailto
 * route if that request can't be confirmed.
 */
import { useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, useReducedMotion, type Variants } from "motion/react";
import * as m from "motion/react-m";

import {
  AlertCircleIcon,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2Icon,
  Send,
} from "~/components/icons/lucide";
import { BorderBeam } from "~/features/services-v2/components/primitives";
import { BUDGET_BANDS } from "~/data/currency";
import { useCurrency } from "~/lib/currency";

type Status = "idle" | "submitting" | "sent" | "fallback";

const ENQUIRY_ENDPOINT = "/.netlify/functions/send-email";

const INTEREST_OPTIONS = [
  "Web Design & Development",
  "App Development",
  "AI Voice Agents",
  "AI Receptionists",
  "AI Automation",
  "AI & Automation Consulting",
  "Content Creation",
  "Partnership or other enquiry",
];

const COMPANY_SIZE_OPTIONS = ["Just me", "2–10 people", "11–50 people", "50+ people"];

const TIMELINE_OPTIONS = [
  "As soon as possible",
  "Within a month",
  "1–3 months",
  "Just exploring",
];

const ENQUIRY_VOLUME_OPTIONS = ["Under 10", "10–50", "50–200", "200+", "Not sure yet"];

const ADMIN_HOURS_OPTIONS = ["Under 2", "2–5", "5–15", "15+", "Hard to say"];

const CHANNEL_OPTIONS = [
  "Phone",
  "Email",
  "Website",
  "WhatsApp / SMS",
  "Social DMs",
  "Walk-ins",
];

const SYSTEM_OPTIONS = [
  "CRM",
  "Booking / diary",
  "eCommerce",
  "Accounting",
  "Spreadsheets",
  "None yet",
];

const AUTOMATION_EXPERIENCE_OPTIONS = [
  "Nothing yet",
  "A few basics",
  "Several tools",
  "Deeply automated",
];

const DECISION_OPTIONS = ["Just me", "Me + a partner", "A leadership team"];

const MESSAGE_MAX_LENGTH = 1600;

type EnquiryData = {
  interest: string;
  companySize: string;
  budget: string;
  timeline: string;
  enquiryVolume: string;
  adminHours: string;
  channels: string[];
  systems: string[];
  automationExperience: string;
  decisionRole: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  consent: boolean;
};

const INITIAL_DATA: EnquiryData = {
  interest: "",
  companySize: "",
  budget: "",
  timeline: "",
  enquiryVolume: "",
  adminHours: "",
  channels: [],
  systems: [],
  automationExperience: "",
  decisionRole: "",
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
  consent: false,
};

type FieldErrors = Partial<Record<"name" | "email" | "message" | "consent", string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Panel content ids. Stages validate by what they contain, not by index, so
 * the desktop and mobile sequencing can differ freely. */
type PanelId = "focus" | "scope" | "operation" | "send";

type StageDef = {
  id: PanelId;
  label: string;
  title: string;
};

const DESKTOP_STAGES: readonly StageDef[] = [
  { id: "focus", label: "Focus", title: "What should we look at?" },
  { id: "operation", label: "Operation", title: "How you operate today" },
  { id: "send", label: "Send", title: "Send your enquiry" },
];

const MOBILE_STAGES: readonly StageDef[] = [
  { id: "focus", label: "Focus", title: "What should we look at?" },
  { id: "scope", label: "Scope", title: "Scope and timing" },
  { id: "operation", label: "Operation", title: "Your operation today" },
  { id: "send", label: "Send", title: "Send your enquiry" },
];

/** Which optional qualifiers each panel carries — drives the honest
 * Skip/Continue label on mobile qualifier steps. */
function panelAnswered(id: PanelId, data: EnquiryData): boolean {
  switch (id) {
    case "focus":
      return data.interest !== "";
    case "scope":
      return (
        data.companySize !== "" ||
        data.budget !== "" ||
        data.timeline !== "" ||
        data.decisionRole !== ""
      );
    case "operation":
      return (
        data.enquiryVolume !== "" ||
        data.adminHours !== "" ||
        data.channels.length > 0 ||
        data.systems.length > 0 ||
        data.automationExperience !== ""
      );
    default:
      return true;
  }
}

function validatePanel(id: PanelId, data: EnquiryData): FieldErrors {
  const errors: FieldErrors = {};
  if (id === "send") {
    if (!data.name.trim()) {
      errors.name = "Add the name we should reply to.";
    }
    if (!data.email.trim()) {
      errors.email = "Add the email address for our reply.";
    } else if (!EMAIL_PATTERN.test(data.email.trim())) {
      errors.email = "That email address doesn't look complete.";
    }
    if (!data.message.trim()) {
      errors.message = "A sentence or two is enough to route this properly.";
    }
    if (!data.consent) {
      errors.consent = "Please confirm you're happy to be contacted about this.";
    }
  }
  return errors;
}

async function submitEnquiry(data: EnquiryData): Promise<void> {
  const payload = {
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    company: data.company.trim(),
    interest: data.interest,
    companySize: data.companySize,
    budget: data.budget,
    timeline: data.timeline,
    enquiryVolume: data.enquiryVolume,
    adminHours: data.adminHours,
    channels: data.channels.join(", "),
    systems: data.systems.join(", "),
    automationExperience: data.automationExperience,
    decisionRole: data.decisionRole,
    message: data.message.trim(),
  };
  const response = await fetch(ENQUIRY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Enquiry endpoint responded with ${String(response.status)}`);
  }
}

/* ---- Shell breakpoint ---------------------------------------------------
   Mirrors the stylesheet's mobile cut. It decides which panel sequence and
   chrome mount; presentation details stay in media-query CSS. Prerender
   renders the desktop console. */

const MOBILE_MEDIA = "(max-width: 47.9375rem)";

function subscribeMobileShell(onChange: () => void): () => void {
  const query = window.matchMedia(MOBILE_MEDIA);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const readMobileShell = () => window.matchMedia(MOBILE_MEDIA).matches;
const serverMobileShell = () => false;

function useMobileShell(): boolean {
  return useSyncExternalStore(subscribeMobileShell, readMobileShell, serverMobileShell);
}

const PANEL_VARIANTS: Variants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? 52 : -52,
    opacity: 0,
    filter: "blur(6px)",
  }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (direction: number) => ({
    x: direction >= 0 ? -52 : 52,
    opacity: 0,
    filter: "blur(6px)",
  }),
};

const REDUCED_PANEL_VARIANTS: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <span className="ss-enq__error" id={id} role="alert">
      <AlertCircleIcon aria-hidden="true" />
      {children}
    </span>
  );
}

/**
 * One qualifier row: a fieldset whose visible caption sits beside (desktop)
 * or above (mobile) its chip deck. The real legend is visually hidden so the
 * caption can be a plain grid item instead of living in the fieldset's
 * border slot.
 */
function ChipRow({
  legend,
  hint,
  name,
  options,
  value,
  onChange,
  disabled,
}: {
  legend: string;
  hint?: string | undefined;
  name: string;
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
  disabled: boolean;
}) {
  return (
    <fieldset className="ss-core-form__seg ss-enq__row" disabled={disabled}>
      <legend className="sr-only">{legend}</legend>
      <span className="ss-enq__row-label" aria-hidden="true">
        {legend}
        {hint ? <em>{hint}</em> : null}
      </span>
      <div className="ss-core-form__seg-options">
        {options.map((option) => (
          <label className="ss-core-form__seg-option" key={option}>
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Multi-select variant of ChipRow: each chip toggles independently. */
function ChipMultiRow({
  legend,
  hint,
  name,
  options,
  values,
  onChange,
  disabled,
}: {
  legend: string;
  hint?: string | undefined;
  name: string;
  options: readonly string[];
  values: string[];
  onChange: (next: string[]) => void;
  disabled: boolean;
}) {
  const toggle = (option: string) => {
    onChange(
      values.includes(option)
        ? values.filter((value) => value !== option)
        : [...values, option],
    );
  };

  return (
    <fieldset className="ss-core-form__seg ss-enq__row" disabled={disabled}>
      <legend className="sr-only">{legend}</legend>
      <span className="ss-enq__row-label" aria-hidden="true">
        {legend}
        {hint ? <em>{hint}</em> : null}
      </span>
      <div className="ss-core-form__seg-options">
        {options.map((option) => (
          <label className="ss-core-form__seg-option" key={option}>
            <input
              type="checkbox"
              name={name}
              value={option}
              checked={values.includes(option)}
              onChange={() => toggle(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ContactForm() {
  const mobile = useMobileShell();
  const stages = mobile ? MOBILE_STAGES : DESKTOP_STAGES;
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<EnquiryData>(INITIAL_DATA);
  /* Budget bands follow the reader's display currency (see ~/data/currency). */
  const [currency] = useCurrency();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [lastFocusedStep, setLastFocusedStep] = useState(0);
  const reducedMotion = useReducedMotion() ?? false;

  // The two shells sequence the same content differently; entering the other
  // shell mid-journey simply clamps to its last panel rather than crashing
  // past the end.
  const activeStep = Math.min(step, stages.length - 1);
  const stage: StageDef = stages[activeStep] ?? {
    id: "focus",
    label: "Focus",
    title: "What should we look at?",
  };

  const patch = (partial: Partial<EnquiryData>) => {
    setData((current) => ({ ...current, ...partial }));
  };

  // Move keyboard/screen-reader context to the fresh panel's heading once it
  // mounts (with mode="wait" that's only after the old panel finished its
  // exit, so an effect on `step` would fire too early and find the outgoing
  // heading). Comparing against the last-focused step keeps the first mount
  // focus-free — the page never scroll-jumps to the form on load.
  const focusPanelHeading = (node: HTMLHeadingElement | null) => {
    if (node && lastFocusedStep !== activeStep) {
      setLastFocusedStep(activeStep);
      node.focus();
    }
  };

  const goTo = (next: number) => {
    setDirection(next > activeStep ? 1 : -1);
    setErrors({});
    // A failed send shouldn't keep warning once the visitor goes back to
    // adjust the enquiry — the next attempt reports its own outcome.
    setStatus((current) => (current === "fallback" ? "idle" : current));
    setStep(next);
  };

  const advance = () => {
    const stageErrors = validatePanel(stage.id, data);
    if (Object.keys(stageErrors).length > 0) {
      setErrors(stageErrors);
      return false;
    }
    if (activeStep < stages.length - 1) {
      goTo(activeStep + 1);
    }
    return true;
  };

  async function send() {
    const stageErrors = validatePanel("send", data);
    if (Object.keys(stageErrors).length > 0) {
      setErrors(stageErrors);
      return;
    }
    setStatus("submitting");
    try {
      await submitEnquiry(data);
      setStatus("sent");
    } catch {
      setStatus("fallback");
    }
  }

  const submitting = status === "submitting";
  const shellKind = mobile ? "mobile" : "desktop";

  if (status === "sent") {
    return (
      <div
        className="ss-core-form ss-enq ss-enq--sent ss-srv2-beam-border"
        data-enq-shell={shellKind}
        id="contact-form-panel"
      >
        <div className="ss-enq__terminal" role="status">
          <CheckCircle2Icon aria-hidden="true" className="ss-enq__terminal-icon" />
          <p className="ss-enq__terminal-title">Enquiry sent</p>
          <p className="ss-enq__terminal-body">
            Thank you — your enquiry is now in the Silverstone inbox. We'll reply to{" "}
            <strong>{data.email.trim()}</strong> within one working day.
          </p>
        </div>
        <BorderBeam />
      </div>
    );
  }

  /* The live brief manifest: every answered qualifier, in reading order. */
  const manifest = [
    data.interest ? ["Focus", data.interest] : null,
    data.companySize ? ["Team", data.companySize] : null,
    data.budget ? ["Budget", data.budget] : null,
    data.timeline ? ["Timeline", data.timeline] : null,
    data.decisionRole ? ["Sign-off", data.decisionRole] : null,
    data.enquiryVolume ? ["Enquiries / wk", data.enquiryVolume] : null,
    data.adminHours ? ["Admin hrs / wk", data.adminHours] : null,
    data.channels.length > 0 ? ["Channels", data.channels.join(", ")] : null,
    data.systems.length > 0 ? ["Systems", data.systems.join(", ")] : null,
    data.automationExperience ? ["Automation", data.automationExperience] : null,
  ].filter((entry): entry is [string, string] => entry !== null);

  /* -- Shared field clusters, sequenced differently per shell ------------- */

  const interestCards = (
    <fieldset className="ss-core-form__seg ss-enq__cards-group" disabled={submitting}>
      <legend className="sr-only">Area of interest (optional)</legend>
      <span className="ss-enq__row-label" aria-hidden="true">
        Area of interest <em>optional</em>
      </span>
      <div className="ss-enq__cards">
        {INTEREST_OPTIONS.map((option) => (
          <label className="ss-enq__card" key={option}>
            <input
              type="radio"
              name="interest"
              value={option}
              checked={data.interest === option}
              onChange={() => patch({ interest: option })}
            />
            <span>
              {option}
              <Check aria-hidden="true" />
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );

  const companyRow = (
    <ChipRow
      legend="Company size"
      hint="optional"
      name="companySize"
      options={COMPANY_SIZE_OPTIONS}
      value={data.companySize}
      onChange={(companySize) => patch({ companySize })}
      disabled={submitting}
    />
  );

  const budgetRow = (
    <ChipRow
      legend="Indicative budget"
      hint="optional"
      name="budget"
      options={BUDGET_BANDS[currency]}
      value={data.budget}
      onChange={(budget) => patch({ budget })}
      disabled={submitting}
    />
  );

  const timelineRow = (
    <ChipRow
      legend="Target go-live"
      hint="optional"
      name="timeline"
      options={TIMELINE_OPTIONS}
      value={data.timeline}
      onChange={(timeline) => patch({ timeline })}
      disabled={submitting}
    />
  );

  const decisionRow = (
    <ChipRow
      legend="Sign-off"
      hint="optional"
      name="decisionRole"
      options={DECISION_OPTIONS}
      value={data.decisionRole}
      onChange={(decisionRole) => patch({ decisionRole })}
      disabled={submitting}
    />
  );

  const volumeRow = (
    <ChipRow
      legend="Enquiries per week"
      hint="optional"
      name="enquiryVolume"
      options={ENQUIRY_VOLUME_OPTIONS}
      value={data.enquiryVolume}
      onChange={(enquiryVolume) => patch({ enquiryVolume })}
      disabled={submitting}
    />
  );

  const adminRow = (
    <ChipRow
      legend="Admin hours per week"
      hint="optional"
      name="adminHours"
      options={ADMIN_HOURS_OPTIONS}
      value={data.adminHours}
      onChange={(adminHours) => patch({ adminHours })}
      disabled={submitting}
    />
  );

  const channelsRow = (
    <ChipMultiRow
      legend="Enquiry channels"
      hint="select any"
      name="channels"
      options={CHANNEL_OPTIONS}
      values={data.channels}
      onChange={(channels) => patch({ channels })}
      disabled={submitting}
    />
  );

  const systemsRow = (
    <ChipMultiRow
      legend="Systems in use"
      hint="select any"
      name="systems"
      options={SYSTEM_OPTIONS}
      values={data.systems}
      onChange={(systems) => patch({ systems })}
      disabled={submitting}
    />
  );

  const automationRow = (
    <ChipRow
      legend="Automation today"
      hint="optional"
      name="automationExperience"
      options={AUTOMATION_EXPERIENCE_OPTIONS}
      value={data.automationExperience}
      onChange={(automationExperience) => patch({ automationExperience })}
      disabled={submitting}
    />
  );

  const nameField = (
    <label className="ss-enq__field">
      <span>Name</span>
      <input
        name="name"
        autoComplete="name"
        placeholder="e.g. Alex Morgan"
        value={data.name}
        onChange={(event) => patch({ name: event.target.value })}
        aria-invalid={errors.name ? true : undefined}
        aria-describedby={errors.name ? "enq-error-name" : undefined}
        disabled={submitting}
      />
      {errors.name ? <FieldError id="enq-error-name">{errors.name}</FieldError> : null}
    </label>
  );

  const emailField = (
    <label className="ss-enq__field">
      <span>Work email</span>
      <input
        name="email"
        type="email"
        autoComplete="email"
        placeholder="e.g. alex@yourcompany.co.uk"
        value={data.email}
        onChange={(event) => patch({ email: event.target.value })}
        aria-invalid={errors.email ? true : undefined}
        aria-describedby={errors.email ? "enq-error-email" : undefined}
        disabled={submitting}
      />
      {errors.email ? (
        <FieldError id="enq-error-email">{errors.email}</FieldError>
      ) : null}
    </label>
  );

  const phoneField = (
    <label className="ss-enq__field">
      <span>
        Phone <em>optional</em>
      </span>
      <input
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder={mobile ? "+44 7911 123456" : "e.g. +44 7911 123456"}
        value={data.phone}
        onChange={(event) => patch({ phone: event.target.value })}
        disabled={submitting}
      />
    </label>
  );

  const companyField = (
    <label className="ss-enq__field">
      <span>
        Company <em>optional</em>
      </span>
      <input
        name="company"
        autoComplete="organization"
        placeholder={mobile ? "Morgan & Co" : "e.g. Morgan & Co Clinics"}
        value={data.company}
        onChange={(event) => patch({ company: event.target.value })}
        disabled={submitting}
      />
    </label>
  );

  const sendFields = (
    <div className="ss-enq__fields" data-enq-send>
      {mobile && manifest.length > 0 ? (
        <p className="ss-enq__brief-line" aria-label="Enquiry summary">
          {manifest.map(([, value]) => value).join(" · ")}
        </p>
      ) : null}
      <div className="ss-enq__idgrid">
        {nameField}
        {emailField}
        {phoneField}
        {companyField}
      </div>
      <label className="ss-enq__field" data-enq-message>
        <span>What would you like to improve?</span>
        <textarea
          name="message"
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder={
            mobile
              ? "e.g. Half our enquiries go unanswered after hours — we want them captured and booked automatically."
              : "e.g. Enquiries reach us by phone and Instagram, but half go unanswered outside opening hours — we want them captured, qualified and booked automatically."
          }
          value={data.message}
          onChange={(event) => patch({ message: event.target.value })}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "enq-error-message" : "enq-message-count"}
          disabled={submitting}
        />
        <span className="ss-enq__count" id="enq-message-count">
          {data.message.length} / {MESSAGE_MAX_LENGTH}
        </span>
        {errors.message ? (
          <FieldError id="enq-error-message">{errors.message}</FieldError>
        ) : null}
      </label>
      <div className="ss-enq__sendfoot">
        <label className="ss-enq__consent">
          <input
            type="checkbox"
            name="consent"
            checked={data.consent}
            onChange={(event) => patch({ consent: event.target.checked })}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "enq-error-consent" : undefined}
            disabled={submitting}
          />
          <span className="ss-enq__consent-box" aria-hidden="true">
            <Check />
          </span>
          <span>
            {mobile ? (
              <>
                I'm happy to be contacted — <a href="/privacy-policy">privacy policy</a>
                .
              </>
            ) : (
              <>
                I'm happy to be contacted about this enquiry —{" "}
                <a href="/privacy-policy">privacy policy</a>. Please don't include
                passwords or sensitive personal data.
              </>
            )}
          </span>
        </label>
        {errors.consent ? (
          <FieldError id="enq-error-consent">{errors.consent}</FieldError>
        ) : null}
      </div>
    </div>
  );

  const panelContent: Record<PanelId, ReactNode> = {
    focus: mobile ? (
      // No hint paragraph on a phone — the title plus the honest Skip
      // affordance carry the same message without spending a line.
      <div className="ss-enq__fields">{interestCards}</div>
    ) : (
      <div className="ss-enq__fields">
        <p className="ss-enq__hint">
          Everything here is optional — answer what's useful, skip the rest.
        </p>
        {interestCards}
        <div className="ss-enq__rows">
          {companyRow}
          {budgetRow}
          {timelineRow}
        </div>
      </div>
    ),
    scope: (
      <div className="ss-enq__fields">
        <div className="ss-enq__rows">
          {companyRow}
          {budgetRow}
          {timelineRow}
          {decisionRow}
        </div>
      </div>
    ),
    operation: mobile ? (
      // Automation experience is desktop-only: on a phone the step stays
      // four short groups so the whole panel reads in one sweep.
      <div className="ss-enq__fields">
        <div className="ss-enq__rows">
          {volumeRow}
          {adminRow}
          {channelsRow}
          {systemsRow}
        </div>
      </div>
    ) : (
      <div className="ss-enq__fields">
        <div className="ss-enq__rows">
          {volumeRow}
          {adminRow}
          {channelsRow}
          {systemsRow}
          {automationRow}
          {decisionRow}
        </div>
      </div>
    ),
    send: sendFields,
  };

  const lastStage = activeStep === stages.length - 1;
  const skipLabel =
    mobile &&
    stage.id !== "send" &&
    stage.id !== "focus" &&
    !panelAnswered(stage.id, data);

  return (
    <form
      className="ss-core-form ss-enq ss-srv2-beam-border"
      data-enq-shell={shellKind}
      aria-label="Silverstone enquiry form"
      onSubmit={(event) => {
        event.preventDefault();
        if (lastStage) {
          void send();
        } else {
          advance();
        }
      }}
    >
      {!mobile ? (
        <aside className="ss-enq__rail">
          <p className="ss-enq__rail-label">Direct enquiry</p>
          <ol className="ss-enq__steps">
            {stages.map((entry, index) => {
              const state =
                index === activeStep
                  ? "current"
                  : index < activeStep
                    ? "done"
                    : "ahead";
              return (
                <li key={entry.id} data-state={state}>
                  <button
                    type="button"
                    onClick={() => index < activeStep && goTo(index)}
                    disabled={index >= activeStep || submitting}
                    aria-current={index === activeStep ? "step" : undefined}
                  >
                    <span className="ss-enq__step-marker" aria-hidden="true">
                      {state === "done" ? (
                        <Check />
                      ) : (
                        String(index + 1).padStart(2, "0")
                      )}
                    </span>
                    {entry.label}
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="ss-enq__manifest-block">
            <p className="ss-enq__rail-label">Live brief</p>
            {manifest.length > 0 ? (
              <dl className="ss-enq__manifest" aria-label="Enquiry summary">
                {manifest.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="ss-enq__manifest-empty">
                Answers you choose are attached here.
              </p>
            )}
          </div>
          <div className="ss-enq__assure">
            <p>
              <strong>Reviewed personally.</strong> Replies within one working day.
            </p>
            <a href="mailto:info@silverstone-ai.com">info@silverstone-ai.com</a>
            <a href="/book#booking-calendar">Prefer to talk? Book a 30-minute call</a>
          </div>
        </aside>
      ) : null}

      <div className="ss-enq__stagearea">
        {mobile ? (
          <div className="ss-enq__mobhead" aria-hidden="true">
            <span className="ss-enq__rail-label">Direct enquiry</span>
            <span className="ss-enq__mobhead-count">
              {String(activeStep + 1).padStart(2, "0")} /{" "}
              {String(stages.length).padStart(2, "0")}
            </span>
          </div>
        ) : null}
        {mobile ? (
          <div className="ss-enq__beam" aria-hidden="true">
            {stages.map((entry, index) => (
              <span
                key={entry.id}
                data-state={
                  index < activeStep
                    ? "done"
                    : index === activeStep
                      ? "current"
                      : "ahead"
                }
              />
            ))}
          </div>
        ) : null}

        <p className="sr-only" aria-live="polite">
          Step {activeStep + 1} of {stages.length}: {stage.label}
        </p>

        <div className="ss-enq__viewport">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <m.section
              key={`${shellKind}-${stage.id}`}
              className="ss-enq__panel"
              data-enq-panel={stage.id}
              custom={direction}
              variants={reducedMotion ? REDUCED_PANEL_VARIANTS : PANEL_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              aria-label={`${stage.label} — step ${String(activeStep + 1)} of ${String(stages.length)}`}
            >
              <div className="ss-enq__stage-head">
                <h3
                  className="ss-enq__panel-title"
                  ref={focusPanelHeading}
                  tabIndex={-1}
                >
                  {stage.title}
                </h3>
                {!mobile ? (
                  <span className="ss-enq__stage-count" aria-hidden="true">
                    {String(activeStep + 1).padStart(2, "0")} /{" "}
                    {String(stages.length).padStart(2, "0")}
                  </span>
                ) : null}
              </div>
              {panelContent[stage.id]}
            </m.section>
          </AnimatePresence>
        </div>

        <div className="ss-enq__nav">
          {activeStep > 0 ? (
            <button
              className="ss-srv2-btn ss-srv2-btn--ghost"
              type="button"
              onClick={() => goTo(activeStep - 1)}
              disabled={submitting}
            >
              <ArrowLeft aria-hidden="true" />
              Back
            </button>
          ) : mobile ? (
            <a
              className="ss-enq__mailto"
              href="mailto:info@silverstone-ai.com?subject=Enquiry%20for%20Silverstone%20AI"
            >
              Email instead
            </a>
          ) : (
            <span className="ss-enq__nav-note">
              Nothing is sent until the final step
            </span>
          )}
          {!lastStage ? (
            <button className="ss-srv2-btn ss-srv2-btn--primary" type="submit">
              {skipLabel ? "Skip" : "Continue"}
              <ArrowRight aria-hidden="true" />
            </button>
          ) : (
            <button
              className="ss-srv2-btn ss-srv2-btn--primary"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                "Sending…"
              ) : (
                <>
                  Send enquiry <Send aria-hidden="true" />
                </>
              )}
            </button>
          )}
        </div>

        {mobile && (stage.id === "focus" || stage.id === "send") ? (
          <p className="ss-enq__mob-assure">
            Reviewed personally — replies within one working day.
          </p>
        ) : null}

        <div className="ss-core-form__status" role="status" aria-live="polite">
          {status === "fallback" ? (
            <span className="ss-core-form__status-line" data-tone="fallback">
              <AlertCircleIcon aria-hidden="true" />
              We couldn't confirm delivery just now. Please{" "}
              <a href="mailto:info@silverstone-ai.com">
                email info@silverstone-ai.com
              </a>{" "}
              directly and we'll pick it up from there.
            </span>
          ) : null}
        </div>
      </div>
      <BorderBeam />
    </form>
  );
}
