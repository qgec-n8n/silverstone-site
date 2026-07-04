/**
 * Contact enquiry form. Submits to the repository's real configured
 * endpoint (`/.netlify/functions/send-email`, the same path referenced in
 * the approved content registry's contact interaction) and falls back to a
 * direct mailto route if that request can't be confirmed — no staging
 * language, no fabricated always-succeeds mock.
 */
import { useState, type SubmitEvent } from "react";

import { AlertCircleIcon, CheckCircle2Icon, Send } from "~/components/icons/lucide";

type Status = "idle" | "submitting" | "sent" | "fallback";

const ENQUIRY_ENDPOINT = "/.netlify/functions/send-email";

async function submitEnquiry(
  payload: Record<string, FormDataEntryValue>,
): Promise<void> {
  const response = await fetch(ENQUIRY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Enquiry endpoint responded with ${String(response.status)}`);
  }
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const payload = Object.fromEntries(new FormData(form).entries());
    setStatus("submitting");
    try {
      await submitEnquiry(payload);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("fallback");
    }
  }

  return (
    <form
      className="ss-core-form ss-srv2-beam-border"
      aria-label="Silverstone enquiry form"
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <div className="ss-core-form__grid">
        <label>
          <span>Name</span>
          <input
            name="name"
            autoComplete="name"
            required
            placeholder="Your full name"
            disabled={status === "submitting"}
          />
        </label>
        <label>
          <span>Work email</span>
          <input
            name="email"
            autoComplete="email"
            type="email"
            required
            placeholder="name@company.com"
            disabled={status === "submitting"}
          />
        </label>
      </div>
      <div className="ss-core-form__grid">
        <label>
          <span>
            Phone <em>optional</em>
          </span>
          <input
            name="phone"
            autoComplete="tel"
            type="tel"
            inputMode="tel"
            placeholder="+44 7000 000000"
            disabled={status === "submitting"}
          />
        </label>
        <label>
          <span>
            Company <em>optional</em>
          </span>
          <input
            name="company"
            autoComplete="organization"
            placeholder="Company or organisation"
            disabled={status === "submitting"}
          />
        </label>
      </div>
      <div className="ss-core-form__grid">
        <label>
          <span>
            Area of interest <em>optional</em>
          </span>
          <select name="interest" defaultValue="" disabled={status === "submitting"}>
            <option value="" disabled>
              Select the closest match
            </option>
            <option>Web Design &amp; Development</option>
            <option>App Development</option>
            <option>AI Voice Agents</option>
            <option>AI Receptionists</option>
            <option>AI Automation</option>
            <option>AI &amp; Automation Consulting</option>
            <option>Content Creation</option>
            <option>Partnership or other enquiry</option>
          </select>
        </label>
        <label>
          <span>
            Company size <em>optional</em>
          </span>
          <select name="companySize" defaultValue="" disabled={status === "submitting"}>
            <option value="" disabled>
              Select your team size
            </option>
            <option>Just me</option>
            <option>2–10 people</option>
            <option>11–50 people</option>
            <option>50+ people</option>
          </select>
        </label>
      </div>
      <div className="ss-core-form__snapshot">
        <p className="ss-core-form__snapshot-title">
          Quick discovery snapshot <em>optional — 20 seconds</em>
        </p>
        <p className="ss-core-form__snapshot-hint">
          Two taps that let us arrive at the call with the right questions already
          prepared.
        </p>
        <fieldset className="ss-core-form__seg" disabled={status === "submitting"}>
          <legend>Indicative budget</legend>
          <div className="ss-core-form__seg-options">
            {["Under £1k", "£1k–£3k", "£3k–£10k", "£10k+", "Not sure yet"].map(
              (option) => (
                <label className="ss-core-form__seg-option" key={option}>
                  <input type="radio" name="budget" value={option} />
                  <span>{option}</span>
                </label>
              ),
            )}
          </div>
        </fieldset>
        <fieldset className="ss-core-form__seg" disabled={status === "submitting"}>
          <legend>How soon do you want this live?</legend>
          <div className="ss-core-form__seg-options">
            {[
              "As soon as possible",
              "Within a month",
              "1–3 months",
              "Just exploring",
            ].map((option) => (
              <label className="ss-core-form__seg-option" key={option}>
                <input type="radio" name="timeline" value={option} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <label>
        <span>What would you like to improve?</span>
        <textarea
          name="message"
          required
          maxLength={1600}
          rows={7}
          placeholder="Describe what is happening now, the outcome you want and the systems or people involved."
          disabled={status === "submitting"}
        />
      </label>
      <p className="ss-core-form__note">
        Do not include passwords, payment information, health records or other sensitive
        personal data.
      </p>
      <label className="ss-core-form__consent">
        <input
          type="checkbox"
          name="consent"
          required
          disabled={status === "submitting"}
        />
        <span>
          I agree to be contacted about this enquiry, in line with the{" "}
          <a href="/privacy-policy">privacy policy</a>.
        </span>
      </label>
      <div className="ss-core-form__actions">
        <button
          className="ss-srv2-btn ss-srv2-btn--primary"
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? (
            "Sending…"
          ) : (
            <>
              Send enquiry <Send aria-hidden="true" />
            </>
          )}
        </button>
        <a
          className="ss-srv2-btn ss-srv2-btn--ghost"
          href="mailto:info@silverstone-ai.com"
        >
          Email instead
        </a>
      </div>
      <div className="ss-core-form__status" role="status" aria-live="polite">
        {status === "sent" ? (
          <span className="ss-core-form__status-line" data-tone="success">
            <CheckCircle2Icon aria-hidden="true" />
            Message received — thank you. We'll reply to the email address you provided.
          </span>
        ) : null}
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
