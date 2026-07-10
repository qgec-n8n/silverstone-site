import { act, render, waitFor } from "@testing-library/react";
import type { ComponentProps, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SamChatSession from "~/features/services-v2/demos/sam-chat-session";

const botpress = vi.hoisted(() => ({
  messages: [] as {
    id: string;
    authorId: string;
    block: { type: "text"; text: string };
  }[],
  sendMessage: vi.fn(),
  userId: "user-one",
}));

vi.mock("@botpress/webchat", () => ({
  WebchatProvider: ({ children }: { children: ReactNode }) => children,
  useActiveConversation: () => ({
    error: undefined,
    isAwaitingResponse: false,
    isTyping: false,
    messages: botpress.messages,
    sendMessage: botpress.sendMessage,
    status: "connected",
  }),
  useWebchatContext: () => ({
    userCredentials: { userId: botpress.userId },
  }),
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

const copy: ComponentProps<typeof SamChatSession>["copy"] = {
  composerHint: "Hint",
  composerPlaceholder: "Message Sam",
  consoleLabel: "Sam demo",
  footBody: "Body",
  footHeading: "Heading",
  threadLabel: "Message thread",
};

describe("SamChatSession", () => {
  beforeEach(() => {
    botpress.messages = [];
    botpress.sendMessage.mockReset();
    botpress.userId = "user-one";
  });

  it("retries the queued opening message after Botpress replaces the active user", async () => {
    let resolveFirstSend: (() => void) | undefined;
    botpress.sendMessage
      .mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            resolveFirstSend = resolve;
          }),
      )
      .mockResolvedValue(undefined);

    const props: ComponentProps<typeof SamChatSession> = {
      copy,
      engaged: true,
      initialText: "What can you do for a business like mine?",
      onEngage: vi.fn(),
      onStateChange: vi.fn(),
    };
    const { rerender } = render(<SamChatSession {...props} />);

    await waitFor(() => expect(botpress.sendMessage).toHaveBeenCalledTimes(1));

    botpress.userId = "user-two";
    rerender(<SamChatSession {...props} />);

    await act(async () => {
      resolveFirstSend?.();
      await Promise.resolve();
    });

    await waitFor(() => expect(botpress.sendMessage).toHaveBeenCalledTimes(2));
    expect(botpress.sendMessage).toHaveBeenLastCalledWith({
      text: "What can you do for a business like mine?",
      type: "text",
    });
  });
});
