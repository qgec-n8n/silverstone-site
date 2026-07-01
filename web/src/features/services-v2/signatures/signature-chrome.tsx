/**
 * Shared decorative frame for every signature panel: four corner brackets, a
 * slow scanning sweep and a faint instrument grid (added via CSS on
 * .ss-srv2-signature itself). This is the one deliberately identical layer
 * across all seven signatures — a consistent "premium instrument console"
 * frame — while each diagram inside keeps its own distinct concept and
 * animation language untouched.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

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
