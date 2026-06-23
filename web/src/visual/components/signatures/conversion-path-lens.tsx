import "~/styles/visual/visual.css";

/**
 * Web design & development signature — a focusing lens that draws scattered
 * visits inward to a single booked outcome.
 */
export function ConversionPathLens() {
  return (
    <svg
      className="ss-vsig"
      viewBox="0 0 240 160"
      role="img"
      aria-labelledby="vsigLensTitle vsigLensDesc"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="vsigLensTitle">Conversion-path lens</title>
      <desc id="vsigLensDesc">
        Concentric rings focusing scattered visitor points toward one booked outcome.
      </desc>

      <g className="ss-vsig__struct">
        <ellipse className="ss-vsig__ring" cx="120" cy="80" rx="98" ry="58" />
        <ellipse className="ss-vsig__ring" cx="120" cy="80" rx="66" ry="39" />
        <ellipse className="ss-vsig__ring" cx="120" cy="80" rx="34" ry="20" />
      </g>

      <g className="ss-vsig__nodes">
        <circle className="ss-vsig__dot" cx="24" cy="46" r="4" />
        <circle className="ss-vsig__dot" cx="20" cy="84" r="4" />
        <circle className="ss-vsig__dot" cx="32" cy="122" r="4" />
      </g>

      <path className="ss-vsig__signal" d="M24 84 Q92 58 120 80 T214 82" />
      <circle className="ss-vsig__focus" cx="120" cy="80" r="7" />
      <text className="ss-vsig__label" x="214" y="74" textAnchor="end">
        Booked
      </text>
    </svg>
  );
}
