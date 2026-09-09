import { describe, expect, it } from "vitest";

// @ts-expect-error -- the SEO artifact generator is plain ESM with no types.
import { collectBlogUrlErrors } from "../../scripts/generate-seo-artifacts.mjs";

/**
 * The deploy gate for the contract's "Outbound URLs" section. These are the
 * URLs a reader can actually click, so a broken one is a broken page — and the
 * publishing automation writes them unattended, which is exactly why the build
 * has to refuse them rather than a person noticing later.
 */
const post = (over: Record<string, unknown>) => ({
  slug: "example-post",
  researchSources: [],
  articleBody: [],
  ...over,
});

describe("blog outbound URL contract", () => {
  it("accepts absolute https destinations and site-relative paths", () => {
    expect(
      collectBlogUrlErrors(
        post({
          researchSources: [{ title: "Ofcom", url: "https://www.ofcom.org.uk/report" }],
          articleBody: [
            {
              heading: "Section",
              body: [],
              entityLinks: [{ name: "Silverstone AI", url: "/services/ai-automation" }],
              rankedCards: [
                {
                  name: "Acme",
                  rank: 1,
                  summary: "…",
                  website: "https://acme.example",
                },
              ],
            },
          ],
        }),
      ),
    ).toEqual([]);
  });

  /**
   * A ranked card with no `website` at all is the normal output of the
   * automation today, and `~/data/blog-provider-links` recovers it from the
   * article's own research — so it must not fail the build.
   */
  it("allows a ranked card that omits its website", () => {
    expect(
      collectBlogUrlErrors(
        post({
          articleBody: [
            {
              heading: "Shortlist",
              body: [],
              rankedCards: [{ name: "Acme", rank: 1, summary: "…" }],
            },
          ],
        }),
      ),
    ).toEqual([]);
  });

  it("rejects a grounding redirect standing in for the source", () => {
    const errors = collectBlogUrlErrors(
      post({
        researchSources: [
          {
            title: "A study",
            url: "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AbC123",
          },
        ],
      }),
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("redirect rather than the source itself");
  });

  it("rejects http, empty and unparseable URLs", () => {
    const errors = collectBlogUrlErrors(
      post({
        researchSources: [
          { title: "Insecure", url: "http://example.com" },
          { title: "Empty", url: "   " },
        ],
        articleBody: [
          {
            heading: "Section",
            body: [],
            quoteCard: { attribution: "Someone", quote: "…", url: "not a url" },
          },
        ],
      }),
    );
    expect(errors).toHaveLength(3);
    expect(errors.join(" ")).toContain("example-post");
  });

  it("names the field so the automation can fix it directly", () => {
    const errors = collectBlogUrlErrors(
      post({
        articleBody: [
          {
            heading: "Shortlist",
            body: [],
            rankedCards: [
              { name: "Acme", rank: 1, summary: "…", website: "acme.example" },
            ],
          },
        ],
      }),
    );
    expect(errors[0]).toContain('rankedCards "Acme".website');
  });
});
