/**
 * AI Voice Agents demo — reserved ElevenLabs call surface + adjacent transcript,
 * using the approved Section-7 copy verbatim (customer-facing strings only).
 */
import { PhoneCall, MessageSquare } from "~/components/icons/lucide";

import { Reveal, TextLink } from "../components/primitives";
import { CallStage, ReservedSurface, TranscriptStage } from "./reserved-surface";

export function VoiceCallDemo() {
  return (
    <div className="ss-srv2-showcase">
      <div className="ss-srv2-showcase__frames">
        <ReservedSurface
          configSlot="futureVoiceElevenLabsAgent"
          icon={PhoneCall}
          label="Reserved voice experience · Live call"
          heading="Test a governed call flow in real time"
          body="This surface is prepared for a future ElevenLabs voice-agent integration using an approved scenario. The final experience will identify its automated nature, request any required permission and keep the available actions within the demonstrated flow."
          privacyNote="No microphone access, telephone number, call recording or live agent is currently connected."
          status="Integration reserved. Awaiting approved credentials, voice, script and production controls."
        >
          <CallStage />
        </ReservedSurface>
        <ReservedSurface
          configSlot="futureVoiceTranscriptSource"
          icon={MessageSquare}
          label="Reserved evaluation view · Transcript"
          heading="See what the system heard, decided and handed over"
          body="The transcript surface will display an approved illustrative conversation beside call states, captured details, tool outcomes and escalation notes. It is designed for evaluation — not to imply a real customer conversation."
          privacyNote="Sample text must remain synthetic until a lawful, consented and appropriately redacted production source is approved."
          status="Transcript layout reserved. No live transcript source is connected."
          delayMs={90}
        >
          <TranscriptStage />
        </ReservedSurface>
      </div>
      <Reveal kind="section" className="ss-srv2-showcase__note">
        <p className="ss-srv2-showcase__aphorism">
          A polished voice is only the audible layer.
        </p>
        <p className="ss-srv2-showcase__body">
          The transcript and state history reveal whether the system is operating
          responsibly.
        </p>
        <TextLink href="/services/ai-receptionists">Explore AI Receptionists</TextLink>
      </Reveal>
    </div>
  );
}
