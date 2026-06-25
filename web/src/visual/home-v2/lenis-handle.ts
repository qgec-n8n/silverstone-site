/**
 * Minimal handle that exposes the live Lenis instance owned by
 * {@link ScrollProvider} to imperative callers (e.g. the hero → body bridge)
 * without giving them a second scroll loop. The instance is registered on the
 * client only, inside the provider's effect, and cleared on teardown, so the
 * SSR/prerender path never touches it. When choreography is disabled (reduced
 * motion / minimal tier) the handle stays null and callers fall back to native
 * scrolling.
 */

export type ScrollHandleTarget = string | number | HTMLElement;

export type ScrollHandleOptions = {
  offset?: number;
  duration?: number;
};

export type ScrollHandle = {
  scrollTo: (target: ScrollHandleTarget, options?: ScrollHandleOptions) => void;
};

let activeHandle: ScrollHandle | null = null;

export function setScrollHandle(handle: ScrollHandle | null): void {
  activeHandle = handle;
}

export function getScrollHandle(): ScrollHandle | null {
  return activeHandle;
}
