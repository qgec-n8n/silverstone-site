import {
  BOOKING_DURATION_MINUTES,
  PUBLIC_EVENT_URL,
  PublicApiError,
  buildInviteePayload,
  chunkIsoRange,
  normaliseAvailability,
} from "./calendly-core.mjs";

const API_ORIGIN = "https://api.calendly.com";
const EVENT_TYPE_CACHE_MS = 5 * 60_000;

let eventTypeCache = null;

function calendlyErrorText(value) {
  if (!value || typeof value !== "object") return "";
  const candidates = [
    value.message,
    value.title,
    value.detail,
    value.error,
    ...(Array.isArray(value.details) ? value.details : []),
  ];
  return candidates
    .flatMap((candidate) => {
      if (typeof candidate === "string") return [candidate];
      if (candidate && typeof candidate === "object") {
        return [candidate.message, candidate.detail].filter(
          (item) => typeof item === "string",
        );
      }
      return [];
    })
    .join(" ");
}

async function calendlyRequest(path, token, init = {}, fetcher = fetch) {
  const response = await fetcher(`${API_ORIGIN}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorText = calendlyErrorText(errorBody);
    if (response.status === 429) {
      throw new PublicApiError(
        429,
        "RATE_LIMITED",
        "Booking is busy right now. Please wait a moment and try again.",
        true,
      );
    }
    if (response.status === 401 || response.status === 403) {
      throw new PublicApiError(
        503,
        "SERVER_MISCONFIGURED",
        "Live booking is temporarily unavailable. Please use the contact route.",
      );
    }
    if (path === "/invitees") {
      const slotConflict =
        response.status === 409 ||
        /(?:time|slot).*(?:available|open|reserve|schedule)|(?:available|open|reserve|schedule).*(?:time|slot)/iu.test(
          errorText,
        );
      if (slotConflict) {
        throw new PublicApiError(
          409,
          "SLOT_UNAVAILABLE",
          "That time is no longer available. Please choose another available slot.",
          true,
        );
      }
      if (
        response.status === 400 ||
        response.status === 404 ||
        response.status === 422
      ) {
        throw new PublicApiError(
          503,
          "SERVER_MISCONFIGURED",
          "Live booking is temporarily unavailable. Please use the contact route.",
        );
      }
    }
    throw new PublicApiError(
      503,
      "UPSTREAM_UNAVAILABLE",
      "Calendly is temporarily unavailable. Please try again.",
      true,
    );
  }
  return response.json();
}

export async function resolveEventType(token, overrideUri, fetcher = fetch) {
  if (overrideUri) {
    if (
      !/^https:\/\/api\.calendly\.com\/event_types\/[a-zA-Z0-9-]+$/u.test(
        overrideUri,
      )
    ) {
      throw new PublicApiError(
        503,
        "SERVER_MISCONFIGURED",
        "Live booking is not configured.",
      );
    }
    const response = await calendlyRequest(
      `/event_types/${overrideUri.split("/").at(-1)}`,
      token,
      {},
      fetcher,
    );
    return response.resource;
  }

  if (
    eventTypeCache &&
    Date.now() - eventTypeCache.cachedAt < EVENT_TYPE_CACHE_MS
  ) {
    return eventTypeCache.value;
  }
  const userResponse = await calendlyRequest("/users/me", token, {}, fetcher);
  const userUri = userResponse?.resource?.uri;
  if (typeof userUri !== "string") {
    throw new PublicApiError(
      503,
      "SERVER_MISCONFIGURED",
      "Live booking is not configured.",
    );
  }
  const query = new URLSearchParams({
    user: userUri,
    active: "true",
    count: "100",
  });
  const typesResponse = await calendlyRequest(
    `/event_types?${query.toString()}`,
    token,
    {},
    fetcher,
  );
  const collection = Array.isArray(typesResponse?.collection)
    ? typesResponse.collection
    : [];
  const eventType = collection.find((candidate) => {
    const publicUri = candidate?.scheduling_uri ?? candidate?.scheduling_url;
    return (
      typeof publicUri === "string" &&
      publicUri.replace(/\/$/u, "") === PUBLIC_EVENT_URL
    );
  });
  if (!eventType) {
    throw new PublicApiError(
      503,
      "SERVER_MISCONFIGURED",
      "The discovery-call event type could not be resolved.",
    );
  }
  eventTypeCache = { value: eventType, cachedAt: Date.now() };
  return eventType;
}

export async function fetchEventAvailability(
  eventType,
  startTime,
  endTime,
  token,
  fetcher = fetch,
) {
  const chunks = chunkIsoRange(startTime, endTime);
  const responses = await Promise.all(
    chunks.map((chunk) => {
      const query = new URLSearchParams({
        event_type: eventType.uri,
        start_time: chunk.startTime,
        end_time: chunk.endTime,
      });
      return calendlyRequest(
        `/event_type_available_times?${query.toString()}`,
        token,
        {},
        fetcher,
      );
    }),
  );
  return normaliseAvailability(
    responses.map((response) =>
      Array.isArray(response?.collection) ? response.collection : [],
    ),
    Number(eventType.duration) || BOOKING_DURATION_MINUTES,
  );
}

function safeCalendlyUrl(value) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      (url.hostname === "calendly.com" ||
        url.hostname.endsWith(".calendly.com"))
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export async function createCalendlyBooking(
  eventType,
  booking,
  token,
  fetcher = fetch,
) {
  const recheckEnd = new Date(
    Date.parse(booking.startTime) +
      (Number(eventType.duration) || BOOKING_DURATION_MINUTES) * 60_000,
  ).toISOString();
  const available = await fetchEventAvailability(
    eventType,
    booking.startTime,
    recheckEnd,
    token,
    fetcher,
  );
  if (!available.some((slot) => slot.startTime === booking.startTime)) {
    throw new PublicApiError(
      409,
      "SLOT_UNAVAILABLE",
      "That time was just taken. Please choose another available slot.",
      true,
    );
  }

  const built = buildInviteePayload(eventType, booking);
  const response = await calendlyRequest(
    "/invitees",
    token,
    { method: "POST", body: JSON.stringify(built.payload) },
    fetcher,
  );
  const resource = response?.resource ?? {};
  const cancelUrl = safeCalendlyUrl(resource.cancel_url);
  const rescheduleUrl = safeCalendlyUrl(resource.reschedule_url);
  return {
    startTime: booking.startTime,
    timezone: booking.timezone,
    durationMinutes: Number(eventType.duration) || BOOKING_DURATION_MINUTES,
    confirmationEmail: booking.details.email,
    ...(cancelUrl ? { cancelUrl } : {}),
    ...(rescheduleUrl ? { rescheduleUrl } : {}),
    qualificationTransmitted: built.qualificationTransmitted,
  };
}

export function clearEventTypeCache() {
  eventTypeCache = null;
}
