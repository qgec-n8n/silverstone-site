import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  ALL_INTEGRATIONS,
  INTEGRATIONS_ROW_A,
  INTEGRATIONS_ROW_B,
  INTEGRATIONS_ROW_C,
} from "~/data/home-v2";

const socialRequired = [
  "X",
  "Instagram",
  "Facebook",
  "TikTok",
  "LinkedIn",
  "YouTube",
  "Pinterest",
  "Snapchat",
  "Threads",
] as const;

const microsoftRequired = [
  "Microsoft Word",
  "Microsoft Excel",
  "Microsoft PowerPoint",
  "Microsoft Outlook",
  "Microsoft Teams",
  "OneDrive",
  "SharePoint",
  "Microsoft 365",
  "Azure",
  "Microsoft Copilot",
] as const;

const googleRequired = [
  "Google Drive",
  "Google Sheets",
  "Google Docs",
  "Google Slides",
  "Gmail",
  "Google Calendar",
  "Google Meet",
  "Google Forms",
  "Google Analytics",
  "Google Cloud",
] as const;

describe("home v2 integration carousel data", () => {
  it("keeps the required social, Microsoft and Google rows first", () => {
    expect(
      INTEGRATIONS_ROW_A.slice(0, socialRequired.length).map((mark) => mark.name),
    ).toEqual([...socialRequired]);
    expect(
      INTEGRATIONS_ROW_B.slice(0, microsoftRequired.length).map((mark) => mark.name),
    ).toEqual([...microsoftRequired]);
    expect(
      INTEGRATIONS_ROW_C.slice(0, googleRequired.length).map((mark) => mark.name),
    ).toEqual([...googleRequired]);
  });

  it("points every carousel mark at a local SVG asset", () => {
    for (const mark of ALL_INTEGRATIONS) {
      expect(mark.file).toMatch(/^\/integrations\/[-a-z0-9]+\.svg$/);
      expect(existsSync(join(process.cwd(), "public", mark.file))).toBe(true);
    }
  });
});
