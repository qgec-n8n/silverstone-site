import { createHash } from "node:crypto";

export const PUBLIC_EVENT_URL = "https://calendly.com/silverstone-ai/30min";
export const APPLICATION_WINDOW_DAYS = 42;
/* Calendly documents a 7-day maximum range for event_type_available_times;
   larger ranges currently succeed but are undocumented behaviour. */
export const UPSTREAM_MAX_DAYS = 7;
export const BOOKING_DURATION_MINUTES = 30;
export const DAY_MS = 86_400_000;

const SERVICE_IDS = new Set([
  "web",
  "app",
  "voice-agent",
  "receptionist",
  "automation",
  "consulting",
  "content",
  "other",
]);
const INDUSTRIES = new Set([
  "Estate agents",
  "Hospitality",
  "Salons & barbers",
  "Trades & home services",
  "eCommerce brands",
  "Physio & chiropractic clinics",
  "Dental practices",
  "Gyms & fitness studios",
  "Fitness coaches",
  "Other",
]);
const BUDGETS = new Set([
  "Under £1k",
  "£1k–£3k",
  "£3k–£10k",
  "£10k+",
  "Not sure yet",
]);
const URGENCIES = new Set([
  "As soon as possible",
  "Within a month",
  "1–3 months",
  "Just exploring",
]);

const SERVICE_LABELS = new Map([
  ["web", "Web design & development"],
  ["app", "App development"],
  ["voice-agent", "AI voice agents"],
  ["receptionist", "AI receptionists"],
  ["automation", "AI automation"],
  ["consulting", "AI & automation consulting"],
  ["content", "Content creation"],
  ["other", "Partnership or other enquiry"],
]);

export class PublicApiError extends Error {
  constructor(status, code, message, retryable = false) {
    super(message);
    this.name = "PublicApiError";
    this.status = status;
    this.code = code;
    this.retryable = retryable;
  }
}

export function safeError(error) {
  if (error instanceof PublicApiError) {
    return {
      status: error.status,
      body: {
        ok: false,
        error: {
          code: error.code,
          message: error.message,
          retryable: error.retryable,
        },
      },
    };
  }
  return {
    status: 503,
    body: {
      ok: false,
      error: {
        code: "UPSTREAM_UNAVAILABLE",
        message:
          "The booking service is temporarily unavailable. Please try again.",
        retryable: true,
      },
    },
  };
}

export function isValidTimeZone(value) {
  if (typeof value !== "string" || value.length > 80) {
    return false;
  }
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export function parseAvailabilityQuery(parameters) {
  const start = parameters.get("start") ?? "";
  const days = Number(parameters.get("days"));
  const timezone = parameters.get("timezone") ?? "";
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(start) ||
    Number.isNaN(Date.parse(`${start}T00:00:00Z`))
  ) {
    throw new PublicApiError(
      400,
      "INVALID_REQUEST",
      "Choose a valid start date.",
    );
  }
  if (days !== APPLICATION_WINDOW_DAYS) {
    throw new PublicApiError(
      400,
      "INVALID_REQUEST",
      "Availability requests must cover exactly six weeks.",
    );
  }
  if (!isValidTimeZone(timezone)) {
    throw new PublicApiError(
      400,
      "INVALID_TIMEZONE",
      "Choose a valid timezone.",
    );
  }

  const startMs = Date.parse(`${start}T00:00:00Z`);
  const todayMs = Date.parse(
    new Date().toISOString().slice(0, 10) + "T00:00:00Z",
  );
  if (startMs < todayMs - DAY_MS || startMs > todayMs + 370 * DAY_MS) {
    throw new PublicApiError(
      400,
      "INVALID_REQUEST",
      "The requested date window is outside the supported range.",
    );
  }
  return {
    start,
    days,
    timezone,
    endExclusive: new Date(startMs + days * DAY_MS).toISOString().slice(0, 10),
  };
}

export function chunkIsoRange(
  startTime,
  endTime,
  maximumDays = UPSTREAM_MAX_DAYS,
) {
  const startMs = Date.parse(startTime);
  const endMs = Date.parse(endTime);
  if (
    !Number.isFinite(startMs) ||
    !Number.isFinite(endMs) ||
    endMs <= startMs ||
    maximumDays < 1
  ) {
    throw new PublicApiError(
      400,
      "INVALID_REQUEST",
      "Invalid availability range.",
    );
  }
  const maximumMs = maximumDays * DAY_MS;
  const ranges = [];
  let cursor = startMs;
  while (cursor < endMs) {
    const next = Math.min(cursor + maximumMs, endMs);
    ranges.push({
      startTime: new Date(cursor).toISOString(),
      endTime: new Date(next).toISOString(),
    });
    cursor = next;
  }
  return ranges;
}

export function normaliseAvailability(collections, durationMinutes) {
  const byStart = new Map();
  for (const collection of collections) {
    for (const item of collection) {
      if (
        typeof item?.start_time !== "string" ||
        !Number.isFinite(Date.parse(item.start_time)) ||
        (typeof item.status === "string" && item.status !== "available")
      ) {
        continue;
      }
      const startTime = new Date(item.start_time).toISOString();
      if (!byStart.has(startTime)) {
        byStart.set(startTime, {
          startTime,
          endTime: new Date(
            Date.parse(startTime) + durationMinutes * 60_000,
          ).toISOString(),
        });
      }
    }
  }
  return [...byStart.values()].sort(
    (left, right) => Date.parse(left.startTime) - Date.parse(right.startTime),
  );
}

function cleanString(value, maximumLength, required = false) {
  if (typeof value !== "string") {
    if (required) {
      throw new PublicApiError(
        400,
        "INVALID_REQUEST",
        "Required booking details are missing.",
      );
    }
    return "";
  }
  const cleaned = value.trim().replace(/\s+/g, " ");
  if (
    (required && cleaned.length === 0) ||
    cleaned.length > maximumLength ||
    /[\u0000-\u001f<>]/u.test(cleaned)
  ) {
    throw new PublicApiError(
      400,
      "INVALID_REQUEST",
      "Some booking details are invalid.",
    );
  }
  return cleaned;
}

export function validateBookingRequest(value, now = Date.now()) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new PublicApiError(
      400,
      "INVALID_REQUEST",
      "The booking request is invalid.",
    );
  }
  const qualification = value.qualification;
  const details = value.details;
  if (
    !qualification ||
    typeof qualification !== "object" ||
    !details ||
    typeof details !== "object"
  ) {
    throw new PublicApiError(
      400,
      "INVALID_REQUEST",
      "Required booking details are missing.",
    );
  }

  const services = Array.isArray(qualification.services)
    ? [...new Set(qualification.services)]
    : [];
  if (
    services.length < 1 ||
    services.length > 3 ||
    services.some(
      (service) => typeof service !== "string" || !SERVICE_IDS.has(service),
    )
  ) {
    throw new PublicApiError(
      400,
      "INVALID_REQUEST",
      "Choose between one and three services.",
    );
  }
  if (!INDUSTRIES.has(qualification.industry)) {
    throw new PublicApiError(
      400,
      "INVALID_REQUEST",
      "Choose a valid industry.",
    );
  }
  if (!BUDGETS.has(qualification.budget)) {
    throw new PublicApiError(
      400,
      "INVALID_REQUEST",
      "Choose a valid budget range.",
    );
  }
  if (!URGENCIES.has(qualification.urgency)) {
    throw new PublicApiError(
      400,
      "INVALID_REQUEST",
      "Choose a valid timeframe.",
    );
  }

  const startTime = cleanString(value.startTime, 40, true);
  const startMs = Date.parse(startTime);
  if (
    !Number.isFinite(startMs) ||
    startMs < now + 30_000 ||
    startMs > now + 370 * DAY_MS
  ) {
    throw new PublicApiError(
      400,
      "INVALID_REQUEST",
      "Choose a valid future time.",
    );
  }
  const timezone = cleanString(value.timezone, 80, true);
  if (!isValidTimeZone(timezone)) {
    throw new PublicApiError(
      400,
      "INVALID_TIMEZONE",
      "Choose a valid timezone.",
    );
  }

  const name = cleanString(details.name, 100, true);
  const email = cleanString(details.email, 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) {
    throw new PublicApiError(
      400,
      "INVALID_REQUEST",
      "Enter a valid email address.",
    );
  }
  if (details.acknowledged !== true) {
    throw new PublicApiError(
      400,
      "INVALID_REQUEST",
      "Booking acknowledgement is required.",
    );
  }

  return {
    startTime: new Date(startMs).toISOString(),
    timezone,
    qualification: {
      services,
      industry: qualification.industry,
      budget: qualification.budget,
      urgency: qualification.urgency,
    },
    details: {
      name,
      email,
      company: cleanString(details.company, 120),
      role: cleanString(details.role, 100),
      context: cleanString(details.context, 600),
      acknowledged: true,
    },
  };
}

const QUALIFICATION_KINDS = ["services", "industry", "budget", "urgency"];
const ANSWER_MAX_LENGTH = 1000;

function questionKind(name) {
  const normalised = name.toLowerCase();
  if (/service|help with|project type/u.test(normalised)) return "services";
  if (/industr|sector|business type/u.test(normalised)) return "industry";
  if (/budget|investment/u.test(normalised)) return "budget";
  if (/urgency|timeline|timeframe|start/u.test(normalised)) return "urgency";
  if (/company|organisation|organization/u.test(normalised)) return "company";
  if (/role|position|job title/u.test(normalised)) return "role";
  if (/context|anything else|share|problem|goal|prepare/u.test(normalised))
    return "context";
  return null;
}

function isFreeTextQuestion(question) {
  return (
    !Array.isArray(question.answer_choices) || question.answer_choices.length === 0
  );
}

export function composeDiscoveryBrief(booking) {
  const lines = [
    `Services: ${booking.qualification.services
      .map((service) => SERVICE_LABELS.get(service))
      .filter(Boolean)
      .join(", ")}`,
    `Industry: ${booking.qualification.industry}`,
    `Budget: ${booking.qualification.budget}`,
    `Timing: ${booking.qualification.urgency}`,
  ];
  if (booking.details.company) lines.push(`Company: ${booking.details.company}`);
  if (booking.details.role) lines.push(`Role: ${booking.details.role}`);
  if (booking.details.context) lines.push(`Context: ${booking.details.context}`);
  return lines.join("\n").slice(0, ANSWER_MAX_LENGTH);
}

export function buildQuestionsAndAnswers(eventType, booking) {
  const questions = Array.isArray(eventType.custom_questions)
    ? eventType.custom_questions
    : [];
  const values = {
    services: booking.qualification.services
      .map((service) => SERVICE_LABELS.get(service))
      .filter(Boolean)
      .join(", "),
    industry: booking.qualification.industry,
    budget: booking.qualification.budget,
    urgency: booking.qualification.urgency,
    company: booking.details.company,
    role: booking.details.role,
    context: booking.details.context,
  };
  const answers = [];
  const transmittedKinds = new Set();
  let contextQuestion = null;
  for (const question of questions) {
    if (question?.enabled === false || typeof question?.name !== "string")
      continue;
    const kind = questionKind(question.name);
    if (kind === "context" && isFreeTextQuestion(question) && !contextQuestion) {
      contextQuestion = question;
      continue;
    }
    const answer = kind ? values[kind] : "";
    if (!answer) continue;
    transmittedKinds.add(kind);
    answers.push({
      question: question.name,
      answer: answer.slice(0, ANSWER_MAX_LENGTH),
      position: Number.isInteger(question.position)
        ? question.position
        : answers.length,
    });
  }

  /* Qualification must never be discarded silently. When the event type lacks
     dedicated qualification questions, the whole discovery brief travels in a
     free-text question (the live event type asks invitees to "share anything
     that will help prepare"). */
  const qualificationCovered = QUALIFICATION_KINDS.every((kind) =>
    transmittedKinds.has(kind),
  );
  if (contextQuestion) {
    const answer = qualificationCovered
      ? values.context
      : composeDiscoveryBrief(booking);
    if (answer) {
      answers.push({
        question: contextQuestion.name,
        answer: answer.slice(0, ANSWER_MAX_LENGTH),
        position: Number.isInteger(contextQuestion.position)
          ? contextQuestion.position
          : answers.length,
      });
      if (!qualificationCovered) {
        for (const kind of QUALIFICATION_KINDS) transmittedKinds.add(kind);
      }
    }
  }

  return {
    answers: answers.sort((left, right) => left.position - right.position),
    qualificationTransmitted: QUALIFICATION_KINDS.every((kind) =>
      transmittedKinds.has(kind),
    ),
  };
}

export function buildInviteePayload(eventType, booking) {
  const mapped = buildQuestionsAndAnswers(eventType, booking);
  /* No `location` field: the Scheduling API treats it as optional and the
     event type's own location configuration (e.g. google_conference) governs
     where the call happens, exactly as with a Calendly-hosted booking. */
  const payload = {
    event_type: eventType.uri,
    start_time: booking.startTime,
    invitee: {
      name: booking.details.name,
      email: booking.details.email,
      timezone: booking.timezone,
    },
  };
  if (mapped.answers.length > 0) {
    payload.questions_and_answers = mapped.answers;
  }
  return { payload, qualificationTransmitted: mapped.qualificationTransmitted };
}

export function validateIdempotencyKey(value) {
  if (typeof value !== "string" || !/^[a-zA-Z0-9-]{16,80}$/u.test(value)) {
    throw new PublicApiError(
      400,
      "INVALID_REQUEST",
      "The booking request identifier is invalid.",
    );
  }
  return value;
}

export function bookingFingerprint(idempotencyKey, booking) {
  return createHash("sha256")
    .update(idempotencyKey)
    .update("\0")
    .update(JSON.stringify(booking))
    .digest("hex");
}

export function createServerMockAvailability(window) {
  const slots = [];
  const startMs = Date.parse(`${window.start}T00:00:00Z`);
  for (let day = 0; day < APPLICATION_WINDOW_DAYS; day += 1) {
    const current = new Date(startMs + day * DAY_MS);
    if (current.getUTCDay() === 0 || day % 9 === 4) continue;
    for (let minutes = 510; minutes <= 1080; minutes += 30) {
      if ((minutes / 30 + day) % 5 === 0) continue;
      const startTime = new Date(
        Date.UTC(
          current.getUTCFullYear(),
          current.getUTCMonth(),
          current.getUTCDate(),
          Math.floor(minutes / 60),
          minutes % 60,
        ),
      ).toISOString();
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
