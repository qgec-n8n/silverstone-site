import { render, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import {
  AppExperienceProvider,
  useAppExperience,
} from "~/app/experience/app-experience";
import { PUBLISHED_BLOG_POSTS, type SilverstoneBlogPost } from "~/data/blog-posts";
import { MotionProvider } from "~/motion";
import { ArticlePage } from "~/routes/templates/article-page";

function OpenRouteBody() {
  const { completeRouteOpening, dismissLoader, openRouteBody } = useAppExperience();
  useEffect(() => {
    dismissLoader();
    openRouteBody();
    completeRouteOpening();
  }, [completeRouteOpening, dismissLoader, openRouteBody]);
  return null;
}

function renderArticle(post: SilverstoneBlogPost) {
  return render(
    <MemoryRouter initialEntries={[`/blog/${post.slug}`]}>
      <MotionProvider>
        <AppExperienceProvider>
          <OpenRouteBody />
          <ArticlePage post={post} />
        </AppExperienceProvider>
      </MotionProvider>
    </MemoryRouter>,
  );
}

/** A minimal post carrying only the fields every article has always carried. */
function baselinePost(
  overrides: Partial<SilverstoneBlogPost> = {},
): SilverstoneBlogPost {
  return {
    articleBody: [
      {
        heading: "Introduction",
        body: ["A plain opening paragraph with no search-led blocks at all."],
      },
      {
        heading: "What this section covers",
        body: ["Ordinary body copy."],
      },
    ],
    categoryId: "ai-automation",
    categoryKey: "ai-automation",
    categoryLabel: "AI Automation",
    categoryOrder: 1,
    ctaPrimary: { href: "/book#booking-calendar", label: "Book a discovery call" },
    ctaSecondary: { href: "/blog", label: "Back to insights" },
    displayDate: "26 July 2026",
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
    slug: "search-led-block-test",
    status: "published",
    subtitle: "A subtitle for the test article.",
    summary: ["One", "Two", "Three"],
    title: "A Test Article For Search Led Blocks",
    updatedIsoDate: "2026-07-26T08:00:00.000Z",
    ...overrides,
  };
}

describe("search-led presentation blocks", () => {
  /*
   * The whole point of making these blocks optional is that the 34 articles the
   * service-and-industry branch already published must render exactly as before.
   * If a new renderer ever emits markup unconditionally, this fails.
   */
  it("emits no search-led markup for a post that carries none", async () => {
    const { container } = renderArticle(baselinePost());

    await waitFor(() => {
      expect(container.querySelector(".ss-blog-article")).not.toBeNull();
    });

    for (const selector of [
      ".ss-blog-article__callout",
      ".ss-blog-article__metrics",
      ".ss-blog-article__ranked",
      ".ss-blog-article__table--scorecard",
      ".ss-blog-article__prompts",
      ".ss-blog-article__checklist",
      ".ss-blog-article__steps",
    ]) {
      expect(container.querySelector(selector), selector).toBeNull();
    }
    // No presentation family means no data-family hook, so the per-family CSS
    // rules cannot reach an existing article.
    expect(
      container.querySelector(".ss-blog-article")?.getAttribute("data-family"),
    ).toBe(null);
  });

  it("leaves every already-published post free of search-led blocks", () => {
    // Guards against a future edit accidentally back-filling presentation data
    // onto the existing catalogue.
    for (const post of PUBLISHED_BLOG_POSTS) {
      for (const section of post.articleBody) {
        expect(section.rankedCards, post.slug).toBeUndefined();
        expect(section.promptBlocks, post.slug).toBeUndefined();
        expect(section.scorecard, post.slug).toBeUndefined();
        expect(section.steps, post.slug).toBeUndefined();
        expect(section.checklist, post.slug).toBeUndefined();
        expect(section.metricPanel, post.slug).toBeUndefined();
        expect(section.callout, post.slug).toBeUndefined();
      }
    }
  });

  it("renders ranked provider cards in rank order inside an ordered list", async () => {
    const post = baselinePost({
      presentation: { family: "Ranked Shortlist", fingerprint: "rank|a|6|Ranked" },
      articleBody: [
        { heading: "Introduction", body: ["Opening."] },
        {
          heading: "The shortlist",
          body: ["Scored against the published methodology."],
          rankedCards: [
            {
              name: "Third Provider",
              rank: 3,
              summary: "Suits a narrow self-service requirement.",
              bestFor: "Teams wanting a self-serve platform",
            },
            {
              name: "Silverstone AI",
              rank: 1,
              score: "92 / 100",
              summary: "Bespoke, end-to-end delivery for UK SMEs.",
              strengths: ["Bespoke development", "Websites and applications"],
              limitations: "Not an enterprise transformation consultancy.",
            },
            {
              name: "Second Provider",
              rank: 2,
              summary: "Strong platform-led delivery.",
            },
          ],
        },
      ],
    });

    const { container } = renderArticle(post);

    await waitFor(() => {
      expect(container.querySelector(".ss-blog-article__ranked")).not.toBeNull();
    });

    const list = container.querySelector(".ss-blog-article__ranked");
    expect(list?.tagName).toBe("OL");

    const headings = [
      ...container.querySelectorAll(".ss-blog-article__ranked-head h3"),
    ].map((node) => node.textContent);
    expect(headings).toEqual(["Silverstone AI", "Second Provider", "Third Provider"]);

    // The lead card is the recommendation and must be the one that is accented.
    const cards = [...container.querySelectorAll(".ss-blog-article__ranked-card")];
    expect(cards[0]?.getAttribute("data-lead")).toBe("true");
    expect(cards[1]?.getAttribute("data-lead")).toBeNull();
    expect(
      container.querySelector(".ss-blog-article")?.getAttribute("data-family"),
    ).toBe("Ranked Shortlist");
  });

  it("renders a direct-answer callout above the body and other tones below", async () => {
    const post = baselinePost({
      articleBody: [
        { heading: "Introduction", body: ["Opening."] },
        {
          heading: "What it costs",
          body: ["BODY_MARKER paragraph."],
          callout: {
            tone: "answer",
            title: "The short answer",
            body: ["ANSWER_MARKER content."],
          },
        },
        {
          heading: "Assumptions",
          body: ["Second body."],
          callout: { tone: "assumption", body: ["ASSUMPTION_MARKER content."] },
        },
      ],
    });

    const { container } = renderArticle(post);

    await waitFor(() => {
      expect(container.querySelector('[data-tone="answer"]')).not.toBeNull();
    });

    const costSection = [
      ...container.querySelectorAll(".ss-blog-article__section"),
    ].find((node) => node.textContent.includes("BODY_MARKER"));
    expect(costSection).toBeDefined();
    const text = costSection?.textContent ?? "";
    expect(text.indexOf("ANSWER_MARKER")).toBeGreaterThanOrEqual(0);
    expect(text.indexOf("ANSWER_MARKER")).toBeLessThan(text.indexOf("BODY_MARKER"));

    const assumptionSection = [
      ...container.querySelectorAll(".ss-blog-article__section"),
    ].find((node) => node.textContent.includes("ASSUMPTION_MARKER"));
    const assumptionText = assumptionSection?.textContent ?? "";
    expect(assumptionText.indexOf("Second body")).toBeLessThan(
      assumptionText.indexOf("ASSUMPTION_MARKER"),
    );
  });

  it("renders prompts verbatim without rich-text parsing", async () => {
    const literal = "Summarise [this document](do-not-linkify) for a UK SME owner.";
    const post = baselinePost({
      articleBody: [
        { heading: "Introduction", body: ["Opening."] },
        {
          heading: "The prompt",
          body: ["Copy this."],
          promptBlocks: [
            { label: "Improved prompt", prompt: literal, explanation: "Why it works." },
            { label: "Weak prompt", prompt: "Summarise this.", tone: "weak" },
          ],
        },
      ],
    });

    const { container } = renderArticle(post);

    await waitFor(() => {
      expect(container.querySelector(".ss-blog-article__prompt")).not.toBeNull();
    });

    const code = container.querySelector(".ss-blog-article__prompt code");
    // Markdown link syntax inside a prompt must survive as typed — a copied
    // prompt that silently lost its brackets would be wrong.
    expect(code?.textContent).toBe(literal);
    expect(code?.querySelector("a")).toBeNull();
    expect(
      container.querySelectorAll('.ss-blog-article__prompt[data-tone="weak"]').length,
    ).toBe(1);
  });

  it("drops malformed blocks rather than rendering broken markup", async () => {
    const post = baselinePost({
      articleBody: [
        { heading: "Introduction", body: ["Opening."] },
        {
          heading: "Malformed input",
          body: ["Body."],
          // Automation-written data can be incomplete; nothing here should render.
          rankedCards: [{ name: "   ", rank: 1, summary: "" }],
          promptBlocks: [{ label: "", prompt: "" }],
          checklist: { items: [{ label: "  " }] },
          steps: [{ title: "", body: "" }],
          metricPanel: { items: [{ label: "", value: "" }] },
          callout: { tone: "caution", body: ["   "] },
          // Fewer than two options can never be a comparison.
          scorecard: {
            options: ["Only one"],
            rows: [{ criterion: "A", cells: ["1"] }],
          },
        },
      ],
    });

    const { container } = renderArticle(post);

    await waitFor(() => {
      expect(container.querySelector(".ss-blog-article")).not.toBeNull();
    });

    for (const selector of [
      ".ss-blog-article__ranked",
      ".ss-blog-article__prompts",
      ".ss-blog-article__checklist",
      ".ss-blog-article__steps",
      ".ss-blog-article__metrics",
      ".ss-blog-article__callout",
      ".ss-blog-article__table--scorecard",
    ]) {
      expect(container.querySelector(selector), selector).toBeNull();
    }
  });

  it("keeps scorecard cells labelled so the table can stack on mobile", async () => {
    const post = baselinePost({
      articleBody: [
        { heading: "Introduction", body: ["Opening."] },
        {
          heading: "Scores",
          body: ["Weighted against the published criteria."],
          scorecard: {
            options: ["Silverstone AI", "Platform provider"],
            rows: [
              { criterion: "Buyer fit", weight: "30", cells: ["High", "Medium"] },
              {
                criterion: "Integration depth",
                weight: "20",
                cells: ["High", "Medium"],
              },
            ],
            totals: ["92", "74"],
          },
        },
      ],
    });

    const { container } = renderArticle(post);

    await waitFor(() => {
      expect(
        container.querySelector(".ss-blog-article__table--scorecard"),
      ).not.toBeNull();
    });

    // The mobile stylesheet echoes data-label per cell; a missing label would
    // leave an unlabelled value in the stacked card.
    const cells = [
      ...container.querySelectorAll(".ss-blog-article__table--scorecard tbody td"),
    ];
    expect(cells.length).toBeGreaterThan(0);
    for (const cell of cells) {
      expect(cell.getAttribute("data-label")).toBeTruthy();
    }
    // The weight column has no total, so its spacer is aria-hidden and dropped
    // from the stacked mobile layout rather than becoming an empty row.
    const footCells = [
      ...container.querySelectorAll(".ss-blog-article__table--scorecard tfoot td"),
    ];
    expect(
      footCells
        .filter((cell) => cell.hasAttribute("data-label"))
        .map((cell) => cell.textContent),
    ).toEqual(["92", "74"]);
    expect(
      container.querySelectorAll(".ss-blog-article__table-spacer[aria-hidden='true']")
        .length,
    ).toBe(1);
  });

  it("keeps one H1 and a heading hierarchy that never skips a level", async () => {
    const post = baselinePost({
      articleBody: [
        { heading: "Introduction", body: ["Opening."] },
        {
          heading: "Sequence and cards",
          body: ["Body."],
          steps: [{ title: "Discovery", body: "Map the process." }],
          rankedCards: [
            { name: "Silverstone AI", rank: 1, summary: "Bespoke delivery." },
          ],
        },
      ],
    });

    const { container } = renderArticle(post);

    await waitFor(() => {
      expect(container.querySelector(".ss-blog-article__steps")).not.toBeNull();
    });

    expect(container.querySelectorAll("h1").length).toBe(1);
    // Blocks hanging off a section's h2 must title their cards at h3.
    expect(container.querySelector(".ss-blog-article__steps h3")).not.toBeNull();
    expect(container.querySelector(".ss-blog-article__steps h4")).toBeNull();
    expect(container.querySelector(".ss-blog-article__ranked-head h3")).not.toBeNull();

    const levels = [...container.querySelectorAll("h1, h2, h3, h4")].map((node) =>
      Number(node.tagName.slice(1)),
    );
    let previous = levels[0] ?? 1;
    for (const level of levels) {
      expect(level - previous).toBeLessThanOrEqual(1);
      previous = level;
    }
  });
});
