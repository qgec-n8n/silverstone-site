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

/* ---- Sibling grouping -------------------------------------------------------
 *
 * A container of items — a card grid, a gallery pair, a token row, a framed
 * panel's own grid — should arrive as one choreographed entrance the moment
 * its first item scrolls into view, rather than the reader discovering the
 * lower rows only by scrolling further and watching them trickle in one at a
 * time. Every scroll-triggered entrance on the site resolves its start through
 * this hook, so the grouping lives here: when a reveal's own trigger fires it
 * wakes every other registered reveal inside the same item container. Woken
 * reveals still reserve their slot with the global scheduler, so the
 * top-to-bottom, left-to-right order and the minimum gap between starts are
 * untouched — the group lands as a wave, never as a single pop.
 *
 * What counts as an item container is decided from the live layout, not from
 * a prop: the nearest grid/flex ancestor within a few levels (so a reveal
 * wrapped in a grid's `<li>` still finds the grid). Structural landmarks
 * (`main`, `section`, `article`, …) never qualify, nor does anything taller
 * than a few viewports, so a page column or a long section can never fire in
 * its entirety on load. `RevealGroup` remains the explicit form of the same
 * idea for containers that want it regardless of layout.
 */

type RevealEntry = { element: Element; wake: () => void };

const registry = new Set<RevealEntry>();

/** Landmarks and document scaffolding: never an item container. */
const STRUCTURAL_TAGS = new Set([
  "ARTICLE",
  "ASIDE",
  "BODY",
  "FOOTER",
  "HEADER",
  "HTML",
  "MAIN",
  "NAV",
  "SECTION",
]);

/** How many ancestors to climb looking for the grid/flex container. */
const GROUP_MAX_CLIMB = 3;

/**
 * A container taller than this many viewports is a page column or a long
 * section, not a set of items; waking it whole would reveal screens of content
 * nobody has scrolled to yet.
 */
const GROUP_MAX_VIEWPORTS = 4;

function isItemContainer(element: Element): boolean {
  if (STRUCTURAL_TAGS.has(element.tagName)) {
    return false;
  }
  const { display } = getComputedStyle(element);
  return (
    display === "grid" ||
    display === "inline-grid" ||
    display === "flex" ||
    display === "inline-flex"
  );
}

/**
 * The item container a reveal belongs to, or `null` when it sits in ordinary
 * flow (a heading above a grid, a paragraph in prose) and should keep firing
 * on its own.
 */
export function revealContainerOf(element: Element): Element | null {
  let node: Element = element;
  for (let climb = 0; climb < GROUP_MAX_CLIMB; climb += 1) {
    const parent = node.parentElement;
    if (!parent || STRUCTURAL_TAGS.has(parent.tagName)) {
      return null;
    }
    if (isItemContainer(parent)) {
      const height = parent.getBoundingClientRect().height;
      return height <= window.innerHeight * GROUP_MAX_VIEWPORTS ? parent : null;
    }
    node = parent;
  }
  return null;
}

/**
 * Wakes every registered reveal that shares `element`'s item container, so
 * the whole container enters together. Called once, when a reveal's own
 * trigger fires; woken reveals do not propagate (they share the container).
 */
export function wakeRevealSiblings(element: Element): void {
  const container = revealContainerOf(element);
  if (!container) {
    return;
  }
  for (const entry of registry) {
    if (entry.element !== element && container.contains(entry.element)) {
      entry.wake();
    }
  }
}

/** Test hook: the number of reveals currently registered for grouping. */
export function registeredRevealCount(): number {
  return registry.size;
}

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

/**
 * @param ref      The element the entrance plays on.
 * @param inView   The reveal's own trigger: it has scrolled into view (or
 *                 whatever the caller treats as "seen"). Firing it also wakes
 *                 the other reveals in the same item container.
 * @param delayMs  The requested stagger, a minimum the scheduler may extend.
 * @param loaded   An extra gate the entrance must wait for even when woken by
 *                 a sibling — an image reveal's "the image has decoded", so a
 *                 grouped gallery never plays its aperture on an empty frame.
 */
export function useRevealStart(
  ref: RefObject<Element | null>,
  inView: boolean,
  delayMs: number,
  loaded = true,
): RevealStart | null {
  const [start, setStart] = useState<RevealStart | null>(null);
  const [woken, setWoken] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }
    const entry: RevealEntry = {
      element,
      wake: () => {
        setWoken(true);
      },
    };
    registry.add(entry);
    return () => {
      registry.delete(entry);
    };
  }, [ref]);

  useEffect(() => {
    if (!inView || !ref.current) {
      return;
    }
    wakeRevealSiblings(ref.current);
  }, [inView, ref]);

  useEffect(() => {
    if (!(inView || woken) || !loaded || start !== null || !ref.current) {
      return;
    }
    setStart(resolveRevealStart(ref.current, delayMs));
  }, [inView, woken, loaded, start, delayMs, ref]);

  return start;
}
