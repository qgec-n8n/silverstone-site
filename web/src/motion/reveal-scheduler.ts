/**
 * Global reveal-order scheduler.
 *
 * Every scroll-triggered entrance fires independently via IntersectionObserver,
 * so under a fast scroll, an anchor jump, or a section short enough to enter
 * the viewport whole, several reveals fire within milliseconds of each other —
 * and their static stagger delays then decide the *visible* order, not their
 * position on the page. A lower element with a small delay would start before
 * an upper element with a large one.
 *
 * This module makes the document itself the source of truth: when a reveal is
 * ready to play, it registers its page position and receives a start time that
 * is never earlier than any recently scheduled reveal above it (or to its left
 * within the same row). Reveals that fire far apart in time are unaffected —
 * entries expire as soon as their start has passed — so slow scrolling keeps
 * the exact per-trigger timing the design was tuned around.
 */

type ScheduledEntry = {
  top: number;
  left: number;
  start: number;
};

export type RevealSchedule = {
  /** Effective delay before this entrance starts. */
  delayMs: number;
  /** Multiplier applied to the entrance duration (1 = normal pace). */
  durationScale: number;
};

/** Two reveals within this vertical distance count as one row (left → right). */
const ROW_TOLERANCE_PX = 33;

/** Minimum spacing between two ordered starts in one batch. */
const ORDER_GAP_MS = 90;

/** How long an already-started entry keeps constraining newcomers. */
const RETENTION_MS = 260;

/**
 * Fast native scrolling can move more than a quarter of a phone viewport
 * between two reveal triggers. Keeping the full cinematic delay/duration in
 * that case makes entrances finish well after the visitor has moved on. The
 * scheduler samples scroll position only when an IntersectionObserver-driven
 * reveal is already being scheduled — no scroll listener or per-frame work —
 * and briefly compresses the whole trigger batch when that movement is fast.
 */
const FAST_SCROLL_DURATION_SCALE = 0.58;
const FAST_SCROLL_MAX_SAMPLE_MS = 420;
const FAST_SCROLL_MIN_DISTANCE_PX = 160;
const FAST_SCROLL_MIN_VIEWPORT_FRACTION = 0.24;
const FAST_SCROLL_MIN_VELOCITY_PX_PER_MS = 1.1;
const FAST_SCROLL_LATCH_MS = 260;

let entries: ScheduledEntry[] = [];
let lastScrollSample: { at: number; y: number } | null = null;
let fastScrollUntil = 0;

function revealDurationScale(now: number, rect: DOMRect): number {
  const y = window.scrollY;
  const previous = lastScrollSample;

  // A fast wheel/touch gesture can carry the very first scheduled reveal well
  // past its normal lower-viewport trigger before IntersectionObserver runs.
  // Detect that overshoot so the first entrance in the batch is paced too,
  // even when there is no earlier scheduler sample on the current page.
  if (y > 0 && rect.bottom > 0 && rect.top < window.innerHeight * 0.48) {
    fastScrollUntil = now + FAST_SCROLL_LATCH_MS;
  }

  if (previous) {
    const elapsed = now - previous.at;
    const distance = Math.abs(y - previous.y);
    const distanceThreshold = Math.max(
      FAST_SCROLL_MIN_DISTANCE_PX,
      window.innerHeight * FAST_SCROLL_MIN_VIEWPORT_FRACTION,
    );
    if (
      elapsed > 0 &&
      elapsed <= FAST_SCROLL_MAX_SAMPLE_MS &&
      distance >= distanceThreshold &&
      distance / elapsed >= FAST_SCROLL_MIN_VELOCITY_PX_PER_MS
    ) {
      fastScrollUntil = now + FAST_SCROLL_LATCH_MS;
    }
  }

  lastScrollSample = { at: now, y };
  return now <= fastScrollUntil ? FAST_SCROLL_DURATION_SCALE : 1;
}

/**
 * Registers `element` for an entrance that wants to begin after
 * `requestedDelayMs`, and returns the effective delay (ms from now) that keeps
 * the top-to-bottom, then left-to-right order intact against every other
 * reveal scheduled moments before it.
 */
export function scheduleReveal(
  element: Element,
  requestedDelayMs: number,
): RevealSchedule {
  const now = performance.now();
  const rect = element.getBoundingClientRect();
  const top = rect.top + window.scrollY;
  const left = rect.left + window.scrollX;
  const durationScale = revealDurationScale(now, rect);

  entries = entries.filter((entry) => entry.start > now - RETENTION_MS);

  let start = now + requestedDelayMs * durationScale;
  for (const entry of entries) {
    const isAbove = entry.top < top - ROW_TOLERANCE_PX;
    const isLeftNeighbour =
      Math.abs(entry.top - top) <= ROW_TOLERANCE_PX && entry.left < left - 1;
    const orderedStart = entry.start + ORDER_GAP_MS * durationScale;
    if ((isAbove || isLeftNeighbour) && orderedStart > start) {
      start = orderedStart;
    }
  }

  entries.push({ top, left, start });
  return { delayMs: Math.max(0, start - now), durationScale };
}
