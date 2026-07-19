/**
 * Contact enquiry console — a fixed-size instrument on every breakpoint.
 *
 * The shell is sized once from the viewport (like the booking console) and
 * never grows or shrinks between panels: the stage viewport is the flexible
 * grid row, panels are composed to fit it by construction, and the whole
 * console stays entirely visible inside the browser window.
 *
 * Desktop (≥48rem) runs five compact sliding stages — Focus → Scope →
 * Signals → Details → Transmit — under a mono console rail with a live
 * calibration meter. Mobile (<48rem) gets a dedicated seven-panel flow (one
 * decision per screen) inside the same fixed shell, so no panel ever needs
 * internal scroll. Both shells share one state object, so rotating or
 * resizing never loses the visitor's place.
 *
 * The qualifying stages are one-tap and fully optional; identity and the
 * written message come last, once momentum exists. Field names stay aligned
 * with the send-email Netlify function's whitelist (name, email, phone,
 * company, interest, companySize, budget, timeline, enquiryVolume,
 * adminHours, channels, systems, automationExperience, decisionRole,
 * message).
 *
 * Submits to the repository's real configured endpoint
 * (`/.netlify/functions/send-email`) and falls back to a direct mailto route
 * if that request can't be confirmed — no staging language, no fabricated
 * always-succeeds mock.
 */
import {
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { AnimatePresence, useReducedMotion, type Variants } from "motion/react";
import * as m from "motion/react-m";

import {
  AlertCircleIcon,
  ArrowLeft,
  ArrowRight,
  CheckCircle2Icon,
  Send,
} from "~/components/icons/lucide";
import { BorderBeam } from "~/features/services-v2/components/primitives";

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

const BUDGET_OPTIONS = ["Under £1k", "£1k–£3k", "£3k–£10k", "£10k+", "Not sure yet"];

const TIMELINE_OPTIONS = [
  "As soon as possible",
  "Within a month",
  "1–3 months",
  "Just exploring",
];

const ENQUIRY_VOLUME_OPTIONS = ["Under 10", "10–50", "50–200", "200+", "Not sure yet"];

const ADMIN_HOURS_OPTIONS = ["Under 2", "2–5", "5–15", "15+", "Hard to say"];

/* Mobile tick labels are intentionally terse: the full values remain in
 * state, accessibility text and the submission payload, while the compact
 * instrument face stays single-line even on a 320px viewport. */
const MOBILE_BUDGET_LABELS = ["<£1k", "£1–3k", "£3–10k", "£10k+", "Unsure"];
const MOBILE_ENQUIRY_VOLUME_LABELS = ["<10", "10–50", "50–200", "200+", "Unsure"];
const MOBILE_ADMIN_HOURS_LABELS = ["<2", "2–5", "5–15", "15+", "Unsure"];

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

/** The eight optional qualifying instruments the calibration meter tracks. A
 * slider counts once it leaves its honest "not sure" default; chips and
 * multi-selects count once anything is chosen. */
const SCOPE_QUESTION_COUNT = 8;

function countScopeAnswers(data: EnquiryData): number {
  return [
    data.budget !== INITIAL_DATA.budget,
    data.timeline !== "",
    data.enquiryVolume !== INITIAL_DATA.enquiryVolume,
    data.adminHours !== INITIAL_DATA.adminHours,
    data.channels.length > 0,
    data.systems.length > 0,
    data.automationExperience !== "",
    data.decisionRole !== "",
  ].filter(Boolean).length;
}

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
  // Sliders rest on their honest "not sure" default (and that answer is sent
  // as-is — an unmoved slider is itself a useful signal); every tap-chip
  // qualifier starts unanswered and is only sent when the visitor actively
  // chooses a value.
  budget: "Not sure yet",
  timeline: "",
  enquiryVolume: "Not sure yet",
  adminHours: "Hard to say",
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
type PanelId =
  | "focus"
  | "scope"
  | "workload"
  | "signals"
  | "systems"
  | "calibration"
  | "details"
  | "transmit";

type StageDef = {
  id: PanelId;
  label: string;
  title: string;
};

const DESKTOP_STAGES: readonly StageDef[] = [
  { id: "focus", label: "Focus", title: "Where should we look first?" },
  { id: "scope", label: "Scope", title: "Size the engagement" },
  { id: "signals", label: "Signals", title: "Map your channels and systems" },
  { id: "details", label: "Details", title: "Where should the reply go?" },
  { id: "transmit", label: "Transmit", title: "Describe what should change" },
];

const MOBILE_STAGES: readonly StageDef[] = [
  { id: "focus", label: "Focus", title: "Where should we look first?" },
  { id: "scope", label: "Budget", title: "Budget and timing" },
  { id: "workload", label: "Workload", title: "Today’s workload" },
  { id: "signals", label: "Channels", title: "Where enquiries arrive" },
  { id: "systems", label: "Systems", title: "What runs the work" },
  { id: "calibration", label: "Sign-off", title: "Automation and sign-off" },
  { id: "details", label: "Details", title: "Where should the reply go?" },
  { id: "transmit", label: "Transmit", title: "Describe what should change" },
];

function validatePanel(id: PanelId, data: EnquiryData): FieldErrors {
  const errors: FieldErrors = {};
  if (id === "details") {
    if (!data.name.trim()) {
      errors.name = "Add the name we should reply to.";
    }
    if (!data.email.trim()) {
      errors.email = "Add the email address for our reply.";
    } else if (!EMAIL_PATTERN.test(data.email.trim())) {
      errors.email = "That email address doesn't look complete.";
    }
  }
  if (id === "transmit") {
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
   Mirrors the stylesheet's mobile cut. Behaviour-only: it decides which
   panel sequence mounts; presentation is media-query CSS. Prerender renders
   the desktop console. */

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

function ChipGroup({
  legend,
  name,
  options,
  value,
  onChange,
  disabled,
}: {
  legend: ReactNode;
  name: string;
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
  disabled: boolean;
}) {
  return (
    <fieldset className="ss-core-form__seg" disabled={disabled}>
      <legend>{legend}</legend>
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

/** Multi-select variant of ChipGroup: each chip toggles independently. */
function ChipMultiGroup({
  legend,
  name,
  options,
  values,
  onChange,
  disabled,
}: {
  legend: ReactNode;
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
    <fieldset className="ss-core-form__seg" disabled={disabled}>
      <legend>{legend}</legend>
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

/**
 * Stepped slider instrument (glowing readout, beam track, orb thumb — see
 * `.ss-enq__slider`). The fill percentage feeds the track gradient via
 * `--enq-fill`.
 */
function ScopeSlider({
  label,
  displayLabel,
  options,
  displayOptions,
  value,
  onChange,
  disabled,
}: {
  label: string;
  displayLabel?: string | undefined;
  options: readonly string[];
  displayOptions?: readonly string[] | undefined;
  value: string;
  onChange: (next: string) => void;
  disabled: boolean;
}) {
  const index = Math.max(0, options.indexOf(value));
  const fallback = options[options.length - 1] ?? "";
  const readout = displayOptions?.[index] ?? value;

  return (
    <div
      className="ss-enq__slider"
      style={
        {
          "--enq-fill": `${String((index / (options.length - 1)) * 100)}%`,
        } as CSSProperties
      }
    >
      <div className="ss-enq__slider-readout">
        <span>{displayLabel ?? label}</span>
        <strong>{readout}</strong>
      </div>
      <input
        type="range"
        min={0}
        max={options.length - 1}
        step={1}
        value={index}
        onChange={(event) => onChange(options[Number(event.target.value)] ?? fallback)}
        aria-label={label}
        aria-valuetext={value}
        disabled={disabled}
      />
      <div className="ss-enq__slider-ticks" aria-hidden="true">
        {options.map((option, optionIndex) => (
          <span key={option} data-active={option === value}>
            {displayOptions?.[optionIndex] ?? option}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ContactForm() {
  const mobile = useMobileShell();
  const stages = mobile ? MOBILE_STAGES : DESKTOP_STAGES;
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<EnquiryData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const mobileViewportHeightRef = useRef<number | null>(null);
  const lastFocusedStepRef = useRef(step);
  const reducedMotion = useReducedMotion() ?? false;

  /* Capture the mobile browser's usable height once when the mobile shell
   commits. Collapsing/expanding URL chrome then fires height-only resizes, but
   the console keeps this initial measurement. Callback refs also cover the
   sent-state shell without introducing a render solely for measurement. */
  const attachShell = (node: HTMLDivElement | HTMLFormElement | null) => {
    if (node && mobile) {
      mobileViewportHeightRef.current ??= window.innerHeight;
      node.style.setProperty(
        "--enq-mobile-viewport-height",
        `${String(mobileViewportHeightRef.current)}px`,
      );
    }
  };

  // The two shells sequence the same content differently; entering the other
  // shell mid-journey simply clamps to its last panel rather than crashing
  // past the end.
  const activeStep = Math.min(step, stages.length - 1);
  const stage: StageDef = stages[activeStep] ?? {
    id: "focus",
    label: "Focus",
    title: "Where should we look first?",
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
    if (node && lastFocusedStepRef.current !== activeStep) {
      lastFocusedStepRef.current = activeStep;
      node.focus();
    }
  };

  const goTo = (next: number) => {
    setDirection(next > activeStep ? 1 : -1);
    setErrors({});
    // A failed transmit shouldn't keep warning once the visitor goes back to
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

  async function transmit() {
    const stageErrors = validatePanel("transmit", data);
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
  const scopeAnswered = countScopeAnswers(data);
  const shellKind = mobile ? "mobile" : "desktop";

  if (status === "sent") {
    return (
      <div
        className="ss-core-form ss-enq ss-enq--sent ss-srv2-beam-border"
        data-enq-shell={shellKind}
        id="contact-form-panel"
        ref={attachShell}
      >
        <div className="ss-enq__terminal" role="status">
          <CheckCircle2Icon aria-hidden="true" className="ss-enq__terminal-icon" />
          <p className="ss-enq__terminal-title">Transmission received</p>
          <p className="ss-enq__terminal-body">
            Thank you — your enquiry is now in the Silverstone inbox. We'll reply to{" "}
            <strong>{data.email.trim()}</strong>.
          </p>
        </div>
        <BorderBeam />
      </div>
    );
  }

  const recap = [
    data.interest ? ["Focus", data.interest] : null,
    data.companySize ? ["Team", data.companySize] : null,
    ["Budget", data.budget],
    data.timeline ? ["Timeline", data.timeline] : null,
    ["Volume", data.enquiryVolume],
    ["Admin hours", data.adminHours],
    data.channels.length > 0 ? ["Channels", data.channels.join(", ")] : null,
    data.systems.length > 0 ? ["Systems", data.systems.join(", ")] : null,
    data.automationExperience ? ["Automation", data.automationExperience] : null,
    data.decisionRole ? ["Sign-off", data.decisionRole] : null,
  ].filter((entry): entry is [string, string] => entry !== null);

  /* -- Shared field clusters, sequenced differently per shell ------------- */

  const focusFields = (
    <div className="ss-enq__fields">
      <p className="ss-enq__hint">
        Two taps, both optional — they route your enquiry to the right preparation
        before anyone replies.
      </p>
      <label className="ss-enq__field">
        <span>
          Area of interest <em>optional</em>
        </span>
        <span className="ss-enq__selectwrap">
          <select
            name="interest"
            value={data.interest}
            onChange={(event) => patch({ interest: event.target.value })}
            disabled={submitting}
          >
            <option value="">Select the closest match</option>
            {INTEREST_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </span>
      </label>
      <ChipGroup
        legend={
          <>
            Company size <em>optional</em>
          </>
        }
        name="companySize"
        options={COMPANY_SIZE_OPTIONS}
        value={data.companySize}
        onChange={(companySize) => patch({ companySize })}
        disabled={submitting}
      />
    </div>
  );

  const budgetSlider = (
    <ScopeSlider
      label="Indicative budget"
      displayLabel={mobile ? "Budget range" : undefined}
      options={BUDGET_OPTIONS}
      displayOptions={mobile ? MOBILE_BUDGET_LABELS : undefined}
      value={data.budget}
      onChange={(budget) => patch({ budget })}
      disabled={submitting}
    />
  );

  const timelineChips = (
    <ChipGroup
      legend={
        <>
          How soon should this be live? <em>optional</em>
        </>
      }
      name="timeline"
      options={TIMELINE_OPTIONS}
      value={data.timeline}
      onChange={(timeline) => patch({ timeline })}
      disabled={submitting}
    />
  );

  const volumeSlider = (
    <ScopeSlider
      label="New enquiries per week"
      displayLabel={mobile ? "Enquiries / week" : undefined}
      options={ENQUIRY_VOLUME_OPTIONS}
      displayOptions={mobile ? MOBILE_ENQUIRY_VOLUME_LABELS : undefined}
      value={data.enquiryVolume}
      onChange={(enquiryVolume) => patch({ enquiryVolume })}
      disabled={submitting}
    />
  );

  const adminSlider = (
    <ScopeSlider
      label="Hours a week lost to manual admin"
      displayLabel={mobile ? "Manual admin / week" : undefined}
      options={ADMIN_HOURS_OPTIONS}
      displayOptions={mobile ? MOBILE_ADMIN_HOURS_LABELS : undefined}
      value={data.adminHours}
      onChange={(adminHours) => patch({ adminHours })}
      disabled={submitting}
    />
  );

  const channelChips = (
    <ChipMultiGroup
      legend={
        <>
          Where do enquiries arrive? <em>select any</em>
        </>
      }
      name="channels"
      options={CHANNEL_OPTIONS}
      values={data.channels}
      onChange={(channels) => patch({ channels })}
      disabled={submitting}
    />
  );

  const systemChips = (
    <ChipMultiGroup
      legend={
        <>
          Systems already in play <em>select any</em>
        </>
      }
      name="systems"
      options={SYSTEM_OPTIONS}
      values={data.systems}
      onChange={(systems) => patch({ systems })}
      disabled={submitting}
    />
  );

  const automationChips = (
    <ChipGroup
      legend={
        <>
          How automated are you today? <em>optional</em>
        </>
      }
      name="automationExperience"
      options={AUTOMATION_EXPERIENCE_OPTIONS}
      value={data.automationExperience}
      onChange={(automationExperience) => patch({ automationExperience })}
      disabled={submitting}
    />
  );

  const decisionChips = (
    <ChipGroup
      legend={
        <>
          Who signs this off? <em>optional</em>
        </>
      }
      name="decisionRole"
      options={DECISION_OPTIONS}
      value={data.decisionRole}
      onChange={(decisionRole) => patch({ decisionRole })}
      disabled={submitting}
    />
  );

  const scopeHint = (
    <p className="ss-enq__hint">
      {mobile
        ? "Optional — each answer helps us prepare."
        : "Every control here is optional and one tap — each answer calibrates how the discovery call is prepared."}
    </p>
  );

  const identityFields = (
    <div className="ss-enq__fields">
      <div className="ss-core-form__grid" data-enq-identity>
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
          {errors.name ? (
            <FieldError id="enq-error-name">{errors.name}</FieldError>
          ) : null}
        </label>
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
        <label className="ss-enq__field">
          <span>
            Phone <em>optional</em>
          </span>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="e.g. +44 7911 123456"
            value={data.phone}
            onChange={(event) => patch({ phone: event.target.value })}
            disabled={submitting}
          />
        </label>
        <label className="ss-enq__field">
          <span>
            Company <em>optional</em>
          </span>
          <input
            name="company"
            autoComplete="organization"
            placeholder="e.g. Morgan & Co Clinics"
            value={data.company}
            onChange={(event) => patch({ company: event.target.value })}
            disabled={submitting}
          />
        </label>
      </div>
    </div>
  );

  const transmitFields = (
    <div className="ss-enq__fields" data-enq-transmit>
      {!mobile && recap.length > 0 ? (
        <dl className="ss-enq__recap" aria-label="Enquiry summary">
          {recap.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <label className="ss-enq__field" data-enq-message>
        <span>What would you like to improve?</span>
        <textarea
          name="message"
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder="e.g. Enquiries reach us by phone and Instagram, but half go unanswered outside opening hours — we want them captured, qualified and booked automatically."
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
      <p className="ss-core-form__note">
        Do not include passwords, payment information, health records or other sensitive
        personal data.
      </p>
      <label className="ss-core-form__consent">
        <input
          type="checkbox"
          name="consent"
          checked={data.consent}
          onChange={(event) => patch({ consent: event.target.checked })}
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? "enq-error-consent" : undefined}
          disabled={submitting}
        />
        <span>
          I agree to be contacted about this enquiry, in line with the{" "}
          <a href="/privacy-policy">privacy policy</a>.
        </span>
      </label>
      {errors.consent ? (
        <FieldError id="enq-error-consent">{errors.consent}</FieldError>
      ) : null}
    </div>
  );

  const panelContent: Record<PanelId, ReactNode> = {
    focus: focusFields,
    scope: mobile ? (
      <div className="ss-enq__fields">
        {scopeHint}
        {budgetSlider}
        {timelineChips}
      </div>
    ) : (
      <div className="ss-enq__fields">
        {scopeHint}
        <div className="ss-core-form__grid">
          {budgetSlider}
          {timelineChips}
        </div>
        <div className="ss-core-form__grid">
          {volumeSlider}
          {adminSlider}
        </div>
      </div>
    ),
    workload: (
      <div className="ss-enq__fields">
        {volumeSlider}
        {adminSlider}
      </div>
    ),
    signals: mobile ? (
      <div className="ss-enq__fields">{channelChips}</div>
    ) : (
      <div className="ss-enq__fields">
        <div className="ss-core-form__grid">
          {channelChips}
          {systemChips}
        </div>
        <div className="ss-core-form__grid">
          {automationChips}
          {decisionChips}
        </div>
      </div>
    ),
    systems: <div className="ss-enq__fields">{systemChips}</div>,
    calibration: (
      <div className="ss-enq__fields">
        {automationChips}
        {decisionChips}
      </div>
    ),
    details: identityFields,
    transmit: transmitFields,
  };

  return (
    <form
      className="ss-core-form ss-enq ss-srv2-beam-border"
      data-enq-shell={shellKind}
      aria-label="Silverstone enquiry form"
      ref={attachShell}
      onSubmit={(event) => {
        event.preventDefault();
        if (activeStep < stages.length - 1) {
          advance();
        } else {
          void transmit();
        }
      }}
    >
      <div className="ss-enq__rail" aria-hidden="true">
        <span className="ss-enq__rail-label">Enquiry console</span>
        <span className="ss-enq__rail-track" />
        <span className="ss-enq__meter">
          <span className="ss-enq__meter-cells">
            {Array.from({ length: SCOPE_QUESTION_COUNT }, (_, index) => (
              <span key={index} data-filled={index < scopeAnswered} />
            ))}
          </span>
          <span className="ss-enq__meter-count">
            {scopeAnswered}/{SCOPE_QUESTION_COUNT} calibrated
          </span>
        </span>
        <span className="ss-enq__rail-count">
          {String(activeStep + 1).padStart(2, "0")} /{" "}
          {String(stages.length).padStart(2, "0")}
        </span>
      </div>

      <ol className="ss-enq__stages">
        {stages.map((entry, index) => {
          const state =
            index === activeStep ? "current" : index < activeStep ? "done" : "ahead";
          return (
            <li key={entry.id} data-state={state}>
              <button
                type="button"
                onClick={() => index < activeStep && goTo(index)}
                disabled={index >= activeStep || submitting}
                aria-current={index === activeStep ? "step" : undefined}
              >
                <span className="ss-enq__stage-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {entry.label}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="ss-enq__beam" aria-hidden="true">
        <span
          style={{ width: `${String(((activeStep + 1) / stages.length) * 100)}%` }}
        />
      </div>

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
            <h3 className="ss-enq__panel-title" ref={focusPanelHeading} tabIndex={-1}>
              {stage.title}
            </h3>
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
        ) : (
          <a
            className="ss-enq__mailto"
            href="mailto:info@silverstone-ai.com?subject=Enquiry%20for%20Silverstone%20AI"
          >
            Email instead
          </a>
        )}
        {activeStep < stages.length - 1 ? (
          <button className="ss-srv2-btn ss-srv2-btn--primary" type="submit">
            Continue
            <ArrowRight aria-hidden="true" />
          </button>
        ) : (
          <button
            className="ss-srv2-btn ss-srv2-btn--primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              "Transmitting…"
            ) : (
              <>
                {mobile ? "Send" : "Transmit enquiry"} <Send aria-hidden="true" />
              </>
            )}
          </button>
        )}
      </div>

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
      <BorderBeam />
    </form>
  );
}
