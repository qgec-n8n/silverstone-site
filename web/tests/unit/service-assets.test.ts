import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { approvedServicesByRoute } from "~/content/services/approved-services";
import {
  approvedMarketingImageFilenames,
  serviceImageUses,
} from "~/data/service-image-manifest";

const approved = new Set<string>(approvedMarketingImageFilenames);

describe("service image governance", () => {
  it("uses only exact approved marketing-image filenames, or a documented generated image", () => {
    for (const use of serviceImageUses) {
      if (use.sourceType === "approved-zip") {
        expect(approved.has(use.desktopAsset), use.desktopAsset).toBe(true);
        expect(approved.has(use.mobileAsset), use.mobileAsset).toBe(true);
      } else {
        // Generated images are not part of the approved-zip filename set by
        // definition; the rationale must record provenance instead.
        expect(use.rationale.length, use.route).toBeGreaterThan(20);
      }
      expect(use.alt.trim(), use.route).not.toHaveLength(0);
      expect(use.desktopDimensions.width).toBeGreaterThan(0);
      expect(use.mobileDimensions.height).toBeGreaterThan(0);
    }
  });

  it("has copied every selected approved file into the public approved-images directory", () => {
    for (const use of serviceImageUses) {
      for (const filename of [use.desktopAsset, use.mobileAsset]) {
        expect(
          existsSync(resolve(process.cwd(), "public/approved-images", filename)),
          filename,
        ).toBe(true);
      }
    }
  });
});

describe("required demo placeholders", () => {
  it("keeps requested future-demo service surfaces available", () => {
    const demoRendererPaths = [
      "src/features/services-v2/demos/browser-showcase.tsx",
      "src/features/services-v2/demos/reserved-surface.tsx",
      "src/features/services-v2/demos/voice-call-demo.tsx",
      "src/features/services-v2/demos/receptionist-demo.tsx",
    ];
    const renderers = demoRendererPaths
      .map((path) => readFileSync(resolve(process.cwd(), path), "utf8"))
      .join("\n");
    const manifest = JSON.stringify(approvedServicesByRoute);

    expect(manifest).toContain("Reserved");
    expect(manifest).toContain("live website showcase");
    expect(manifest).toContain("AI chat window");
    expect(manifest).toContain("ElevenLabs-ready");
    expect(manifest).toContain("transcript-window placeholder");
    expect(manifest).toContain("futureWebsitePreviewPrimaryUrl");
    expect(manifest).toContain("futureVoiceElevenLabsAgent");
    expect(manifest).toContain("futureReceptionistChatEmbedUrl");
    expect(renderers).toContain("data-config-slot");
    expect(renderers).not.toMatch(/agent[_-]?id\s*[:=]\s*['"][^'"]+/i);
    expect(renderers).not.toMatch(/elevenlabs.*api[_-]?key/i);
    expect(manifest).not.toMatch(/agent[_-]?id\s*[:=]\s*['"][^'"]+/i);
    expect(manifest).not.toMatch(/elevenlabs.*api[_-]?key/i);
  });
});
