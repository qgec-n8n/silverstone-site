import approvedServicesJson from "~/content/services/generated/approved-services.json";

export type ApprovedServiceRoute =
  | "/services/web-design-development"
  | "/services/app-development"
  | "/services/ai-voice-agents"
  | "/services/ai-receptionists"
  | "/services/content-creation"
  | "/services/ai-automation"
  | "/services/ai-consulting";

export type ApprovedCopyCard = {
  label: string;
  body: string;
};

export type ApprovedServiceContent = {
  route: ApprovedServiceRoute;
  sourceFilename: string;
  sourcePath: string;
  sourceSha256: string;
  metadata: {
    title: string;
    metaDescription: string;
    openGraphTitle: string;
    openGraphDescription: string;
    canonicalRoute: ApprovedServiceRoute;
    h1: string;
    h2: string[];
    h3: string[];
    breadcrumbs: string;
    schemaTypes: string[];
  };
  routeEntry: {
    loaderText: string;
    pill: string;
    title: string;
    subtitle: string;
    buttonLabel: string;
  };
  publicCopy: string;
  publicHeadings: {
    h1: string;
    h2: string[];
    h3: string[];
  };
  componentMicrocopy: {
    rawMarkdown: string;
    featureCards: ApprovedCopyCard[];
    outcomeCards: ApprovedCopyCard[];
    processSteps: ApprovedCopyCard[];
    benchmark: {
      metrics: string[];
      caption: string;
    };
    ctaButton: string;
    finalReassurance: string;
    faqLabels: string[];
  };
  demo: {
    rawMarkdown: string;
    configSlots: string[];
  };
  acceptance: {
    distinctivePhrases: string[];
    faqCount: number;
  };
};

export const approvedServicesByRoute = approvedServicesJson as Record<
  ApprovedServiceRoute,
  ApprovedServiceContent
>;

export const approvedServiceRoutes = Object.keys(
  approvedServicesByRoute,
) as ApprovedServiceRoute[];

export function isApprovedServiceRoute(route: string): route is ApprovedServiceRoute {
  return Object.hasOwn(approvedServicesByRoute, route);
}

export function getApprovedServiceContent(
  route: string,
): ApprovedServiceContent | undefined {
  return isApprovedServiceRoute(route) ? approvedServicesByRoute[route] : undefined;
}
