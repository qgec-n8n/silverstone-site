import { describe, expect, it } from "vitest";

import { PUBLISHED_BLOG_POSTS } from "~/data/blog-posts";
import { getRelatedPosts } from "~/data/blog-related";

describe("blog related posts", () => {
  it("gives every published post sibling article links", () => {
    // The Ahrefs crawl of 2026-07-31 found 28 posts whose only internal
    // dofollow inlink was /blog itself. Every post must now hand links to
    // other posts, so no article is a one-hop leaf again.
    for (const post of PUBLISHED_BLOG_POSTS) {
      const related = getRelatedPosts(post);
      expect(related.length, post.slug).toBeGreaterThan(0);
      expect(
        related.map((entry) => entry.slug),
        post.slug,
      ).not.toContain(post.slug);
    }
  });

  it("prefers same-category siblings, which is where the topic duplicates sit", () => {
    const byCategory = new Map<string, number>();
    for (const post of PUBLISHED_BLOG_POSTS) {
      byCategory.set(post.categoryKey, (byCategory.get(post.categoryKey) ?? 0) + 1);
    }

    for (const post of PUBLISHED_BLOG_POSTS) {
      const siblings = (byCategory.get(post.categoryKey) ?? 1) - 1;
      if (siblings === 0) continue;
      const related = getRelatedPosts(post);
      // Every sibling that fits in the list must be ranked ahead of any
      // unrelated post — this is what links the near-duplicate pairs the
      // automation writes into one topic slot (two on salons, two on gyms, …).
      const expected = Math.min(siblings, related.length);
      const leading = related.slice(0, expected);
      expect(
        leading.every((entry) => entry.categoryKey === post.categoryKey),
        `${post.slug} (${post.categoryKey})`,
      ).toBe(true);
    }
  });

  it("is deterministic, so prerendered output stays stable between builds", () => {
    for (const post of PUBLISHED_BLOG_POSTS.slice(0, 8)) {
      expect(getRelatedPosts(post).map((entry) => entry.slug)).toEqual(
        getRelatedPosts(post).map((entry) => entry.slug),
      );
    }
  });
});
