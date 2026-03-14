#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

const staticIndexedPages = [
  {
    file: "index.html",
    canonical: "https://silverstone-ai.com",
    requiredSchema: ["WebSite", "ProfessionalService", "BreadcrumbList"],
  },
  {
    file: "about.html",
    canonical: "https://silverstone-ai.com/about",
    requiredSchema: ["AboutPage", "BreadcrumbList"],
  },
  {
    file: "services.html",
    canonical: "https://silverstone-ai.com/services",
    requiredSchema: ["WebPage", "Service", "BreadcrumbList"],
  },
  {
    file: "blog.html",
    canonical: "https://silverstone-ai.com/blog",
    requiredSchema: ["CollectionPage", "BreadcrumbList"],
  },
  {
    file: "book.html",
    canonical: "https://silverstone-ai.com/book",
    requiredSchema: ["WebPage", "BreadcrumbList"],
  },
  {
    file: "contact.html",
    canonical: "https://silverstone-ai.com/contact",
    requiredSchema: ["ContactPage", "BreadcrumbList"],
  },
  {
    file: "privacy-policy.html",
    canonical: "https://silverstone-ai.com/privacy-policy",
    requiredSchema: [],
  },
  {
    file: "niches/dentists.html",
    canonical: "https://silverstone-ai.com/niches/dentists",
    requiredSchema: ["BreadcrumbList"],
  },
  {
    file: "niches/ecommerce.html",
    canonical: "https://silverstone-ai.com/niches/ecommerce",
    requiredSchema: ["BreadcrumbList"],
  },
  {
    file: "niches/estate-agents.html",
    canonical: "https://silverstone-ai.com/niches/estate-agents",
    requiredSchema: ["BreadcrumbList"],
  },
  {
    file: "niches/fitness-coaches.html",
    canonical: "https://silverstone-ai.com/niches/fitness-coaches",
    requiredSchema: ["BreadcrumbList"],
  },
  {
    file: "niches/gyms-fitness-studios.html",
    canonical: "https://silverstone-ai.com/niches/gyms-fitness-studios",
    requiredSchema: ["BreadcrumbList"],
  },
  {
    file: "niches/hospitality.html",
    canonical: "https://silverstone-ai.com/niches/hospitality",
    requiredSchema: ["BreadcrumbList"],
  },
  {
    file: "niches/physios-chiropractors.html",
    canonical: "https://silverstone-ai.com/niches/physios-chiropractors",
    requiredSchema: ["BreadcrumbList"],
  },
  {
    file: "niches/salons-barbers.html",
    canonical: "https://silverstone-ai.com/niches/salons-barbers",
    requiredSchema: ["BreadcrumbList"],
  },
  {
    file: "niches/trades-virtual-office.html",
    canonical: "https://silverstone-ai.com/niches/trades-virtual-office",
    requiredSchema: ["BreadcrumbList"],
  },
];

const blogDir = path.join(repoRoot, "blog");
const blogPages = fs
  .readdirSync(blogDir)
  .filter((entry) => entry.endsWith(".html"))
  .sort()
  .map((entry) => ({
    file: `blog/${entry}`,
    canonical: `https://silverstone-ai.com/blog/${entry.replace(/\.html$/, "")}`,
    requiredSchema: ["BlogPosting", "BreadcrumbList"],
  }));

const indexedPages = [...staticIndexedPages, ...blogPages];
const canonicalByFile = new Map(
  indexedPages.map((page) => [page.file, normalizeUrl(page.canonical)])
);
const indexedFileSet = new Set(indexedPages.map((page) => page.file));
const requiredSitemapUrls = indexedPages.map((page) => normalizeUrl(page.canonical));

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

function extractMetaContent(content, name) {
  const match = content.match(
    new RegExp(
      `<meta[^>]*name=["']${name}["'][^>]*content=(["'])([\\s\\S]*?)\\1[^>]*>`,
      "i"
    )
  );
  return match ? match[2].trim() : "";
}

function canonicalPath(url) {
  const parsed = new URL(url);
  return parsed.pathname || "/";
}

function resolveInternalTarget(fromFile, href) {
  const cleaned = href.split("#")[0].split("?")[0];
  if (!cleaned) return null;

  if (/^https?:\/\//i.test(cleaned)) {
    const parsed = new URL(cleaned);
    if (parsed.hostname !== "silverstone-ai.com") return null;
    return parsed.pathname || "/";
  }

  if (/^(mailto:|tel:|javascript:|data:)/i.test(cleaned)) {
    return null;
  }

  if (cleaned.startsWith("/")) {
    return cleaned;
  }

  const fromDir = path.posix.dirname(`/${fromFile}`);
  return path.posix.normalize(path.posix.resolve(fromDir, cleaned));
}

function findDuplicateInternalLinks(content, fromFile) {
  return Array.from(
    new Set(
      Array.from(content.matchAll(/href=["']([^"']+)["']/gi))
        .map((match) => match[1].trim())
        .filter((href) => {
          const target = resolveInternalTarget(fromFile, href);
          if (!target || !target.endsWith(".html")) return false;
          return indexedFileSet.has(target.replace(/^\//, ""));
        })
    )
  );
}

function parseRedirects(netlifyToml) {
  const redirects = new Map();
  const blockRegex = /\[\[redirects\]\]([\s\S]*?)(?=\n\[\[redirects\]\]|\n\[|$)/g;

  for (const match of netlifyToml.matchAll(blockRegex)) {
    const block = match[1];
    const from = extractFirst(block, /from\s*=\s*"([^"]+)"/);
    const to = extractFirst(block, /to\s*=\s*"([^"]+)"/);
    const status = extractFirst(block, /status\s*=\s*([0-9]+)/);
    if (from) {
      redirects.set(from, { to, status });
    }
  }

  return redirects;
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
  errors.push("robots.txt: missing production sitemap declaration");
}

const manifest = JSON.parse(readFile("site.webmanifest"));
if (manifest.name !== "Silverstone AI") {
  errors.push('site.webmanifest: "name" must be "Silverstone AI"');
}
if (manifest.short_name !== "Silverstone AI") {
  errors.push('site.webmanifest: "short_name" must be "Silverstone AI"');
}

const sitemap = readFile("sitemap.xml");
const sitemapUrls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) =>
  normalizeUrl(match[1].trim())
);
const sitemapUrlSet = new Set(sitemapUrls);

if (sitemapUrls.length !== sitemapUrlSet.size) {
  errors.push("sitemap.xml: duplicate <loc> entries found");
}

const requiredSet = new Set(requiredSitemapUrls);
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
  if (/^https:\/\/silverstone-ai\.com\/.+\.html$/i.test(url)) {
    errors.push(`sitemap.xml: URL must be extensionless (${url})`);
  }
}

const redirects = parseRedirects(readFile("netlify.toml"));
for (const page of indexedPages) {
  const fromPath = page.file === "index.html" ? "/index.html" : `/${page.file}`;
  const expectedTo = canonicalPath(page.canonical);
  const redirect = redirects.get(fromPath);
  if (!redirect) {
    errors.push(`netlify.toml: missing redirect for ${fromPath}`);
    continue;
  }
  if (redirect.to !== expectedTo || redirect.status !== "301") {
    errors.push(
      `netlify.toml: redirect mismatch for ${fromPath} (expected 301 -> ${expectedTo}, found ${redirect.status || "?"} -> ${redirect.to || "?"})`
    );
  }
}

for (const page of indexedPages) {
  const html = readFile(page.file);
  const isBlogArticle = page.file.startsWith("blog/");
  const isStaticPage = !isBlogArticle;

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

  const description = extractMetaContent(html, "description");
  if (!description) {
    errors.push(`${page.file}: missing meta description`);
  } else if (description.length < 70 || description.length > 170) {
    warnings.push(`${page.file}: meta description length is ${description.length} characters`);
  }

  const robots = extractMetaContent(html, "robots");
  if (!robots) {
    errors.push(`${page.file}: missing robots meta tag`);
  } else {
    const robotsLower = robots.toLowerCase();
    if (!robotsLower.includes("index") || !robotsLower.includes("follow")) {
      errors.push(`${page.file}: robots meta should include "index, follow"`);
    }
  }

  const duplicateLinks = findDuplicateInternalLinks(html, page.file);
  if (duplicateLinks.length > 0) {
    errors.push(
      `${page.file}: found internal links pointing to duplicate .html URLs (${duplicateLinks.join(", ")})`
    );
  }

  const ogUrl = extractFirst(
    html,
    /<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["'][^>]*>/i
  );
  if (!ogUrl) {
    errors.push(`${page.file}: missing og:url meta tag`);
  } else if (normalizeUrl(ogUrl) !== normalizeUrl(page.canonical)) {
    errors.push(`${page.file}: og:url mismatch (expected ${page.canonical}, found ${ogUrl})`);
  }

  for (const schemaType of page.requiredSchema) {
    if (!new RegExp(`"@type"\\s*:\\s*"${schemaType}"`).test(html)) {
      errors.push(`${page.file}: missing ${schemaType} JSON-LD`);
    }
  }

  if (isStaticPage) {
    const title = extractFirst(html, /<title>([\s\S]*?)<\/title>/i);
    if (
      page.file !== "privacy-policy.html" &&
      title &&
      !title.includes("Silverstone AI")
    ) {
      errors.push(`${page.file}: title should include "Silverstone AI"`);
    }
  }

  if (isBlogArticle) {
    if (!/"name"\s*:\s*"Silverstone AI"/.test(html)) {
      errors.push(`${page.file}: blog structured data must use "Silverstone AI" as publisher/author`);
    }
    if (!/"datePublished"\s*:\s*"/.test(html)) {
      errors.push(`${page.file}: blog structured data is missing datePublished`);
    }
    if (!/"dateModified"\s*:\s*"/.test(html)) {
      errors.push(`${page.file}: blog structured data is missing dateModified`);
    }
    if (!/By Silverstone AI Editorial Team/.test(html)) {
      errors.push(`${page.file}: missing visible author attribution`);
    }
    if (!/Reviewed by Silverstone AI Automation Strategy Team/.test(html)) {
      errors.push(`${page.file}: missing visible reviewer attribution`);
    }
  }
}

const indexHtml = readFile("index.html");
if (!indexHtml.includes('"name": "Silverstone AI"')) {
  errors.push('index.html: structured data is missing "Silverstone AI" site name');
}
if (!/"sameAs"\s*:\s*\[/.test(indexHtml)) {
  errors.push("index.html: organization structured data is missing sameAs links");
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
  `SEO audit passed for ${blogPages.length} blog pages, ${staticIndexedPages.length} static indexable pages, redirects, robots.txt, site.webmanifest, and sitemap.xml`
);
