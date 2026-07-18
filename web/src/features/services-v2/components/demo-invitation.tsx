import { Link } from "react-router";

import {
  ArrowRight,
  Bot,
  MessageSquare,
  Mic,
  Monitor,
  Sparkles,
  type LucideIcon,
} from "~/components/icons/lucide";

import { BorderBeam } from "./primitives";

type DemoInvitationAction = {
  href: string;
  label: string;
  detail: string;
  icon: LucideIcon;
};

const GRACE_ACTION: DemoInvitationAction = {
  href: "/services/ai-receptionists#demo-ai-receptionists",
  label: "Speak with Grace",
  detail: "Call our AI receptionist",
  icon: Mic,
};

const SAM_ACTION: DemoInvitationAction = {
  href: "/services/ai-receptionists#demo-sam-messaging",
  label: "Chat with Sam",
  detail: "Message our AI receptionist",
  icon: MessageSquare,
};

const VOICE_GRACE_ACTION: DemoInvitationAction = {
  href: "/services/ai-voice-agents#demo-ai-voice-agents",
  label: "Speak with Grace",
  detail: "Try our live voice agent",
  icon: Mic,
};

const WEB_DESIGN_ACTION: DemoInvitationAction = {
  href: "/services/web-design-development#demo-web-design",
  label: "Explore the live builds",
  detail: "Two production websites, desktop and mobile",
  icon: Monitor,
};

type DemoInvitationVariant = "receptionists" | "voice" | "web-design";

const invitationByVariant: Record<
  DemoInvitationVariant,
  {
    actions: DemoInvitationAction[];
    body: string;
    heading: string;
    signalIcon: LucideIcon;
  }
> = {
  receptionists: {
    actions: [GRACE_ACTION, SAM_ACTION],
    body: "Call Grace or message Sam. Both demos are live, governed and ready now.",
    heading: "Meet the front desk before you hire it.",
    signalIcon: Bot,
  },
  voice: {
    actions: [VOICE_GRACE_ACTION],
    body: "Speak naturally with a live voice agent and watch both sides transcribe in real time.",
    heading: "Hear the agent before you build it.",
    signalIcon: Bot,
  },
  "web-design": {
    actions: [WEB_DESIGN_ACTION],
    body: "Step inside two finished production websites and compare every detail across desktop and mobile.",
    heading: "Experience the finished product before you commission it.",
    signalIcon: Monitor,
  },
};

export function DemoInvitation({ variant }: { variant: DemoInvitationVariant }) {
  const {
    actions,
    body,
    heading,
    signalIcon: SignalIcon,
  } = invitationByVariant[variant];

  return (
    <section className="ss-srv2-demo-invite" aria-labelledby={`demo-invite-${variant}`}>
      <div className="ss-srv2__container">
        <div className="ss-srv2-demo-invite__surface ss-srv2-beam-border">
          <div className="ss-srv2-demo-invite__signal" aria-hidden="true">
            <span />
            <SignalIcon />
          </div>
          <div className="ss-srv2-demo-invite__copy">
            <span className="ss-srv2-demo-invite__eyebrow">
              <Sparkles aria-hidden="true" /> Live systems online
            </span>
            <h2 id={`demo-invite-${variant}`}>{heading}</h2>
            <p>{body}</p>
          </div>
          <div className="ss-srv2-demo-invite__actions">
            {actions.map(({ href, label, detail, icon: Icon }) => (
              <Link
                className="ss-focus-ring ss-srv2-demo-invite__action"
                key={href}
                to={href}
              >
                <span className="ss-srv2-demo-invite__action-icon">
                  <Icon aria-hidden="true" />
                </span>
                <span>
                  <strong>{label}</strong>
                  <small>{detail}</small>
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
            ))}
          </div>
          <BorderBeam />
        </div>
      </div>
    </section>
  );
}
