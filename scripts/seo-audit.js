#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

const indexedPages = [
  { file: "index.html", canonical: "https://silverstone-ai.com" },
  { file: "about.html", canonical: "https://silverstone-ai.com/about" },
  { file: "services.html", canonical: "https://silverstone-ai.com/services" },
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

const errors = [];
const warnings = [];

for (const page of indexedPages) {
  const html = readFile(page.file);

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
}

const indexHtml = readFile("index.html");
if (!indexHtml.includes('"@type": "WebSite"')) {
  errors.push('index.html: missing WebSite structured data on homepage');
}
if (!indexHtml.includes('"name": "Silverstone AI"')) {
  errors.push('index.html: WebSite structured data is missing "Silverstone AI" site name');
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

console.log(`SEO audit passed for ${indexedPages.length} indexable pages and sitemap.xml`);
