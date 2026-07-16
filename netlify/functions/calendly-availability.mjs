import {
  PublicApiError,
  createServerMockAvailability,
  parseAvailabilityQuery,
  safeError,
} from "./_calendly/calendly-core.mjs";
import {
  fetchEventAvailability,
  resolveEventType,
} from "./_calendly/calendly-client.mjs";
import {
  enforceRateLimit,
  ensureSameOrigin,
  jsonResponse,
  liveCalendlyEnabled,
} from "./_calendly/http.mjs";

export async function handler(event) {
  try {
    if (event.httpMethod !== "GET") {
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
    if (live) ensureSameOrigin(event, true, false);
    enforceRateLimit(event, "availability", 30, 60_000);
    const parameters = new URLSearchParams(event.queryStringParameters ?? {});
    const window = parseAvailabilityQuery(parameters);

    if (!live) {
      return jsonResponse(
        200,
        {
          ok: true,
          slots: createServerMockAvailability(window),
          window,
          source: "mock",
        },
        "private, max-age=30",
      );
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
    const requestedStart = Date.parse(`${window.start}T00:00:00Z`);
    const startTime = new Date(
      Math.max(requestedStart, Date.now() + 60_000),
    ).toISOString();
    const endTime = new Date(
      Date.parse(`${window.endExclusive}T00:00:00Z`),
    ).toISOString();
    const slots = await fetchEventAvailability(
      eventType,
      startTime,
      endTime,
      token,
    );
    return jsonResponse(
      200,
      { ok: true, slots, window, source: "calendly" },
      "private, max-age=30, stale-while-revalidate=30",
    );
  } catch (error) {
    const safe = safeError(error);
    return jsonResponse(safe.status, safe.body);
  }
}
