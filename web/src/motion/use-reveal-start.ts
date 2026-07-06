import { useEffect, useState, type RefObject } from "react";

import { scheduleReveal } from "./reveal-scheduler";

/**
 * Resolves the moment a reveal may begin. Pass `ready = true` once the
 * element's own trigger conditions are met (in view, images loaded, …); the
 * hook then reserves a slot with the global reveal scheduler exactly once and
 * returns the effective delay in milliseconds. `null` means "not yet
 * scheduled — hold the hidden state".
 */
export function useRevealStart(
  ref: RefObject<Element | null>,
  ready: boolean,
  delayMs: number,
): number | null {
  const [effectiveDelayMs, setEffectiveDelayMs] = useState<number | null>(null);

  useEffect(() => {
    if (!ready || effectiveDelayMs !== null || !ref.current) {
      return;
    }
    setEffectiveDelayMs(scheduleReveal(ref.current, delayMs));
  }, [ready, effectiveDelayMs, delayMs, ref]);

  return effectiveDelayMs;
}
