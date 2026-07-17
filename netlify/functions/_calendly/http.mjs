import { PublicApiError } from "./calendly-core.mjs";

const limits = new Map();

export function jsonResponse(statusCode, body, cacheControl = "no-store") {
  return {
    statusCode,
    headers: {
      "Cache-Control": cacheControl,
      "Content-Type": "application/json; charset=utf-8",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
    body: JSON.stringify(body),
  };
}

function header(event, name) {
  const target = name.toLowerCase();
  for (const [key, value] of Object.entries(event.headers ?? {})) {
    if (key.toLowerCase() === target) return value;
  }
  return undefined;
}

export function ensureSameOrigin(event, production, requireOrigin = true) {
  const origin = header(event, "origin");
  const fetchSite = header(event, "sec-fetch-site");
  if (production) {
    if (
      (requireOrigin && origin !== "https://silverstone-ai.com") ||
      (!requireOrigin && origin && origin !== "https://silverstone-ai.com")
    ) {
      throw new PublicApiError(
        403,
        "INVALID_REQUEST",
        "This request is not allowed.",
      );
    }
    if (fetchSite && fetchSite !== "same-origin") {
      throw new PublicApiError(
        403,
        "INVALID_REQUEST",
        "This request is not allowed.",
      );
    }
    return;
  }
  if (origin) {
    const url = new URL(origin);
    if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
      throw new PublicApiError(
        403,
        "INVALID_REQUEST",
        "This request is not allowed.",
      );
    }
  }
}

export function getHeader(event, name) {
  return header(event, name);
}

export function enforceRateLimit(event, namespace, maximum, windowMs) {
  const now = Date.now();
  const client =
    header(event, "x-nf-client-connection-ip") ??
    header(event, "x-forwarded-for")?.split(",")[0]?.trim() ??
    "anonymous";
  const key = `${namespace}:${client}`;
  const current = limits.get(key);
  if (!current || now >= current.resetAt) {
    limits.set(key, { count: 1, resetAt: now + windowMs });
  } else {
    current.count += 1;
    if (current.count > maximum) {
      throw new PublicApiError(
        429,
        "RATE_LIMITED",
        "Too many requests were made. Please wait a moment and try again.",
        true,
      );
    }
  }

  if (limits.size > 500) {
    for (const [storedKey, value] of limits) {
      if (now >= value.resetAt) limits.delete(storedKey);
    }
  }
}

const TOKEN_PLACEHOLDER = "PASTE_YOUR_CALENDLY_API_TOKEN_HERE";

/* Returns the configured server-only token, or null when it is missing or
   still the committed placeholder — callers turn null into a safe
   SERVER_MISCONFIGURED error instead of calling Calendly with junk. */
export function readCalendlyToken() {
  const token = process.env.CALENDLY_API_TOKEN?.trim();
  if (!token || token === TOKEN_PLACEHOLDER) return null;
  return token;
}

export function liveCalendlyEnabled() {
  /* CALENDLY_BOOKING_MODE is the explicit server-side override: "mock" forces
     deterministic fixtures anywhere (including production), "live" opts a
     non-production environment into real Calendly calls for verification.
     Without an override, only production deploys go live. */
  if (process.env.CALENDLY_BOOKING_MODE === "mock") return false;
  if (process.env.CALENDLY_BOOKING_MODE === "live") return true;
  return process.env.CONTEXT === "production";
}
