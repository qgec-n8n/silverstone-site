import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clearAvailabilityCache,
  getAvailabilitySnapshot,
  invalidateAvailabilitySlot,
  loadAvailabilityWindow,
  windowForMonth,
  type AvailabilityTransport,
} from "~/features/booking/booking-api";
import { createApplicationWindow } from "~/features/booking/booking-dates";
import type { AvailabilitySuccess } from "~/features/booking/booking-types";

afterEach(() => {
  clearAvailabilityCache();
  vi.useRealTimers();
});

function success(start: string, slotTime: string): AvailabilitySuccess {
  const window = createApplicationWindow(start);
  return {
    ok: true,
    source: "mock",
    window,
    slots: [
      {
        startTime: slotTime,
        endTime: new Date(Date.parse(slotTime) + 30 * 60_000).toISOString(),
      },
    ],
  };
}

describe("availability cache", () => {
  it("aligns the application window to today in the selected timezone", () => {
    expect(
      windowForMonth(
        new Date(2026, 2, 1, 12),
        new Date("2026-03-08T04:30:00.000Z"),
        "America/New_York",
      ).start,
    ).toBe("2026-03-07");
  });

  it("deduplicates overlapping in-flight requests with one stable cache key", async () => {
    const response = success("2026-07-16", "2026-07-20T09:00:00.000Z");
    let calls = 0;
    let release: ((value: AvailabilitySuccess) => void) | undefined;
    const transport: AvailabilityTransport = () => {
      calls += 1;
      return new Promise((resolve) => {
        release = resolve;
      });
    };
    const options = {
      mode: "mock" as const,
      timeZone: "Europe/London",
      window: response.window,
    };

    const first = loadAvailabilityWindow(options, transport);
    const second = loadAvailabilityWindow(options, transport);
    release?.(response);

    await expect(first).resolves.toEqual(response);
    await expect(second).resolves.toEqual(response);
    expect(calls).toBe(1);
  });

  it("uses fresh cache entries and refreshes them after expiry", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-16T12:00:00Z"));
    const response = success("2026-07-16", "2026-07-20T09:00:00.000Z");
    const transport = vi.fn<AvailabilityTransport>().mockResolvedValue(response);
    const options = {
      mode: "mock" as const,
      timeZone: "Europe/London",
      window: response.window,
    };

    await loadAvailabilityWindow(options, transport);
    await loadAvailabilityWindow(options, transport);
    expect(transport).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(60_001);
    await loadAvailabilityWindow(options, transport);
    expect(transport).toHaveBeenCalledTimes(2);
  });

  it("fetches only the uncovered tail when navigation windows overlap", async () => {
    const first = success("2026-07-16", "2026-08-01T09:00:00.000Z");
    const secondWindow = createApplicationWindow("2026-07-27");
    const transport = vi
      .fn<AvailabilityTransport>()
      .mockResolvedValueOnce(first)
      .mockImplementationOnce(({ window }) =>
        Promise.resolve({
          ...success(window.start, "2026-08-30T09:00:00.000Z"),
          window,
        }),
      );

    await loadAvailabilityWindow(
      { mode: "mock", timeZone: "Europe/London", window: first.window },
      transport,
    );
    await loadAvailabilityWindow(
      { mode: "mock", timeZone: "Europe/London", window: secondWindow },
      transport,
    );

    const snapshot = getAvailabilitySnapshot("mock", "Europe/London");
    expect(transport).toHaveBeenCalledTimes(2);
    expect(transport.mock.calls[1]?.[0].window).toEqual({
      start: "2026-08-27",
      endExclusive: "2026-09-07",
      days: 11,
    });
    expect(snapshot.windows).toHaveLength(2);
    expect(snapshot.slots).toHaveLength(2);
  });

  it("keeps a provider-rejected slot excluded while availability refreshes", async () => {
    const rejectedTime = "2026-07-20T09:00:00.000Z";
    const response = success("2026-07-16", rejectedTime);
    const transport = vi.fn<AvailabilityTransport>().mockResolvedValue(response);
    const options = {
      mode: "mock" as const,
      timeZone: "Europe/London",
      window: response.window,
    };

    await loadAvailabilityWindow(options, transport);
    invalidateAvailabilitySlot("mock", "Europe/London", rejectedTime);
    await loadAvailabilityWindow({ ...options, force: true }, transport);

    expect(transport).toHaveBeenCalledTimes(2);
    expect(getAvailabilitySnapshot("mock", "Europe/London").slots).toEqual([]);
  });

  it("releases an aborted in-flight key so navigation can retry", async () => {
    const window = createApplicationWindow("2026-07-16");
    const controller = new AbortController();
    const abortedTransport: AvailabilityTransport = ({ signal }) =>
      new Promise((_resolve, reject) => {
        signal?.addEventListener(
          "abort",
          () => reject(new DOMException("Aborted", "AbortError")),
          { once: true },
        );
      });
    const first = loadAvailabilityWindow(
      { mode: "mock", timeZone: "Europe/London", window, signal: controller.signal },
      abortedTransport,
    );
    controller.abort();
    await expect(first).rejects.toMatchObject({ name: "AbortError" });

    const response = success("2026-07-16", "2026-07-20T09:00:00.000Z");
    const retry = vi.fn<AvailabilityTransport>().mockResolvedValue(response);
    await expect(
      loadAvailabilityWindow(
        { mode: "mock", timeZone: "Europe/London", window },
        retry,
      ),
    ).resolves.toEqual(response);
    expect(retry).toHaveBeenCalledOnce();
  });
});
