import { CalendarCheck, CheckCircle2Icon, Mail } from "~/components/icons/lucide";
import { formatLongDate, formatSlotTime } from "~/features/booking/booking-dates";
import {
  serviceLabels,
  type BookingConfirmation,
  type BookingMode,
  type QualificationAnswers,
} from "~/features/booking/booking-types";

type ConfirmationStageProps = {
  confirmation: BookingConfirmation;
  mode: BookingMode;
  qualification: QualificationAnswers;
};

export function ConfirmationStage({
  confirmation,
  mode,
  qualification,
}: ConfirmationStageProps) {
  const isLive = mode === "live";

  return (
    <div className="ss-booking-stage ss-booking-confirmation">
      <div className="ss-booking-confirmation__mark" aria-hidden="true">
        <CheckCircle2Icon />
        <span />
      </div>
      <div className="ss-booking-stage__heading">
        <span>04 · Confirmed</span>
        <h4 id="booking-stage-heading" tabIndex={-1}>
          {isLive ? "The call is secured" : "Preview booking simulated"}
        </h4>
        <p>
          {isLive
            ? "Calendly accepted the booking. Watch your email for calendar details."
            : "No appointment or email was created in this safe preview."}
        </p>
      </div>
      <dl className="ss-booking-confirmation__facts">
        <div>
          <dt>
            <CalendarCheck aria-hidden="true" />
            Discovery call
          </dt>
          <dd>{formatLongDate(confirmation.startTime, confirmation.timezone)}</dd>
        </div>
        <div>
          <dt>Local time</dt>
          <dd>
            {formatSlotTime(confirmation.startTime, confirmation.timezone)} ·{" "}
            {String(confirmation.durationMinutes)} minutes
          </dd>
        </div>
        <div>
          <dt>Timezone</dt>
          <dd>{confirmation.timezone.replaceAll("_", " ")}</dd>
        </div>
        <div>
          <dt>
            <Mail aria-hidden="true" />
            Confirmation destination
          </dt>
          <dd>{confirmation.confirmationEmail}</dd>
        </div>
      </dl>
      <div className="ss-booking-confirmation__brief">
        <span>Discovery brief</span>
        <p>
          {serviceLabels(qualification.services).join(", ")} · {qualification.industry}{" "}
          · {qualification.budget} · {qualification.urgency}
        </p>
        {!confirmation.qualificationTransmitted ? (
          <small>
            Your brief is preserved here but was not attached because this event type
            has no matching custom questions.
          </small>
        ) : null}
      </div>
      {confirmation.cancelUrl || confirmation.rescheduleUrl ? (
        <div className="ss-booking-confirmation__links">
          {confirmation.rescheduleUrl ? (
            <a href={confirmation.rescheduleUrl}>Reschedule</a>
          ) : null}
          {confirmation.cancelUrl ? (
            <a href={confirmation.cancelUrl}>Cancel booking</a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
