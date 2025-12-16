# FILE: scripts/validate-pricing-embeds.js
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const STRICT = process.argv.includes("--strict");

const TARGETS = [
  { file: "services.html", key: "services" },
  { file: "niches/dentists.html", key: "dentists" },
  { file: "niches/ecommerce.html", key: "ecommerce" },
  { file: "niches/estate-agents.html", key: "estate-agents" },
  { file: "niches/fitness-coaches.html", key: "fitness-coaches" },
  { file: "niches/gyms-fitness-studios.html", key: "gyms-fitness-studios" },
  { file: "niches/hospitality.html", key: "hospitality" },
  { file: "niches/physios-chiropractors.html", key: "physios-chiropractors" },
  { file: "niches/salons-barbers.html", key: "salons-barbers" },
  { file: "niches/trades-virtual-office.html", key: "trades-virtual-office" },
];

function fail(msg) {
  console.error(`[pricing-validate] FAIL: ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`[pricing-validate] OK: ${msg}`);
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
}

function main() {
  const repoRoot = path.resolve(__dirname, "..");

  const placeholderPrefix = "Transparent pricing tables will appear here soon.";
  const startMarker = "<!-- SS:PRICING:START -->";
  const endMarker = "<!-- SS:PRICING:END -->";

  for (const t of TARGETS) {
    const abs = path.join(repoRoot, t.file);
    if (!fs.existsSync(abs)) {
      fail(`Missing target file: ${t.file}`);
      continue;
    }
    const html = read(abs);

    if (html.includes(placeholderPrefix)) {
      fail(`${t.file} still contains placeholder prefix: "${placeholderPrefix}"`);
    } else {
      ok(`${t.file} placeholder prefix removed`);
    }

    const startCount = countOccurrences(html, startMarker);
    const endCount = countOccurrences(html, endMarker);

    if (startCount !== 1 || endCount !== 1) {
      fail(`${t.file} must contain exactly one pricing marker block (found start=${startCount}, end=${endCount})`);
    } else {
      ok(`${t.file} contains pricing marker block exactly once`);
    }

    const expectedAttr = `data-ss-pricing-key="${t.key}"`;
    if (!html.includes(expectedAttr)) {
      fail(`${t.file} missing expected ${expectedAttr}`);
    } else {
      ok(`${t.file} has correct data-ss-pricing-key`);
    }

    // Ensure the Pricing section title remains present (defensive check)
    const titleNeedle = '<h2 class="section-title">Pricing</h2>';
    if (!html.includes(titleNeedle)) {
      fail(`${t.file} missing Pricing section title (should remain unchanged): ${titleNeedle}`);
    }
  }

  const bundle = path.join(repoRoot, "assets", "js", "ss-pricing-widget.iife.js");
  if (STRICT) {
    if (!fs.existsSync(bundle)) {
      fail(`Missing built widget bundle: assets/js/ss-pricing-widget.iife.js (run node scripts/build-pricing-widget.js)`);
    } else {
      ok("Widget bundle exists: assets/js/ss-pricing-widget.iife.js");
    }

    const genData = path.join(repoRoot, "src", "widgets", "pricing", "generated", "pricing-data.generated.ts");
    if (!fs.existsSync(genData)) {
      fail(`Missing generated pricing data: ${path.relative(repoRoot, genData)} (run node scripts/generate-pricing-data.js)`);
    } else {
      ok("Generated pricing data exists");
    }
  }

  if (process.exitCode === 1) {
    console.error("[pricing-validate] One or more checks failed.");
    process.exit(1);
  } else {
    console.log("[pricing-validate] PASS");
  }
}

if (require.main === module) {
  main();
}
