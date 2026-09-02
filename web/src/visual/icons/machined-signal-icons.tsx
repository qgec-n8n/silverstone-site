import type { ReactElement } from "react";

/**
 * Machined Signal icon language. Every glyph is drawn in a 0..30 space with
 * exactly one luminous "signal" segment (`ss-icon-signal` / `ss-icon-node`)
 * carried over a graphite "stroke" structure. Mirrors the static prototype
 * so the React handoff and the acceptance prototype stay 1:1.
 */
export type MachinedSignalIconName =
  | "web"
  | "app"
  | "content"
  | "voice"
  | "reception"
  | "automation"
  | "consulting";

export const ICON_PATHS: Record<MachinedSignalIconName, ReactElement> = {
  web: (
    <>
      <rect className="ss-icon-stroke" x={4} y={6} width={22} height={18} rx={2.5} />
      <line className="ss-icon-stroke" x1={4} y1={11} x2={26} y2={11} />
      <path className="ss-icon-signal" d="M8 20 L13 16 L18 19 L22 14" />
      <circle className="ss-icon-node" cx={22} cy={14} r={1.8} />
    </>
  ),
  app: (
    <>
      <rect className="ss-icon-stroke" x={9} y={4} width={17} height={13} rx={2.5} />
      <rect className="ss-icon-signal" x={4} y={11} width={17} height={15} rx={2.5} />
      <circle className="ss-icon-node" cx={8} cy={15} r={1.7} />
    </>
  ),
  content: (
    <>
      <rect className="ss-icon-stroke" x={3} y={12} width={8} height={8} rx={1.6} />
      <path className="ss-icon-stroke" d="M11 16 H16 C20 16 20 8 25 8" />
      <path className="ss-icon-signal" d="M16 16 C20 16 20 24 25 24" />
      <circle className="ss-icon-stroke" cx={25} cy={8} r={1.7} />
      <circle className="ss-icon-node" cx={25} cy={24} r={1.9} />
    </>
  ),
  voice: (
    <>
      <path className="ss-icon-stroke" d="M6 12 V18" />
      <path className="ss-icon-stroke" d="M10 9 V21" />
      <path className="ss-icon-signal" d="M14 5 V25" />
      <path className="ss-icon-stroke" d="M18 10 V20" />
      <path className="ss-icon-stroke" d="M22 8 H26 V22 H22" />
      <circle className="ss-icon-node" cx={14} cy={5} r={1.8} />
    </>
  ),
  reception: (
    <>
      <path className="ss-icon-stroke" d="M4 8 L14 15" />
      <path className="ss-icon-stroke" d="M4 15 H13" />
      <path className="ss-icon-stroke" d="M4 22 L14 15" />
      <circle className="ss-icon-stroke" cx={14} cy={15} r={2.2} />
      <path className="ss-icon-signal" d="M16.2 15 H25" />
      <circle className="ss-icon-node" cx={25} cy={15} r={2} />
    </>
  ),
  automation: (
    <>
      <circle className="ss-icon-stroke" cx={6} cy={21} r={2.4} />
      <circle className="ss-icon-stroke" cx={15} cy={21} r={2.4} />
      <circle className="ss-icon-stroke" cx={24} cy={21} r={2.4} />
      <path className="ss-icon-stroke" d="M8.6 21 H12.4" />
      <path className="ss-icon-stroke" d="M17.6 21 H21.4" />
      <path className="ss-icon-signal" d="M24 18.4 C24 9 15 9 15 18.2" />
      <circle className="ss-icon-node" cx={15} cy={18.4} r={1.7} />
    </>
  ),
  consulting: (
    <>
      <path className="ss-icon-stroke" d="M5 23 H25" />
      <path className="ss-icon-stroke" d="M8 20 V10 H22 V20" />
      <path className="ss-icon-stroke" d="M11 14 H14" />
      <path className="ss-icon-stroke" d="M16 14 H19" />
      <path className="ss-icon-signal" d="M10 19 C13 10 18 10 21 19" />
      <circle className="ss-icon-node" cx={15.5} cy={12} r={1.8} />
    </>
  ),
};

type MachinedSignalIconProps = {
  name: MachinedSignalIconName;
  title?: string;
};

export function MachinedSignalIcon({ name, title }: MachinedSignalIconProps) {
  const labeled = typeof title === "string" && title.length > 0;

  return (
    <svg
      className="ss-icon"
      viewBox="0 0 30 30"
      role="img"
      aria-hidden={labeled ? undefined : true}
      aria-label={labeled ? title : undefined}
    >
      {labeled ? <title>{title}</title> : null}
      {ICON_PATHS[name]}
    </svg>
  );
}
