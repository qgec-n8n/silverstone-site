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

const EXPECTED_SKUS = {
  services: [
    "PKG-REA-01",
    "PKG-HOS-01",
    "PKG-SAL-01",
    "PKG-TRD-01",
    "PKG-ECOM-01",
    "PKG-PHY-01",
    "PKG-DEN-01",
    "PKG-GYM-01",
    "PKG-INF-01",
  ],
  dentists: ["PKG-DEN-01", "PKG-DEN-02", "PKG-DEN-03", "PKG-DEN-04", "PKG-DEN-05"],
  ecommerce: ["PKG-ECOM-01", "PKG-ECOM-02", "PKG-ECOM-03", "PKG-ECOM-04", "PKG-ECOM-05"],
  "estate-agents": ["PKG-REA-01", "PKG-REA-02", "PKG-REA-03", "PKG-REA-04", "PKG-REA-05"],
  "fitness-coaches": ["PKG-INF-01", "PKG-INF-02", "PKG-INF-03", "PKG-INF-04", "PKG-INF-05"],
  "gyms-fitness-studios": ["PKG-GYM-01", "PKG-GYM-02", "PKG-GYM-03", "PKG-GYM-04", "PKG-GYM-05"],
  hospitality: ["PKG-HOS-01", "PKG-HOS-02", "PKG-HOS-03", "PKG-HOS-04", "PKG-HOS-05"],
  "physios-chiropractors": ["PKG-PHY-01", "PKG-PHY-02", "PKG-PHY-03", "PKG-PHY-04", "PKG-PHY-05"],
  "salons-barbers": ["PKG-SAL-01", "PKG-SAL-02", "PKG-SAL-03", "PKG-SAL-04", "PKG-SAL-05"],
  "trades-virtual-office": ["PKG-TRD-01", "PKG-TRD-02", "PKG-TRD-03", "PKG-TRD-04", "PKG-TRD-05"],
};

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

function toInt(value) {
  const n = Number(String(value || "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
}

function parseGeneratedData(filePath) {
  const raw = read(filePath);
  const match = raw.match(/PRICING_DATA[^=]*=\s*(\{[\s\S]*\})\s*as const/);
  if (!match) throw new Error("Unable to parse PRICING_DATA object from generated TS.");
  const jsonStr = match[1];
  return JSON.parse(jsonStr);
}

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      const nextIsQuote = line[i + 1] === '"';
      if (inQuotes && nextIsQuote) {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }

  cells.push(current.trim());
  return cells;
}

function parseCsv(filePath) {
  const raw = read(filePath).trim();
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const header = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
    const obj = {};
    header.forEach((h, idx) => {
      obj[h] = cols[idx] ?? "";
    });
    return obj;
  });
  const map = {};
  rows.forEach((r) => {
    map[r.SKU] = {
      setup: toInt(r.Setup_Fee_GBP),
      monthly: toInt(r.Monthly_Retainer_GBP),
      name: r.Sales_Name_External,
    };
  });
  return map;
}

function validateDataIntegrity(genDataPath, csvPath) {
  const data = parseGeneratedData(genDataPath);
  const csvMap = parseCsv(csvPath);

  const requiredKeys = Object.keys(EXPECTED_SKUS);
  requiredKeys.forEach((key) => {
    const plans = data.pages[key];
    if (!Array.isArray(plans)) {
      fail(`Generated data missing page key "${key}"`);
      return;
    }
    const expectedSkus = EXPECTED_SKUS[key];
    if (plans.length !== expectedSkus.length) {
      fail(`Page "${key}" expected ${expectedSkus.length} plans, found ${plans.length}`);
    }
    expectedSkus.forEach((sku) => {
      const plan = plans.find((p) => p.sku === sku);
      if (!plan) {
        fail(`Page "${key}" missing SKU ${sku} in generated data`);
        return;
      }
      const csv = csvMap[sku];
      if (!csv) {
        fail(`CSV missing SKU referenced in data: ${sku}`);
        return;
      }
      if (plan.planName !== csv.name) {
        fail(`Plan name mismatch for ${sku}: data="${plan.planName}" csv="${csv.name}"`);
      }
      if (plan.setupFee !== csv.setup) {
        fail(`Setup fee mismatch for ${sku}: data=${plan.setupFee} csv=${csv.setup}`);
      }
      if (plan.monthlyRetainer !== csv.monthly) {
        fail(`Monthly retainer mismatch for ${sku}: data=${plan.monthlyRetainer} csv=${csv.monthly}`);
      }
    });
  });

  if (process.exitCode !== 1) {
    ok("Generated pricing data matches CSV SKUs and prices");
  }
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
      const csvPath = path.join(repoRoot, "Silverstone_Service_Master_List.csv");
      if (fs.existsSync(csvPath)) {
        try {
          validateDataIntegrity(genData, csvPath);
        } catch (err) {
          fail(`Data integrity validation error: ${err.message}`);
        }
      } else {
        fail("Missing Silverstone_Service_Master_List.csv for data validation");
      }
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
