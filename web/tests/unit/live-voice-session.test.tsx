import { act, render, screen } from "@testing-library/react";
import type { ComponentProps, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import LiveVoiceSession, {
  BOOKING_CONTEXT_DELAY_MS,
  BOOKING_CONTEXTUAL_UPDATE,
} from "~/features/services-v2/demos/live-voice-session";

type ConversationCallbacks = {
  onConnect?: (props: { conversationId: string }) => void;
  onMessage?: (props: {
    message: string;
    role: "user" | "agent";
    event_id?: number;
  }) => void;
  onAgentResponseCorrection?: (props: {
    event_id: number;
    original_agent_response: string;
    corrected_agent_response: string;
  }) => void;
  onError?: () => void;
  onDisconnect?: (details: { reason: "user" | "agent" | "error" }) => void;
};

const elevenlabs = vi.hoisted(() => ({
  callbacks: undefined as ConversationCallbacks | undefined,
  endSession: vi.fn(),
  sendContextualUpdate: vi.fn(),
  startSession: vi.fn(),
  status: "disconnected",
}));

vi.mock("@elevenlabs/react", () => ({
  ConversationProvider: ({ children }: { children: ReactNode }) => children,
  useConversation: (callbacks: ConversationCallbacks) => {
    elevenlabs.callbacks = callbacks;
    return {
      status: elevenlabs.status,
      isSpeaking: false,
      isMuted: false,
      setMuted: vi.fn(),
      startSession: elevenlabs.startSession,
      endSession: elevenlabs.endSession,
      sendContextualUpdate: elevenlabs.sendContextualUpdate,
      getInputVolume: () => 0,
      getOutputVolume: () => 0,
    };
  },
}));

vi.mock("~/components/accessibility/use-reduced-motion", () => ({
  useReducedMotion: () => ({ reducedMotion: true }),
}));

vi.mock("~/components/ui/conversation", () => ({
  Conversation: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  ConversationContent: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  ConversationScrollButton: ({ className }: { className?: string }) => (
    <button type="button" className={className} aria-label="Scroll to latest" />
  ),
}));

vi.mock("~/components/ui/orb", () => ({
  Orb: () => null,
}));

vi.mock("~/components/ui/shimmering-text", () => ({
  ShimmeringText: ({ text }: { text: string }) => <>{text}</>,
}));

class ResizeObserverStub {
  disconnect() {
    return undefined;
  }
  observe() {
    return undefined;
  }
}

Object.defineProperty(globalThis, "ResizeObserver", {
  configurable: true,
  value: ResizeObserverStub,
});

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  configurable: true,
  value: () => null,
});

const copy: ComponentProps<typeof LiveVoiceSession>["copy"] = {
  orbSlot: "voice-agent",
  transcriptSlot: "voice-transcript",
  consoleLabel: "Live demo",
  transcriptLabel: "Live transcript",
  footHeading: "Heading",
  footBody: "Body",
  emptyTitle: "Start talking",
  emptyBody: "The conversation will appear here.",
};

function renderSession() {
  return render(
    <LiveVoiceSession
      copy={copy}
      accent={{ from: "#000", to: "#fff" }}
      autoStart={false}
      onStateChange={vi.fn()}
    />,
  );
}

function callbacks(): ConversationCallbacks {
  if (!elevenlabs.callbacks) {
    throw new Error("ElevenLabs callbacks were not registered");
  }
  return elevenlabs.callbacks;
}

describe("LiveVoiceSession transcript events", () => {
  beforeEach(() => {
    elevenlabs.callbacks = undefined;
    elevenlabs.status = "disconnected";
    elevenlabs.endSession.mockReset();
    elevenlabs.sendContextualUpdate.mockReset();
    elevenlabs.startSession.mockReset();
  });

  it("formats Grace's final response and replaces corrections without duplicates", () => {
    const { container } = renderSession();

    act(() => {
      callbacks().onMessage?.({
        message: "Monday thirteenth of July at twelve fifteen p m",
        role: "agent",
        event_id: 41,
      });
    });
    expect(screen.getByText("Monday 13th July at 12:15pm")).toBeInTheDocument();

    act(() => {
      callbacks().onAgentResponseCorrection?.({
        event_id: 41,
        original_agent_response: "Monday thirteenth of July at twelve fifteen p m",
        corrected_agent_response:
          "Tuesday the twenty first of July at nine a m. Email info at silverstone dash a i dot com.",
      });
    });

    expect(screen.queryByText("Monday 13th July at 12:15pm")).not.toBeInTheDocument();
    expect(screen.getByText(/Tuesday 21st July at 9:00am\. Email/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "info@silverstone-ai.com" }),
    ).toHaveAttribute("href", "mailto:info@silverstone-ai.com");
    expect(container.querySelectorAll(".ss-lvd__row")).toHaveLength(1);
  });

  it("does not duplicate a repeated committed event", () => {
    const { container } = renderSession();
    const event = {
      message: "silverstone dash ai dot com slash book",
      role: "agent" as const,
      event_id: 42,
    };

    act(() => {
      callbacks().onMessage?.(event);
      callbacks().onMessage?.(event);
    });

    expect(container.querySelectorAll(".ss-lvd__row")).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: "https://silverstone-ai.com/book" }),
    ).toHaveAttribute("href", "https://silverstone-ai.com/book");
  });

  it("leaves visitor transcripts untouched", () => {
    renderSession();
    const visitorText = "info at silverstone dash a i dot com";

    act(() => {
      callbacks().onMessage?.({ message: visitorText, role: "user", event_id: 7 });
    });

    expect(screen.getByText(visitorText)).toBeInTheDocument();
    expect(screen.queryByText("info@silverstone-ai.com")).not.toBeInTheDocument();
  });
});

describe("LiveVoiceSession booking context timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    elevenlabs.callbacks = undefined;
    elevenlabs.status = "disconnected";
    elevenlabs.endSession.mockReset();
    elevenlabs.sendContextualUpdate.mockReset();
    elevenlabs.startSession.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends one non-visible contextual update two minutes after connection", () => {
    renderSession();

    act(() => {
      callbacks().onConnect?.({ conversationId: "conversation-one" });
      vi.advanceTimersByTime(BOOKING_CONTEXT_DELAY_MS * 2);
    });

    expect(elevenlabs.sendContextualUpdate).toHaveBeenCalledTimes(1);
    expect(elevenlabs.sendContextualUpdate).toHaveBeenCalledWith(
      BOOKING_CONTEXTUAL_UPDATE,
    );
    expect(screen.queryByText(BOOKING_CONTEXTUAL_UPDATE)).not.toBeInTheDocument();
    expect(screen.getByText(copy.emptyBody)).toBeInTheDocument();
  });

  it("does not restart the timer for a duplicate connection callback", () => {
    renderSession();

    act(() => {
      callbacks().onConnect?.({ conversationId: "conversation-one" });
      vi.advanceTimersByTime(BOOKING_CONTEXT_DELAY_MS / 2);
      callbacks().onConnect?.({ conversationId: "conversation-one" });
      vi.advanceTimersByTime(BOOKING_CONTEXT_DELAY_MS / 2);
    });

    expect(elevenlabs.sendContextualUpdate).toHaveBeenCalledTimes(1);
  });

  it("clears the timer when the session disconnects", () => {
    renderSession();

    act(() => {
      callbacks().onConnect?.({ conversationId: "conversation-one" });
      callbacks().onDisconnect?.({ reason: "user" });
      vi.advanceTimersByTime(BOOKING_CONTEXT_DELAY_MS);
    });

    expect(elevenlabs.sendContextualUpdate).not.toHaveBeenCalled();
  });

  it("does not start a second timer for a disconnected conversation ID", () => {
    renderSession();

    act(() => {
      callbacks().onConnect?.({ conversationId: "conversation-one" });
      callbacks().onDisconnect?.({ reason: "user" });
      callbacks().onConnect?.({ conversationId: "conversation-one" });
      vi.advanceTimersByTime(BOOKING_CONTEXT_DELAY_MS);
    });

    expect(elevenlabs.sendContextualUpdate).not.toHaveBeenCalled();
  });

  it("clears the timer when the component unmounts", () => {
    const { unmount } = renderSession();

    act(() => {
      callbacks().onConnect?.({ conversationId: "conversation-one" });
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(BOOKING_CONTEXT_DELAY_MS);
    });

    expect(elevenlabs.sendContextualUpdate).not.toHaveBeenCalled();
  });

  it("prevents a replaced session's stale timer from firing", () => {
    renderSession();

    act(() => {
      callbacks().onConnect?.({ conversationId: "conversation-one" });
      vi.advanceTimersByTime(BOOKING_CONTEXT_DELAY_MS / 2);
      callbacks().onConnect?.({ conversationId: "conversation-two" });
      vi.advanceTimersByTime(BOOKING_CONTEXT_DELAY_MS / 2);
    });
    expect(elevenlabs.sendContextualUpdate).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(BOOKING_CONTEXT_DELAY_MS / 2);
    });
    expect(elevenlabs.sendContextualUpdate).toHaveBeenCalledTimes(1);
  });
});
