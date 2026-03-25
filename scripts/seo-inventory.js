const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SITE_ORIGIN = "https://silverstone-ai.com";
const SITE_HOSTNAME = "silverstone-ai.com";
const SITEMAP_FILE_NAMES = {
  root: "sitemap.xml",
};

const STATIC_PAGES = [
  {
    file: "index.html",
    canonical: SITE_ORIGIN,
    group: "main",
    requiredSchema: ["WebSite", "Organization", "ProfessionalService", "BreadcrumbList"],
  },
  {
    file: "about.html",
    canonical: `${SITE_ORIGIN}/about`,
    group: "main",
    requiredSchema: ["AboutPage", "BreadcrumbList"],
  },
  {
    file: "services.html",
    canonical: `${SITE_ORIGIN}/services`,
    group: "main",
    requiredSchema: ["WebPage", "Service", "BreadcrumbList"],
  },
  {
    file: "pricing.html",
    canonical: `${SITE_ORIGIN}/pricing`,
    group: "main",
    requiredSchema: ["WebPage", "BreadcrumbList"],
  },
  {
    file: "blog.html",
    canonical: `${SITE_ORIGIN}/blog`,
    group: "main",
    requiredSchema: ["CollectionPage", "BreadcrumbList"],
  },
  {
    file: "book.html",
    canonical: `${SITE_ORIGIN}/book`,
    group: "main",
    requiredSchema: ["WebPage", "BreadcrumbList"],
  },
  {
    file: "contact.html",
    canonical: `${SITE_ORIGIN}/contact`,
    group: "main",
    requiredSchema: ["ContactPage", "BreadcrumbList"],
  },
  {
    file: "privacy-policy.html",
    canonical: `${SITE_ORIGIN}/privacy-policy`,
    group: "legal",
    requiredSchema: [],
  },
];

const GROUP_ORDER = ["main", "blog", "niches", "legal"];

function normalizeUrl(url) {
  return url.replace(/\/$/, "");
}

function canonicalPath(url) {
  return new URL(url).pathname || "/";
}

function toPosixPath(filePath) {
  return filePath.replace(/\\/g, "/").replace(/^\.?\//, "");
}

function readHtmlDirectory(repoRoot, directoryName, canonicalDirectoryName, group, requiredSchema) {
  const directory = path.join(repoRoot, directoryName);
  return fs
    .readdirSync(directory)
    .filter((entry) => entry.endsWith(".html"))
    .sort()
    .map((entry) => {
      const slug = entry.replace(/\.html$/i, "");
      return {
        file: `${directoryName}/${entry}`,
        canonical: `${SITE_ORIGIN}/${canonicalDirectoryName}/${slug}`,
        group,
        requiredSchema,
      };
    });
}

function getIndexedPages(repoRoot = path.resolve(__dirname, "..")) {
  const nichePages = readHtmlDirectory(
    repoRoot,
    "niches",
    "services",
    "niches",
    ["WebPage", "Service", "BreadcrumbList"]
  );
  const blogPages = readHtmlDirectory(
    repoRoot,
    "blog",
    "blog",
    "blog",
    ["BlogPosting", "BreadcrumbList"]
  );

  return [...STATIC_PAGES, ...nichePages, ...blogPages];
}

function getPagesByGroup(repoRoot = path.resolve(__dirname, "..")) {
  const grouped = {
    main: [],
    blog: [],
    niches: [],
    legal: [],
  };

  for (const page of getIndexedPages(repoRoot)) {
    grouped[page.group].push(page);
  }

  return grouped;
}

function getCanonicalUrls(repoRoot = path.resolve(__dirname, "..")) {
  const groupedPages = getPagesByGroup(repoRoot);
  return GROUP_ORDER.flatMap((group) =>
    groupedPages[group].map((page) => normalizeUrl(page.canonical))
  );
}

function getCanonicalUrlMap(repoRoot = path.resolve(__dirname, "..")) {
  return new Map(
    getIndexedPages(repoRoot).map((page) => [toPosixPath(page.file), normalizeUrl(page.canonical)])
  );
}

function formatLastmod(dateValue) {
  return new Date(dateValue).toISOString().replace(/\.\d{3}Z$/, "Z");
}

function readGitLastmod(repoRoot, relPath) {
  try {
    const output = execFileSync("git", ["log", "-1", "--format=%cI", "--", relPath], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return output ? formatLastmod(output) : "";
  } catch {
    return "";
  }
}

function readFileLastmod(repoRoot, relPath) {
  return formatLastmod(fs.statSync(path.join(repoRoot, relPath)).mtime);
}

function getPageLastmod(repoRoot, relPath) {
  return readGitLastmod(repoRoot, relPath) || readFileLastmod(repoRoot, relPath);
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function renderUrlSet(entries) {
  const body = entries
    .map(
      (entry) => `  <url>
    <loc>${xmlEscape(entry.loc)}</loc>
    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function buildSitemapArtifacts(repoRoot = path.resolve(__dirname, "..")) {
  const groupedPages = getPagesByGroup(repoRoot);
  const sitemapEntries = GROUP_ORDER.flatMap((group) =>
    groupedPages[group].map((page) => ({
      loc: normalizeUrl(page.canonical),
      lastmod: getPageLastmod(repoRoot, page.file),
    }))
  );

  const artifacts = {
    [SITEMAP_FILE_NAMES.root]: renderUrlSet(sitemapEntries),
  };

  return {
    artifacts,
    groupedPages,
    sitemapEntries,
  };
}

function writeSitemapArtifacts(repoRoot = path.resolve(__dirname, "..")) {
  const { artifacts } = buildSitemapArtifacts(repoRoot);
  for (const [fileName, content] of Object.entries(artifacts)) {
    fs.writeFileSync(path.join(repoRoot, fileName), content, "utf8");
  }
  return artifacts;
}

module.exports = {
  GROUP_ORDER,
  SITE_HOSTNAME,
  SITE_ORIGIN,
  SITEMAP_FILE_NAMES,
  STATIC_PAGES,
  buildSitemapArtifacts,
  canonicalPath,
  getCanonicalUrlMap,
  getCanonicalUrls,
  getIndexedPages,
  getPageLastmod,
  getPagesByGroup,
  normalizeUrl,
  writeSitemapArtifacts,
};
