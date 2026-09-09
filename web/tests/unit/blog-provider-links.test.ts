import { describe, expect, it } from "vitest";

import { PUBLISHED_BLOG_POSTS } from "~/data/blog-posts";
import type {
  SilverstoneBlogRankedCard,
  SilverstoneBlogSection,
} from "~/data/blog-posts";
import {
  buildProviderLinkIndex,
  resolveProviderWebsite,
  withResolvedProviderLinks,
} from "~/data/blog-provider-links";

function flatten(
  sections: readonly SilverstoneBlogSection[],
): SilverstoneBlogSection[] {
  return sections.flatMap((section) => [
    section,
    ...flatten(section.subsections ?? []),
  ]);
}

function rankedCardsOf(
  sections: readonly SilverstoneBlogSection[],
): SilverstoneBlogRankedCard[] {
  return flatten(sections).flatMap((section) => section.rankedCards ?? []);
}

const rankedPosts = PUBLISHED_BLOG_POSTS.filter(
  (post) => rankedCardsOf(post.articleBody).length > 0,
);

const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./i, "");

describe("blog provider links", () => {
  it("has ranked shortlists to resolve", () => {
    expect(rankedPosts.length).toBeGreaterThan(0);
  });

  /**
   * The published cards were filled in by hand, so they are the answer key: if
   * the registry index disagrees with a human-checked value, the matching is
   * wrong and would mislink every shortlist written from now on.
   */
  it("agrees with every hand-filled website it can resolve", () => {
    const disagreements: string[] = [];
    let checked = 0;

    for (const post of rankedPosts) {
      const index = buildProviderLinkIndex(post.researchSources);
      for (const card of rankedCardsOf(post.articleBody)) {
        const declared = card.website?.trim();
        const resolvedUrl = resolveProviderWebsite(card.name, index);
        if (!declared || !resolvedUrl) {
          continue;
        }
        checked += 1;
        if (hostOf(declared) !== hostOf(resolvedUrl)) {
          disagreements.push(
            `${post.slug} / ${card.name}: declared ${hostOf(declared)}, resolved ${hostOf(resolvedUrl)}`,
          );
        }
      }
    }

    expect(disagreements).toEqual([]);
    expect(checked).toBeGreaterThan(0);
  });

  it("never overwrites a website the card already carries", () => {
    for (const post of rankedPosts) {
      const before = rankedCardsOf(post.articleBody);
      const after = rankedCardsOf(withResolvedProviderLinks(post).articleBody);
      for (const [position, card] of before.entries()) {
        if (card.website) {
          expect(after[position]?.website).toBe(card.website);
        }
      }
    }
  });

  /**
   * The point of the module: a card that arrives without a website — which is
   * every card the automation writes — comes back with the URL the article's
   * own research verified for that organisation.
   */
  it("fills a website the automation omitted, from the article's own research", () => {
    const post = rankedPosts.find((candidate) =>
      candidate.researchSources.some(
        (source) => source.registryProvider === true && source.organisationName,
      ),
    );
    expect(post).toBeDefined();
    if (!post) {
      return;
    }

    const named = post.researchSources.find(
      (source) => source.registryProvider === true && source.organisationName,
    );
    expect(named).toBeDefined();
    if (!named) {
      return;
    }

    const stripped = {
      ...post,
      articleBody: post.articleBody.map((section) =>
        section.rankedCards
          ? {
              ...section,
              rankedCards: section.rankedCards.map((card) => {
                // Reproduce exactly what the automation writes today: a card
                // with no `website` key at all.
                const withoutWebsite: SilverstoneBlogRankedCard = { ...card };
                delete withoutWebsite.website;
                return withoutWebsite;
              }),
            }
          : section,
      ),
    };

    const filled = rankedCardsOf(withResolvedProviderLinks(stripped).articleBody);
    expect(filled.length).toBeGreaterThan(0);
    expect(filled.some((card) => card.website !== undefined)).toBe(true);
    for (const card of filled) {
      if (card.website) {
        expect(card.website.startsWith("https://")).toBe(true);
      }
    }
  });

  it("only indexes registry-verified https sources", () => {
    const index = buildProviderLinkIndex([
      {
        title: "A magazine profile of Acme",
        url: "https://magazine.example/acme-profile",
      },
      {
        title: "Acme",
        url: "http://acme.example",
        organisationName: "Acme",
        registryProvider: true,
      },
      {
        title: "Beta Systems",
        url: "https://beta-systems.example",
        organisationName: "Beta Systems",
        registryProvider: true,
      },
    ]);

    // The unverified citation and the non-https record contribute nothing.
    expect(resolveProviderWebsite("Acme", index)).toBeNull();
    expect(resolveProviderWebsite("Beta Systems", index)).toBe(
      "https://beta-systems.example",
    );
    // Domain is a second key for the same record, so a card naming the site
    // rather than the organisation still resolves.
    expect(resolveProviderWebsite("betasystems", index)).toBe(
      "https://beta-systems.example",
    );
  });
});
