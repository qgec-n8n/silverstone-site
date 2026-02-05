#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://silverstone-ai.com';
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');
const ROBOTS_PATH = path.join(ROOT, 'robots.txt');
const MANIFEST_PATH = path.join(ROOT, 'site.webmanifest');

const args = new Set(process.argv.slice(2));
const shouldWriteSitemap = args.has('--write-sitemap') || args.has('--write');

const errors = [];
const warnings = [];

const requiredHeadChecks = [
  { key: 'charset', test: (head) => /<meta\b[^>]*\bcharset\s*=\s*['"][^'"]+['"]/i.test(head) },
  { key: 'viewport', test: (head) => /<meta\b[^>]*\bname\s*=\s*['"]viewport['"]/i.test(head) },
];

function listHtmlFiles() {
  const files = [];
  const entries = fs.readdirSync(ROOT, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(entry.name);
    }
  }
  const nichesDir = path.join(ROOT, 'niches');
  if (fs.existsSync(nichesDir)) {
    for (const entry of fs.readdirSync(nichesDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(path.join('niches', entry.name));
      }
    }
  }
  return files.sort();
}

function extractHead(html) {
  const match = html.match(/<head>([\s\S]*?)<\/head>/i);
  return match ? match[1] : html;
}

function matchTags(head, regex) {
  return Array.from(head.matchAll(regex)).map((m) => m[0]);
}

function extractAttr(tag, attr) {
  const re = new RegExp(`${attr}\\s*=\\s*['\"]([^'\"]+)['\"]`, 'i');
  const match = tag.match(re);
  return match ? match[1].trim() : '';
}

function ensureFileExists(relPath, label) {
  const normalized = relPath.replace(/^\//, '');
  const fullPath = path.join(ROOT, normalized);
  if (!fs.existsSync(fullPath)) {
    errors.push(`[assets] Missing ${label}: ${relPath}`);
  }
}

const htmlFiles = listHtmlFiles();
const pages = [];

for (const file of htmlFiles) {
  const fullPath = path.join(ROOT, file);
  const html = fs.readFileSync(fullPath, 'utf8');
  const head = extractHead(html);

  for (const check of requiredHeadChecks) {
    if (!check.test(head)) {
      errors.push(`[${file}] Missing required meta: ${check.key}`);
    }
  }

  if (!/\<html\b[^>]*\blang\s*=\s*['"][^'"]+['"]/i.test(html)) {
    errors.push(`[${file}] Missing lang attribute on <html>`);
  }

  const titleMatch = head.match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    errors.push(`[${file}] Missing or empty <title>`);
  }

  const descriptionTags = matchTags(head, /<meta\b[^>]*\bname\s*=\s*['"]description['"][^>]*>/gi);
  if (descriptionTags.length === 0) {
    errors.push(`[${file}] Missing meta description`);
  } else {
    const content = extractAttr(descriptionTags[0], 'content');
    if (!content) {
      errors.push(`[${file}] Meta description is empty`);
    }
  }

  const robotsTags = matchTags(head, /<meta\b[^>]*\bname\s*=\s*['"]robots['"][^>]*>/gi);
  let robotsContent = '';
  if (robotsTags.length === 0) {
    errors.push(`[${file}] Missing meta robots tag`);
  } else if (robotsTags.length > 1) {
    errors.push(`[${file}] Multiple meta robots tags found`);
  } else {
    robotsContent = extractAttr(robotsTags[0], 'content');
  }
  const isNoindex = /noindex/i.test(robotsContent || '');
  if (isNoindex) {
    warnings.push(`[${file}] Marked noindex via meta robots`);
  }

  const canonicalTags = matchTags(head, /<link\b[^>]*\brel\s*=\s*['"]canonical['"][^>]*>/gi);
  if (canonicalTags.length === 0) {
    errors.push(`[${file}] Missing canonical link`);
  } else if (canonicalTags.length > 1) {
    errors.push(`[${file}] Multiple canonical links found`);
  }
  const canonicalHref = canonicalTags[0] ? extractAttr(canonicalTags[0], 'href') : '';
  if (canonicalHref && !canonicalHref.startsWith(SITE_URL)) {
    errors.push(`[${file}] Canonical URL must start with ${SITE_URL}: ${canonicalHref}`);
  }

  const appleTouchTags = matchTags(head, /<link\b[^>]*\brel\s*=\s*['"]apple-touch-icon['"][^>]*>/gi);
  if (appleTouchTags.length !== 1) {
    errors.push(`[${file}] Expected exactly one apple-touch-icon link`);
  }
  const appleTouchHref = appleTouchTags[0] ? extractAttr(appleTouchTags[0], 'href') : '';
  if (!appleTouchHref) {
    errors.push(`[${file}] apple-touch-icon href missing`);
  }

  const icon32Tags = matchTags(head, /<link\b[^>]*\brel\s*=\s*['"]icon['"][^>]*\bsizes\s*=\s*['"]32x32['"][^>]*>/gi);
  if (icon32Tags.length !== 1) {
    errors.push(`[${file}] Expected exactly one 32x32 favicon link`);
  }
  const icon32Href = icon32Tags[0] ? extractAttr(icon32Tags[0], 'href') : '';
  if (!icon32Href) {
    errors.push(`[${file}] 32x32 favicon href missing`);
  }

  const icon16Tags = matchTags(head, /<link\b[^>]*\brel\s*=\s*['"]icon['"][^>]*\bsizes\s*=\s*['"]16x16['"][^>]*>/gi);
  if (icon16Tags.length !== 1) {
    errors.push(`[${file}] Expected exactly one 16x16 favicon link`);
  }
  const icon16Href = icon16Tags[0] ? extractAttr(icon16Tags[0], 'href') : '';
  if (!icon16Href) {
    errors.push(`[${file}] 16x16 favicon href missing`);
  }

  const manifestTags = matchTags(head, /<link\b[^>]*\brel\s*=\s*['"]manifest['"][^>]*>/gi);
  if (manifestTags.length !== 1) {
    errors.push(`[${file}] Expected exactly one manifest link`);
  }
  const manifestHref = manifestTags[0] ? extractAttr(manifestTags[0], 'href') : '';
  if (!manifestHref) {
    errors.push(`[${file}] manifest href missing`);
  }

  const stat = fs.statSync(fullPath);
  const lastmod = new Date(stat.mtimeMs).toISOString().slice(0, 10);

  pages.push({
    file,
    canonical: canonicalHref,
    lastmod,
    noindex: isNoindex,
  });
}

// Asset existence checks
ensureFileExists('/apple-touch-icon.png', 'apple-touch-icon.png');
ensureFileExists('/favicon-32x32.png', 'favicon-32x32.png');
ensureFileExists('/favicon-16x16.png', 'favicon-16x16.png');
ensureFileExists('/site.webmanifest', 'site.webmanifest');

if (fs.existsSync(MANIFEST_PATH)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    if (Array.isArray(manifest.icons)) {
      manifest.icons.forEach((icon) => {
        if (icon && icon.src) {
          ensureFileExists(icon.src, `manifest icon (${icon.src})`);
        } else {
          warnings.push('[site.webmanifest] icon entry missing src');
        }
      });
    } else {
      warnings.push('[site.webmanifest] icons array missing');
    }
  } catch (err) {
    errors.push(`[site.webmanifest] Invalid JSON: ${err.message}`);
  }
} else {
  errors.push('[site.webmanifest] Missing site.webmanifest');
}

// Robots.txt validation
if (!fs.existsSync(ROBOTS_PATH)) {
  errors.push('[robots.txt] Missing robots.txt');
} else {
  const robots = fs.readFileSync(ROBOTS_PATH, 'utf8');
  const sitemapLine = new RegExp(`^Sitemap:\\s*${SITE_URL.replace(/[-/\\.^$*+?()[\]{}|]/g, '\\$&')}/sitemap\\.xml\\s*$`, 'mi');
  if (!sitemapLine.test(robots)) {
    errors.push(`[robots.txt] Missing Sitemap line for ${SITE_URL}/sitemap.xml`);
  }
}

// Sitemap generation and validation
const indexablePages = pages.filter((page) => !page.noindex);
const seenCanonicals = new Set();
for (const page of indexablePages) {
  if (!page.canonical) {
    errors.push(`[${page.file}] Canonical URL missing; cannot include in sitemap`);
    continue;
  }
  if (seenCanonicals.has(page.canonical)) {
    errors.push(`[sitemap] Duplicate canonical URL detected: ${page.canonical}`);
  }
  seenCanonicals.add(page.canonical);
}

const sitemapEntries = indexablePages
  .filter((page) => page.canonical)
  .map((page) => ({
    loc: page.canonical,
    lastmod: page.lastmod,
  }))
  .sort((a, b) => a.loc.localeCompare(b.loc));

const sitemapLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
];
for (const entry of sitemapEntries) {
  sitemapLines.push('  <url>');
  sitemapLines.push(`    <loc>${entry.loc}</loc>`);
  sitemapLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
  sitemapLines.push('  </url>');
}
sitemapLines.push('</urlset>');
const expectedSitemap = `${sitemapLines.join('\n')}\n`;

const maxUrls = 50000;
const maxBytes = 50 * 1024 * 1024;
if (sitemapEntries.length > maxUrls) {
  errors.push(`[sitemap] Too many URLs (${sitemapEntries.length}); limit is ${maxUrls}`);
}
if (Buffer.byteLength(expectedSitemap, 'utf8') > maxBytes) {
  errors.push('[sitemap] Sitemap exceeds 50MB uncompressed limit');
}

if (errors.length) {
  console.error('[seo-audit] Failed checks:');
  errors.forEach((err) => console.error(`- ${err}`));
  if (warnings.length) {
    console.warn('\n[seo-audit] Warnings:');
    warnings.forEach((warn) => console.warn(`- ${warn}`));
  }
  process.exit(1);
}

if (shouldWriteSitemap) {
  fs.writeFileSync(SITEMAP_PATH, expectedSitemap, 'utf8');
  console.log(`[seo-audit] Wrote sitemap.xml (${sitemapEntries.length} URLs).`);
} else {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error('[seo-audit] sitemap.xml missing. Run with --write-sitemap to generate.');
    process.exit(1);
  }
  const existing = fs.readFileSync(SITEMAP_PATH, 'utf8');
  if (existing !== expectedSitemap) {
    console.error('[seo-audit] sitemap.xml is out of sync with indexable pages.');
    console.error('[seo-audit] Run: node scripts/seo-audit.js --write-sitemap');
    process.exit(1);
  }
  console.log(`[seo-audit] OK (${sitemapEntries.length} indexable URLs).`);
}

if (warnings.length) {
  console.warn('\n[seo-audit] Warnings:');
  warnings.forEach((warn) => console.warn(`- ${warn}`));
}
