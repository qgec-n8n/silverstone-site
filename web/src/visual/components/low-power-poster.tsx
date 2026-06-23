import "~/styles/visual/visual.css";

/**
 * Static platinum poster that always sits beneath the deferred WebGL signal
 * field. It is the source of truth and the fallback: shown on its own below
 * 1024px, under reduced-motion / low-power, while the shader loads, and after
 * a WebGL context loss.
 */
export function LowPowerPoster() {
  return <div className="ss-stage__poster" aria-hidden="true" />;
}
