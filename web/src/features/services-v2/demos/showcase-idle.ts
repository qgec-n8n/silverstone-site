import { useEffect, useRef, type RefObject } from "react";

import { SHOWCASE_IDLE_TIMEOUT_MS } from "./showcase-state";

/**
 * Inactivity deactivation for a live showcase embed.
 *
 * A cross-origin iframe swallows every input event, so "activity" has to be
 * assembled from what the parent can observe:
 *
 * - Pointer, keyboard, touch, wheel and focus traffic anywhere inside the
 *   showcase section resets the countdown.
 * - Clicking into the embed blurs the parent window with the iframe as the
 *   active element — that *suspends* the countdown entirely, because from
 *   that moment the visitor may be typing into a booking form we cannot see.
 *   Focus returning to the parent window re-arms it.
 * - When the countdown does fire, it re-arms instead of deactivating if the
 *   pointer is still resting over the frame (`:hover` propagates to the
 *   iframe's ancestors even though events don't), so a visitor reading the
 *   embedded page mouse-still is never cut off.
 * - A hidden tab clears the countdown (nothing to time); it re-arms fresh
 *   when the tab becomes visible again.
 *
 * Everything tears down when `active` flips false or the component unmounts,
 * so restarts, project switches, standby and breakpoint changes can never
 * leak a timer or fire a stale callback.
 */
export function useShowcaseIdleTimeout({
  active,
  sectionRef,
  frameHolderRef,
  onTimeout,
}: {
  active: boolean;
  sectionRef: RefObject<HTMLElement | null>;
  frameHolderRef: RefObject<HTMLElement | null>;
  onTimeout: () => void;
}): void {
  const onTimeoutRef = useRef(onTimeout);
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!active || !section) {
      return undefined;
    }

    let timer: number | null = null;
    let engagedInFrame = false;

    const clear = () => {
      if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
      }
    };

    const fire = () => {
      timer = null;
      const holder = frameHolderRef.current;
      // Reading the embed without generating events keeps the pointer over
      // the frame or the focus inside it — treat both as activity.
      if (engagedInFrame || (holder?.matches(":hover") ?? false)) {
        arm();
        return;
      }
      onTimeoutRef.current();
    };

    const arm = () => {
      clear();
      timer = window.setTimeout(fire, SHOWCASE_IDLE_TIMEOUT_MS);
    };

    const reset = () => {
      if (!engagedInFrame && document.visibilityState !== "hidden") {
        arm();
      }
    };

    const onWindowBlur = () => {
      const holder = frameHolderRef.current;
      if (holder && document.activeElement && holder.contains(document.activeElement)) {
        engagedInFrame = true;
        clear();
      }
    };

    const onWindowFocus = () => {
      engagedInFrame = false;
      arm();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        clear();
      } else if (!engagedInFrame) {
        arm();
      }
    };

    const activityEvents = [
      "pointermove",
      "pointerdown",
      "keydown",
      "touchstart",
      "wheel",
      "focusin",
    ] as const;

    for (const name of activityEvents) {
      section.addEventListener(name, reset, { capture: true, passive: true });
    }
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("focus", onWindowFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    arm();

    return () => {
      clear();
      for (const name of activityEvents) {
        section.removeEventListener(name, reset, { capture: true });
      }
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("focus", onWindowFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [active, frameHolderRef, sectionRef]);
}
