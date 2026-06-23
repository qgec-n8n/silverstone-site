import { describe, expect, it } from "vitest";

import {
  contentManifest,
  getContentById,
  validateContentManifest,
} from "~/content/content-manifest";

describe("content migration manifest", () => {
  it("preserves one source-backed content record per canonical route", () => {
    expect(contentManifest).toHaveLength(50);
    expect(validateContentManifest(contentManifest)).toEqual([]);
    expect(contentManifest.every((record) => record.sourceFile.endsWith(".html"))).toBe(
      true,
    );
    expect(
      contentManifest.every((record) => /^[a-f0-9]{64}$/.test(record.sourceSha256)),
    ).toBe(true);
  });

  it("records unresolved content instead of inventing a decision", () => {
    const record = getContentById("content-blog-ai-lead-capture-trades-uk-2026");

    expect(record?.status).toBe("unresolved");
    expect(record?.unresolvedNotes.join(" ")).toContain("redirect");
  });
});
