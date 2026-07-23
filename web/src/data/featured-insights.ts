import { PUBLISHED_BLOG_POSTS, type SilverstoneBlogPost } from "~/data/blog-posts";

export type FeaturedInsightEdition = {
  /** Exclusive last day of the pin. Defaults to `startsOn` + EDITION_RUN_DAYS. */
  endsOn?: string;
  id: string;
  label: string;
  slugs: readonly string[];
  startsOn: string;
};

export type FeaturedInsightSelection = {
  articles: readonly SilverstoneBlogPost[];
  /** UTC day (YYYY-MM-DD) the selection was resolved against — the build date. */
  dispatchDate: string;
  /** Human dateline for the dispatch chip, taken from the newest card shown. */
  dispatchLabel: string;
  edition: FeaturedInsightEdition | null;
  /** Slugs published on `dispatchDate`, i.e. this morning's arrivals. */
  freshSlugs: readonly string[];
  primary: SilverstoneBlogPost | undefined;
  supporting: readonly SilverstoneBlogPost[];
};

type ResolveFeaturedInsightsOptions = {
  editions?: readonly FeaturedInsightEdition[];
  limit?: number;
  posts?: readonly SilverstoneBlogPost[];
  referenceDate: string;
};

const DAY_MS = 86_400_000;

/**
 * How long a manual pin holds the board before rotation resumes. A pin is a
 * short campaign override, never a permanent state: without this ceiling one
 * forgotten edition freezes the section for good.
 */
const EDITION_RUN_DAYS = 7;

/**
 * The board rotates on its own: the three newest published posts fill the
 * primary and two supporting cards, newest first, on every build. A daily
 * article therefore promotes itself the moment its commit is deployed, with
 * no file in this repository to edit.
 *
 * Pins below are the exception, not the mechanism — use one only to hold a
 * launch or campaign piece at the top for a few days:
 *
 *   {
 *     id: "2026-w30",
 *     label: "Launch dispatch",
 *     startsOn: "2026-07-27",
 *     endsOn: "2026-07-30",   // optional; defaults to seven days
 *     slugs: ["a-slug", "another-slug"],
 *   }
 *
 * Slugs are ordered primary first. Missing, duplicate, unpublished and unknown
 * slugs are ignored, and the newest eligible posts fill any position the pin
 * leaves open. When the window closes the board returns to pure recency by
 * itself.
 */
export const FEATURED_INSIGHT_EDITIONS: readonly FeaturedInsightEdition[] = [];

const PLACEHOLDER_SLUGS = new Set(["placeholder-article", "placeholder-article-slug"]);

const DISPATCH_DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

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

function postDay(post: SilverstoneBlogPost): string {
  return (post.publishedIsoDate || post.updatedIsoDate).slice(0, 10);
}

function newestFirst(left: SilverstoneBlogPost, right: SilverstoneBlogPost): number {
  const dateDifference = postTimestamp(right) - postTimestamp(left);
  return dateDifference || left.slug.localeCompare(right.slug);
}

function editionEnd(edition: FeaturedInsightEdition, start: number): number {
  const explicitEnd = edition.endsOn ? dayTimestamp(edition.endsOn) : Number.NaN;
  return Number.isFinite(explicitEnd) ? explicitEnd : start + EDITION_RUN_DAYS * DAY_MS;
}

/**
 * The newest pin whose window contains the reference day. Windows are
 * half-open: a pin is live from `startsOn` up to, but not including, its end.
 */
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
        start: dayTimestamp(edition.startsOn),
      }))
      .filter(
        ({ edition, start }) =>
          Number.isFinite(start) &&
          start <= referenceTimestamp &&
          referenceTimestamp < editionEnd(edition, start),
      )
      .sort((left, right) => right.start - left.start || right.index - left.index)[0]
      ?.edition ?? null
  );
}

function formatDispatchDate(referenceDate: string): string {
  const timestamp = dayTimestamp(referenceDate);
  return Number.isFinite(timestamp)
    ? DISPATCH_DATE_FORMAT.format(new Date(timestamp))
    : "Latest published intelligence";
}

export function resolveFeaturedInsights({
  referenceDate,
  posts = PUBLISHED_BLOG_POSTS,
  editions = FEATURED_INSIGHT_EDITIONS,
  limit = 5,
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
    articles: selected,
    dispatchDate: referenceDate,
    dispatchLabel: selected[0]?.displayDate ?? formatDispatchDate(referenceDate),
    edition,
    freshSlugs: selected
      .filter((post) => postDay(post) === referenceDate)
      .map((post) => post.slug),
    primary: selected[0],
    supporting: selected.slice(1),
  };
}

const fallbackBuildDate =
  PUBLISHED_BLOG_POSTS.slice().sort(newestFirst)[0]?.publishedIsoDate.slice(0, 10) ??
  "1970-01-01";

export const FEATURED_INSIGHTS_BUILD_DATE =
  typeof __SILVERSTONE_BUILD_DATE__ === "string"
    ? __SILVERSTONE_BUILD_DATE__
    : fallbackBuildDate;

export const CURRENT_FEATURED_INSIGHTS = resolveFeaturedInsights({
  referenceDate: FEATURED_INSIGHTS_BUILD_DATE,
});
