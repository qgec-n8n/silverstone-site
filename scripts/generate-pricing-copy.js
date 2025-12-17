// FILE: scripts/generate-pricing-copy.js
/**
 * Generate a typed TS module from PRICING_COPY_MAP.md for the pricing widget.
 *
 * Usage:
 *   node scripts/generate-pricing-copy.js
 */

const fs = require("fs");
const path = require("path");
const {
  readPricingCopyMap,
  parsePricingCopyMap,
  validateParsedCopy,
  REQUIRED_PAGE_IDS,
} = require("./_pricing-copy-map");

const REPO_ROOT = path.join(__dirname, "..");
const OUTPUT_PATH = path.join(REPO_ROOT, "pricing-widget", "src", "data", "pricing-copy.ts");

function toTypeScript(pages) {
  const pageIdUnion = REQUIRED_PAGE_IDS.map((pid) => `'${pid}'`).join(" | ");
  const pricingCopyJson = JSON.stringify(pages, null, 2);
  const pageIdsArray = JSON.stringify(REQUIRED_PAGE_IDS, null, 2);

  return `// AUTO-GENERATED FILE. DO NOT EDIT.
// Source: PRICING_COPY_MAP.md

export type PricingPageId = ${pageIdUnion};

export interface Row1Plan {
  name: string;
  badge?: string;
  setupFee: number;
  monthlyRetainer: number;
  bestFor: string;
  includes: string[];
}

export interface Row2Card {
  label: string;
  plansIncluded: string[];
  oneLiner: string;
}

export interface Row1 {
  title: string;
  subtitle: string;
  plans: Row1Plan[];
}

export interface Row2 {
  title: string;
  subtitle: string;
  cards: Row2Card[];
}

export interface PricingPageCopy {
  pageId: PricingPageId;
  row1: Row1;
  row2: Row2;
}

export type PricingCopyMap = Record<PricingPageId, PricingPageCopy>;

export const pricingCopy = ${pricingCopyJson} satisfies PricingCopyMap;

export const pricingPageIds = ${pageIdsArray} as const;
`;
}

function main() {
  const markdown = readPricingCopyMap(REPO_ROOT);
  const parsed = parsePricingCopyMap(markdown);
  const errors = validateParsedCopy(parsed, REQUIRED_PAGE_IDS);

  if (errors.length) {
    console.error(`❌ Failed to generate pricing copy: ${errors.length} error(s)`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  const ordered = {};
  for (const pid of REQUIRED_PAGE_IDS) {
    ordered[pid] = parsed[pid];
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, toTypeScript(ordered), "utf8");

  console.log(`✅ Generated pricing copy module: ${path.relative(REPO_ROOT, OUTPUT_PATH)}`);
}

main();
