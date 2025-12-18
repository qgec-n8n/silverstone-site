// FILE: scripts/validate-niche-pages.js

/**
 * Validates niche pages against the A–H requirements that touch niches:
 * - Niche pages use purple hero shader (default): no data-variant or data-variant="default" (A1)
 * - Niche service images (.service-img) are not lazy-loaded (A3)
 * - Spacing reduction: compact-section count is 8 per niche page (E)
 * - Mobile niche background parity: remove the old book-hero background override (B)
 * - Overlay opacity: mobile overlay is no longer the old hard-coded 0.6 value (A4)
 * - compact-section padding reduced from its old value (E)
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const NICHES_DIR = path.join(ROOT, "niches");

const ESTATE_AGENTS_CSS = path.join(ROOT, "src", "css", "pages", "estate-agents.css");
const LAYOUT_CSS = path.join(ROOT, "src", "css", "base", "layout.css");

function fail(msg) {
  console.error(`❌ [validate-niche-pages] ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`✅ [validate-niche-pages] ${msg}`);
}

function readText(abs) {
  return fs.readFileSync(abs, "utf8");
}

function extractHeroCanvasVariant(html) {
  const m = html.match(/<canvas\b[^>]*\bid=["']hero-shader-canvas["'][^>]*>/i);
  if (!m) return null;
  const tag = m[0];
  const v = tag.match(/\bdata-variant=["']([^"']+)["']/i);
  return v ? v[1] : null;
}

function bodyHasClass(html, className) {
  const re = new RegExp(`<body[^>]*class=(['"])[^\\1]*\\b${className}\\b[^\\1]*\\1`, "i");
  return re.test(html);
}

function countOccurrences(haystack, needle) {
  let count = 0;
  let idx = 0;
  while (true) {
    const next = haystack.indexOf(needle, idx);
    if (next === -1) break;
    count++;
    idx = next + needle.length;
  }
  return count;
}

function hasLazyServiceImg(html) {
  // Find <img ... class="...service-img..." ... loading="lazy" ...>
  const imgRe = /<img\b[^>]*>/gi;
  let m;
  while ((m = imgRe.exec(html)) !== null) {
    const tag = m[0];
    const classMatch = tag.match(/\bclass\s*=\s*"([^"]*)"/i);
    if (!classMatch) continue;
    const classes = classMatch[1];
    if (!/\bservice-img\b/.test(classes)) continue;

    const loadingMatch = tag.match(/\bloading\s*=\s*"([^"]*)"/i);
    const loading = loadingMatch ? loadingMatch[1].toLowerCase() : null;
    if (loading === "lazy") return true;
  }
  return false;
}

function validateCompactSectionPaddingReduced() {
  if (!fs.existsSync(ESTATE_AGENTS_CSS)) {
    fail(`Missing CSS file: src/css/pages/estate-agents.css`);
    return;
  }

  const css = readText(ESTATE_AGENTS_CSS);

  // Ensure we removed the old mobile niche body background override (book hero).
  if (/book-hero-calendly-mobile-2025/i.test(css)) {
    fail(`src/css/pages/estate-agents.css still references "book-hero-calendly-mobile-2025" (mobile niche background must match established pattern)`);
  } else {
    ok(`estate-agents.css does not reference book-hero-calendly-mobile-2025`);
  }

  // Ensure compact-section padding was reduced from the old 3rem value.
  const blockMatch = css.match(/\.section\.compact-section\s*\{([\s\S]*?)\}/m);
  if (!blockMatch) {
    fail(`Could not find ".section.compact-section { ... }" rule in estate-agents.css (required for spacing control)`);
    return;
  }

  const block = blockMatch[1];
  const padTop = (block.match(/padding-top\s*:\s*([^;]+);/i) || [])[1] || null;
  const padBottom = (block.match(/padding-bottom\s*:\s*([^;]+);/i) || [])[1] || null;

  if (!padTop || !padBottom) {
    fail(`.section.compact-section rule is missing padding-top or padding-bottom`);
    return;
  }

  const topNorm = padTop.replace(/\s+/g, " ").trim();
  const bottomNorm = padBottom.replace(/\s+/g, " ").trim();

  if (topNorm === "3rem" && bottomNorm === "3rem") {
    fail(`.section.compact-section padding still set to 3rem/3rem; spacing reduction requires a smaller value`);
  } else {
    ok(`.section.compact-section padding appears reduced (top: ${topNorm}, bottom: ${bottomNorm})`);
  }
}

function validateOverlayOpacityUpdated() {
  if (!fs.existsSync(LAYOUT_CSS)) {
    fail(`Missing CSS file: src/css/base/layout.css`);
    return;
  }
  const css = readText(LAYOUT_CSS);

  // The old overlay used rgba(..., 0.6). We expect a slightly lower value after A4.
  if (css.includes("rgba(0, 0, 0, 0.6)") || css.includes("rgba(0,0,0,0.6)")) {
    fail(`src/css/base/layout.css still uses the old mobile overlay opacity 0.6; A4 requires slightly less opacity`);
  } else {
    ok(`layout.css does not contain the old 0.6 overlay value`);
  }
}

function main() {
  if (!fs.existsSync(NICHES_DIR) || !fs.statSync(NICHES_DIR).isDirectory()) {
    console.error(`Missing niches/ directory`);
    process.exit(1);
  }

  const nicheFiles = fs
    .readdirSync(NICHES_DIR)
    .filter((f) => f.toLowerCase().endsWith(".html"))
    .sort();

  if (!nicheFiles.length) {
    console.error(`No niche pages found under niches/*.html`);
    process.exit(1);
  }

  for (const file of nicheFiles) {
    const rel = path.join("niches", file);
    const abs = path.join(ROOT, rel);
    const html = readText(abs);

    // Body class
    if (!bodyHasClass(html, "page-niche")) {
      fail(`${rel}: body class missing "page-niche"`);
    }

    // Hero shader variant should be purple default.
    const variant = extractHeroCanvasVariant(html);
    const okVariant = variant === null || variant === "default";
    if (!okVariant) {
      fail(`${rel}: expected no data-variant or data-variant="default" on #hero-shader-canvas (purple default), got ${JSON.stringify(variant)}`);
    }

    // A3: service images not lazy.
    if (hasLazyServiceImg(html)) {
      fail(`${rel}: found .service-img with loading="lazy" (must be eager/not lazy)`);
    } else {
      ok(`${rel}: no lazy-loaded .service-img images`);
    }

    // E: compact-section count should be 8 after adding to sections 2,3,5.
    const compactCount = countOccurrences(html, "compact-section");
    if (compactCount !== 8) {
      fail(`${rel}: expected 8 occurrences of "compact-section" after spacing changes; found ${compactCount}`);
    } else {
      ok(`${rel}: compact-section count is 8`);
    }
  }

  // Cross-cutting CSS validations for B, A4, E.
  validateCompactSectionPaddingReduced();
  validateOverlayOpacityUpdated();

  if (process.exitCode) {
    console.error("\nNiche validation FAILED.");
    process.exit(1);
  } else {
    console.log("\nNiche validation PASSED.");
  }
}

main();
