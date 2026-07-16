import { describe, expect, it } from "vitest";

import {
  addDays,
  chunkDateRange,
  createApplicationWindow,
  dateKeyInTimeZone,
  formatSlotTime,
  isDateCovered,
  mergeAvailabilitySlots,
  visibleGridStart,
} from "~/features/booking/booking-dates";

describe("booking date windows", () => {
  it("creates exactly one 42-day application window", () => {
    const window = createApplicationWindow("2026-07-16");

    expect(window).toEqual({
      start: "2026-07-16",
      endExclusive: "2026-08-27",
      days: 42,
    });
    expect(addDays(window.start, window.days)).toBe(window.endExclusive);
  });

  it("splits 42 days into a contiguous 31-day and 11-day pair", () => {
    const window = createApplicationWindow("2026-07-16");
    const chunks = chunkDateRange(window);

    expect(chunks).toEqual([
      { start: "2026-07-16", endExclusive: "2026-08-16" },
      { start: "2026-08-16", endExclusive: "2026-08-27" },
    ]);
    expect(chunks[0]?.endExclusive).toBe(chunks[1]?.start);
  });

  it("normalises duplicate slots and sorts them chronologically", () => {
    const later = {
      startTime: "2026-07-18T11:00:00.000Z",
      endTime: "2026-07-18T11:30:00.000Z",
    };
    const earlier = {
      startTime: "2026-07-18T09:00:00.000Z",
      endTime: "2026-07-18T09:30:00.000Z",
    };

    expect(mergeAvailabilitySlots([[later], [earlier, later]])).toEqual([
      earlier,
      later,
    ]);
  });

  it("converts UTC timestamps across timezone and daylight-saving boundaries", () => {
    expect(dateKeyInTimeZone("2026-03-08T04:30:00.000Z", "America/New_York")).toBe(
      "2026-03-07",
    );
    expect(dateKeyInTimeZone("2026-03-08T07:30:00.000Z", "America/New_York")).toBe(
      "2026-03-08",
    );
    expect(formatSlotTime("2026-03-29T01:30:00.000Z", "Europe/London")).toBe("02:30");
  });

  it("aligns future months to the visible Monday grid without requesting history", () => {
    const today = new Date(2026, 6, 16, 12);

    expect(visibleGridStart(new Date(2026, 6, 1, 12), today)).toBe("2026-07-16");
    expect(visibleGridStart(new Date(2026, 7, 1, 12), today)).toBe("2026-07-27");
  });

  it("treats cached windows as half-open ranges", () => {
    const window = createApplicationWindow("2026-07-16");

    expect(isDateCovered("2026-07-16", [window])).toBe(true);
    expect(isDateCovered("2026-08-26", [window])).toBe(true);
    expect(isDateCovered("2026-08-27", [window])).toBe(false);
  });
});
