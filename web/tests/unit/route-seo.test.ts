import { describe, expect, it } from "vitest";

import { futureRouteManifest } from "~/data/future-routes";
import { validateInternalLinks } from "~/data/internal-links";
import { buildRouteMetadata } from "~/seo/metadata";
import { buildRobotsTxt } from "~/seo/robots";
import { buildRouteSchemaGraph, serializeJsonLd } from "~/seo/schema";
import { buildSitemapXml } from "~/seo/sitemap";

describe("route SEO generation", () => {
  it("emits complete staging metadata with production canonicals", () => {
    const route = futureRouteManifest.find(
      (candidate) => candidate.path === "/services/dentists",
    );
    if (!route) {
      throw new Error("Dentists route fixture is missing");
    }

    const metadata = buildRouteMetadata(route);
    expect(metadata).toEqual(
      expect.arrayContaining([
        { title: route.title },
        { name: "description", content: route.description },
        { tagName: "link", rel: "canonical", href: route.canonical },
        { property: "og:url", content: route.canonical },
      ]),
    );
  });

  it("builds visible-fact breadcrumb and page schema", () => {
    const route = futureRouteManifest.find(
      (candidate) => candidate.path === "/services/ai-receptionists",
    );
    if (!route) {
      throw new Error("Service route fixture is missing");
    }

    const graph = buildRouteSchemaGraph(route);
    expect(graph["@graph"].map((entry) => entry["@type"])).toEqual([
      "Service",
      "BreadcrumbList",
    ]);
    expect(serializeJsonLd({ value: "</script>" })).not.toContain("</script>");
  });

  it("generates production sitemap entries while blocking staging crawling", () => {
    const productionSitemap = buildSitemapXml({
      environment: "production",
      routes: futureRouteManifest,
    });
    const stagingSitemap = buildSitemapXml({
      environment: "staging",
      routes: futureRouteManifest,
    });

    expect(productionSitemap.match(/<url>/g)).toHaveLength(26);
    expect(productionSitemap).toContain("https://silverstone-ai.com/services");
    expect(productionSitemap).toContain(
      "https://silverstone-ai.com/services/ai-consulting",
    );
    expect(productionSitemap).toContain("https://silverstone-ai.com/industries");
    expect(productionSitemap).not.toContain(
      "https://silverstone-ai.com/blog/ai-receptionist-small-business-2026",
    );
    expect(productionSitemap).not.toContain("staging.example.invalid");
    expect(stagingSitemap).toBe("");
    expect(buildRobotsTxt({ environment: "staging" })).toBe(
      "User-agent: *\nDisallow: /\n",
    );
  });

  it("keeps generated breadcrumbs and related routes internally resolvable", () => {
    expect(validateInternalLinks(futureRouteManifest)).toEqual([]);
  });
});
