/**
 * Mobile-only booking flow — one decision per screen, zero internal scroll.
 *
 * The desktop console asks visitors to work inside two-pane stages; a phone
 * gets a different instrument entirely: six compact panels (day → time →
 * focus → context → details → consent) that each fit the fixed shell
 * height by construction, sequenced under the same four-step progress rail
 * (day+time = 01, focus+context = 02, details+consent = 03, confirmed = 04).
 *
 * The signature panel is the time dial: instead of a scrolling slot list,
 * one large readout shows the selected time, chevron steppers walk the day's
 * verified slots, Morning/Afternoon/Evening jumps skip across the day, and a
 * tick track visualises every slot's position. Any number of slots fits in a
 * fixed-height panel.
 *
 * State lives in BookingPanel (shared with the desktop composition), so
 * rotating a phone or resizing never loses the visitor's place. This
 * component only chooses which panel is on stage.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  RotateCcw,
} from "~/components/icons/lucide";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { BookingProgress } from "~/features/booking/booking-progress";
import { ConfirmationStage } from "~/features/booking/confirmation-stage";
import {
  addDays,
  bookingHorizonKey,
  calendarGridStart,
  dateKeyInTimeZone,
  formatDateKey,
  formatSelectedSlotLabel,
  formatSlotTime,
  parseDateKey,
} from "~/features/booking/booking-dates";
import {
  BUDGET_OPTIONS,
  INDUSTRY_OPTIONS,
  SERVICE_OPTIONS,
  URGENCY_OPTIONS,
  serviceLabels,
  validateBookingDetails,
  type AvailabilitySlot,
  type BookingConfirmation,
  type BookingDetails,
  type BookingMode,
  type BookingStage,
  type DetailErrors,
  type QualificationAnswers,
  type ServiceId,
} from "~/features/booking/booking-types";
import { useBookingAvailability } from "~/features/booking/use-booking-availability";

export type MobilePanel =
  | "date"
  | "time"
  | "focus"
  | "context"
  | "details"
  | "consent"
  | "confirmed";

/** Progress rail group each panel belongs to. */
export const PANEL_STAGE: Record<MobilePanel, BookingStage> = {
  date: "schedule",
  time: "schedule",
  focus: "qualify",
  context: "qualify",
  details: "details",
  consent: "details",
  confirmed: "confirmed",
};

const STAGE_FIRST_PANEL: Record<BookingStage, MobilePanel> = {
  schedule: "date",
  qualify: "focus",
  details: "details",
  confirmed: "confirmed",
};

const PANEL_BACK: Partial<Record<MobilePanel, MobilePanel>> = {
  time: "date",
  focus: "time",
  context: "focus",
  details: "context",
  consent: "details",
};

const PANEL_ANNOUNCEMENTS: Record<MobilePanel, string> = {
  date: "Step 1 of 4. Pick a day.",
  time: "Step 1 of 4. Choose a time with the dial.",
  focus: "Step 2 of 4. Choose up to three services.",
  context: "Step 2 of 4. Add industry, budget and timing.",
  details: "Step 3 of 4. Enter your name and email.",
  consent: "Step 4 of 4. Review and confirm the booking.",
  confirmed: "Booking confirmed.",
};

const COMMON_TIMEZONES = [
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
];

type DaySegment = {
  id: "morning" | "afternoon" | "evening";
  label: string;
  slots: AvailabilitySlot[];
};

function segmentSlots(
  slots: readonly AvailabilitySlot[],
  timeZone: string,
): DaySegment[] {
  const segments: DaySegment[] = [
    { id: "morning", label: "Morning", slots: [] },
    { id: "afternoon", label: "Afternoon", slots: [] },
    { id: "evening", label: "Evening", slots: [] },
  ];
  for (const slot of slots) {
    const hour = Number(
      new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        hour12: false,
      }).format(new Date(slot.startTime)),
    );
    const index = hour < 12 ? 0 : hour < 17 ? 1 : 2;
    segments[index]?.slots.push(slot);
  }
  return segments;
}

function formatDayChip(dateKey: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(parseDateKey(dateKey));
}

type MobileBookingFlowProps = {
  mode: BookingMode;
  hydrated: boolean;
  timeZone: string;
  month: Date;
  selectedDateKey: string;
  selectedSlot: AvailabilitySlot | null;
  qualification: QualificationAnswers;
  details: BookingDetails;
  detailErrors: DetailErrors;
  scheduleError: string;
  availabilityRefreshToken?: number;
  submitError: string;
  submitting: boolean;
  confirmation: BookingConfirmation | null;
  onMonthChange: (month: Date) => void;
  onSelectDate: (dateKey: string) => void;
  onTimeZoneChange: (timeZone: string) => void;
  onSelectSlot: (slot: AvailabilitySlot | null) => void;
  onQualificationChange: (value: QualificationAnswers) => void;
  onDetailsChange: (value: BookingDetails) => void;
  onSubmit: () => void;
  /* Controlled panel: BookingPanel owns it so submit outcomes (confirmation,
     slot conflicts, validation errors) can route the flow directly. */
  panel: MobilePanel;
  onPanelChange: (panel: MobilePanel) => void;
};

export function MobileBookingFlow({
  mode,
  hydrated,
  timeZone,
  month,
  selectedDateKey,
  selectedSlot,
  qualification,
  details,
  detailErrors,
  scheduleError,
  availabilityRefreshToken = 0,
  submitError,
  submitting,
  confirmation,
  onMonthChange,
  onSelectDate,
  onTimeZoneChange,
  onSelectSlot,
  onQualificationChange,
  onDetailsChange,
  onSubmit,
  panel,
  onPanelChange,
}: MobileBookingFlowProps) {
  const reducedMotion = useReducedMotion() ?? false;
  /* Step-level name/email validation (the parent re-validates on submit). */
  const [stepErrors, setStepErrors] = useState<DetailErrors>({});
  const [focusError, setFocusError] = useState("");
  const hasMounted = useRef(false);

  const [today] = useState(() => new Date());
  const availability = useBookingAvailability(
    month,
    timeZone,
    mode,
    hydrated,
    availabilityRefreshToken,
  );
  const todayKey = dateKeyInTimeZone(today.toISOString(), timeZone);
  const horizonKey = bookingHorizonKey(todayKey);
  const horizonDate = parseDateKey(horizonKey);
  const gridStart = calendarGridStart(month);
  const gridEndExclusive = addDays(gridStart, 42);
  const zonedToday = parseDateKey(todayKey);
  const availableDateKeys = [...availability.slotsByDate.keys()].filter(
    (key) =>
      key >= todayKey &&
      key <= horizonKey &&
      key >= gridStart &&
      key < gridEndExclusive,
  );
  const availableDates = availableDateKeys.map(parseDateKey);
  const selectedDate = selectedDateKey ? parseDateKey(selectedDateKey) : undefined;
  const daySlots = useMemo(
    () =>
      selectedDateKey ? (availability.slotsByDate.get(selectedDateKey) ?? []) : [],
    [availability.slotsByDate, selectedDateKey],
  );
  const loading =
    !hydrated || availability.status === "loading" || availability.status === "idle";
  const timeZoneOptions = [...new Set([timeZone, ...COMMON_TIMEZONES])];

  const stage = PANEL_STAGE[panel];

  const goTo = (next: MobilePanel) => {
    setFocusError("");
    onPanelChange(next);
  };

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const frame = requestAnimationFrame(() => {
      document.getElementById("booking-stage-heading")?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [panel]);

  /* Entering the dial with no time selected arms it with the day's first
     slot, so the readout is never empty and stepping starts immediately. */
  useEffect(() => {
    if (panel !== "time" || selectedSlot || daySlots.length === 0) return;
    const first = daySlots[0];
    if (first) onSelectSlot(first);
  }, [panel, selectedSlot, daySlots, onSelectSlot]);

  const slotIndex = selectedSlot
    ? daySlots.findIndex((slot) => slot.startTime === selectedSlot.startTime)
    : -1;
  const segments = segmentSlots(daySlots, timeZone);

  const stepSlot = (direction: -1 | 1) => {
    const next = daySlots[slotIndex + direction];
    if (next) onSelectSlot(next);
  };

  const toggleService = (service: ServiceId) => {
    const selected = qualification.services.includes(service);
    if (!selected && qualification.services.length >= 3) return;
    setFocusError("");
    onQualificationChange({
      ...qualification,
      services: selected
        ? qualification.services.filter((item) => item !== service)
        : [...qualification.services, service],
    });
  };

  const updateDetails = <Key extends keyof BookingDetails>(
    key: Key,
    next: BookingDetails[Key],
  ) => {
    setStepErrors({});
    onDetailsChange({ ...details, [key]: next });
  };

  const continueFromDetails = () => {
    const errors = validateBookingDetails({ ...details, acknowledged: true });
    if (errors.name || errors.email) {
      setStepErrors(errors);
      return;
    }
    setStepErrors({});
    goTo("consent");
  };

  const effectiveDetailErrors: DetailErrors = { ...detailErrors, ...stepErrors };
  const contextComplete =
    qualification.industry !== "" &&
    qualification.budget !== "" &&
    qualification.urgency !== "";

  const briefSummary = [
    serviceLabels(qualification.services).join(", "),
    qualification.industry,
    qualification.budget,
  ]
    .filter(Boolean)
    .join(" · ");

  const dialStatus =
    availability.status === "error" ? (
      <div className="ss-booking-times-state" role="alert">
        <RotateCcw aria-hidden="true" />
        <strong>Availability interrupted</strong>
        <p>{availability.error?.message}</p>
        {availability.error?.retryable ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={availability.retry}
          >
            Try again
          </Button>
        ) : null}
      </div>
    ) : daySlots.length === 0 ? (
      <div className="ss-booking-times-state">
        <CalendarCheck aria-hidden="true" />
        <strong>No remaining times</strong>
        <p>Step back and pick another illuminated day.</p>
      </div>
    ) : null;

  return (
    <div className="ss-booking-mflow" data-stage={stage}>
      <BookingProgress
        stage={stage}
        onNavigate={(target) => {
          if (panel === "confirmed") return;
          goTo(STAGE_FIRST_PANEL[target]);
        }}
      />
      <p className="sr-only" aria-live="polite">
        {PANEL_ANNOUNCEMENTS[panel]}
      </p>

      <div className="ss-booking-shell__viewport">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={panel}
            className="ss-booking-shell__stage-frame"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
            transition={{ duration: reducedMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {panel === "date" ? (
              <div className="ss-booking-stage ss-booking-mstage ss-booking-mdate">
                <div className="ss-booking-stage__heading ss-booking-stage__heading--schedule">
                  <span>01 · Day</span>
                  <h4 id="booking-stage-heading" tabIndex={-1}>
                    Pick a day
                  </h4>
                  <label className="ss-booking-timezone">
                    <span>Times shown in</span>
                    <select
                      aria-label="Booking timezone"
                      value={timeZone}
                      onChange={(event) => {
                        onTimeZoneChange(event.target.value);
                      }}
                    >
                      {timeZoneOptions.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <section
                  className="ss-booking-calendar-pane ss-booking-mdate__pane"
                  aria-label="Available dates"
                  aria-busy={loading || availability.status === "refreshing"}
                >
                  <div className="ss-booking-calendar-pane__status" aria-live="polite">
                    <span
                      className="ss-booking-status-dot"
                      data-active={availability.status === "ready"}
                    />
                    {loading
                      ? "Checking verified availability…"
                      : availability.status === "refreshing"
                        ? "Refreshing availability…"
                        : `${String(availableDateKeys.length)} open dates in view`}
                  </div>
                  {hydrated ? (
                    <Calendar
                      mode="single"
                      month={month}
                      selected={selectedDate}
                      today={zonedToday}
                      onMonthChange={onMonthChange}
                      onSelect={(date) => {
                        if (!date) return;
                        onSelectDate(formatDateKey(date));
                        goTo("time");
                      }}
                      startMonth={
                        new Date(zonedToday.getFullYear(), zonedToday.getMonth(), 1)
                      }
                      endMonth={
                        new Date(horizonDate.getFullYear(), horizonDate.getMonth(), 1)
                      }
                      disabled={(date) => {
                        const key = formatDateKey(date);
                        return (
                          key < todayKey ||
                          key > horizonKey ||
                          !availability.slotsByDate.has(key)
                        );
                      }}
                      modifiers={{
                        available: availableDates,
                        loading:
                          availability.status === "loading" ||
                          availability.status === "refreshing"
                            ? {
                                after: new Date(today.getTime() - 86_400_000),
                                before: parseDateKey(addDays(horizonKey, 1)),
                              }
                            : [],
                      }}
                      modifiersClassNames={{
                        available: "is-available",
                        loading: "is-loading",
                      }}
                    />
                  ) : (
                    <div className="ss-booking-calendar-skeleton" aria-hidden="true">
                      {Array.from({ length: 42 }, (_, index) => (
                        <Skeleton key={index} />
                      ))}
                    </div>
                  )}
                  <div className="ss-booking-calendar-legend" aria-hidden="true">
                    <span>
                      <i data-tone="available" />
                      Available
                    </span>
                    <span>
                      <i data-tone="selected" />
                      Selected
                    </span>
                    <span>
                      <i data-tone="today" />
                      Today
                    </span>
                  </div>
                </section>
                <p className="ss-booking-stage__error" role="alert" aria-live="polite">
                  {scheduleError}
                </p>
              </div>
            ) : panel === "time" ? (
              <div className="ss-booking-stage ss-booking-mstage ss-booking-mtime">
                <div className="ss-booking-stage__heading ss-booking-stage__heading--schedule">
                  <span>01 · Time</span>
                  <h4 id="booking-stage-heading" tabIndex={-1}>
                    Choose your moment
                  </h4>
                  <button
                    type="button"
                    className="ss-booking-mtime__day-chip"
                    onClick={() => goTo("date")}
                  >
                    <CalendarCheck aria-hidden="true" />
                    {selectedDateKey ? formatDayChip(selectedDateKey) : "Pick a day"}
                  </button>
                </div>
                <section
                  className="ss-booking-mtime__pane"
                  aria-label="Available times"
                >
                  {loading ? (
                    <div className="ss-booking-mdial-skeleton" role="status">
                      <span className="sr-only">Loading available times</span>
                      <Skeleton className="h-16 w-40" />
                      <Skeleton className="h-9 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  ) : (
                    (dialStatus ?? (
                      <>
                        <div className="ss-booking-mdial">
                          <button
                            type="button"
                            className="ss-booking-mdial__step"
                            aria-label="Earlier time"
                            disabled={slotIndex <= 0}
                            onClick={() => stepSlot(-1)}
                          >
                            <ChevronLeft aria-hidden="true" />
                          </button>
                          <div className="ss-booking-mdial__readout">
                            <AnimatePresence mode="popLayout" initial={false}>
                              <motion.strong
                                key={selectedSlot?.startTime ?? "none"}
                                initial={
                                  reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }
                                }
                                animate={{ opacity: 1, y: 0 }}
                                exit={
                                  reducedMotion
                                    ? { opacity: 1 }
                                    : { opacity: 0, y: -12 }
                                }
                                transition={{
                                  duration: reducedMotion ? 0 : 0.18,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                              >
                                {selectedSlot
                                  ? formatSlotTime(selectedSlot.startTime, timeZone)
                                  : "--:--"}
                              </motion.strong>
                            </AnimatePresence>
                            <span aria-live="polite">
                              {selectedSlot
                                ? `30 minutes · ${String(slotIndex + 1)} of ${String(daySlots.length)}`
                                : "Select a time"}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="ss-booking-mdial__step"
                            aria-label="Later time"
                            disabled={slotIndex < 0 || slotIndex >= daySlots.length - 1}
                            onClick={() => stepSlot(1)}
                          >
                            <ChevronRight aria-hidden="true" />
                          </button>
                        </div>
                        <div
                          className="ss-booking-mdial__track"
                          aria-hidden="true"
                          data-count={daySlots.length}
                        >
                          {daySlots.map((slot, index) => (
                            <i
                              key={slot.startTime}
                              data-active={index === slotIndex || undefined}
                              data-past={index < slotIndex || undefined}
                            />
                          ))}
                        </div>
                        <div
                          className="ss-booking-mdial__segments"
                          role="group"
                          aria-label="Jump to a time of day"
                        >
                          {segments.map((segment) => {
                            const active =
                              selectedSlot !== null &&
                              segment.slots.some(
                                (slot) => slot.startTime === selectedSlot.startTime,
                              );
                            return (
                              <button
                                key={segment.id}
                                type="button"
                                aria-pressed={active}
                                disabled={segment.slots.length === 0}
                                onClick={() => {
                                  const first = segment.slots[0];
                                  if (first) onSelectSlot(first);
                                }}
                              >
                                {segment.label}
                                <i>{segment.slots.length}</i>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    ))
                  )}
                </section>
                <p className="ss-booking-stage__error" role="alert" aria-live="polite">
                  {scheduleError}
                </p>
              </div>
            ) : panel === "focus" ? (
              <div className="ss-booking-stage ss-booking-mstage ss-booking-mfocus">
                <div className="ss-booking-stage__heading">
                  <span>02 · Focus</span>
                  <h4 id="booking-stage-heading" tabIndex={-1}>
                    What should we look at?
                  </h4>
                  <p>Select up to three services.</p>
                </div>
                <fieldset className="ss-booking-control-group ss-booking-mfocus__pane">
                  <legend className="sr-only">Service</legend>
                  <div className="ss-booking-service-grid ss-booking-mfocus__grid">
                    {SERVICE_OPTIONS.map((option) => {
                      const selected = qualification.services.includes(option.id);
                      const disabled = !selected && qualification.services.length >= 3;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          aria-pressed={selected}
                          disabled={disabled}
                          onClick={() => toggleService(option.id)}
                        >
                          <span>{option.label}</span>
                          <span className="ss-booking-choice-mark" aria-hidden="true">
                            {selected ? <Check /> : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
                <p className="ss-booking-stage__error" role="alert" aria-live="polite">
                  {focusError}
                </p>
              </div>
            ) : panel === "context" ? (
              <div className="ss-booking-stage ss-booking-mstage ss-booking-mcontext">
                <div className="ss-booking-stage__heading">
                  <span>02 · Context</span>
                  <h4 id="booking-stage-heading" tabIndex={-1}>
                    Frame the conversation
                  </h4>
                  <p>Three quick cues — not a quote.</p>
                </div>
                <div className="ss-booking-mcontext__pane">
                  <label
                    className="ss-booking-control-group ss-booking-select"
                    htmlFor="booking-industry"
                  >
                    <span className="ss-booking-control-group__label">Industry</span>
                    <span className="ss-booking-select__control">
                      <select
                        id="booking-industry"
                        value={qualification.industry}
                        onChange={(event) =>
                          onQualificationChange({
                            ...qualification,
                            industry: event.target
                              .value as QualificationAnswers["industry"],
                          })
                        }
                      >
                        <option value="">Choose your industry</option>
                        {INDUSTRY_OPTIONS.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                      <ChevronDown aria-hidden="true" />
                    </span>
                  </label>
                  <label
                    className="ss-booking-control-group ss-booking-select"
                    htmlFor="booking-budget"
                  >
                    <span className="ss-booking-control-group__label">
                      Indicative budget
                    </span>
                    <span className="ss-booking-select__control">
                      <select
                        id="booking-budget"
                        value={qualification.budget}
                        onChange={(event) =>
                          onQualificationChange({
                            ...qualification,
                            budget: event.target
                              .value as QualificationAnswers["budget"],
                          })
                        }
                      >
                        <option value="">Choose a range</option>
                        {BUDGET_OPTIONS.map((budget) => (
                          <option key={budget} value={budget}>
                            {budget}
                          </option>
                        ))}
                      </select>
                      <ChevronDown aria-hidden="true" />
                    </span>
                  </label>
                  <label
                    className="ss-booking-control-group ss-booking-select"
                    htmlFor="booking-urgency"
                  >
                    <span className="ss-booking-control-group__label">Timing</span>
                    <span className="ss-booking-select__control">
                      <select
                        id="booking-urgency"
                        value={qualification.urgency}
                        onChange={(event) =>
                          onQualificationChange({
                            ...qualification,
                            urgency: event.target
                              .value as QualificationAnswers["urgency"],
                          })
                        }
                      >
                        <option value="">Choose timing</option>
                        {URGENCY_OPTIONS.map((urgency) => (
                          <option key={urgency} value={urgency}>
                            {urgency}
                          </option>
                        ))}
                      </select>
                      <ChevronDown aria-hidden="true" />
                    </span>
                  </label>
                </div>
                <p
                  className="ss-booking-stage__error"
                  role="alert"
                  aria-live="polite"
                />
              </div>
            ) : panel === "details" ? (
              <div className="ss-booking-stage ss-booking-mstage ss-booking-mdetails">
                <div className="ss-booking-stage__heading">
                  <span>03 · Details</span>
                  <h4 id="booking-stage-heading" tabIndex={-1}>
                    Who are we meeting?
                  </h4>
                </div>
                <form
                  className="ss-booking-details__form ss-booking-mdetails__pane"
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    continueFromDetails();
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
                      value={details.name}
                      aria-invalid={Boolean(effectiveDetailErrors.name)}
                      onChange={(event) => updateDetails("name", event.target.value)}
                    />
                    <small>{effectiveDetailErrors.name}</small>
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
                      value={details.email}
                      aria-invalid={Boolean(effectiveDetailErrors.email)}
                      onChange={(event) => updateDetails("email", event.target.value)}
                    />
                    <small>{effectiveDetailErrors.email}</small>
                  </label>
                  {/* Role is desktop-only: three fields are what the fixed
                      mobile panel can guarantee without internal scroll. */}
                  <label>
                    <span id="booking-company-label">
                      Company <em>Optional</em>
                    </span>
                    <Input
                      aria-labelledby="booking-company-label"
                      name="company"
                      autoComplete="organization"
                      maxLength={120}
                      value={details.company}
                      onChange={(event) => updateDetails("company", event.target.value)}
                    />
                    <small />
                  </label>
                </form>
                <p
                  className="ss-booking-stage__error"
                  role="alert"
                  aria-live="polite"
                />
              </div>
            ) : panel === "consent" ? (
              <div className="ss-booking-stage ss-booking-mstage ss-booking-mconsent">
                <div className="ss-booking-stage__heading">
                  <span>03 · Confirm</span>
                  <h4 id="booking-stage-heading" tabIndex={-1}>
                    Lock it in
                  </h4>
                </div>
                <div className="ss-booking-mconsent__pane">
                  {selectedSlot ? (
                    <div className="ss-booking-details__summary">
                      <CalendarCheck aria-hidden="true" />
                      <div>
                        <strong>
                          {formatSelectedSlotLabel(selectedSlot.startTime, timeZone)}
                        </strong>
                        <span>
                          30 minutes · {timeZone.replaceAll("_", " ")}
                          {briefSummary ? ` · ${briefSummary}` : ""}
                        </span>
                      </div>
                    </div>
                  ) : null}
                  <label className="ss-booking-mconsent__context">
                    <span id="booking-context-label">
                      Useful context <em>Optional</em>
                    </span>
                    <textarea
                      aria-labelledby="booking-context-label"
                      name="context"
                      autoComplete="off"
                      maxLength={600}
                      rows={3}
                      placeholder="e.g. One process, journey or decision you want to improve…"
                      value={details.context}
                      onChange={(event) => updateDetails("context", event.target.value)}
                    />
                  </label>
                  <label className="ss-booking-mconsent__ack">
                    <input
                      type="checkbox"
                      checked={details.acknowledged}
                      aria-invalid={Boolean(detailErrors.acknowledged)}
                      aria-describedby={
                        detailErrors.acknowledged ? "booking-ack-error" : undefined
                      }
                      onChange={(event) =>
                        updateDetails("acknowledged", event.target.checked)
                      }
                    />
                    <span>
                      I agree that Silverstone may use these details to arrange and
                      follow up this discovery call, in line with the{" "}
                      <Link to="/privacy-policy">privacy policy</Link>.
                    </span>
                  </label>
                </div>
                <p
                  className="ss-booking-stage__error"
                  role="alert"
                  aria-live="assertive"
                >
                  {detailErrors.acknowledged ?? submitError}
                </p>
              </div>
            ) : confirmation ? (
              <ConfirmationStage
                confirmation={confirmation}
                mode={mode}
                qualification={qualification}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="ss-booking-shell__footer">
        <div className="ss-booking-shell__footer-secondary">
          {panel === "date" ? (
            <Link to="/contact#contact-form">
              <MessageSquare aria-hidden="true" />
              Contact instead
            </Link>
          ) : panel !== "confirmed" ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={submitting}
              onClick={() => goTo(PANEL_BACK[panel] ?? "date")}
            >
              <ArrowLeft aria-hidden="true" />
              Back
            </Button>
          ) : null}
        </div>
        {panel === "date" ? (
          <Button
            type="button"
            className="ss-booking-shell__primary"
            disabled={!selectedDateKey}
            onClick={() => goTo("time")}
          >
            Choose a time
            <ArrowRight aria-hidden="true" />
          </Button>
        ) : panel === "time" ? (
          <Button
            type="button"
            className="ss-booking-shell__primary"
            disabled={!selectedSlot}
            onClick={() => goTo("focus")}
          >
            {selectedSlot
              ? `Lock in ${formatSlotTime(selectedSlot.startTime, timeZone)}`
              : "Lock in this time"}
            <ArrowRight aria-hidden="true" />
          </Button>
        ) : panel === "focus" ? (
          <Button
            type="button"
            className="ss-booking-shell__primary"
            onClick={() => {
              if (qualification.services.length === 0) {
                setFocusError("Choose at least one service to continue.");
                return;
              }
              goTo("context");
            }}
          >
            Continue
            <ArrowRight aria-hidden="true" />
          </Button>
        ) : panel === "context" ? (
          <Button
            type="button"
            className="ss-booking-shell__primary"
            disabled={!contextComplete}
            onClick={() => goTo("details")}
          >
            Continue
            <ArrowRight aria-hidden="true" />
          </Button>
        ) : panel === "details" ? (
          <Button
            type="button"
            className="ss-booking-shell__primary"
            onClick={continueFromDetails}
          >
            Review booking
            <ArrowRight aria-hidden="true" />
          </Button>
        ) : panel === "consent" ? (
          <Button
            type="button"
            className="ss-booking-shell__primary"
            disabled={submitting}
            onClick={onSubmit}
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
    </div>
  );
}
