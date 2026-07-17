import {
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
const MAX_CACHE_WINDOWS = 8;

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
const inFlight = new Map<string, Promise<AvailabilityResponse>>();

export function availabilityCacheKey(
  mode: BookingMode,
  timeZone: string,
  window: AvailabilityWindow,
): string {
  return `${mode}:${timeZone}:${window.start}:${window.endExclusive}`;
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

export async function loadAvailabilityWindow(
  options: AvailabilityLoadOptions,
  transport: AvailabilityTransport = fetchAvailability,
): Promise<AvailabilityResponse> {
  const key = availabilityCacheKey(options.mode, options.timeZone, options.window);
  const cached = availabilityCache.get(key);
  if (!options.force && cached && Date.now() - cached.fetchedAt < AVAILABILITY_TTL_MS) {
    return cached.response;
  }

  const pending = inFlight.get(key);
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
        availabilityCache.delete(key);
        availabilityCache.set(key, { response, fetchedAt: Date.now() });
        trimCache();
      }
      return response;
    })
    .finally(() => {
      inFlight.delete(key);
    });
  inFlight.set(key, request);
  return request;
}

export function getAvailabilitySnapshot(
  mode: BookingMode,
  timeZone: string,
): AvailabilitySnapshot {
  const prefix = `${mode}:${timeZone}:`;
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
}

export function windowForMonth(
  month: Date,
  now = new Date(),
  timeZone = "Europe/London",
): AvailabilityWindow {
  const zonedToday = parseDateKey(dateKeyInTimeZone(now.toISOString(), timeZone));
  return createApplicationWindow(visibleGridStart(month, zonedToday));
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
