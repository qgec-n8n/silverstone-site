import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";

const repo = "/Users/quentingeczy/Desktop/silverstone-site";
const require = createRequire(import.meta.url);
const inventory = require(path.join(repo, "scripts/seo-inventory.js"));

const sha256 = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");
const normalizeSpace = (value = "") =>
  value.replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
const decodeEntities = (value = "") =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
const stripTags = (value = "") =>
  normalizeSpace(
    decodeEntities(
      value
        .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
        .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
        .replace(/<!--[\s\S]*?-->/g, " ")
        .replace(/<[^>]+>/g, " "),
    ),
  );
const attr = (tag, name) => {
  const match = tag.match(
    new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"),
  );
  return match ? decodeEntities(match[1] ?? match[2] ?? match[3] ?? "") : "";
};
const first = (html, regex) => {
  const match = html.match(regex);
  return match ? normalizeSpace(decodeEntities(match[1])) : "";
};
const all = (html, regex) =>
  [...html.matchAll(regex)].map((match) =>
    normalizeSpace(decodeEntities(match[1])),
  );

function schemaTypes(value, result = new Set()) {
  if (!value || typeof value !== "object") return result;
  if (Array.isArray(value)) {
    value.forEach((item) => schemaTypes(item, result));
    return result;
  }
  const type = value["@type"];
  if (Array.isArray(type)) type.forEach((item) => result.add(String(item)));
  else if (type) result.add(String(type));
  Object.values(value).forEach((item) => schemaTypes(item, result));
  return result;
}

function routeForFile(file) {
  if (file === "index.html") return "/";
  return `/${file.replace(/\.html$/i, "")}`;
}

function resolveInternal(fromFile, href) {
  const raw = decodeEntities(href || "").trim();
  if (!raw || /^(#|mailto:|tel:|javascript:|data:)/i.test(raw)) return null;
  try {
    if (/^https?:\/\//i.test(raw)) {
      const parsed = new URL(raw);
      if (parsed.hostname !== "silverstone-ai.com") return null;
      return parsed.pathname.replace(/\.html$/i, "") || "/";
    }
  } catch {
    return null;
  }
  const clean = raw.split("#")[0].split("?")[0];
  if (!clean) return null;
  if (clean.startsWith("/")) return clean.replace(/\.html$/i, "") || "/";
  const fromRoute = routeForFile(fromFile);
  const base = fromRoute.endsWith("/") ? fromRoute : `${path.posix.dirname(fromRoute)}/`;
  return path.posix
    .normalize(path.posix.join(base, clean))
    .replace(/\.html$/i, "");
}

function structureTokens(html) {
  const tokens = [];
  for (const match of html.matchAll(/<([a-z0-9-]+)\b([^>]*)>/gi)) {
    const tag = match[1].toLowerCase();
    if (["script", "style", "meta", "link"].includes(tag)) continue;
    const classes = attr(match[0], "class")
      .split(/\s+/)
      .filter(Boolean)
      .sort()
      .join(".");
    tokens.push(classes ? `${tag}.${classes}` : tag);
  }
  return tokens;
}

function cosine(tokensA, tokensB) {
  const a = new Map();
  const b = new Map();
  tokensA.forEach((token) => a.set(token, (a.get(token) || 0) + 1));
  tokensB.forEach((token) => b.set(token, (b.get(token) || 0) + 1));
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const value of a.values()) magA += value * value;
  for (const value of b.values()) magB += value * value;
  for (const [token, value] of a) dot += value * (b.get(token) || 0);
  return dot / Math.sqrt(magA * magB || 1);
}

const pages = inventory.getIndexedPages(repo);
const knownRoutes = new Set(pages.map((page) => routeForFile(page.file)));
const pageRows = [];

for (const page of pages) {
  const fullPath = path.join(repo, page.file);
  const html = fs.readFileSync(fullPath, "utf8");
  const title = first(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = first(
    html,
    /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i,
  );
  const robots = first(
    html,
    /<meta[^>]+name=["']robots["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i,
  );
  const canonical = first(
    html,
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([\s\S]*?)["'][^>]*>/i,
  );
  const h1s = all(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi).map(stripTags);
  const h2s = all(html, /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi).map(stripTags);
  const hrefs = all(html, /<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi);
  const internalLinks = [
    ...new Set(hrefs.map((href) => resolveInternal(page.file, href)).filter(Boolean)),
  ];
  const externalLinks = [
    ...new Set(
      hrefs.filter((href) => {
        try {
          return (
            /^https?:\/\//i.test(href) &&
            new URL(href).hostname !== "silverstone-ai.com"
          );
        } catch {
          return false;
        }
      }),
    ),
  ];
  const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  const images = imageTags.map((tag) => ({
    src: attr(tag, "src"),
    srcset: attr(tag, "srcset"),
    alt: attr(tag, "alt"),
    width: attr(tag, "width"),
    height: attr(tag, "height"),
    loading: attr(tag, "loading"),
    fetchpriority: attr(tag, "fetchpriority"),
  }));
  const jsonLdBlocks = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((match) => match[1].trim());
  const jsonLdTypes = new Set();
  const jsonLdErrors = [];
  jsonLdBlocks.forEach((block, index) => {
    try {
      schemaTypes(JSON.parse(block), jsonLdTypes);
    } catch (error) {
      jsonLdErrors.push(`block ${index + 1}: ${error.message}`);
    }
  });
  const bodyTag = html.match(/<body\b[^>]*>/i)?.[0] || "";
  const text = stripTags(html);
  const formTags = [...html.matchAll(/<form\b[^>]*>/gi)].map((match) => match[0]);
  const inputTags = [
    ...html.matchAll(/<(?:input|textarea|select)\b[^>]*>/gi),
  ].map((match) => match[0]);
  const tokens = structureTokens(html);
  const lineClaims = html
    .split(/\r?\n/)
    .map((line, index) => ({ line: index + 1, text: stripTags(line) }))
    .filter(
      (item) =>
        item.text &&
        /(?:\b\d+(?:\.\d+)?%|\b\d+x\b|\b24\/7\b|\bguarantee|\bproven\b|\bnever\b|\bup to\b|\broughly\b|\btypically\b|\bmeasurable\b|\bROI\b|\bwithout hiring\b|\bless than\b)/i.test(
          item.text,
        ),
    )
    .slice(0, 80);

  pageRows.push({
    file: page.file,
    route: routeForFile(page.file),
    group: page.group,
    expectedCanonical: page.canonical,
    bytes: fs.statSync(fullPath).size,
    lines: html.split(/\r?\n/).length,
    sha256: sha256(html),
    title,
    titleLength: title.length,
    description,
    descriptionLength: description.length,
    robots,
    canonical,
    h1s,
    h2Count: h2s.length,
    h2s,
    wordCount: text.split(/\s+/).filter(Boolean).length,
    bodyClass: attr(bodyTag, "class"),
    jsonLdBlockCount: jsonLdBlocks.length,
    jsonLdTypes: [...jsonLdTypes].sort(),
    jsonLdErrors,
    internalLinks,
    brokenInternalLinks: internalLinks.filter(
      (route) =>
        !knownRoutes.has(route) &&
        !["/.netlify/functions/send-email"].includes(route),
    ),
    externalLinks,
    images,
    imageCount: images.length,
    missingAltCount: images.filter((image) => image.alt === "").length,
    missingDimensionsCount: images.filter(
      (image) => !image.width || !image.height,
    ).length,
    lazyImageCount: images.filter((image) => image.loading === "lazy").length,
    stylesheetHrefs: all(
      html,
      /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*>/gi,
    ),
    scriptSrcs: all(html, /<script\b[^>]+src=["']([^"']+)["'][^>]*>/gi),
    forms: formTags.map((tag) => ({
      id: attr(tag, "id"),
      method: attr(tag, "method"),
      action: attr(tag, "action"),
    })),
    formFields: inputTags.map((tag) => ({
      name: attr(tag, "name"),
      type: attr(tag, "type") || tag.match(/^<([a-z]+)/i)?.[1] || "",
      autocomplete: attr(tag, "autocomplete"),
      required: /\brequired\b/i.test(tag),
    })),
    flags: {
      googleAnalytics: /G-7GT6DQKTT5/.test(html),
      cookieBanner: /id=["']cookie-banner["']/.test(html),
      parallax: /data-parallax-theme=/.test(html),
      shader: /id=["']hero-shader-canvas["']/.test(html),
      pricingWidget: /pricing-widget\.js/.test(html),
      calendly: /calendly/i.test(html),
      contactForm: /id=["']contact-form["']/.test(html),
      mapEmbed: /google\.com\/maps/i.test(html),
    },
    structureTokenCount: tokens.length,
    structureFingerprint: sha256(tokens.join("\n")),
    structureTokens: tokens,
    claims: lineClaims,
  });
}

const structureTokenMap = new Map(
  pageRows.map((page) => [page.file, page.structureTokens]),
);
for (const page of pageRows) {
  let best = null;
  for (const candidate of pageRows) {
    if (page.file === candidate.file) continue;
    const score = cosine(
      structureTokenMap.get(page.file),
      structureTokenMap.get(candidate.file),
    );
    if (!best || score > best.score) best = { file: candidate.file, score };
  }
  page.nearestStructure = best
    ? { file: best.file, score: Number(best.score.toFixed(4)) }
    : null;
  delete page.structureTokens;
}

const duplicateMetadata = {};
for (const field of ["title", "description", "canonical", "structureFingerprint"]) {
  const values = new Map();
  pageRows.forEach((page) => {
    const value = page[field];
    if (!value) return;
    if (!values.has(value)) values.set(value, []);
    values.get(value).push(page.file);
  });
  duplicateMetadata[field] = [...values.entries()]
    .filter(([, files]) => files.length > 1)
    .map(([value, files]) => ({ value, files }));
}

const sitemap = fs.readFileSync(path.join(repo, "sitemap.xml"), "utf8");
const sitemapEntries = [
  ...sitemap.matchAll(
    /<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/url>/g,
  ),
].map((match) => ({ loc: match[1], lastmod: match[2] }));
const expected = inventory.buildSitemapArtifacts(repo).sitemapEntries;

const netlify = fs.readFileSync(path.join(repo, "netlify.toml"), "utf8");
const redirectBlocks = [
  ...netlify.matchAll(
    /\[\[redirects\]\]([\s\S]*?)(?=\n\[\[redirects\]\]|\n\[|$)/g,
  ),
].map((match) => ({
  from: first(match[1], /from\s*=\s*"([^"]+)"/),
  to: first(match[1], /to\s*=\s*"([^"]+)"/),
  status: Number(first(match[1], /status\s*=\s*([0-9]+)/)),
  force: /force\s*=\s*true/.test(match[1]),
}));
const redirectCounts = new Map();
redirectBlocks.forEach((item) =>
  redirectCounts.set(item.from, (redirectCounts.get(item.from) || 0) + 1),
);

const assetRoots = [
  "assets",
  "favicon.ico",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "apple-touch-icon.png",
  "android-chrome-192x192.png",
  "android-chrome-512x512.png",
  "site.webmanifest",
  "silverstone_whatsapp_qrcode.webp",
  "be41def3cc62428d99800b885d2d7a0f.txt",
];
const walk = (entry) => {
  const full = path.join(repo, entry);
  if (!fs.existsSync(full)) return [];
  if (fs.statSync(full).isFile()) return [entry];
  return fs
    .readdirSync(full)
    .flatMap((child) => walk(path.posix.join(entry, child)));
};
const assetFiles = assetRoots.flatMap(walk).sort();
const textExtensions = new Set([
  ".html",
  ".css",
  ".js",
  ".jsx",
  ".json",
  ".toml",
  ".xml",
  ".txt",
  ".md",
  ".webmanifest",
  ".csv",
]);
const textFiles = [];
const skipPrefixes = [
  "node_modules/",
  ".git/",
  ".codex-venv/",
  ".npm-cache/",
  "artifacts/",
  "docs/silverstone-transformation/audits/",
];
const scanWalk = (dir = "") => {
  for (const name of fs.readdirSync(path.join(repo, dir))) {
    const rel = path.posix.join(dir, name);
    if (skipPrefixes.some((prefix) => rel.startsWith(prefix))) continue;
    const stat = fs.statSync(path.join(repo, rel));
    if (stat.isDirectory()) scanWalk(rel);
    else if (textExtensions.has(path.extname(rel).toLowerCase())) {
      textFiles.push({
        file: rel,
        content: fs.readFileSync(path.join(repo, rel), "utf8"),
      });
    }
  }
};
scanWalk();

function assetClass(file, refs) {
  if (
    file === "assets/js/app.js" ||
    file === "assets/css/styles.css" ||
    file === "assets/js/pricing-widget.js" ||
    file === "assets/css/pricing-widget.css"
  )
    return { lifecycle: "generated-bundle", disposition: "discard" };
  if (file.includes("/derived/"))
    return { lifecycle: "generated-derivative", disposition: "refactor" };
  if (/^assets\/images\/blog\/blog_\d+\.(?:png|jpe?g)$/i.test(file))
    return { lifecycle: "generated-image-source", disposition: "retain" };
  if (file.startsWith("assets/webfonts/"))
    return { lifecycle: "copied-vendor", disposition: "refactor" };
  if (file.startsWith("assets/fonts/"))
    return { lifecycle: "authored-font", disposition: "retain" };
  if (refs.length === 0)
    return { lifecycle: "unreferenced", disposition: "unresolved" };
  return { lifecycle: "authored-public-asset", disposition: "retain" };
}

const assetRows = assetFiles.map((file) => {
  const full = path.join(repo, file);
  const bytes = fs.readFileSync(full);
  const escapedBasename = path.posix
    .basename(file)
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const basenameLiteral = new RegExp(
    `(?:["'\`])${escapedBasename}(?:["'\`])`,
  );
  const references = textFiles
    .filter(
      ({ file: sourceFile, content }) =>
        sourceFile !== file &&
        (content.includes(file) ||
          content.includes(`/${file}`) ||
          basenameLiteral.test(content)),
    )
    .map(({ file: sourceFile }) => sourceFile);
  const classification = assetClass(file, references);
  const ext = path.extname(file).slice(1).toLowerCase();
  const category = file.startsWith("assets/images/")
    ? "image"
    : file.startsWith("assets/fonts/") || file.startsWith("assets/webfonts/")
      ? "font"
      : ["css"].includes(ext)
        ? "stylesheet"
        : ["js"].includes(ext)
          ? "script"
          : ["webmanifest"].includes(ext)
            ? "manifest"
            : "public-asset";
  return {
    recordType: "asset",
    file,
    category,
    extension: ext,
    bytes: bytes.length,
    sha256: sha256(bytes),
    referenceCount: references.length,
    references,
    ...classification,
  };
});

const duplicateAssets = new Map();
assetRows.forEach((asset) => {
  if (!duplicateAssets.has(asset.sha256)) duplicateAssets.set(asset.sha256, []);
  duplicateAssets.get(asset.sha256).push(asset.file);
});
const duplicateAssetGroups = [...duplicateAssets.entries()]
  .filter(([, files]) => files.length > 1)
  .map(([hash, files]) => ({
    sha256: hash,
    bytes: fs.statSync(path.join(repo, files[0])).size,
    files,
  }))
  .sort((a, b) => b.bytes - a.bytes);

const integrations = [
  {
    recordType: "integration",
    key: "resend-contact-email",
    category: "serverless-email",
    sourcePaths: [
      "contact.html",
      "src/js/contact-form.js",
      "netlify/functions/send-email.js",
    ],
    contract:
      "POST JSON {name,email,message} to /.netlify/functions/send-email; Resend API; CONTACT_TO/CONTACT_FROM defaults; Reply-To visitor",
    secrets: "RESEND_API_KEY; optional CONTACT_TO; optional CONTACT_FROM",
    sideEffect: "sends email",
    disposition: "rewrite",
  },
  {
    recordType: "integration",
    key: "calendly-30min",
    category: "booking",
    sourcePaths: ["book.html"],
    contract:
      "Inline widget https://calendly.com/silverstone-ai/30min with hidden landing/event details and #00FF9D primary colour",
    secrets: "",
    sideEffect: "booking only after visitor interaction",
    disposition: "refactor",
  },
  {
    recordType: "integration",
    key: "google-analytics",
    category: "analytics",
    sourcePaths: pageRows
      .filter((page) => page.flags.googleAnalytics)
      .map((page) => page.file),
    contract: "gtag.js measurement ID G-7GT6DQKTT5 loaded in page head",
    secrets: "",
    sideEffect: "analytics beacon on page load",
    disposition: "rewrite",
  },
  {
    recordType: "integration",
    key: "cookie-consent",
    category: "consent",
    sourcePaths: ["src/js/cookie-consent.js", "src/css/components/cookie-banner.css"],
    contract:
      "Stores accepted/declined in localStorage and cookie; currently does not gate analytics loading",
    secrets: "",
    sideEffect: "writes browser storage/cookie",
    disposition: "rewrite",
  },
  {
    recordType: "integration",
    key: "google-maps",
    category: "map",
    sourcePaths: ["contact.html"],
    contract: "Embedded iframe for 4 Deacon Street, London SE17 1GE",
    secrets: "",
    sideEffect: "third-party iframe request",
    disposition: "refactor",
  },
  {
    recordType: "integration",
    key: "indexnow",
    category: "search-indexing",
    sourcePaths: [
      "scripts/indexnow-submit.js",
      "plugins/netlify-plugin-indexnow/index.js",
      "netlify.toml",
      "be41def3cc62428d99800b885d2d7a0f.txt",
    ],
    contract:
      "Production Netlify onSuccess plugin submits changed canonical URLs; root key file",
    secrets: "",
    sideEffect: "production IndexNow submission after successful deploy",
    disposition: "refactor",
  },
  {
    recordType: "integration",
    key: "netlify-static-functions",
    category: "hosting",
    sourcePaths: ["netlify.toml", "netlify/functions/send-email.js"],
    contract:
      "Publish repository root after build and sitemap generation; functions directory netlify/functions",
    secrets: "deployment-side environment variables",
    sideEffect: "deployment/runtime hosting",
    disposition: "rewrite",
  },
  {
    recordType: "integration",
    key: "pricing-react-widget",
    category: "embedded-react",
    sourcePaths: [
      "pricing-widget/src/PricingWidget.jsx",
      "pricing-widget/src/embed.jsx",
      "pricing-widget/src/pricing-copy-map.json",
      "assets/js/pricing-widget.js",
      "assets/css/pricing-widget.css",
    ],
    contract:
      "React 18 widget auto-mounts into .ss-pricing nodes using data-ss-pricing-page and data-ss-pricing-section",
    secrets: "",
    sideEffect: "client rendering only",
    disposition: "refactor",
  },
];

const result = {
  generatedAt: new Date().toISOString(),
  repo,
  pageCount: pageRows.length,
  pages: pageRows,
  duplicateMetadata,
  sitemap: {
    actualCount: sitemapEntries.length,
    expectedCount: expected.length,
    urlSetEqual:
      sitemapEntries.length === expected.length &&
      sitemapEntries.every((entry, index) => entry.loc === expected[index].loc),
    staleEntries: sitemapEntries
      .map((entry, index) => ({
        loc: entry.loc,
        actualLastmod: entry.lastmod,
        expectedLastmod: expected[index]?.lastmod || "",
      }))
      .filter((entry) => entry.actualLastmod !== entry.expectedLastmod),
  },
  redirects: {
    definitionCount: redirectBlocks.length,
    uniqueSourceCount: redirectCounts.size,
    duplicateSources: [...redirectCounts.entries()]
      .filter(([, count]) => count > 1)
      .map(([from, count]) => ({ from, count })),
    selfRedirects: redirectBlocks.filter((item) => item.from === item.to),
    definitions: redirectBlocks,
  },
  assets: {
    count: assetRows.length,
    totalBytes: assetRows.reduce((sum, asset) => sum + asset.bytes, 0),
    byCategory: Object.fromEntries(
      [...new Set(assetRows.map((asset) => asset.category))].map((category) => [
        category,
        assetRows.filter((asset) => asset.category === category).length,
      ]),
    ),
    byLifecycle: Object.fromEntries(
      [...new Set(assetRows.map((asset) => asset.lifecycle))].map((lifecycle) => [
        lifecycle,
        assetRows.filter((asset) => asset.lifecycle === lifecycle).length,
      ]),
    ),
    rows: assetRows,
    duplicateGroups: duplicateAssetGroups,
  },
  integrations,
};

process.stdout.write(JSON.stringify(result, null, 2));
