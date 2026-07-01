/**
 * AI Receptionists demo — reserved AI chat surface + reserved ElevenLabs call
 * surface, using the approved Section-7 copy verbatim (customer-facing only).
 */
import { MessageSquare, PhoneCall } from "~/components/icons/lucide";

import { Reveal, TextLink } from "../components/primitives";
import { CallStage, ChatStage, ReservedSurface } from "./reserved-surface";

export function ReceptionistDemo() {
  return (
    <div className="ss-srv2-showcase">
      <div className="ss-srv2-showcase__frames">
        <ReservedSurface
          configSlot="futureReceptionistChatEmbedUrl"
          icon={MessageSquare}
          label="Reserved front-desk experience · Chat"
          heading="Follow a routine enquiry from question to destination"
          body="This window is prepared for an approved AI receptionist chat flow covering a bounded scenario such as a service question, callback request or appointment enquiry. The final flow will show what is answered, what is collected and when a person takes over."
          privacyNote="No real enquiry, visitor identity, CRM record or production conversation is connected."
          status="Chat integration reserved. Awaiting approved content, rules and destination systems."
        >
          <ChatStage />
        </ReservedSurface>
        <ReservedSurface
          configSlot="futureReceptionistElevenLabsAgent"
          icon={PhoneCall}
          label="Reserved front-desk experience · Call"
          heading="Hear a controlled reception flow, not an unrestricted agent"
          body="This surface is prepared for a future ElevenLabs call configuration using a clearly disclosed, approved scenario. Booking, transfer and follow-up actions will remain limited to the demonstrated rules."
          privacyNote="No microphone, phone number, call recording or live voice agent is currently connected."
          status="Call integration reserved. Awaiting credentials, voice testing, consent wording and approved scripts."
          delayMs={90}
        >
          <CallStage />
        </ReservedSurface>
      </div>
      <Reveal kind="section" className="ss-srv2-showcase__note">
        <p className="ss-srv2-showcase__aphorism">One desk. Two channels.</p>
        <p className="ss-srv2-showcase__body">
          The same answer library, action rules and human boundary — until the operating
          model and privacy controls are ready, these previews remain intentionally
          inactive.
        </p>
        <TextLink href="/services/ai-voice-agents">
          Explore custom AI Voice Agents
        </TextLink>
      </Reveal>
    </div>
  );
}
