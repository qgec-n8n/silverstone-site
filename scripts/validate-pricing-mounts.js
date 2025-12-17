// FILE: scripts/validate-pricing-mounts.js

/**
 * Validate that pricing widget mounts + asset includes exist on every target page.
 *
 * This script is intended to run AFTER Codex has implemented the pricing React embed.
 * It should fail on the current repo state (pre-embed) because mounts + assets don't exist yet.
 */

const fs = require('fs');
const path = require('path');

const { TARGET_PAGES, PRICING_PLACEHOLDER_SUBSTRING } = require('./pricing.constants');

const REPO_ROOT = path.join(__dirname, '..');

function fatal(message) {
  console.error(`\n❌ Pricing mount validation failed: ${message}\n`);
  process.exit(1);
}

function readText(relPath) {
  const abs = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(abs)) fatal(`File not found: ${relPath}`);
  return fs.readFileSync(abs, 'utf8');
}

function fileExists(relPath) {
  return fs.existsSync(path.join(REPO_ROOT, relPath));
}

function expectedAssetPrefix(pagePath) {
  // Root HTML files use `assets/...`; niches use `../assets/...`.
  return pagePath.startsWith('niches/') ? '../' : '';
}

function extractSectionHtml(html, sectionId) {
  const start = html.indexOf(`<section id="${sectionId}"`);
  if (start === -1) return null;
  const end = html.indexOf('</section>', start);
  if (end === -1) return null;
  return html.slice(start, end + '</section>'.length);
}

function extractMountTags(html) {
  // Finds opening tags for elements whose class attribute contains `ss-pricing`.
  const tags = [];

  // Double-quoted class attribute
  const re1 = /<([a-zA-Z0-9-]+)\b[^>]*\bclass="[^"]*\bss-pricing\b[^"]*"[^>]*>/g;
  let m;
  while ((m = re1.exec(html))) tags.push(m[0]);

  // Single-quoted class attribute
  const re2 = /<([a-zA-Z0-9-]+)\b[^>]*\bclass='[^']*\bss-pricing\b[^']*'[^>]*>/g;
  while ((m = re2.exec(html))) tags.push(m[0]);

  return tags;
}

function getAttr(tag, attrName) {
  const reDq = new RegExp(`${attrName}="([^"]*)"`);
  const reSq = new RegExp(`${attrName}='([^']*)'`);
  const m1 = tag.match(reDq);
  if (m1) return m1[1];
  const m2 = tag.match(reSq);
  if (m2) return m2[1];
  return null;
}

function assertIncludes(haystack, needle, ctx) {
  if (!haystack.includes(needle)) {
    fatal(`${ctx}: expected to include ${JSON.stringify(needle)}`);
  }
}

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
}

function validatePage(pagePath) {
  const html = readText(pagePath);
  const ctx = pagePath;
  const prefix = expectedAssetPrefix(pagePath);

  // 1) Placeholder removed.
  if (html.includes(PRICING_PLACEHOLDER_SUBSTRING)) {
    fatal(`${ctx}: still contains pricing placeholder text; expected it to be removed/replaced.`);
  }

  // 2) Pricing section exists and contains both mounts.
  const pricingSection = extractSectionHtml(html, 'pricing');
  if (!pricingSection) fatal(`${ctx}: missing <section id="pricing">`);

  const mountTags = extractMountTags(pricingSection);
  if (mountTags.length !== 2) {
    fatal(`${ctx}: expected exactly 2 pricing mounts inside #pricing, found ${mountTags.length}`);
  }

  const expectedPageKey = pagePath;
  const found = {
    section1: false,
    section2: false,
  };

  for (const tag of mountTags) {
    const pageKey = getAttr(tag, 'data-ss-pricing-page');
    const section = getAttr(tag, 'data-ss-pricing-section');
    if (!pageKey) fatal(`${ctx}: pricing mount missing data-ss-pricing-page attribute.`);
    if (!section) fatal(`${ctx}: pricing mount missing data-ss-pricing-section attribute.`);
    if (pageKey !== expectedPageKey) {
      fatal(`${ctx}: pricing mount data-ss-pricing-page must be ${JSON.stringify(expectedPageKey)}; got ${JSON.stringify(pageKey)}`);
    }
    if (section === '1') found.section1 = true;
    else if (section === '2') found.section2 = true;
    else fatal(`${ctx}: pricing mount has invalid data-ss-pricing-section (expected "1" or "2"): ${JSON.stringify(section)}`);
  }

  if (!found.section1) fatal(`${ctx}: missing pricing mount with data-ss-pricing-section="1"`);
  if (!found.section2) fatal(`${ctx}: missing pricing mount with data-ss-pricing-section="2"`);

  // 3) Asset includes exist.
  // CSS link is expected in <head>, but we just check full HTML string.
  assertIncludes(html, `href="${prefix}assets/css/pricing-widget.css"`, ctx);
  assertIncludes(html, `src="${prefix}assets/js/pricing-widget.js"`, ctx);

  // Existing site JS must remain.
  assertIncludes(html, `src="${prefix}assets/js/app.js"`, ctx);

  // 4) Sanity check: hero shader canvas must remain (avoid accidental deletion).
  assertIncludes(html, 'id="hero-shader-canvas"', ctx);

  // 5) Ensure we didn't accidentally add more than two mounts anywhere.
  const globalMountCount = countOccurrences(html, 'data-ss-pricing-section="');
  if (globalMountCount !== 2) {
    fatal(`${ctx}: expected exactly 2 occurrences of data-ss-pricing-section, found ${globalMountCount}`);
  }
}

function main() {
  // Assets should exist once the widget is built.
  if (!fileExists('assets/js/pricing-widget.js')) {
    fatal('Missing built asset: assets/js/pricing-widget.js (expected after pricing widget build)');
  }
  if (!fileExists('assets/css/pricing-widget.css')) {
    fatal('Missing built asset: assets/css/pricing-widget.css (expected after pricing widget build)');
  }

  for (const page of TARGET_PAGES) validatePage(page);
  console.log('✅ Pricing mounts + assets validated for all target pages.');
}

main();
