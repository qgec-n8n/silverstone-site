# FILE: scripts/generate-pricing-data.js
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

function readCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error("CSV appears empty or missing header row.");

  const header = lines[0].split(",").map((s) => s.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    // Minimal CSV parse: this repo's pricing CSV is simple (no embedded commas in fields).
    const cols = lines[i].split(",").map((s) => s.trim());
    const row = {};
    header.forEach((h, idx) => (row[h] = cols[idx] ?? ""));
    rows.push(row);
  }
  return rows;
}

function toInt(x) {
  const n = Number(String(x).replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

function splitDeliverables(s) {
  const raw = String(s || "").trim();
  if (!raw) return [];
  const semi = raw.split(";").map((t) => t.trim()).filter(Boolean);
  if (semi.length >= 2) return semi.slice(0, 4);
  const dot = raw.split(".").map((t) => t.trim()).filter(Boolean);
  if (dot.length >= 2) return dot.slice(0, 4);
  return [raw];
}

function buildFeatures(deliverables, setupFee) {
  const features = [];
  if (Number.isFinite(setupFee)) features.push(`One-off setup: £${setupFee}`);
  splitDeliverables(deliverables).forEach((d) => features.push(d));
  return features.slice(0, 5);
}

function main() {
  const repoRoot = path.resolve(__dirname, "..");
  const csvPath = path.join(repoRoot, "Silverstone_Service_Master_List.csv");
  if (!fs.existsSync(csvPath)) throw new Error(`Missing CSV at ${csvPath}`);

  const rows = readCsv(csvPath);

  // Required columns
  const requiredCols = [
    "SKU",
    "Is_Bundle",
    "Niche",
    "Sales_Name_External",
    "Deliverables_List",
    "Setup_Fee_GBP",
    "Monthly_Retainer_GBP",
  ];
  for (const col of requiredCols) {
    if (!Object.prototype.hasOwnProperty.call(rows[0], col)) {
      throw new Error(`CSV missing required column: ${col}`);
    }
  }

  const bundles = rows.filter((r) => String(r.Is_Bundle).toLowerCase() === "true");

  const pageKeyByFileStem = {
    "services": "services",
    "estate-agents": "estate-agents",
    "hospitality": "hospitality",
    "salons-barbers": "salons-barbers",
    "trades-virtual-office": "trades-virtual-office",
    "ecommerce": "ecommerce",
    "physios-chiropractors": "physios-chiropractors",
    "dentists": "dentists",
    "gyms-fitness-studios": "gyms-fitness-studios",
    "fitness-coaches": "fitness-coaches",
  };

  const nicheByPageKey = {
    "estate-agents": "Real Estate",
    "hospitality": "Hospitality",
    "salons-barbers": "Salons",
    "trades-virtual-office": "Trades",
    "ecommerce": "eCommerce",
    "physios-chiropractors": "Physios/Chiropractors",
    "dentists": "Dentists",
    "gyms-fitness-studios": "Gym Owners",
    "fitness-coaches": "Fitness Influencers/Online Coaches",
  };

  // Order for services overview (matches site nav order)
  const servicesNicheOrder = [
    "Real Estate",
    "Hospitality",
    "Salons",
    "Trades",
    "eCommerce",
    "Physios/Chiropractors",
    "Dentists",
    "Gym Owners",
    "Fitness Influencers/Online Coaches",
  ];

  function planFromRow(r, isPopular) {
    const setup = toInt(r.Setup_Fee_GBP);
    const monthly = toInt(r.Monthly_Retainer_GBP);
    if (!Number.isFinite(monthly)) throw new Error(`Bad monthly retainer for SKU ${r.SKU}`);

    return {
      sku: r.SKU,
      planName: r.Sales_Name_External,
      description: String(r.Deliverables_List || "").trim(),
      price: String(monthly),
      features: buildFeatures(r.Deliverables_List, setup),
      buttonText: "Book free audit",
      isPopular: Boolean(isPopular),
      buttonVariant: isPopular ? "primary" : "secondary",
    };
  }

  // Build services plans: starter bundles (*-01) for each niche
  const servicesPlans = [];
  for (const niche of servicesNicheOrder) {
    const starter = bundles.find((r) => r.Niche === niche && String(r.SKU).endsWith("-01"));
    if (!starter) throw new Error(`Missing starter (-01) bundle for niche: ${niche}`);
    servicesPlans.push(planFromRow(starter, false));
  }

  // Build niche plans: 5 bundles per niche; mark *-03 as popular when present
  const pagePlans = {};
  for (const [pageKey, niche] of Object.entries(nicheByPageKey)) {
    const set = bundles.filter((r) => r.Niche === niche).sort((a, b) => String(a.SKU).localeCompare(String(b.SKU)));
    if (set.length !== 5) throw new Error(`Expected 5 bundles for niche ${niche}; got ${set.length}`);
    pagePlans[pageKey] = set.map((r) => planFromRow(r, String(r.SKU).endsWith("-03")));
  }

  const out = {
    generatedAt: new Date().toISOString(),
    pages: {
      services: servicesPlans,
      ...pagePlans,
    },
    pageKeyByFileStem,
  };

  const outDir = path.join(repoRoot, "src", "widgets", "pricing", "generated");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "pricing-data.generated.ts");

  const content =
`/* AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
   Generated by: node scripts/generate-pricing-data.js
*/
export type PricingPlan = {
  sku: string;
  planName: string;
  description: string;
  price: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  buttonVariant?: "primary" | "secondary";
};

export type PricingData = {
  generatedAt: string;
  pages: Record<string, PricingPlan[]>;
  pageKeyByFileStem: Record<string, string>;
};

export const PRICING_DATA: PricingData = ${JSON.stringify(out, null, 2)} as const;
`;

  fs.writeFileSync(outFile, content, "utf8");
  console.log(`[pricing-data] Wrote ${path.relative(repoRoot, outFile)}`);
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error("[pricing-data] ERROR:", err.message);
    process.exit(1);
  }
}
