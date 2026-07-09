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

describe("service demo surfaces", () => {
  // The ElevenLabs voice demo went live on 2026-07-09 (owner-requested):
  // the reserved call/chat/transcript placeholders were replaced by the
  // live-voice-demo console wired to the public "Grace" agent. The web-design
  // showcase remains a reserved preview frame.
  const liveDemoRendererPaths = [
    "src/features/services-v2/demos/live-voice-demo.tsx",
    "src/features/services-v2/demos/live-voice-session.tsx",
    "src/features/services-v2/demos/live-voice-chrome.tsx",
    "src/features/services-v2/demos/voice-call-demo.tsx",
    "src/features/services-v2/demos/receptionist-demo.tsx",
  ];
  const agentConfigPath = "src/features/services-v2/demos/elevenlabs-agent-config.ts";

  it("keeps the live voice demo wired to the manifest's demo config slots", () => {
    const renderers = liveDemoRendererPaths
      .map((path) => readFileSync(resolve(process.cwd(), path), "utf8"))
      .join("\n");
    const showcase = readFileSync(
      resolve(process.cwd(), "src/features/services-v2/demos/browser-showcase.tsx"),
      "utf8",
    );
    const manifest = JSON.stringify(approvedServicesByRoute);

    // Approved manifest content is unchanged; the demo renderers activate
    // the exact config slots it reserved for these sections.
    expect(manifest).toContain("futureWebsitePreviewPrimaryUrl");
    expect(manifest).toContain("futureVoiceElevenLabsAgent");
    expect(manifest).toContain("futureReceptionistChatEmbedUrl");
    expect(renderers).toContain("data-config-slot");
    expect(renderers).toContain('"futureVoiceElevenLabsAgent"');
    expect(renderers).toContain('"futureVoiceTranscriptSource"');
    expect(renderers).toContain('"futureReceptionistElevenLabsAgent"');
    expect(renderers).toContain('"futureReceptionistChatEmbedUrl"');
    expect(showcase).toContain("data-config-slot");

    // Honest-copy guard: the live surfaces must disclose the automated agent
    // and the processing partner.
    expect(renderers).toMatch(/ELEVENLABS_DEMO_DISCLOSURE/);
  });

  it("exposes only the public agent id, and only from the config module", () => {
    const agentConfig = readFileSync(resolve(process.cwd(), agentConfigPath), "utf8");
    const renderers = liveDemoRendererPaths
      .map((path) => readFileSync(resolve(process.cwd(), path), "utf8"))
      .join("\n");
    const manifest = JSON.stringify(approvedServicesByRoute);

    // The config module holds exactly one public agent id (the value
    // ElevenLabs publishes in its widget embed snippet — safe for browsers).
    const ids = agentConfig.match(/"agent_[a-z0-9]+"/g) ?? [];
    expect(ids).toHaveLength(1);

    // No renderer hardcodes an agent id; they import the config module.
    expect(renderers).not.toMatch(/["']agent_[a-z0-9]+["']/);
    expect(renderers).toContain("ELEVENLABS_DEMO_AGENT_ID");
    expect(manifest).not.toMatch(/agent[_-]?id\s*[:=]\s*['"][^'"]+/i);

    // Hard rule: no ElevenLabs API key or secret anywhere in these files.
    for (const text of [agentConfig, renderers, manifest]) {
      expect(text).not.toMatch(/api[_-]?key/i);
      expect(text).not.toMatch(/\bsk_[a-zA-Z0-9]{8,}/);
      expect(text).not.toMatch(/\bxi-api-key\b/i);
    }
  });
});
