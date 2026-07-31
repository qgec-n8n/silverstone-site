import { PUBLISHED_BLOG_POSTS, type SilverstoneBlogPost } from "~/data/blog-posts";

/**
 * Post-to-post "related reading" links.
 *
 * The publishing automation gives every article `internalLinks` into the
 * service and industry pages, but nothing pointing at other articles. The
 * 2026-07-31 Ahrefs crawl found the consequence: 28 posts whose only internal
 * dofollow inlink came from /blog itself. A post one hop from the index, with
 * no sibling links, is the classic shape for "discovered but not indexed" —
 * and it is exactly the set that was still unindexed weeks after publication.
 *
 * The same automation also writes several articles into one topic slot (two on
 * salons, two on gyms, two on trades, and so on). Those near-duplicates compete
 * with each other in search; linking them to one another is what tells Google
 * they are a cluster rather than rival pages.
 *
 * Derived rather than stored, because `blog-posts.ts` is rewritten wholesale by
 * the n8n commit each day — anything written into it by hand would be lost, and
 * new posts join a cluster here with no extra step.
 */

function keywordSet(post: SilverstoneBlogPost): Set<string> {
  const words = [post.primaryKeyword, ...post.secondaryKeywords]
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3);
  return new Set(words);
}

function overlap(a: Set<string>, b: Set<string>): number {
  let count = 0;
  for (const word of a) {
    if (b.has(word)) count += 1;
  }
  return count;
}

const newestFirst = (a: SilverstoneBlogPost, b: SilverstoneBlogPost) =>
  b.publishedIsoDate.localeCompare(a.publishedIsoDate) || a.slug.localeCompare(b.slug);

/**
 * Up to `limit` sibling articles, strongest relationship first: same category,
 * then shared keywords, then most recent. Ties break on slug so prerendered
 * output stays byte-stable between builds.
 */
export function getRelatedPosts(
  post: SilverstoneBlogPost,
  limit = 3,
  posts: readonly SilverstoneBlogPost[] = PUBLISHED_BLOG_POSTS,
): SilverstoneBlogPost[] {
  const own = keywordSet(post);
  const candidates = posts.filter((candidate) => candidate.slug !== post.slug);

  const scored = candidates
    .map((candidate) => ({
      post: candidate,
      sameCategory: candidate.categoryKey === post.categoryKey ? 1 : 0,
      shared: overlap(own, keywordSet(candidate)),
    }))
    .sort(
      (a, b) =>
        b.sameCategory - a.sameCategory ||
        b.shared - a.shared ||
        newestFirst(a.post, b.post),
    );

  return scored.slice(0, limit).map((entry) => entry.post);
}
