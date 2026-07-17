import { addDays, parseDateKey } from "~/features/booking/booking-dates";
import {
  BOOKING_DURATION_MINUTES,
  type AvailabilityResponse,
  type AvailabilitySlot,
  type AvailabilityWindow,
  type BookingRequest,
  type BookingResponse,
} from "~/features/booking/booking-types";

export type BookingFixture = "success" | "loading" | "empty" | "error" | "lost-slot";

export function readBookingFixture(): BookingFixture {
  if (typeof window === "undefined") {
    return "success";
  }
  const value = new URLSearchParams(window.location.search).get("bookingFixture");
  return value === "loading" ||
    value === "empty" ||
    value === "error" ||
    value === "lost-slot"
    ? value
    : "success";
}

function atUtc(dateKey: string, hour: number, minute: number): string {
  const date = parseDateKey(dateKey);
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute),
  ).toISOString();
}

export function createMockSlots(window: AvailabilityWindow): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = [];
  for (let offset = 0; offset < window.days; offset += 1) {
    const dateKey = addDays(window.start, offset);
    const day = parseDateKey(dateKey).getDay();
    if (day === 0 || (day === 6 && offset % 2 !== 0) || offset % 9 === 4) {
      continue;
    }

    for (let minutes = 8 * 60 + 30; minutes <= 18 * 60; minutes += 30) {
      if ((minutes / 30 + offset) % 5 === 0) {
        continue;
      }
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const startTime = atUtc(dateKey, hour, minute);
      slots.push({
        startTime,
        endTime: new Date(
          Date.parse(startTime) + BOOKING_DURATION_MINUTES * 60_000,
        ).toISOString(),
      });
    }
  }
  return slots;
}

export async function getMockAvailability(
  window: AvailabilityWindow,
  signal?: AbortSignal,
): Promise<AvailabilityResponse> {
  const fixture = readBookingFixture();
  const delay = fixture === "loading" ? 1_100 : 140;
  await new Promise<void>((resolve, reject) => {
    const timer = windowSetTimeout(resolve, delay);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });

  if (fixture === "error") {
    return {
      ok: false,
      error: {
        code: "UPSTREAM_UNAVAILABLE",
        message: "Availability is taking longer than expected. Please try again.",
        retryable: true,
      },
    };
  }

  return {
    ok: true,
    slots: fixture === "empty" ? [] : createMockSlots(window),
    window,
    source: "mock",
  };
}

function windowSetTimeout(
  callback: () => void,
  delay: number,
): ReturnType<typeof setTimeout> {
  return setTimeout(callback, delay);
}

export async function createMockBooking(
  request: BookingRequest,
): Promise<BookingResponse> {
  await new Promise((resolve) => setTimeout(resolve, 420));
  if (readBookingFixture() === "lost-slot") {
    return {
      ok: false,
      error: {
        code: "SLOT_UNAVAILABLE",
        message: "That time was just taken. Please choose another available slot.",
        retryable: true,
      },
    };
  }
  return {
    ok: true,
    source: "mock",
    confirmation: {
      startTime: request.startTime,
      timezone: request.timezone,
      durationMinutes: BOOKING_DURATION_MINUTES,
      confirmationEmail: request.details.email,
      qualificationTransmitted: true,
    },
  };
}
