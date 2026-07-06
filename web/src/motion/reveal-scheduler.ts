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

/** Two reveals within this vertical distance count as one row (left → right). */
const ROW_TOLERANCE_PX = 33;

/** Minimum spacing between two ordered starts in one batch. */
const ORDER_GAP_MS = 90;

/** How long an already-started entry keeps constraining newcomers. */
const RETENTION_MS = 260;

let entries: ScheduledEntry[] = [];

/**
 * Registers `element` for an entrance that wants to begin after
 * `requestedDelayMs`, and returns the effective delay (ms from now) that keeps
 * the top-to-bottom, then left-to-right order intact against every other
 * reveal scheduled moments before it.
 */
export function scheduleReveal(element: Element, requestedDelayMs: number): number {
  const now = performance.now();
  const rect = element.getBoundingClientRect();
  const top = rect.top + window.scrollY;
  const left = rect.left + window.scrollX;

  entries = entries.filter((entry) => entry.start > now - RETENTION_MS);

  let start = now + requestedDelayMs;
  for (const entry of entries) {
    const isAbove = entry.top < top - ROW_TOLERANCE_PX;
    const isLeftNeighbour =
      Math.abs(entry.top - top) <= ROW_TOLERANCE_PX && entry.left < left - 1;
    if ((isAbove || isLeftNeighbour) && entry.start + ORDER_GAP_MS > start) {
      start = entry.start + ORDER_GAP_MS;
    }
  }

  entries.push({ top, left, start });
  return Math.max(0, start - now);
}
