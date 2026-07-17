import { PUBLISHED_BLOG_POSTS, type SilverstoneBlogPost } from "~/data/blog-posts";

export type FeaturedInsightEdition = {
  id: string;
  label: string;
  startsOn: string;
  slugs: readonly string[];
};

export type FeaturedInsightSelection = {
  articles: readonly SilverstoneBlogPost[];
  edition: FeaturedInsightEdition | null;
  primary: SilverstoneBlogPost | undefined;
  supporting: readonly SilverstoneBlogPost[];
};

type ResolveFeaturedInsightsOptions = {
  editions?: readonly FeaturedInsightEdition[];
  limit?: number;
  posts?: readonly SilverstoneBlogPost[];
  referenceDate: string;
};

/**
 * Weekly curation lives here. Slugs are ordered primary first, then supporting.
 * Missing, duplicate, unpublished and unknown slugs are ignored; the newest
 * eligible posts fill any open positions. An edition becomes active on its
 * `startsOn` date when the next normal build/deployment stamps the build date.
 */
export const FEATURED_INSIGHT_EDITIONS: readonly FeaturedInsightEdition[] = [
  {
    id: "2026-w29",
    label: "Weekly edition 29",
    startsOn: "2026-07-13",
    slugs: [
      "small-business-ai-automation",
      "small-business-web-development",
      "small-business-app-development",
    ],
  },
];

const PLACEHOLDER_SLUGS = new Set(["placeholder-article", "placeholder-article-slug"]);

function dayTimestamp(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) {
    return Number.NaN;
  }

  return Date.parse(`${value}T00:00:00.000Z`);
}

function postTimestamp(post: SilverstoneBlogPost): number {
  const timestamp = Date.parse(post.publishedIsoDate || post.updatedIsoDate);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function newestFirst(left: SilverstoneBlogPost, right: SilverstoneBlogPost): number {
  const dateDifference = postTimestamp(right) - postTimestamp(left);
  return dateDifference || left.slug.localeCompare(right.slug);
}

function activeEdition(
  editions: readonly FeaturedInsightEdition[],
  referenceDate: string,
): FeaturedInsightEdition | null {
  const referenceTimestamp = dayTimestamp(referenceDate);
  if (!Number.isFinite(referenceTimestamp)) {
    return null;
  }

  return (
    editions
      .map((edition, index) => ({
        edition,
        index,
        timestamp: dayTimestamp(edition.startsOn),
      }))
      .filter(
        ({ timestamp }) =>
          Number.isFinite(timestamp) && timestamp <= referenceTimestamp,
      )
      .sort(
        (left, right) => right.timestamp - left.timestamp || right.index - left.index,
      )[0]?.edition ?? null
  );
}

export function resolveFeaturedInsights({
  referenceDate,
  posts = PUBLISHED_BLOG_POSTS,
  editions = FEATURED_INSIGHT_EDITIONS,
  limit = 3,
}: ResolveFeaturedInsightsOptions): FeaturedInsightSelection {
  const selectionLimit = Math.max(0, Math.floor(limit));
  const published = posts
    .filter((post) => post.status === "published" && !PLACEHOLDER_SLUGS.has(post.slug))
    .slice()
    .sort(newestFirst);
  const postBySlug = new Map(published.map((post) => [post.slug, post]));
  const edition = activeEdition(editions, referenceDate);
  const selected: SilverstoneBlogPost[] = [];
  const selectedSlugs = new Set<string>();

  for (const slug of edition?.slugs ?? []) {
    if (selected.length >= selectionLimit || selectedSlugs.has(slug)) {
      continue;
    }

    const post = postBySlug.get(slug);
    if (!post) {
      continue;
    }

    selected.push(post);
    selectedSlugs.add(slug);
  }

  for (const post of published) {
    if (selected.length >= selectionLimit) {
      break;
    }
    if (!selectedSlugs.has(post.slug)) {
      selected.push(post);
      selectedSlugs.add(post.slug);
    }
  }

  return {
    edition,
    articles: selected,
    primary: selected[0],
    supporting: selected.slice(1),
  };
}

const fallbackBuildDate = FEATURED_INSIGHT_EDITIONS.at(-1)?.startsOn ?? "1970-01-01";

export const FEATURED_INSIGHTS_BUILD_DATE =
  typeof __SILVERSTONE_BUILD_DATE__ === "string"
    ? __SILVERSTONE_BUILD_DATE__
    : fallbackBuildDate;

export const CURRENT_FEATURED_INSIGHTS = resolveFeaturedInsights({
  referenceDate: FEATURED_INSIGHTS_BUILD_DATE,
});
