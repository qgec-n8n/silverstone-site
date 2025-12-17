// FILE: scripts/validate-pricing-mounts.js
/**
 * Validate that pricing mounts + pricing widget assets are correctly embedded on all target pages,
 * and that hero shader DOM invariants still exist.
 *
 * Usage:
 *   node scripts/validate-pricing-mounts.js
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.join(__dirname, "..");

const TARGET_PAGES = [
  "services.html",
  "niches/dentists.html",
  "niches/ecommerce.html",
  "niches/estate-agents.html",
  "niches/fitness-coaches.html",
  "niches/gyms-fitness-studios.html",
  "niches/hospitality.html",
  "niches/physios-chiropractors.html",
  "niches/salons-barbers.html",
  "niches/trades-virtual-office.html",
];

const PLACEHOLDER_TEXT = "Transparent pricing tables will appear here soon";

function readFile(relPath) {
  const p = path.join(REPO_ROOT, relPath);
  return fs.readFileSync(p, "utf8");
}

function exists(relPath) {
  return fs.existsSync(path.join(REPO_ROOT, relPath));
}

function sectionBlock(html, id) {
  const re = new RegExp(`<section[^>]*\\bid=["']${id}["'][\\s\\S]*?<\\/section>`, "i");
  const m = html.match(re);
  return m ? m[0] : null;
}

function main() {
  /** @type {string[]} */
  const errors = [];

  // Asset existence checks (post-build)
  const cssAsset = "assets/css/pricing-widget.css";
  const jsAsset = "assets/js/pricing-widget.js";
  if (!exists(cssAsset)) errors.push(`Missing build asset: ${cssAsset}`);
  if (!exists(jsAsset)) errors.push(`Missing build asset: ${jsAsset}`);

  for (const page of TARGET_PAGES) {
    const filePath = path.join(REPO_ROOT, page);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing target HTML file: ${page}`);
      continue;
    }

    const html = readFile(page);

    // Hero shader invariants
    if (!/id=["']hero-shader-canvas["']/.test(html)) {
      errors.push(`[${page}] Missing hero shader canvas id="hero-shader-canvas"`);
    }
    if (!/class=["'][^"']*hero[^"']*title-band[^"']*["']/.test(html)) {
      errors.push(`[${page}] Missing hero title-band (class contains "hero" and "title-band")`);
    }
    if (!/class=["'][^"']*title-wrap[^"']*["']/.test(html)) {
      errors.push(`[${page}] Missing .title-wrap element (required by shader sizing)`);
    }

    // Existing site JS bundle should remain referenced
    if (!/assets\/js\/app\.js/.test(html)) {
      errors.push(`[${page}] Missing script reference to assets/js/app.js`);
    }

    // Pricing placeholder must be removed
    if (html.includes(PLACEHOLDER_TEXT)) {
      errors.push(`[${page}] Still contains placeholder pricing text`);
    }

    // Pricing section must contain mount
    const pricingSection = sectionBlock(html, "pricing");
    if (!pricingSection) {
      errors.push(`[${page}] Missing <section id="pricing">`);
    } else {
      const expectedAttr = `data-ss-pricing-page="${page}"`;
      if (!pricingSection.includes(expectedAttr)) {
        errors.push(`[${page}] Pricing section missing mount attribute ${expectedAttr}`);
      }
      if (!/class=["'][^"']*\bss-pricing\b[^"']*["']/.test(pricingSection)) {
        errors.push(`[${page}] Pricing section missing mount element with class "ss-pricing"`);
      }
    }

    // Pricing widget assets must be referenced in HTML
    if (!new RegExp(`assets\\/css\\/pricing-widget\\.css`).test(html)) {
      errors.push(`[${page}] Missing link reference to assets/css/pricing-widget.css`);
    }
    if (!new RegExp(`assets\\/js\\/pricing-widget\\.js`).test(html)) {
      errors.push(`[${page}] Missing script reference to assets/js/pricing-widget.js`);
    }
  }

  if (errors.length) {
    console.error(`❌ Pricing mounts/assets validation failed with ${errors.length} error(s):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  console.log("✅ Pricing mounts/assets + hero shader invariants validated successfully.");
}

main();
