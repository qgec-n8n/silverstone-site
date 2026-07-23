import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { PUBLISHED_BLOG_POSTS } from "~/data/blog-posts";
import { BLOG_HERO_IMAGE_HEIGHT, BLOG_HERO_IMAGE_WIDTH } from "~/routes/blog/article";

describe("published blog slug policy", () => {
  it("keeps every canonical slug concise, descriptive, unique, and asset-backed", () => {
    const slugs = PUBLISHED_BLOG_POSTS.map((post) => post.slug);

    // The catalogue only ever grows through the daily publishing automation;
    // a hard-coded exact count broke on every publish. Guard against mass
    // deletion instead (21 posts existed at the 2026-07-14 slug migration).
    expect(PUBLISHED_BLOG_POSTS.length).toBeGreaterThanOrEqual(21);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const post of PUBLISHED_BLOG_POSTS) {
      const words = post.slug.split("-");

      expect(post.slug, post.title).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(words.length, post.title).toBeGreaterThanOrEqual(3);
      expect(words.length, post.title).toBeLessThanOrEqual(6);
      expect(post.slug.length, post.title).toBeGreaterThanOrEqual(20);
      expect(post.slug.length, post.title).toBeLessThanOrEqual(60);
      expect(new Set(words).size, post.title).toBe(words.length);
      expect(post.heroImage, post.title).toBe(
        `/assets/images/blog/${post.slug}-hero.webp`,
      );
      expect(
        existsSync(path.join(process.cwd(), "public", post.heroImage)),
        post.title,
      ).toBe(true);
    }
  });

  it("keeps every hero at the dimensions the article og:image tags declare", () => {
    // routes/blog/article.tsx advertises BLOG_HERO_IMAGE_WIDTH/HEIGHT to social
    // crawlers as a constant rather than measuring per post. If the publishing
    // automation ever emits a differently sized hero, those tags would describe
    // the wrong box, so pin the invariant here instead.
    for (const post of PUBLISHED_BLOG_POSTS) {
      const file = readFileSync(path.join(process.cwd(), "public", post.heroImage));

      expect(file.subarray(0, 4).toString("ascii"), post.title).toBe("RIFF");
      expect(file.subarray(8, 12).toString("ascii"), post.title).toBe("WEBP");
      // Lossy VP8 bitstream: the keyframe header carries width and height as
      // 14-bit little-endian fields at byte 26 and 28 (the top 2 bits are the
      // upscaling hint, which nothing here uses).
      expect(file.subarray(12, 16).toString("ascii"), post.title).toBe("VP8 ");
      expect(file.readUInt16LE(26) & 0x3fff, post.title).toBe(BLOG_HERO_IMAGE_WIDTH);
      expect(file.readUInt16LE(28) & 0x3fff, post.title).toBe(BLOG_HERO_IMAGE_HEIGHT);
    }
  });

  it("keeps title, metaTitle and metaDescription present and unique per post", () => {
    // Mirrors the production deploy gate in
    // web/scripts/generate-seo-artifacts.mjs (validateBlogData) and the
    // article contract in docs/blog-article-contract.md.
    for (const field of ["title", "metaTitle", "metaDescription"] as const) {
      const values = PUBLISHED_BLOG_POSTS.map((post) => {
        expect(post[field].trim(), `${post.slug} ${field}`).toBeTruthy();
        return post[field].trim();
      });
      expect(new Set(values).size, field).toBe(values.length);
    }
  });

  it("never dates an update before publication", () => {
    for (const post of PUBLISHED_BLOG_POSTS) {
      const published = Date.parse(post.publishedIsoDate);
      const updated = Date.parse(post.updatedIsoDate);
      expect(Number.isNaN(published), post.slug).toBe(false);
      expect(Number.isNaN(updated), post.slug).toBe(false);
      expect(updated, post.slug).toBeGreaterThanOrEqual(published);
    }
  });
});
