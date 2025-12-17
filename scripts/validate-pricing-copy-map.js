// FILE: scripts/validate-pricing-copy-map.js
/**
 * Validate PRICING_COPY_MAP.md structure and completeness.
 *
 * Usage:
 *   node scripts/validate-pricing-copy-map.js
 */

const path = require("path");
const {
  readPricingCopyMap,
  extractPageIds,
  parsePricingCopyMap,
  validateParsedCopy,
  REQUIRED_PAGE_IDS,
} = require("./_pricing-copy-map");

const REPO_ROOT = path.join(__dirname, "..");

function main() {
  const md = readPricingCopyMap(REPO_ROOT);
  const pageIds = extractPageIds(md);

  // Expected pages are the copy-map pages that are present in the repo (gate against drift).
  // For this repo, we also require that every current niche page and services page have a block.
  const required = new Set(REQUIRED_PAGE_IDS);

  const missingFromMd = [...required].filter((p) => !pageIds.includes(p));
  if (missingFromMd.length) {
    console.error("❌ PRICING_COPY_MAP.md is missing required page headings:");
    for (const p of missingFromMd) console.error(`  - ${p}`);
    process.exit(1);
  }

  const pages = parsePricingCopyMap(md);
  const errors = validateParsedCopy(pages, [...required]);

  if (errors.length) {
    console.error(`❌ Pricing copy map validation failed with ${errors.length} error(s):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  // Summary output (useful for CI logs)
  console.log("✅ PRICING_COPY_MAP.md validated successfully.");
  console.log(`   Pages: ${[...required].length}`);
  for (const pid of [...required]) {
    const p = pages[pid];
    const setup = p.row1.plans.map((x) => x.setupFee).join(", ");
    const monthly = p.row1.plans.map((x) => x.monthlyRetainer).join(", ");
    console.log(`   - ${pid}: Row1 setup=[${setup}] monthly=[${monthly}] Row2 cards=${p.row2.cards.length}`);
  }
}

main();
