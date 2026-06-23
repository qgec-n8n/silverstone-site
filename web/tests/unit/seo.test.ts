import { describe, expect, it } from "vitest";

import { buildCanonicalUrl } from "~/seo/canonical";
import { buildMetadata } from "~/seo/metadata";
import { buildOrganizationSchema } from "~/seo/schema";

describe("SEO utilities", () => {
  it("normalizes canonical paths against the configured origin", () => {
    expect(buildCanonicalUrl("https://staging.example.invalid/", "/foundation")).toBe(
      "https://staging.example.invalid/foundation",
    );
  });

  it("always emits the staging robots contract", () => {
    expect(
      buildMetadata({
        canonicalOrigin: "https://staging.example.invalid",
        description: "A staging-only application foundation.",
        path: "/",
        title: "Silverstone staging foundation",
      }),
    ).toEqual(
      expect.arrayContaining([
        { name: "robots", content: "noindex,nofollow,noarchive" },
        {
          tagName: "link",
          rel: "canonical",
          href: "https://staging.example.invalid/",
        },
      ]),
    );
  });

  it("builds JSON-LD from visible organization facts only", () => {
    expect(
      buildOrganizationSchema({
        name: "Silverstone AI",
        url: "https://silverstone-ai.com",
      }),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Silverstone AI",
      url: "https://silverstone-ai.com",
    });
  });
});
