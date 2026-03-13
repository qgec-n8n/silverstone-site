#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const staticIndexedPages = [
  { file: "index.html", canonical: "https://silverstone-ai.com" },
  { file: "about.html", canonical: "https://silverstone-ai.com/about" },
  { file: "services.html", canonical: "https://silverstone-ai.com/services" },
  { file: "blog.html", canonical: "https://silverstone-ai.com/blog" },
  { file: "book.html", canonical: "https://silverstone-ai.com/book" },
  { file: "contact.html", canonical: "https://silverstone-ai.com/contact" },
  { file: "niches/dentists.html", canonical: "https://silverstone-ai.com/niches/dentists" },
  { file: "niches/ecommerce.html", canonical: "https://silverstone-ai.com/niches/ecommerce" },
  { file: "niches/estate-agents.html", canonical: "https://silverstone-ai.com/niches/estate-agents" },
  { file: "niches/fitness-coaches.html", canonical: "https://silverstone-ai.com/niches/fitness-coaches" },
  { file: "niches/gyms-fitness-studios.html", canonical: "https://silverstone-ai.com/niches/gyms-fitness-studios" },
  { file: "niches/hospitality.html", canonical: "https://silverstone-ai.com/niches/hospitality" },
  { file: "niches/physios-chiropractors.html", canonical: "https://silverstone-ai.com/niches/physios-chiropractors" },
  { file: "niches/salons-barbers.html", canonical: "https://silverstone-ai.com/niches/salons-barbers" },
  { file: "niches/trades-virtual-office.html", canonical: "https://silverstone-ai.com/niches/trades-virtual-office" },
];

const blogDir = path.join(repoRoot, "blog");
const blogPages = fs
  .readdirSync(blogDir)
  .filter((entry) => entry.endsWith(".html"))
  .sort()
  .map((entry) => ({
    file: `blog/${entry}`,
    canonical: `https://silverstone-ai.com/blog/${entry.replace(/\.html$/, "")}`,
  }));

const indexedPages = [...staticIndexedPages, ...blogPages];
const requiredSitemapUrls = indexedPages.map((page) => page.canonical);

function readFile(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), "utf8");
}

function normalizeUrl(url) {
  return url.replace(/\/$/, "");
}

function extractFirst(content, regex) {
  const match = content.match(regex);
  return match ? match[1].trim() : "";
}

function findNonCanonicalBlogLinks(content) {
  return Array.from(
    new Set(
      Array.from(
        content.matchAll(/href=["']([^"']*blog\/[^"']+\.html(?:[?#][^"']*)?)["']/gi)
      ).map((match) => match[1].trim())
    )
  );
}

const errors = [];
const warnings = [];

const robotsTxt = readFile("robots.txt");
if (!/User-agent:\s*\*/i.test(robotsTxt)) {
  errors.push('robots.txt: missing "User-agent: *" rule');
}
if (!/Allow:\s*\//i.test(robotsTxt)) {
  errors.push('robots.txt: missing "Allow: /" rule');
}
if (!/Sitemap:\s*https:\/\/silverstone-ai\.com\/sitemap\.xml/i.test(robotsTxt)) {
  errors.push('robots.txt: missing production sitemap declaration');
}

const sitemap = readFile("sitemap.xml");
const sitemapUrls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) =>
  normalizeUrl(match[1].trim())
);
const sitemapUrlSet = new Set(sitemapUrls);

if (sitemapUrls.length !== sitemapUrlSet.size) {
  errors.push("sitemap.xml: duplicate <loc> entries found");
}

const requiredSet = new Set(requiredSitemapUrls.map((url) => normalizeUrl(url)));
for (const url of requiredSet) {
  if (!sitemapUrlSet.has(url)) {
    errors.push(`sitemap.xml: missing required URL ${url}`);
  }
}
for (const url of sitemapUrlSet) {
  if (!requiredSet.has(url)) {
    errors.push(`sitemap.xml: unexpected URL ${url}`);
  }
}

for (const url of sitemapUrls) {
  if (/^https:\/\/silverstone-ai\.com\/blog\/.+\.html$/i.test(url)) {
    errors.push(`sitemap.xml: blog URL must be extensionless (${url})`);
  }
}

for (const page of indexedPages) {
  const html = readFile(page.file);
  const isBlogArticle = page.file.startsWith("blog/");

  const canonical = extractFirst(
    html,
    /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i
  );
  if (!canonical) {
    errors.push(`${page.file}: missing canonical tag`);
  } else if (normalizeUrl(canonical) !== normalizeUrl(page.canonical)) {
    errors.push(
      `${page.file}: canonical mismatch (expected ${page.canonical}, found ${canonical})`
    );
  }

  const description = extractFirst(
    html,
    /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i
  );
  if (!description) {
    errors.push(`${page.file}: missing meta description`);
  } else if (description.length < 70 || description.length > 170) {
    warnings.push(
      `${page.file}: meta description length is ${description.length} characters`
    );
  }

  const robots = extractFirst(
    html,
    /<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i
  );
  if (!robots) {
    errors.push(`${page.file}: missing robots meta tag`);
  } else {
    const robotsLower = robots.toLowerCase();
    if (!robotsLower.includes("index") || !robotsLower.includes("follow")) {
      errors.push(`${page.file}: robots meta should include "index, follow"`);
    }
  }

  if (isBlogArticle) {
    const ogUrl = extractFirst(
      html,
      /<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["'][^>]*>/i
    );
    if (!ogUrl) {
      errors.push(`${page.file}: missing og:url meta tag`);
    } else if (normalizeUrl(ogUrl) !== normalizeUrl(page.canonical)) {
      errors.push(
        `${page.file}: og:url mismatch (expected ${page.canonical}, found ${ogUrl})`
      );
    }

    if (!/"@type"\s*:\s*"BlogPosting"/.test(html)) {
      errors.push(`${page.file}: missing BlogPosting JSON-LD`);
    }
  }
}

const filesWithBlogLinks = ["blog.html", ...blogPages.map((page) => page.file)];
for (const file of filesWithBlogLinks) {
  const badLinks = findNonCanonicalBlogLinks(readFile(file));
  if (badLinks.length > 0) {
    errors.push(`${file}: found non-canonical internal blog links (${badLinks.join(", ")})`);
  }
}

const indexHtml = readFile("index.html");
if (!indexHtml.includes('"@type": "WebSite"')) {
  errors.push('index.html: missing WebSite structured data on homepage');
}
if (!indexHtml.includes('"name": "Silverstone AI"')) {
  errors.push('index.html: WebSite structured data is missing "Silverstone AI" site name');
}

if (warnings.length > 0) {
  console.log("SEO audit warnings:");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error("SEO audit failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `SEO audit passed for ${blogPages.length} blog pages, ${staticIndexedPages.length} static indexable pages, robots.txt, and sitemap.xml`
);
