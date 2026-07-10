/**
 * Interactive core of the live ElevenLabs voice demo. Loaded lazily by
 * `live-voice-demo.tsx` so the SDK, WebRTC stack and WebGL orb stay out of the
 * route's initial bundle.
 *
 * Connects to the public "Grace" receptionist agent over WebRTC via
 * `@elevenlabs/react`, renders the audio-reactive orb (ElevenLabs UI) and
 * mirrors the conversation into a live transcript panel. The WebGL orb is
 * optional: reduced-motion visitors and browsers without WebGL get the static
 * CSS orb while the call itself works identically.
 */
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";

import { useReducedMotion } from "~/components/accessibility/use-reduced-motion";
import { Mic, MicOff, PhoneOff } from "~/components/icons/lucide";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "~/components/ui/conversation";
import { Message, MessageContent } from "~/components/ui/message";
import { Orb } from "~/components/ui/orb";
import { ShimmeringText } from "~/components/ui/shimmering-text";

import {
  ELEVENLABS_DEMO_AGENT_ID,
  ELEVENLABS_DEMO_AGENT_NAME,
} from "./elevenlabs-agent-config";
import {
  applyAgentTranscriptCorrection,
  applyTranscriptMessage,
  type TranscriptEntry,
} from "./agent-transcript";
import {
  formatClock,
  StaticOrbVisual,
  TranscriptHead,
  type LiveVoiceAccent,
  type LiveVoiceDemoCopy,
} from "./live-voice-chrome";

export const BOOKING_CONTEXT_DELAY_MS = 120_000;

export const BOOKING_CONTEXTUAL_UPDATE =
  "About two minutes of this conversation have elapsed. If you have not already made the early booking bridge, the visitor has not clearly declined a call, and no booking is currently in progress, make the booking bridge at the next natural agent turn. Offer the free 30-minute discovery call and simultaneously provide one relevant question they can answer if they prefer to continue the demo. Do not interrupt the visitor and do not respond solely to this contextual update.";

const AGENT_CONTACT_TOKEN_PATTERN =
  /(info@silverstone-ai\.com|https:\/\/silverstone-ai\.com\/book)/g;

const ERROR_COPY = {
  unsupported:
    "This browser can't run the live voice demo — try Chrome, Edge or Safari on a device with a microphone.",
  micDenied:
    "Microphone access was blocked. Allow the microphone for this site in your browser, then press start again.",
  dropped: "The live line dropped. Give it a moment, then press start again.",
} as const;

function detectWebgl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function AgentTranscriptText({ text }: { text: string }) {
  return text.split(AGENT_CONTACT_TOKEN_PATTERN).map((part, index) => {
    if (part === "info@silverstone-ai.com") {
      return (
        <a key={index} href="mailto:info@silverstone-ai.com">
          {part}
        </a>
      );
    }
    if (part === "https://silverstone-ai.com/book") {
      return (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return part;
  });
}

export default function LiveVoiceSession(props: {
  copy: LiveVoiceDemoCopy;
  accent: LiveVoiceAccent;
  autoStart: boolean;
  onStateChange: (state: "idle" | "connecting" | "live" | "ended") => void;
}) {
  return (
    <ConversationProvider>
      <SessionBody {...props} />
    </ConversationProvider>
  );
}

function SessionBody({
  copy,
  accent,
  autoStart,
  onStateChange,
}: {
  copy: LiveVoiceDemoCopy;
  accent: LiveVoiceAccent;
  autoStart: boolean;
  onStateChange: (state: "idle" | "connecting" | "live" | "ended") => void;
}) {
  const { reducedMotion } = useReducedMotion();
  const [webglOk] = useState(detectWebgl);
  const [messages, setMessages] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [requestingMic, setRequestingMic] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const entryIdRef = useRef(0);
  const bookingPromptTimerRef = useRef<number | null>(null);
  const timerStartedSessionIdsRef = useRef(new Set<string>());
  const activeSessionIdRef = useRef<string | null>(null);
  const connectedSessionRef = useRef(false);
  const contextSentSessionIdRef = useRef<string | null>(null);
  const sendContextualUpdateRef = useRef<(text: string) => void>(() => undefined);
  const panelRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  const clearBookingPromptTimer = useCallback(() => {
    if (bookingPromptTimerRef.current !== null) {
      window.clearTimeout(bookingPromptTimerRef.current);
      bookingPromptTimerRef.current = null;
    }
  }, []);

  const markSessionInactive = useCallback(() => {
    connectedSessionRef.current = false;
    activeSessionIdRef.current = null;
    clearBookingPromptTimer();
  }, [clearBookingPromptTimer]);

  const elapsedNow = useCallback(() => {
    return startedAtRef.current === null
      ? 0
      : Math.floor((Date.now() - startedAtRef.current) / 1000);
  }, []);

  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      setError(null);
      connectedSessionRef.current = true;

      if (activeSessionIdRef.current !== conversationId) {
        clearBookingPromptTimer();
        activeSessionIdRef.current = conversationId;
        startedAtRef.current = Date.now();
        setElapsed(0);
      }
      if (
        bookingPromptTimerRef.current === null &&
        !timerStartedSessionIdsRef.current.has(conversationId) &&
        contextSentSessionIdRef.current !== conversationId
      ) {
        timerStartedSessionIdsRef.current.add(conversationId);
        bookingPromptTimerRef.current = window.setTimeout(() => {
          bookingPromptTimerRef.current = null;
          if (
            !connectedSessionRef.current ||
            activeSessionIdRef.current !== conversationId ||
            contextSentSessionIdRef.current === conversationId
          ) {
            return;
          }
          contextSentSessionIdRef.current = conversationId;
          sendContextualUpdateRef.current(BOOKING_CONTEXTUAL_UPDATE);
        }, BOOKING_CONTEXT_DELAY_MS);
      }
    },
    onMessage: ({ message, role, event_id }) => {
      setMessages((current) =>
        applyTranscriptMessage(current, {
          id: entryIdRef.current++,
          role: role === "user" ? "user" : "agent",
          message,
          at: elapsedNow(),
          ...(event_id === undefined ? {} : { eventId: event_id }),
        }),
      );
    },
    onAgentResponseCorrection: ({
      event_id,
      original_agent_response,
      corrected_agent_response,
    }) => {
      setMessages((current) =>
        applyAgentTranscriptCorrection(current, {
          eventId: event_id,
          originalMessage: original_agent_response,
          correctedMessage: corrected_agent_response,
        }),
      );
    },
    onError: () => {
      markSessionInactive();
      setError(ERROR_COPY.dropped);
    },
    onDisconnect: (details) => {
      markSessionInactive();
      if (details.reason === "error") {
        setError(ERROR_COPY.dropped);
      }
    },
  });

  const {
    status,
    isSpeaking,
    isMuted,
    setMuted,
    startSession,
    endSession,
    sendContextualUpdate,
  } = conversation;
  const connected = status === "connected";
  const connecting = status === "connecting";
  const ended = !connected && !connecting && messages.length > 0;
  const state = connected
    ? "live"
    : connecting
      ? "connecting"
      : ended
        ? "ended"
        : "idle";

  // Drives the transcript's scroll containment (see .ss-lvd__thread CSS):
  // "live" while the call is running, "review" once it has ended with a
  // transcript to read, "idle" otherwise.
  const threadMode = connected ? "live" : ended ? "review" : "idle";

  useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);

  useEffect(() => {
    sendContextualUpdateRef.current = sendContextualUpdate;
  }, [sendContextualUpdate]);

  // The transcript only owns the scroll gesture while it actually overflows
  // its fixed-height pane (live call or post-call review); measure that so
  // `data-overflow` can gate `overscroll-behavior: contain`. The pane height
  // is fixed in every mode, so scrollHeight vs clientHeight is a stable
  // overflow test here.
  useEffect(() => {
    const thread = panelRef.current?.querySelector<HTMLElement>(".ss-lvd__thread");
    if (!thread) {
      return;
    }
    const measure = () => {
      setOverflowing(thread.scrollHeight - thread.clientHeight > 8);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(thread);
    const content = thread.querySelector(".ss-lvd__thread-content");
    if (content) {
      observer.observe(content);
    }
    return () => observer.disconnect();
  }, [state, messages.length]);

  // Call timer — ticks only while connected; the final value stays on screen.
  useEffect(() => {
    if (!connected) {
      return;
    }
    const timer = window.setInterval(() => setElapsed(elapsedNow()), 1000);
    return () => window.clearInterval(timer);
  }, [connected, elapsedNow]);

  const handleStart = useCallback(async () => {
    markSessionInactive();
    setError(null);
    setMessages([]);
    setElapsed(0);
    startedAtRef.current = null;
    // `mediaDevices` is typed as always-present but is genuinely missing on
    // insecure origins and legacy browsers — probe for it at runtime.
    const mediaDevices =
      "mediaDevices" in navigator ? navigator.mediaDevices : undefined;
    if (!mediaDevices) {
      setError(ERROR_COPY.unsupported);
      return;
    }
    try {
      // Preflight the permission prompt so a refusal fails softly here
      // rather than inside the WebRTC handshake.
      setRequestingMic(true);
      const stream = await mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      setError(ERROR_COPY.micDenied);
      return;
    } finally {
      setRequestingMic(false);
    }
    startSession({
      agentId: ELEVENLABS_DEMO_AGENT_ID,
      connectionType: "webrtc",
    });
  }, [markSessionInactive, startSession]);

  const handleEnd = useCallback(() => {
    endSession();
  }, [endSession]);

  // If the visitor pressed start on the static shell before this chunk
  // loaded, begin the call immediately — once.
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (autoStart && !autoStartedRef.current) {
      autoStartedRef.current = true;
      void handleStart();
    }
  }, [autoStart, handleStart]);

  // End the call if the visitor navigates away mid-conversation.
  const endSessionRef = useRef(endSession);
  useEffect(() => {
    endSessionRef.current = endSession;
  });
  useEffect(() => {
    return () => {
      markSessionInactive();
      try {
        endSessionRef.current();
      } catch {
        // Session already closed.
      }
    };
  }, [markSessionInactive]);

  // WebRTC can be blocked outright (corporate firewalls, some VPNs) and the
  // transport then retries indefinitely — cap the connecting phase so the
  // visitor gets an honest failure instead of an endless spinner.
  useEffect(() => {
    if (!connecting) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setError(ERROR_COPY.dropped);
      try {
        endSessionRef.current();
      } catch {
        // Session already closed.
      }
    }, 15000);
    return () => window.clearTimeout(timeout);
  }, [connecting]);

  // Read each animation frame by the orb; guard against reads while the
  // session is (re)connecting.
  const getInputVolume = () => {
    try {
      return conversation.getInputVolume();
    } catch {
      return 0;
    }
  };

  const getOutputVolume = () => {
    try {
      return conversation.getOutputVolume();
    } catch {
      return 0;
    }
  };

  const showWebglOrb = webglOk && !reducedMotion;
  const orbActive = connected || connecting;

  return (
    <>
      <div className="ss-lvd__stage" data-config-slot={copy.orbSlot}>
        {showWebglOrb ? (
          <div className="ss-lvd__orb" data-active={orbActive || undefined}>
            <span className="ss-lvd__orb-halo" aria-hidden="true" />
            <span className="ss-lvd__orb-ring" aria-hidden="true" />
            <span className="ss-lvd__orb-ring" data-i="2" aria-hidden="true" />
            <Suspense
              fallback={<span className="ss-lvd__orb-core" aria-hidden="true" />}
            >
              <Orb
                colors={[accent.from, accent.to]}
                seed={7}
                agentState={connecting ? "thinking" : null}
                volumeMode={connected ? "manual" : "auto"}
                getInputVolume={getInputVolume}
                getOutputVolume={getOutputVolume}
                className="ss-lvd__orb-canvas"
              />
            </Suspense>
          </div>
        ) : (
          <StaticOrbVisual active={orbActive} />
        )}

        <p className="ss-lvd__status" role="status">
          {error ? (
            <span className="ss-lvd__status-error">{error}</span>
          ) : requestingMic ? (
            <ShimmeringText
              text="Waiting for microphone access…"
              color="var(--srv2-ink-faint)"
              shimmerColor="var(--srv2-accent)"
            />
          ) : connecting ? (
            <ShimmeringText
              text={`Connecting to ${ELEVENLABS_DEMO_AGENT_NAME}…`}
              color="var(--srv2-ink-faint)"
              shimmerColor="var(--srv2-accent)"
            />
          ) : connected ? (
            <>
              <ShimmeringText
                text={
                  isSpeaking
                    ? `${ELEVENLABS_DEMO_AGENT_NAME} is speaking`
                    : `Live — ${ELEVENLABS_DEMO_AGENT_NAME} is listening`
                }
                color="var(--srv2-ink-faint)"
                shimmerColor="var(--srv2-accent)"
              />
              <span className="ss-lvd__clock">{formatClock(elapsed)}</span>
            </>
          ) : ended ? (
            <>
              Call ended
              <span className="ss-lvd__clock">{formatClock(elapsed)}</span>
            </>
          ) : (
            "Live and ready to talk"
          )}
        </p>

        <div className="ss-lvd__controls">
          {connected ? (
            <>
              <button
                type="button"
                className="ss-focus-ring ss-lvd__cta"
                data-variant="end"
                onClick={handleEnd}
              >
                <PhoneOff aria-hidden="true" />
                End conversation
              </button>
              <button
                type="button"
                className="ss-focus-ring ss-lvd__toggle"
                aria-pressed={isMuted}
                onClick={() => setMuted(!isMuted)}
              >
                {isMuted ? <MicOff aria-hidden="true" /> : <Mic aria-hidden="true" />}
                {isMuted ? "Unmute" : "Mute"}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="ss-focus-ring ss-lvd__cta"
              onClick={() => void handleStart()}
              disabled={connecting || requestingMic}
            >
              <span className="ss-lvd__cta-dot" aria-hidden="true" />
              {requestingMic
                ? "Allow microphone access…"
                : connecting
                  ? "Connecting…"
                  : ended
                    ? "Start again"
                    : "Start a live conversation"}
            </button>
          )}
        </div>
        <p className="ss-lvd__hint">
          Uses your microphone. Nothing to install — it runs in this page.
        </p>
      </div>

      <div
        ref={panelRef}
        className="ss-lvd__panel"
        data-config-slot={copy.transcriptSlot}
        data-mode={threadMode}
        data-overflow={threadMode !== "idle" && overflowing ? "" : undefined}
      >
        <TranscriptHead label={copy.transcriptLabel} live={connected} />
        <Conversation className="ss-lvd__thread">
          <ConversationContent className="ss-lvd__thread-content">
            {messages.length === 0 ? (
              <div className="ss-lvd__empty">
                {connecting || connected ? (
                  <p className="ss-lvd__empty-body">
                    <ShimmeringText
                      text="Say hello — your words appear here as you speak."
                      color="var(--srv2-ink-faint)"
                      shimmerColor="var(--srv2-accent)"
                    />
                  </p>
                ) : (
                  <>
                    <h4 className="ss-lvd__empty-title">{copy.emptyTitle}</h4>
                    <p className="ss-lvd__empty-body">{copy.emptyBody}</p>
                  </>
                )}
              </div>
            ) : (
              messages.map((entry) => (
                <Message
                  key={entry.id}
                  from={entry.role === "user" ? "user" : "assistant"}
                  className="ss-lvd__row"
                >
                  <div className="ss-lvd__msg" data-role={entry.role}>
                    <span className="ss-lvd__meta">
                      {entry.role === "user" ? "You" : ELEVENLABS_DEMO_AGENT_NAME}
                      {" · "}
                      {formatClock(entry.at)}
                    </span>
                    <MessageContent className="ss-lvd__bubble">
                      {entry.role === "agent" ? (
                        <AgentTranscriptText text={entry.text} />
                      ) : (
                        entry.text
                      )}
                    </MessageContent>
                  </div>
                </Message>
              ))
            )}
            {connected && messages.length > 0 ? (
              <p className="ss-lvd__typing" aria-hidden="true">
                <ShimmeringText
                  text={
                    isSpeaking
                      ? `${ELEVENLABS_DEMO_AGENT_NAME} is replying…`
                      : "Listening…"
                  }
                  color="var(--srv2-ink-faint)"
                  shimmerColor="var(--srv2-accent)"
                />
              </p>
            ) : null}
          </ConversationContent>
          <ConversationScrollButton className="ss-lvd__scroll-btn" />
        </Conversation>
      </div>
    </>
  );
}
