/*
  Silverstone "Operating-system constellation" — the home hero signature.
  Six capability nodes orbiting one central human-control ring, with three
  luminous signal routes that draw once on reveal and three structural
  connections that are present from the start.

  Authored ONCE here and injected as inline SVG (required so the CSS-driven
  reveal can target individual nodes/paths). Single source of truth for the
  static prototype; the React handoff mirrors this geometry in TSX.
*/

// Machined Signal icons, drawn in a 0..30 coordinate space.
// Each has exactly one luminous signal segment (ss-icon-signal / ss-icon-node).
const ICONS = {
  web: `
    <rect class="ss-icon-stroke" x="4" y="6" width="22" height="18" rx="2.5"/>
    <line class="ss-icon-stroke" x1="4" y1="11" x2="26" y2="11"/>
    <path class="ss-icon-signal" d="M8 20 L13 16 L18 19 L22 14"/>
    <circle class="ss-icon-node" cx="22" cy="14" r="1.8"/>`,
  app: `
    <rect class="ss-icon-stroke" x="9" y="4" width="17" height="13" rx="2.5"/>
    <rect class="ss-icon-signal" x="4" y="11" width="17" height="15" rx="2.5"/>
    <circle class="ss-icon-node" cx="8" cy="15" r="1.7"/>`,
  content: `
    <rect class="ss-icon-stroke" x="3" y="12" width="8" height="8" rx="1.6"/>
    <path class="ss-icon-stroke" d="M11 16 H16 C20 16 20 8 25 8"/>
    <path class="ss-icon-signal" d="M16 16 C20 16 20 24 25 24"/>
    <circle class="ss-icon-stroke" cx="25" cy="8" r="1.7"/>
    <circle class="ss-icon-node" cx="25" cy="24" r="1.9"/>`,
  voice: `
    <path class="ss-icon-stroke" d="M6 12 V18"/>
    <path class="ss-icon-stroke" d="M10 9 V21"/>
    <path class="ss-icon-signal" d="M14 5 V25"/>
    <path class="ss-icon-stroke" d="M18 10 V20"/>
    <path class="ss-icon-stroke" d="M22 8 H26 V22 H22"/>
    <circle class="ss-icon-node" cx="14" cy="5" r="1.8"/>`,
  reception: `
    <path class="ss-icon-stroke" d="M4 8 L14 15"/>
    <path class="ss-icon-stroke" d="M4 15 H13"/>
    <path class="ss-icon-stroke" d="M4 22 L14 15"/>
    <circle class="ss-icon-stroke" cx="14" cy="15" r="2.2"/>
    <path class="ss-icon-signal" d="M16.2 15 H25"/>
    <circle class="ss-icon-node" cx="25" cy="15" r="2"/>`,
  automation: `
    <circle class="ss-icon-stroke" cx="6" cy="21" r="2.4"/>
    <circle class="ss-icon-stroke" cx="15" cy="21" r="2.4"/>
    <circle class="ss-icon-stroke" cx="24" cy="21" r="2.4"/>
    <path class="ss-icon-stroke" d="M8.6 21 H12.4"/>
    <path class="ss-icon-stroke" d="M17.6 21 H21.4"/>
    <path class="ss-icon-signal" d="M24 18.4 C24 9 15 9 15 18.2"/>
    <circle class="ss-icon-node" cx="15" cy="18.4" r="1.7"/>`,
};

// Node tiles (132 x 96), centred on cx/cy, orbiting the ring at (340, 300).
const NODES = [
  { key: "web", label: "Web", caption: "Sites & funnels", cx: 180, cy: 150 },
  { key: "app", label: "App", caption: "Products", cx: 500, cy: 150 },
  { key: "content", label: "Content", caption: "Editorial engine", cx: 120, cy: 300 },
  { key: "automation", label: "Automation", caption: "Workflows", cx: 560, cy: 300 },
  { key: "voice", label: "Voice", caption: "Voice agents", cx: 220, cy: 452 },
  { key: "reception", label: "Reception", caption: "Front desk", cx: 460, cy: 452 },
];

// Three luminous signal routes (drawn once) + three structural connections.
const SIGNAL_PATHS = [
  { d: "M286 249 Q230 205 180 192", variant: "" },
  { d: "M414 300 Q460 300 500 300", variant: "" },
  { d: "M386 358 Q428 392 456 404", variant: "violet" },
];
const STRUCT_PATHS = [
  "M394 249 Q450 205 500 192",
  "M266 300 H186",
  "M294 358 Q252 392 224 404",
];

// Ring perimeter ports pointing at each node.
const PORTS = [
  [286, 249],
  [394, 249],
  [266, 300],
  [414, 300],
  [294, 358],
  [386, 358],
];

function nodeMarkup(node) {
  const tileX = node.cx - 66;
  const tileY = node.cy - 48;
  const iconX = node.cx - 20;
  const iconY = tileY + 14;
  return `
    <g class="ss-node">
      <rect class="ss-node-tile" x="${tileX}" y="${tileY}" width="132" height="96" rx="14"/>
      <svg x="${iconX}" y="${iconY}" width="40" height="40" viewBox="0 0 30 30">${ICONS[node.key]}</svg>
      <circle class="ss-node-glow" cx="${node.cx + 44}" cy="${tileY + 16}" r="3"/>
      <text class="ss-node-label" x="${node.cx}" y="${tileY + 70}" text-anchor="middle">${node.label}</text>
      <text class="ss-node-caption" x="${node.cx}" y="${tileY + 85}" text-anchor="middle">${node.caption}</text>
    </g>`;
}

export const CONSTELLATION_SVG = `
<svg class="ss-stage__diagram" viewBox="0 0 680 560" role="img"
     aria-labelledby="ssConstTitle ssConstDesc" preserveAspectRatio="xMidYMid meet">
  <title id="ssConstTitle">Silverstone operating-system constellation</title>
  <desc id="ssConstDesc">Six capability nodes — web, app, content, automation, voice and reception — connected to one central human-control ring.</desc>

  <g class="ss-struct">
    ${STRUCT_PATHS.map((d) => `<path class="ss-struct-line" d="${d}"/>`).join("")}
  </g>

  ${SIGNAL_PATHS.map(
    (p) => `<path class="ss-link-path ${p.variant ? "ss-link-path--" + p.variant : ""}" d="${p.d}"/>`,
  ).join("")}

  <g class="ss-control-ring">
    <circle class="ss-ring-plate" cx="340" cy="300" r="74"/>
    <circle class="ss-ring-dash" cx="340" cy="300" r="56"/>
    ${PORTS.map(([x, y]) => `<circle class="ss-ring-port" cx="${x}" cy="${y}" r="3"/>`).join("")}
    <text class="ss-ring-caption" x="340" y="280">YOU DECIDE</text>
    <text class="ss-ring-label" x="340" y="300">HUMAN</text>
    <text class="ss-ring-label" x="340" y="316">CONTROL</text>
  </g>

  <g class="ss-nodes">
    ${NODES.map(nodeMarkup).join("")}
  </g>
</svg>`;

export function renderConstellation(target) {
  if (target) target.innerHTML = CONSTELLATION_SVG;
}
