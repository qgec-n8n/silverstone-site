import {
  BOOKING_DURATION_MINUTES,
  PublicApiError,
  bookingFingerprint,
  safeError,
  validateBookingRequest,
  validateIdempotencyKey,
} from "./_calendly/calendly-core.mjs";
import {
  createCalendlyBooking,
  resolveEventType,
} from "./_calendly/calendly-client.mjs";
import {
  enforceRateLimit,
  ensureSameOrigin,
  getHeader,
  jsonResponse,
  liveCalendlyEnabled,
} from "./_calendly/http.mjs";

const duplicateBookings = new Map();
const DUPLICATE_TTL_MS = 10 * 60_000;

function purgeDuplicateBookings() {
  const now = Date.now();
  for (const [key, value] of duplicateBookings) {
    if (now >= value.expiresAt) duplicateBookings.delete(key);
  }
}

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return jsonResponse(405, {
        ok: false,
        error: {
          code: "INVALID_REQUEST",
          message: "Method not allowed.",
          retryable: false,
        },
      });
    }
    const live = liveCalendlyEnabled();
    ensureSameOrigin(event, live);
    enforceRateLimit(event, "book", 8, 60_000);
    if (typeof event.body !== "string" || event.body.length > 12_000) {
      throw new PublicApiError(
        400,
        "INVALID_REQUEST",
        "The booking request is invalid.",
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(event.body);
    } catch {
      throw new PublicApiError(
        400,
        "INVALID_REQUEST",
        "The booking request is invalid.",
      );
    }
    const booking = validateBookingRequest(parsed);
    const idempotencyKey = validateIdempotencyKey(
      getHeader(event, "idempotency-key"),
    );
    const fingerprint = bookingFingerprint(idempotencyKey, booking);
    purgeDuplicateBookings();
    const existing = duplicateBookings.get(idempotencyKey);
    if (existing) {
      if (existing.fingerprint !== fingerprint) {
        throw new PublicApiError(
          409,
          "INVALID_REQUEST",
          "This booking request was already used with different details.",
        );
      }
      const result = await existing.promise;
      return jsonResponse(200, result);
    }

    const operation = (async () => {
      if (!live) {
        return {
          ok: true,
          source: "mock",
          confirmation: {
            startTime: booking.startTime,
            timezone: booking.timezone,
            durationMinutes: BOOKING_DURATION_MINUTES,
            confirmationEmail: booking.details.email,
            qualificationTransmitted: true,
          },
        };
      }
      const token = process.env.CALENDLY_API_TOKEN;
      if (!token) {
        throw new PublicApiError(
          503,
          "SERVER_MISCONFIGURED",
          "Live booking is temporarily unavailable. Please use the contact route.",
        );
      }
      const eventType = await resolveEventType(
        token,
        process.env.CALENDLY_EVENT_TYPE_URI,
      );
      const confirmation = await createCalendlyBooking(
        eventType,
        booking,
        token,
      );
      return { ok: true, source: "calendly", confirmation };
    })();

    duplicateBookings.set(idempotencyKey, {
      fingerprint,
      promise: operation,
      expiresAt: Date.now() + DUPLICATE_TTL_MS,
    });
    try {
      return jsonResponse(200, await operation);
    } catch (error) {
      duplicateBookings.delete(idempotencyKey);
      throw error;
    }
  } catch (error) {
    const safe = safeError(error);
    return jsonResponse(safe.status, safe.body);
  }
}
