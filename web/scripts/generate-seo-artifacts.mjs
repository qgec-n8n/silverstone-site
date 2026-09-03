#!/usr/bin/env node
/**
 * Post-build SEO artifacts for the production deploy, written into
 * build/client:
 *
 *  - sitemap.xml            sitemap index → sitemap-pages.xml + sitemap-posts.xml
 *  - sitemap-pages.xml      current non-blog canonical pages
 *  - sitemap-posts.xml      current published blog articles
 *  - feed.xml               Atom 1.0 feed of the newest published articles
 *  - robots.txt             production allow + sitemap reference
 *  - _redirects             one-hop 301s and 410s from the legacy URL map
 *                           (netlify/edge-functions/lib/url-migration.mts)
 *  - 404.html               branded not-found document served by Netlify with
 *                           a genuine 404 status for unknown paths
 *
 * Sitemap URLs are still derived from the prerendered HTML itself (canonical
 * link + robots meta of every *.html document), so the sitemap can never
 * drift from what actually deploys — but the build now FAILS unless that
 * derived set exactly matches the authoritative route sources (approved
 * route manifest + published blog posts). <lastmod> comes from maintained
 * content dates (web/src/data/page-content-dates.json) and from each
 * article's published/updated dates — never from the build clock — so
 * rebuilding unchanged content never changes a lastmod.
 *
 * Safety: when the build is a staging build (blanket noindex on the
 * homepage), a Disallow-all robots.txt is written and no sitemap or
 * _redirects are produced — a staging bundle can never ship an "Allow"
 * robots file.
 */
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { BLOG_POSTS, PUBLISHED_BLOG_POSTS } from "../src/data/blog-posts.ts";
import {
  approvedAdditionalRoutes,
  approvedRouteOverrides,
} from "../src/data/approved-routes.ts";
import baselineRouteManifest from "../src/data/generated/future-route-manifest.json" with { type: "json" };
import pageContentDates from "../src/data/page-content-dates.json" with { type: "json" };
import {
  GONE_PATHS,
  LEGACY_REDIRECTS,
} from "../../netlify/edge-functions/lib/url-migration.mts";

// Resolved lazily: under Vitest's transform import.meta.url is not a file
// URL, and the tests only exercise the pure helpers below.
function resolveClientDir() {
  return fileURLToPath(new URL("../build/client", import.meta.url));
}
const PRODUCTION_ORIGIN = "https://silverstone-ai.com";
// Every canonical page ships substantial prerendered copy; the sparsest
// current page carries ~2,200 visible characters, so 800 catches an empty
// or shell document without flagging legitimate lean pages.
const MIN_VISIBLE_CHARS = 800;
// No exceptions. The homepage used to be one: its hero and body were mounted
// only after the visitor's Explore action, so the prerendered document held
// ~85 characters and no headings. The hero and footer now render into the
// static HTML and are gated visually instead (visual/home-v2/hero.tsx,
// components/layout/app-shell.tsx), so every indexable route is held to the
// same bar.
const CONTENT_LENGTH_EXCEPTIONS = new Set();

export function expectedPagePaths() {
  const overrideById = new Map(
    approvedRouteOverrides.map((route) => [route.id, route]),
  );
  return [
    ...baselineRouteManifest.map(
      (route) => overrideById.get(route.id)?.path ?? route.path,
    ),
    ...approvedAdditionalRoutes.map((route) => route.path),
  ].sort();
}

export function expectedPostPaths() {
  return PUBLISHED_BLOG_POSTS.map((post) => `/blog/${post.slug}`).sort();
}

/**
 * Deploy gate for the blog article contract (docs/blog-article-contract.md).
 * Every published post must carry complete, unique metadata before a
 * production bundle can ship — a violation names the article and the field
 * so the publishing automation (or a human editor) can fix it directly.
 */
export function validateBlogData(now = new Date()) {
  const errors = [];
  const slugs = new Set();
  const uniqueFields = [
    ["title", new Map()],
    ["metaTitle", new Map()],
    ["metaDescription", new Map()],
  ];
  for (const post of BLOG_POSTS) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(post.slug)) {
      errors.push(`Invalid blog slug: ${post.slug}`);
    }
    if (slugs.has(post.slug)) {
      errors.push(`Duplicate blog slug: ${post.slug}`);
    }
    slugs.add(post.slug);
    if (post.status !== "published") continue;
    if (!post.title?.trim()) errors.push(`Post ${post.slug} is missing a title`);
    // The article route renders metaTitle as <title> and metaDescription as
    // the meta description verbatim (routes/blog/article.tsx) — neither may
    // be empty, and neither may repeat another post's value.
    if (!post.metaTitle?.trim()) {
      errors.push(`Post ${post.slug} is missing a metaTitle`);
    }
    if (!post.metaDescription?.trim()) {
      errors.push(`Post ${post.slug} is missing a metaDescription`);
    }
    for (const [field, seen] of uniqueFields) {
      const value = post[field]?.trim();
      if (!value) continue;
      const existing = seen.get(value);
      if (existing) {
        errors.push(
          `Posts ${existing} and ${post.slug} share the same ${field} ("${value}")`,
        );
      } else {
        seen.set(value, post.slug);
      }
    }
    const published = Date.parse(post.publishedIsoDate);
    if (Number.isNaN(published)) {
      errors.push(`Post ${post.slug} has an invalid publishedIsoDate`);
    } else if (published > now.getTime() + 24 * 60 * 60 * 1000) {
      errors.push(
        `Post ${post.slug} is dated in the future (${post.publishedIsoDate}) but marked published`,
      );
    }
    const updated = Date.parse(post.updatedIsoDate ?? "");
    if (post.updatedIsoDate && Number.isNaN(updated)) {
      errors.push(`Post ${post.slug} has an invalid updatedIsoDate`);
    }
    if (!Number.isNaN(published) && !Number.isNaN(updated) && updated < published) {
      errors.push(`Post ${post.slug} has updatedIsoDate before publishedIsoDate`);
    }
  }
  return errors;
}

export function postLastmod(post) {
  const published = Date.parse(post.publishedIsoDate);
  const updated = Date.parse(post.updatedIsoDate ?? "");
  const stamp = Number.isNaN(updated) ? published : Math.max(published, updated);
  return new Date(stamp).toISOString().slice(0, 10);
}

export function pageLastmod(routePath) {
  if (routePath === "/blog") {
    // The hub's content genuinely changes when an article is published.
    const dates = PUBLISHED_BLOG_POSTS.map(postLastmod).sort();
    return dates[dates.length - 1];
  }
  return pageContentDates[routePath];
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function renderUrlset(entries) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(({ loc, lastmod }) =>
      [
        "  <url>",
        `    <loc>${escapeXml(loc)}</loc>`,
        ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
        "  </url>",
      ].join("\n"),
    ),
    "</urlset>",
    "",
  ].join("\n");
}

export function renderSitemapIndex(children) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...children.map(({ loc, lastmod }) =>
      [
        "  <sitemap>",
        `    <loc>${escapeXml(loc)}</loc>`,
        ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
        "  </sitemap>",
      ].join("\n"),
    ),
    "</sitemapindex>",
    "",
  ].join("\n");
}

/**
 * Atom 1.0 feed (/feed.xml) of the newest published articles.
 *
 * Why Atom rather than RSS 2.0: every post record carries both
 * `publishedIsoDate` and `updatedIsoDate`, and Atom has distinct <published>
 * and <updated> elements for exactly that. RSS 2.0's single <pubDate> would
 * force one of the two dates to be discarded or misreported.
 *
 * Why a feed at all, when sitemap.xml already lists every article: the site
 * publishes daily through an n8n automation, and a small, always-newest-first
 * document is the cheapest possible thing for a crawler or feed consumer to
 * re-fetch. The sitemap stays the complete archive; the feed is the recency
 * signal.
 *
 * The entries are derived from the same validated sitemap set as
 * sitemap-posts.xml, so the feed inherits every gate that set already passes:
 * self-canonical URL, not noindex, a real prerendered document (i.e. 200 OK),
 * exactly one <h1>, and substantive body copy. Dates come from the article
 * records, never from the build clock — rebuilding unchanged content must
 * never restamp an entry, which is precisely what Google warns against.
 */
const FEED_TITLE = "Silverstone AI Insights";
const FEED_SUBTITLE =
  "Practical guidance on websites, apps and AI workflows for UK businesses.";
const FEED_PATH = "/feed.xml";
/**
 * Recency window, not an archive. 50 entries is roughly seven weeks at the
 * current daily cadence — comfortably wider than any crawler's re-fetch
 * interval, while keeping the document small enough to be cheap to poll.
 */
export const FEED_MAX_ENTRIES = 50;

/** RFC 3339 timestamp normalised to UTC, or null when unparseable. */
function rfc3339(value) {
  const parsed = Date.parse(value ?? "");
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}

/**
 * Newest-first feed entries for `posts`, capped at `limit`.
 *
 * Ordering is by <updated> (a meaningfully revised article should resurface),
 * then <published>, then slug so the output is byte-stable for identical
 * input. A post whose stored update predates its publication is a data error
 * the deploy gate above already rejects; it is clamped here as well so
 * <updated> can never be older than <published> in shipped XML.
 */
export function buildFeedEntries(posts, limit = FEED_MAX_ENTRIES) {
  return posts
    .flatMap((post) => {
      const published = rfc3339(post.publishedIsoDate);
      if (!published) return [];
      const updated = rfc3339(post.updatedIsoDate) ?? published;
      return [
        {
          id: `${PRODUCTION_ORIGIN}/blog/${post.slug}`,
          published,
          slug: post.slug,
          summary: post.metaDescription,
          title: post.title,
          updated: Date.parse(updated) < Date.parse(published) ? published : updated,
        },
      ];
    })
    .sort(
      (a, b) =>
        b.updated.localeCompare(a.updated) ||
        b.published.localeCompare(a.published) ||
        a.slug.localeCompare(b.slug),
    )
    .slice(0, limit);
}

export function renderAtomFeed(entries) {
  if (entries.length === 0) {
    throw new Error("Refusing to write an empty Atom feed");
  }
  // The feed's own <updated> is the newest entry's — derived from content,
  // like every other timestamp here, so a no-op rebuild produces an identical
  // document.
  const feedUpdated = entries[0].updated;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    `  <id>${PRODUCTION_ORIGIN}${FEED_PATH}</id>`,
    `  <title>${escapeXml(FEED_TITLE)}</title>`,
    `  <subtitle>${escapeXml(FEED_SUBTITLE)}</subtitle>`,
    `  <updated>${feedUpdated}</updated>`,
    `  <link rel="self" type="application/atom+xml" href="${PRODUCTION_ORIGIN}${FEED_PATH}"/>`,
    `  <link rel="alternate" type="text/html" href="${PRODUCTION_ORIGIN}/blog"/>`,
    "  <author>",
    "    <name>Silverstone AI</name>",
    `    <uri>${PRODUCTION_ORIGIN}</uri>`,
    "  </author>",
    ...entries.map((entry) =>
      [
        "  <entry>",
        `    <id>${escapeXml(entry.id)}</id>`,
        `    <title>${escapeXml(entry.title)}</title>`,
        `    <link rel="alternate" type="text/html" href="${escapeXml(entry.id)}"/>`,
        `    <published>${entry.published}</published>`,
        `    <updated>${entry.updated}</updated>`,
        `    <summary>${escapeXml(entry.summary)}</summary>`,
        "  </entry>",
      ].join("\n"),
    ),
    "</feed>",
    "",
  ].join("\n");
}

/** The handful of entities the prerendered title/description tags carry. */
function decodeEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&nbsp;", " ");
}

/**
 * /llms.txt — the llmstxt.org curated index, for assistants that fetch a
 * site-level summary before crawling. It is an addition to, never a
 * replacement for, robots.txt + sitemap.xml: Google Search ignores it, so
 * nothing here affects indexing. Its value is giving answer engines the
 * canonical URL, one-line purpose and grouping for every page, instead of
 * leaving them to infer all three from raw HTML.
 *
 * Built from the same validated sitemap entries as the XML sitemaps, so a page
 * can never appear here after failing a canonical, h1 or thin-content gate.
 */
export function renderLlmsTxt(sections, docs) {
  const lines = [
    "# Silverstone AI",
    "",
    "> Silverstone AI is a London-based AI automation agency building AI" +
      " receptionists, AI voice agents, workflow automation, websites and apps" +
      " for small and mid-sized businesses in the United States and the United" +
      " Kingdom, with US-based team members providing 24-hour coverage.",
    "",
    "US English. Prices are published in GBP and USD (fixed pairs, reviewed" +
      " quarterly); scopes and safeguards are stated on the pages below; figures" +
      " shown as results are verified Silverstone AI performance recorded in the" +
      " client's currency and vary by scope and operating environment.",
    "",
  ];

  for (const { heading, entries } of sections) {
    if (entries.length === 0) continue;
    lines.push(`## ${heading}`, "");
    for (const entry of entries) {
      const doc = docs.get(
        new URL(entry.loc).pathname === "/"
          ? "/"
          : new URL(entry.loc).pathname.replace(/\/$/, ""),
      );
      const title = decodeEntities(doc?.title ?? "").replace(
        /\s*\|\s*Silverstone AI\s*$/,
        "",
      );
      const description = decodeEntities(doc?.description ?? "");
      lines.push(`- [${title}](${entry.loc})${description ? `: ${description}` : ""}`);
    }
    lines.push("");
  }

  return (
    lines
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trimEnd() + "\n"
  );
}

export function renderRedirectsFile() {
  const lines = [
    "# Generated by web/scripts/generate-seo-artifacts.mjs from",
    "# netlify/edge-functions/lib/url-migration.mts — do not edit by hand.",
    "# Exact-path one-hop permanent redirects for recognised legacy URLs.",
    "# Forced (!) so they fire even where Netlify would otherwise resolve a",
    "# static file for the source (e.g. /index -> /index.html); the build",
    "# gate guarantees no redirect source is itself a prerendered route.",
  ];
  for (const [source, target] of Object.entries(LEGACY_REDIRECTS)) {
    lines.push(`${source} ${target} 301!`);
  }
  lines.push("# Intentionally removed pages return 410 Gone.");
  for (const gonePath of GONE_PATHS) {
    lines.push(`${gonePath} /410.html 410!`);
  }
  lines.push("");
  return lines.join("\n");
}

async function collectHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "assets" || entry.name === "vendor") continue;
      files.push(...(await collectHtmlFiles(full)));
    } else if (
      entry.name.endsWith(".html") &&
      entry.name !== "__spa-fallback.html" &&
      entry.name !== "404.html" &&
      entry.name !== "410.html"
    ) {
      files.push(full);
    }
  }
  return files;
}

function extract(html, pattern) {
  const match = pattern.exec(html);
  return match ? match[1] : null;
}

export function countHeadings(html) {
  return (html.match(/<h1[\s>]/gi) ?? []).length;
}

function visibleTextLength(html) {
  const body = html.split(/<body[^>]*>/)[1] ?? html;
  return body
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim().length;
}

async function main() {
  const clientDir = resolveClientDir();
  const failures = [];
  const blogErrors = validateBlogData();
  failures.push(...blogErrors);

  const htmlFiles = await collectHtmlFiles(clientDir);
  if (htmlFiles.length === 0) {
    throw new Error(
      `No prerendered HTML found under ${clientDir} — run the build first`,
    );
  }

  /** @type {Map<string, {canonical: string|null, robots: string|null, textLength: number}>} */
  const docs = new Map();
  let stagingBuild = false;

  for (const file of htmlFiles) {
    const html = await fs.readFile(file, "utf8");
    const robots =
      extract(html, /<meta[^>]+name="robots"[^>]+content="([^"]*)"/i) ??
      extract(html, /<meta[^>]+content="([^"]*)"[^>]+name="robots"/i);
    const canonical =
      extract(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i) ??
      extract(html, /<link[^>]+href="([^"]*)"[^>]+rel="canonical"/i);

    const relative = path.relative(clientDir, file);
    const routePath =
      "/" +
      relative
        .replace(/index\.html$/, "")
        .replace(/\.html$/, "")
        .replace(/\/$/, "");
    const normalizedPath = routePath === "/" ? "/" : routePath.replace(/\/$/, "");

    if (robots?.includes("noindex") && relative === "index.html") {
      stagingBuild = true;
    }

    docs.set(normalizedPath, {
      canonical,
      robots,
      headingCount: countHeadings(html),
      textLength: visibleTextLength(html),
      title: extract(html, /<title>([^<]*)<\/title>/i),
      description:
        extract(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i) ??
        extract(html, /<meta[^>]+content="([^"]*)"[^>]+name="description"/i),
    });
  }

  if (stagingBuild) {
    await fs.rm(path.join(clientDir, "__spa-fallback.html"), { force: true });
    await fs.writeFile(
      path.join(clientDir, "robots.txt"),
      "User-agent: *\nDisallow: /\n",
    );
    console.log(
      "Staging build detected (noindex homepage) — wrote Disallow robots.txt, no sitemap.",
    );
    return;
  }

  const pagePaths = expectedPagePaths();
  const postPaths = expectedPostPaths();
  const expectedAll = new Set([...pagePaths, ...postPaths]);

  // Every authoritative route must have a prerendered document, and no
  // unexpected document may ship (alias/duplicate protection).
  for (const routePath of expectedAll) {
    if (!docs.has(routePath)) {
      failures.push(`Missing prerendered document for ${routePath}`);
    }
  }
  for (const docPath of docs.keys()) {
    if (!expectedAll.has(docPath)) {
      failures.push(`Unexpected prerendered document: ${docPath}`);
    }
  }

  // Migration-map safety against the deployed surface.
  for (const [source, target] of Object.entries(LEGACY_REDIRECTS)) {
    if (docs.has(source)) {
      failures.push(`Redirect source ${source} shadows a prerendered document`);
    }
    if (!docs.has(target) && target !== "/") {
      failures.push(`Redirect target ${target} has no prerendered document`);
    }
  }
  for (const gonePath of GONE_PATHS) {
    if (docs.has(gonePath)) {
      failures.push(`410 path ${gonePath} still has a prerendered document`);
    }
    if (LEGACY_REDIRECTS[gonePath]) {
      failures.push(`410 path ${gonePath} is also a redirect source`);
    }
  }

  function sitemapEntries(paths, lastmodFor) {
    const entries = [];
    for (const routePath of paths) {
      const doc = docs.get(routePath);
      if (!doc) continue;
      if (doc.robots?.includes("noindex")) continue;
      const expectedCanonical =
        routePath === "/"
          ? `${PRODUCTION_ORIGIN}/`
          : `${PRODUCTION_ORIGIN}${routePath}`;
      if (
        doc.canonical !== expectedCanonical &&
        doc.canonical !== PRODUCTION_ORIGIN + routePath
      ) {
        failures.push(`${routePath} is not self-canonical (found ${doc.canonical})`);
        continue;
      }
      if (
        doc.textLength < MIN_VISIBLE_CHARS &&
        !CONTENT_LENGTH_EXCEPTIONS.has(routePath)
      ) {
        failures.push(
          `${routePath} has only ${doc.textLength} visible characters of content`,
        );
        continue;
      }
      // Exactly one prerendered <h1> per indexable page. This is the guard
      // that keeps route content out of client-only branches: a heading that
      // renders only after an interaction (the homepage hero before
      // 2026-07-22) disappears from the static document and takes the page's
      // primary topical signal with it.
      if (doc.headingCount !== 1) {
        failures.push(
          `${routePath} prerenders ${doc.headingCount} <h1> elements (expected exactly 1)`,
        );
        continue;
      }
      entries.push({ loc: expectedCanonical, lastmod: lastmodFor(routePath) });
    }
    return entries;
  }

  const postBySlugPath = new Map(
    PUBLISHED_BLOG_POSTS.map((post) => [`/blog/${post.slug}`, post]),
  );
  const pageEntries = sitemapEntries(pagePaths, pageLastmod);
  const postEntries = sitemapEntries(postPaths, (routePath) =>
    postLastmod(postBySlugPath.get(routePath)),
  );

  const allLocs = [...pageEntries, ...postEntries].map((entry) => entry.loc);
  if (new Set(allLocs).size !== allLocs.length) {
    failures.push("Duplicate URLs in sitemap output");
  }
  for (const loc of allLocs) {
    const parsed = new URL(loc);
    if (
      parsed.origin !== PRODUCTION_ORIGIN ||
      parsed.search ||
      parsed.hash ||
      parsed.pathname !== parsed.pathname.toLowerCase() ||
      parsed.pathname.endsWith(".html") ||
      (parsed.pathname !== "/" && parsed.pathname.endsWith("/"))
    ) {
      failures.push(`Non-canonical sitemap URL: ${loc}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`SEO artifact generation failed:\n - ${failures.join("\n - ")}`);
  }

  // Keep a branded genuine-404 document: Netlify automatically serves
  // /404.html with a 404 status when no file or redirect matches. The React
  // shell hydrates and renders the not-found route client-side while the
  // HTTP status stays 404. Every valid public route is prerendered, so the
  // shell is never served as a 200 fallback (no rewrite rule exists for it).
  const fallback = path.join(clientDir, "__spa-fallback.html");
  const fallbackHtml = await fs.readFile(fallback, "utf8");
  // The shell head carries no title/robots of its own; give crawlers an
  // explicit signal alongside the 404 status Netlify serves it with.
  const notFoundHtml = fallbackHtml.replace(
    /<head>/i,
    "<head><title>Page not found | Silverstone AI</title>" +
      '<meta name="robots" content="noindex"/>',
  );
  await fs.writeFile(path.join(clientDir, "404.html"), notFoundHtml);
  await fs.rm(fallback, { force: true });

  const newestOf = (entries) =>
    entries
      .map((entry) => entry.lastmod)
      .filter(Boolean)
      .sort()
      .at(-1);
  const newestPage = newestOf(pageEntries);
  const newestPost = newestOf(postEntries);

  await fs.writeFile(
    path.join(clientDir, "sitemap-pages.xml"),
    renderUrlset(pageEntries),
  );
  await fs.writeFile(
    path.join(clientDir, "sitemap-posts.xml"),
    renderUrlset(postEntries),
  );
  await fs.writeFile(
    path.join(clientDir, "sitemap.xml"),
    renderSitemapIndex([
      { loc: `${PRODUCTION_ORIGIN}/sitemap-pages.xml`, lastmod: newestPage },
      { loc: `${PRODUCTION_ORIGIN}/sitemap-posts.xml`, lastmod: newestPost },
    ]),
  );
  await fs.writeFile(
    path.join(clientDir, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${PRODUCTION_ORIGIN}/sitemap.xml\n`,
  );
  await fs.writeFile(path.join(clientDir, "_redirects"), renderRedirectsFile());

  // Built from `postEntries`, not from PUBLISHED_BLOG_POSTS directly: those
  // entries are the posts that survived the canonical / noindex / thin-content
  // / single-h1 gates above and have a prerendered document, so the feed can
  // only ever advertise URLs that answer 200 with indexable content.
  const feedEntries = buildFeedEntries(
    postEntries.map((entry) => postBySlugPath.get(new URL(entry.loc).pathname)),
  );
  await fs.writeFile(path.join(clientDir, "feed.xml"), renderAtomFeed(feedEntries));

  const startsWith = (prefix) => (entry) =>
    new URL(entry.loc).pathname.startsWith(prefix);
  const serviceEntries = pageEntries.filter(startsWith("/services"));
  const industryEntries = pageEntries.filter(startsWith("/industry"));
  const companyEntries = pageEntries.filter(
    (entry) => !serviceEntries.includes(entry) && !industryEntries.includes(entry),
  );
  await fs.writeFile(
    path.join(clientDir, "llms.txt"),
    renderLlmsTxt(
      [
        { heading: "Company", entries: companyEntries },
        { heading: "Services", entries: serviceEntries },
        { heading: "Industries", entries: industryEntries },
        { heading: "Insights", entries: postEntries },
      ],
      docs,
    ),
  );

  console.log(
    `Wrote sitemap index (${pageEntries.length} pages + ${postEntries.length} posts), ` +
      `feed.xml (${feedEntries.length} entries), robots.txt, llms.txt, ` +
      `_redirects (${Object.keys(LEGACY_REDIRECTS).length} redirects, ` +
      `${GONE_PATHS.length} gone), and 404.html.`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
