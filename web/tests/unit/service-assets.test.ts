import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  approvedMarketingImageFilenames,
  serviceImageUses,
} from "~/data/service-image-manifest";

const approved = new Set<string>(approvedMarketingImageFilenames);

describe("service image governance", () => {
  it("uses only exact approved marketing-image filenames", () => {
    for (const use of serviceImageUses) {
      expect(approved.has(use.desktopAsset), use.desktopAsset).toBe(true);
      expect(approved.has(use.mobileAsset), use.mobileAsset).toBe(true);
      expect(use.sourceType).toBe("approved-zip");
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
    const source = readFileSync(
      resolve(process.cwd(), "src/visual/data/page-modules.tsx"),
      "utf8",
    );

    expect(source).toContain("Reserved");
    expect(source).toContain("Website preview slot");
    expect(source).toContain("AI chat window");
    expect(source).toContain("ElevenLabs-ready");
    expect(source).toContain("Illustrative transcript window");
    expect(source).not.toMatch(/agent[_-]?id\\s*[:=]\\s*['"][^'"]+/i);
    expect(source).not.toMatch(/elevenlabs.*api[_-]?key/i);
  });
});
