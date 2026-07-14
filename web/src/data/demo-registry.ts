/**
 * Central list of every demo-preview section on the site — read by the
 * floating demos launcher so adding or removing one means editing this list
 * once, not the launcher component. Each `href` is a deep link (path +
 * section id) resolved through the same shared mechanism as the Book CTAs
 * (`useDeepLinkScroll`), so a click lands on the exact section regardless of
 * which route the visitor is currently on.
 *
 * The two ElevenLabs voice surfaces are live, fully functional demos
 * (`services-v2/demos/live-voice-demo`): visitors can speak to Grace and
 * watch the real-time transcript. The web-design showcase
 * (`services-v2/demos/browser-showcase`) presents two live client websites
 * in interactive browser windows.
 */
export type DemoEntry = {
  id: string;
  label: string;
  description: string;
  href: string;
};

export const DEMO_REGISTRY: readonly DemoEntry[] = [
  {
    id: "grace-receptionist",
    label: "Speak with Grace",
    description: "Call our AI receptionist and see every word transcribed live",
    href: "/services/ai-receptionists#demo-ai-receptionists",
  },
  {
    id: "sam-receptionist",
    label: "Chat with Sam",
    description: "Message our AI receptionist and test his instant written replies",
    href: "/services/ai-receptionists#demo-sam-messaging",
  },
  {
    id: "ai-voice-agents",
    label: "Try a voice agent",
    description: "Speak naturally and watch the live call transcribe as you talk",
    href: "/services/ai-voice-agents#demo-ai-voice-agents",
  },
  {
    id: "web-design",
    label: "Explore live builds",
    description: "Browse two real client websites inside interactive windows",
    href: "/services/web-design-development#demo-web-design",
  },
];
