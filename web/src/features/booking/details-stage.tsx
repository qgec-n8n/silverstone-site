import { useEffect } from "react";
import { Link } from "react-router";

import { CalendarCheck } from "~/components/icons/lucide";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  formatSelectedSlotLabel,
} from "~/features/booking/booking-dates";
import {
  serviceLabels,
  type AvailabilitySlot,
  type BookingDetails,
  type QualificationAnswers,
} from "~/features/booking/booking-types";

export type DetailErrors = Partial<Record<"name" | "email" | "acknowledged", string>>;

type DetailsStageProps = {
  value: BookingDetails;
  errors: DetailErrors;
  submitError: string;
  selectedSlot: AvailabilitySlot | null;
  timeZone: string;
  qualification: QualificationAnswers;
  onChange: (value: BookingDetails) => void;
  onSubmit: () => void;
};

export function DetailsStage({
  value,
  errors,
  submitError,
  selectedSlot,
  timeZone,
  qualification,
  onChange,
  onSubmit,
}: DetailsStageProps) {
  useEffect(() => {
    const firstInvalid = document.querySelector<HTMLElement>(
      '#booking-details-form [aria-invalid="true"]',
    );
    firstInvalid?.focus();
  }, [errors]);

  const update = <Key extends keyof BookingDetails>(
    key: Key,
    next: BookingDetails[Key],
  ) => {
    onChange({ ...value, [key]: next });
  };

  const briefSummary = [
    serviceLabels(qualification.services).join(", "),
    qualification.industry,
    qualification.budget,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="ss-booking-stage ss-booking-details">
      <div className="ss-booking-stage__heading">
        <span>03 · Your details</span>
        <h4 id="booking-stage-heading" tabIndex={-1}>
          Add the essentials
        </h4>
        <p>Enough context for a useful first conversation — nothing more.</p>
      </div>
      <div className="ss-booking-details__body">
        {selectedSlot ? (
          <div className="ss-booking-details__summary">
            <CalendarCheck aria-hidden="true" />
            <div>
              <strong>{formatSelectedSlotLabel(selectedSlot.startTime, timeZone)}</strong>
              <span>
                30 minutes · {timeZone.replaceAll("_", " ")}
                {briefSummary ? ` · ${briefSummary}` : ""}
              </span>
            </div>
          </div>
        ) : null}
        <form
          id="booking-details-form"
          className="ss-booking-details__form"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label>
            <span id="booking-name-label">
              Name <b aria-hidden="true">*</b>
            </span>
            <Input
              aria-labelledby="booking-name-label"
              name="name"
              autoComplete="name"
              value={value.name}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "booking-name-error" : undefined}
              onChange={(event) => update("name", event.target.value)}
            />
            <small id="booking-name-error">{errors.name}</small>
          </label>
          <label>
            <span id="booking-email-label">
              Email <b aria-hidden="true">*</b>
            </span>
            <Input
              aria-labelledby="booking-email-label"
              name="email"
              type="email"
              inputMode="email"
              spellCheck={false}
              autoComplete="email"
              value={value.email}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "booking-email-error" : undefined}
              onChange={(event) => update("email", event.target.value)}
            />
            <small id="booking-email-error">{errors.email}</small>
          </label>
          <label>
            <span id="booking-company-label">
              Company <em>Optional</em>
            </span>
            <Input
              aria-labelledby="booking-company-label"
              name="company"
              autoComplete="organization"
              maxLength={120}
              value={value.company}
              onChange={(event) => update("company", event.target.value)}
            />
            <small />
          </label>
          <label>
            <span id="booking-role-label">
              Role <em>Optional</em>
            </span>
            <Input
              aria-labelledby="booking-role-label"
              name="role"
              autoComplete="organization-title"
              maxLength={100}
              value={value.role}
              onChange={(event) => update("role", event.target.value)}
            />
            <small />
          </label>
          <label className="ss-booking-details__context">
            <span id="booking-context-label">
              Useful context <em>Optional · 600 characters</em>
            </span>
            <Textarea
              aria-labelledby="booking-context-label"
              name="context"
              autoComplete="off"
              maxLength={600}
              rows={3}
              placeholder="e.g. One process, journey or decision you want to improve…"
              value={value.context}
              onChange={(event) => update("context", event.target.value)}
            />
            <small>{String(value.context.length)}/600</small>
          </label>
          <label className="ss-booking-details__acknowledgement">
            <input
              type="checkbox"
              checked={value.acknowledged}
              aria-invalid={Boolean(errors.acknowledged)}
              aria-describedby={errors.acknowledged ? "booking-ack-error" : undefined}
              onChange={(event) => update("acknowledged", event.target.checked)}
            />
            <span>
              I agree that Silverstone may use these details to arrange and follow up
              this discovery call, in line with the{" "}
              <Link to="/privacy-policy">privacy policy</Link>.
            </span>
            <small id="booking-ack-error">{errors.acknowledged}</small>
          </label>
        </form>
      </div>
      <p className="ss-booking-stage__error" role="alert" aria-live="assertive">
        {submitError}
      </p>
    </div>
  );
}
