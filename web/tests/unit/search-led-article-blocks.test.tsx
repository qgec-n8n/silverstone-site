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
  type SilverstoneBlogSection,
} from "~/data/blog-posts";
import { MotionProvider } from "~/motion";
import { ArticlePage, sanitizeHref } from "~/routes/templates/article-page";

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

/**
 * Every section in a post, subsections included. A subsection renders the same
 * search-led blocks as its parent, so a guard that only walked the top level
 * would miss a back-fill one level down.
 */
function flattenSections(sections: SilverstoneBlogSection[]): SilverstoneBlogSection[] {
  return sections.flatMap((section) => [
    section,
    ...flattenSections(section.subsections ?? []),
  ]);
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
      ".ss-blog-article__takeaways",
      ".ss-blog-article__stat-band",
      ".ss-blog-article__versus",
      ".ss-blog-article__definitions",
      ".ss-blog-article__timeline",
      ".ss-blog-article__quote-card",
      ".ss-blog-article__entities",
    ]) {
      expect(container.querySelector(selector), selector).toBeNull();
    }
    // No presentation family means no data-family hook, so the per-family CSS
    // rules cannot reach an existing article.
    expect(
      container.querySelector(".ss-blog-article")?.getAttribute("data-family"),
    ).toBe(null);
  });

  it("leaves posts without a presentation family free of search-led blocks", () => {
    /*
     * Guards against a future edit accidentally back-filling presentation data
     * onto the catalogue written before the search-led stream existed.
     *
     * A post is search-led exactly when the automation stamped it with a
     * presentation family; those posts are *supposed* to carry these blocks, so
     * they are excluded here. This originally asserted over the whole
     * catalogue, which was correct only while no search-led article had been
     * published yet.
     *
     * Only this direction is asserted. A family does not imply search-led
     * blocks: a "Comparison Matrix" article can express its comparison through
     * the older `comparisonTable` block and legitimately carry none of these.
     */
    const legacyPosts = PUBLISHED_BLOG_POSTS.filter(
      (post) => !post.presentation?.family,
    );
    // A filter that matched nothing would leave this guard silently vacuous.
    expect(legacyPosts.length).toBeGreaterThan(0);

    for (const post of legacyPosts) {
      for (const section of flattenSections(post.articleBody)) {
        expect(section.rankedCards, post.slug).toBeUndefined();
        expect(section.promptBlocks, post.slug).toBeUndefined();
        expect(section.scorecard, post.slug).toBeUndefined();
        expect(section.steps, post.slug).toBeUndefined();
        expect(section.checklist, post.slug).toBeUndefined();
        expect(section.metricPanel, post.slug).toBeUndefined();
        expect(section.callout, post.slug).toBeUndefined();
        expect(section.keyTakeaways, post.slug).toBeUndefined();
        expect(section.statBand, post.slug).toBeUndefined();
        expect(section.versusCard, post.slug).toBeUndefined();
        expect(section.definitions, post.slug).toBeUndefined();
        expect(section.timeline, post.slug).toBeUndefined();
        expect(section.quoteCard, post.slug).toBeUndefined();
        expect(section.entityLinks, post.slug).toBeUndefined();
        expect(section.sectionNumber, post.slug).toBeUndefined();
        expect(section.leadStyle, post.slug).toBeUndefined();
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
          keyTakeaways: { items: ["   "] },
          statBand: { items: [{ label: "", value: "" }] },
          versusCard: {
            left: { title: "", body: "" },
            right: { title: "", body: "" },
          },
          definitions: { items: [{ term: "", definition: "" }] },
          timeline: { items: [{ title: "", body: "" }] },
          quoteCard: { quote: "", attribution: "" },
          entityLinks: [{ name: "Unsafe", url: "javascript:alert(1)" }],
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
      ".ss-blog-article__takeaways",
      ".ss-blog-article__stat-band",
      ".ss-blog-article__versus",
      ".ss-blog-article__definitions",
      ".ss-blog-article__timeline",
      ".ss-blog-article__quote-card",
      ".ss-blog-article__entities",
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

  it("allows only relative or HTTPS destinations and classifies Silverstone as internal", () => {
    expect(sanitizeHref("/services/ai-automation?from=blog#scope")).toEqual({
      external: false,
      href: "/services/ai-automation?from=blog#scope",
    });
    expect(
      sanitizeHref("https://www.silverstone-ai.com/services/websites?from=blog#work"),
    ).toEqual({
      external: false,
      href: "/services/websites?from=blog#work",
    });
    expect(sanitizeHref("https://example.com/reference")).toMatchObject({
      external: true,
      hostname: "example.com",
    });

    for (const unsafe of [
      "javascript:alert(1)",
      "data:text/html,unsafe",
      "http://example.com",
      "mailto:hello@example.com",
      "//example.com/path",
      "/\\example.com/path",
    ]) {
      expect(sanitizeHref(unsafe), unsafe).toBeNull();
    }
  });

  it("renders third-party links with nofollow but never applies it to Silverstone links", async () => {
    const post = baselinePost({
      articleBody: [
        {
          heading: "Introduction",
          body: [
            'Read [the external research](https://example.com/research), [our service](https://silverstone-ai.com/services/ai-automation), [a relative page](/contact), [unsafe script](javascript:alert(1)) and <a href="data:text/html,unsafe">unsafe data</a>.',
          ],
        },
      ],
    });

    const { container } = renderArticle(post);

    await waitFor(() => {
      expect(container.querySelector(".ss-blog-article__external-link")).not.toBeNull();
    });

    const external = container.querySelector<HTMLAnchorElement>(
      'a[href="https://example.com/research"]',
    );
    expect(external?.getAttribute("target")).toBe("_blank");
    expect(external?.getAttribute("rel")).toBe("noopener noreferrer nofollow");
    expect(external?.querySelector("svg")).not.toBeNull();

    for (const href of ["/services/ai-automation", "/contact"]) {
      const internal = container.querySelector<HTMLAnchorElement>(`a[href="${href}"]`);
      expect(internal, href).not.toBeNull();
      expect(internal?.hasAttribute("target"), href).toBe(false);
      expect(internal?.hasAttribute("rel"), href).toBe(false);
      expect(internal?.classList.contains("ss-blog-article__external-link"), href).toBe(
        false,
      );
    }

    expect(container.querySelectorAll(".ss-blog-article__section a").length).toBe(3);
    expect(container.textContent).toContain("unsafe script");
    expect(container.textContent).toContain("unsafe data");
  });

  it("renders ranked websites and declarative entity links as capped actions", async () => {
    const repeatedEntity = {
      kind: "tool" as const,
      name: "Example Tool",
      url: "https://tool.example/product",
    };
    const post = baselinePost({
      articleBody: [
        { heading: "Introduction", body: ["Opening."], entityLinks: [repeatedEntity] },
        {
          heading: "Named options",
          body: ["The named entities are declared alongside this section."],
          rankedCards: [
            {
              name: "External Provider",
              rank: 2,
              summary: "An external provider.",
              website: "https://provider.example/platform",
            },
            {
              name: "Silverstone AI",
              rank: 1,
              summary: "The internal option.",
              website: "https://silverstone-ai.com/services/ai-automation",
            },
          ],
          entityLinks: [
            repeatedEntity,
            repeatedEntity,
            {
              kind: "silverstone",
              name: "Silverstone AI",
              url: "https://silverstone-ai.com/contact",
            },
          ],
        },
        {
          heading: "Repeated mention",
          body: ["The same tool appears again."],
          entityLinks: [repeatedEntity],
        },
      ],
    });

    const { container } = renderArticle(post);

    await waitFor(() => {
      expect(
        container.querySelector(".ss-blog-article__ranked-website"),
      ).not.toBeNull();
    });

    const provider = container.querySelector<HTMLAnchorElement>(
      'a[href="https://provider.example/platform"]',
    );
    expect(provider?.textContent).toContain("Visit provider.example");
    expect(provider?.getAttribute("rel")).toContain("nofollow");

    const silverstoneWebsite = container.querySelector<HTMLAnchorElement>(
      'a.ss-blog-article__ranked-website[href="/services/ai-automation"]',
    );
    expect(silverstoneWebsite).not.toBeNull();
    expect(silverstoneWebsite?.hasAttribute("rel")).toBe(false);

    expect(
      [...container.querySelectorAll(".ss-blog-article__entities a")].filter((link) =>
        link.textContent.includes("Example Tool"),
      ).length,
    ).toBe(2);
    const internalEntity = container.querySelector<HTMLAnchorElement>(
      '.ss-blog-article__entities a[href="/contact"]',
    );
    expect(internalEntity?.hasAttribute("rel")).toBe(false);
  });

  it("renders every inline marker without colliding with body list parsing", async () => {
    const post = baselinePost({
      articleBody: [
        {
          heading: "Introduction",
          body: [
            "==Highlighted evidence== starts a paragraph.",
            "{{underline:Underlined phrase}} starts another paragraph.",
            "{{accent:Semantic keyword}} has an accent.",
            "{{chip:proof|Verified}} is a proof chip.",
            "{{chip:warning|Caution}} is a warning chip.",
            "Legacy **bold**, *italic* and `code` still render.",
          ],
        },
      ],
    });

    const { container } = renderArticle(post);

    await waitFor(() => {
      expect(container.querySelector(".ss-rich-text__mark")).not.toBeNull();
    });

    expect(container.querySelector("mark")?.textContent).toBe("Highlighted evidence");
    expect(container.querySelector("u")?.textContent).toBe("Underlined phrase");
    expect(container.querySelector(".ss-rich-text__accent")?.textContent).toBe(
      "Semantic keyword",
    );
    expect(container.querySelectorAll(".ss-rich-text__chip").length).toBe(2);
    expect(
      container.querySelector('.ss-rich-text__chip[data-kind="proof"] svg'),
    ).not.toBeNull();
    expect(
      container.querySelector(".ss-blog-article__section strong")?.textContent,
    ).toBe("bold");
    expect(container.querySelector(".ss-blog-article__section em")?.textContent).toBe(
      "italic",
    );
    expect(container.querySelector(".ss-blog-article__section code")?.textContent).toBe(
      "code",
    );
    expect(container.querySelector(".ss-blog-article__list")).toBeNull();
    for (const marker of [
      ".ss-rich-text__mark",
      ".ss-rich-text__underline",
      ".ss-rich-text__accent",
      ".ss-rich-text__chip",
    ]) {
      expect(container.querySelector(marker)?.closest("p"), marker).not.toBeNull();
    }
  });

  it("renders the complete premium block vocabulary with its documented caps", async () => {
    const post = baselinePost({
      articleBody: [
        { heading: "Introduction", body: ["Opening."] },
        {
          heading: "Premium editorial system",
          sectionNumber: "02",
          leadStyle: "drop-cap",
          body: ["A visually distinct lead paragraph explains the system."],
          keyTakeaways: {
            title: "In brief",
            items: Array.from(
              { length: 8 },
              (_, index) => `Takeaway ${String(index + 1)}`,
            ),
          },
          statBand: {
            title: "Evidence at a glance",
            items: Array.from({ length: 5 }, (_, index) => ({
              value: `${String(index + 1)}x`,
              label: `Metric ${String(index + 1)}`,
              detail: "Measured outcome",
              tone: index === 1 ? ("cost" as const) : ("growth" as const),
            })),
          },
          versusCard: {
            eyebrow: "Operating choice",
            left: {
              label: "Pro",
              title: "Build around the workflow",
              body: "The operating model stays visible.",
              points: ["Clear ownership", "Measured handoffs"],
            },
            right: {
              label: "Con",
              title: "Buy before mapping",
              body: "Tool choice hides the process gap.",
              points: ["Unclear ownership", "Duplicate systems"],
            },
            verdict: "Map the workflow before choosing the platform.",
          },
          definitions: {
            title: "Working definitions",
            items: Array.from({ length: 9 }, (_, index) => ({
              term: `Term ${String(index + 1)}`,
              definition: `Definition ${String(index + 1)}`,
              note: "Editorial note",
            })),
          },
          timeline: {
            title: "Delivery sequence",
            items: Array.from({ length: 9 }, (_, index) => ({
              label: `Week ${String(index + 1)}`,
              title: `Milestone ${String(index + 1)}`,
              body: "A time-bound delivery milestone.",
            })),
          },
          quoteCard: {
            quote: "The workflow should be legible before it is automated.",
            attribution: "Operations source",
            role: "Independent research",
            url: "https://source.example/research",
          },
        },
      ],
    });

    const { container } = renderArticle(post);

    await waitFor(() => {
      expect(container.querySelector(".ss-blog-article__stat-band")).not.toBeNull();
    });

    const premiumSection = [
      ...container.querySelectorAll(".ss-blog-article__section"),
    ].find((section) => section.textContent.includes("Premium editorial system"));
    expect(premiumSection?.getAttribute("data-lead-style")).toBe("drop-cap");
    expect(
      premiumSection?.querySelector(".ss-blog-article__section-heading > span")
        ?.textContent,
    ).toBe("02");
    expect(premiumSection?.querySelector('p[data-lead="true"]')).not.toBeNull();
    expect(
      premiumSection?.querySelectorAll(".ss-blog-article__takeaways li").length,
    ).toBe(7);
    expect(
      premiumSection?.querySelectorAll(".ss-blog-article__versus-grid article").length,
    ).toBe(2);
    expect(
      premiumSection?.querySelectorAll(".ss-blog-article__definitions dl > div").length,
    ).toBe(8);
    expect(
      premiumSection?.querySelectorAll(".ss-blog-article__timeline li").length,
    ).toBe(8);
    expect(
      premiumSection?.querySelector(".ss-blog-article__quote-card figcaption")
        ?.textContent,
    ).toContain("Operations source");

    const statBand = container.querySelector(".ss-blog-article__stat-band");
    expect(statBand?.querySelectorAll("dl > div").length).toBe(4);
    expect(statBand?.closest(".ss-blog-article__section")).toBeNull();
    const quoteLink = premiumSection?.querySelector<HTMLAnchorElement>(
      'a[href="https://source.example/research"]',
    );
    expect(quoteLink?.getAttribute("rel")).toBe("noopener noreferrer nofollow");
  });
});
