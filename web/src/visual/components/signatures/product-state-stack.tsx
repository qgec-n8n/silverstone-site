import "~/styles/visual/visual.css";

/**
 * Custom app development signature — a stack of product states (draft → active
 * → synced) threaded by one state spine, expressing real state over screens.
 */
export function ProductStateStack() {
  return (
    <svg
      className="ss-vsig"
      viewBox="0 0 240 160"
      role="img"
      aria-labelledby="vsigStackTitle vsigStackDesc"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="vsigStackTitle">Product-state stack</title>
      <desc id="vsigStackDesc">
        Three stacked state layers — draft, active and synced — joined by a single state spine.
      </desc>

      <line className="ss-vsig__spine" x1="48" y1="34" x2="48" y2="128" />

      <g className="ss-vsig__layer">
        <rect className="ss-vsig__plate" x="40" y="26" width="160" height="30" rx="8" />
        <circle className="ss-vsig__dot" cx="48" cy="41" r="5" />
        <text className="ss-vsig__label" x="66" y="45">
          Draft
        </text>
      </g>
      <g className="ss-vsig__layer">
        <rect className="ss-vsig__plate ss-vsig__plate--active" x="40" y="65" width="160" height="30" rx="8" />
        <circle className="ss-vsig__focus" cx="48" cy="80" r="5" />
        <text className="ss-vsig__label" x="66" y="84">
          Active
        </text>
      </g>
      <g className="ss-vsig__layer">
        <rect className="ss-vsig__plate" x="40" y="104" width="160" height="30" rx="8" />
        <circle className="ss-vsig__dot" cx="48" cy="119" r="5" />
        <text className="ss-vsig__label" x="66" y="123">
          Synced
        </text>
        <path className="ss-vsig__signal" d="M176 119 l6 6 l10 -14" />
      </g>
    </svg>
  );
}
