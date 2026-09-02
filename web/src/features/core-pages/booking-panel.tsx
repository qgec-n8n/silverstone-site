import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
import {
  invalidateAvailabilitySlot,
  submitBooking,
} from "~/features/booking/booking-api";
import { AvailabilityStage } from "~/features/booking/availability-stage";
import { BookingProgress } from "~/features/booking/booking-progress";
import { ConfirmationStage } from "~/features/booking/confirmation-stage";
import { DetailsStage } from "~/features/booking/details-stage";
import {
  MobileBookingFlow,
  PANEL_STAGE,
  type MobilePanel,
} from "~/features/booking/mobile-booking-flow";
import { QualificationStage } from "~/features/booking/qualification-stage";
import {
  EMPTY_DETAILS,
  EMPTY_QUALIFICATION,
  qualificationIsComplete,
  validateBookingDetails,
  type AvailabilitySlot,
  type BookingConfirmation,
  type BookingDetails,
  type BookingMode,
  type BookingStage,
  type DetailErrors,
  type QualificationAnswers,
} from "~/features/booking/booking-types";
import { formatSelectedSlotLabel } from "~/features/booking/booking-dates";
import { BorderBeam } from "~/features/services-v2/components/primitives";
import { getPublicEnvironment } from "~/lib/environment";

const STAGE_ANNOUNCEMENTS: Record<BookingStage, string> = {
  schedule: "Step 1 of 4. Choose a date and time.",
  qualify: "Step 2 of 4. Add four quick discovery cues.",
  details: "Step 3 of 4. Enter your details.",
  confirmed: "Step 4 of 4. Booking confirmed.",
};

const BACK_TARGET: Partial<Record<BookingStage, BookingStage>> = {
  qualify: "schedule",
  details: "qualify",
};

/* Hydration-safe client detection (matches the repo's demo components):
   the server snapshot renders the London fallback, the client snapshot flips
   once after hydration without a state-setting effect. */
const emptySubscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/* Same width gate as the stylesheet's mobile composition. The prerendered
   HTML is always the desktop composition; phones swap to the dedicated
   mobile flow in the first client render after hydration. */
const MOBILE_MEDIA = "(max-width: 44rem)";

function subscribeMobile(onChange: () => void): () => void {
  const query = window.matchMedia(MOBILE_MEDIA);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const readMobile = () => window.matchMedia(MOBILE_MEDIA).matches;
const serverMobile = () => false;

function detectTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/London";
  } catch {
    return "Europe/London";
  }
}

function createIdempotencyKey(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `booking-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/* Dev-only escape hatch: VITE_DEV_BOOKING_MODE=live (web/.env.staging.local)
   points the console at the real Calendly pipeline through the dev server's
   functions bridge. `import.meta.env.DEV` is statically false in every
   build, so no shipped bundle can ever read the override. */
function devBookingModeOverride(): BookingMode | undefined {
  if (!import.meta.env.DEV) return undefined;
  const source = import.meta.env as Record<string, unknown>;
  return source.VITE_DEV_BOOKING_MODE === "live" ? "live" : undefined;
}

export function BookingPanel({ mode }: { mode?: BookingMode } = {}) {
  const bookingMode =
    mode ?? devBookingModeOverride() ?? getPublicEnvironment().bookingMode;
  const reducedMotion = useReducedMotion() ?? false;
  const [stage, setStage] = useState<BookingStage>("schedule");
  const [qualification, setQualification] =
    useState<QualificationAnswers>(EMPTY_QUALIFICATION);
  const [details, setDetails] = useState<BookingDetails>(EMPTY_DETAILS);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  /* Month + date selection live here (not in the stage component) so leaving
     Date & time and returning never loses the visitor's place. */
  const [month, setMonth] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState("");
  /* Server-rendered HTML uses the London fallback; the visitor's real
     timezone is applied after hydration so the markup never mismatches. */
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const isMobile = useSyncExternalStore(subscribeMobile, readMobile, serverMobile);
  /* The mobile flow's panel lives here so submit outcomes (confirmation,
     slot conflicts, validation errors) can route it directly, and so the
     shell's data-stage attribute stays truthful on both flows. */
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("date");
  const [timeZoneOverride, setTimeZoneOverride] = useState<string | null>(null);
  const timeZone = timeZoneOverride ?? (hydrated ? detectTimeZone() : "Europe/London");
  const [qualificationError, setQualificationError] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [detailErrors, setDetailErrors] = useState<DetailErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [availabilityRefreshToken, setAvailabilityRefreshToken] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const hasMounted = useRef(false);
  const idempotencyKey = useRef<string | null>(null);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (isMobile) return; // The mobile flow manages its own panel focus.
    const frame = requestAnimationFrame(() => {
      document.getElementById("booking-stage-heading")?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [stage, isMobile]);

  const goToStage = (nextStage: BookingStage) => {
    if (stage === "confirmed") return;
    setQualificationError("");
    setScheduleError("");
    setSubmitError("");
    setStage(nextStage);
  };

  const continueFromSchedule = () => {
    if (!selectedSlot) {
      setScheduleError("Select an available date and time to continue.");
      return;
    }
    setScheduleError("");
    setStage("qualify");
  };

  const continueFromQualification = () => {
    if (!qualificationIsComplete(qualification)) {
      setQualificationError(
        "Choose at least one service, then select an industry, budget and timing.",
      );
      return;
    }
    setQualificationError("");
    setStage("details");
  };

  const book = async () => {
    const errors = validateBookingDetails(details);
    setDetailErrors(errors);
    if (Object.keys(errors).length > 0 || !selectedSlot || submitting) {
      /* On mobile, name/email problems belong to the Details panel; a
         missing acknowledgement is resolved on the Confirm panel itself. */
      if (errors.name || errors.email) {
        setMobilePanel((current) => (current === "consent" ? "details" : current));
      }
      return;
    }

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
          invalidateAvailabilitySlot(bookingMode, timeZone, selectedSlot.startTime);
          setSelectedSlot(null);
          setScheduleError(
            "That time is no longer available. Availability has been refreshed — choose another highlighted time.",
          );
          setAvailabilityRefreshToken((value) => value + 1);
          setStage("schedule");
          setMobilePanel("date");
          idempotencyKey.current = null;
          return;
        }
        setSubmitError(response.error.message);
        if (!response.error.retryable) idempotencyKey.current = null;
        return;
      }
      setConfirmation(response.confirmation);
      setStage("confirmed");
      setMobilePanel("confirmed");
    } catch {
      setSubmitError(
        "The booking could not be completed. Please try again or contact us in writing.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTimeLabel = selectedSlot
    ? formatSelectedSlotLabel(selectedSlot.startTime, timeZone)
    : "No time selected yet";

  const handleSelectDate = (dateKey: string) => {
    setSelectedDateKey(dateKey);
    setSelectedSlot(null);
    setScheduleError("");
  };

  const handleTimeZoneChange = (value: string) => {
    setSelectedDateKey("");
    setSelectedSlot(null);
    setTimeZoneOverride(value);
    setScheduleError("");
    idempotencyKey.current = null;
  };

  const handleSelectSlot = (slot: AvailabilitySlot | null) => {
    setSelectedSlot(slot);
    setScheduleError("");
    idempotencyKey.current = null;
  };

  const handleQualificationChange = (value: QualificationAnswers) => {
    setQualification(value);
    setQualificationError("");
    idempotencyKey.current = null;
  };

  const handleDetailsChange = (value: BookingDetails) => {
    setDetails(value);
    setDetailErrors({});
    setSubmitError("");
    idempotencyKey.current = null;
  };

  return (
    <div
      className="ss-core-booking ss-srv2-beam-border"
      id="booking-calendar"
      data-booking-mode={bookingMode}
      data-stage={isMobile ? PANEL_STAGE[mobilePanel] : stage}
      data-flow={isMobile ? "mobile" : "desktop"}
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
            Reserve a private <em>decision-grade</em> conversation
          </h3>
          <p>
            Choose a verified time, add four quick cues so we arrive prepared, and
            confirm — all without leaving Silverstone AI.
          </p>
        </div>
        <div className="ss-booking-shell__security">
          <ShieldCheck aria-hidden="true" />
          <span>
            {bookingMode === "live"
              ? "Live availability · secured"
              : bookingMode === "mock"
                ? "Safe preview simulation"
                : "Preview unavailable"}
          </span>
          <i data-live={bookingMode !== "disabled"} />
        </div>
      </header>

      {isMobile ? (
        <MobileBookingFlow
          mode={bookingMode}
          hydrated={hydrated}
          timeZone={timeZone}
          month={month}
          selectedDateKey={selectedDateKey}
          selectedSlot={selectedSlot}
          qualification={qualification}
          details={details}
          detailErrors={detailErrors}
          scheduleError={scheduleError}
          availabilityRefreshToken={availabilityRefreshToken}
          submitError={submitError}
          submitting={submitting}
          confirmation={confirmation}
          onMonthChange={setMonth}
          onSelectDate={handleSelectDate}
          onTimeZoneChange={handleTimeZoneChange}
          onSelectSlot={handleSelectSlot}
          onQualificationChange={handleQualificationChange}
          onDetailsChange={handleDetailsChange}
          onSubmit={() => void book()}
          panel={mobilePanel}
          onPanelChange={setMobilePanel}
        />
      ) : (
        <>
          <BookingProgress stage={stage} onNavigate={goToStage} />
          <p className="sr-only" aria-live="polite">
            {STAGE_ANNOUNCEMENTS[stage]}
          </p>

          <div className="ss-booking-shell__viewport">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stage}
                className="ss-booking-shell__stage-frame"
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {stage === "schedule" ? (
                  <AvailabilityStage
                    mode={bookingMode}
                    hydrated={hydrated}
                    timeZone={timeZone}
                    month={month}
                    selectedDateKey={selectedDateKey}
                    selectedSlot={selectedSlot}
                    error={scheduleError}
                    availabilityRefreshToken={availabilityRefreshToken}
                    onMonthChange={setMonth}
                    onSelectDate={handleSelectDate}
                    onTimeZoneChange={handleTimeZoneChange}
                    onSelectSlot={handleSelectSlot}
                  />
                ) : stage === "qualify" ? (
                  <QualificationStage
                    value={qualification}
                    error={qualificationError}
                    onChange={handleQualificationChange}
                  />
                ) : stage === "details" ? (
                  <DetailsStage
                    value={details}
                    errors={detailErrors}
                    submitError={submitError}
                    selectedSlot={selectedSlot}
                    timeZone={timeZone}
                    qualification={qualification}
                    onChange={handleDetailsChange}
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
          </div>

          <footer className="ss-booking-shell__footer">
            <div className="ss-booking-shell__footer-secondary">
              {stage !== "schedule" && stage !== "confirmed" ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={submitting}
                  onClick={() => goToStage(BACK_TARGET[stage] ?? "schedule")}
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
              {stage === "schedule" || stage === "qualify" ? (
                <span
                  className="ss-booking-shell__selection"
                  data-set={Boolean(selectedSlot)}
                >
                  {selectedTimeLabel}
                </span>
              ) : null}
            </div>
            {stage === "schedule" ? (
              <Button
                type="button"
                className="ss-booking-shell__primary"
                disabled={!selectedSlot}
                onClick={continueFromSchedule}
              >
                Continue with this time
                <ArrowRight aria-hidden="true" />
              </Button>
            ) : stage === "qualify" ? (
              <Button
                type="button"
                className="ss-booking-shell__primary"
                onClick={continueFromQualification}
              >
                Continue to your details
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
        </>
      )}
      <BorderBeam />
    </div>
  );
}
