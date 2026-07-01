/**
 * Per-route art direction for the services-v2 system.
 *
 * Each service shares the dark cinematic Silverstone language but carries its
 * own accent pairing, primary icon and approved marketing image. Image `alt`
 * and `caption` strings are preserved verbatim from the approved copy pack —
 * they must never describe conceptual UI as a live client deployment.
 */
import type { ApprovedServiceRoute } from "~/content/services/approved-services";
import {
  Headset,
  PencilRuler,
  PhoneCall,
  Search,
  Smartphone,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "~/components/icons/lucide";

export type ServiceVariant =
  | "web"
  | "app"
  | "voice"
  | "reception"
  | "content"
  | "automation"
  | "consulting";

export type RouteArt = {
  variant: ServiceVariant;
  /** Short discipline label shown in the section eyebrow. */
  discipline: string;
  /** Accent gradient endpoints, drawn from the cinematic spectral palette. */
  accentFrom: string;
  accentTo: string;
  icon: LucideIcon;
  image: {
    desktop: string;
    mobile: string;
    width: number;
    height: number;
    alt: string;
    caption: string;
  };
};

export const routeArt: Record<ApprovedServiceRoute, RouteArt> = {
  "/services/web-design-development": {
    variant: "web",
    discipline: "Web design & development",
    accentFrom: "#22d3ee",
    accentTo: "#a97cc0",
    icon: PencilRuler,
    image: {
      desktop: "/approved-images/general-services-1.png",
      mobile: "/approved-images/general-services-1-mobile.png",
      width: 2528,
      height: 1696,
      alt: "Illustrative reception and enquiry-capture panel.",
      caption:
        "Illustrative system view. This conceptual panel supports the conversion-system narrative and is not a live client dashboard.",
    },
  },
  "/services/app-development": {
    variant: "app",
    discipline: "App development",
    accentFrom: "#38bdf8",
    accentTo: "#5b62f0",
    icon: Smartphone,
    image: {
      desktop: "/approved-images/services_data_integration.jpg",
      mobile: "/approved-images/services_data_integration_mobile.jpg",
      width: 2528,
      height: 1696,
      alt: "Illustrative systems and data integration panel.",
      caption:
        "Illustrative product and systems panel. It explains app architecture and operational data flow, not a deployed client application.",
    },
  },
  "/services/ai-voice-agents": {
    variant: "voice",
    discipline: "AI voice agents",
    accentFrom: "#7fe9f0",
    accentTo: "#22d3ee",
    icon: PhoneCall,
    image: {
      desktop: "/approved-images/services_lead_followup.jpg",
      mobile: "/approved-images/services_lead_followup_mobile.jpg",
      width: 2528,
      height: 1696,
      alt: "Illustrative automated lead follow-up panel.",
      caption:
        "Illustrative conversation and follow-up surface. Call states and outcomes are synthetic until approved integrations exist.",
    },
  },
  "/services/ai-receptionists": {
    variant: "reception",
    discipline: "AI receptionists",
    accentFrom: "#59a6e6",
    accentTo: "#22d3ee",
    icon: Headset,
    image: {
      // Generated via gpt-image-2-mcp (2026-07-01) so this route no longer
      // duplicates the Web Design page's general-services-1.png. Provenance
      // recorded in docs/silverstone-transformation/CLAUDE_CAPABILITY_AND_DEPENDENCY_AUDIT.md.
      desktop: "/approved-images/receptionists-hero.png",
      mobile: "/approved-images/receptionists-hero-mobile.png",
      width: 2528,
      height: 1696,
      alt: "Illustrative front-desk reception panel showing a call being answered, a booking confirmed, and an enquiry escalated to a person.",
      caption:
        "Illustrative front-desk operating surface. It shows reception routing concepts, not live customer conversations.",
    },
  },
  "/services/content-creation": {
    variant: "content",
    discipline: "Content creation",
    accentFrom: "#c47bd6",
    accentTo: "#7fe9f0",
    icon: Sparkles,
    image: {
      desktop: "/approved-images/general-services-2a.png",
      mobile: "/approved-images/general-services-2a-mobile.png",
      width: 2528,
      height: 1696,
      alt: "Illustrative modular service package panel.",
      caption:
        "Illustrative editorial-system panel. The checklist is conceptual and does not promise a fixed content volume.",
    },
  },
  "/services/ai-automation": {
    variant: "automation",
    discipline: "AI automation",
    accentFrom: "#22d3ee",
    accentTo: "#7c5cff",
    icon: Workflow,
    image: {
      desktop: "/approved-images/services_workflow_automation.jpg",
      mobile: "/approved-images/services_workflow_automation_mobile.jpg",
      width: 2528,
      height: 1696,
      alt: "Illustrative workflow automation and reporting interface.",
      caption:
        "Illustrative workflow and observability panel. It is conceptual and separated from benchmark evidence.",
    },
  },
  "/services/ai-consulting": {
    variant: "consulting",
    discipline: "AI & automation consulting",
    accentFrom: "#7fe9f0",
    accentTo: "#5b62f0",
    icon: Search,
    image: {
      desktop: "/approved-images/services_consulting.jpg",
      mobile: "/approved-images/services_consulting_mobile.jpg",
      width: 2528,
      height: 1696,
      alt: "Illustrative AI consulting and readiness audit panel.",
      caption:
        "Illustrative advisory and readiness panel. It is not a client audit, procurement recommendation or forecast.",
    },
  },
};
