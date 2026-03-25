#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const {
  SITEMAP_FILE_NAMES,
  buildSitemapArtifacts,
  canonicalPath,
  getIndexedPages,
  getPagesByGroup,
  normalizeUrl,
} = require("./seo-inventory");
const {
  EXPECTED_INDEXNOW_KEY_FILE,
  buildIndexNowPayload,
  findValidIndexNowKeyFiles,
} = require("./indexnow-submit");

const repoRoot = path.resolve(__dirname, "..");
const LEGACY_INDEXNOW_KEY_FILE = "7b0b4b0f2e2e4f4080c0f14e9e18e0c6.txt";
const indexedPages = getIndexedPages(repoRoot);
const groupedPages = getPagesByGroup(repoRoot);
const blogPages = groupedPages.blog;
const staticIndexedPages = indexedPages.filter((page) => !page.file.startsWith("blog/"));
const indexedFileSet = new Set(indexedPages.map((page) => page.file));
const requiredNichePaths = groupedPages.niches.map((page) => canonicalPath(page.canonical));
const requiredBlogPaths = blogPages.map((page) => canonicalPath(page.canonical));
const nonServiceCorePages = ["about.html", "blog.html", "book.html", "contact.html"];
const { artifacts: expectedSitemapArtifacts, sitemapEntries: expectedSitemapEntries } =
  buildSitemapArtifacts(repoRoot);
const requiredSitemapUrls = expectedSitemapEntries.map((entry) => normalizeUrl(entry.loc));

function readFile(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), "utf8");
}

function fileExists(relPath) {
  return fs.existsSync(path.join(repoRoot, relPath));
}

function extractFirst(content, regex) {
  const match = content.match(regex);
  return match ? match[1].trim() : "";
}

function extractMetaContent(content, attr, name) {
  const match = content.match(
    new RegExp(
      `<meta[^>]*${attr}=["']${name}["'][^>]*content=(["'])([\\s\\S]*?)\\1[^>]*>`,
      "i"
    )
  );
  return match ? match[2].trim() : "";
}

function extractLocs(content) {
  return Array.from(content.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) =>
    normalizeUrl(match[1].trim())
  );
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

function collectInternalLinks(content, fromFile) {
  return Array.from(
    new Set(
      Array.from(content.matchAll(/href=["']([^"']+)["']/gi))
        .map((match) => resolveInternalTarget(fromFile, match[1].trim()))
        .filter(Boolean)
    )
  );
}

function findDuplicateInternalLinks(content, fromFile) {
  return collectInternalLinks(content, fromFile).filter((target) => {
    if (!target.endsWith(".html")) return false;
    return indexedFileSet.has(target.replace(/^\//, ""));
  });
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

function getNicheSlug(page) {
  return path.posix.basename(page.file, ".html");
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

for (const asset of [
  "favicon.ico",
  "favicon-48x48.png",
  "favicon-32x32.png",
  "favicon-16x16.png",
  "apple-touch-icon.png",
]) {
  if (!fileExists(asset)) {
    errors.push(`missing favicon asset ${asset}`);
  }
}

const validIndexNowKeyFiles = findValidIndexNowKeyFiles(repoRoot);
if (!validIndexNowKeyFiles.includes(EXPECTED_INDEXNOW_KEY_FILE)) {
  errors.push(`missing expected root IndexNow key file ${EXPECTED_INDEXNOW_KEY_FILE}`);
}
if (validIndexNowKeyFiles.length !== 1) {
  errors.push(
    `expected exactly one valid root IndexNow key file, found ${validIndexNowKeyFiles.length} (${validIndexNowKeyFiles.join(", ") || "none"})`
  );
}
if (fileExists(LEGACY_INDEXNOW_KEY_FILE)) {
  errors.push(`legacy IndexNow key file should be removed (${LEGACY_INDEXNOW_KEY_FILE})`);
}
if (!fileExists("scripts/indexnow-submit.js")) {
  errors.push("missing scripts/indexnow-submit.js");
}
if (!fileExists("scripts/seo-inventory.js")) {
  errors.push("missing scripts/seo-inventory.js");
}
if (!fileExists("scripts/generate-sitemaps.js")) {
  errors.push("missing scripts/generate-sitemaps.js");
}
if (!fileExists("plugins/netlify-plugin-indexnow/index.js")) {
  errors.push("missing plugins/netlify-plugin-indexnow/index.js");
}
if (!fileExists("plugins/netlify-plugin-indexnow/manifest.yml")) {
  errors.push("missing plugins/netlify-plugin-indexnow/manifest.yml");
}

const netlifyToml = readFile("netlify.toml");
if (
  !/\[\[context\.production\.plugins\]\][\s\S]*?package\s*=\s*"\/plugins\/netlify-plugin-indexnow"/.test(
    netlifyToml
  )
) {
  errors.push("netlify.toml: missing production IndexNow plugin configuration");
}

const indexNowPlugin = readFile("plugins/netlify-plugin-indexnow/index.js");
if (!/constants\.PUBLISH_DIR/.test(indexNowPlugin)) {
  errors.push("plugins/netlify-plugin-indexnow/index.js: must use constants.PUBLISH_DIR as the site root");
}
if (!/collectChangedIndexNowUrls/.test(indexNowPlugin)) {
  errors.push("plugins/netlify-plugin-indexnow/index.js: must compute changed URLs before submission");
}
if (/submitIndexNow\(\{\s*repoRoot,\s*logger:\s*console\s*\}\)/s.test(indexNowPlugin)) {
  errors.push("plugins/netlify-plugin-indexnow/index.js: still submits unconditionally without explicit URLs");
}

const indexNowScript = readFile("scripts/indexnow-submit.js");
if (!/--url/.test(indexNowScript) || !/--all/.test(indexNowScript)) {
  errors.push("scripts/indexnow-submit.js: missing explicit CLI modes for --url and --all");
}
if (!/Expected exactly one valid root IndexNow key file/.test(indexNowScript)) {
  errors.push("scripts/indexnow-submit.js: must fail when zero or multiple valid key files exist");
}

for (const [fileName, expectedContent] of Object.entries(expectedSitemapArtifacts)) {
  if (!fileExists(fileName)) {
    errors.push(`${fileName}: missing generated sitemap file`);
    continue;
  }

  const actualContent = readFile(fileName);
  if (actualContent !== expectedContent) {
    errors.push(`${fileName}: generated sitemap content is stale; run npm run generate:sitemaps`);
  }
  if (/<priority>/i.test(actualContent)) {
    errors.push(`${fileName}: priority hints should not be present`);
  }
  if (/<changefreq>/i.test(actualContent)) {
    errors.push(`${fileName}: changefreq hints should not be present`);
  }
}

const sitemapContent = readFile(SITEMAP_FILE_NAMES.root);
const sitemapUrls = extractLocs(sitemapContent);
const sitemapUrlSet = new Set(sitemapUrls);

if (/<sitemapindex/i.test(sitemapContent)) {
  errors.push(`${SITEMAP_FILE_NAMES.root}: must be a flat urlset, not a sitemap index`);
}
if (!/<urlset/i.test(sitemapContent)) {
  errors.push(`${SITEMAP_FILE_NAMES.root}: missing <urlset> root element`);
}
if (sitemapUrlSet.size !== sitemapUrls.length) {
  errors.push(`${SITEMAP_FILE_NAMES.root}: duplicate <loc> entries found`);
}
if (sitemapUrls.length !== requiredSitemapUrls.length) {
  errors.push(
    `${SITEMAP_FILE_NAMES.root}: expected ${requiredSitemapUrls.length} canonical URLs, found ${sitemapUrls.length}`
  );
}
for (const url of requiredSitemapUrls) {
  if (!sitemapUrlSet.has(url)) {
    errors.push(`${SITEMAP_FILE_NAMES.root}: missing required URL ${url}`);
  }
}
for (const url of sitemapUrlSet) {
  if (!requiredSitemapUrls.includes(url)) {
    errors.push(`${SITEMAP_FILE_NAMES.root}: unexpected URL ${url}`);
  }
  if (/^https:\/\/silverstone-ai\.com\/.+\.html$/i.test(url)) {
    errors.push(`${SITEMAP_FILE_NAMES.root}: URL must be extensionless (${url})`);
  }
}
if (sitemapUrls.join("\n") !== requiredSitemapUrls.join("\n")) {
  errors.push(
    `${SITEMAP_FILE_NAMES.root}: URL order must be main pages first, then blog posts, niche pages, and legal`
  );
}

try {
  const payload = buildIndexNowPayload({ siteRoot: repoRoot, urls: [requiredSitemapUrls[0]] });
  const expectedKeyLocation = `https://silverstone-ai.com/${EXPECTED_INDEXNOW_KEY_FILE}`;
  if (payload.keyLocation !== expectedKeyLocation) {
    errors.push(
      `scripts/indexnow-submit.js: keyLocation mismatch (expected ${expectedKeyLocation}, found ${payload.keyLocation})`
    );
  }
} catch (error) {
  errors.push(`scripts/indexnow-submit.js: unable to build a valid IndexNow payload (${error.message})`);
}

const redirects = parseRedirects(netlifyToml);
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

for (const page of groupedPages.niches) {
  const slug = getNicheSlug(page);
  const expectedTo = canonicalPath(page.canonical);
  const legacyCleanPath = `/niches/${slug}`;
  const legacyCleanRedirect = redirects.get(legacyCleanPath);
  if (!legacyCleanRedirect) {
    errors.push(`netlify.toml: missing redirect for ${legacyCleanPath}`);
  } else if (legacyCleanRedirect.to !== expectedTo || legacyCleanRedirect.status !== "301") {
    errors.push(
      `netlify.toml: redirect mismatch for ${legacyCleanPath} (expected 301 -> ${expectedTo}, found ${legacyCleanRedirect.status || "?"} -> ${legacyCleanRedirect.to || "?"})`
    );
  }

  const canonicalRoute = redirects.get(expectedTo);
  const expectedSourceFile = `/${page.file}`;
  if (!canonicalRoute) {
    errors.push(`netlify.toml: missing rewrite for ${expectedTo}`);
  } else if (canonicalRoute.to !== expectedSourceFile || canonicalRoute.status !== "200") {
    errors.push(
      `netlify.toml: rewrite mismatch for ${expectedTo} (expected 200 -> ${expectedSourceFile}, found ${canonicalRoute.status || "?"} -> ${canonicalRoute.to || "?"})`
    );
  }
}

for (const page of indexedPages) {
  const html = readFile(page.file);
  const internalLinks = collectInternalLinks(html, page.file);
  const duplicateLinks = findDuplicateInternalLinks(html, page.file);
  const legacyNicheLinks = internalLinks.filter((href) => href.startsWith("/niches/"));
  const isBlogArticle = page.file.startsWith("blog/");
  const isNichePage = page.file.startsWith("niches/");
  const ctaLinkList = extractFirst(html, /(<div class="cta-link-list">[\s\S]*?<\/div>)/i);
  const ctaLinks = ctaLinkList ? collectInternalLinks(ctaLinkList, page.file) : [];

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

  const title = extractFirst(html, /<title>([\s\S]*?)<\/title>/i);
  const enforceBrandPresence = !isBlogArticle && page.file !== "privacy-policy.html";
  if (enforceBrandPresence && !title.includes("Silverstone AI")) {
    errors.push(`${page.file}: title should include "Silverstone AI"`);
  }
  if (title.length > 60) {
    warnings.push(`${page.file}: title length is ${title.length} characters`);
  }

  const description = extractMetaContent(html, "name", "description");
  if (!description) {
    errors.push(`${page.file}: missing meta description`);
  } else if (description.length < 70 || description.length > 170) {
    warnings.push(`${page.file}: meta description length is ${description.length} characters`);
  } else if (/\b(?:and|or|to|for|with|from|into|vendor|repeat|compliant|speed)$/i.test(description.replace(/[.!?]+\s*$/, ""))) {
    warnings.push(`${page.file}: meta description appears truncated or unfinished`);
  }

  const robots = extractMetaContent(html, "name", "robots");
  if (!robots) {
    errors.push(`${page.file}: missing robots meta tag`);
  } else {
    const robotsLower = robots.toLowerCase();
    if (!robotsLower.includes("index") || !robotsLower.includes("follow")) {
      errors.push(`${page.file}: robots meta should include "index, follow"`);
    }
  }

  if (duplicateLinks.length > 0) {
    errors.push(
      `${page.file}: found internal links pointing to duplicate .html URLs (${duplicateLinks.join(", ")})`
    );
  }
  if (legacyNicheLinks.length > 0) {
    errors.push(`${page.file}: found legacy internal links to /niches/ URLs (${legacyNicheLinks.join(", ")})`);
  }

  const ogUrl = extractMetaContent(html, "property", "og:url");
  if (!ogUrl) {
    errors.push(`${page.file}: missing og:url meta tag`);
  } else if (normalizeUrl(ogUrl) !== normalizeUrl(page.canonical)) {
    errors.push(`${page.file}: og:url mismatch (expected ${page.canonical}, found ${ogUrl})`);
  }

  const ogSiteName = extractMetaContent(html, "property", "og:site_name");
  if (ogSiteName !== "Silverstone AI") {
    errors.push(`${page.file}: og:site_name must be "Silverstone AI"`);
  }

  const ogTitle = extractMetaContent(html, "property", "og:title");
  if (!ogTitle) {
    errors.push(`${page.file}: missing og:title meta tag`);
  } else if (ogTitle !== title) {
    errors.push(`${page.file}: og:title should match the <title> element`);
  }

  const ogImage = extractMetaContent(html, "property", "og:image");
  if (!ogImage) {
    errors.push(`${page.file}: missing og:image meta tag`);
  }

  const twitterCard = extractMetaContent(html, "name", "twitter:card");
  if (!twitterCard) {
    errors.push(`${page.file}: missing twitter:card meta tag`);
  }
  const twitterTitle = extractMetaContent(html, "name", "twitter:title");
  if (twitterTitle !== title) {
    errors.push(`${page.file}: twitter:title should match the <title> element`);
  }
  const twitterDescription = extractMetaContent(html, "name", "twitter:description");
  if (twitterDescription !== description) {
    errors.push(`${page.file}: twitter:description should match meta description`);
  }
  const twitterImage = extractMetaContent(html, "name", "twitter:image");
  if (!twitterImage) {
    errors.push(`${page.file}: missing twitter:image meta tag`);
  } else if (ogImage && twitterImage !== ogImage) {
    errors.push(`${page.file}: twitter:image should match og:image`);
  }

  if (!/href=["']\/favicon\.ico["']/i.test(html)) {
    errors.push(`${page.file}: missing /favicon.ico head reference`);
  }
  if (!/href=["']\/favicon-48x48\.png["']/i.test(html)) {
    errors.push(`${page.file}: missing /favicon-48x48.png head reference`);
  }

  for (const schemaType of page.requiredSchema) {
    if (!new RegExp(`"@type"\\s*:\\s*"${schemaType}"`).test(html)) {
      errors.push(`${page.file}: missing ${schemaType} JSON-LD`);
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
    if (!extractMetaContent(html, "name", "author")) {
      errors.push(`${page.file}: missing author meta tag`);
    }
    if (!extractMetaContent(html, "property", "article:published_time")) {
      errors.push(`${page.file}: missing article:published_time meta tag`);
    }
    if (!extractMetaContent(html, "property", "article:modified_time")) {
      errors.push(`${page.file}: missing article:modified_time meta tag`);
    }
    if (!internalLinks.includes("/book")) {
      errors.push(`${page.file}: expected a direct internal link to /book`);
    }
    if (!ctaLinkList) {
      errors.push(`${page.file}: missing contextual cta-link-list block`);
    }
    const hasSupportingLink = ctaLinks.some(
      (href) => href === "/services" || href.startsWith("/services/")
    );
    if (!hasSupportingLink) {
      errors.push(`${page.file}: cta-link-list should link to /services or a matching /services/ page`);
    }
  }

  if (isNichePage) {
    if (!ctaLinkList) {
      errors.push(`${page.file}: missing contextual cta-link-list block`);
    }
    if (!internalLinks.includes("/book")) {
      errors.push(`${page.file}: expected a direct internal link to /book`);
    }
    if (!ctaLinks.includes("/services")) {
      errors.push(`${page.file}: cta-link-list should include /services`);
    }
    if (!ctaLinks.some((href) => href.startsWith("/blog/"))) {
      errors.push(`${page.file}: cta-link-list should include at least one /blog/ guide`);
    }
  }
}

const servicesHtml = readFile("services.html");
const servicesNicheSection = extractFirst(
  servicesHtml,
  /(<section id="service-page-clusters"[\s\S]*?<\/section>)/i
);
const servicesGuidesSection = extractFirst(
  servicesHtml,
  /(<section id="service-supporting-guides"[\s\S]*?<\/section>)/i
);

if (!servicesNicheSection) {
  errors.push("services.html: missing niche services resources section");
}
if (!servicesGuidesSection) {
  errors.push("services.html: missing supporting guides resources section");
}
if (servicesNicheSection && servicesGuidesSection) {
  const nichePosition = servicesHtml.indexOf('id="service-page-clusters"');
  const guidesPosition = servicesHtml.indexOf('id="service-supporting-guides"');
  if (nichePosition > guidesPosition) {
    errors.push("services.html: niche resources section must appear before supporting guides section");
  }

  const nicheLinks = collectInternalLinks(servicesNicheSection, "services.html");
  const guideLinks = collectInternalLinks(servicesGuidesSection, "services.html");
  for (const requiredPath of requiredNichePaths) {
    if (!nicheLinks.includes(requiredPath)) {
      errors.push(`services.html: niche resources section is missing ${requiredPath}`);
    }
  }
  for (const requiredPath of requiredBlogPaths) {
    if (!guideLinks.includes(requiredPath)) {
      errors.push(`services.html: supporting guides section is missing ${requiredPath}`);
    }
  }
}

const indexHtml = readFile("index.html");
if (!indexHtml.includes('"name": "Silverstone AI"')) {
  errors.push('index.html: structured data is missing "Silverstone AI" site name');
}
if (!/"@type"\s*:\s*"Organization"/.test(indexHtml)) {
  errors.push("index.html: missing Organization JSON-LD");
}
if (!/"sameAs"\s*:\s*\[/.test(indexHtml)) {
  errors.push("index.html: organization structured data is missing sameAs links");
}
if (/"alternateName"\s*:\s*"Silverstone"/.test(indexHtml)) {
  errors.push('index.html: WebSite alternateName should not be "Silverstone"');
}
if (!/"alternateName"\s*:\s*"silverstone-ai\.com"/.test(indexHtml)) {
  errors.push('index.html: WebSite alternateName should use "silverstone-ai.com"');
}
if (!/<section class="hero title-band">/i.test(indexHtml)) {
  errors.push("index.html: missing homepage hero section");
}
if (!/id="hero-shader-canvas"/i.test(indexHtml)) {
  errors.push("index.html: missing hero-shader-canvas element");
}
const primarySiteLinksSection = extractFirst(
  indexHtml,
  /(<section id="primary-site-links"[\s\S]*?<\/section>)/i
);
if (!primarySiteLinksSection) {
  errors.push("index.html: missing primary site links section");
} else {
  const primarySectionLinks = collectInternalLinks(primarySiteLinksSection, "index.html");
  const expectedPrimaryOrder = ["/about", "/services", "/blog", "/book", "/contact"];
  for (const href of expectedPrimaryOrder) {
    if (!primarySectionLinks.includes(href)) {
      errors.push(`index.html: primary site links section is missing ${href}`);
    }
  }
}
if (
  !/<section class="section bg-lines animate parallax-section" data-parallax-theme="lines">[\s\S]*?<section id="what-we-automate">/i.test(
    indexHtml
  )
) {
  errors.push("index.html: missing homepage bg-lines parallax section before #what-we-automate");
}

for (const relPath of nonServiceCorePages) {
  const html = readFile(relPath);
  if (!/class="nav-dropdown"/.test(html)) {
    errors.push(`${relPath}: missing the checked-in Niches dropdown pattern`);
  }
  if (!/class="services-overlay"/.test(html)) {
    errors.push(`${relPath}: missing the checked-in Niches overlay pattern`);
  }
  if (!/href="\/services\//.test(html)) {
    errors.push(`${relPath}: missing checked-in direct niche links`);
  }
}

for (const page of blogPages) {
  const html = readFile(page.file);
  if (!/class="nav-dropdown"/.test(html)) {
    errors.push(`${page.file}: missing the checked-in Niches dropdown pattern`);
  }
  if (!/class="services-overlay"/.test(html)) {
    errors.push(`${page.file}: missing the checked-in Niches overlay pattern`);
  }
  if (!/href="\/services\//.test(html)) {
    errors.push(`${page.file}: missing checked-in direct niche links`);
  }
}

const indexOpenSections = (indexHtml.match(/<section\b/gi) || []).length;
const indexCloseSections = (indexHtml.match(/<\/section>/gi) || []).length;
if (indexOpenSections !== indexCloseSections) {
  errors.push(
    `index.html: unbalanced section markup (${indexOpenSections} opening vs ${indexCloseSections} closing)`
  );
}

const indexOpenDivs = (indexHtml.match(/<div\b/gi) || []).length;
const indexCloseDivs = (indexHtml.match(/<\/div>/gi) || []).length;
if (indexOpenDivs !== indexCloseDivs) {
  errors.push(`index.html: unbalanced div markup (${indexOpenDivs} opening vs ${indexCloseDivs} closing)`);
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
  `SEO audit passed for ${blogPages.length} blog pages, ${staticIndexedPages.length} static indexable pages, redirects, robots.txt, site.webmanifest, IndexNow, favicons, and the flat root sitemap`
);
