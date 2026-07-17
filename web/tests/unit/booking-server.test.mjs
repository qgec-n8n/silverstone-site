import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { handler as availabilityHandler } from "../../../netlify/functions/calendly-availability.mjs";
import { handler as bookingHandler } from "../../../netlify/functions/calendly-book.mjs";
import { createCalendlyBooking } from "../../../netlify/functions/_calendly/calendly-client.mjs";
import {
  buildInviteePayload,
  chunkIsoRange,
  normaliseAvailability,
  validateBookingRequest,
} from "../../../netlify/functions/_calendly/calendly-core.mjs";

const previousContext = process.env.CONTEXT;
const previousToken = process.env.CALENDLY_API_TOKEN;

afterEach(() => {
  if (previousContext === undefined) delete process.env.CONTEXT;
  else process.env.CONTEXT = previousContext;
  if (previousToken === undefined) delete process.env.CALENDLY_API_TOKEN;
  else process.env.CALENDLY_API_TOKEN = previousToken;
});

function validRequest(startTime = new Date(Date.now() + 7 * 86_400_000).toISOString()) {
  return {
    startTime,
    timezone: "Europe/London",
    qualification: {
      services: ["web", "automation"],
      industry: "Hospitality",
      budget: "£3k–£10k",
      urgency: "Within a month",
    },
    details: {
      name: "Ada Lovelace",
      email: "ada@example.com",
      company: "Analytical Engines",
      role: "Founder",
      context: "A clearer enquiry and follow-up journey.",
      acknowledged: true,
    },
  };
}

function collectSourceFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory() ? collectSourceFiles(path) : [path];
  });
}

describe("Calendly server boundary", () => {
  it("splits one 42-day ISO range into six gap-free 7-day upstream ranges", () => {
    const start = "2026-07-16T00:00:00.000Z";
    const end = "2026-08-27T00:00:00.000Z";
    const chunks = chunkIsoRange(start, end);

    expect(chunks).toHaveLength(6);
    expect(chunks[0]).toEqual({
      startTime: start,
      endTime: "2026-07-23T00:00:00.000Z",
    });
    expect(chunks.at(-1)).toEqual({
      startTime: "2026-08-20T00:00:00.000Z",
      endTime: end,
    });
    for (let index = 1; index < chunks.length; index += 1) {
      expect(chunks[index].startTime).toBe(chunks[index - 1].endTime);
    }
  });

  it("normalises, deduplicates and sorts reduced availability fields", () => {
    expect(
      normaliseAvailability(
        [
          [{ start_time: "2026-07-20T11:00:00Z", status: "available" }],
          [
            { start_time: "2026-07-20T09:00:00Z", status: "available" },
            { start_time: "2026-07-20T11:00:00Z", status: "available" },
            { start_time: "2026-07-20T10:00:00Z", status: "unavailable" },
          ],
        ],
        30,
      ),
    ).toEqual([
      {
        startTime: "2026-07-20T09:00:00.000Z",
        endTime: "2026-07-20T09:30:00.000Z",
      },
      {
        startTime: "2026-07-20T11:00:00.000Z",
        endTime: "2026-07-20T11:30:00.000Z",
      },
    ]);
  });

  it("validates and normalises the booking schema while rejecting malicious input", () => {
    const request = validRequest("2026-08-20T09:00:00.000Z");
    const parsed = validateBookingRequest(request, Date.parse("2026-07-16T12:00:00Z"));

    expect(parsed.details.email).toBe("ada@example.com");
    expect(parsed.qualification.services).toEqual(["web", "automation"]);
    expect(() =>
      validateBookingRequest(
        {
          ...request,
          details: { ...request.details, context: "<script>alert(1)</script>" },
        },
        Date.parse("2026-07-16T12:00:00Z"),
      ),
    ).toThrow("invalid");
    expect(() =>
      validateBookingRequest(
        {
          ...request,
          qualification: { ...request.qualification, services: ["not-a-service"] },
        },
        Date.parse("2026-07-16T12:00:00Z"),
      ),
    ).toThrow("services");
  });

  it("maps only configured Calendly questions into the documented invitee payload", () => {
    const eventType = {
      uri: "https://api.calendly.com/event_types/example",
      locations: [{ kind: "zoom_conference" }],
      custom_questions: [
        { name: "Which service can we help with?", position: 0, enabled: true },
        { name: "What is your budget?", position: 1, enabled: true },
        { name: "Unrelated internal field", position: 2, enabled: true },
      ],
    };
    const built = buildInviteePayload(
      eventType,
      validateBookingRequest(validRequest(), Date.now()),
    );

    expect(built.payload).toMatchObject({
      event_type: eventType.uri,
      invitee: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        timezone: "Europe/London",
      },
    });
    /* Scheduling API invitee creation requires the configured event-type
       location. Host-generated conference kinds need the kind only. */
    expect(built.payload.location).toEqual({ kind: "zoom_conference" });
    expect(built.payload.questions_and_answers).toEqual([
      {
        question: "Which service can we help with?",
        answer: "Web design & development, AI automation",
        position: 0,
      },
      { question: "What is your budget?", answer: "£3k–£10k", position: 1 },
    ]);
    /* Industry and timing had no matching question and no free-text carrier,
       so the qualification cannot be reported as fully transmitted. */
    expect(built.qualificationTransmitted).toBe(false);
  });

  it("composes the full discovery brief into a lone free-text question", () => {
    /* Mirrors the live silverstone-ai/30min event type: one optional
       free-text question and no dedicated qualification questions. */
    const eventType = {
      uri: "https://api.calendly.com/event_types/live-shape",
      locations: [{ kind: "google_conference" }],
      custom_questions: [
        {
          name: "Please share anything that will help prepare for our meeting.",
          position: 0,
          enabled: true,
          required: false,
          type: "text",
          answer_choices: [],
        },
      ],
    };
    const built = buildInviteePayload(
      eventType,
      validateBookingRequest(validRequest(), Date.now()),
    );

    expect(built.payload.questions_and_answers).toHaveLength(1);
    expect(built.payload.location).toEqual({ kind: "google_conference" });
    const answer = built.payload.questions_and_answers[0].answer;
    expect(answer).toContain("Services: Web design & development, AI automation");
    expect(answer).toContain("Industry: Hospitality");
    expect(answer).toContain("Budget: £3k–£10k");
    expect(answer).toContain("Timing: Within a month");
    expect(answer).toContain("Context: A clearer enquiry and follow-up journey.");
    expect(built.qualificationTransmitted).toBe(true);
  });

  it("bounds each availability request to six weeks and uses mocks outside production", async () => {
    process.env.CONTEXT = "deploy-preview";
    const today = new Date().toISOString().slice(0, 10);
    const valid = await availabilityHandler({
      httpMethod: "GET",
      headers: {},
      queryStringParameters: {
        start: today,
        days: "42",
        timezone: "Europe/London",
      },
    });
    const invalid = await availabilityHandler({
      httpMethod: "GET",
      headers: {},
      queryStringParameters: {
        start: today,
        days: "43",
        timezone: "Europe/London",
      },
    });

    expect(valid.statusCode).toBe(200);
    expect(JSON.parse(valid.body)).toMatchObject({ ok: true, source: "mock" });
    expect(invalid.statusCode).toBe(400);
    expect(JSON.parse(invalid.body)).toMatchObject({
      ok: false,
      error: { code: "INVALID_REQUEST", retryable: false },
    });
  });

  it("accepts a shortened final availability window inside the horizon", async () => {
    process.env.CONTEXT = "deploy-preview";
    const today = new Date().toISOString().slice(0, 10);
    const response = await availabilityHandler({
      httpMethod: "GET",
      headers: {},
      queryStringParameters: {
        start: today,
        days: "9",
        timezone: "Europe/London",
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toMatchObject({
      ok: true,
      window: { start: today, days: 9 },
      source: "mock",
    });
    expect(
      body.slots.every(
        (slot) => slot.startTime.slice(0, 10) < body.window.endExclusive,
      ),
    ).toBe(true);
  });

  it("rechecks the slot and sends the configured location to invitee creation", async () => {
    const booking = validateBookingRequest(validRequest(), Date.now());
    const eventType = {
      uri: "https://api.calendly.com/event_types/live-shape",
      duration: 30,
      locations: [{ kind: "google_conference" }],
      custom_questions: [],
    };
    let inviteePayload;
    const fetcher = vi.fn(async (url, init = {}) => {
      if (url.includes("/event_type_available_times?")) {
        return new Response(
          JSON.stringify({
            collection: [{ start_time: booking.startTime, status: "available" }],
          }),
          { status: 200 },
        );
      }
      if (url.endsWith("/invitees")) {
        inviteePayload = JSON.parse(init.body);
        return new Response(
          JSON.stringify({
            resource: {
              cancel_url: "https://calendly.com/cancellations/example",
              reschedule_url: "https://calendly.com/reschedulings/example",
            },
          }),
          { status: 200 },
        );
      }
      throw new Error(`Unexpected request: ${url}`);
    });

    const confirmation = await createCalendlyBooking(
      eventType,
      booking,
      "test-token",
      fetcher,
    );

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(inviteePayload).toMatchObject({
      event_type: eventType.uri,
      start_time: booking.startTime,
      location: { kind: "google_conference" },
      invitee: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        timezone: "Europe/London",
      },
    });
    expect(confirmation).toMatchObject({
      startTime: booking.startTime,
      durationMinutes: 30,
      confirmationEmail: "ada@example.com",
    });
  });

  it("preserves an invitee reservation conflict as a retryable slot error", async () => {
    const booking = validateBookingRequest(validRequest(), Date.now());
    const eventType = {
      uri: "https://api.calendly.com/event_types/live-shape",
      duration: 30,
      locations: [{ kind: "google_conference" }],
      custom_questions: [],
    };
    const fetcher = vi.fn(async (url) => {
      if (url.includes("/event_type_available_times?")) {
        return new Response(
          JSON.stringify({
            collection: [{ start_time: booking.startTime, status: "available" }],
          }),
          { status: 200 },
        );
      }
      return new Response(
        JSON.stringify({ message: "That time could not be reserved." }),
        { status: 409 },
      );
    });

    await expect(
      createCalendlyBooking(eventType, booking, "test-token", fetcher),
    ).rejects.toMatchObject({
      status: 409,
      code: "SLOT_UNAVAILABLE",
      retryable: true,
    });
  });

  it("does not disguise an invitee payload rejection as a claimed slot", async () => {
    const booking = validateBookingRequest(validRequest(), Date.now());
    const eventType = {
      uri: "https://api.calendly.com/event_types/live-shape",
      duration: 30,
      locations: [{ kind: "google_conference" }],
      custom_questions: [],
    };
    const fetcher = vi.fn(async (url) => {
      if (url.includes("/event_type_available_times?")) {
        return new Response(
          JSON.stringify({
            collection: [{ start_time: booking.startTime, status: "available" }],
          }),
          { status: 200 },
        );
      }
      return new Response(JSON.stringify({ message: "location.kind is required" }), {
        status: 422,
      });
    });

    await expect(
      createCalendlyBooking(eventType, booking, "test-token", fetcher),
    ).rejects.toMatchObject({
      status: 503,
      code: "SERVER_MISCONFIGURED",
      retryable: false,
    });
  });

  it("deduplicates identical booking submissions and rejects key reuse with new details", async () => {
    process.env.CONTEXT = "deploy-preview";
    const event = {
      httpMethod: "POST",
      headers: {
        origin: "http://localhost:4173",
        "idempotency-key": "booking-test-key-123456",
      },
      body: JSON.stringify(validRequest()),
    };
    const first = await bookingHandler(event);
    const duplicate = await bookingHandler(event);
    const conflict = await bookingHandler({
      ...event,
      body: JSON.stringify({
        ...validRequest(),
        details: {
          ...validRequest().details,
          company: "A different company with the same invitee email",
        },
      }),
    });

    expect(JSON.parse(first.body)).toEqual(JSON.parse(duplicate.body));
    expect(JSON.parse(first.body)).toMatchObject({ ok: true, source: "mock" });
    expect(conflict.statusCode).toBe(409);
  });

  it("fails safely without a production credential and keeps token access out of client source", async () => {
    process.env.CONTEXT = "production";
    delete process.env.CALENDLY_API_TOKEN;
    const today = new Date().toISOString().slice(0, 10);
    const response = await availabilityHandler({
      httpMethod: "GET",
      headers: { "sec-fetch-site": "same-origin" },
      queryStringParameters: {
        start: today,
        days: "42",
        timezone: "Europe/London",
      },
    });
    process.env.CALENDLY_API_TOKEN = "PASTE_YOUR_CALENDLY_API_TOKEN_HERE";
    const placeholderResponse = await availabilityHandler({
      httpMethod: "GET",
      headers: { "sec-fetch-site": "same-origin" },
      queryStringParameters: {
        start: today,
        days: "42",
        timezone: "Europe/London",
      },
    });
    delete process.env.CALENDLY_API_TOKEN;
    const clientSource = collectSourceFiles(resolve(process.cwd(), "src"))
      .filter((path) => /\.(?:ts|tsx|css)$/u.test(path))
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");

    expect(response.statusCode).toBe(503);
    expect(JSON.parse(response.body)).toMatchObject({
      ok: false,
      error: { code: "SERVER_MISCONFIGURED", retryable: false },
    });
    /* The committed placeholder value must behave exactly like a missing
       token — a clear configuration error, never a Calendly call. */
    expect(placeholderResponse.statusCode).toBe(503);
    expect(JSON.parse(placeholderResponse.body)).toMatchObject({
      ok: false,
      error: { code: "SERVER_MISCONFIGURED", retryable: false },
    });
    expect(clientSource).not.toContain("CALENDLY_API_TOKEN");
  });
});
