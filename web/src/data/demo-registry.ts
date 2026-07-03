/**
 * Central list of every demo-preview section on the site — read by the
 * floating demos launcher so adding or removing one means editing this list
 * once, not the launcher component. Each `href` is a deep link (path +
 * section id) resolved through the same shared mechanism as the Book CTAs
 * (`useDeepLinkScroll`), so a click lands on the exact section regardless of
 * which route the visitor is currently on.
 *
 * These are reserved preview frames (see `services-v2/demos/reserved-surface`)
 * rather than fully wired live integrations, so the copy here says "preview",
 * not "live" — matching the honest "reserved / intentionally inactive"
 * language already used on the pages themselves.
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
    description: "Preview the reserved front-desk chat and call surfaces",
    href: "/services/ai-receptionists#demo-ai-receptionists",
  },
  {
    id: "ai-voice-agents",
    label: "Voice agent",
    description: "Preview the reserved inbound-call walkthrough",
    href: "/services/ai-voice-agents#demo-ai-voice-agents",
  },
  {
    id: "web-design",
    label: "Web build",
    description: "Preview the reserved website showcase frames",
    href: "/services/web-design-development#demo-web-design",
  },
];
