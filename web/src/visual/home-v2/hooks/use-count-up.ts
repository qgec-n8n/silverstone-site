import { useEffect, useRef, useState } from "react";

type UseCountUpInput = {
  /** Final numeric target. */
  value: number;
  /** Optional lower bound the counter starts from. */
  from?: number;
  /** When false (reduced motion / minimal tier) the final value is shown at once. */
  enabled: boolean;
  /** Begin animating only once the section is in view. */
  active: boolean;
  durationMs?: number;
  decimals?: number;
};

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/**
 * Animated count-up that respects the motion policy. When `enabled` is false the
 * hook returns the final value immediately and never schedules a frame. State is
 * only written inside the rAF callback — never synchronously in the effect body —
 * which keeps it clear of the react-hooks set-state-in-effect rule.
 *
 * The initial state is always the final `value`, never `from`: the prerendered
 * HTML is what non-rendering crawlers (GPTBot, ClaudeBot, PerplexityBot,
 * OAI-SearchBot) store, and a counter that starts at zero ships "0 hrs" and
 * "0%" as the page's facts. The client resets to `from` inside the first
 * animation frame, so the visible count-up is unchanged.
 */
export function useCountUp({
  value,
  from = 0,
  enabled,
  active,
  durationMs = 1800,
  decimals = 0,
}: UseCountUpInput): number {
  const [display, setDisplay] = useState(value);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!enabled || !active) {
      return undefined;
    }

    const start = performance.now();
    const span = value - from;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = from + span * easeOutCubic(progress);
      const factor = Math.pow(10, decimals);
      setDisplay(Math.round(eased * factor) / factor);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [enabled, active, value, from, durationMs, decimals]);

  return enabled ? display : value;
}
