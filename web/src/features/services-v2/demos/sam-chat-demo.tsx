/**
 * Live Botpress messaging demo — public entry point.
 *
 * Renders the full console chrome, Sam's opening message, the four
 * conversation starters and the composer statically (so prerendered HTML
 * stays complete and indexable), then swaps in the interactive session —
 * the Botpress webchat client — from a lazy chunk once the console is near
 * the viewport or the visitor engages. No Botpress conversation or user is
 * created until the visitor actually sends something: picking a starter or
 * submitting the composer on the static shell queues that first message and
 * the session sends it the moment the connection opens, so the demo feels
 * instant either way.
 */
import {
  lazy,
  Suspense,
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useInView } from "motion/react";

import { Reveal, TextLink } from "../components/primitives";
import {
  SamConsoleFrame,
  SamStaticBody,
  type SamChatCopy,
  type SamChatState,
} from "./sam-chat-chrome";

const SamChatSession = lazy(() => import("./sam-chat-session"));

// SSR/hydration-safe "has the client taken over" signal: false on the server
// and during hydration, true immediately after.
const emptySubscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const copy: SamChatCopy = {
  consoleLabel: "Live demo · Sam — AI messaging receptionist",
  threadLabel: "Message thread",
  footHeading: "Read a governed messaging flow, not an unrestricted agent",
  footBody:
    "Sam is our live messaging demo — the written counterpart to Grace's front " +
    "desk. Ask what an AI receptionist can answer over chat, how a booking or " +
    "callback request would be captured, or what happens when a person needs " +
    "to take over — he keeps to an approved reception scenario and every reply " +
    "arrives in this thread in seconds.",
  composerPlaceholder: "Write to Sam…",
  composerHint: "Nothing to install — the conversation runs in this page.",
};

export function SamChatDemo() {
  const frameRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [engaged, setEngaged] = useState(false);
  // The first message picked or typed on the static shell, queued until the
  // session chunk (and the Botpress connection) is ready to send it.
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [state, setState] = useState<SamChatState>("idle");
  const inView = useInView(frameRef, { once: true, margin: "480px 0px" });

  const handleEngage = useCallback((text: string) => {
    setPendingText((current) => current ?? text);
    setEngaged(true);
  }, []);

  const loadSession = mounted && (inView || engaged);
  const staticBody = (
    <SamStaticBody copy={copy} onEngage={handleEngage} engaged={engaged} />
  );

  return (
    <div className="ss-srv2-showcase">
      <Reveal kind="card">
        <div ref={frameRef}>
          <SamConsoleFrame copy={copy} state={state}>
            {loadSession ? (
              <Suspense fallback={staticBody}>
                <SamChatSession
                  copy={copy}
                  engaged={engaged}
                  initialText={pendingText}
                  onEngage={handleEngage}
                  onStateChange={setState}
                />
              </Suspense>
            ) : (
              staticBody
            )}
          </SamConsoleFrame>
        </div>
      </Reveal>
      <Reveal kind="section" className="ss-srv2-showcase__note">
        <p className="ss-srv2-showcase__aphorism">Two receptionists. One standard.</p>
        <p className="ss-srv2-showcase__body">
          Grace and Sam draw on the same governed answer library — only the channel
          changes. Phone, website chat or messaging apps: the desk answers them all,
          with the same booking rules and human boundary.
        </p>
        <TextLink href="/services/ai-automation">
          See how the desk plugs into your systems
        </TextLink>
      </Reveal>
    </div>
  );
}
