import "~/styles/visual/visual.css";

/**
 * AI automation signature — a process lattice where a flagged exception breaks
 * from the automated path up to a human-control ring.
 */
export function ProcessLattice() {
  const nodes: { x: number; y: number }[] = [
    { x: 40, y: 48 },
    { x: 100, y: 48 },
    { x: 160, y: 48 },
    { x: 40, y: 112 },
    { x: 100, y: 112 },
    { x: 160, y: 112 },
  ];

  return (
    <svg
      className="ss-vsig"
      viewBox="0 0 240 160"
      role="img"
      aria-labelledby="vsigLatticeTitle vsigLatticeDesc"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="vsigLatticeTitle">Process lattice</title>
      <desc id="vsigLatticeDesc">
        A lattice of automated steps with one flagged exception routed up to human control.
      </desc>

      <g className="ss-vsig__struct">
        <path className="ss-vsig__warp" d="M40 48 H160 M40 112 H160" />
        <path className="ss-vsig__warp" d="M40 48 V112 M100 48 V112 M160 48 V112" />
      </g>

      <path className="ss-vsig__signal" d="M40 48 H100 H160" />
      <path className="ss-vsig__signal ss-vsig__signal--alt" d="M100 112 L200 64" />

      <g className="ss-vsig__nodes">
        {nodes.map((node) => (
          <circle
            key={`lattice-${String(node.x)}-${String(node.y)}`}
            className="ss-vsig__dot"
            cx={node.x}
            cy={node.y}
            r="5"
          />
        ))}
        <circle className="ss-vsig__alert" cx="100" cy="112" r="6" />
      </g>

      <circle className="ss-vsig__hub" cx="208" cy="60" r="16" />
      <text className="ss-vsig__label" x="208" y="40" textAnchor="middle">
        Human
      </text>
    </svg>
  );
}
