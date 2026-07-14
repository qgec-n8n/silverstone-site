import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useShowcaseIdleTimeout } from "~/features/services-v2/demos/showcase-idle";
import {
  EMBED_VIEWPORT_WIDTH,
  initialShowcaseState,
  showcaseReducer,
  SHOWCASE_IDLE_TIMEOUT_MS,
  type ShowcaseState,
} from "~/features/services-v2/demos/showcase-state";

const OWNLY = "ownly-housing" as const;
const CLOUDS = "aesthetics-by-clouds" as const;

describe("showcase state model", () => {
  const live = (site: typeof OWNLY | typeof CLOUDS): ShowcaseState =>
    showcaseReducer(showcaseReducer(initialShowcaseState, { type: "activate", site }), {
      type: "loaded",
      site,
    });

  it("activates through connecting to live", () => {
    const connecting = showcaseReducer(initialShowcaseState, {
      type: "activate",
      site: OWNLY,
    });
    expect(connecting).toMatchObject({ activeSite: OWNLY, phase: "connecting" });
    expect(showcaseReducer(connecting, { type: "loaded", site: OWNLY })).toMatchObject({
      activeSite: OWNLY,
      phase: "live",
    });
  });

  it("only ever holds one active site — activating the other takes over", () => {
    const takeover = showcaseReducer(live(OWNLY), { type: "activate", site: CLOUDS });
    expect(takeover.activeSite).toBe(CLOUDS);
    expect(takeover.phase).toBe("connecting");
  });

  it("ignores load events from a site that is not the active one", () => {
    const state = showcaseReducer(initialShowcaseState, {
      type: "activate",
      site: OWNLY,
    });
    expect(showcaseReducer(state, { type: "loaded", site: CLOUDS })).toBe(state);
  });

  it("ignores load echoes once live (in-embed navigations refire onLoad)", () => {
    const state = live(OWNLY);
    expect(showcaseReducer(state, { type: "loaded", site: OWNLY })).toBe(state);
  });

  it("restart bumps the frame nonce and reconnects", () => {
    const before = live(OWNLY);
    const restarted = showcaseReducer(before, { type: "restart", site: OWNLY });
    expect(restarted.frameNonce).toBe(before.frameNonce + 1);
    expect(restarted.phase).toBe("connecting");
    // A restart aimed at the inactive site is a no-op.
    expect(showcaseReducer(before, { type: "restart", site: CLOUDS })).toBe(before);
  });

  it("every activation is a fresh connect attempt (nonce identity)", () => {
    const first = showcaseReducer(initialShowcaseState, {
      type: "activate",
      site: OWNLY,
    });
    const reactivated = showcaseReducer(showcaseReducer(first, { type: "standby" }), {
      type: "activate",
      site: OWNLY,
    });
    expect(reactivated.frameNonce).toBe(first.frameNonce + 1);
  });

  it("standby and idle-timeout both deactivate; only the timeout marks the pause", () => {
    expect(showcaseReducer(live(OWNLY), { type: "standby" })).toMatchObject({
      activeSite: null,
      phase: "idle",
      idlePaused: false,
    });
    expect(showcaseReducer(live(OWNLY), { type: "idle-timeout" })).toMatchObject({
      activeSite: null,
      phase: "idle",
      idlePaused: true,
    });
    // Reactivation clears the pause marker.
    expect(
      showcaseReducer(showcaseReducer(live(OWNLY), { type: "idle-timeout" }), {
        type: "activate",
        site: OWNLY,
      }).idlePaused,
    ).toBe(false);
  });

  it("moving the journey to the other project releases the live embed", () => {
    expect(
      showcaseReducer(live(OWNLY), { type: "scene-change", site: CLOUDS }),
    ).toMatchObject({ activeSite: null, phase: "idle" });
    // Staying on the active project changes nothing.
    const state = live(OWNLY);
    expect(showcaseReducer(state, { type: "scene-change", site: OWNLY })).toBe(state);
  });

  it("entering the mobile class deactivates; desktop↔tablet keeps the session", () => {
    expect(
      showcaseReducer(live(CLOUDS), { type: "device-class", deviceClass: "mobile" }),
    ).toMatchObject({ activeSite: null, phase: "idle" });
    const state = live(CLOUDS);
    expect(
      showcaseReducer(state, { type: "device-class", deviceClass: "tablet" }),
    ).toBe(state);
    expect(
      showcaseReducer(state, { type: "device-class", deviceClass: "desktop" }),
    ).toBe(state);
  });

  it("gives embeds a logical viewport inside each host class's intended band", () => {
    // Both demo sites switch to their desktop layout at 1024px and use the
    // 768–1023px band for tablet — the fixed logical widths must land safely
    // inside those bands so the embedded breakpoint never depends on the
    // host container's width.
    expect(EMBED_VIEWPORT_WIDTH.desktop).toBeGreaterThanOrEqual(1024);
    expect(EMBED_VIEWPORT_WIDTH.tablet).toBeGreaterThanOrEqual(768);
    expect(EMBED_VIEWPORT_WIDTH.tablet).toBeLessThan(1024);
  });
});

describe("showcase inactivity deactivation", () => {
  let section: HTMLElement;
  let frameHolder: HTMLDivElement;
  let frame: HTMLIFrameElement;
  let onTimeout: ReturnType<typeof vi.fn<() => void>>;

  const renderIdleHook = (active = true) =>
    renderHook(
      ({ isActive }: { isActive: boolean }) =>
        useShowcaseIdleTimeout({
          active: isActive,
          sectionRef: { current: section },
          frameHolderRef: { current: frameHolder },
          onTimeout,
        }),
      { initialProps: { isActive: active } },
    );

  beforeEach(() => {
    vi.useFakeTimers();
    onTimeout = vi.fn();
    section = document.createElement("section");
    frameHolder = document.createElement("div");
    frame = document.createElement("iframe");
    frameHolder.appendChild(frame);
    section.appendChild(frameHolder);
    document.body.appendChild(section);
  });

  afterEach(() => {
    vi.useRealTimers();
    section.remove();
  });

  it("deactivates after the idle window with no observable activity", () => {
    renderIdleHook();
    vi.advanceTimersByTime(SHOWCASE_IDLE_TIMEOUT_MS - 1);
    expect(onTimeout).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it("observable activity inside the section resets the countdown", () => {
    renderIdleHook();
    vi.advanceTimersByTime(SHOWCASE_IDLE_TIMEOUT_MS - 1000);
    section.dispatchEvent(new Event("pointermove", { bubbles: true }));
    vi.advanceTimersByTime(SHOWCASE_IDLE_TIMEOUT_MS - 1000);
    expect(onTimeout).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it("suspends while focus is inside the embed and re-arms when it returns", () => {
    renderIdleHook();
    // Clicking into a cross-origin iframe blurs the window with the frame as
    // the active element.
    frame.tabIndex = 0;
    frame.focus();
    window.dispatchEvent(new Event("blur"));
    vi.advanceTimersByTime(SHOWCASE_IDLE_TIMEOUT_MS * 3);
    expect(onTimeout).not.toHaveBeenCalled();
    window.dispatchEvent(new Event("focus"));
    vi.advanceTimersByTime(SHOWCASE_IDLE_TIMEOUT_MS);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it("re-arms instead of firing while the pointer rests over the frame", () => {
    frameHolder.matches = (selector: string) => selector === ":hover";
    renderIdleHook();
    vi.advanceTimersByTime(SHOWCASE_IDLE_TIMEOUT_MS);
    expect(onTimeout).not.toHaveBeenCalled();
    frameHolder.matches = () => false;
    vi.advanceTimersByTime(SHOWCASE_IDLE_TIMEOUT_MS);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it("clears the countdown when deactivated or unmounted — no stale firing", () => {
    const { rerender, unmount } = renderIdleHook();
    rerender({ isActive: false });
    vi.advanceTimersByTime(SHOWCASE_IDLE_TIMEOUT_MS * 2);
    expect(onTimeout).not.toHaveBeenCalled();
    rerender({ isActive: true });
    unmount();
    vi.advanceTimersByTime(SHOWCASE_IDLE_TIMEOUT_MS * 2);
    expect(onTimeout).not.toHaveBeenCalled();
  });
});
