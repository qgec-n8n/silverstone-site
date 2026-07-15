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
