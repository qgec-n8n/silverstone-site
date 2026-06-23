import "~/styles/visual/visual.css";

/**
 * AI receptionists signature — multiple inbound channels converging on one
 * front-desk node, then routed to a human.
 */
export function FrontDeskConvergence() {
  return (
    <svg
      className="ss-vsig"
      viewBox="0 0 240 160"
      role="img"
      aria-labelledby="vsigDeskTitle vsigDeskDesc"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="vsigDeskTitle">Front-desk convergence console</title>
      <desc id="vsigDeskDesc">
        Calls, chat and forms converging on one front-desk node before a human hand-off.
      </desc>

      <g className="ss-vsig__nodes">
        <circle className="ss-vsig__dot" cx="26" cy="36" r="4" />
        <circle className="ss-vsig__dot" cx="26" cy="80" r="4" />
        <circle className="ss-vsig__dot" cx="26" cy="124" r="4" />
      </g>
      <text className="ss-vsig__tick" x="36" y="40">
        Call
      </text>
      <text className="ss-vsig__tick" x="36" y="84">
        Chat
      </text>
      <text className="ss-vsig__tick" x="36" y="128">
        Form
      </text>

      <path className="ss-vsig__signal" d="M30 36 Q104 56 132 80" />
      <path className="ss-vsig__signal" d="M30 80 H132" />
      <path className="ss-vsig__signal" d="M30 124 Q104 104 132 80" />

      <circle className="ss-vsig__hub" cx="146" cy="80" r="16" />
      <path className="ss-vsig__signal" d="M162 80 H206" />
      <circle className="ss-vsig__focus" cx="214" cy="80" r="6" />
      <text className="ss-vsig__label" x="200" y="66" textAnchor="end">
        Human
      </text>
    </svg>
  );
}
