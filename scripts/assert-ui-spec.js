// FILE: scripts/assert-ui-spec.js
/**
 * Asserts that required SPEC markers exist somewhere in the tracked source files.
 * These markers act as "proof anchors" that the intended edits were implemented
 * and make downstream validation more deterministic.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const REQUIRED_MARKERS = [
  // Edit 1
  "SPEC: SHADER_COLORS_PER_PAGE_2025_12",

  // Edit 2
  "SPEC: HERO_NO_GLASS_PANEL_2025_12",

  // Edit 3
  "SPEC: INDEX_STREAMLINE_WORKFLOWS_NOWRAP_2025_12",

  // Edit 4
  "SPEC: SECTION_SUBTITLES_GREY_GLOBAL_2025_12",

  // Edit 5
  "SPEC: SERVICES_NICHES_IMAGES_FILL_CARD_NO_HEIGHT_CROP_2025_12",

  // Edit 6
  "SPEC: ABOUT_IMAGES_COPY_VISIBLE_NO_CROP_2025_12",
];

const EXCLUDE_DIRS = new Set([
  "node_modules",
  ".git",
  ".agent",
  "dist",
  "pricing-widget",
  "niche_copy_templates",
]);

const ALLOWED_EXT = new Set([".css", ".js", ".html", ".md", ".toml", ".sh"]);

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) {
      if (EXCLUDE_DIRS.has(e.name)) continue;
      walk(path.join(dir, e.name), out);
      continue;
    }
    const ext = path.extname(e.name);
    if (!ALLOWED_EXT.has(ext)) continue;
    out.push(path.join(dir, e.name));
  }
  return out;
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function main() {
  const files = walk(ROOT);
  const found = new Map(); // marker -> filePath

  for (const file of files) {
    const txt = readText(file);
    for (const marker of REQUIRED_MARKERS) {
      if (!found.has(marker) && txt.includes(marker)) {
        found.set(marker, file);
      }
    }
    if (found.size === REQUIRED_MARKERS.length) break;
  }

  const missing = REQUIRED_MARKERS.filter((m) => !found.has(m));
  if (missing.length) {
    console.error("[assert-ui-spec] ❌ Missing required SPEC markers:");
    for (const m of missing) console.error(`  - ${m}`);
    console.error(
      "\nAdd these markers near the final implementation points as described in codex/REQUESTED_EDITS_SPEC.md."
    );
    process.exit(1);
  }

  console.log("[assert-ui-spec] ✅ All required SPEC markers found:");
  for (const marker of REQUIRED_MARKERS) {
    console.log(`  - ${marker} (found in ${path.relative(ROOT, found.get(marker))})`);
  }
}

main();
