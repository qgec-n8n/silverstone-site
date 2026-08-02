import { lazy, type ComponentType } from "react";

/**
 * `React.lazy` with a `preload()` that actually removes the loading state.
 *
 * Why this exists: every route body on this site is a `lazy()` chunk behind a
 * Suspense fallback. On a client-side navigation the destination's chunk has
 * never been requested, so the boundary suspends and commits its fallback —
 * and React then holds that fallback for a MINIMUM of 300ms
 * (`FALLBACK_THROTTLE_MS` in react-dom) even once the chunk has arrived. The
 * visitor sees the route's bare hero title, then ~300ms later the real page
 * replacing it: one navigation that reads as two loads.
 *
 * Warming the module cache ahead of time does not help on its own. React's
 * `lazyInitializer` always takes the suspending path the first time it runs,
 * even when the importer returns an already-resolved promise (it only marks
 * the payload resolved from a `.then` callback, i.e. a microtask too late).
 *
 * So `preload()` resolves the module into a local slot instead, and the
 * component renders the real composition DIRECTLY when that slot is filled —
 * no Suspense boundary is entered, so no fallback is ever committed and no
 * throttle is paid. Un-preloaded renders fall through to a plain `lazy()`,
 * keeping prerender, hydration and cold-load behaviour exactly as before.
 */
type Preloadable<P extends object> = ComponentType<P> & { preload: () => void };

export function preloadableComponent<P extends object>(
  load: () => Promise<{ default: ComponentType<P> }>,
): Preloadable<P> {
  const Lazy = lazy(load);
  let resolved: ComponentType<P> | null = null;
  let started: Promise<void> | null = null;
  /*
   * Once a render has gone through `Lazy`, keep going through it. Swapping
   * element type mid-life would remount the whole route body for no gain —
   * and it is not needed: `Lazy`'s payload is resolved after that first
   * render, so every later visit renders synchronously anyway.
   */
  let usedLazy = false;

  function Preloadable(props: P) {
    if (resolved && !usedLazy) {
      const Resolved = resolved;
      return <Resolved {...props} />;
    }
    usedLazy = true;
    return <Lazy {...props} />;
  }

  Preloadable.preload = () => {
    started ??= load().then(
      (module) => {
        resolved = module.default;
      },
      () => {
        // A failed preload is not an error state: the render path still goes
        // through `lazy()`, which surfaces the failure through the route's own
        // error boundary at the moment it is actually needed.
      },
    );
  };

  return Preloadable as Preloadable<P>;
}
