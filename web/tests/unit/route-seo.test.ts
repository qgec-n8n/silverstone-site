import { describe, expect, it } from "vitest";

import { futureRouteManifest } from "~/data/future-routes";
import { validateInternalLinks } from "~/data/internal-links";
import { industryCopyByRoute } from "~/features/industries-v2/content";
import { serviceCopyByRoute } from "~/features/services-v2/content/copy";
import { buildRouteMetadata } from "~/seo/metadata";
import { buildRobotsTxt } from "~/seo/robots";
import { buildRouteSchemaGraph, serializeJsonLd } from "~/seo/schema";
import { buildSitemapXml } from "~/seo/sitemap";

describe("route SEO generation", () => {
  it("emits complete staging metadata with production canonicals", () => {
    const route = futureRouteManifest.find(
      (candidate) => candidate.path === "/industry/dentists",
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
    // The Organization node travels with every route so an answer engine
    // can resolve the entity from any page it lands on. It carries both its
    // types at one `@id` rather than shipping a second local-business node.
    expect(graph["@graph"].map((entry) => entry["@type"])).toEqual([
      ["Organization", "ProfessionalService"],
      "Service",
      "FAQPage",
      "BreadcrumbList",
    ]);
    const service = graph["@graph"].find(
      (entry) => entry["@type"] === "Service",
    ) as unknown as {
      areaServed: { name: string }[];
      provider: { "@id": string };
    };
    expect(service.areaServed.map((area) => area.name)).toEqual([
      "United States",
      "United Kingdom",
    ]);
    expect(service.provider["@id"]).toBe("https://silverstone-ai.com/#organization");
    expect(serializeJsonLd({ value: "</script>" })).not.toContain("</script>");
  });

  it("builds every service and industry FAQPage from the copy the page renders", () => {
    const faqRoutes = [
      ...Object.keys(serviceCopyByRoute).map((path) => ({
        path,
        items: serviceCopyByRoute[path as keyof typeof serviceCopyByRoute].faqs.items,
      })),
      ...Object.keys(industryCopyByRoute).map((path) => ({
        path,
        items: industryCopyByRoute[path as keyof typeof industryCopyByRoute].faqs.items,
      })),
    ];
    expect(faqRoutes).toHaveLength(17);

    for (const { path, items } of faqRoutes) {
      const route = futureRouteManifest.find((candidate) => candidate.path === path);
      if (!route) {
        throw new Error(`Route fixture is missing for ${path}`);
      }

      const faq = buildRouteSchemaGraph(route)["@graph"].find(
        (entry) => entry["@type"] === "FAQPage",
      ) as unknown as {
        mainEntity: { name: string; acceptedAnswer: { text: string } }[];
      };

      expect(faq, path).toBeDefined();
      expect(faq.mainEntity, path).toHaveLength(items.length);
      // Structured data has to carry the rendered text, so the authored
      // emphasis markup must be unwrapped rather than published verbatim.
      for (const question of faq.mainEntity) {
        expect(question.name, path).not.toMatch(/[*`]/);
        expect(question.acceptedAnswer.text, path).not.toMatch(/[*`]/);
      }
    }
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

    // 26 = 27 routes minus the noindexed privacy policy.
    expect(productionSitemap.match(/<url>/g)).toHaveLength(26);
    expect(productionSitemap).toContain("https://silverstone-ai.com/services");
    expect(productionSitemap).toContain(
      "https://silverstone-ai.com/services/ai-consulting",
    );
    expect(productionSitemap).toContain("https://silverstone-ai.com/industry");
    expect(productionSitemap).not.toContain(
      "https://silverstone-ai.com/privacy-policy",
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
