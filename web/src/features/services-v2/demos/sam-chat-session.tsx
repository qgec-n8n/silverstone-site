/**
 * Interactive core of the live Botpress messaging demo. Loaded lazily by
 * `sam-chat-demo.tsx` so the Botpress webchat client stays out of the route's
 * initial bundle.
 *
 * Mounting `WebchatProvider` creates a Botpress user and opens a conversation,
 * so the provider is mounted only once the visitor has actually sent something
 * (`engaged`) — until then this chunk renders the same inert console body as
 * the static shell, just hydrated. The first message picked or typed on the
 * shell is queued and sent the moment the connection reports connected; an
 * optimistic echo keeps the thread honest while that handshake completes.
 *
 * The UI is entirely bespoke — no Botpress components or stylesheets — built
 * on the headless `useActiveConversation` state.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  useActiveConversation,
  useWebchatContext,
  WebchatProvider,
  type BlockMessage,
  type MessageBlock,
} from "@botpress/webchat";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "~/components/ui/conversation";

import {
  BOTPRESS_DEMO_AGENT_NAME,
  BOTPRESS_DEMO_CLIENT_ID,
} from "./botpress-agent-config";
import {
  formatStamp,
  SamIdentityRail,
  SamMessageRow,
  SamOpeningRow,
  SamStaticBody,
  SamThreadHead,
  SamComposer,
  type SamChatCopy,
  type SamChatState,
} from "./sam-chat-chrome";

const ERROR_COPY =
  "The messaging line dropped. Give it a moment — it reconnects on its own — or refresh the page.";

type SessionProps = {
  copy: SamChatCopy;
  engaged: boolean;
  initialText: string | null;
  onEngage: (text: string) => void;
  onStateChange: (state: SamChatState) => void;
};

export default function SamChatSession({
  copy,
  engaged,
  initialText,
  onEngage,
  onStateChange,
}: SessionProps) {
  if (!engaged) {
    return <SamStaticBody copy={copy} onEngage={onEngage} />;
  }
  return (
    <WebchatProvider
      clientId={BOTPRESS_DEMO_CLIENT_ID}
      storageKey="ss-sam-demo"
      storageLocation="sessionStorage"
    >
      <SamLiveBody
        copy={copy}
        initialText={initialText}
        onStateChange={onStateChange}
      />
    </WebchatProvider>
  );
}

function SamLiveBody({
  copy,
  initialText,
  onStateChange,
}: {
  copy: SamChatCopy;
  initialText: string | null;
  onStateChange: (state: SamChatState) => void;
}) {
  const { messages, sendMessage, isTyping, isAwaitingResponse, status, error } =
    useActiveConversation();
  const { userCredentials } = useWebchatContext();
  const userId = userCredentials?.userId;

  const connected = status === "connected";
  const failed = status === "error" || Boolean(error);
  const state: SamChatState = failed ? "error" : connected ? "live" : "connecting";

  useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);

  // Messages queued before the connection is open: the one picked or typed on
  // the static shell, plus any composer send that races the handshake. A
  // queued item is only *removed* once it shows up in the active
  // conversation's message list — not when its send resolves — because the
  // provider can re-initialise mid-handshake (React StrictMode runs its init
  // effect twice in dev, creating a fresh user and conversation) and a send
  // that landed on the abandoned conversation must be retried on the live one.
  const [queue, setQueue] = useState<string[]>(() =>
    initialText ? [initialText] : [],
  );
  const sendingRef = useRef(false);
  const currentUserIdRef = useRef(userId);
  const lastAttemptRef = useRef<{
    text: string;
    userId: string | undefined;
  } | null>(null);
  const [sendSettledVersion, setSendSettledVersion] = useState(0);
  useEffect(() => {
    currentUserIdRef.current = userId;
    if (!connected || sendingRef.current) {
      return;
    }
    const next = queue[0];
    if (next === undefined) {
      return;
    }
    const alreadyListed = messages.some(
      (message) =>
        message.authorId === userId &&
        message.block.type === "text" &&
        message.block.text === next,
    );
    if (alreadyListed) {
      const removalTimer = window.setTimeout(() => {
        setQueue((current) => current.slice(1));
      }, 0);
      return () => window.clearTimeout(removalTimer);
    }
    const lastAttempt = lastAttemptRef.current;
    if (lastAttempt?.text === next && lastAttempt.userId === userId) {
      return;
    }
    sendingRef.current = true;
    lastAttemptRef.current = { text: next, userId };
    void sendMessage({ type: "text", text: next })
      .catch(() => {
        // A failure on the still-active user is surfaced through the hook's
        // `error` state, so drop the item rather than retrying forever. If the
        // provider replaced the user mid-send, keep it for the new session.
        if (currentUserIdRef.current === userId) {
          setQueue((current) => current.slice(1));
        }
      })
      .finally(() => {
        sendingRef.current = false;
        // The message list (or active Botpress user) can change while the send
        // promise is in flight. Those effect runs are deliberately ignored by
        // `sendingRef`; this state tick re-checks the queue once the attempt is
        // settled. `lastAttemptRef` prevents a duplicate resend to the same
        // user while still allowing a retry when StrictMode replaced the user.
        setSendSettledVersion((current) => current + 1);
      });
    return undefined;
  }, [connected, queue, messages, userId, sendMessage, sendSettledVersion]);

  const handleSend = (text: string) => {
    if (connected && queue.length === 0) {
      void sendMessage({ type: "text", text }).catch(() => {
        // Surfaced through the hook's `error` state.
      });
    } else {
      setQueue((current) => [...current, text]);
    }
  };

  const hasOutgoing = useMemo(
    () => messages.some((message) => message.authorId === userId),
    [messages, userId],
  );

  const railStatus = failed
    ? "Connection interrupted"
    : !connected
      ? "Opening the line…"
      : isTyping || isAwaitingResponse
        ? `${BOTPRESS_DEMO_AGENT_NAME} is typing…`
        : "Online — replying in seconds";

  // Scroll containment: the fixed-height thread only owns the swipe gesture
  // while it actually overflows (same lesson as the Grace transcript).
  const panelRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  useEffect(() => {
    const thread = panelRef.current?.querySelector<HTMLElement>(".ss-smc__thread");
    if (!thread) {
      return;
    }
    const measure = () => {
      setOverflowing(thread.scrollHeight - thread.clientHeight > 8);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(thread);
    const content = thread.querySelector(".ss-smc__thread-content");
    if (content) {
      observer.observe(content);
    }
    return () => observer.disconnect();
  }, [messages.length]);

  return (
    <>
      <SamIdentityRail status={railStatus} />
      <div
        ref={panelRef}
        className="ss-smc__panel"
        data-overflow={overflowing ? "" : undefined}
      >
        <SamThreadHead
          label={copy.threadLabel}
          live={connected && (isTyping || isAwaitingResponse)}
        />
        <Conversation className="ss-smc__thread">
          <ConversationContent className="ss-smc__thread-content">
            <SamOpeningRow />
            {messages.map((message) => (
              <SamThreadMessage
                key={message.id}
                message={message}
                userId={userId}
                onSend={handleSend}
              />
            ))}
            {/* Optimistic echo for queued sends the server hasn't listed yet. */}
            {!hasOutgoing
              ? queue.map((text, index) => (
                  <SamMessageRow
                    key={`queued-${String(index)}`}
                    role="user"
                    meta="You"
                    pending
                  >
                    <p>{text}</p>
                  </SamMessageRow>
                ))
              : null}
            {isTyping || isAwaitingResponse ? (
              <div className="ss-smc__row" data-role="sam" aria-hidden="true">
                <div className="ss-smc__typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ) : null}
            {failed ? <p className="ss-smc__error">{ERROR_COPY}</p> : null}
          </ConversationContent>
          <ConversationScrollButton className="ss-smc__scroll-btn" />
        </Conversation>
        <SamComposer copy={copy} onSend={handleSend} disabled={failed} />
      </div>
    </>
  );
}

function SamThreadMessage({
  message,
  userId,
  onSend,
}: {
  message: BlockMessage;
  userId: string | undefined;
  onSend: (text: string) => void;
}) {
  const role = message.authorId === userId ? "user" : "sam";
  const stamp = formatStamp(new Date(message.timestamp));
  const meta = `${role === "user" ? "You" : BOTPRESS_DEMO_AGENT_NAME} · ${stamp}`;
  const content = renderBlock(message.block, onSend);
  if (content === null) {
    return null;
  }
  return (
    <SamMessageRow role={role} meta={meta} pending={message.status === "pending"}>
      {content}
    </SamMessageRow>
  );
}

/**
 * Bespoke block renderer for the message types a governed receptionist bot
 * actually sends: text (with light markdown), choices, images and blocs.
 * Anything else degrades to its text fields rather than breaking the thread.
 */
function renderBlock(
  block: MessageBlock,
  onSend: (text: string) => void,
): ReactNode | null {
  switch (block.type) {
    case "text":
      return renderRichText(block.text);
    case "image":
      return <img src={block.url} alt="" loading="lazy" />;
    case "choice":
    case "dropdown":
      return (
        <>
          {block.text ? renderRichText(block.text) : null}
          <span className="ss-smc__choices">
            {block.options.map((option) => (
              <button
                key={option.value}
                type="button"
                className="ss-focus-ring ss-smc__choice"
                onClick={() => onSend(option.value)}
              >
                {option.label}
              </button>
            ))}
          </span>
        </>
      );
    case "bloc":
      return (
        <>
          {block.items.map((item, index) =>
            item.type === "text" ? (
              <span key={index}>{renderRichText(item.text)}</span>
            ) : item.type === "image" ? (
              <img key={index} src={item.url} alt="" loading="lazy" />
            ) : null,
          )}
        </>
      );
    case "card":
      return renderRichText([block.title, block.subtitle].filter(Boolean).join(" — "));
    default:
      return null;
  }
}

/**
 * Light markdown for bot replies: paragraphs, `**bold**` and `[label](url)`
 * links — enough for a receptionist's answers without pulling in a renderer.
 */
function renderRichText(text: string): ReactNode {
  const paragraphs = text.split(/\n{2,}/);
  return paragraphs.map((paragraph, pIndex) => (
    <p key={pIndex}>
      {paragraph.split("\n").map((line, lIndex, lines) => (
        <span key={lIndex}>
          {renderInline(line)}
          {lIndex < lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </p>
  ));
}

const INLINE_TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(line: string): ReactNode[] {
  return line.split(INLINE_TOKEN).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      return (
        <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer">
          {link[1]}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
