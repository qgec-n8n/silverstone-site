import { describe, expect, it } from "vitest";

import {
  buildFeedEntries,
  FEED_MAX_ENTRIES,
  renderAtomFeed,
  type FeedEntry,
} from "../../scripts/generate-seo-artifacts.mjs";
import { PUBLISHED_BLOG_POSTS } from "~/data/blog-posts";

/** Minimal post shape the feed builder reads; `undefined` exercises the fallback. */
type FeedSource = Parameters<typeof buildFeedEntries>[0][number];

const post = (overrides: Partial<FeedSource> = {}): FeedSource => ({
  slug: "example-post-slug",
  title: "Example post",
  metaDescription: "An example description.",
  publishedIsoDate: "2026-08-01T08:00:00.000Z",
  updatedIsoDate: "2026-08-01T08:00:00.000Z",
  ...overrides,
});

describe("Atom feed entries", () => {
  it("orders newest-first by updated, then published, then slug", () => {
    const entries: FeedEntry[] = buildFeedEntries([
      post({
        slug: "oldest-example-post-slug",
        publishedIsoDate: "2026-07-01T08:00:00.000Z",
        updatedIsoDate: "2026-07-01T08:00:00.000Z",
      }),
      post({
        slug: "newest-example-post-slug",
        publishedIsoDate: "2026-08-03T08:00:00.000Z",
        updatedIsoDate: "2026-08-03T08:00:00.000Z",
      }),
      post({
        slug: "revised-example-post-slug",
        publishedIsoDate: "2026-07-02T08:00:00.000Z",
        updatedIsoDate: "2026-08-02T08:00:00.000Z",
      }),
    ]);

    expect(entries.map((entry) => entry.slug)).toEqual([
      "newest-example-post-slug",
      "revised-example-post-slug",
      "oldest-example-post-slug",
    ]);
  });

  it("keeps published and updated distinct, and never dates an update earlier", () => {
    const entries: FeedEntry[] = buildFeedEntries([
      post({
        slug: "revised-example-post-slug",
        publishedIsoDate: "2026-07-02T08:00:00.000Z",
        updatedIsoDate: "2026-08-02T09:30:00.000Z",
      }),
      // Rejected by validateBlogData at deploy time; clamped here as well so
      // shipped XML can never carry updated < published.
      post({
        slug: "backdated-example-post-slug",
        publishedIsoDate: "2026-07-02T08:00:00.000Z",
        updatedIsoDate: "2026-01-01T08:00:00.000Z",
      }),
    ]);

    expect(entries).toMatchObject([
      {
        slug: "revised-example-post-slug",
        published: "2026-07-02T08:00:00.000Z",
        updated: "2026-08-02T09:30:00.000Z",
      },
      {
        slug: "backdated-example-post-slug",
        published: "2026-07-02T08:00:00.000Z",
        updated: "2026-07-02T08:00:00.000Z",
      },
    ]);
  });

  it("falls back to published when no update date is recorded", () => {
    const entries: FeedEntry[] = buildFeedEntries([
      post({ updatedIsoDate: undefined }),
    ]);

    expect(entries).toMatchObject([{ updated: "2026-08-01T08:00:00.000Z" }]);
  });

  it("caps the feed at the recency window", () => {
    const many = Array.from({ length: FEED_MAX_ENTRIES + 25 }, (_unused, index) =>
      post({
        slug: `example-post-slug-${String(index)}`,
        publishedIsoDate: new Date(
          Date.UTC(2026, 0, 1) + index * 86_400_000,
        ).toISOString(),
        updatedIsoDate: new Date(
          Date.UTC(2026, 0, 1) + index * 86_400_000,
        ).toISOString(),
      }),
    );

    expect(buildFeedEntries(many)).toHaveLength(FEED_MAX_ENTRIES);
  });
});

describe("Atom feed document", () => {
  const xml: string = renderAtomFeed(
    buildFeedEntries([
      post({
        slug: "quotes-ampersands-example",
        title: 'Bookings, "deposits" & no-shows <br>',
        metaDescription: "Fees & terms — what to publish.",
      }),
    ]),
  );

  it("emits a well-formed Atom 1.0 document with the required feed elements", () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n')).toBe(true);
    expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
    expect(xml).toContain("<id>https://silverstone-ai.com/feed.xml</id>");
    expect(xml).toContain("<title>Silverstone AI Insights</title>");
    expect(xml).toContain(
      '<link rel="self" type="application/atom+xml" href="https://silverstone-ai.com/feed.xml"/>',
    );
    expect(xml).toContain(
      '<link rel="alternate" type="text/html" href="https://silverstone-ai.com/blog"/>',
    );
    // Feed <updated> mirrors the newest entry — never the build clock, so an
    // unchanged rebuild produces a byte-identical document.
    expect(xml).toContain("  <updated>2026-08-01T08:00:00.000Z</updated>");
  });

  it("gives every entry a canonical id, alternate link and both dates", () => {
    expect(xml).toContain(
      "<id>https://silverstone-ai.com/blog/quotes-ampersands-example</id>",
    );
    expect(xml).toContain(
      '<link rel="alternate" type="text/html" href="https://silverstone-ai.com/blog/quotes-ampersands-example"/>',
    );
    expect(xml).toContain("<published>2026-08-01T08:00:00.000Z</published>");
    expect(xml).toContain("<summary>Fees &amp; terms — what to publish.</summary>");
  });

  it("escapes markup-significant characters in titles", () => {
    expect(xml).toContain(
      "<title>Bookings, &quot;deposits&quot; &amp; no-shows &lt;br&gt;</title>",
    );
    expect(xml).not.toMatch(/<title>[^<]*<br>/);
  });

  it("refuses to write an empty feed", () => {
    expect(() => renderAtomFeed([])).toThrow(/empty Atom feed/);
  });

  it("builds a valid feed from the real published catalogue", () => {
    const entries: FeedEntry[] = buildFeedEntries(PUBLISHED_BLOG_POSTS);

    expect(entries.length).toBeGreaterThan(0);
    expect(entries.length).toBeLessThanOrEqual(FEED_MAX_ENTRIES);
    for (const entry of entries) {
      expect(entry.id).toMatch(/^https:\/\/silverstone-ai\.com\/blog\/[a-z0-9-]+$/);
      expect(entry.summary.trim()).not.toHaveLength(0);
      expect(Date.parse(entry.updated)).toBeGreaterThanOrEqual(
        Date.parse(entry.published),
      );
    }
    expect(renderAtomFeed(entries)).toContain("</feed>");
  });
});
