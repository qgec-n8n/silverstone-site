import "~/styles/visual/visual.css";

/**
 * Content creation signature — an editorial loom weaving one source thread
 * across channels into a finished, on-brand row.
 */
export function EditorialLoom() {
  const warp = [40, 80, 120, 160, 200];
  const weft = [44, 72, 100];

  return (
    <svg
      className="ss-vsig"
      viewBox="0 0 240 160"
      role="img"
      aria-labelledby="vsigLoomTitle vsigLoomDesc"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="vsigLoomTitle">Editorial loom</title>
      <desc id="vsigLoomDesc">
        Vertical channel threads crossed by source rows, with one signal thread woven through.
      </desc>

      <g className="ss-vsig__struct">
        {warp.map((x) => (
          <line key={`warp-${String(x)}`} className="ss-vsig__warp" x1={x} y1="24" x2={x} y2="116" />
        ))}
        {weft.map((y) => (
          <line key={`weft-${String(y)}`} className="ss-vsig__weft" x1="28" y1={y} x2="212" y2={y} />
        ))}
      </g>

      <path className="ss-vsig__signal" d="M28 128 C70 128 70 44 120 44 C170 44 170 128 212 128" />
      <circle className="ss-vsig__dot" cx="28" cy="128" r="4" />
      <circle className="ss-vsig__focus" cx="212" cy="128" r="6" />
      <text className="ss-vsig__label" x="200" y="146" textAnchor="end">
        Published
      </text>
    </svg>
  );
}
