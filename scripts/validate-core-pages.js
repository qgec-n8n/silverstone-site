// FILE: scripts/validate-core-pages.js
/**
 * Validates hero shader variant wiring (core pages + niche pages).
 * This enforces Requested Edit #1 page-to-color mapping and prevents accidental drift.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const CORE_VARIANTS = [
  { file: "index.html", expected: "blue", allowMissing: false },
  { file: "services.html", expected: "green", allowMissing: false },
  // about: purple => default theme; allow missing or explicit "default"
  { file: "about.html", expected: "default", allowMissing: true },
  { file: "book.html", expected: "pink", allowMissing: false },
  { file: "contact.html", expected: "orange", allowMissing: false },
];

function fail(msg) {
  console.error(`[validate-core-pages] ❌ ${msg}`);
  process.exit(1);
}

function readText(relPath) {
  const p = path.join(ROOT, relPath);
  if (!fs.existsSync(p)) fail(`Missing expected file: ${relPath}`);
  return fs.readFileSync(p, "utf8");
}

function extractCanvasTag(html) {
  const re = /<canvas\b[^>]*\bid=["']hero-shader-canvas["'][^>]*>/i;
  const m = html.match(re);
  return m ? m[0] : null;
}

function extractDataVariant(canvasTag) {
  if (!canvasTag) return null;
  const m = canvasTag.match(/\bdata-variant=["']([^"']+)["']/i);
  return m ? m[1].trim() : null;
}

function listNicheHtmlFiles() {
  const nichesDir = path.join(ROOT, "niches");
  if (!fs.existsSync(nichesDir)) return [];
  return fs
    .readdirSync(nichesDir)
    .filter((f) => f.toLowerCase().endsWith(".html"))
    .map((f) => path.join("niches", f));
}

function assertVariantMapping() {
  for (const { file, expected, allowMissing } of CORE_VARIANTS) {
    const html = readText(file);
    const canvasTag = extractCanvasTag(html);
    if (!canvasTag) fail(`${file}: missing <canvas id="hero-shader-canvas">`);
    const variant = extractDataVariant(canvasTag);

    if (expected === "default") {
      // Purple default theme: either missing, or explicitly "default".
      if (variant === null) continue;
      if (variant.toLowerCase() === "default") continue;
      fail(
        `${file}: expected no data-variant (or data-variant="default") for purple default theme, but found "${variant}".`
      );
      continue;
    }

    if (variant === null) {
      if (allowMissing) continue;
      fail(`${file}: expected data-variant="${expected}" but attribute was missing.`);
    }
    if (variant.toLowerCase() !== expected.toLowerCase()) {
      fail(`${file}: expected data-variant="${expected}" but found "${variant}".`);
    }
  }

  // Niche pages should stay on default/purple (no data-variant) unless explicitly required.
  const nicheFiles = listNicheHtmlFiles();
  for (const file of nicheFiles) {
    const html = readText(file);
    const canvasTag = extractCanvasTag(html);
    if (!canvasTag) fail(`${file}: missing <canvas id="hero-shader-canvas">`);
    const variant = extractDataVariant(canvasTag);
    if (variant !== null) {
      fail(`${file}: niche pages must not set data-variant. Found data-variant="${variant}".`);
    }
  }
}

function parseThemeLineColor(jsText, themeName) {
  // Very tolerant extraction: themeName: { ... line: [r,g,b]
  const re = new RegExp(
    `${themeName}\\s*:\\s*\\{[\\s\\S]*?\\bline\\s*:\\s*\\[([^\\]]+)\\]`,
    "m"
  );
  const m = jsText.match(re);
  if (!m) return null;

  const parts = m[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (parts.length !== 3) return null;
  const nums = parts.map((x) => Number(x));
  if (nums.some((n) => Number.isNaN(n))) return null;
  return nums;
}

function assertThemesExistAndLookRight() {
  const jsText = readText("src/js/hero-shader.js");

  const requiredThemes = ["default", "blue", "green", "pink", "orange"];
  for (const t of requiredThemes) {
    // Key presence check (basic)
    const keyRe = new RegExp(`\\b${t}\\s*:`, "m");
    if (!keyRe.test(jsText)) {
      fail(`src/js/hero-shader.js: missing theme key "${t}".`);
    }
  }

  // Heuristic color checks for new requested hues (avoid exact numeric coupling)
  const green = parseThemeLineColor(jsText, "green");
  const pink = parseThemeLineColor(jsText, "pink");
  const orange = parseThemeLineColor(jsText, "orange");

  if (!green || !pink || !orange) {
    fail(
      "src/js/hero-shader.js: could not parse one or more theme line colors (green/pink/orange). Keep themes as simple object literals."
    );
  }

  // green: G highest and high
  if (!(green[1] >= 0.7 && green[1] >= green[0] && green[1] >= green[2])) {
    fail(`Theme "green" line color does not look green-ish (parsed [${green.join(", ")}]).`);
  }

  // pink: R & B high, G low
  if (!(pink[0] >= 0.8 && pink[2] >= 0.8 && pink[1] <= 0.25)) {
    fail(`Theme "pink" line color does not look neon-pink-ish (parsed [${pink.join(", ")}]).`);
  }

  // orange: R high, G medium, B low
  if (!(orange[0] >= 0.8 && orange[1] >= 0.25 && orange[2] <= 0.25)) {
    fail(`Theme "orange" line color does not look fire-orange-ish (parsed [${orange.join(", ")}]).`);
  }
}

function main() {
  assertVariantMapping();
  assertThemesExistAndLookRight();
  console.log("[validate-core-pages] ✅ Core + niche shader variants look correct.");
}

main();
