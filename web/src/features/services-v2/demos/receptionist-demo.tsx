/**
 * AI Receptionists demo — live ElevenLabs front-desk console: talk to Grace,
 * the Silverstone website receptionist demo agent, and watch the conversation
 * transcribed in real time beside the call.
 *
 * The data-config-slot values are the config slots reserved in the approved
 * services manifest for this section — the same slots, now live.
 */
import { LiveVoiceDemo, type LiveVoiceDemoCopy } from "./live-voice-demo";

const copy: LiveVoiceDemoCopy = {
  orbSlot: "futureReceptionistElevenLabsAgent",
  transcriptSlot: "futureReceptionistChatEmbedUrl",
  consoleLabel: "Live demo · Grace — AI receptionist",
  transcriptLabel: "Live transcript",
  footHeading: "Ask Grace a front-desk question",
  footBody:
    "Test instant answers, booking and callback handling, and human handover. Every word appears in the live transcript.",
  emptyTitle: "The front desk, in writing",
  emptyBody:
    "Press start and ask a routine question — your words and Grace's replies appear here live, exactly as a reception transcript would.",
};

export function ReceptionistDemo() {
  return (
    <div className="ss-srv2-showcase">
      <LiveVoiceDemo
        copy={copy}
        accent={{ from: "#d9e9fb", to: "#59a6e6" }}
        reveal={false}
      />
    </div>
  );
}
