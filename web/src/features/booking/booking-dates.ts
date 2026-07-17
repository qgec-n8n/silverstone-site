import {
  APPLICATION_WINDOW_DAYS,
  type AvailabilitySlot,
  type AvailabilityWindow,
} from "~/features/booking/booking-types";

export const DAY_MS = 86_400_000;
/* Calendly's documented maximum range for event_type_available_times. */
export const CALENDLY_MAX_RANGE_DAYS = 7;

export type DateRange = {
  start: string;
  endExclusive: string;
};

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatDateKey(date: Date): string {
  return `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDateKey(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    throw new Error("Invalid date key");
  }
  return new Date(year, month - 1, day, 12);
}

export function addDays(value: string, days: number): string {
  const date = parseDateKey(value);
  date.setDate(date.getDate() + days);
  return formatDateKey(date);
}

export function createApplicationWindow(start: string): AvailabilityWindow {
  return {
    start,
    endExclusive: addDays(start, APPLICATION_WINDOW_DAYS),
    days: APPLICATION_WINDOW_DAYS,
  };
}

export function chunkDateRange(
  range: DateRange,
  maximumDays = CALENDLY_MAX_RANGE_DAYS,
): DateRange[] {
  if (maximumDays < 1 || range.endExclusive <= range.start) {
    throw new Error("Date range must be positive");
  }

  const chunks: DateRange[] = [];
  let cursor = range.start;
  while (cursor < range.endExclusive) {
    const next = addDays(cursor, maximumDays);
    const endExclusive = next < range.endExclusive ? next : range.endExclusive;
    chunks.push({ start: cursor, endExclusive });
    cursor = endExclusive;
  }
  return chunks;
}

export function mergeAvailabilitySlots(
  collections: readonly (readonly AvailabilitySlot[])[],
): AvailabilitySlot[] {
  const byStart = new Map<string, AvailabilitySlot>();
  for (const collection of collections) {
    for (const slot of collection) {
      if (!byStart.has(slot.startTime)) {
        byStart.set(slot.startTime, slot);
      }
    }
  }
  return [...byStart.values()].sort(
    (left, right) => Date.parse(left.startTime) - Date.parse(right.startTime),
  );
}

export function dateKeyInTimeZone(isoTimestamp: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(isoTimestamp));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year ?? ""}-${values.month ?? ""}-${values.day ?? ""}`;
}

export function groupSlotsByDate(
  slots: readonly AvailabilitySlot[],
  timeZone: string,
): Map<string, AvailabilitySlot[]> {
  const groups = new Map<string, AvailabilitySlot[]>();
  for (const slot of slots) {
    const key = dateKeyInTimeZone(slot.startTime, timeZone);
    groups.set(key, [...(groups.get(key) ?? []), slot]);
  }
  return groups;
}

export function visibleGridStart(month: Date, today: Date): string {
  const first = new Date(month.getFullYear(), month.getMonth(), 1, 12);
  const mondayOffset = (first.getDay() + 6) % 7;
  first.setDate(first.getDate() - mondayOffset);
  const todayKey = formatDateKey(today);
  const gridKey = formatDateKey(first);
  return gridKey < todayKey ? todayKey : gridKey;
}

export function isDateCovered(
  date: string,
  windows: readonly AvailabilityWindow[],
): boolean {
  return windows.some((window) => date >= window.start && date < window.endExclusive);
}

export function formatSlotTime(isoTimestamp: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(isoTimestamp));
}

export function formatSelectedSlotLabel(
  isoTimestamp: string,
  timeZone: string,
): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoTimestamp));
}

export function formatLongDate(isoTimestamp: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoTimestamp));
}
