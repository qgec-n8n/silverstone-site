import { describe, expect, it } from "vitest";

import {
  applyAgentTranscriptCorrection,
  applyTranscriptMessage,
  formatAgentTranscriptForDisplay,
  type TranscriptEntry,
} from "~/features/services-v2/demos/agent-transcript";

describe("formatAgentTranscriptForDisplay", () => {
  it.each([
    ["info at silverstone dash a i dot com", "info@silverstone-ai.com"],
    ["INFO at Silverstone-AI dot COM", "info@silverstone-ai.com"],
    ["info@silverstone dash ai dot com", "info@silverstone-ai.com"],
    [
      "silverstone dash a i dot com forward slash book",
      "https://silverstone-ai.com/book",
    ],
    ["silverstone dash ai dot com slash book", "https://silverstone-ai.com/book"],
    ["silverstone-ai dot com forward slash book", "https://silverstone-ai.com/book"],
    ["silverstone-ai.com/book", "https://silverstone-ai.com/book"],
  ])("normalises the contact detail in %s", (input, expected) => {
    expect(formatAgentTranscriptForDisplay(input)).toBe(expected);
  });

  it.each([
    ["Monday thirteenth of July at twelve fifteen p m", "Monday 13th July at 12:15pm"],
    ["Tuesday the twenty first of July at nine a m", "Tuesday 21st July at 9:00am"],
    ["Wednesday 22nd July at four thirty pm", "Wednesday 22nd July at 4:30pm"],
    ["Thursday first May at noon", "Thursday 1st May at 12:00pm"],
    ["Friday twenty third May at midnight", "Friday 23rd May at 12:00am"],
    ["Saturday thirty first May at one p.m.", "Saturday 31st May at 1:00pm."],
  ])("normalises the date and time in %s", (input, expected) => {
    expect(formatAgentTranscriptForDisplay(input)).toBe(expected);
  });

  it("leaves already formatted content unchanged and remains idempotent", () => {
    const input =
      "Monday 13th July at 12:15pm — info@silverstone-ai.com — https://silverstone-ai.com/book";
    const once = formatAgentTranscriptForDisplay(input);
    expect(once).toBe(input);
    expect(formatAgentTranscriptForDisplay(once)).toBe(once);
  });

  it("normalises dates and contact details inside a mixed sentence", () => {
    expect(
      formatAgentTranscriptForDisplay(
        "I can book Monday thirteenth of July at twelve fifteen p m. You can also email info at silverstone dash a i dot com or visit silverstone dash ai dot com slash book.",
      ),
    ).toBe(
      "I can book Monday 13th July at 12:15pm. You can also email info@silverstone-ai.com or visit https://silverstone-ai.com/book.",
    );
  });

  it("leaves unrelated email addresses and URLs unchanged", () => {
    const input = "Email hello@example.com or visit https://example.com/book.";
    expect(formatAgentTranscriptForDisplay(input)).toBe(input);
  });

  it.each([
    "We could meet on the twenty first or twenty second.",
    "Monday twenty first July at twenty five pm",
    "Monday 13th July at around twelve fifteen pm",
    "Monday 13st July at twelve pm",
  ])("leaves ambiguous or invalid prose unchanged: %s", (input) => {
    expect(formatAgentTranscriptForDisplay(input)).toBe(input);
  });
});

describe("transcript event handling", () => {
  const agentEntry: TranscriptEntry = {
    id: 1,
    role: "agent",
    text: "Monday 13th July at 12:15pm",
    at: 4,
    eventId: 10,
  };

  it("replaces a repeated final event instead of appending a duplicate", () => {
    const result = applyTranscriptMessage([agentEntry], {
      id: 2,
      role: "agent",
      message: "Tuesday twenty first July at nine a m",
      at: 8,
      eventId: 10,
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 1,
      text: "Tuesday 21st July at 9:00am",
      eventId: 10,
    });
  });

  it("replaces an interrupted agent response with its formatted correction", () => {
    const result = applyAgentTranscriptCorrection([agentEntry], {
      eventId: 10,
      originalMessage: "Monday thirteenth July at twelve fifteen p m",
      correctedMessage: "Monday thirteenth July at noon",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.text).toBe("Monday 13th July at 12:00pm");
  });

  it("leaves visitor transcript text untouched", () => {
    const spoken = "info at silverstone dash a i dot com";
    const result = applyTranscriptMessage([], {
      id: 1,
      role: "user",
      message: spoken,
      at: 2,
      eventId: 3,
    });

    expect(result[0]?.text).toBe(spoken);
  });
});
