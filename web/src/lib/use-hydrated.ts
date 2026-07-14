import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * False during prerender and during the hydration render, true from the very
 * next render on. `useSyncExternalStore` is the sanctioned primitive for
 * this: React reads the server snapshot for the hydration pass — so the
 * first client render always matches the prerendered HTML — then re-renders
 * with the client snapshot as soon as hydration commits.
 *
 * Use it to defer client-only render inputs that static HTML cannot know.
 * The canonical case here is `location.hash`: prerendered pages are built
 * without one, so anything hash-dependent (gate-free deep links) must render
 * the hashless state first and adopt the hash immediately afterwards —
 * otherwise every `path#section` landing throws a hydration mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}
