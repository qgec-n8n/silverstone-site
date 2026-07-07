/**
 * Contact enquiry console. The enquiry is captured across four compact
 * sliding stages (Focus → Scope → Details → Transmit) instead of one long
 * field list, so the form reads as a short interactive sequence rather than
 * an intimidating page of inputs. The two qualifying stages are one-tap and
 * fully optional; identity and the written message come last, once momentum
 * exists. Field names stay aligned with the send-email Netlify function's
 * whitelist (name, email, phone, company, interest, companySize, budget,
 * timeline, message).
 *
 * Submits to the repository's real configured endpoint
 * (`/.netlify/functions/send-email`) and falls back to a direct mailto route
 * if that request can't be confirmed — no staging language, no fabricated
 * always-succeeds mock.
 */
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, useReducedMotion, type Variants } from "motion/react";
import * as m from "motion/react-m";

import {
  AlertCircleIcon,
  ArrowLeft,
  ArrowRight,
  CheckCircle2Icon,
  Send,
} from "~/components/icons/lucide";

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

const STAGES = [
  { id: "focus", label: "Focus", title: "Where should we look first?" },
  { id: "scope", label: "Scope", title: "Twenty seconds of scope" },
  { id: "details", label: "Details", title: "Where should the reply go?" },
  { id: "transmit", label: "Transmit", title: "Describe what should change" },
] as const;

const MESSAGE_MAX_LENGTH = 1600;

type EnquiryData = {
  interest: string;
  companySize: string;
  budget: string;
  timeline: string;
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
  // The slider rests on the honest default; every other qualifier starts
  // unanswered and is only sent when the visitor actively chooses a value.
  budget: "Not sure yet",
  timeline: "",
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
  consent: false,
};

type FieldErrors = Partial<Record<"name" | "email" | "message" | "consent", string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateStage(step: number, data: EnquiryData): FieldErrors {
  const errors: FieldErrors = {};
  if (step === 2) {
    if (!data.name.trim()) {
      errors.name = "Add the name we should reply to.";
    }
    if (!data.email.trim()) {
      errors.email = "Add the email address for our reply.";
    } else if (!EMAIL_PATTERN.test(data.email.trim())) {
      errors.email = "That email address doesn't look complete.";
    }
  }
  if (step === 3) {
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

export function ContactForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<EnquiryData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const lastFocusedStepRef = useRef(step);
  const reducedMotion = useReducedMotion() ?? false;

  const patch = (partial: Partial<EnquiryData>) => {
    setData((current) => ({ ...current, ...partial }));
  };

  // Move keyboard/screen-reader context to the fresh panel's heading once it
  // mounts (with mode="wait" that's only after the old panel finished its
  // exit, so an effect on `step` would fire too early and find the outgoing
  // heading). Comparing against the last-focused step keeps the first mount
  // focus-free — the page never scroll-jumps to the form on load.
  const focusPanelHeading = (node: HTMLHeadingElement | null) => {
    if (node && lastFocusedStepRef.current !== step) {
      lastFocusedStepRef.current = step;
      node.focus();
    }
  };

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setErrors({});
    // A failed transmit shouldn't keep warning once the visitor goes back to
    // adjust the enquiry — the next attempt reports its own outcome.
    setStatus((current) => (current === "fallback" ? "idle" : current));
    setStep(next);
  };

  const advance = () => {
    const stageErrors = validateStage(step, data);
    if (Object.keys(stageErrors).length > 0) {
      setErrors(stageErrors);
      return false;
    }
    if (step < STAGES.length - 1) {
      goTo(step + 1);
    }
    return true;
  };

  async function transmit() {
    const stageErrors = validateStage(3, data);
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
  const budgetIndex = Math.max(0, BUDGET_OPTIONS.indexOf(data.budget));
  const stage = STAGES[step] ?? STAGES[0];

  if (status === "sent") {
    return (
      <div className="ss-core-form ss-enq ss-srv2-beam-border" id="contact-form-panel">
        <div className="ss-enq__terminal" role="status">
          <CheckCircle2Icon aria-hidden="true" className="ss-enq__terminal-icon" />
          <p className="ss-enq__terminal-title">Transmission received</p>
          <p className="ss-enq__terminal-body">
            Thank you — your enquiry is now in the Silverstone inbox. We'll reply to{" "}
            <strong>{data.email.trim()}</strong>.
          </p>
        </div>
      </div>
    );
  }

  const recap = [
    data.interest ? ["Focus", data.interest] : null,
    data.companySize ? ["Team", data.companySize] : null,
    ["Budget", data.budget],
    data.timeline ? ["Timeline", data.timeline] : null,
  ].filter((entry): entry is [string, string] => entry !== null);

  return (
    <form
      className="ss-core-form ss-enq ss-srv2-beam-border"
      aria-label="Silverstone enquiry form"
      onSubmit={(event) => {
        event.preventDefault();
        if (step < STAGES.length - 1) {
          advance();
        } else {
          void transmit();
        }
      }}
    >
      <div className="ss-enq__rail" aria-hidden="true">
        <span className="ss-enq__rail-label">Enquiry console</span>
        <span className="ss-enq__rail-track" />
        <span className="ss-enq__rail-count">
          {String(step + 1).padStart(2, "0")} / {String(STAGES.length).padStart(2, "0")}
        </span>
      </div>

      <ol className="ss-enq__stages">
        {STAGES.map((entry, index) => {
          const state = index === step ? "current" : index < step ? "done" : "ahead";
          return (
            <li key={entry.id} data-state={state}>
              <button
                type="button"
                onClick={() => index < step && goTo(index)}
                disabled={index >= step || submitting}
                aria-current={index === step ? "step" : undefined}
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
        <span style={{ width: `${String(((step + 1) / STAGES.length) * 100)}%` }} />
      </div>

      <p className="sr-only" aria-live="polite">
        Step {step + 1} of {STAGES.length}: {stage.label}
      </p>

      <div className="ss-enq__viewport">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <m.section
            key={stage.id}
            className="ss-enq__panel"
            custom={direction}
            variants={reducedMotion ? REDUCED_PANEL_VARIANTS : PANEL_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            aria-label={`${stage.label} — step ${String(step + 1)} of ${String(STAGES.length)}`}
          >
            <h3 className="ss-enq__panel-title" ref={focusPanelHeading} tabIndex={-1}>
              {stage.title}
            </h3>

            {step === 0 ? (
              <div className="ss-enq__fields">
                <p className="ss-enq__hint">
                  Two taps, both optional — they route your enquiry to the right
                  preparation before anyone replies.
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
            ) : null}

            {step === 1 ? (
              <div className="ss-enq__fields">
                <p className="ss-enq__hint">
                  Nothing here is a commitment — it simply means the discovery call
                  starts with the right questions already prepared.
                </p>
                <div
                  className="ss-enq__slider"
                  style={
                    {
                      "--enq-fill": `${String((budgetIndex / (BUDGET_OPTIONS.length - 1)) * 100)}%`,
                    } as CSSProperties
                  }
                >
                  <div className="ss-enq__slider-readout">
                    <span>Indicative budget</span>
                    <strong>{data.budget}</strong>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={BUDGET_OPTIONS.length - 1}
                    step={1}
                    value={budgetIndex}
                    onChange={(event) =>
                      patch({
                        budget:
                          BUDGET_OPTIONS[Number(event.target.value)] ?? "Not sure yet",
                      })
                    }
                    aria-label="Indicative budget"
                    aria-valuetext={data.budget}
                    disabled={submitting}
                  />
                  <div className="ss-enq__slider-ticks" aria-hidden="true">
                    {BUDGET_OPTIONS.map((option) => (
                      <span key={option} data-active={option === data.budget}>
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
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
              </div>
            ) : null}

            {step === 2 ? (
              <div className="ss-enq__fields">
                <div className="ss-core-form__grid">
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
                </div>
                <div className="ss-core-form__grid">
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
            ) : null}

            {step === 3 ? (
              <div className="ss-enq__fields">
                {recap.length > 0 ? (
                  <dl className="ss-enq__recap" aria-label="Enquiry summary">
                    {recap.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <label className="ss-enq__field">
                  <span>What would you like to improve?</span>
                  <textarea
                    name="message"
                    rows={6}
                    maxLength={MESSAGE_MAX_LENGTH}
                    placeholder="e.g. Enquiries reach us by phone and Instagram, but half go unanswered outside opening hours — we want them captured, qualified and booked automatically."
                    value={data.message}
                    onChange={(event) => patch({ message: event.target.value })}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={
                      errors.message ? "enq-error-message" : "enq-message-count"
                    }
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
                  Do not include passwords, payment information, health records or other
                  sensitive personal data.
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
            ) : null}
          </m.section>
        </AnimatePresence>
      </div>

      <div className="ss-enq__nav">
        {step > 0 ? (
          <button
            className="ss-srv2-btn ss-srv2-btn--ghost"
            type="button"
            onClick={() => goTo(step - 1)}
            disabled={submitting}
          >
            <ArrowLeft aria-hidden="true" />
            Back
          </button>
        ) : (
          <a className="ss-enq__mailto" href="mailto:info@silverstone-ai.com">
            Email instead
          </a>
        )}
        {step < STAGES.length - 1 ? (
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
                Transmit enquiry <Send aria-hidden="true" />
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
    </form>
  );
}
