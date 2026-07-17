import { useMemo, useState } from "react";

import { CalendarCheck, Check, Clock, RotateCcw } from "~/components/icons/lucide";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Skeleton } from "~/components/ui/skeleton";
import {
  formatDateKey,
  dateKeyInTimeZone,
  formatLongDate,
  formatSlotTime,
  parseDateKey,
} from "~/features/booking/booking-dates";
import type { AvailabilitySlot, BookingMode } from "~/features/booking/booking-types";
import { useBookingAvailability } from "~/features/booking/use-booking-availability";

const COMMON_TIMEZONES = [
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
];

type AvailabilityStageProps = {
  mode: BookingMode;
  hydrated: boolean;
  timeZone: string;
  month: Date;
  selectedDateKey: string;
  selectedSlot: AvailabilitySlot | null;
  error: string;
  onMonthChange: (month: Date) => void;
  onSelectDate: (dateKey: string) => void;
  onTimeZoneChange: (timeZone: string) => void;
  onSelectSlot: (slot: AvailabilitySlot | null) => void;
};

function groupSlots(slots: readonly AvailabilitySlot[], timeZone: string) {
  const groups = [
    { label: "Morning", slots: [] as AvailabilitySlot[] },
    { label: "Afternoon", slots: [] as AvailabilitySlot[] },
    { label: "Evening", slots: [] as AvailabilitySlot[] },
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
    groups[index]?.slots.push(slot);
  }
  return groups.filter((group) => group.slots.length > 0);
}

export function AvailabilityStage({
  mode,
  hydrated,
  timeZone,
  month,
  selectedDateKey,
  selectedSlot,
  error,
  onMonthChange,
  onSelectDate,
  onTimeZoneChange,
  onSelectSlot,
}: AvailabilityStageProps) {
  const [today] = useState(() => new Date());
  const [mobileView, setMobileView] = useState<"calendar" | "times">(
    selectedDateKey ? "times" : "calendar",
  );
  const availability = useBookingAvailability(month, timeZone, mode, hydrated);
  const todayKey = dateKeyInTimeZone(today.toISOString(), timeZone);
  const zonedToday = parseDateKey(todayKey);
  const availableDates = useMemo(
    () => [...availability.slotsByDate.keys()].map(parseDateKey),
    [availability.slotsByDate],
  );
  const selectedDate = selectedDateKey ? parseDateKey(selectedDateKey) : undefined;
  const selectedDateSlots = selectedDateKey
    ? (availability.slotsByDate.get(selectedDateKey) ?? [])
    : [];
  const timeZoneOptions = useMemo(
    () => [...new Set([timeZone, ...COMMON_TIMEZONES])],
    [timeZone],
  );
  const loading =
    !hydrated || availability.status === "loading" || availability.status === "idle";

  const chooseDate = (date: Date | undefined) => {
    if (!date) return;
    onSelectDate(formatDateKey(date));
    setMobileView("times");
  };

  return (
    <div className="ss-booking-stage ss-booking-availability">
      <div className="ss-booking-stage__heading ss-booking-stage__heading--schedule">
        <span>01 · Date &amp; time</span>
        <h4 id="booking-stage-heading" tabIndex={-1}>
          Choose your moment
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

      <div
        className="ss-booking-availability__tabs"
        role="tablist"
        aria-label="Schedule view"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mobileView === "calendar"}
          onClick={() => setMobileView("calendar")}
        >
          Calendar
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileView === "times"}
          disabled={!selectedDateKey}
          onClick={() => setMobileView("times")}
        >
          Times{" "}
          {selectedDateSlots.length > 0 ? `· ${String(selectedDateSlots.length)}` : ""}
        </button>
      </div>

      <div className="ss-booking-availability__layout" data-mobile-view={mobileView}>
        <section className="ss-booking-calendar-pane" aria-label="Available dates">
          <div className="ss-booking-calendar-pane__status" aria-live="polite">
            <span
              className="ss-booking-status-dot"
              data-active={availability.status === "ready"}
            />
            {loading
              ? "Scanning the six-week window…"
              : availability.status === "refreshing"
                ? "Refreshing availability…"
                : `${String(availableDates.length)} open dates in view`}
          </div>
          {hydrated ? (
            <Calendar
              mode="single"
              month={month}
              selected={selectedDate}
              today={zonedToday}
              onMonthChange={onMonthChange}
              onSelect={chooseDate}
              startMonth={new Date(zonedToday.getFullYear(), zonedToday.getMonth(), 1)}
              endMonth={
                new Date(zonedToday.getFullYear() + 1, zonedToday.getMonth(), 1)
              }
              disabled={(date) => {
                const key = formatDateKey(date);
                return key < todayKey || !availability.slotsByDate.has(key);
              }}
              modifiers={{
                available: availableDates,
                loading:
                  availability.status === "loading" ||
                  availability.status === "refreshing"
                    ? { after: new Date(today.getTime() - 86_400_000) }
                    : [],
              }}
              modifiersClassNames={{ available: "is-available", loading: "is-loading" }}
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

        <section className="ss-booking-times-pane" aria-label="Available times">
          <header>
            <div>
              <span>Available times</span>
              <strong>
                {selectedDateSlots[0]
                  ? formatLongDate(selectedDateSlots[0].startTime, timeZone)
                  : "Select a date"}
              </strong>
            </div>
            <Clock aria-hidden="true" />
          </header>
          <div
            className="ss-booking-times-scroll"
            data-testid="booking-times-scroll"
            tabIndex={0}
            aria-label="Scrollable available time slots"
          >
            {loading ? (
              <div className="ss-booking-times-skeleton" role="status">
                <span className="sr-only">Loading available times</span>
                {Array.from({ length: 8 }, (_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            ) : availability.status === "error" ? (
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
            ) : availability.slots.length === 0 ? (
              <div className="ss-booking-times-state">
                <CalendarCheck aria-hidden="true" />
                <strong>No times in this window</strong>
                <p>Move to the next month or use the written contact route.</p>
              </div>
            ) : !selectedDateKey ? (
              <div className="ss-booking-times-state">
                <CalendarCheck aria-hidden="true" />
                <strong>Pick an illuminated date</strong>
                <p>Only dates with verified availability can be selected.</p>
              </div>
            ) : selectedDateSlots.length === 0 ? (
              <div className="ss-booking-times-state">
                <strong>No remaining times</strong>
                <p>Choose another available date.</p>
              </div>
            ) : (
              <div className="ss-booking-time-groups">
                {groupSlots(selectedDateSlots, timeZone).map((group) => (
                  <div key={group.label} className="ss-booking-time-group">
                    <span>{group.label}</span>
                    <div>
                      {group.slots.map((slot) => {
                        const selected = selectedSlot?.startTime === slot.startTime;
                        return (
                          <button
                            key={slot.startTime}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => onSelectSlot(slot)}
                          >
                            <span>{formatSlotTime(slot.startTime, timeZone)}</span>
                            <small>30 min</small>
                            {selected ? <Check aria-hidden="true" /> : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <p className="ss-booking-stage__error" role="alert" aria-live="polite">
        {error}
      </p>
    </div>
  );
}
