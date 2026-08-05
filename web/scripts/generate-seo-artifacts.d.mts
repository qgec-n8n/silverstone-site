/**
 * Type surface for generate-seo-artifacts.mjs (plain-node build script).
 * Keep in sync with the exported helpers; the unit tests exercise them.
 */
import type { SilverstoneBlogPost } from "../src/data/blog-posts";

export interface SitemapEntry {
  loc: string;
  lastmod?: string | undefined;
}

export function expectedPagePaths(): string[];
export function expectedPostPaths(): string[];
export function validateBlogData(now?: Date): string[];
export function postLastmod(post: SilverstoneBlogPost): string;
export function pageLastmod(routePath: string): string | undefined;
export function renderUrlset(entries: readonly SitemapEntry[]): string;
export function renderSitemapIndex(children: readonly SitemapEntry[]): string;
export function renderRedirectsFile(): string;

/** One Atom `<entry>`; dates are RFC 3339 timestamps normalised to UTC. */
export interface FeedEntry {
  id: string;
  published: string;
  slug: string;
  summary: string;
  title: string;
  updated: string;
}

/**
 * What the feed builder reads off a post. `updatedIsoDate` is optional here
 * (unlike on `SilverstoneBlogPost`) because the builder's documented fallback
 * to `publishedIsoDate` has to be expressible.
 */
export interface FeedSourcePost {
  metaDescription: string;
  publishedIsoDate: string;
  slug: string;
  title: string;
  updatedIsoDate?: string | undefined;
}

export const FEED_MAX_ENTRIES: number;
export function buildFeedEntries(
  posts: readonly FeedSourcePost[],
  limit?: number,
): FeedEntry[];
export function renderAtomFeed(entries: readonly FeedEntry[]): string;
