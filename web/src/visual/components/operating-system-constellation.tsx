import "~/styles/visual/visual.css";

import {
  ICON_PATHS,
  type MachinedSignalIconName,
} from "~/visual/icons/machined-signal-icons";

type ConstellationNodeData = {
  key: MachinedSignalIconName;
  label: string;
  caption: string;
  cx: number;
  cy: number;
};

type SignalPath = {
  d: string;
  variant: "" | "violet";
};

// Six capability nodes (132x96 tiles) orbiting the central human-control ring
// at (340, 300) inside a 680x560 viewBox. Geometry mirrors the prototype.
const NODES: ConstellationNodeData[] = [
  { key: "web", label: "Web", caption: "Sites & funnels", cx: 180, cy: 150 },
  { key: "app", label: "App", caption: "Products", cx: 500, cy: 150 },
  { key: "content", label: "Content", caption: "Editorial engine", cx: 120, cy: 300 },
  { key: "automation", label: "Automation", caption: "Workflows", cx: 560, cy: 300 },
  { key: "voice", label: "Voice", caption: "Voice agents", cx: 220, cy: 452 },
  { key: "reception", label: "Reception", caption: "Front desk", cx: 460, cy: 452 },
];

const SIGNAL_PATHS: SignalPath[] = [
  { d: "M286 249 Q230 205 180 192", variant: "" },
  { d: "M414 300 Q460 300 500 300", variant: "" },
  { d: "M386 358 Q428 392 456 404", variant: "violet" },
];

const STRUCT_PATHS = [
  "M394 249 Q450 205 500 192",
  "M266 300 H186",
  "M294 358 Q252 392 224 404",
];

const PORTS: [number, number][] = [
  [286, 249],
  [394, 249],
  [266, 300],
  [414, 300],
  [294, 358],
  [386, 358],
];

function ConstellationNode({ node }: { node: ConstellationNodeData }) {
  const tileX = node.cx - 66;
  const tileY = node.cy - 48;
  const iconX = node.cx - 20;
  const iconY = tileY + 14;

  return (
    <g className="ss-node">
      <rect
        className="ss-node-tile"
        x={tileX}
        y={tileY}
        width={132}
        height={96}
        rx={14}
      />
      <svg x={iconX} y={iconY} width={40} height={40} viewBox="0 0 30 30">
        {ICON_PATHS[node.key]}
      </svg>
      <circle className="ss-node-glow" cx={node.cx + 44} cy={tileY + 16} r={3} />
      <text className="ss-node-label" x={node.cx} y={tileY + 70} textAnchor="middle">
        {node.label}
      </text>
      <text className="ss-node-caption" x={node.cx} y={tileY + 85} textAnchor="middle">
        {node.caption}
      </text>
    </g>
  );
}

/**
 * The operating-system constellation — the home hero signature. Six capability
 * nodes connected to a single human-control ring by luminous signal routes and
 * structural lines. Pure inline SVG so individual nodes/paths remain styleable.
 */
export function OperatingSystemConstellation() {
  return (
    <svg
      className="ss-stage__diagram"
      viewBox="0 0 680 560"
      role="img"
      aria-labelledby="ssConstTitle ssConstDesc"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="ssConstTitle">Silverstone operating-system constellation</title>
      <desc id="ssConstDesc">
        Six capability nodes — web, app, content, automation, voice and reception —
        connected to one central human-control ring.
      </desc>

      <g className="ss-struct">
        {STRUCT_PATHS.map((d) => (
          <path key={d} className="ss-struct-line" d={d} />
        ))}
      </g>

      {SIGNAL_PATHS.map((path) => (
        <path
          key={path.d}
          className={
            path.variant === "violet"
              ? "ss-link-path ss-link-path--violet"
              : "ss-link-path"
          }
          d={path.d}
        />
      ))}

      <g className="ss-control-ring">
        <circle className="ss-ring-plate" cx={340} cy={300} r={74} />
        <circle className="ss-ring-dash" cx={340} cy={300} r={56} />
        {PORTS.map(([x, y]) => (
          <circle
            key={`${String(x)}-${String(y)}`}
            className="ss-ring-port"
            cx={x}
            cy={y}
            r={3}
          />
        ))}
        <text className="ss-ring-caption" x={340} y={280}>
          YOU DECIDE
        </text>
        <text className="ss-ring-label" x={340} y={300}>
          HUMAN
        </text>
        <text className="ss-ring-label" x={340} y={316}>
          CONTROL
        </text>
      </g>

      <g className="ss-nodes">
        {NODES.map((node) => (
          <ConstellationNode key={node.key} node={node} />
        ))}
      </g>
    </svg>
  );
}
