/**
 * Presentational chrome for the live Botpress messaging demo console — shared
 * between the SSR/static shell (`sam-chat-demo.tsx`) and the lazy-loaded
 * interactive session (`sam-chat-session.tsx`) so both render an identical
 * frame and the swap from static to live is invisible.
 *
 * Everything here is inert: no Botpress SDK imports and no browser-only APIs
 * at render time. The prerendered HTML produced from these components carries
 * the full customer-facing copy — Sam's opening message and all four
 * conversation starters included.
 */
import { useState, type ReactNode } from "react";

import {
  Bot,
  MessageSquare,
  RotateCcw,
  Send,
  Sparkles,
  UserRound,
} from "~/components/icons/lucide";

import {
  BOTPRESS_DEMO_AGENT_NAME,
  BOTPRESS_DEMO_DISCLOSURE,
  SAM_CONVERSATION_STARTERS,
  SAM_OPENING_MESSAGE,
} from "./botpress-agent-config";

export type SamChatState = "idle" | "connecting" | "live" | "error";

export type SamChatCopy = {
  /** Pill label in the console top bar. */
  consoleLabel: string;
  /** Panel header above the message thread. */
  threadLabel: string;
  /** Foot heading and body under the console. */
  footHeading: string;
  footBody: string;
  /** Composer input placeholder + label. */
  composerPlaceholder: string;
  /** Small print under the composer. */
  composerHint: string;
};

/** Formats a message timestamp as a 24h clock stamp for the thread meta row. */
export function formatStamp(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

/**
 * The console frame: top bar, body (provided by the caller) and foot.
 * `state` drives the pulsing live indicator; the static shell passes "idle".
 */
export function SamConsoleFrame({
  copy,
  state,
  children,
  onRestart,
  canRestart = false,
}: {
  copy: SamChatCopy;
  state: SamChatState;
  children: ReactNode;
  onRestart?: (() => void) | undefined;
  canRestart?: boolean | undefined;
}) {
  return (
    <article className="ss-smc ss-srv2-beam-border" data-state={state}>
      <div className="ss-smc__bar">
        <span className="ss-smc__badge">
          <span className="ss-smc__pulse" aria-hidden="true" />
          {copy.consoleLabel}
        </span>
        <div className="ss-smc__bar-actions">
          <span className="ss-smc__engine">
            <Sparkles aria-hidden="true" />
            Botpress Conversational AI
          </span>
          {canRestart && onRestart ? (
            <button
              type="button"
              className="ss-focus-ring ss-smc__restart"
              onClick={onRestart}
            >
              <RotateCcw aria-hidden="true" />
              Restart chat
            </button>
          ) : null}
        </div>
      </div>
      <div className="ss-smc__body">{children}</div>
      <div className="ss-smc__foot">
        <h3 className="ss-smc__foot-heading">{copy.footHeading}</h3>
        <p className="ss-smc__foot-body">{copy.footBody}</p>
        <p className="ss-smc__disclosure">{BOTPRESS_DEMO_DISCLOSURE}</p>
      </div>
    </article>
  );
}

/** Sam's monogram avatar — the written channel's counterpart to Grace's orb. */
export function SamMonogram({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <span className="ss-smc__monogram" data-size={size} aria-hidden="true">
      <span className="ss-smc__monogram-ring" />
      <span className="ss-smc__monogram-core">
        <Bot aria-hidden="true" />
      </span>
    </span>
  );
}

function UserAvatar() {
  return (
    <span className="ss-smc__user-avatar" aria-hidden="true">
      <UserRound />
    </span>
  );
}

/**
 * Identity rail (left / top): who is answering, in what state, and what the
 * desk covers. Mirrors the Grace console's orb stage architecturally.
 */
export function SamIdentityRail({ status }: { status: ReactNode }) {
  return (
    <div className="ss-smc__rail">
      <SamMonogram size="lg" />
      <div className="ss-smc__identity">
        <p className="ss-smc__name">{BOTPRESS_DEMO_AGENT_NAME}</p>
        <p className="ss-smc__role">AI messaging receptionist</p>
      </div>
      <p className="ss-smc__status" role="status">
        {status}
      </p>
      <ul className="ss-smc__scope" aria-label="What Sam covers">
        {["Instant answers", "Lead capture", "Bookings", "Human handover"].map(
          (item) => (
            <li key={item}>{item}</li>
          ),
        )}
      </ul>
    </div>
  );
}

/** Header row inside the thread panel. `live` lights the REC-style dot. */
export function SamThreadHead({ label, live }: { label: string; live: boolean }) {
  return (
    <div className="ss-smc__panel-head">
      <span className="ss-smc__panel-label">
        <MessageSquare aria-hidden="true" />
        {label}
      </span>
      <span className="ss-smc__panel-live" data-live={live ? "" : undefined}>
        <span aria-hidden="true" />
        {live ? "Replying live" : "Real-time"}
      </span>
    </div>
  );
}

/** One message row in the thread. */
export function SamMessageRow({
  role,
  meta,
  children,
  pending,
}: {
  role: "sam" | "user";
  meta: string;
  children: ReactNode;
  pending?: boolean;
}) {
  return (
    <div
      className="ss-smc__row"
      data-role={role}
      data-pending={pending ? "" : undefined}
    >
      {role === "sam" ? <SamMonogram /> : null}
      <div className="ss-smc__msg">
        <span className="ss-smc__meta">{meta}</span>
        <div className="ss-smc__bubble">{children}</div>
      </div>
      {role === "user" ? <UserAvatar /> : null}
    </div>
  );
}

/** Sam's scripted opening message — identical in the static and live shells. */
export function SamOpeningRow() {
  return (
    <SamMessageRow role="sam" meta={BOTPRESS_DEMO_AGENT_NAME}>
      <p>{SAM_OPENING_MESSAGE}</p>
    </SamMessageRow>
  );
}

/**
 * The four conversation starters, shown after Sam's opening message until the
 * visitor sends their first message.
 */
export function SamStarters({
  onPick,
  disabled,
}: {
  onPick?: ((text: string) => void) | undefined;
  disabled?: boolean | undefined;
}) {
  return (
    <div className="ss-smc__starters" aria-label="Conversation starters">
      {SAM_CONVERSATION_STARTERS.map((starter, index) => (
        <button
          key={starter}
          type="button"
          className="ss-focus-ring ss-smc__starter"
          style={{ "--smc-starter-i": index } as React.CSSProperties}
          onClick={onPick ? () => onPick(starter) : undefined}
          disabled={disabled}
        >
          <span className="ss-smc__starter-index" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="ss-smc__starter-text">{starter}</span>
          <Send aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

/**
 * Message composer. Owns its input state; hands the trimmed text to `onSend`
 * and clears. Rendered in the static shell too so the prerendered console is
 * visually complete — before hydration, submitting is a no-op.
 */
export function SamComposer({
  copy,
  onSend,
  disabled,
}: {
  copy: SamChatCopy;
  onSend?: ((text: string) => void) | undefined;
  disabled?: boolean | undefined;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="ss-smc__composer-block">
      <form
        className="ss-smc__composer"
        onSubmit={(event) => {
          event.preventDefault();
          const text = value.trim();
          if (!text || !onSend) {
            return;
          }
          onSend(text);
          setValue("");
        }}
      >
        <input
          type="text"
          className="ss-focus-ring ss-smc__input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={copy.composerPlaceholder}
          aria-label={`Message ${BOTPRESS_DEMO_AGENT_NAME}`}
          maxLength={600}
          disabled={disabled}
          autoComplete="off"
        />
        <button
          type="submit"
          className="ss-focus-ring ss-smc__send"
          aria-label="Send message"
          disabled={(disabled ?? false) || value.trim().length === 0}
        >
          <Send aria-hidden="true" />
        </button>
      </form>
      <p className="ss-smc__hint">{copy.composerHint}</p>
    </div>
  );
}

/**
 * Static console body: what prerender emits and what visitors see until the
 * interactive chunk hydrates. The starters and composer are real — using
 * either flags engagement so the conversation opens the moment the session
 * chunk lands, with the first message queued.
 */
export function SamStaticBody({
  copy,
  onEngage,
  engaged,
}: {
  copy: SamChatCopy;
  onEngage?: ((text: string) => void) | undefined;
  engaged?: boolean;
}) {
  return (
    <>
      <SamIdentityRail
        status={engaged ? "Opening the line…" : "Online and ready to reply"}
      />
      <div className="ss-smc__panel">
        <SamThreadHead label={copy.threadLabel} live={false} />
        <div className="ss-smc__thread" data-static="true">
          <div className="ss-smc__thread-content">
            <SamOpeningRow />
            <SamStarters onPick={onEngage} disabled={engaged} />
          </div>
        </div>
        <SamComposer copy={copy} onSend={onEngage} disabled={engaged} />
      </div>
    </>
  );
}
