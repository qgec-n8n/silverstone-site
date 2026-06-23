import "~/styles/visual/visual.css";

/**
 * Skeleton shown while a deferred visual module resolves. Announced politely
 * for assistive tech and reduced to a static block under reduced-motion.
 */
export function VisualLoadingFallback() {
  return (
    <div className="ss-skeleton" role="status" aria-live="polite">
      <span className="ss-skeleton__bar" />
      <span className="ss-skeleton__bar" />
      <span className="ss-skeleton__bar ss-skeleton__bar--short" />
      <span className="ss-sr-only">Loading visual experience…</span>
    </div>
  );
}
