import { beforeEach, describe, expect, it, vi } from "vitest";

function elementAt(top: number, left = 0): Element {
  const element = document.createElement("div");
  element.getBoundingClientRect = () => ({
    bottom: top + 40,
    height: 40,
    left,
    right: left + 40,
    top,
    width: 40,
    x: left,
    y: top,
    toJSON: () => ({}),
  });
  return element;
}

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value,
    writable: true,
  });
}

describe("reveal scheduler", () => {
  let now = 1_000;

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    now = 1_000;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, "scrollX", {
      configurable: true,
      value: 0,
      writable: true,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    });
  });

  it("keeps the requested cinematic pace during ordinary scrolling", async () => {
    const { scheduleReveal } = await import("~/motion/reveal-scheduler");

    const schedule = scheduleReveal(elementAt(100), 240);

    expect(schedule).toEqual({ delayMs: 240, durationScale: 1 });
  });

  it("compresses both delay and duration after a fast viewport jump", async () => {
    const { scheduleReveal } = await import("~/motion/reveal-scheduler");
    scheduleReveal(elementAt(100), 200);

    now += 100;
    setScrollY(320);
    const schedule = scheduleReveal(elementAt(300), 200);

    expect(schedule.durationScale).toBe(0.58);
    expect(schedule.delayMs).toBeLessThan(200);
    expect(schedule.delayMs).toBeGreaterThanOrEqual(200 * 0.58);
  });

  it("paces the first reveal when a fast scroll overshoots its trigger line", async () => {
    const { scheduleReveal } = await import("~/motion/reveal-scheduler");
    setScrollY(800);

    const schedule = scheduleReveal(elementAt(200), 200);

    expect(schedule).toEqual({ delayMs: 116, durationScale: 0.58 });
  });

  it("preserves document order while using a shorter fast-scroll gap", async () => {
    const { scheduleReveal } = await import("~/motion/reveal-scheduler");
    scheduleReveal(elementAt(100), 0);

    now += 100;
    setScrollY(320);
    const upper = scheduleReveal(elementAt(50), 0);
    const lower = scheduleReveal(elementAt(250), 0);

    expect(upper.durationScale).toBe(0.58);
    expect(lower.durationScale).toBe(0.58);
    expect(lower.delayMs - upper.delayMs).toBeCloseTo(90 * 0.58, 5);
  });
});
