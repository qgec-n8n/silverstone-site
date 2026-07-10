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
import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
  formatClock,
  StaticOrbVisual,
  TranscriptHead,
  type LiveVoiceAccent,
  type LiveVoiceDemoCopy,
} from "./live-voice-chrome";

type TranscriptEntry = {
  id: number;
  role: "user" | "agent";
  text: string;
  at: number;
};

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
    return Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
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
  const panelRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  const elapsedNow = useCallback(() => {
    return startedAtRef.current === null
      ? 0
      : Math.floor((Date.now() - startedAtRef.current) / 1000);
  }, []);

  const conversation = useConversation({
    onConnect: () => {
      startedAtRef.current = Date.now();
      setElapsed(0);
      setError(null);
    },
    onMessage: ({ message, role }) => {
      const entry: TranscriptEntry = {
        id: entryIdRef.current++,
        role: role === "user" ? "user" : "agent",
        text: message,
        at: elapsedNow(),
      };
      setMessages((current) => [...current, entry]);
    },
    onError: () => {
      setError(ERROR_COPY.dropped);
    },
    onDisconnect: (details) => {
      if (details.reason === "error") {
        setError(ERROR_COPY.dropped);
      }
    },
  });

  const { status, isSpeaking, isMuted, setMuted, startSession, endSession } =
    conversation;
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

  // The transcript only owns the scroll gesture while a live call is actually
  // overflowing its fixed-height pane; measure that so `data-overflow` can gate
  // `overscroll-behavior: contain`. Height is fixed except in "review" mode, so
  // scrollHeight vs clientHeight is a stable overflow test here.
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
  }, [startSession]);

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
      try {
        endSessionRef.current();
      } catch {
        // Session already closed.
      }
    };
  }, []);

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
            <Suspense fallback={<span className="ss-lvd__orb-core" aria-hidden="true" />}>
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
        data-overflow={threadMode === "live" && overflowing ? "" : undefined}
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
                      {entry.text}
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
