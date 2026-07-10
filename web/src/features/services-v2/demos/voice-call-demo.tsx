/**
 * AI Voice Agents demo — live ElevenLabs voice console: the audio-reactive
 * orb connected to Grace (the public Silverstone receptionist demo agent)
 * with a real-time transcript panel beside the call.
 *
 * The data-config-slot values are the config slots reserved in the approved
 * services manifest for this section — the same slots, now live.
 */
import { LiveVoiceDemo, type LiveVoiceDemoCopy } from "./live-voice-demo";

const copy: LiveVoiceDemoCopy = {
  orbSlot: "futureVoiceElevenLabsAgent",
  transcriptSlot: "futureVoiceTranscriptSource",
  consoleLabel: "Live demo · Grace — AI voice agent",
  transcriptLabel: "Live transcript",
  footHeading: "Test Grace's governed call flow",
  footBody:
    "Ask a routine question and watch both sides appear in the transcript. Grace stays within an approved reception scenario.",
  emptyTitle: "Your conversation appears here",
  emptyBody:
    "Press start and speak naturally — both sides of the call are transcribed live, word by word, while you talk.",
};

export function VoiceCallDemo() {
  return (
    <div className="ss-srv2-showcase">
      <LiveVoiceDemo
        copy={copy}
        accent={{ from: "#d6f8fb", to: "#22d3ee" }}
        reveal={false}
      />
    </div>
  );
}
