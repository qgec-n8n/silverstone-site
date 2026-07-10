import { useEffect, useState, type RefObject } from "react";

import { isRevealBypassActive } from "./reveal-bypass";
import { scheduleReveal } from "./reveal-scheduler";

export type RevealStart = {
  /** Effective delay before the entrance may begin, in milliseconds. */
  delayMs: number;
  /** Multiplier for the entrance duration, compressed during fast scrolling. */
  durationScale: number;
  /**
   * True when the reveal fired inside a deep-link landing window (see
   * `~/motion/reveal-bypass`): render the shown state immediately, with no
   * entrance animation at all.
   */
  instant: boolean;
};

/**
 * Resolves the moment a reveal may begin. Pass `ready = true` once the
 * element's own trigger conditions are met (in view, images loaded, …); the
 * hook then reserves a slot with the global reveal scheduler exactly once and
 * returns the effective start. `null` means "not yet scheduled — hold the
 * hidden state". Reveals triggered during a deep-link landing window resolve
 * as `instant` and skip the scheduler entirely, so they neither wait for nor
 * hold back other entrances.
 *
 * Reveals inside a section a deep link has landed on (`data-reveal-bypass`,
 * stamped by the deep-link scroll handler) are instant permanently, not just
 * during the timed window: a linked-to section must read as simply *there* in
 * its entirety — including the parts below the fold that only trigger once
 * the visitor scrolls within it after the window has closed.
 */
function resolveRevealStart(element: Element, delayMs: number): RevealStart {
  if (isRevealBypassActive() || element.closest("[data-reveal-bypass]") !== null) {
    return { delayMs: 0, durationScale: 0, instant: true };
  }
  return { ...scheduleReveal(element, delayMs), instant: false };
}

export function useRevealStart(
  ref: RefObject<Element | null>,
  ready: boolean,
  delayMs: number,
): RevealStart | null {
  const [start, setStart] = useState<RevealStart | null>(null);

  useEffect(() => {
    if (!ready || start !== null || !ref.current) {
      return;
    }
    setStart(resolveRevealStart(ref.current, delayMs));
  }, [ready, start, delayMs, ref]);

  return start;
}
