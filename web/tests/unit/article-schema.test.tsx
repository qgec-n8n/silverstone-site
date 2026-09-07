import { render, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import {
  AppExperienceProvider,
  useAppExperience,
} from "~/app/experience/app-experience";
import {
  PUBLISHED_BLOG_POSTS,
  type SilverstoneBlogPost,
  type SilverstoneBlogRankedCard,
  type SilverstoneBlogSection,
} from "~/data/blog-posts";
import { MotionProvider } from "~/motion";
import {
  ArticlePage,
  buildRankedShortlistSchema,
} from "~/routes/templates/article-page";

/**
 * The family stamp the search-led automation writes on a ranked listicle.
 * Ranked shortlists are the site's biggest impression driver, and the ItemList
 * that makes the ranking machine-readable hangs entirely off this string.
 */
const RANKED_FAMILY = "Ranked Shortlist";

type GraphNode = {
  "@type": string;
  "@id"?: string;
  mainEntity?: { "@id"?: string };
  numberOfItems?: number;
  itemListOrder?: string;
  itemListElement?: {
    "@type": string;
    position: number;
    name: string;
    url?: string;
    item?: { "@type": string; name: string; url: string };
  }[];
};

function flattenSections(sections: SilverstoneBlogSection[]): SilverstoneBlogSection[] {
  return sections.flatMap((section) => [
    section,
    ...flattenSections(section.subsections ?? []),
  ]);
}

/** The ranked entries a post renders — the set the ItemList must mirror. */
function renderedCards(post: SilverstoneBlogPost): SilverstoneBlogRankedCard[] {
  return flattenSections(post.articleBody)
    .flatMap((section) => section.rankedCards ?? [])
    .filter((card) => card.name.trim() && card.summary.trim())
    .slice(0, 12)
    .sort((left, right) => left.rank - right.rank);
}

/** A minimal post carrying only the fields every article has always carried. */
function baselinePost(
  overrides: Partial<SilverstoneBlogPost> = {},
): SilverstoneBlogPost {
  return {
    articleBody: [
      {
        heading: "Introduction",
        body: ["A plain opening paragraph with no ranked cards at all."],
      },
    ],
    categoryId: "ai-automation",
    categoryKey: "ai-automation",
    categoryLabel: "AI Automation",
    categoryOrder: 1,
    ctaPrimary: { href: "/book#booking-calendar", label: "Book a discovery call" },
    ctaSecondary: { href: "/blog", label: "Back to insights" },
    displayDate: "July 26, 2026",
    faqs: [],
    heroImage: "/assets/images/blog/test-hero.webp",
    heroImageAlt: "An illustrative automation operating surface for testing purposes",
    imagePrompt: "test",
    internalLinks: [],
    metaDescription: "A test meta description used only by the unit test suite.",
    metaTitle: "Test article",
    primaryKeyword: "ai automation testing",
    publishedIsoDate: "2026-07-26T08:00:00.000Z",
    readTime: "5 min read",
    researchSources: [],
    secondaryKeywords: [],
    slug: "article-schema-test",
    status: "published",
    subtitle: "A subtitle for the test article.",
    summary: ["One", "Two", "Three"],
    title: "A Test Article For Article Schema",
    updatedIsoDate: "2026-07-26T08:00:00.000Z",
    ...overrides,
  };
}

function card(overrides: Partial<SilverstoneBlogRankedCard> = {}) {
  return {
    name: "Example Provider",
    rank: 1,
    summary: "A provider summary long enough to survive the renderer's filter.",
    ...overrides,
  };
}

/** A ranked shortlist post carrying the given cards in one section. */
function rankedPost(cards: SilverstoneBlogRankedCard[]): SilverstoneBlogPost {
  return baselinePost({
    articleBody: [
      {
        heading: "Ranked shortlist",
        body: ["The ranking sits in this section."],
        rankedCards: cards,
      },
    ],
    presentation: { family: RANKED_FAMILY },
  });
}

describe("ranked shortlist ItemList schema", () => {
  it("emits nothing for an article that is not a ranked shortlist", () => {
    expect(buildRankedShortlistSchema(baselinePost())).toBeNull();
    expect(
      buildRankedShortlistSchema(
        baselinePost({ presentation: { family: "Decision Framework" } }),
      ),
    ).toBeNull();
  });

  /*
   * The guard is the family AND real cards, never one or the other: a
   * comparison article that happens to carry ranked cards is not a ranking,
   * and a ranking whose cards are all unusable must emit no list at all
   * rather than an empty one.
   */
  it("emits nothing for ranked cards without the family stamp", () => {
    const post = baselinePost({
      articleBody: [
        {
          heading: "A section that happens to carry cards",
          body: ["Not a ranking."],
          rankedCards: [card()],
        },
      ],
    });

    expect(buildRankedShortlistSchema(post)).toBeNull();
  });

  it("emits nothing when the family carries no usable cards", () => {
    expect(buildRankedShortlistSchema(rankedPost([]))).toBeNull();
    expect(
      buildRankedShortlistSchema(rankedPost([card({ name: "  ", summary: "  " })])),
    ).toBeNull();
  });

  it("lists every rendered card, in rank order, with its rank as position", () => {
    const schema = buildRankedShortlistSchema(
      rankedPost([
        card({ name: "Third", rank: 3 }),
        card({ name: "First", rank: 1 }),
        card({ name: "Second", rank: 2 }),
        // Filtered by the renderer, so absent from the list as well.
        card({ name: "", rank: 4 }),
      ]),
    );

    expect(schema).not.toBeNull();
    expect(schema?.["@type"]).toBe("ItemList");
    expect(schema?.numberOfItems).toBe(3);
    expect(schema?.itemListOrder).toBe("https://schema.org/ItemListOrderAscending");
    expect(schema?.url).toBe("https://silverstone-ai.com/blog/article-schema-test");
    expect(schema?.["@id"]).toBe(
      "https://silverstone-ai.com/blog/article-schema-test#ranked-shortlist",
    );
    expect(schema?.itemListElement.map((entry) => entry.position)).toEqual([1, 2, 3]);
    expect(schema?.itemListElement.map((entry) => entry.name)).toEqual([
      "First",
      "Second",
      "Third",
    ]);
    expect(schema?.itemListElement.map((entry) => entry["@type"])).toEqual([
      "ListItem",
      "ListItem",
      "ListItem",
    ]);
  });

  it("includes cards a subsection carries", () => {
    const post = baselinePost({
      articleBody: [
        {
          heading: "Ranked shortlist",
          body: ["Parent section."],
          rankedCards: [card({ name: "Parent pick", rank: 1 })],
          subsections: [
            {
              heading: "Runners up",
              body: ["Child section."],
              rankedCards: [card({ name: "Child pick", rank: 2 })],
            },
          ],
        },
      ],
      presentation: { family: RANKED_FAMILY },
    });

    expect(
      buildRankedShortlistSchema(post)?.itemListElement.map((e) => e.name),
    ).toEqual(["Parent pick", "Child pick"]);
  });

  it("nests an Organization when the card carries a resolvable website", () => {
    const schema = buildRankedShortlistSchema(
      rankedPost([
        card({ name: "External Co", rank: 1, website: "https://example.com/agency" }),
        card({
          name: "Silverstone AI",
          rank: 2,
          // Resolves to a path, which is meaningless in JSON-LD: absolutized.
          website: "https://silverstone-ai.com/services",
        }),
        // Not https, so the visible button drops it and so does the schema.
        card({ name: "Insecure Co", rank: 3, website: "http://example.org" }),
        card({ name: "Unlinked Co", rank: 4 }),
      ]),
    );

    const entries = schema?.itemListElement ?? [];
    expect(entries[0]?.url).toBe("https://example.com/agency");
    expect(entries[0]?.item).toEqual({
      "@type": "Organization",
      name: "External Co",
      url: "https://example.com/agency",
    });
    expect(entries[1]?.url).toBe("https://silverstone-ai.com/services");
    expect(entries[2]?.url).toBeUndefined();
    expect(entries[2]?.item).toBeUndefined();
    expect(entries[3]?.url).toBeUndefined();
    expect(entries[3]?.item).toBeUndefined();
  });

  it("carries the rendered provider name, not its emphasis markup", () => {
    const schema = buildRankedShortlistSchema(
      rankedPost([card({ name: "**Faculty**", rank: 1 })]),
    );

    expect(schema?.itemListElement[0]?.name).toBe("Faculty");
  });
});

describe("published ranked shortlists", () => {
  const published = PUBLISHED_BLOG_POSTS.filter(
    (post) => post.presentation?.family === RANKED_FAMILY,
  );

  it("has ranked shortlist articles to describe", () => {
    expect(published.length).toBeGreaterThan(0);
  });

  it.each(published.map((post) => [post.slug, post] as const))(
    "describes every ranked entry of %s",
    (_slug, post) => {
      const cards = renderedCards(post);
      const schema = buildRankedShortlistSchema(post);

      expect(schema).not.toBeNull();
      expect(schema?.numberOfItems).toBe(cards.length);
      expect(schema?.itemListElement.map((entry) => entry.position)).toEqual(
        cards.map((entry) => entry.rank),
      );
      // Names are compared markup-agnostically: the builder strips the emphasis
      // markers `RichText` renders, so a card the automation ever writes as
      // `**Faculty**` must not fail this guard for doing the right thing.
      for (const [index, entry] of (schema?.itemListElement ?? []).entries()) {
        expect(entry.name).not.toBe("");
        expect(cards[index]?.name).toContain(entry.name);
      }
      expect(schema?.url).toBe(`https://silverstone-ai.com/blog/${post.slug}`);
    },
  );
});

function OpenRouteBody() {
  const { completeRouteOpening, dismissLoader, openRouteBody } = useAppExperience();
  useEffect(() => {
    dismissLoader();
    openRouteBody();
    completeRouteOpening();
  }, [completeRouteOpening, dismissLoader, openRouteBody]);
  return null;
}

async function renderGraph(post: SilverstoneBlogPost): Promise<GraphNode[]> {
  const { container } = render(
    <MemoryRouter initialEntries={[`/blog/${post.slug}`]}>
      <MotionProvider>
        <AppExperienceProvider>
          <OpenRouteBody />
          <ArticlePage post={post} />
        </AppExperienceProvider>
      </MotionProvider>
    </MemoryRouter>,
  );

  await waitFor(() => {
    expect(container.querySelector(".ss-blog-article")).not.toBeNull();
  });

  // One JSON-LD block per document, which `tests/e2e/route-parity.spec.ts`
  // asserts site-wide: the ItemList must join the existing graph rather than
  // arrive as a second script tag.
  const scripts = container.querySelectorAll('script[type="application/ld+json"]');
  expect(scripts).toHaveLength(1);

  const graph = JSON.parse(scripts[0]?.textContent ?? "{}") as {
    "@graph"?: GraphNode[];
  };
  return graph["@graph"] ?? [];
}

describe("article JSON-LD graph", () => {
  it("carries the ItemList in the article's single graph", async () => {
    const post = PUBLISHED_BLOG_POSTS.find(
      (entry) => entry.presentation?.family === RANKED_FAMILY,
    );
    expect(post).toBeDefined();
    if (!post) {
      return;
    }

    const graph = await renderGraph(post);
    const list = graph.find((node) => node["@type"] === "ItemList");
    const article = graph.find((node) => node["@type"] === "BlogPosting");

    expect(list?.numberOfItems).toBe(renderedCards(post).length);
    // The article is its ranking, said once rather than left as two unrelated
    // nodes sharing a document.
    expect(article?.mainEntity?.["@id"]).toBe(list?.["@id"]);
    // The nodes that were already there are untouched.
    expect(graph.map((node) => node["@type"])).toEqual(
      expect.arrayContaining(["BlogPosting", "ItemList", "BreadcrumbList"]),
    );
  });

  it("carries no ItemList for an article that is not a ranked shortlist", async () => {
    const graph = await renderGraph(baselinePost());

    expect(graph.some((node) => node["@type"] === "ItemList")).toBe(false);
    expect(
      graph.find((node) => node["@type"] === "BlogPosting")?.mainEntity,
    ).toBeUndefined();
  });
});
