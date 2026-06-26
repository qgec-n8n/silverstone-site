import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  loadMigratedContent,
  migratedContentIndex,
  validateMigratedContentRecord,
} from "~/content/migrated";
import { futureRouteManifest } from "~/data/future-routes";

describe("migrated content baseline", () => {
  it("accounts for every retained G-01 route exactly once", () => {
    const retainedRoutes = futureRouteManifest.filter(
      (route) => route.lifecycle === "retained",
    );

    expect(migratedContentIndex).toHaveLength(retainedRoutes.length);
    expect(migratedContentIndex).toHaveLength(58);
    expect(new Set(migratedContentIndex.map((record) => record.routePath)).size).toBe(
      58,
    );
    expect(
      retainedRoutes.every((route) =>
        migratedContentIndex.some((record) => record.contentId === route.contentId),
      ),
    ).toBe(true);
  });

  it("loads source-faithful typed content with metadata and schema provenance", async () => {
    const [content, linkedArticle] = await Promise.all([
      loadMigratedContent("content-services-dentists"),
      loadMigratedContent("content-blog-ai-receptionist-small-business-2026"),
    ]);

    expect(validateMigratedContentRecord(content)).toEqual([]);
    expect(content.kind).toBe("industry");
    expect(content.source.file).toBe(
      "docs/silverstone-transformation/content/silverstone-content-ia-seo-pack-v1/industries/industry-dentists-copy-v1.md",
    );
    expect(content.source.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(content.source.textSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(content.sections.length).toBeGreaterThan(5);
    expect(content.sections.some((section) => section.heading?.level === 2)).toBe(true);
    expect(content.metadata.title).toBe(
      "Digital and AI Services for Dental Practices | Silverstone AI",
    );
    expect(content.metadata.canonical).toBe(
      "https://silverstone-ai.com/services/dentists",
    );
    expect(content.schema.some((entry) => entry.types.includes("Service"))).toBe(true);
    expect(linkedArticle.links.length).toBeGreaterThan(0);
  });

  it("keeps service and industry records structurally distinct", async () => {
    const [service, industry] = await Promise.all([
      loadMigratedContent("content-service-ai-receptionists"),
      loadMigratedContent("content-services-dentists"),
    ]);

    expect(service.kind).toBe("service");
    expect(industry.kind).toBe("industry");
  });

  it("records disabled booking and contact interactions", async () => {
    const [book, contact] = await Promise.all([
      loadMigratedContent("content-book"),
      loadMigratedContent("content-contact"),
    ]);

    expect(book.interactions.length).toBeGreaterThan(0);
    expect(contact.interactions.length).toBeGreaterThan(0);
    expect([...book.interactions, ...contact.interactions]).toEqual(
      expect.arrayContaining([expect.objectContaining({ active: false })]),
    );
  });

  it("copies approved source imagery with provenance and dimensions", async () => {
    const article = await loadMigratedContent(
      "content-blog-ai-receptionist-small-business-2026",
    );
    const image = article.assets[0];

    expect(image).toBeDefined();
    if (!image) {
      return;
    }

    expect(image.sourcePath).toContain("assets/images/");
    expect(image.publicPath).toMatch(/^\/migrated-assets\//);
    expect(image.width).toBeGreaterThan(0);
    expect(image.height).toBeGreaterThan(0);
    expect(
      fs.existsSync(path.resolve(process.cwd(), "public", image.publicPath.slice(1))),
    ).toBe(true);
  });
});
