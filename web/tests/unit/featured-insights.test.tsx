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
      referenceDate: "2026-07-17",
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
      referenceDate: "2026-07-17",
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
      referenceDate: "2026-07-17",
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
      referenceDate: "2026-07-17",
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
      referenceDate: "2026-07-17",
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
      referenceDate: "2026-07-17",
    });

    expect(selection.articles.map((post) => post.slug)).toEqual([
      "beta-signal",
      "alpha-signal",
    ]);
    expect(selection.supporting).toHaveLength(1);
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
      name: "This week’s selected signals",
    });
    expect(
      within(section).getByRole("heading", {
        level: 2,
        name: "This week’s selected signals",
      }),
    ).toBeInTheDocument();

    for (const post of CURRENT_FEATURED_INSIGHTS.articles) {
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

  it("renders one primary and exactly four ordered supporting article links", () => {
    const selection = {
      articles: [alpha, beta, gamma, delta, epsilon],
      edition: edition([alpha.slug, beta.slug, gamma.slug, delta.slug, epsilon.slug]),
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
      name: "This week’s selected signals",
    });
    const primary = section.querySelectorAll('[data-featured-card="primary"]');
    const supporting = section.querySelectorAll('[data-featured-card="supporting"]');
    const links = within(section).getAllByRole("link");

    expect(primary).toHaveLength(1);
    expect(supporting).toHaveLength(4);
    expect(links).toHaveLength(5);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      `/blog/${alpha.slug}`,
      `/blog/${beta.slug}`,
      `/blog/${gamma.slug}`,
      `/blog/${delta.slug}`,
      `/blog/${epsilon.slug}`,
    ]);
    expect(section.querySelector("a a, a button, button a")).toBeNull();
  });
});
