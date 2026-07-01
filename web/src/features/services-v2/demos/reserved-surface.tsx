/**
 * Shared chrome for a reserved integration surface (voice call, chat, transcript).
 * Renders the approved customer-facing heading/body/status/privacy-note copy;
 * never a literal invented conversation. Inner content is passed as children so
 * each surface (call, chat, transcript) can compose its own honest, structural
 * skeleton — never words presented as a real captured interaction.
 */
import type { ReactNode } from "react";
import type { LucideIcon } from "~/components/icons/lucide";

import { Reveal } from "../components/primitives";

export function ReservedSurface({
  configSlot,
  icon: Icon,
  label,
  heading,
  body,
  privacyNote,
  status,
  children,
  delayMs = 0,
}: {
  configSlot: string;
  icon: LucideIcon;
  label: string;
  heading: string;
  body: string;
  privacyNote: string;
  status: string;
  children: ReactNode;
  delayMs?: number;
}) {
  return (
    <Reveal kind="card" delayMs={delayMs}>
      <article
        className="ss-srv2-reserved ss-srv2-beam-border"
        data-config-slot={configSlot}
      >
        <div className="ss-srv2-reserved__bar">
          <span className="ss-srv2-reserved__label">
            <Icon aria-hidden="true" />
            {label}
          </span>
        </div>
        <div className="ss-srv2-reserved__stage">{children}</div>
        <div className="ss-srv2-reserved__foot">
          <h3 className="ss-srv2-reserved__heading">{heading}</h3>
          <p className="ss-srv2-reserved__body">{body}</p>
          <p className="ss-srv2-reserved__privacy">{privacyNote}</p>
          <p className="ss-srv2-reserved__status">{status}</p>
        </div>
      </article>
    </Reveal>
  );
}

/** Abstract call-control stage: waveform bars + decorative controls, no invented dialogue. */
export function CallStage() {
  return (
    <div className="ss-srv2-callstage">
      <div className="ss-srv2-callstage__avatar" aria-hidden="true" />
      <div className="ss-srv2-callstage__timer" aria-hidden="true">
        00:00
      </div>
      <div className="ss-srv2-callstage__wave" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} style={{ "--srv2-bar-i": i } as React.CSSProperties} />
        ))}
      </div>
      <div className="ss-srv2-callstage__controls" aria-hidden="true">
        <span /> <span className="ss-srv2-callstage__end" /> <span />
      </div>
    </div>
  );
}

/** Abstract transcript stage: alternating skeleton lines, no invented words. */
export function TranscriptStage() {
  const rows = [
    { side: "left", width: "62%" },
    { side: "right", width: "44%" },
    { side: "left", width: "72%" },
    { side: "right", width: "38%" },
    { side: "left", width: "54%" },
  ];
  return (
    <div className="ss-srv2-transcript" aria-hidden="true">
      {rows.map((row, i) => (
        <div key={i} className="ss-srv2-transcript__row" data-side={row.side}>
          <span className="ss-srv2-transcript__bubble" style={{ width: row.width }} />
        </div>
      ))}
    </div>
  );
}

/** Abstract chat-widget stage: bubble skeletons + input bar, no invented words. */
export function ChatStage() {
  const rows = [
    { side: "left", width: "58%" },
    { side: "right", width: "40%" },
    { side: "left", width: "68%" },
  ];
  return (
    <div className="ss-srv2-chatstage" aria-hidden="true">
      <div className="ss-srv2-chatstage__thread">
        {rows.map((row, i) => (
          <span
            key={i}
            className="ss-srv2-transcript__bubble"
            data-side={row.side}
            style={{ width: row.width }}
          />
        ))}
      </div>
      <div className="ss-srv2-chatstage__input">
        <span />
        <span className="ss-srv2-chatstage__send" />
      </div>
    </div>
  );
}
