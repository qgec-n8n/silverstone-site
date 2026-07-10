/**
 * Live ElevenLabs voice demo console — public entry point.
 *
 * Renders the full console chrome and customer-facing copy statically (so
 * prerendered HTML stays complete and indexable), then swaps in the
 * interactive session — WebRTC, SDK and WebGL orb — from a lazy chunk once
 * the console is near the viewport or the visitor presses start. Pressing
 * start on the static shell auto-starts the call as soon as the chunk lands,
 * so the demo feels instant either way.
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

import { Reveal } from "../components/primitives";
import {
  ConsoleFrame,
  StaticConsoleBody,
  type LiveVoiceAccent,
  type LiveVoiceDemoCopy,
} from "./live-voice-chrome";

const LiveVoiceSession = lazy(() => import("./live-voice-session"));

// SSR/hydration-safe "has the client taken over" signal: false on the server
// and during hydration, true immediately after.
const emptySubscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export type { LiveVoiceAccent, LiveVoiceDemoCopy };

export function LiveVoiceDemo({
  copy,
  accent,
  reveal = true,
}: {
  copy: LiveVoiceDemoCopy;
  accent: LiveVoiceAccent;
  reveal?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [engaged, setEngaged] = useState(false);
  const [state, setState] = useState<"idle" | "connecting" | "live" | "ended">("idle");
  const inView = useInView(frameRef, { once: true, margin: "480px 0px" });

  const handleEngage = useCallback(() => {
    setEngaged(true);
  }, []);

  const loadSession = mounted && (inView || engaged);
  const staticBody = (
    <StaticConsoleBody copy={copy} onEngage={handleEngage} engaged={engaged} />
  );

  const console = (
    <div ref={frameRef}>
      <ConsoleFrame copy={copy} state={state}>
        {loadSession ? (
          <Suspense fallback={staticBody}>
            <LiveVoiceSession
              copy={copy}
              accent={accent}
              autoStart={engaged}
              onStateChange={setState}
            />
          </Suspense>
        ) : (
          staticBody
        )}
      </ConsoleFrame>
    </div>
  );

  return reveal ? <Reveal kind="card">{console}</Reveal> : console;
}
