/**
 * Presentational chrome for the live ElevenLabs voice demo console — shared
 * between the SSR/static shell (`live-voice-demo.tsx`) and the lazy-loaded
 * interactive session (`live-voice-session.tsx`) so both render an identical
 * frame and the swap from static to live is invisible.
 *
 * Everything here is inert: no SDK imports, no WebGL, no browser-only APIs at
 * render time. The prerendered HTML produced from these components carries the
 * full customer-facing copy for both surfaces.
 */
import type { ReactNode } from "react";

import { AudioLines, MessageSquare } from "~/components/icons/lucide";
import { BorderBeam } from "~/features/services-v2/components/primitives";

import { ELEVENLABS_DEMO_DISCLOSURE } from "./elevenlabs-agent-config";

export type LiveVoiceDemoCopy = {
  /** data-config-slot for the orb / call half of the console. */
  orbSlot: string;
  /** data-config-slot for the live transcript half of the console. */
  transcriptSlot: string;
  /** Pill label in the console top bar, e.g. "Live demo · Grace — AI receptionist". */
  consoleLabel: string;
  /** Panel header for the transcript half. */
  transcriptLabel: string;
  /** Foot heading under the console (per page). */
  footHeading: string;
  /** Foot body under the console (per page). */
  footBody: string;
  /** Empty-transcript invitation, also prerendered for SEO. */
  emptyTitle: string;
  emptyBody: string;
};

export type LiveVoiceAccent = {
  from: string;
  to: string;
};

/** Formats whole seconds as m:ss for the call timer and transcript stamps. */
export function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(minutes)}:${String(seconds).padStart(2, "0")}`;
}

/**
 * The console frame: top bar, split body (provided by the caller) and foot.
 * `state` drives the pulsing live indicator; the static shell passes "idle".
 */
export function ConsoleFrame({
  copy,
  state,
  children,
}: {
  copy: LiveVoiceDemoCopy;
  state: "idle" | "connecting" | "live" | "ended";
  children: ReactNode;
}) {
  return (
    <article className="ss-lvd ss-srv2-beam-border" data-state={state}>
      <div className="ss-lvd__bar">
        <span className="ss-lvd__badge">
          <span className="ss-lvd__pulse" aria-hidden="true" />
          {copy.consoleLabel}
        </span>
        <span className="ss-lvd__engine">
          <AudioLines aria-hidden="true" />
          ElevenLabs Conversational AI
        </span>
      </div>
      <div className="ss-lvd__body">{children}</div>
      <div className="ss-lvd__foot">
        <h3 className="ss-lvd__foot-heading">{copy.footHeading}</h3>
        <p className="ss-lvd__foot-body">{copy.footBody}</p>
        <p className="ss-lvd__disclosure">{ELEVENLABS_DEMO_DISCLOSURE}</p>
      </div>
      <BorderBeam />
    </article>
  );
}

/** Header row inside the transcript panel. `live` lights the REC-style dot. */
export function TranscriptHead({
  label,
  live,
}: {
  label: string;
  live: boolean;
}) {
  return (
    <div className="ss-lvd__panel-head">
      <span className="ss-lvd__panel-label">
        <MessageSquare aria-hidden="true" />
        {label}
      </span>
      <span className="ss-lvd__panel-live" data-live={live || undefined}>
        <span aria-hidden="true" />
        {live ? "Transcribing live" : "Real-time"}
      </span>
    </div>
  );
}

/**
 * Pure-CSS orb: the resting (and reduced-motion / no-WebGL) counterpart of
 * the WebGL orb. Same footprint, so swapping never shifts layout.
 */
export function StaticOrbVisual({ active = false }: { active?: boolean }) {
  return (
    <div className="ss-lvd__orb" data-active={active || undefined} aria-hidden="true">
      <span className="ss-lvd__orb-halo" />
      <span className="ss-lvd__orb-ring" />
      <span className="ss-lvd__orb-ring" data-i="2" />
      <span className="ss-lvd__orb-core" />
    </div>
  );
}

/**
 * Static console body: what prerender emits and what visitors see until the
 * interactive chunk hydrates. The start button is real — clicking it flags
 * engagement so the session auto-starts the moment it loads.
 */
export function StaticConsoleBody({
  copy,
  onEngage,
  engaged,
}: {
  copy: LiveVoiceDemoCopy;
  onEngage?: () => void;
  engaged?: boolean;
}) {
  return (
    <>
      <div className="ss-lvd__stage" data-config-slot={copy.orbSlot}>
        <StaticOrbVisual />
        <p className="ss-lvd__status" role="status">
          {engaged ? "Preparing the live line…" : "Live and ready to talk"}
        </p>
        <div className="ss-lvd__controls">
          <button
            type="button"
            className="ss-focus-ring ss-lvd__cta"
            onClick={onEngage}
            disabled={engaged}
          >
            <span className="ss-lvd__cta-dot" aria-hidden="true" />
            Start a live conversation
          </button>
        </div>
        <p className="ss-lvd__hint">
          Uses your microphone. Nothing to install — it runs in this page.
        </p>
      </div>
      <div className="ss-lvd__panel" data-config-slot={copy.transcriptSlot}>
        <TranscriptHead label={copy.transcriptLabel} live={false} />
        <div className="ss-lvd__thread" data-static="true">
          <div className="ss-lvd__empty">
            <h4 className="ss-lvd__empty-title">{copy.emptyTitle}</h4>
            <p className="ss-lvd__empty-body">{copy.emptyBody}</p>
          </div>
        </div>
      </div>
    </>
  );
}
