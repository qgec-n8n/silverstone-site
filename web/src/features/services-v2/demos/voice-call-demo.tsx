/**
 * AI Voice Agents demo — live ElevenLabs voice console: the audio-reactive
 * orb connected to Grace (the public Silverstone receptionist demo agent)
 * with a real-time transcript panel beside the call.
 *
 * The data-config-slot values are the config slots reserved in the approved
 * services manifest for this section — the same slots, now live.
 */
import { Reveal, TextLink } from "../components/primitives";
import { LiveVoiceDemo, type LiveVoiceDemoCopy } from "./live-voice-demo";

const copy: LiveVoiceDemoCopy = {
  orbSlot: "futureVoiceElevenLabsAgent",
  transcriptSlot: "futureVoiceTranscriptSource",
  consoleLabel: "Live demo · Grace — AI voice agent",
  transcriptLabel: "Live transcript",
  footHeading: "Test a governed call flow in real time",
  footBody:
    "This is a live ElevenLabs voice agent — the same architecture we deploy for clients. Grace identifies herself as automated, keeps to an approved reception scenario, and everything she hears and says is written into the transcript beside the call as it happens.",
  emptyTitle: "Your conversation appears here",
  emptyBody:
    "Press start and speak naturally — both sides of the call are transcribed live, word by word, while you talk.",
};

export function VoiceCallDemo() {
  return (
    <div className="ss-srv2-showcase">
      <LiveVoiceDemo copy={copy} accent={{ from: "#d6f8fb", to: "#22d3ee" }} />
      <Reveal kind="section" className="ss-srv2-showcase__note">
        <p className="ss-srv2-showcase__aphorism">
          A polished voice is only the audible layer.
        </p>
        <p className="ss-srv2-showcase__body">
          The transcript beside the orb shows what the system heard, said and
          decided — the same evaluation view we use when governing production
          agents.
        </p>
        <TextLink href="/services/ai-receptionists">Explore AI Receptionists</TextLink>
      </Reveal>
    </div>
  );
}
