import { createElement, type ReactElement, type SVGProps } from "react";

export type LucideIcon = (
  props: SVGProps<SVGSVGElement> & { size?: number | string },
) => ReactElement;

type IconTag = "circle" | "ellipse" | "line" | "path" | "polyline" | "rect";
type IconNode = readonly [IconTag, Record<string, string>][];

function createIcon(displayName: string, nodes: IconNode): LucideIcon {
  const Icon = ({
    size = 24,
    strokeWidth = 2,
    color = "currentColor",
    className,
    ...props
  }: SVGProps<SVGSVGElement> & { size?: number | string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {nodes.map(([tag, attrs], index) =>
        createElement(tag, { key: attrs.key ?? String(index), ...attrs }),
      )}
    </svg>
  );
  Icon.displayName = displayName;
  return Icon;
}

export const ArrowRight = createIcon("ArrowRight", [
  ["path", { d: "M5 12h14" }],
  ["path", { d: "m12 5 7 7-7 7" }],
]);
export const ArrowUpRight = createIcon("ArrowUpRight", [
  ["path", { d: "M7 7h10v10" }],
  ["path", { d: "M7 17 17 7" }],
]);
export const CalendarCheck = createIcon("CalendarCheck", [
  ["path", { d: "M8 2v4" }],
  ["path", { d: "M16 2v4" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "m9 16 2 2 4-4" }],
]);
export const Check = createIcon("Check", [["path", { d: "M20 6 9 17l-5-5" }]]);
export const Diamond = createIcon("Diamond", [
  [
    "path",
    {
      d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z",
    },
  ],
]);
export const Gauge = createIcon("Gauge", [
  ["path", { d: "m12 14 4-4" }],
  ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0" }],
]);
export const Globe = createIcon("Globe", [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }],
  ["path", { d: "M2 12h20" }],
]);
export const Headset = createIcon("Headset", [
  [
    "path",
    {
      d: "M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z",
    },
  ],
  ["path", { d: "M21 16v2a4 4 0 0 1-4 4h-5" }],
]);
export const MapPin = createIcon("MapPin", [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
    },
  ],
  ["circle", { cx: "12", cy: "10", r: "3" }],
]);
export const PencilRuler = createIcon("PencilRuler", [
  [
    "path",
    {
      d: "M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13",
    },
  ],
  ["path", { d: "m8 6 2-2" }],
  ["path", { d: "m18 16 2-2" }],
  [
    "path",
    {
      d: "m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17",
    },
  ],
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
    },
  ],
  ["path", { d: "m15 5 4 4" }],
]);
export const PhoneCall = createIcon("PhoneCall", [
  [
    "path",
    {
      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
    },
  ],
  ["path", { d: "M14.05 2a9 9 0 0 1 8 7.94" }],
  ["path", { d: "M14.05 6A5 5 0 0 1 18 10" }],
]);
export const Plug = createIcon("Plug", [
  ["path", { d: "M12 22v-5" }],
  ["path", { d: "M9 8V2" }],
  ["path", { d: "M15 8V2" }],
  ["path", { d: "M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" }],
]);
export const Search = createIcon("Search", [
  ["circle", { cx: "11", cy: "11", r: "8" }],
  ["path", { d: "m21 21-4.3-4.3" }],
]);
export const ShieldCheck = createIcon("ShieldCheck", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
    },
  ],
  ["path", { d: "m9 12 2 2 4-4" }],
]);
export const Smartphone = createIcon("Smartphone", [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2" }],
  ["path", { d: "M12 18h.01" }],
]);
export const Sparkles = createIcon("Sparkles", [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
    },
  ],
  ["path", { d: "M20 3v4" }],
  ["path", { d: "M22 5h-4" }],
  ["path", { d: "M4 17v2" }],
  ["path", { d: "M5 18H3" }],
]);
export const TrendingUp = createIcon("TrendingUp", [
  ["polyline", { points: "22 7 13.5 15.5 8.5 10.5 2 17" }],
  ["polyline", { points: "16 7 22 7 22 13" }],
]);
export const Unlock = createIcon("Unlock", [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 9.9-1" }],
]);
export const UserCheck = createIcon("UserCheck", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
  ["circle", { cx: "9", cy: "7", r: "4" }],
  ["polyline", { points: "16 11 18 13 22 9" }],
]);
export const Workflow = createIcon("Workflow", [
  ["rect", { width: "8", height: "8", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M7 11v4a2 2 0 0 0 2 2h4" }],
  ["rect", { width: "8", height: "8", x: "13", y: "13", rx: "2" }],
]);
export const Zap = createIcon("Zap", [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
    },
  ],
]);
export const ChevronDown = createIcon("ChevronDown", [["path", { d: "m6 9 6 6 6-6" }]]);
export const X = createIcon("X", [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
]);
export const ChevronRight = createIcon("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6" }],
]);
export const MoreHorizontal = createIcon("MoreHorizontal", [
  ["circle", { cx: "12", cy: "12", r: "1" }],
  ["circle", { cx: "19", cy: "12", r: "1" }],
  ["circle", { cx: "5", cy: "12", r: "1" }],
]);
export const AlertCircleIcon = createIcon("AlertCircleIcon", [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }],
]);
export const CheckCircle2Icon = createIcon("CheckCircle2Icon", [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "m9 12 2 2 4-4" }],
]);
export const InfoIcon = createIcon("InfoIcon", [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M12 16v-4" }],
  ["path", { d: "M12 8h.01" }],
]);
export const TriangleAlertIcon = createIcon("TriangleAlertIcon", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
    },
  ],
  ["path", { d: "M12 9v4" }],
  ["path", { d: "M12 17h.01" }],
]);
export const RotateCcw = createIcon("RotateCcw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
  ["path", { d: "M3 3v5h5" }],
]);
export const MenuIcon = createIcon("MenuIcon", [
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12" }],
  ["line", { x1: "4", x2: "20", y1: "6", y2: "6" }],
  ["line", { x1: "4", x2: "20", y1: "18", y2: "18" }],
]);
export const Menu = createIcon("Menu", [
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12" }],
  ["line", { x1: "4", x2: "20", y1: "6", y2: "6" }],
  ["line", { x1: "4", x2: "20", y1: "18", y2: "18" }],
]);
export const MessageSquare = createIcon("MessageSquare", [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }],
]);
export const Activity = createIcon("Activity", [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
    },
  ],
]);
export const GitBranch = createIcon("GitBranch", [
  ["line", { x1: "6", x2: "6", y1: "3", y2: "15" }],
  ["circle", { cx: "18", cy: "6", r: "3" }],
  ["circle", { cx: "6", cy: "18", r: "3" }],
  ["path", { d: "M18 9a9 9 0 0 1-9 9" }],
]);
export const Target = createIcon("Target", [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["circle", { cx: "12", cy: "12", r: "6" }],
  ["circle", { cx: "12", cy: "12", r: "2" }],
]);
export const FileText = createIcon("FileText", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M10 9H8" }],
  ["path", { d: "M16 13H8" }],
  ["path", { d: "M16 17H8" }],
]);
export const Share2 = createIcon("Share2", [
  ["circle", { cx: "18", cy: "5", r: "3" }],
  ["circle", { cx: "6", cy: "12", r: "3" }],
  ["circle", { cx: "18", cy: "19", r: "3" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49" }],
]);
export const Layers = createIcon("Layers", [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",
    },
  ],
  [
    "path",
    {
      d: "M22 17.65a1 1 0 0 1-.6.91l-8.58 3.9a2 2 0 0 1-1.66 0L2.6 18.56a1 1 0 0 1-.6-.91",
    },
  ],
  [
    "path",
    {
      d: "M22 12.65a1 1 0 0 1-.6.91l-8.58 3.9a2 2 0 0 1-1.66 0L2.6 13.56a1 1 0 0 1-.6-.91",
    },
  ],
]);
export const Database = createIcon("Database", [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12" }],
]);
export const Bot = createIcon("Bot", [
  ["path", { d: "M12 8V4H8" }],
  ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }],
  ["path", { d: "M2 14h2" }],
  ["path", { d: "M20 14h2" }],
  ["path", { d: "M15 13v2" }],
  ["path", { d: "M9 13v2" }],
]);
