import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  approvedServiceRoutes,
  approvedServicesByRoute,
} from "~/content/services/approved-services";
import { getCanonicalRouteExperienceByPath } from "~/data/route-experiences";
import { benchmarkDisclaimer } from "~/data/benchmark-metrics";
import { serviceCopyByRoute } from "~/features/services-v2/content/copy";

const expectedRoutes = [
  "/services/web-design-development",
  "/services/app-development",
  "/services/ai-voice-agents",
  "/services/ai-receptionists",
  "/services/content-creation",
  "/services/ai-automation",
  "/services/ai-consulting",
] as const;

const prototypeResidue = [
  "built around a clear business problem",
  "Service architecture",
  "Conversion path mapper",
  "First-release state map",
  "Exception-aware workflow run",
];

describe("approved service content pack", () => {
  it("maps exactly the seven canonical service routes", () => {
    expect(approvedServiceRoutes).toEqual(expectedRoutes);
  });

  it("records source hashes that match copied Markdown files", () => {
    for (const route of expectedRoutes) {
      const service = approvedServicesByRoute[route];
      const markdown = readFileSync(
        resolve(process.cwd(), "..", service.sourcePath),
        "utf8",
      );
      expect(createHash("sha256").update(markdown).digest("hex")).toBe(
        service.sourceSha256,
      );
    }
  });

  it("exposes required route-entry fields from Sections 3 and 4", () => {
    const web = approvedServicesByRoute["/services/web-design-development"];
    expect(web.routeEntry.loaderText).toBe(
      "Aligning message, movement and measurement",
    );
    expect(web.routeEntry.pill).toBe(
      "Web design & development · London agency, UK & US",
    );
    expect(web.routeEntry.title).toBe("Web design and development that converts");
    expect(web.routeEntry.buttonLabel).toBe("Explore the commercial website system");

    for (const route of expectedRoutes) {
      const service = approvedServicesByRoute[route];
      const experience = getCanonicalRouteExperienceByPath(route);
      expect(experience?.loaderText).toBe(service.routeEntry.loaderText);
      expect(experience?.pill).toBe(service.routeEntry.pill);
      expect(experience?.title).toBe(service.routeEntry.title);
      expect(experience?.subtitle).toBe(service.routeEntry.subtitle);
      expect(experience?.buttonLabel).toBe(service.routeEntry.buttonLabel);
    }
  });

  it("contains distinctive public body phrases and benchmark evidence for every route", () => {
    for (const route of expectedRoutes) {
      const service = approvedServicesByRoute[route];
      for (const phrase of service.acceptance.distinctivePhrases) {
        expect(
          `${service.routeEntry.loaderText}\n${service.routeEntry.pill}\n${service.routeEntry.title}\n${service.routeEntry.subtitle}\n${service.routeEntry.buttonLabel}\n${service.publicCopy}\n${service.componentMicrocopy.rawMarkdown}\n${service.demo.rawMarkdown}`,
          `${route}: ${phrase}`,
        ).toContain(phrase);
      }
      expect(
        `${service.publicCopy}\n${service.componentMicrocopy.rawMarkdown}\n${benchmarkDisclaimer}`,
      ).toContain(benchmarkDisclaimer);
      expect(service.componentMicrocopy.benchmark.metrics).toHaveLength(3);
      expect(service.publicHeadings.h2).toHaveLength(8);
      expect(service.acceptance.faqCount).toBeGreaterThanOrEqual(5);
      for (const residue of prototypeResidue) {
        expect(service.publicCopy, `${route}: ${residue}`).not.toContain(residue);
      }
    }
  });

  it("preserves mandatory demo configuration slots", () => {
    expect(
      approvedServicesByRoute["/services/web-design-development"].demo.configSlots,
    ).toEqual(["futureWebsitePreviewPrimaryUrl", "futureWebsitePreviewSecondaryUrl"]);
    expect(
      approvedServicesByRoute["/services/ai-voice-agents"].demo.configSlots,
    ).toEqual(["futureVoiceElevenLabsAgent", "futureVoiceTranscriptSource"]);
    expect(
      approvedServicesByRoute["/services/ai-receptionists"].demo.configSlots,
    ).toEqual(["futureReceptionistChatEmbedUrl", "futureReceptionistElevenLabsAgent"]);
  });

  it("keeps approved metadata H1 values aligned with rendered service H1 values", () => {
    for (const route of expectedRoutes) {
      const renderedH1 = serviceCopyByRoute[route].h1.replace(/\*/g, "");
      expect(approvedServicesByRoute[route].metadata.h1, route).toBe(renderedH1);
      expect(approvedServicesByRoute[route].publicHeadings.h1, route).toBe(renderedH1);
    }
  });

  it("does not include duplicate service aliases", () => {
    expect(approvedServiceRoutes).not.toContain("/services/website-design-development");
    expect(approvedServiceRoutes).not.toContain("/services/ai-agents-automation");
  });
});
