import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  MessageSquare,
  ShieldCheck,
} from "~/components/icons/lucide";
import { Button } from "~/components/ui/button";
import { submitBooking } from "~/features/booking/booking-api";
import { AvailabilityStage } from "~/features/booking/availability-stage";
import { BookingProgress } from "~/features/booking/booking-progress";
import { ConfirmationStage } from "~/features/booking/confirmation-stage";
import { DetailsStage, type DetailErrors } from "~/features/booking/details-stage";
import { QualificationStage } from "~/features/booking/qualification-stage";
import {
  EMPTY_DETAILS,
  EMPTY_QUALIFICATION,
  qualificationIsComplete,
  type AvailabilitySlot,
  type BookingConfirmation,
  type BookingDetails,
  type BookingMode,
  type BookingStage,
  type QualificationAnswers,
} from "~/features/booking/booking-types";
import { BorderBeam } from "~/features/services-v2/components/primitives";
import { getPublicEnvironment } from "~/lib/environment";

const STAGE_ANNOUNCEMENTS: Record<BookingStage, string> = {
  qualify: "Step 1 of 4. Qualify the discovery call.",
  schedule: "Step 2 of 4. Choose a date and time.",
  details: "Step 3 of 4. Enter your details.",
  confirmed: "Step 4 of 4. Booking confirmed.",
};

function createIdempotencyKey(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `booking-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function validateDetails(value: BookingDetails): DetailErrors {
  const errors: DetailErrors = {};
  if (!value.name.trim()) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!value.acknowledged) {
    errors.acknowledged = "Please confirm the booking acknowledgement.";
  }
  return errors;
}

export function BookingPanel({ mode }: { mode?: BookingMode } = {}) {
  const bookingMode = mode ?? getPublicEnvironment().bookingMode;
  const reducedMotion = useReducedMotion() ?? false;
  const [stage, setStage] = useState<BookingStage>("qualify");
  const [qualification, setQualification] =
    useState<QualificationAnswers>(EMPTY_QUALIFICATION);
  const [details, setDetails] = useState<BookingDetails>(EMPTY_DETAILS);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [timeZone, setTimeZone] = useState(() => {
    if (typeof window === "undefined") return "Europe/London";
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/London";
  });
  const [qualificationError, setQualificationError] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [detailErrors, setDetailErrors] = useState<DetailErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const hasMounted = useRef(false);
  const idempotencyKey = useRef<string | null>(null);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const frame = requestAnimationFrame(() => {
      document.getElementById("booking-stage-heading")?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [stage]);

  const goToStage = (nextStage: BookingStage) => {
    if (stage === "confirmed") return;
    setQualificationError("");
    setScheduleError("");
    setSubmitError("");
    setStage(nextStage);
  };

  const continueFromQualification = () => {
    if (!qualificationIsComplete(qualification)) {
      setQualificationError(
        "Choose at least one service, then select an industry, budget and timing.",
      );
      return;
    }
    setQualificationError("");
    setStage("schedule");
  };

  const continueFromSchedule = () => {
    if (!selectedSlot) {
      setScheduleError("Select an available date and time to continue.");
      return;
    }
    setScheduleError("");
    setStage("details");
  };

  const book = async () => {
    const errors = validateDetails(details);
    setDetailErrors(errors);
    if (Object.keys(errors).length > 0 || !selectedSlot || submitting) return;

    setSubmitting(true);
    setSubmitError("");
    idempotencyKey.current ??= createIdempotencyKey();
    try {
      const response = await submitBooking(
        bookingMode,
        {
          startTime: selectedSlot.startTime,
          timezone: timeZone,
          qualification,
          details,
        },
        idempotencyKey.current,
      );
      if (!response.ok) {
        if (response.error.code === "SLOT_UNAVAILABLE") {
          setSelectedSlot(null);
          setScheduleError(response.error.message);
          setStage("schedule");
          idempotencyKey.current = null;
          return;
        }
        setSubmitError(response.error.message);
        if (!response.error.retryable) idempotencyKey.current = null;
        return;
      }
      setConfirmation(response.confirmation);
      setStage("confirmed");
    } catch {
      setSubmitError(
        "The booking could not be completed. Please try again or contact us in writing.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTimeLabel = selectedSlot
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone,
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(selectedSlot.startTime))
    : "No time selected";

  return (
    <div
      className="ss-core-booking ss-srv2-beam-border"
      id="booking-calendar"
      data-booking-mode={bookingMode}
      data-stage={stage}
      data-testid="booking-shell"
    >
      <div className="ss-booking-shell__ambient" aria-hidden="true">
        <span />
        <span />
      </div>
      <header className="ss-booking-shell__header">
        <div className="ss-booking-shell__intro">
          <span className="ss-srv2-bench__tag">
            <CalendarCheck aria-hidden="true" />
            30-minute discovery call
          </span>
          <h3>
            A private channel for <em>clear decisions</em>
          </h3>
          <p>
            Qualify the conversation, select a verified time and secure the call without
            leaving Silverstone.
          </p>
        </div>
        <div className="ss-booking-shell__security">
          <ShieldCheck aria-hidden="true" />
          <span>
            {bookingMode === "live"
              ? "Secure live availability"
              : bookingMode === "mock"
                ? "Safe preview simulation"
                : "Preview unavailable"}
          </span>
          <i data-live={bookingMode !== "disabled"} />
        </div>
      </header>

      <BookingProgress stage={stage} onNavigate={goToStage} />
      <p className="sr-only" aria-live="polite">
        {STAGE_ANNOUNCEMENTS[stage]}
      </p>

      <main className="ss-booking-shell__viewport">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stage}
            className="ss-booking-shell__stage-frame"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
            transition={{ duration: reducedMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {stage === "qualify" ? (
              <QualificationStage
                value={qualification}
                error={qualificationError}
                onChange={(value) => {
                  setQualification(value);
                  setQualificationError("");
                  idempotencyKey.current = null;
                }}
              />
            ) : stage === "schedule" ? (
              <AvailabilityStage
                mode={bookingMode}
                timeZone={timeZone}
                selectedSlot={selectedSlot}
                error={scheduleError}
                onTimeZoneChange={(value) => {
                  setTimeZone(value);
                  setScheduleError("");
                  idempotencyKey.current = null;
                }}
                onSelectSlot={(slot) => {
                  setSelectedSlot(slot);
                  setScheduleError("");
                  idempotencyKey.current = null;
                }}
              />
            ) : stage === "details" ? (
              <DetailsStage
                value={details}
                errors={detailErrors}
                submitError={submitError}
                onChange={(value) => {
                  setDetails(value);
                  setDetailErrors({});
                  setSubmitError("");
                  idempotencyKey.current = null;
                }}
                onSubmit={() => void book()}
              />
            ) : confirmation ? (
              <ConfirmationStage
                confirmation={confirmation}
                mode={bookingMode}
                qualification={qualification}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="ss-booking-shell__footer">
        <div className="ss-booking-shell__footer-secondary">
          {stage !== "qualify" && stage !== "confirmed" ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={submitting}
              onClick={() => goToStage(stage === "details" ? "schedule" : "qualify")}
            >
              <ArrowLeft aria-hidden="true" />
              Back
            </Button>
          ) : (
            <Link to="/contact#contact-form">
              <MessageSquare aria-hidden="true" />
              Contact instead
            </Link>
          )}
          {stage === "schedule" ? (
            <span className="ss-booking-shell__selection">{selectedTimeLabel}</span>
          ) : null}
        </div>
        {stage === "qualify" ? (
          <Button
            type="button"
            className="ss-booking-shell__primary"
            onClick={continueFromQualification}
          >
            Continue to availability
            <ArrowRight aria-hidden="true" />
          </Button>
        ) : stage === "schedule" ? (
          <Button
            type="button"
            className="ss-booking-shell__primary"
            disabled={!selectedSlot}
            onClick={continueFromSchedule}
          >
            Continue to details
            <ArrowRight aria-hidden="true" />
          </Button>
        ) : stage === "details" ? (
          <Button
            type="submit"
            form="booking-details-form"
            className="ss-booking-shell__primary"
            disabled={submitting}
          >
            {submitting ? (
              <span className="ss-booking-submit-spinner" aria-hidden="true" />
            ) : (
              <Check aria-hidden="true" />
            )}
            {submitting ? "Securing the call…" : "Confirm booking"}
          </Button>
        ) : (
          <Link className="ss-booking-shell__complete" to="/how-we-work">
            See how we work
            <ArrowRight aria-hidden="true" />
          </Link>
        )}
      </footer>
      <BorderBeam />
    </div>
  );
}
