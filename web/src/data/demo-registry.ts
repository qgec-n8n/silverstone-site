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
 * watch the real-time transcript. The web-design showcase remains a reserved
 * preview frame (`services-v2/demos/browser-showcase`), so its copy still
 * says "preview".
 */
export type DemoEntry = {
  id: string;
  label: string;
  description: string;
  href: string;
};

export const DEMO_REGISTRY: readonly DemoEntry[] = [
  {
    id: "ai-receptionists",
    label: "AI receptionist",
    description: "Talk to Grace live — the AI front desk with a real-time transcript",
    href: "/services/ai-receptionists#demo-ai-receptionists",
  },
  {
    id: "ai-voice-agents",
    label: "Voice agent",
    description: "Speak to the live voice agent and watch it transcribe as you talk",
    href: "/services/ai-voice-agents#demo-ai-voice-agents",
  },
  {
    id: "web-design",
    label: "Web build",
    description: "Preview the reserved website showcase frames",
    href: "/services/web-design-development#demo-web-design",
  },
];
