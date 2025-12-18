// FILE: scripts/validate-core-pages.js

/**
 * Validates hero shader variants:
 * - Core pages must use data-variant="blue"
 * - Niche pages must be purple via default (no data-variant) or data-variant="default"
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const CORE_BLUE_PAGES = [
  "index.html",
  "about.html",
  "services.html",
  "book.html",
  "contact.html",
];

function readText(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Missing file: ${relPath}`);
  }
  return fs.readFileSync(abs, "utf8");
}

function extractHeroCanvasTag(html, fileLabel) {
  const m = html.match(/<canvas\b[^>]*\bid=["']hero-shader-canvas["'][^>]*>/i);
  if (!m) {
    throw new Error(`Could not find <canvas id="hero-shader-canvas"> in ${fileLabel}`);
  }
  return m[0];
}

function extractDataVariant(canvasTag) {
  const m = canvasTag.match(/\bdata-variant=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`✅ ${msg}`);
}

function main() {
  // Core pages => blue
  for (const page of CORE_BLUE_PAGES) {
    try {
      const html = readText(page);
      const tag = extractHeroCanvasTag(html, page);
      const v = extractDataVariant(tag);
      if (v !== "blue") {
        fail(`${page}: expected data-variant="blue" on #hero-shader-canvas, got ${v === null ? "no data-variant" : JSON.stringify(v)}`);
      } else {
        ok(`${page}: hero shader variant is blue`);
      }
    } catch (err) {
      fail(String(err.message || err));
    }
  }

  // Niche pages => default (purple)
  const nichesDir = path.join(ROOT, "niches");
  if (!fs.existsSync(nichesDir) || !fs.statSync(nichesDir).isDirectory()) {
    fail(`Missing niches/ directory`);
  } else {
    const nichePages = fs
      .readdirSync(nichesDir)
      .filter((f) => f.toLowerCase().endsWith(".html"))
      .sort();

    if (nichePages.length === 0) {
      fail(`No niche pages found under niches/*.html`);
    }

    for (const file of nichePages) {
      const rel = path.join("niches", file);
      try {
        const html = readText(rel);
        const tag = extractHeroCanvasTag(html, rel);
        const v = extractDataVariant(tag);
        const isPurpleByDefault = v === null || v === "default";
        if (!isPurpleByDefault) {
          fail(`${rel}: expected no data-variant or data-variant="default" on #hero-shader-canvas (purple default), got ${JSON.stringify(v)}`);
        } else {
          ok(`${rel}: hero shader variant is purple (default)`);
        }
      } catch (err) {
        fail(String(err.message || err));
      }
    }
  }

  if (process.exitCode) {
    console.error("\nHero shader variant validation FAILED.");
    process.exit(1);
  } else {
    console.log("\nHero shader variant validation PASSED.");
  }
}

main();
