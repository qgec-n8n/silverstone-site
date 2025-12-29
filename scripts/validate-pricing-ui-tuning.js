// FILE: scripts/validate-pricing-ui-tuning.js
/**
 * Validate pricing-widget light-mode background tuning.
 *
 * Why:
 * - Requested Edit #1 requires more visible pink/blue tint in the light/white pricing background.
 * - We enforce both: stronger color layers + slightly less opaque white overlay.
 *
 * This is intentionally a numeric threshold check to prevent accidental regressions.
 */

const fs = require("fs");

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exitCode = 1;
}

function pass(msg) {
  console.log(`✓ ${msg}`);
}

const cssPath = "pricing-widget/src/pricing-widget.css";
const css = fs.readFileSync(cssPath, "utf8");

// Marker enforcement (proof of intentional tuning)
const requiredMarkers = [
  "SS_PRICING_SPEC: LIGHT_MODE_WASHOUT_TUNING_2025_12",
  "SS_PRICING_SPEC: LIGHT_MODE_BG_VIBRANCY_BOOST_2025_12",
];
for (const marker of requiredMarkers) {
  if (!css.includes(marker)) fail(`Missing required marker in ${cssPath}: "${marker}"`);
  else pass(`Found marker: ${marker}`);
}

// Find the light-mode background stack (linear + radial layers)
const bgMatch = css.match(/background:\s*linear-gradient\(135deg,[\s\S]*?\)\s*,\s*radial-gradient\([\s\S]*?\)\s*,\s*radial-gradient\([\s\S]*?\)\s*,\s*radial-gradient\([\s\S]*?\)\s*;/);
if (!bgMatch) {
  fail("Could not find expected light-mode background stack (linear + 3 radial gradients).");
} else {
  pass("Found light-mode background stack.");
}

const bg = bgMatch ? bgMatch[0] : "";

// ---- Extract key alpha values ----
// Blue tint (rgba(0,174,239, a) at 0% and 45%)
const blueMatch = bg.match(/rgba\(0,\s*174,\s*239,\s*(0?\.\d+)\)\s*0%[\s\S]*?rgba\(0,\s*174,\s*239,\s*(0?\.\d+)\)\s*45%/);
if (!blueMatch) fail("Could not extract blue tint alpha values (0% and 45%).");

// Pink tint (rgba(253,55,248, a) at 0% and 45%)
const pinkMatch = bg.match(/rgba\(253,\s*55,\s*248,\s*(0?\.\d+)\)\s*0%[\s\S]*?rgba\(253,\s*55,\s*248,\s*(0?\.\d+)\)\s*45%/);
if (!pinkMatch) fail("Could not extract pink tint alpha values (0% and 45%).");

// White overlay alphas in the linear gradient
const whiteStart = bg.match(/rgba\(255,\s*255,\s*255,\s*(0?\.\d+)\)\s*0%/);
const whiteMid = bg.match(/rgba\(236,\s*245,\s*255,\s*(0?\.\d+)\)\s*45%/);
const whiteEnd = bg.match(/rgba\(214,\s*232,\s*255,\s*(0?\.\d+)\)\s*100%/);

if (!whiteStart || !whiteMid || !whiteEnd) fail("Could not extract linear-gradient white overlay alpha values.");

// ---- Thresholds (tuned for “more vibrant but still premium”) ----
function within(name, value, min, max) {
  if (Number.isNaN(value)) {
    fail(`${name} is NaN`);
    return;
  }
  if (value < min || value > max) fail(`${name}=${value} out of range (${min}–${max})`);
  else pass(`${name}=${value} within range (${min}–${max})`);
}

// Color layers: increase visibility
if (blueMatch) {
  const blueA0 = parseFloat(blueMatch[1]);
  const blueA45 = parseFloat(blueMatch[2]);
  within("Blue tint alpha @0%", blueA0, 0.50, 0.75);
  within("Blue tint alpha @45%", blueA45, 0.28, 0.55);
}

if (pinkMatch) {
  const pinkA0 = parseFloat(pinkMatch[1]);
  const pinkA45 = parseFloat(pinkMatch[2]);
  within("Pink tint alpha @0%", pinkA0, 0.42, 0.70);
  within("Pink tint alpha @45%", pinkA45, 0.24, 0.50);
}

// White overlay: slightly less opaque so color layers show through
if (whiteStart && whiteMid && whiteEnd) {
  const a0 = parseFloat(whiteStart[1]);
  const a45 = parseFloat(whiteMid[1]);
  const a100 = parseFloat(whiteEnd[1]);

  within("White overlay alpha @0%", a0, 0.80, 0.90);
  within("White overlay alpha @45%", a45, 0.74, 0.86);
  within("White overlay alpha @100%", a100, 0.72, 0.84);
}

if (process.exitCode) {
  console.error("\nPricing UI tuning validation failed.");
  process.exit(1);
} else {
  console.log("\nPricing UI tuning validation passed.");
}
