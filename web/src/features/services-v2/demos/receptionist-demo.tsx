/**
 * AI Receptionists demo — live ElevenLabs front-desk console: talk to Grace,
 * the Silverstone website receptionist demo agent, and watch the conversation
 * transcribed in real time beside the call.
 *
 * The data-config-slot values are the config slots reserved in the approved
 * services manifest for this section — the same slots, now live.
 */
import { Reveal, TextLink } from "../components/primitives";
import { LiveVoiceDemo, type LiveVoiceDemoCopy } from "./live-voice-demo";

const copy: LiveVoiceDemoCopy = {
  orbSlot: "futureReceptionistElevenLabsAgent",
  transcriptSlot: "futureReceptionistChatEmbedUrl",
  consoleLabel: "Live demo · Grace — AI receptionist",
  transcriptLabel: "Live transcript",
  footHeading: "Hear a controlled reception flow, not an unrestricted agent",
  footBody:
    "Grace is our live front-desk demo. Ask what an AI receptionist can answer, how a booking or callback would be handled, or what happens when a person needs to take over — she keeps to an approved reception scenario and every word is transcribed beside the call in real time.",
  emptyTitle: "The front desk, in writing",
  emptyBody:
    "Press start and ask a routine question — your words and Grace's replies appear here live, exactly as a reception transcript would.",
};

export function ReceptionistDemo() {
  return (
    <div className="ss-srv2-showcase">
      <LiveVoiceDemo copy={copy} accent={{ from: "#d9e9fb", to: "#59a6e6" }} />
      <Reveal kind="section" className="ss-srv2-showcase__note">
        <p className="ss-srv2-showcase__aphorism">One desk. Two channels.</p>
        <p className="ss-srv2-showcase__body">
          The same governed answer library behind the voice you just heard also
          powers written channels — with the same booking rules, routing and
          human boundary.
        </p>
        <TextLink href="/services/ai-voice-agents">
          Explore custom AI Voice Agents
        </TextLink>
      </Reveal>
    </div>
  );
}
