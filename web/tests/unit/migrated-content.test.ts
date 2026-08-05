import { describe, expect, it } from "vitest";

import {
  loadMigratedContent,
  migratedContentIndex,
  validateMigratedContentRecord,
} from "~/content/migrated";
import { approvedServiceRoutes } from "~/content/services/approved-services";
import { futureRouteManifest } from "~/data/future-routes";

describe("migrated content baseline", () => {
  it("accounts for every retained migrated route exactly once", () => {
    const approvedServiceRouteSet = new Set<string>(approvedServiceRoutes);
    // Routes authored after the legacy migration have no migrated record by
    // definition — their copy lives in the feature tree, and the detail loader
    // never reads migrated content for an industry template
    // (routes/services/detail.tsx). /industry/aesthetic-clinics (2026-08-05) is
    // the first: every earlier industry page inherited a legacy source file.
    const postMigrationRoutes = new Set(["/industry/aesthetic-clinics"]);
    const retainedRoutes = futureRouteManifest.filter(
      (route) =>
        route.lifecycle === "retained" &&
        !approvedServiceRouteSet.has(route.path) &&
        !postMigrationRoutes.has(route.path),
    );

    expect(migratedContentIndex).toHaveLength(retainedRoutes.length);
    // 19 records since the 2026-07-07 blog teardown (33 article modules
    // removed; the blog hub itself is a bespoke composition).
    expect(migratedContentIndex).toHaveLength(19);
    expect(new Set(migratedContentIndex.map((record) => record.routePath)).size).toBe(
      19,
    );
    expect(
      retainedRoutes.every((route) =>
        migratedContentIndex.some((record) => record.contentId === route.contentId),
      ),
    ).toBe(true);
    for (const route of approvedServiceRoutes) {
      expect(migratedContentIndex.some((record) => record.routePath === route)).toBe(
        false,
      );
    }
  });

  it("loads source-faithful typed content with metadata and schema provenance", async () => {
    const content = await loadMigratedContent("content-services-dentists");

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
  });

  it("keeps approved service pages out of the migrated-content registry", async () => {
    const industry = await loadMigratedContent("content-services-dentists");

    expect(industry.kind).toBe("industry");
    await expect(
      loadMigratedContent("content-service-ai-receptionists"),
    ).rejects.toThrow("No migrated content module");
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
});
