import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  GONE_PATHS,
  LEGACY_REDIRECTS,
} from "../../../netlify/edge-functions/lib/url-migration.mts";
import {
  expectedPagePaths,
  expectedPostPaths,
  pageLastmod,
  postLastmod,
  renderRedirectsFile,
  validateBlogData,
} from "../../scripts/generate-seo-artifacts.mjs";
import { PUBLISHED_BLOG_POSTS } from "~/data/blog-posts";

/**
 * The complete pre-migration production blog URL surface (live sitemap of the
 * last successful deploy, captured 2026-07-15, cross-checked against
 * `git show 10dcca0a`). Every one of these must stay explicitly migrated —
 * this is the regression fixture that stops a renamed article from silently
 * losing its history.
 */
const PRE_RENAME_BLOG_SLUGS = [
  "how-to-plan-a-conversion-focused-website-build-for-a-uk-small-business",
  "bespoke-app-development-for-uk-small-businesses-what-to-build-first",
  "ai-voice-agent-development-for-uk-businesses-calls-controls-and-handoffs-expla",
  "ai-receptionist-uk-what-small-businesses-should-set-up-before-they-buy",
  "how-to-choose-the-first-workflow-to-automate-in-a-uk-small-business",
  "ai-and-automation-consulting-for-uk-small-businesses-what-to-fix-first",
  "a-practical-content-creation-framework-for-uk-small-businesses",
  "estate-agent-automation-in-the-uk-what-to-build-first-and-what-to-leave-human",
  "hospitality-automation-for-uk-small-businesses-where-ai-actually-helps",
  "how-uk-salons-and-barbers-can-use-ai-without-losing-the-human-touch",
  "websites-ai-receptionists-and-automation-for-uk-trades-businesses",
  "ai-systems-for-ecommerce-brands-what-uk-small-businesses-should-build-first",
  "how-uk-physio-and-chiropractic-practices-can-use-ai-without-losing-the-human-t",
  "dental-practice-automation-in-the-uk-a-practical-systems-guide",
  "gym-automation-for-small-uk-fitness-businesses-a-practical-operating-model",
  "how-uk-fitness-coaches-can-turn-enquiries-into-booked-consultations",
  "web-design-and-development-for-uk-small-businesses-build-a-site-that-operates",
  "app-development-for-uk-small-businesses-what-to-build-first",
  "ai-voice-agents-in-the-uk-a-practical-buyer-s-guide-for-small-businesses",
  "ai-receptionist-uk-a-practical-guide-for-small-business-owners",
  "ai-automation-for-uk-small-businesses-what-to-fix-first",
];

describe("blog slug migration coverage", () => {
  const publishedPaths = new Set(
    PUBLISHED_BLOG_POSTS.map((post) => `/blog/${post.slug}`),
  );

  it("maps every pre-rename production blog URL to a live article", () => {
    for (const oldSlug of PRE_RENAME_BLOG_SLUGS) {
      const target = LEGACY_REDIRECTS[`/blog/${oldSlug}`] ?? "";
      expect(target, `/blog/${oldSlug} must have a migration mapping`).not.toBe("");
      expect(publishedPaths.has(target), `${target} must be a published article`).toBe(
        true,
      );
    }
  });

  it("keeps removed legacy articles Gone rather than resurrecting or chaining them", () => {
    for (const gonePath of GONE_PATHS) {
      expect(publishedPaths.has(gonePath)).toBe(false);
      expect(LEGACY_REDIRECTS[gonePath]).toBeUndefined();
    }
  });

  it("never redirects a blog URL to the blog hub or another redirect", () => {
    for (const [source, target] of Object.entries(LEGACY_REDIRECTS)) {
      if (!source.startsWith("/blog/")) continue;
      expect(target).not.toBe("/blog");
      expect(target).not.toBe("/");
      expect(LEGACY_REDIRECTS[target]).toBeUndefined();
    }
  });
});

describe("blog data publishing gates", () => {
  it("accepts the current dataset", () => {
    expect(validateBlogData()).toEqual([]);
  });

  it("rejects future-dated published posts and duplicate slugs", () => {
    // The validator reads the module-level dataset; simulate "now" well in
    // the past so every currently published post looks future-dated.
    const errors = validateBlogData(new Date("2020-01-01T00:00:00Z"));
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.join("\n")).toContain("future");
  });
});

describe("sitemap lastmod policy", () => {
  it("derives page lastmod from maintained content dates, never the clock", () => {
    expect(pageLastmod("/about")).toBe("2026-07-07");
    expect(pageLastmod("/industry/dentists")).toBe("2026-07-02");
    expect(pageLastmod("/services/ai-automation")).toBe("2026-07-01");
    // Unknown routes yield no lastmod instead of a guess.
    expect(pageLastmod("/nonexistent")).toBeUndefined();
  });

  it("is stable across repeated evaluation (no build-time drift)", () => {
    const lastmods = () =>
      expectedPostPaths().map((postPath) => {
        const slug = postPath.replace("/blog/", "");
        const post = PUBLISHED_BLOG_POSTS.find((candidate) => candidate.slug === slug);
        if (!post) {
          throw new Error(`No published post for ${slug}`);
        }
        return postLastmod(post);
      });
    const first = lastmods();
    const second = lastmods();
    expect(first).toEqual(second);
    for (const value of first) {
      expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("uses the newest article date for the blog hub", () => {
    const newest = PUBLISHED_BLOG_POSTS.map(postLastmod).sort().at(-1);
    expect(pageLastmod("/blog")).toBe(newest);
  });
});

describe("deployed redirect artifacts", () => {
  it("renders one exact-path rule per migration entry", () => {
    const rendered = renderRedirectsFile();
    const ruleLines = rendered
      .split("\n")
      .filter((line) => line && !line.startsWith("#"));
    expect(ruleLines).toHaveLength(
      Object.keys(LEGACY_REDIRECTS).length + GONE_PATHS.length,
    );
    for (const line of ruleLines) {
      expect(line).toMatch(/^\/\S+ \/\S* (301|410)$/);
      expect(line).not.toContain("*");
      expect(line).not.toContain(":splat");
    }
    expect(rendered).toContain("/niches/dentists /industry/dentists 301");
    expect(rendered).toContain(
      "/blog/ai-receptionist-uk-a-practical-guide-for-small-business-owners /blog/ai-receptionist-small-business-guide 301",
    );
    expect(rendered).toContain(
      "/blog/ai-missed-call-recovery-dentists-uk /410.html 410",
    );
  });

  it("keeps netlify.toml down to the single hostname redirect", () => {
    // Vitest runs with cwd = web/ (the vitest config root).
    const toml = fs.readFileSync(
      path.resolve(process.cwd(), "../netlify.toml"),
      "utf8",
    );
    const redirectBlocks = toml.match(/\[\[redirects\]\]/g) ?? [];
    expect(redirectBlocks).toHaveLength(1);
    expect(toml).toContain('from = "https://www.silverstone-ai.com/*"');
    expect(toml).toContain('to = "https://silverstone-ai.com/:splat"');
    expect(toml).toContain("status = 301");
    // The broad SPA fallback must never come back.
    expect(toml).not.toContain("__spa-fallback");
    expect(toml).not.toMatch(/from = "\/\*"/);
  });

  it("covers every expected route source without shadowing canonical paths", () => {
    const canonical = new Set(["/", ...expectedPagePaths(), ...expectedPostPaths()]);
    for (const source of [...Object.keys(LEGACY_REDIRECTS), ...GONE_PATHS]) {
      expect(canonical.has(source), `${source} shadows a canonical route`).toBe(false);
    }
  });
});
