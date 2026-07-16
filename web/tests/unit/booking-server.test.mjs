import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { handler as availabilityHandler } from "../../../netlify/functions/calendly-availability.mjs";
import { handler as bookingHandler } from "../../../netlify/functions/calendly-book.mjs";
import {
  buildInviteePayload,
  chunkIsoRange,
  normaliseAvailability,
  validateBookingRequest,
} from "../../../netlify/functions/_calendly/calendly-core.mjs";

const previousContext = process.env.CONTEXT;

afterEach(() => {
  if (previousContext === undefined) delete process.env.CONTEXT;
  else process.env.CONTEXT = previousContext;
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
  it("splits one 42-day ISO range into two gap-free upstream ranges", () => {
    const start = "2026-07-16T00:00:00.000Z";
    const end = "2026-08-27T00:00:00.000Z";
    const chunks = chunkIsoRange(start, end);

    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toEqual({
      startTime: start,
      endTime: "2026-08-16T00:00:00.000Z",
    });
    expect(chunks[1]).toEqual({
      startTime: "2026-08-16T00:00:00.000Z",
      endTime: end,
    });
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
      location: { kind: "zoom_conference" },
    });
    expect(built.payload.questions_and_answers).toEqual([
      {
        question: "Which service can we help with?",
        answer: "Web design & development, AI automation",
        position: 0,
      },
      { question: "What is your budget?", answer: "£3k–£10k", position: 1 },
    ]);
    expect(built.qualificationTransmitted).toBe(true);
  });

  it("enforces a six-week availability request and uses mocks outside production", async () => {
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
    const clientSource = collectSourceFiles(resolve(process.cwd(), "src"))
      .filter((path) => /\.(?:ts|tsx|css)$/u.test(path))
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");

    expect(response.statusCode).toBe(503);
    expect(JSON.parse(response.body)).toMatchObject({
      ok: false,
      error: { code: "SERVER_MISCONFIGURED", retryable: false },
    });
    expect(clientSource).not.toContain("CALENDLY_API_TOKEN");
  });
});
