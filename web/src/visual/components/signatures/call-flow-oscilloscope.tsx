import "~/styles/visual/visual.css";

/**
 * AI voice agents signature — a call-flow oscilloscope tracing one deterministic
 * path from greeting to a human hand-off.
 */
export function CallFlowOscilloscope() {
  return (
    <svg
      className="ss-vsig"
      viewBox="0 0 240 160"
      role="img"
      aria-labelledby="vsigScopeTitle vsigScopeDesc"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="vsigScopeTitle">Call-flow oscilloscope</title>
      <desc id="vsigScopeDesc">
        A waveform stepping through greeting, intent, route and human hand-off phases.
      </desc>

      <line className="ss-vsig__baseline" x1="16" y1="92" x2="224" y2="92" />
      <path
        className="ss-vsig__wave"
        d="M16 92 H48 l8 -34 l10 60 l8 -42 H120 l8 -22 l10 40 l8 -30 H224"
      />

      <g className="ss-vsig__nodes">
        <circle className="ss-vsig__dot" cx="40" cy="92" r="4" />
        <circle className="ss-vsig__dot" cx="104" cy="92" r="4" />
        <circle className="ss-vsig__dot" cx="160" cy="92" r="4" />
        <circle className="ss-vsig__focus" cx="216" cy="92" r="6" />
      </g>

      <text className="ss-vsig__tick" x="40" y="118" textAnchor="middle">
        Greeting
      </text>
      <text className="ss-vsig__tick" x="104" y="118" textAnchor="middle">
        Intent
      </text>
      <text className="ss-vsig__tick" x="160" y="118" textAnchor="middle">
        Route
      </text>
      <text className="ss-vsig__tick" x="212" y="118" textAnchor="end">
        Human
      </text>
    </svg>
  );
}
