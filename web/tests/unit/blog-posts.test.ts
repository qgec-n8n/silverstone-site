import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  PUBLISHED_BLOG_POSTS,
  type SilverstoneBlogRankedCard,
  type SilverstoneBlogSection,
} from "~/data/blog-posts";
import { BLOG_HERO_IMAGE_HEIGHT, BLOG_HERO_IMAGE_WIDTH } from "~/routes/blog/article";

describe("published blog slug policy", () => {
  it("keeps the v2 editorial contract optional and additive", () => {
    const legacyRankedCard: SilverstoneBlogRankedCard = {
      name: "Existing provider",
      rank: 1,
      summary: "The original required fields remain sufficient.",
    };
    const editorialSection: SilverstoneBlogSection = {
      heading: "Contract fixture",
      body: ["A typed fixture exercises every additive field."],
      sectionNumber: "02",
      leadStyle: "drop-cap",
      entityLinks: [
        {
          name: "Silverstone AI",
          url: "https://silverstone-ai.com",
          kind: "silverstone",
        },
      ],
      keyTakeaways: { items: ["One explicit takeaway"] },
      statBand: {
        items: [{ label: "Time saved", value: "8 hours", tone: "time" }],
      },
      versusCard: {
        left: { title: "Mapped", body: "The workflow is explicit." },
        right: { title: "Unmapped", body: "The workflow stays implicit." },
      },
      definitions: {
        items: [{ term: "Handoff", definition: "A transfer of work or context." }],
      },
      timeline: {
        items: [{ title: "Discovery", body: "Map the current state." }],
      },
      quoteCard: { quote: "Make the process legible.", attribution: "Operator" },
    };

    expect(legacyRankedCard.website).toBeUndefined();
    expect(editorialSection.entityLinks?.[0]?.kind).toBe("silverstone");
    expect(editorialSection.statBand?.items[0]?.tone).toBe("time");
  });

  // This previously asserted that no published post carried any v2 field or
  // inline marker. That held only because nothing had published between the
  // contract landing and the automation's next run, so it encoded "v2 is unused
  // yet" as a permanent rule and went red on the first v2 article. Absence was
  // never the invariant worth guarding. Conformance is: the rules below are the
  // ones the renderer and the n8n serializer each rely on the other to keep.
  it("holds every published post to the v2 block contract", () => {
    const optionalSectionFields = [
      "bullets",
      "callout",
      "checklist",
      "comparisonTable",
      "definitions",
      "entityLinks",
      "grid",
      "keyTakeaways",
      "leadStyle",
      "lede",
      "metricPanel",
      "promptBlocks",
      "pullQuote",
      "quoteCard",
      "rankedCards",
      "scorecard",
      "sectionNumber",
      "statBand",
      "steps",
      "subsections",
      "timeline",
      "variant",
      "versusCard",
    ] as const;

    // The renderer drops any link that is not site-relative or https, and a
    // dropped button is silent: the reader just never sees the action. So an
    // unrenderable href in published data is lost content, not a cosmetic slip.
    const expectRenderableHref = (value: string | undefined, label: string) => {
      if (value === undefined) return;
      expect(
        value.startsWith("/") || value.startsWith("https://"),
        `${label}: ${value}`,
      ).toBe(true);
    };

    const walkSections = (sections: SilverstoneBlogSection[], depth: number) => {
      for (const section of sections) {
        for (const field of optionalSectionFields) {
          // "Omit the field instead" — an explicit null survives the renderer's
          // presence checks and then fails when the block is read.
          expect(
            Object.hasOwn(section, field) &&
              (section as Record<string, unknown>)[field] === null,
            `${section.heading}.${field} is null`,
          ).toBe(false);
        }

        for (const card of section.rankedCards ?? []) {
          expectRenderableHref(card.website, `${section.heading}.${card.name}.website`);
        }
        for (const link of section.entityLinks ?? []) {
          expectRenderableHref(link.url, `${section.heading}.${link.name}.url`);
        }
        expectRenderableHref(
          section.quoteCard?.url,
          `${section.heading}.quoteCard.url`,
        );

        if (depth > 0) {
          // Only one nesting level renders, and a subsection's lede is ignored.
          // Emitting either means the copy exists in the data and never reaches
          // the page.
          expect(
            (section.subsections ?? []).length,
            `${section.heading}.subsections nested too deep`,
          ).toBe(0);
          expect(
            Object.hasOwn(section, "lede"),
            `${section.heading}.lede on a subsection`,
          ).toBe(false);
        }

        walkSections(section.subsections ?? [], depth + 1);
      }
    };

    for (const post of PUBLISHED_BLOG_POSTS) {
      walkSections(post.articleBody, 0);

      // Chips are the one inline token with a closed vocabulary. An unknown kind
      // does not degrade — it renders literally as "{{chip:...}}" mid-sentence.
      for (const match of JSON.stringify(post).matchAll(/\{\{chip:([^|{}]*)\|/g)) {
        expect(
          ["action", "idea", "proof", "warning"],
          `${post.slug}: ${match[0]}`,
        ).toContain(match[1]);
      }
    }
  });

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

  /**
   * Every hero is a WebP and nothing else — both publishing streams request
   * `output_format: "webp"` and both bundle validators reject an asset whose
   * bytes are not RIFF/WEBP. The `-hero.webp` path is asserted above; this
   * guards the alt text that goes with it.
   *
   * The hero renders as a CSS background, so this string's only job is
   * `og:image:alt` and `twitter:image:alt` — which makes it the single
   * accessibility and social-preview description for the image. An empty or
   * title-echoing value would still ship a valid-looking post.
   */
  it("gives every WebP hero usable alt text", () => {
    for (const post of PUBLISHED_BLOG_POSTS) {
      const alt = post.heroImageAlt.trim();

      expect(alt, `${post.slug} heroImageAlt`).toBeTruthy();
      // Long enough to describe a scene rather than name a topic.
      expect(
        alt.length,
        `${post.slug} heroImageAlt too short: ${alt}`,
      ).toBeGreaterThanOrEqual(20);
      expect(alt.length, `${post.slug} heroImageAlt too long`).toBeLessThanOrEqual(300);
      // Alt text that repeats the headline describes the article, not the image.
      expect(
        alt.toLowerCase(),
        `${post.slug} heroImageAlt duplicates the title`,
      ).not.toBe(post.title.trim().toLowerCase());
      // Screen readers already announce it as an image.
      expect(alt.toLowerCase(), `${post.slug} heroImageAlt`).not.toMatch(
        /^(image|picture|photo|graphic) of\b/,
      );
    }
  });

  /**
   * A table belongs in `comparisonTable` or `scorecard`, which `ArticleSection`
   * hoists out of the copy card and renders as a real `<table>`. A model that
   * writes one as markdown pipes inside `body` instead produces a run of literal
   * "| a | b |" paragraphs stranded in the prose — which is exactly how the two
   * tables in cross-location-workflows-standardise-first shipped.
   *
   * `researchSources` is deliberately not walked: those summaries are verbatim
   * third-party excerpts kept as provenance metadata and are never rendered, so
   * pipes inside them are not a display fault.
   */
  it("never leaves a markdown table in rendered article copy", () => {
    const looksLikeTable = (value: string) =>
      /^\s*\|.*\|/m.test(value) || /\|\s*-{3,}\s*\|/.test(value);

    const offenders: string[] = [];
    const walk = (node: unknown, path: string, slug: string) => {
      if (typeof node === "string") {
        if (looksLikeTable(node)) {
          offenders.push(`${slug}${path}: ${node.slice(0, 80)}`);
        }
        return;
      }
      if (Array.isArray(node)) {
        node.forEach((entry, index) => {
          walk(entry, `${path}[${String(index)}]`, slug);
        });
        return;
      }
      if (node && typeof node === "object") {
        for (const [key, value] of Object.entries(node)) {
          if (key === "researchSources") {
            continue;
          }
          walk(value, `${path}.${key}`, slug);
        }
      }
    };

    for (const post of PUBLISHED_BLOG_POSTS) {
      walk(post.articleBody, ".articleBody", post.slug);
      walk(post.summary, ".summary", post.slug);
      walk(post.faqs, ".faqs", post.slug);
    }

    expect(offenders, offenders.join("\n")).toEqual([]);
  });
});
