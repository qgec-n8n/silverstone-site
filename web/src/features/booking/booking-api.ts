import {
  addDays,
  bookingHorizonEndExclusive,
  createApplicationWindow,
  dateKeyInTimeZone,
  mergeAvailabilitySlots,
  parseDateKey,
  visibleGridStart,
} from "~/features/booking/booking-dates";
import {
  createMockBooking,
  getMockAvailability,
} from "~/features/booking/booking-mocks";
import { BOOKING_EVENT_TYPE_KEY } from "~/features/booking/booking-types";
import type {
  AvailabilityResponse,
  AvailabilitySlot,
  AvailabilitySuccess,
  AvailabilityWindow,
  BookingMode,
  BookingRequest,
  BookingResponse,
} from "~/features/booking/booking-types";

const AVAILABILITY_TTL_MS = 60_000;
const INVALIDATED_SLOT_TTL_MS = 5 * 60_000;
const MAX_CACHE_WINDOWS = 16;

type CacheEntry = {
  response: AvailabilitySuccess;
  fetchedAt: number;
};

export type AvailabilityLoadOptions = {
  mode: BookingMode;
  timeZone: string;
  window: AvailabilityWindow;
  signal?: AbortSignal;
  force?: boolean;
};

type AvailabilitySnapshot = {
  slots: AvailabilitySlot[];
  windows: AvailabilityWindow[];
};

const availabilityCache = new Map<string, CacheEntry>();
const invalidatedSlots = new Map<string, Map<string, number>>();
const inFlight = new Map<
  string,
  {
    mode: BookingMode;
    timeZone: string;
    window: AvailabilityWindow;
    promise: Promise<AvailabilityResponse>;
  }
>();

export function availabilityCacheKey(
  mode: BookingMode,
  timeZone: string,
  window: AvailabilityWindow,
): string {
  return `${BOOKING_EVENT_TYPE_KEY}:${mode}:${timeZone}:${window.start}:${window.endExclusive}`;
}

function availabilityScopeKey(mode: BookingMode, timeZone: string): string {
  return `${BOOKING_EVENT_TYPE_KEY}:${mode}:${timeZone}`;
}

function withoutInvalidatedSlots(
  response: AvailabilitySuccess,
  mode: BookingMode,
  timeZone: string,
): AvailabilitySuccess {
  const scope = availabilityScopeKey(mode, timeZone);
  const excluded = invalidatedSlots.get(scope);
  if (!excluded) return response;
  const now = Date.now();
  for (const [startTime, expiresAt] of excluded) {
    if (expiresAt <= now) excluded.delete(startTime);
  }
  if (excluded.size === 0) {
    invalidatedSlots.delete(scope);
    return response;
  }
  return {
    ...response,
    slots: response.slots.filter((slot) => !excluded.has(slot.startTime)),
  };
}

function trimCache(): void {
  while (availabilityCache.size > MAX_CACHE_WINDOWS) {
    const oldestKey = availabilityCache.keys().next().value;
    if (!oldestKey) {
      return;
    }
    availabilityCache.delete(oldestKey);
  }
}

export type AvailabilityTransport = (
  options: AvailabilityLoadOptions,
) => Promise<AvailabilityResponse>;

async function fetchAvailability(
  options: AvailabilityLoadOptions,
): Promise<AvailabilityResponse> {
  if (options.mode === "mock") {
    return getMockAvailability(options.window, options.signal);
  }
  if (options.mode === "disabled") {
    return {
      ok: false,
      error: {
        code: "BOOKING_UNAVAILABLE",
        message: "Booking is unavailable in this preview.",
        retryable: false,
      },
    };
  }

  const query = new URLSearchParams({
    start: options.window.start,
    days: String(options.window.days),
    timezone: options.timeZone,
  });
  const response = await fetch(
    `/.netlify/functions/calendly-availability?${query.toString()}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "same-origin",
      ...(options.signal ? { signal: options.signal } : {}),
    },
  );
  return (await response.json()) as AvailabilityResponse;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function windowsOverlap(left: AvailabilityWindow, right: AvailabilityWindow): boolean {
  return left.start < right.endExclusive && right.start < left.endExclusive;
}

function freshCacheEntries(mode: BookingMode, timeZone: string): CacheEntry[] {
  const prefix = `${BOOKING_EVENT_TYPE_KEY}:${mode}:${timeZone}:`;
  const now = Date.now();
  return [...availabilityCache.entries()]
    .filter(
      ([key, entry]) =>
        key.startsWith(prefix) && now - entry.fetchedAt < AVAILABILITY_TTL_MS,
    )
    .map(([, entry]) => entry);
}

/** Subtract cached half-open ranges so month navigation only fetches missing days. */
function uncoveredWindows(
  requested: AvailabilityWindow,
  covered: readonly AvailabilityWindow[],
): AvailabilityWindow[] {
  const relevant = covered
    .filter((window) => windowsOverlap(window, requested))
    .sort((left, right) => left.start.localeCompare(right.start));
  const gaps: AvailabilityWindow[] = [];
  let cursor = requested.start;
  for (const window of relevant) {
    if (window.endExclusive <= cursor) continue;
    if (window.start > cursor) {
      const gapEnd =
        window.start < requested.endExclusive ? window.start : requested.endExclusive;
      if (gapEnd > cursor) gaps.push(createApplicationWindow(cursor, gapEnd));
    }
    if (window.endExclusive > cursor) cursor = window.endExclusive;
    if (cursor >= requested.endExclusive) break;
  }
  if (cursor < requested.endExclusive) {
    gaps.push(createApplicationWindow(cursor, requested.endExclusive));
  }
  return gaps;
}

function responseForWindow(
  mode: BookingMode,
  timeZone: string,
  window: AvailabilityWindow,
): AvailabilitySuccess {
  const start = Date.parse(`${window.start}T00:00:00Z`);
  const end = Date.parse(`${window.endExclusive}T00:00:00Z`);
  const snapshot = getAvailabilitySnapshot(mode, timeZone);
  return {
    ok: true,
    source: mode === "mock" ? "mock" : "calendly",
    window,
    slots: snapshot.slots.filter((slot) => {
      const time = Date.parse(slot.startTime);
      return time >= start && time < end;
    }),
  };
}

async function loadOneAvailabilityWindow(
  options: AvailabilityLoadOptions,
  transport: AvailabilityTransport,
): Promise<AvailabilityResponse> {
  const key = availabilityCacheKey(options.mode, options.timeZone, options.window);
  const cached = availabilityCache.get(key);
  if (!options.force && cached && Date.now() - cached.fetchedAt < AVAILABILITY_TTL_MS) {
    return cached.response;
  }

  const pending = inFlight.get(key)?.promise;
  if (pending) {
    /* The pending request belongs to another caller and carries that caller's
       abort signal. If it aborts while this caller is still interested,
       re-issue the request instead of surfacing a foreign AbortError — without
       this, an aborted shared promise (e.g. a StrictMode remount) leaves every
       waiting consumer stuck. */
    return pending.catch((error: unknown) => {
      if (isAbortError(error) && !options.signal?.aborted) {
        return loadAvailabilityWindow(options, transport);
      }
      throw error;
    });
  }

  const request = transport(options)
    .then((response) => {
      if (response.ok) {
        const safeResponse = withoutInvalidatedSlots(
          response,
          options.mode,
          options.timeZone,
        );
        availabilityCache.delete(key);
        availabilityCache.set(key, {
          response: safeResponse,
          fetchedAt: Date.now(),
        });
        trimCache();
        return safeResponse;
      }
      return response;
    })
    .finally(() => {
      inFlight.delete(key);
    });
  inFlight.set(key, {
    mode: options.mode,
    timeZone: options.timeZone,
    window: options.window,
    promise: request,
  });
  return request;
}

export async function loadAvailabilityWindow(
  options: AvailabilityLoadOptions,
  transport: AvailabilityTransport = fetchAvailability,
): Promise<AvailabilityResponse> {
  if (!options.force) {
    const overlapping = [...inFlight.values()]
      .filter(
        (entry) =>
          entry.mode === options.mode &&
          entry.timeZone === options.timeZone &&
          windowsOverlap(entry.window, options.window),
      )
      .map((entry) => entry.promise);
    if (overlapping.length > 0) {
      await Promise.allSettled(overlapping);
      if (options.signal?.aborted) throw new DOMException("Aborted", "AbortError");
    }
  }

  const gaps = options.force
    ? [options.window]
    : uncoveredWindows(
        options.window,
        freshCacheEntries(options.mode, options.timeZone).map(
          (entry) => entry.response.window,
        ),
      );
  if (gaps.length === 0) {
    return responseForWindow(options.mode, options.timeZone, options.window);
  }

  const responses = await Promise.all(
    gaps.map((window) => loadOneAvailabilityWindow({ ...options, window }, transport)),
  );
  const failure = responses.find((response) => !response.ok);
  return failure ?? responseForWindow(options.mode, options.timeZone, options.window);
}

export function getAvailabilitySnapshot(
  mode: BookingMode,
  timeZone: string,
): AvailabilitySnapshot {
  const prefix = `${BOOKING_EVENT_TYPE_KEY}:${mode}:${timeZone}:`;
  const entries = [...availabilityCache.entries()]
    .filter(([key]) => key.startsWith(prefix))
    .map(([, entry]) => entry.response);
  return {
    slots: mergeAvailabilitySlots(entries.map((entry) => entry.slots)),
    windows: entries.map((entry) => entry.window),
  };
}

export function clearAvailabilityCache(): void {
  availabilityCache.clear();
  inFlight.clear();
  invalidatedSlots.clear();
}

/** Remove a failed slot immediately and expire every window that contained it. */
export function invalidateAvailabilitySlot(
  mode: BookingMode,
  timeZone: string,
  startTime: string,
): void {
  const prefix = `${BOOKING_EVENT_TYPE_KEY}:${mode}:${timeZone}:`;
  const scope = availabilityScopeKey(mode, timeZone);
  const excluded = invalidatedSlots.get(scope) ?? new Map<string, number>();
  excluded.set(startTime, Date.now() + INVALIDATED_SLOT_TTL_MS);
  invalidatedSlots.set(scope, excluded);
  for (const [key, entry] of availabilityCache) {
    if (!key.startsWith(prefix)) continue;
    const nextSlots = entry.response.slots.filter(
      (slot) => slot.startTime !== startTime,
    );
    if (nextSlots.length !== entry.response.slots.length) {
      availabilityCache.set(key, {
        fetchedAt: 0,
        response: { ...entry.response, slots: nextSlots },
      });
    }
  }
}

export function windowForMonth(
  month: Date,
  now = new Date(),
  timeZone = "Europe/London",
): AvailabilityWindow {
  const zonedToday = parseDateKey(dateKeyInTimeZone(now.toISOString(), timeZone));
  const todayKey = dateKeyInTimeZone(now.toISOString(), timeZone);
  const horizonEndExclusive = bookingHorizonEndExclusive(todayKey);
  const requestedStart = visibleGridStart(month, zonedToday);
  const start =
    requestedStart < horizonEndExclusive
      ? requestedStart
      : addDays(horizonEndExclusive, -1);
  return createApplicationWindow(start, horizonEndExclusive);
}

export async function submitBooking(
  mode: BookingMode,
  request: BookingRequest,
  idempotencyKey: string,
): Promise<BookingResponse> {
  if (mode === "mock") {
    return createMockBooking(request);
  }
  if (mode === "disabled") {
    return {
      ok: false,
      error: {
        code: "BOOKING_UNAVAILABLE",
        message: "Booking is unavailable in this preview.",
        retryable: false,
      },
    };
  }

  const response = await fetch("/.netlify/functions/calendly-book", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    credentials: "same-origin",
    body: JSON.stringify(request),
  });
  return (await response.json()) as BookingResponse;
}
