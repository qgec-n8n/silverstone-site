import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import {
  CURRENT_FEATURED_INSIGHTS,
  resolveFeaturedInsights,
  type FeaturedInsightEdition,
} from "~/data/featured-insights";
import type { SilverstoneBlogPost } from "~/data/blog-posts";
import { FeaturedInsights } from "~/features/core-pages/featured-insights";
import { MotionProvider } from "~/motion/MotionProvider";

function makePost({
  date,
  slug,
  status = "published",
}: {
  date: string;
  slug: string;
  status?: SilverstoneBlogPost["status"];
}): SilverstoneBlogPost {
  return {
    articleBody: [],
    categoryId: "ai-automation",
    categoryKey: "ai-automation",
    categoryLabel: "AI Automation",
    categoryOrder: 1,
    ctaPrimary: { href: "/book", label: "Book" },
    ctaSecondary: { href: "/blog", label: "Insights" },
    displayDate: "17 July 2026",
    faqs: [],
    heroImage: `/assets/images/blog/${slug}-hero.webp`,
    heroImageAlt: `Editorial cover for ${slug}`,
    imagePrompt: "",
    internalLinks: [],
    metaDescription: `${slug} description`,
    metaTitle: slug,
    primaryKeyword: slug,
    publishedIsoDate: `${date}T08:00:00.000Z`,
    readTime: "5 min read",
    researchSources: [],
    secondaryKeywords: [],
    slug,
    status,
    subtitle: `${slug} subtitle`,
    summary: [`${slug} summary`],
    title: `${slug} title`,
    updatedIsoDate: `${date}T08:00:00.000Z`,
  };
}

const alpha = makePost({ slug: "alpha-signal", date: "2026-07-01" });
const beta = makePost({ slug: "beta-signal", date: "2026-07-02" });
const gamma = makePost({ slug: "gamma-signal", date: "2026-07-03" });
const delta = makePost({ slug: "delta-signal", date: "2026-07-04" });
const epsilon = makePost({ slug: "epsilon-signal", date: "2026-07-05" });

/** Inside the default seven-day window of the pin below. */
const PINNED_DAY = "2026-07-12";

function edition(slugs: readonly string[]): FeaturedInsightEdition {
  return {
    id: "test-edition",
    label: "Test edition",
    startsOn: "2026-07-10",
    slugs,
  };
}

describe("resolveFeaturedInsights", () => {
  it("preserves the configured primary and supporting order", () => {
    const selection = resolveFeaturedInsights({
      editions: [edition(["beta-signal", "alpha-signal", "gamma-signal"])],
      posts: [alpha, beta, gamma],
      referenceDate: PINNED_DAY,
    });

    expect(selection.primary?.slug).toBe("beta-signal");
    expect(selection.supporting.map((post) => post.slug)).toEqual([
      "alpha-signal",
      "gamma-signal",
    ]);
  });

  it("ignores invalid configured slugs", () => {
    const selection = resolveFeaturedInsights({
      editions: [edition(["missing-signal", "beta-signal"])],
      posts: [alpha, beta, gamma],
      referenceDate: PINNED_DAY,
    });

    expect(selection.articles.map((post) => post.slug)).toEqual([
      "beta-signal",
      "gamma-signal",
      "alpha-signal",
    ]);
  });

  it("removes duplicate configured slugs", () => {
    const selection = resolveFeaturedInsights({
      editions: [edition(["beta-signal", "beta-signal", "alpha-signal"])],
      posts: [alpha, beta, gamma],
      referenceDate: PINNED_DAY,
    });

    expect(selection.articles.map((post) => post.slug)).toEqual([
      "beta-signal",
      "alpha-signal",
      "gamma-signal",
    ]);
  });

  it("removes unpublished and placeholder posts", () => {
    const draft = makePost({
      slug: "draft-signal",
      date: "2026-07-05",
      status: "draft",
    });
    const placeholder = makePost({
      slug: "placeholder-article",
      date: "2026-07-06",
    });
    const selection = resolveFeaturedInsights({
      editions: [edition([draft.slug, placeholder.slug, beta.slug])],
      posts: [alpha, beta, draft, placeholder],
      referenceDate: PINNED_DAY,
    });

    expect(selection.articles.map((post) => post.slug)).toEqual([
      "beta-signal",
      "alpha-signal",
    ]);
  });

  it("fills configured gaps with the newest eligible posts", () => {
    const selection = resolveFeaturedInsights({
      editions: [edition(["alpha-signal"])],
      posts: [alpha, beta, gamma, delta],
      referenceDate: PINNED_DAY,
    });

    expect(selection.articles.map((post) => post.slug)).toEqual([
      "alpha-signal",
      "delta-signal",
      "gamma-signal",
      "beta-signal",
    ]);
  });

  it("uses the newest posts up to the five-card limit when no edition is active", () => {
    const selection = resolveFeaturedInsights({
      editions: [edition(["alpha-signal"])],
      posts: [alpha, beta, gamma, delta],
      referenceDate: "2026-07-09",
    });

    expect(selection.edition).toBeNull();
    expect(selection.articles.map((post) => post.slug)).toEqual([
      "delta-signal",
      "gamma-signal",
      "beta-signal",
      "alpha-signal",
    ]);
  });

  it("returns only the eligible posts available when fewer than five exist", () => {
    const selection = resolveFeaturedInsights({
      editions: [],
      posts: [alpha, beta],
      referenceDate: PINNED_DAY,
    });

    expect(selection.articles.map((post) => post.slug)).toEqual([
      "beta-signal",
      "alpha-signal",
    ]);
    expect(selection.supporting).toHaveLength(1);
  });

  it("rotates on recency alone when nothing is pinned", () => {
    const selection = resolveFeaturedInsights({
      editions: [],
      posts: [gamma, alpha, epsilon, beta, delta],
      referenceDate: "2026-07-05",
    });

    expect(selection.edition).toBeNull();
    expect(selection.primary?.slug).toBe("epsilon-signal");
    expect(selection.supporting.slice(0, 2).map((post) => post.slug)).toEqual([
      "delta-signal",
      "gamma-signal",
    ]);
  });

  it("promotes a newly published post to the primary card", () => {
    const zeta = makePost({ slug: "zeta-signal", date: "2026-07-06" });
    const before = resolveFeaturedInsights({
      editions: [],
      posts: [alpha, beta, gamma, delta, epsilon],
      referenceDate: "2026-07-05",
    });
    const after = resolveFeaturedInsights({
      editions: [],
      posts: [alpha, beta, gamma, delta, epsilon, zeta],
      referenceDate: "2026-07-06",
    });

    expect(before.primary?.slug).toBe("epsilon-signal");
    expect(after.primary?.slug).toBe("zeta-signal");
    expect(after.supporting[0]?.slug).toBe("epsilon-signal");
  });

  it("resumes rotation once a pin's window has closed", () => {
    const pinned = resolveFeaturedInsights({
      editions: [edition(["alpha-signal"])],
      posts: [alpha, beta, gamma, delta],
      referenceDate: "2026-07-16",
    });
    const expired = resolveFeaturedInsights({
      editions: [edition(["alpha-signal"])],
      posts: [alpha, beta, gamma, delta],
      referenceDate: "2026-07-17",
    });

    expect(pinned.primary?.slug).toBe("alpha-signal");
    expect(expired.edition).toBeNull();
    expect(expired.primary?.slug).toBe("delta-signal");
  });

  it("honours an explicit pin end date", () => {
    const options = {
      editions: [{ ...edition(["alpha-signal"]), endsOn: "2026-07-12" }],
      posts: [alpha, beta, gamma, delta],
    } as const;

    expect(
      resolveFeaturedInsights({ ...options, referenceDate: "2026-07-11" }).primary
        ?.slug,
    ).toBe("alpha-signal");
    expect(
      resolveFeaturedInsights({ ...options, referenceDate: "2026-07-12" }).primary
        ?.slug,
    ).toBe("delta-signal");
  });

  it("marks the posts published on the dispatch day and dates the dispatch", () => {
    const selection = resolveFeaturedInsights({
      editions: [],
      posts: [alpha, beta, gamma, delta, epsilon],
      referenceDate: "2026-07-05",
    });

    expect(selection.dispatchDate).toBe("2026-07-05");
    expect(selection.dispatchLabel).toBe(epsilon.displayDate);
    expect(selection.freshSlugs).toEqual(["epsilon-signal"]);
  });

  it("leaves the freshness marker off when nothing published that day", () => {
    const selection = resolveFeaturedInsights({
      editions: [],
      posts: [alpha, beta, gamma],
      referenceDate: PINNED_DAY,
    });

    expect(selection.freshSlugs).toEqual([]);
  });
});

describe("FeaturedInsights", () => {
  it("renders accessible real-article links without the retired GDPR placeholder", () => {
    render(
      <MemoryRouter>
        <MotionProvider>
          <FeaturedInsights />
        </MotionProvider>
      </MemoryRouter>,
    );

    const section = screen.getByRole("region", {
      name: "The newest selected signals",
    });
    expect(
      within(section).getByRole("heading", {
        level: 2,
        name: "The newest selected signals",
      }),
    ).toBeInTheDocument();

    // The layout shows the primary plus two supporting cards; any further
    // selected articles are held in reserve and never rendered.
    const displayed = [
      CURRENT_FEATURED_INSIGHTS.primary,
      ...CURRENT_FEATURED_INSIGHTS.supporting.slice(0, 2),
    ].filter((post): post is NonNullable<typeof post> => post !== undefined);
    expect(displayed.length).toBeGreaterThan(0);
    for (const post of displayed) {
      expect(
        within(section).getByRole("article", { name: post.title }),
      ).toBeInTheDocument();
      expect(
        within(section).getByRole("link", {
          name: (accessibleName) => accessibleName.includes(post.title),
        }),
      ).toHaveAttribute("href", `/blog/${post.slug}`);
    }

    expect(
      within(section).queryByText(/AI automation and UK GDPR/i),
    ).not.toBeInTheDocument();
    expect(
      within(section).queryByText(/The guide, in development/i),
    ).not.toBeInTheDocument();
  });

  it("renders one primary and exactly two ordered supporting article links", () => {
    // The selection may carry more supporting posts than the layout shows;
    // the component itself caps the display at two supporting cards.
    const selection = {
      articles: [alpha, beta, gamma, delta, epsilon],
      dispatchDate: PINNED_DAY,
      dispatchLabel: alpha.displayDate,
      edition: edition([alpha.slug, beta.slug, gamma.slug, delta.slug, epsilon.slug]),
      freshSlugs: [],
      primary: alpha,
      supporting: [beta, gamma, delta, epsilon],
    };

    render(
      <MemoryRouter>
        <MotionProvider>
          <FeaturedInsights selection={selection} />
        </MotionProvider>
      </MemoryRouter>,
    );

    const section = screen.getByRole("region", {
      name: "The newest selected signals",
    });
    const primary = section.querySelectorAll('[data-featured-card="primary"]');
    const supporting = section.querySelectorAll('[data-featured-card="supporting"]');
    const links = within(section).getAllByRole("link");

    expect(primary).toHaveLength(1);
    expect(supporting).toHaveLength(2);
    expect(links).toHaveLength(3);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      `/blog/${alpha.slug}`,
      `/blog/${beta.slug}`,
      `/blog/${gamma.slug}`,
    ]);
    expect(section.querySelector("a a, a button, button a")).toBeNull();
  });
});
