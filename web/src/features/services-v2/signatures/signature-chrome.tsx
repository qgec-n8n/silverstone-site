/**
 * Shared decorative frame for every signature panel: four corner brackets, a
 * slow scanning sweep and a faint instrument grid (added via CSS on
 * .ss-srv2-signature itself). This is the one deliberately identical layer
 * across all seven signatures — a consistent "premium instrument console"
 * frame — while each diagram inside keeps its own distinct concept and
 * animation language untouched.
 *
 * SignatureStatusBar and SignatureMetricStrip are the other shared pieces
 * every signature panel now uses: a live-status header and a footer of the
 * page's own verified benchmark figures (never invented numbers), so the
 * panel's top and bottom edges are always real content rather than empty
 * padding, whatever height the copy column next to it happens to need.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { AnimatedMetricValue, splitMetric } from "../components/primitives";

export function SignatureStatusBar({ label }: { label: string }) {
  return (
    <div className="ss-srv2-signature__status">
      <span className="ss-srv2-signature__status-id">
        <span className="ss-srv2-signature__status-dot" aria-hidden="true" />
        {label}
      </span>
      <span className="ss-srv2-signature__status-live">
        <span className="ss-srv2-signature__status-live-dot" aria-hidden="true" />
        Live
      </span>
    </div>
  );
}

export function SignatureMetricStrip({ metrics }: { metrics: string[] }) {
  return (
    <div className="ss-srv2-signature__metrics">
      {metrics.map((metric) => {
        const { value, label } = splitMetric(metric);
        return (
          <div className="ss-srv2-signature__metric" key={metric}>
            <span className="ss-srv2-signature__metric-value">
              <AnimatedMetricValue value={value} />
            </span>
            {label ? (
              <span className="ss-srv2-signature__metric-label">{label}</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function SignatureChrome() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div aria-hidden="true" className="ss-srv2-signature__chrome">
      <span className="ss-srv2-signature__corner" data-pos="tl" />
      <span className="ss-srv2-signature__corner" data-pos="tr" />
      <span className="ss-srv2-signature__corner" data-pos="bl" />
      <span className="ss-srv2-signature__corner" data-pos="br" />
      {reducedMotion ? null : (
        <m.div
          animate={{ top: "112%" }}
          className="ss-srv2-signature__scan"
          initial={{ top: "-12%" }}
          transition={{
            duration: 5.5,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 1.8,
          }}
        />
      )}
    </div>
  );
}
